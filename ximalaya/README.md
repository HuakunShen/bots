# 喜马拉雅下载爬虫

[download-non-vip-playlist.py](./download-non-vip-playlist.py) 可以下载一整个非VIP的playlist。

## VIP

VIP的playlist音频url似乎有一种encoding或者加密，无法拿到下载链接。用浏览器截取media request其实是可以拿到单个文件的url的，下载文件不需要token，cookie。

所以最简单粗暴的方法就是把每个声音点一遍，获取URL。可以通过`selenium-wire`来自动化。这个python包可以截取network，只要用程序把每一个声音点一遍然后从截取的request中filter出m4a的media请求就好了。

另一种方式是试图解密加密过的url。