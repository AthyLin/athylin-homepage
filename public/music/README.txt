这个文件夹用来放你的音乐文件（MP3）。

1. 把 mp3 文件复制到本文件夹，例如：
      public/music/summer-wind.mp3
      public/music/athy-01.mp3

2. 打开项目根目录的 site.config.ts，在 playlist 里登记：
      { id: "m1", title: "夏夜的风", artist: "歌手名",
        cover: "/covers/c1.svg", src: "/music/summer-wind.mp3", duration: 254 }

   注意：
   - src 是「/music/文件名.mp3」，以斜杠开头，不要写 public
   - duration 是秒数（254 表示 4 分 14 秒），只用于显示与进度条计算
   - 文件名建议用英文、小写、连字符，不要有空格

3. 保存后刷新页面即可播放。
   如果没有配对到音频文件，播放器会进入「演示模式」，只走进度条不出声。

封面图放在 public/covers/ 下，cover 字段写成 "/covers/你的封面.jpg"。
