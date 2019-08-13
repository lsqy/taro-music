import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classnames from 'classnames'
import CLoading from '../../components/CLoading'
import { connect } from '@tarojs/redux'
import CMusic from '../../components/CMusic'
import { injectPlaySong } from '../../utils/decorators'
import { updateCanplayList, getSongInfo, updatePlayStatus } from '../../actions/song'
import { songType } from '../../constants/commonType'
import api from '../../services/api'
import './index.scss'

type PageStateProps = {
  song: songType,
}

type PageDispatchProps = {
  updateCanplayList: (object) => any,
  getSongInfo: (object) => any,
  updatePlayStatus: (object) => any
}

type IProps = PageStateProps & PageDispatchProps 

type PageState = {
  keywords: string,
  songList: Array<{
    id: number,
    name: string,
    album: {
      id: number,
      name: string
    },
    artists: Array<{
      name: string
    }>
  }>
}

@injectPlaySong()
@connect(({
  song
}) => ({
  song: song
}), (dispatch) => ({
  updateCanplayList (object) {
    dispatch(updateCanplayList(object))
  },
  getSongInfo (object) {
    dispatch(getSongInfo(object))
  },
  updatePlayStatus (object) {
    dispatch(updatePlayStatus(object))
  }
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
    navigationBarTitleText: '搜索'
  }

  constructor (props) {
    super(props)
    const { keywords } = this.$router.params
    this.state = {
      keywords,
      songList: []
    }
  }

  componentWillMount() {
    const { keywords } = this.state
    Taro.setNavigationBarTitle({
      title: `${keywords}的搜索结果`
    })
    this.getResult(keywords)
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {
   }

  componentDidHide () { }

  getResult(keywords) {
    api.get('/search', {
      keywords,
      type: 1
    }).then((res) => {
      console.log('res', res)
      if (res.data && res.data.result) {
        this.setState({
          songList: res.data.result.songs
        })
        res.data.result.songs = res.data.result.songs.map((item) => {
          item.ar = item.artists
          return item
        })
        this.props.updateCanplayList({
          canPlayList: res.data.result.songs
        })
      }
    })
  }

  playSong(songId) {
    api.get('/check/music', {
      id: songId
    }).then((res) => {
      if (res.data.success) {
        Taro.navigateTo({
          url: `/pages/songDetail/index?id=${songId}`
        })
      } else {
        Taro.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  }

  showMore() {
    Taro.showToast({
      title: '暂未实现，敬请期待',
      icon: 'none'
    })
  }


  render () {
    const { songList } = this.state
    return (
      <View className={
        classnames({
          seaechResult_container: true,
          hasMusicBox: !!this.props.song.currentSongInfo.name
        })
      }>
        <CMusic songInfo={ this.props.song } onUpdatePlayStatus={this.props.updatePlayStatus.bind(this)} />
        <View>
          {
            songList.map((item, index) => (
              <View key={index} className='seaechResult__music'>
                <View className='seaechResult__music__info' onClick={this.playSong.bind(this, item.id)}>
                  <View className='seaechResult__music__info__name'>
                  {item.name}
                  </View>
                  <View className='seaechResult__music__info__desc'>
                    {`${item.artists[0] ? item.artists[0].name : ''} - ${item.album.name}`}
                  </View>
                </View>
                <View className='fa fa-ellipsis-v seaechResult__music__icon' onClick={this.showMore.bind(this)}></View>
              </View>
            ))
          }
        </View>
        {
          songList.length === 0 ? <CLoading /> : ''
        }
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
