import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import api from '../../services/api'
import './index.scss'


type PageState = {
  userId: number
}

class Page extends Component<{}, PageState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '我的动态'
  }

  constructor (props) {
    super(props)
    this.state = {
      userId: Taro.getStorageSync('userId'),
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount () {
    const { userId } = this.state
    api.get('/user/event', {
      uid: userId
    }).then((res) => {
      console.log('event =>', res)
    })
  }

  componentDidShow () {
   }

  componentDidHide () { }


  render () {
    return (
      <View className='template_container'>
      </View>
    )
  }
}

export default Page as ComponentClass
