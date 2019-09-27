import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import CLoading from '../../components/CLoading'
import api from '../../services/api'
import CUserListItem from '../../components/CUserListItem'
import './index.scss'

type userInfo = {
  avatarUrl: string,
  nickname: string,
  signature?: string,
  gender: number,
  userId: number
}

type PageState = {
  userList: Array<userInfo>,
  userId: number,
  hasMore: boolean
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
      hasMore: true
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentWillMount () {
    this.getFollowList()
  }

  getFollowList() {
    const { userId, userList, hasMore } = this.state
    if (!hasMore) return
    api.get('/user/follows', {
      uid: userId,
      limit: 20,
      offset: this.state.userList.length
    }).then((res) => {
      this.setState({
        userList: userList.concat(res.data.follow),
        hasMore: res.data.more
      })
    })
  }

  componentDidShow () {
   }

  componentDidHide () { }

  goUserDetail() {
    Taro.showToast({
      title: '详情页面正在开发中，敬请期待',
      icon: 'none'
    })
    // Taro.navigateTo({
    //   url: `/pages/user/index?id=${id}`
    // })
  }

  render () {
    const { hasMore, userList } = this.state
    return (
      <View className='my_focus_container'>
          <ScrollView scrollY className='userList' onScrollToLower={this.getFollowList.bind(this)}>
            {
              userList.map((item, index) => <CUserListItem userInfo={item} key={index} clickFunc={this.goUserDetail.bind(this)}/>)
            }
            <CLoading hide={!hasMore} />
          </ScrollView>
      </View>
    )
  }
}

export default Page as ComponentClass
