import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { AtTabBar } from 'taro-ui'
import { View, Image, Text } from '@tarojs/components'
import api from '../../services/api'
import './index.scss'


type PageState = {
    userInfo: {
      account: {
        id: number
      },
      profile: {
        avatarUrl: string,
        backgroundUrl: string,
        nickname: string,
        eventCount: number,
        follows: number,
        followeds: number
      }
    },
    userLevel: number,
    current: number
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
    navigationBarTitleText: '我的'
  }

  constructor (props) {
    super(props)
    this.state = {
      userInfo: Taro.getStorageSync('userInfo'),
      userLevel: 0,
      current: 1
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {
    if (!this.state.userInfo) {
      Taro.navigateTo({
        url: '/pages/login/index'
      })
      return
    }
    const { id } = this.state.userInfo.account
    api.get('/user/detail', {
      uid: id
    }).then((res) => {
      this.setState({
        userLevel: res.data.level
      })
    })
    api.get('/user/playlist', {
      uid: id
    }).then((res) => {
      console.log('获取用户歌单', res.data)
    })
  }

  componentDidHide () { }

  
  switchTab (value) {
    if (value !== 0) return
    Taro.navigateTo({
      url: '/pages/index/index'
    })
  }

  render () {
    const { userInfo, userLevel } = this.state
    console.log('userInfo', userInfo)
    return (
      <View className='my_container'>
        <View className='header'>
          <Image src={userInfo.profile.avatarUrl} className='header__img' />
          <View className='header__info'>
            <View className='header__info__name'>
              {userInfo.profile.nickname}
            </View>
            <View>
              <Text className='header__info__level'>LV.{userLevel}</Text>
            </View>
          </View>
        </View>
        <View className='user_count'>
          <View className='user_count__sub'>
            <View className='user_count__sub--num'>
              {userInfo.profile.eventCount}
            </View>
            <View>动态</View>
          </View>
          <View className='user_count__sub'>
            <View className='user_count__sub--num'>
              {userInfo.profile.follows}
            </View>
            <View>关注</View>
          </View>
          <View className='user_count__sub'>
            <View className='user_count__sub--num'>
              {userInfo.profile.followeds}
            </View>
            <View>粉丝</View>
          </View>
        </View>
        <AtTabBar
          fixed
          selectedColor='#d43c33'
          tabList={[
            { title: '发现', iconPrefixClass:'fa', iconType: 'feed'},
            { title: '我的', iconPrefixClass:'fa', iconType: 'music' }
          ]}
          onClick={this.switchTab.bind(this)}
          current={this.state.current}
        />
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
