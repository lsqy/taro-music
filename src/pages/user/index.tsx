import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
// @ts-ignore
import api from '@/services/api'
import './index.scss'


type PageState = {
}

class Page extends Component<{}, PageState> {

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {
    this.getUserDetail()
  }

  componentDidHide () { }

  getUserDetail() {
    const { id } = this.$router.params
    api.get('/user/detail', {
        uid: id
    }).then((res) => {
        console.log('user/detail==>', res)
    })
  }


  render () {
    return (
      <View className='user_container'>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Page;
