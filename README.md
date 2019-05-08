## taro-music

> 基于Taro与网易云音乐api开发，目前主要是着重小程序端的展示

### 用法

首先需要在根目录下创建一个config.ts,可以根据自己的需要将其替换成线上地址，接口服务是使用的[NeteaseCloudMusicApi](https://binaryify.github.io/NeteaseCloudMusicApi/#/)

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
