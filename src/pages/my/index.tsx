import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { AtTabBar, AtIcon } from 'taro-ui'
import { View, Image, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import CLoading from '../../components/CLoading'
import api from '../../services/api'
import './index.scss'

type ListItemInfo = {
  coverImgUrl: string,
  name: string,
  trackCount: number,
  playCount: number
}

type PageStateProps = {
  song: {
    name: string
  }
}

type PageDispatchProps = {
}


type PageOwnProps = {}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Page {
  props: IProps;
}

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
    current: number,
    userCreateList: Array<ListItemInfo>,
    userCollectList: Array<ListItemInfo>
}

// interface Page {
//   props: PageStateProps;
// }

@connect(({ song }) => ({
  song
}), () => ({
}))

class Page extends Component<IProps, PageState> {

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
      current: 1,
      userCreateList: [],
      userCollectList: []
    }
  }

  // componentWillReceiveProps (nextProps) {
  //   console.log(this.props, nextProps)
  // }

  componentWillUnmount () { }

  componentDidShow () {
    if (!this.state.userInfo) {
      Taro.navigateTo({
        url: '/pages/login/index'
      })
      return
    }
    this.getSubcount()
    this.getUserDetail()
    this.getPlayList()
  }

  componentDidHide () { }

  getUserDetail() {
    const { id } = this.state.userInfo.account
    api.get('/user/detail', {
      uid: id
    }).then((res) => {
      this.setState({
        userLevel: res.data.level
      })
    })
  }

  getPlayList() {
    const { id } = this.state.userInfo.account
    api.get('/user/playlist', {
      uid: id,
      limit: 300
    }).then((res) => {
      if (res.data.playlist && res.data.playlist.length > 0) {
        this.setState({
          userCreateList: res.data.playlist.filter(item => item.userId === id),
          userCollectList: res.data.playlist.filter(item => item.userId !== id),
        })
      }
    })
  }

  getSubcount() {
    api.get('/user/subcount').then((res) => {
      console.log('res', res)
    })
  }
  
  switchTab (value) {
    if (value !== 0) return
    Taro.reLaunch({
      url: '/pages/index/index'
    })
  }

  jumpPage(name) {
    Taro.navigateTo({
      url: `/pages/${name}/index`
    })
  }

  signOut() {
    Taro.clearStorage()
    Taro.redirectTo({
      url: '/pages/login/index'
    })
  }

  goDetail(item) {
    Taro.navigateTo({
      url: `/pages/playListDetail/index?id=${item.id}&name=${item.name}`
    })
  }

  render () {
    const { userInfo, userLevel, userCreateList, userCollectList } = this.state
    return (
      <View className='my_container'>
        <View className='header'>
          <View className='header__left'>
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
          <AtIcon prefixClass='fa' value='sign-out' size='30' color='#d43c33' className='exit_icon' onClick={this.signOut.bind(this)}></AtIcon>
        </View>
        <View className='user_count'>
          <View className='user_count__sub' onClick={this.jumpPage.bind(this, 'myEvents')}>
            <View className='user_count__sub--num'>
              {userInfo.profile.eventCount}
            </View>
            <View>动态</View>
          </View>
          <View className='user_count__sub' onClick={this.jumpPage.bind(this, 'myFocus')}>
            <View className='user_count__sub--num'>
              {userInfo.profile.follows}
            </View>
            <View>关注</View>
          </View>
          <View className='user_count__sub' onClick={this.jumpPage.bind(this, 'myFans')}>
            <View className='user_count__sub--num'>
              {userInfo.profile.followeds}
            </View>
            <View>粉丝</View>
          </View>
        </View>
        <View className='user_brief'>
          <View className='user_brief__item'>
            <Image 
              className='user_brief__item__img'
              src={require('../../assets/images/my/recent_play.png')}
            />
            <View className='user_brief__item__text'>
              <Text>
                最近播放
              </Text>
              <Text className='at-icon at-icon-chevron-right'></Text>
            </View>
          </View>
          <View className='user_brief__item'>
            <Image 
              className='user_brief__item__img'
              src={require('../../assets/images/my/my_radio.png')}
            />
            <View className='user_brief__item__text'>
              <Text>
                我的电台
              </Text>
              <Text className='at-icon at-icon-chevron-right'></Text>
            </View>
          </View>
          <View className='user_brief__item'>
            <Image 
              className='user_brief__item__img'
              src={require('../../assets/images/my/my_collection_icon.png')}
            />
            <View className='user_brief__item__text'>
              <Text>
                我的收藏
              </Text>
              <Text className='at-icon at-icon-chevron-right'></Text>
            </View>
          </View>
        </View>
        <View className='user_playlist'>
          <View className='user_playlist__title'>
            我创建的歌单<Text className='user_playlist__title__desc'>({userCreateList.length})</Text>
          </View>
          {
            userCreateList.length === 0 ? <CLoading /> : ''
          }
          <View>
            {
              userCreateList.map((item, index) => <View key={index} className='user_playlist__item' onClick={this.goDetail.bind(this, item)}>
                <Image
                  className='user_playlist__item__cover'
                  src={item.coverImgUrl}
                />
                <View className='user_playlist__item__info'>
                  <View className='user_playlist__item__info__name'>{item.name}</View>
                  <View className='user_playlist__item__info__count'>{item.trackCount}首, 播放{item.playCount < 10000 ? item.playCount : `${(item.playCount/10000).toFixed(1)}万`}次</View>
                </View>
              </View>)
            }
          </View>
        </View>
        <View className='user_playlist'>
          <View className='user_playlist__title'>
            我收藏的歌单<Text className='user_playlist__title__desc'>({userCollectList.length})</Text>
          </View>
          {
            userCollectList.length === 0 ? <CLoading /> : ''
          }
          <View>
            {
              userCollectList.map((item, index) => <View key={index} className='user_playlist__item' onClick={this.goDetail.bind(this, item)}>
                <Image
                  className='user_playlist__item__cover'
                  src={item.coverImgUrl}
                />
                <View className='user_playlist__item__info'>
                  <View className='user_playlist__item__info__name'>{item.name}</View>
                  <View className='user_playlist__item__info__count'>{item.trackCount}首, 播放{item.playCount < 10000 ? item.playCount : `${(item.playCount/10000).toFixed(1)}万`}次</View>
                </View>
              </View>)
            }
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

export default Page as ComponentClass<PageOwnProps, PageState>
