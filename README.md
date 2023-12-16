## taro-music

> 基于`Taro`与网易云音乐 api 开发，技术栈主要是：`typescript+taro+taro-ui+redux+react-hooks`,目前主要是着重小程序端的展示，主要也是借此项目强化下上述几个技术栈的使用，打造一个最佳实践项目，通过这个项目也可以帮助你快速使用`Taro`开发一个属于你自己的小程序，此项目会持续更新，欢迎`watch`和`star`～

<hr/>

[![GitHub stars](https://img.shields.io/github/stars/lsqy/taro-music.svg?style=flat&label=Star)](https://github.com/lsqy/taro-music/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/lsqy/taro-music.svg?style=flat&label=Fork)](https://github.com/lsqy/taro-music/fork)
[![GitHub watchers](https://img.shields.io/github/watchers/lsqy/taro-music.svg?style=flat&label=Watch)](https://github.com/lsqy/taro-music/watchers)
[![GitHub](https://img.shields.io/github/license/lsqy/taro-music)](https://github.com/lsqy/taro-music/blob/master/LICENSE)

### 快速开始

#### 注意事项

**taro3.6.20 已迁移完毕**，目前大多数页面可以正常运行，迁移后性能比之前的`taro2.x`有所提升，还有一些细节有待进一步完善，如需查看 `taro2.x` 版本可自行切换到[feature_taro2.x](https://github.com/lsqy/taro-music/tree/feature_taro2.x)该分支查看

<hr/>

**目前已将`taro`的版本升级到最新版本`3.6.20`,确保你本地的`taro-cli`的版本也是这个版本，可以通过`taro info`查看版本号，如果不是最新的话，可以通过执行`taro update self`(`mac`或者`linux`前面需要加上`sudo`)以及`taro update project`进行`cli`与项目依赖的更新保持一致，否则将会导致项目无法正常运行，了解更多详情可查看[保持 CLI 的版本与各端依赖版本一致](https://taro-docs.jd.com/docs/GETTING-STARTED#%E4%BF%9D%E6%8C%81-cli-%E7%9A%84%E7%89%88%E6%9C%AC%E4%B8%8E%E5%90%84%E7%AB%AF%E4%BE%9D%E8%B5%96%E7%89%88%E6%9C%AC%E4%B8%80%E8%87%B4)**

##### **重要说明**

**推荐使用cnpm来安装依赖**

安装`@tarojs/cli`的时候需要注意加上版本号，也就是需要按照下方说明来看下执行的命令是否正确

```
  如果之前有安装其他版本的@tarojs/cli，需要先全局卸载，执行下方命令,执行完后再执行下方两步
  npm uninstall -g @tarojs/cli
  rm -rf node_modules
  ---------------
  第一步
  npm install -g @tarojs/cli@3.6.20
  or
  cnpm install -g @tarojs/cli@3.6.20
  or
  yarn global add @tarojs/cli@3.6.20

  第二步
  npm install
  or
  cnpm install
  or
  yarn
```

**首先需要在 src 目录下创建一个`config.ts`**,这样可以根据自己的需要将其替换成线上地址，接口服务是使用的[NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/)

```
export const baseUrl: string = 'http://localhost:3000' // 这里配置的这个url是后端服务的请求地址，示例中代表在本地启用的服务端口是3000，如果希望在真机上调试，那么就需要将后端服务部署到一个云主机上

```

> 在运行本项目前，请先确保已经全局安装了 Taro，安装可见[官网指导](https://nervjs.github.io/taro/docs/GETTING-STARTED.html)

```
启动后端接口服务

git clone https://github.com/Binaryify/NeteaseCloudMusicApi.git

cd NeteaseCloudMusicApi

cnpm i

npm run start

接下来启动前端项目

git clone https://github.com/lsqy/taro-music.git

cd taro-music

cnpm i


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
- [x] 评论列表
- [x] 视频播放
- [x] 热搜列表
- [x] 搜索（包含单曲/歌单/视频/歌手/专辑/电台/用户）
- [x] 统一的播放组件，方便进行切换页面后可以随时进入到播放页面
- [x] 搜索功能
- [x] 视频播放
- [x] mv 播放
- [x] 视频与 mv 中的评论列表

### 目录结构简要介绍

> 这里主要介绍下`src`目录，因为开发主要是在这个目录下进行的

```
- src
 - actions // `redux`中的相关异步操作在这里进行
 - assets // 静态资源目录，这里引入了所需的图片资源，以及`fontawesome`字体图标资源
 - components // 封装的项目中可复用的组件，目前只是抽象了`CLoading`(加载效果组件)、`CLyric`(歌词组件)、`CMusic`(正在播放组件)、`CSlide`(滑块组件)、`CTitle`、`CUserListItem`
 - constants // 项目中的常量定义，目前定义了`typescript`的公共定义、`reducers`的名称定义、状态码的定义
 - pages // 项目中的业务页面都在这个目录中
 - reducers // `redux`中的相关同步操作在这里进行
 - services // 可复用的服务可以放在这个目录中，目前只是封装了接口请求的公共服务，可以根据自己项目的需要进行其他服务的扩充
 - store // redux的初始文件
 - utils // 可以复用的工具方法可以放到这个目录当中，目前封装了格式化、歌词解析的相关方法
  - decorators // 抽象的装饰器，主要为了解决在切换页面之后仍然可以继续保持播放状态，因为目前`taro`不支持全局组件
 - app.scss // 全局样式
 - app.tsx // 全局入口文件
 - base.scss // 基础样式
 - config.ts // 项目的全局配置，目前只是配置了`baseUrl`是后端服务的基准请求地址

```

### todo

- 复用的评论列表
- 搜索功能 _已完成部分功能_
- 个人主页支持跳转
- 歌手页面
- `react-hooks`重构部分功能,正在进行中

### 最近更新

- [x] 升级 taro3 完毕

<div align="center">
  <image width="900" src="https://oscimg.oschina.net/oscnet/498fdfc98cc89d72196dded4f54afa29ed4.jpg"/>
</div>

### 效果图预览

> 下面简要列出几张效果图

<div align="center">
  <image width="900" src="https://oscimg.oschina.net/oscnet/f52f4448ce3475f5ecd002958ae1413a3dd.jpg"/>
</div>

<div align="center">
  <image width="900" src="https://oscimg.oschina.net/oscnet/446008d8690a962a105f839c46d7638b89b.jpg"/>
</div>

<div align="center">
  <image width="900" src="https://oscimg.oschina.net/oscnet/38e5dcac4baaca87195e95a115132cb7958.jpg"/>
</div>

### 有待完善部分

还有一些功能点以及细节都还有待进一步完善，目前先把大致主要的功能进行了下实现，当然如果发现什么问题，欢迎能够提交`issues`,发现之后我会及时进行更正,欢迎 `star` 和 `fork`，感谢大家支持 🙏。
