## taro-music

> 基于`Taro`与网易云音乐api开发，技术栈主要是：`typescript+taro+redux`,目前主要是着重小程序端的展示.

### 快速开始

首先需要在src目录下创建一个config.ts,可以根据自己的需要将其替换成线上地址，接口服务是使用的[NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/)

```
export const baseUrl: string = 'http://localhost:3000'

```

> 在运行本项目前，请先确保已经全局安装了Taro，安装可见[官网指导](https://nervjs.github.io/taro/docs/GETTING-STARTED.html)

```
启动后端接口服务
git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git

cd NeteaseCloudMusicApi

npm i

npm run start

接下来启动前端项目
git clone https://github.com/lsqy/taro-music.git

cd taro-music

npm i

npm run dev:weapp

```

### 功能列表

- [x] 用户登陆
- [x] 退出登陆
- [x] 我的关注列表
- [x] 我的粉丝列表
- [ ] 我的动态列表
- [x] 最近播放列表
- [ ] 我的电台
- [ ] 我的收藏
- [x] 推荐歌单
- [x] 推荐电台
- [x] 推荐电台
- [x] 我创建的歌单列表
- [x] 我收藏的歌单列表
- [x] 共用的歌单详情列表
- [x] 歌曲播放页面
- [x] 歌词滚动
- [x] 歌曲切换播放模式（随机播放/单曲循环/顺序播放）
- [x] 切换上一首/下一首
- [x] 喜欢/取消喜欢某首歌曲
- [ ] 评论列表

### 效果图预览

> 下面简要列出几张效果图

- 登陆页面

<image width="340" src="https://github.com/lsqy/taro-music/raw/master/screenshot/%E7%99%BB%E9%99%86%E9%A1%B5%E9%9D%A2.png"/>

- 我的页面

<image width="340" src="https://github.com/lsqy/taro-music/raw/master/screenshot/我的页面.png"/>

- 推荐歌单

<image width="340" src="https://github.com/lsqy/taro-music/raw/master/screenshot/推荐歌单.png"/>

- 歌单详情

<image width="340" src="https://github.com/lsqy/taro-music/raw/master/screenshot/歌单详情.png"/>

- 歌曲播放

<image width="340" src="https://github.com/lsqy/taro-music/raw/master/screenshot/歌曲播放.png"/>

- 歌词显示

<image width="340" src="https://github.com/lsqy/taro-music/raw/master/screenshot/歌词显示.png"/>

- 最近播放

<image width="340" src="https://github.com/lsqy/taro-music/raw/master/screenshot/最近播放.png"/>

- 关注列表

<image width="340" src="https://github.com/lsqy/taro-music/raw/master/screenshot/关注列表.png"/>

- 粉丝列表

<image width="340" src="https://github.com/lsqy/taro-music/raw/master/screenshot/粉丝列表.png"/>

### 有待完善部分

还有一些功能点以及细节都还有待进一步完善，目前先把大致主要的功能进行了下实现，当然如果发现什么问题，欢迎能够提交`issues`,发现之后我会及时进行更正,感谢大家支持🙏。