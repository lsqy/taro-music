import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon, AtFloatLayout } from 'taro-ui'
import classnames from 'classnames'
import { songType } from '../../constants/commonType'
import './index.scss'
type Props = {
  songInfo: songType,
  isHome?: boolean,
  onUpdatePlayStatus: (object) => any
}

type State = {
  isOpened: boolean
}

const backgroundAudioManager = Taro.getBackgroundAudioManager()


export default class CMusic extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      isOpened: false
    }
  }
  goDetail() {
    const { id } = this.props.songInfo.currentSongInfo
    Taro.navigateTo({
      url: `/pages/songDetail/index?id=${id}`
    })
  }

  switchPlayStatus() {
    const { isPlaying } = this.props.songInfo
    if (isPlaying) {
      backgroundAudioManager.pause()
      this.props.onUpdatePlayStatus({
        isPlaying: false
      })
    } else {
      backgroundAudioManager.play()
      this.props.onUpdatePlayStatus({
        isPlaying: true
      })
    }
  }

  showPlayList() {
    this.setState({
      isOpened: true
    })
  }

  closePlayList() {
    this.setState({
      isOpened: false
    })
  }

  playSong(id) {
    Taro.navigateTo({
      url: `/pages/songDetail/index?id=${id}`
    })
  }

  removeSong() {

  }

  render() {
    if (!this.props.songInfo) return
    const { currentSongInfo, isPlaying, canPlayList } = this.props.songInfo
    const { isOpened } = this.state
    if (!currentSongInfo.name) return <View></View>
    return (
      <View className={
        classnames({
          music_components: true,
          isHome: this.props.isHome
        })
      }>
        <Image 
          className={
            classnames({
              music__pic: true,
              'z-pause': false,
              circling: isPlaying
            })
          }
          src={currentSongInfo.al.picUrl}
        />
        <View className="music__info" onClick={this.goDetail.bind(this)}>
          <View className='music__info__name'>
            {currentSongInfo.name}
          </View>
          <View className='music__info__desc'>
            {currentSongInfo.ar[0] ? currentSongInfo.ar[0].name : ''}  - {currentSongInfo.al.name}
          </View>
        </View>
        <View className='music__icon--play'>
          <AtIcon value={isPlaying ? 'pause' : 'play'} size='30' color='#FFF' onClick={this.switchPlayStatus.bind(this)}></AtIcon>
        </View>
        <AtIcon value='playlist' size='30' color='#FFF' className="icon_playlist" onClick={this.showPlayList.bind(this)}></AtIcon>
        <AtFloatLayout isOpened={isOpened} title="播放列表" scrollY onClose={this.closePlayList.bind(this)}>
          <View className='music__playlist'>
            {
              canPlayList.map((item) => <View key={item.id} className={classnames({
                music__playlist__item: true,
                current: item.current
              })}>
              <View className='music__playlist__item__info' onClick={this.playSong.bind(this, item.id)}>
                {`${item.name} - ${item.ar[0] ? item.ar[0].name : ''}`}
              </View>
              <View className='music__playlist__item__close'>
                <AtIcon value='chevron-right' size='16' color='#ccc' />
              </View>
            </View>)
            }
          </View>
        </AtFloatLayout>
      </View>
    )
  }
}
