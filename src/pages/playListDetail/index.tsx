import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import classnames from 'classnames'
import { connect } from '@tarojs/redux'
import CLoading from '../../components/CLoading'
import { getSongInfo, getPlayListDetail } from '../../actions/song'
import './index.scss'

type MusicItem = {
  name: string,
  id: number,
  ar: Array<{
    name: string
  }>,
  al: {
    name: string
  },
  copyright: number
}

type PageStateProps = {
  playListDetailInfo: {
    coverImgUrl: string,
    playCount: number,
    name: string,
    description?: string,
    tags: Array<string | undefined>,
    creator: {
      avatarUrl: string,
      nickname: string
    },
    tracks: Array<MusicItem>
  },
  playListDetailPrivileges: Array<{
    st: number
  }>,
  currentSongInfo: {
    id: number,
    name: string,
    al: {
      picUrl: string
    },
    url: string,
    lrcInfo: any,
    dt: number, // 总时长，ms
    st: number // 是否喜欢
  },
  canPlayList: Array<{
    id: number
  }>,
  currentSongIndex: number,
  playMode: string
}

type PageDispatchProps = {
  getPlayListDetail: (object) => any,
  getSongInfo: (object) => any
}

type PageState = {
}

@connect(({
  song
}) => ({
  playListDetailInfo: song.playListDetailInfo,
  playListDetailPrivileges: song.playListDetailPrivileges,
  currentSongInfo: song.currentSongInfo,
  canPlayList: song.canPlayList,
  currentSongIndex: song.currentSongIndex,
  playMode: song.playMode
}), (dispatch) => ({
  getPlayListDetail (payload) {
    dispatch(getPlayListDetail(payload))
  },
  getSongInfo (object) {
    dispatch(getSongInfo(object))
  }
}))

class Page extends Component<PageDispatchProps & PageStateProps, PageState> {

  config: Config = {
    navigationBarTitleText: '歌单详情'
  }

  constructor (props) {
    super(props)
    this.state = {
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.currentSongInfo.name !== nextProps.currentSongInfo.name) {
      this.setSongInfo(nextProps.currentSongInfo)
    }
  }

  componentWillMount () {
    const { id, name } = this.$router.params
    Taro.setNavigationBarTitle({
      title: name
    })
    this.props.getPlayListDetail({
      id
    })
  }

  setSongInfo(songInfo) {
    try {
      const backgroundAudioManager = Taro.getBackgroundAudioManager()
      const { name, al, url } = songInfo
      backgroundAudioManager.title = name
      backgroundAudioManager.coverImgUrl = al.picUrl
      backgroundAudioManager.src = url
    } catch(err) {
      console.log('err', err)
      this.getNextSong()
    }
  }

  componentDidMount() {
    Taro.eventCenter.on('nextSong', () => {
      const { playMode } = this.props
      this.playByMode(playMode)
    })
  }

   // 获取下一首
  getNextSong() {
    const { currentSongIndex, canPlayList, playMode } = this.props
    let nextSongIndex = currentSongIndex + 1
    // console.log('歌单列表index', currentSongIndex)
    if (playMode === 'shuffle') {
      this.getShuffleSong()
      return
    }
    if (playMode === 'one') {
      this.getCurrentSong()
      return
    }

    if (currentSongIndex === canPlayList.length - 1) {
      nextSongIndex = 0
    }
    this.props.getSongInfo({
      id: canPlayList[nextSongIndex].id
    })
  }

  // 随机播放歌曲
  getShuffleSong() {
    const { canPlayList } = this.props
    let nextSongIndex = Math.floor(Math.random()*(canPlayList.length - 1))
    this.props.getSongInfo({
      id: canPlayList[nextSongIndex].id
    })
  }

  // 循环播放当前歌曲
  getCurrentSong() {
    const { currentSongInfo } = this.props
    this.setSongInfo(currentSongInfo)
  }

  // 根据播放模式进行播放
  playByMode(playMode: string) {
    switch (playMode) {
      case 'one':
        this.getCurrentSong()
        break
      case 'shuffle':
        this.getShuffleSong()
        break
      // 默认按列表顺序播放
      default:
        this.getNextSong()  
    }
  }

  componentDidShow () {
  }

  componentDidHide () { }

  playSong(songId, canPlay) {
    if (canPlay) {
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

  componentWillUnmount() {
    Taro.eventCenter.off('nextSong')
  }

  render () {
    const { playListDetailInfo, playListDetailPrivileges } = this.props
    return (
      <ScrollView 
        className='playList_container'  
        scrollY 
        lowerThreshold={20}>
        <View className='playList__header'>
          <Image 
            className='playList__header__bg'
            src={playListDetailInfo.coverImgUrl}
          />
          <View className='playList__header__cover'>
            <Image 
              className='playList__header__cover__img'
              src={playListDetailInfo.coverImgUrl}
            />
            <Text className='playList__header__cover__desc'>歌单</Text>
            <View className='playList__header__cover__num'>
              <Text className='at-icon at-icon-sound'></Text>
              {
                playListDetailInfo.playCount < 10000 ?
                playListDetailInfo.playCount : 
                `${Number(playListDetailInfo.playCount/10000).toFixed(1)}万`
              }
            </View>
          </View>
          <View className='playList__header__info'>
            <View className='playList__header__info__title'>
            {playListDetailInfo.name}
            </View>
            <View className='playList__header__info__user'>
              <Image 
                className='playList__header__info__user_avatar'
                src={playListDetailInfo.creator.avatarUrl}
              />{playListDetailInfo.creator.nickname}
            </View>
          </View>
        </View>
        <View className='playList__header--more'>
          <View className='playList__header--more__tag'>
              标签：
              {
                playListDetailInfo.tags.map((tag, index) => <Text key={index} className='playList__header--more__tag__item'>{tag}</Text>)
              }
              {
                playListDetailInfo.tags.length === 0 ? '暂无' : ''
              }
          </View>
          <View className='playList__header--more__desc'>
            简介：{playListDetailInfo.description || '暂无'}
          </View>
        </View>
        <View className='playList__content'>
          <View className='playList__content__title'>
              歌曲列表
          </View>
          {
            playListDetailInfo.tracks.length === 0 ? <CLoading /> : ''
          }
          <View 
            className='playList__content__list'
          >
              {
                playListDetailInfo.tracks.map((track, index) => <View className={classnames({
                  playList__content__list__item: true,
                  disabled: playListDetailPrivileges[index].st === -200
                })}
                key={index}
                onClick={this.playSong.bind(this, track.id, playListDetailPrivileges[index].st !== -200)}
                >
                  <Text className='playList__content__list__item__index'>{index+1}</Text>
                  <View className='playList__content__list__item__info'>
                    <View>
                      <View className='playList__content__list__item__info__name'>
                        {track.name}
                      </View>
                      <View className='playList__content__list__item__info__desc'>
                        {track.ar[0] ? track.ar[0].name : ''} - {track.al.name}
                      </View>
                    </View>
                    <View className='at-icon at-icon-play'></View>
                  </View>
                </View>)
              }
          </View>
        </View>
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
