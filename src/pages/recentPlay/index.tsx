import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { AtTabs, AtTabsPane } from 'taro-ui'
import { View, ScrollView } from '@tarojs/components'
import api from '../../services/api'
import { connect } from '@tarojs/redux'
import CLoading from '../../components/CLoading'
import { getSongInfo, updateCanplayList, updateRecentTab } from '../../actions/song'
import { MusicItemType, songType } from '../../constants/commonType'
import { injectPlaySong } from '../../utils/decorators'
import './index.scss'

type PageStateProps = {
  song: songType,
  recentTab: number
}

type PageDispatchProps = {
  getSongInfo: (object) => any,
  updateCanplayList: (object) => any,
  updateRecentTab: (object) => any
}

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

@injectPlaySong()
@connect(({
  song,
  recentTab
}) => ({
  song: song,
  recentTab
}), (dispatch) => ({
  getSongInfo (object) {
    dispatch(getSongInfo(object))
  },
  updateCanplayList (object) {
    dispatch(updateCanplayList(object))
  },
  updateRecentTab (object) {
    dispatch(updateRecentTab(object))
  }
}))
class Page extends Component<PageDispatchProps & PageStateProps, PageState> {

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
      currentTab: props.recentTab || 0
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    const { currentTab } = this.state
    const userId = Taro.getStorageSync('userId')
    api.get('/user/record', {
      uid: userId,
      type: currentTab === 0 ? 1 : 0
    }).then((res) => {
      const dataType = currentTab === 0 ? 'weekData' : 'allData'
      if (res.data && res.data[dataType] && res.data[dataType].length > 0) {
        this.setState({
          list: res.data[dataType]
        })
      }
    })
  }

  componentWillUnmount () { }

  componentDidShow () {
   }

  componentDidHide () { }

  switchTab(val) {
    this.setState({
      currentTab: val,
      list: []
    }, () => {
      this.getData()
    })
  }

  playSong(songId, canPlay) {
    if (canPlay) {
      this.saveData()
      Taro.navigateTo({
        url: `/pages/songDetail/index?id=${songId}`
      })
    } else {
      Taro.showToast({
        title: '暂无版权',
        icon: 'none'
      })
    }
  }

  saveData() {
    const { list, currentTab } = this.state
    this.props.updateCanplayList({
      canPlayList: list
    })
    this.props.updateRecentTab({
      recentTab: currentTab
    })
  }

  render () {
    const { list, currentTab, tabList } = this.state
    return (
      <ScrollView scrollY className='recentPlay_container'>
        <AtTabs current={currentTab} swipeable={false} tabList={tabList} onClick={this.switchTab.bind(this)}>
          <AtTabsPane current={currentTab} index={0} >
            {
              list.length === 0 ? 
                <CLoading /> :
              list.map((item, index) => <View key={index} className='recentPlay__music'>
                <View className='recentPlay__music__info' onClick={this.playSong.bind(this, item.song.id, item.song.st !== -200)}>
                  <View className='recentPlay__music__info__name'>
                  {item.song.name}
                  </View>
                  <View className='recentPlay__music__info__desc'>
                    {item.song.ar[0] ? item.song.ar[0].name : ''} - {item.song.al.name}
                  </View>
                </View>
                <View className='fa fa-ellipsis-v recentPlay__music__icon'></View>
              </View>)
            }     
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            {
              list.length === 0 ? 
                <CLoading /> :
              list.map((item, index) => <View key={index} className='recentPlay__music'>
                <View className='recentPlay__music__info' onClick={this.playSong.bind(this, item.song.id, item.song.st !== -200)}>
                  <View className='recentPlay__music__info__name'>
                  {item.song.name}
                  </View>
                  <View className='recentPlay__music__info__desc'>
                    {item.song.ar[0] ? item.song.ar[0].name : ''} - {item.song.al.name}
                  </View>
                </View>
                <View className='fa fa-ellipsis-v recentPlay__music__icon'></View>
              </View>)
            } 
          </AtTabsPane>
        </AtTabs>
      </ScrollView>
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
