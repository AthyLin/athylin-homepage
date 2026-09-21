-- ============================================================
-- 留言板 Supabase 建表脚本
-- 用法：Supabase 控制台 → SQL Editor → 新建查询 → 粘贴整段 → Run
-- ============================================================

-- 1. 留言表
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null default '匿名访客',
  content text not null check (char_length(content) between 1 and 500),
  likes integer not null default 0,
  created_at timestamptz not null default now()
);

-- 2. 按时间倒序查询用的索引
create index if not exists messages_created_at_idx
  on public.messages (created_at desc);

-- 3. 打开行级安全（RLS）
alter table public.messages enable row level security;

-- 4. 只开放「读」：写入全部走服务端 API（service_role 会绕过 RLS），
--    这样即使 anon key 被公开，别人也无法直接往你的留言板灌数据。
drop policy if exists "messages are public readable" on public.messages;
create policy "messages are public readable"
  on public.messages for select
  using (true);

-- 5. 点赞用数据库函数做原子自增，避免「读-改-写」并发丢更新
create or replace function public.like_message(msg_id uuid)
returns public.messages
language sql
security definer
set search_path = public
as $$
  update public.messages
     set likes = likes + 1
   where id = msg_id
  returning *;
$$;

-- 6. 函数只给服务端用，不给匿名用户执行权限
revoke all on function public.like_message(uuid) from public, anon, authenticated;
grant execute on function public.like_message(uuid) to service_role;

-- ============================================================
-- 可选：把现有本地留言导入（把下面几行改成你自己的内容）
-- ============================================================
-- insert into public.messages (name, content, likes) values
--   ('深夜访客', '通过 SQL 导入的第一条留言', 0),
--   ('另一位访客', '你好呀', 3);
