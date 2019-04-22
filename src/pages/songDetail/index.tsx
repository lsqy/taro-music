import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import classnames from 'classnames'
import { connect } from '@tarojs/redux'
import CLyric from '../../components/CLyric'
import CSlider from '../../components/CSlider'
import {
  getSongInfo, 
  changePlayMode,
  getLikeMusicList,
  likeMusic
} from '../../actions/song'
import './index.scss'

type PageStateProps = {
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
  playMode: string,
  likeMusicList: Array<number>
}

type PageDispatchProps = {
  getSongInfo: (object) => any,
  changePlayMode: (object) => any,
  getLikeMusicList: (object) => any,
  likeMusic: (object) => any,
}


type PageState = {
  userInfo: {
    account: {
      id: number
    }
  },
  isPlaying: boolean,
  lyric: string,
  showLyric: boolean,
  lrc: {
    scroll: boolean,
    nolyric: boolean,
    uncollected: boolean,
    lrclist: Array<{
      lrc_text: string,
      lrc_sec: number
    }>
  },
  lrcIndex: number,
  star: boolean,
  firstEnter: boolean,
  playPercent: number,
  switchStar: boolean // 是否切换过喜欢状态
}

const backgroundAudioManager = Taro.getBackgroundAudioManager()

@connect(({
  song
}) => ({
  currentSongInfo: song.currentSongInfo,
  canPlayList: song.canPlayList,
  currentSongIndex: song.currentSongIndex,
  playMode: song.playMode,
  likeMusicList: song.likeMusicList
}), (dispatch) => ({
  getSongInfo (object) {
    dispatch(getSongInfo(object))
  },
  changePlayMode (object) {
    dispatch(changePlayMode(object))
  },
  getLikeMusicList (object) {
    dispatch(getLikeMusicList(object))
  },
  likeMusic (object) {
    dispatch(likeMusic(object))
  }
}))

class Page extends Component<PageStateProps & PageDispatchProps, PageState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '加载中...'
  }

  constructor (props) {
    super(props)
    this.state = {
      userInfo: Taro.getStorageSync('userInfo'),
      isPlaying: false,
      lyric: '',
      showLyric: false,
      lrc: {
        scroll: false,
        nolyric: false,
        uncollected: false,
        lrclist: []
      },
      lrcIndex: 0,
      star: false,
      firstEnter: true,
      switchStar: false,
      playPercent: 0 
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
    console.log('this.props.currentSongInfo.name', this.props.currentSongInfo.name)
    console.log('nextProps.currentSongInfo.name', nextProps.currentSongInfo.name)
    this.setStar(nextProps.likeMusicList, nextProps.currentSongInfo.id)
    if (this.props.currentSongInfo.name !== nextProps.currentSongInfo.name || this.state.firstEnter) {
      this.setState({
        firstEnter: false
      })
      this.setSongInfo(nextProps.currentSongInfo)
    }
  }

  setSongInfo(songInfo) {
    try {
      const { name, al, url, lrcInfo } = songInfo
      Taro.setNavigationBarTitle({
        title: name
      })
      backgroundAudioManager.title = name
      backgroundAudioManager.coverImgUrl = al.picUrl
      backgroundAudioManager.src = url
      this.setState({
        lrc: lrcInfo,
        isPlaying: true,
        firstEnter: false
      });
    } catch(err) {
      console.log('err', err)
      this.getNextSong()
    }
  }

  componentWillUnmount () { }

  componentWillMount() {
    this.getLikeList()
  }

  getLikeList() {
    try {
      const { id } = this.state.userInfo.account
      this.props.getLikeMusicList({
        id
      })
    } catch (err) {
      console.log(err)
    }
  }

  pauseMusic() {
    backgroundAudioManager.pause()
    this.setState({
      isPlaying: false
    })
  }

  playMusic() {
    backgroundAudioManager.play()
    this.setState({
      isPlaying: true
    })
  }

  componentDidMount() {
    const that = this
    const { id } = that.$router.params
    // const id = 1341964346
    this.props.getSongInfo({
      id
    })
    backgroundAudioManager.onTimeUpdate(() => {
      Taro.getBackgroundAudioPlayerState({
        success(res) {
          if (res.status !== 2) {
            that.updateLrc(res.currentPosition)
            that.updateProgress(res.currentPosition)
          }
        }
      })
    })
    backgroundAudioManager.onPause(() => {
      that.setState({
        isPlaying: false
      })
    })
    backgroundAudioManager.onPlay(() => {
      that.setState({
        isPlaying: true
      })
    })
    backgroundAudioManager.onEnded(() => {
      const { playMode } = this.props
      Taro.eventCenter.trigger('nextSong')
      const routes = Taro.getCurrentPages()
      const currentRoute = routes[routes.length - 1].route
      // console.log('详情', Taro.getCurrentPages())
      if (currentRoute === 'pages/songDetail/index') {
        this.playByMode(playMode)
      }
    })
  }



  updateLrc(currentPosition) {
    const { lrc } = this.state
    let lrcIndex = 0
    if (!lrc.scroll && lrc.lrclist && lrc.lrclist.length > 0) {
      lrc.lrclist.forEach((item, index) => {
        if (item.lrc_sec <= currentPosition) {
          lrcIndex = index
        }
      })
    }
    this.setState({
      lrcIndex
    })
  }

  updateProgress(currentPosition) {
    const { dt } = this.props.currentSongInfo
    this.setState({
      playPercent: Math.floor(currentPosition * 1000 * 100 / dt)
    })
  }

  percentChange(e) {
    // console.log(e)
    const { value } = e.detail
    const { dt } = this.props.currentSongInfo
    let currentPosition = Math.floor((dt / 1000) * value / 100)
    backgroundAudioManager.seek(currentPosition)
    backgroundAudioManager.play()
  }

  percentChanging() {
    backgroundAudioManager.pause()
  }

  // 获取下一首
  getNextSong() {
    const { currentSongIndex, canPlayList, playMode } = this.props
    let nextSongIndex = currentSongIndex + 1
    console.log('歌曲详情index', currentSongIndex)
    if (playMode === 'shuffle') {
      this.getShuffleSong()
      return
    }
    if (currentSongIndex === canPlayList.length - 1) {
      nextSongIndex = 0
    }
    this.props.getSongInfo({
      id: canPlayList[nextSongIndex].id
    })
  }

  setStar(likeList, id) {
    const { switchStar } = this.state
    const flag: boolean = likeList.indexOf(id) !== -1
    this.setState({
      star: flag
    })
    if (switchStar) {
      this.setState({
        switchStar: false
      })
      Taro.showToast({
        title: flag ? '已添加到我喜欢的音乐' : '已取消喜欢',
        icon: 'none',
        duration: 2000
      })
    }
  }

  // 获取上一首
  getPrevSong() {
    const { currentSongIndex, canPlayList, playMode } = this.props
    let prevSongIndex = currentSongIndex - 1
    if (playMode === 'shuffle') {
      this.getShuffleSong()
      return
    }
    if (currentSongIndex === 0) {
      prevSongIndex = canPlayList.length - 1
    }
    this.props.getSongInfo({
      id: canPlayList[prevSongIndex].id
    })
  }

  // 循环播放当前歌曲
  getCurrentSong() {
    const { currentSongInfo } = this.props
    this.setSongInfo(currentSongInfo)
  }

  // 随机播放歌曲
  getShuffleSong() {
    const { canPlayList } = this.props
    let nextSongIndex = Math.floor(Math.random()*(canPlayList.length - 1))
    this.props.getSongInfo({
      id: canPlayList[nextSongIndex].id
    })
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

  componentDidHide () { }

  showLyric() {
    this.setState({
      showLyric: true
    })
  }

  changePlayMode() {
    let { playMode } = this.props
    if (playMode === 'loop') {
      playMode = 'one'
      Taro.showToast({
        title: '单曲循环',
        icon: 'none',
        duration: 2000
      })
    } else if (playMode === 'one') {
      playMode = 'shuffle'
      Taro.showToast({
        title: '随机播放',
        icon: 'none',
        duration: 2000
      })
    } else {
      playMode = 'loop'
      Taro.showToast({
        title: '列表循环',
        icon: 'none',
        duration: 2000
      })
    }
    this.props.changePlayMode({
      playMode
    })
  }

  hiddenLyric() {
    this.setState({
      showLyric: false
    })
  }

  likeMusic() {
    const { star } = this.state
    const { id } = this.props.currentSongInfo
    this.props.likeMusic({
      like: !star,
      id
    })
    this.setState({
      switchStar: true
    })
  }


  render () {
    const { currentSongInfo, playMode } = this.props
    const { isPlaying, showLyric, lrc, lrcIndex, star, playPercent } = this.state
    let playModeImg = require('../../assets/images/song/icn_loop_mode.png')
    if (playMode === 'one') {
      playModeImg = require('../../assets/images/song/icn_one_mode.png')
    } else if (playMode === 'shuffle') {
      playModeImg = require('../../assets/images/song/icn_shuffle_mode.png')
    }
    return (
      <View className='song_container'>
        <Image 
          className='song__bg'
          src={currentSongInfo.al.picUrl}
        />
        <View className={
          classnames({
            song__music: true,
            hidden: showLyric
          })
        }>
          <View className={
            classnames({
              song__music__main: true,
              playing: isPlaying
            })
          }>
            <Image  
            className='song__music__main--before'
            src={require('../../assets/images/aag.png')}
            />
            <View className='song__music__main__cover'> 
              <View className={
                classnames({
                  song__music__main__img: true,
                  'z-pause': !isPlaying,
                  circling: true
                })
              }>
                <Image className='song__music__main__img__cover' src={currentSongInfo.al.picUrl} />
              </View>
            </View>
          </View>
          <View className='song__music__lgour' onClick={this.showLyric.bind(this)}>
            <View className={
              classnames({
                song__music__lgour__cover: true,
                'z-pause': !isPlaying,
                circling: true
              })
            }>
            </View>
          </View>
        </View> 
        <CSlider percent={playPercent} onChange={this.percentChange.bind(this)} onChanging={this.percentChanging.bind(this)} />
        <CLyric lrc={lrc} lrcIndex={lrcIndex} showLyric={showLyric} onTrigger={() => this.hiddenLyric()} />
        <View className='song__bottom'>
          <View className='song__operation'>
            <Image 
              src={playModeImg} 
              className='song__operation__mode'
              onClick={this.changePlayMode.bind(this)}
            />
            <Image 
              src={require('../../assets/images/ajh.png')} 
              className='song__operation__prev'
              onClick={this.getPrevSong.bind(this)}
            />
            {
              isPlaying ? <Image src={require('../../assets/images/ajd.png')} className='song__operation__play' onClick={this.pauseMusic.bind(this)}/> :
              <Image src={require('../../assets/images/ajf.png')} className='song__operation__play' onClick={this.playMusic.bind(this)}/>
            }
            <Image 
              src={require('../../assets/images/ajb.png')} 
              className='song__operation__next'
              onClick={this.getNextSong.bind(this)}
            />
            <Image 
              src={star ? require('../../assets/images/song/play_icn_loved.png') : require('../../assets/images/song/play_icn_love.png')} 
              className='song__operation__like'
              onClick={this.likeMusic.bind(this)}
            />
          </View>
        </View>
      </View>
    )
  }
}

export default Page as ComponentClass
