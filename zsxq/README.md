# 下载知识星球视频

## 手动

1. 网页开发工具找到m3u8文件
2. 打开下载EXT-X-KEY里AES128密钥链接，用浏览器下载
   1. 获得16byte （128bit）密钥
   2. 替换m3u8文件里的key, `ali_mts_key`
3. m3u8文件里的ts文件链接替换成完整链接，prefix with domain `https://videos.zsxq.com/`
4. 用ffmpeg下载
   1. `ffmpeg -protocol_whitelist file,https,tcp,crypto,data,tls -allowed_extensions ALL -i <m3u8-filename> -c copy -bsf:a aac_adtstoasc output.mp4`

## 自动

m3u8还是需要自己去浏览器里下载，否则就要用selenium-wire或者puppeteer去模拟浏览器下载，这样就太麻烦了。
拿到浏览器里的cookie之后写在代码里，就可以直接下载m3u8里的密钥。
然后用自动脚本修改m3u8文件里的url，再用ffmpeg下载视频就可以了。

之前为了连续下载20多个视频写的代码搞丢了懒得再写了。思路放在这，随时可以1小时写出来。

