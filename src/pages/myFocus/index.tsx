import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import CLoading from '../../components/CLoading'
import api from '../../services/api'
import './index.scss'

type userInfo = {
  avatarUrl: string,
  nickname: string,
  signature: number,
  gender: number
}

type PageState = {
  userList: Array<userInfo>,
  userId: number,
  hideLoading: boolean
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
    navigationBarTitleText: '我的关注'
  }

  constructor (props) {
    super(props)
    this.state = {
      userId: Taro.getStorageSync('userId'),
      userList: [],
      hideLoading: false
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentWillMount () {
    const { userId } = this.state
    api.get('/user/follows', {
      uid: userId,
      limit: 1000
    }).then((res) => {
      this.setState({
        userList: res.data.follow,
        hideLoading: true
      })
    })
  }

  componentDidShow () {
   }

  componentDidHide () { }


  render () {
    const { hideLoading, userList } = this.state
    return (
      <View className='myFocus_container'>
        <CLoading fullPage={true} hide={hideLoading} />
        <View className='userList'>
          {
            userList.map((item, index) => <View key={index} className='userList__item'>
              <Image 
                src={item.avatarUrl}
                className='userList__item__avatar'
              />
              <View className='userList__item__info'>
                <View className='userList__item__info__name'>{item.nickname}</View>
                <View className='userList__item__info__signature'>{item.signature}</View>
              </View>
            </View>)
          }
        </View>
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

export default Page as ComponentClass
