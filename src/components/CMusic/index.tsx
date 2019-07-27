import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import classnames from 'classnames'
import { songType } from '../../constants/commonType'
import './index.scss'
type Props = {
  songInfo: songType,
  isHome?: boolean,
  onUpdatePlayStatus: (object) => any
}

const backgroundAudioManager = Taro.getBackgroundAudioManager()


export default class CMusic extends Component<Props, {}> {

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

  render() {
    const { currentSongInfo, isPlaying } = this.props.songInfo
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
        <AtIcon value={isPlaying ? 'pause' : 'play'} size='30' color='#FFF' className="music__icon" onClick={this.switchPlayStatus.bind(this)}></AtIcon>
      </View>
    )
  }
}
