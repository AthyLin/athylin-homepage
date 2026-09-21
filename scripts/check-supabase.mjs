/**
 * 留言板云端配置自查脚本（只读，不会写入或修改你的数据）
 *
 * 用法：
 *   npm run doctor
 * 或
 *   node scripts/check-supabase.mjs
 *
 * 会依次检查：依赖是否安装 → 环境变量是否填对 → Supabase 是否可达 →
 * messages 表是否存在 → like_message 函数是否存在 → 3000 端口是否被占用。
 */
import fs from "node:fs";
import net from "node:net";
import path from "node:path";

const root = process.cwd();
const results = [];
const notes = [];

function record(ok, title, detail = "") {
  results.push({ ok, title, detail });
  const mark = ok === true ? "[OK]  " : ok === false ? "[FAIL]" : "[skip]";
  console.log(`${mark} ${title}${detail ? "  ——  " + detail : ""}`);
}

/** 读取 .env.local / .env（Next 的优先级：.env.local 覆盖 .env） */
function loadEnv() {
  const env = {};
  for (const file of [".env", ".env.local"]) {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) continue;
    for (const rawLine of fs.readFileSync(full, "utf8").split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!match) continue;
      env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

function mask(value) {
  if (!value) return "(空)";
  return `${value.slice(0, 14)}…（共 ${value.length} 字符）`;
}

/** 解析 JWT 的 payload，取出 role —— 用来判断你填的是 anon 还是 service_role */
function jwtRole(value) {
  const parts = String(value ?? "").split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
    return { role: payload.role ?? "(无 role 字段)", ref: payload.ref ?? "", iss: payload.iss ?? "" };
  } catch {
    return null;
  }
}

console.log("\n===================== 留言板云端自查 =====================\n");
console.log(`项目目录: ${root}`);
console.log(`Node 版本: ${process.version}\n`);

/* ---------- 1. 依赖 ---------- */
const pkgPath = path.join(root, "package.json");
let declared = false;
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  declared = Boolean(pkg.dependencies?.["@supabase/supabase-js"]);
}
record(declared, "package.json 里声明了 @supabase/supabase-js", declared ? "" : "依赖缺失，先跑 npm install @supabase/supabase-js");

const installed = fs.existsSync(path.join(root, "node_modules", "@supabase", "supabase-js"));
record(
  installed,
  "node_modules 里已安装依赖",
  installed ? "" : "没装依赖，先在项目目录执行 npm install（这是最常见的第一步失败原因）",
);

const nodeModules = fs.existsSync(path.join(root, "node_modules"));
record(nodeModules, "node_modules 目录存在", nodeModules ? "" : "整个依赖都没装");

/* ---------- 2. 环境变量 ---------- */
const envFile = [".env.local", ".env"].find((file) => fs.existsSync(path.join(root, file)));
record(Boolean(envFile), "找到环境变量文件", envFile ? envFile : "把 .env.example 复制成 .env.local 再填值");

const env = loadEnv();
const url = env.SUPABASE_URL;
const key = env.SUPABASE_SERVICE_ROLE_KEY;

record(Boolean(url), "SUPABASE_URL 已填写", mask(url));
record(Boolean(key), "SUPABASE_SERVICE_ROLE_KEY 已填写", mask(key));

const jwt = jwtRole(key);
if (jwt) {
  const isServiceRole = jwt.role === "service_role";
  record(
    isServiceRole,
    `密钥类型是 service_role（解析结果是 ${jwt.role}）`,
    isServiceRole
      ? ""
      : "你填的是 anon 公钥！它受 RLS 限制，写入会被拒绝。请到 Project Settings → API 复制 service_role 密钥（secret key）",
  );
  if (url && jwt.ref && !url.includes(jwt.ref)) {
    notes.push(`密钥属于项目 ${jwt.ref}，但 URL 指向 ${url}，两者不是同一个项目`);
  }
}

if (url && !/^https:\/\/[a-z0-9-]+\.supabase\.(co|in)$/i.test(url)) {
  notes.push(`SUPABASE_URL 格式看起来不对（当前 ${mask(url)}），正常形如 https://abcdefgh.supabase.co，不要带结尾斜杠或 /rest/v1`);
}
if (key && key.length < 100) {
  notes.push("SERVICE_ROLE_KEY 只有 " + key.length + " 个字符，正常 JWT 是 200 字符以上，可能复制成了别的字段");
}

/* ---------- 3. 连到 Supabase 检查表和函数 ---------- */
if (url && key) {
  const base = url.replace(/\/+$/, "");
  const headers = { apikey: key, Authorization: `Bearer ${key}` };

  const call = async (label, url2, init) => {
    try {
      const response = await fetch(url2, { ...init, headers: { ...headers, ...(init?.headers ?? {}) } });
      const text = await response.text();
      return { status: response.status, text };
    } catch (issue) {
      return { status: 0, text: String(issue?.cause?.code ?? issue?.message ?? issue) };
    }
  };

  // 3.1 连通性 + 密钥
  const health = await call("health", `${base}/rest/v1/`);
  if (health.status === 0) {
    record(false, "能连上 Supabase", `网络请求失败：${health.text}。检查 URL 是否写错、本机网络/代理是否拦截`);
  } else if (health.status === 401 && jwt?.role === "service_role") {
    record(false, "密钥有效", "返回 401 Invalid API key，service_role 密钥复制错了或已被轮换");
  } else if (health.status === 401) {
    record(
      null,
      "根路径返回 401（anon 密钥的正常现象）",
      "PostgREST 的 /rest/v1/ 只对特权角色开放，anon 会 401，这本身不代表密钥写错，关键看下面的「密钥类型」和表/函数两项",
    );
  } else {
    record(true, "能连上 Supabase 且密钥有效", `HTTP ${health.status}`);
  }

  // 3.2 messages 表
  const table = await call("table", `${base}/rest/v1/messages?select=id&limit=1`);
  if (table.status === 200) {
    record(true, "messages 表可读", "HTTP 200");
  } else if (table.status === 404) {
    const code = (() => {
      try {
        return (JSON.parse(table.text).code ?? "") + " " + (JSON.parse(table.text).message ?? "");
      } catch {
        return table.text.slice(0, 120);
      }
    })();
    record(false, "messages 表可读", `HTTP 404 —— 表还不存在（${code.trim()}），去 SQL Editor 执行 supabase/messages-schema.sql`);
  } else if (table.status === 401 || table.status === 403) {
    record(false, "messages 表可读", `HTTP ${table.status} —— 密钥无权限或被 RLS 拦住：${table.text.slice(0, 120)}`);
  } else if (table.status === 0) {
    record(false, "messages 表可读", `请求失败：${table.text}`);
  } else {
    record(false, "messages 表可读", `HTTP ${table.status} —— ${table.text.slice(0, 160)}`);
  }

  // 3.3 点赞函数（用不存在的 id 调用，不会修改任何数据）
  const rpc = await call("rpc", `${base}/rest/v1/rpc/like_message`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ msg_id: "00000000-0000-0000-0000-000000000000" }),
  });
  if (rpc.status === 200 || rpc.status === 204) {
    record(true, "like_message 函数可用", `HTTP ${rpc.status}（返回空属正常，因为没有这个 id）`);
  } else if (rpc.status === 404) {
    record(false, "like_message 函数可用", "函数不存在，SQL 脚本第 5 步没执行成功");
  } else {
    record(false, "like_message 函数可用", `HTTP ${rpc.status} —— ${rpc.text.slice(0, 160)}`);
  }

  // 3.4 顺便确认主机名（排查是否复制成了别的项目地址）
  try {
    console.log(`\n      连接目标: ${new URL(base).host}`);
  } catch {
    /* 忽略 */
  }
} else {
  record(null, "跳过 Supabase 连接检查", "环境变量没填全");
}

/* ---------- 4. 开发端口 ---------- */
const portBusy = (port) =>
  new Promise((resolve) => {
    const socket = net.connect({ host: "127.0.0.1", port });
    const done = (value) => {
      socket.destroy();
      resolve(value);
    };
    socket.once("connect", () => done(true));
    socket.once("error", () => done(false));
    socket.setTimeout(1000, () => done(false));
  });

const busy3000 = await portBusy(3000);
record(!busy3000, "3000 端口空闲", busy3000 ? "端口被占用（可能是另一个 dev 实例），启动时注意终端里实际打印的端口号" : "");
if (busy3000) {
  const busy3001 = await portBusy(3001);
  if (!busy3001) notes.push("Next 会自动改用 3001 端口，请看你终端里打印的 Local 地址，别一直开着旧的标签页");
}

/* ---------- 结论 ---------- */
const failed = results.filter((item) => item.ok === false);
console.log("\n===================== 结论 =====================\n");
if (failed.length === 0) {
  console.log("全部检查通过。启动 npm run dev 后打开 /messages，表单下方应显示「存储：Supabase 云端」。");
} else {
  console.log(`有 ${failed.length} 项没通过，按顺序处理：`);
  failed.forEach((item, index) => console.log(`  ${index + 1}. ${item.title} —— ${item.detail}`));
}
if (notes.length > 0) {
  console.log("\n提醒：");
  notes.forEach((note) => console.log(`  - ${note}`));
}
console.log("");
