import '@tarojs/async-await'
import Taro, { Component, Config } from '@tarojs/taro'
import { Provider } from '@tarojs/redux'

import AppContainer from './pages/app'

import configStore from './store'

import 'taro-ui/dist/style/index.scss' // 全局引入一次即可
import './app.scss'
import './assets/iconFont/icon.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

const store = configStore()

class App extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    pages: [
      'pages/my/index',
      'pages/videoDetail/index',
      'pages/search/index',
      
      
      
      
      'pages/searchResult/index', 
      
      // 'pages/search/index',
      'pages/index/index',
      'pages/songDetail/index',
      'pages/myFans/index',
      'pages/myFocus/index',
      'pages/myEvents/index',
      'pages/login/index',
      'pages/playListDetail/index',
      'pages/recentPlay/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#d43c33',      
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'white'
    },
    requiredBackgroundModes: ["audio"]
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
