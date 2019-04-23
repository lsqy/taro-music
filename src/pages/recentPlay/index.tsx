import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { View } from '@tarojs/components'
import api from '../../services/api'
import { MusicItemType } from '../../constants/commonType'
import './index.scss'


type PageState = {
  tabList: Array<{
    title: string
  }>,
  list: Array<{
    playCount: number,
    song: MusicItemType
  }>,
  currentTab: number
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
    navigationBarTitleText: '最近播放'
  }

  constructor (props) {
    super(props)
    this.state = {
      tabList: [{
        title: '最近7天'
      }, {
        title: '全部'
      }],
      list: [],
      currentTab: 0
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillMount() {
    const userId = Taro.getStorageSync('userId')
    api.get('/user/record', {
      uid: userId,
      type: 0
    }).then((res) => {
      console.log('res', res)
    })
  }

  componentWillUnmount () { }

  componentDidShow () {
   }

  componentDidHide () { }

  switchTab(val) {
    this.setState({
      currentTab: val
    })
  }

  render () {
    const { list, currentTab, tabList } = this.state
    return (
      <View className='recentPlay_container'>
        <AtTabs current={currentTab} tabList={tabList} onClick={this.switchTab.bind(this)}>
          <AtTabsPane current={currentTab} index={0} >
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;' >标签页一的内容</View>
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            <View style='padding: 100px 50px;background-color: #FAFBFC;text-align: center;'>标签页二的内容</View>
          </AtTabsPane>
        </AtTabs>
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
