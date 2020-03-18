import Taro, { useState } from '@tarojs/taro'
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

const backgroundAudioManager = Taro.getBackgroundAudioManager()

const CMusic = (props: Props) => {
  const { currentSongInfo, isPlaying, canPlayList } = props.songInfo
  const [ isOpened, setIsOpened ] = useState(false)
  if (!currentSongInfo.name) return <View></View>
  function goDetail() {
    const { id } = props.songInfo.currentSongInfo
    Taro.navigateTo({
      url: `/pages/songDetail/index?id=${id}`
    })
  }

  function switchPlayStatus() {
    const { isPlaying } = props.songInfo
    if (isPlaying) {
      backgroundAudioManager.pause()
      props.onUpdatePlayStatus({
        isPlaying: false
      })
    } else {
      backgroundAudioManager.play()
      props.onUpdatePlayStatus({
        isPlaying: true
      })
    }
  }

  function playSong(id) {
    Taro.navigateTo({
      url: `/pages/songDetail/index?id=${id}`
    })
  }
  
  return (
    <View className={
      classnames({
        music_components: true,
        isHome: props.isHome
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
      <View className="music__info" onClick={() => goDetail()}>
        <View className='music__info__name'>
          {currentSongInfo.name}
        </View>
        <View className='music__info__desc'>
          {currentSongInfo.ar[0] ? currentSongInfo.ar[0].name : ''}  - {currentSongInfo.al.name}
        </View>
      </View>
      <View className='music__icon--play'>
        <AtIcon value={isPlaying ? 'pause' : 'play'} size='30' color='#FFF' onClick={() => switchPlayStatus()}></AtIcon>
      </View>
      <AtIcon value='playlist' size='30' color='#FFF' className="icon_playlist" onClick={() => setIsOpened(true)}></AtIcon>
      <AtFloatLayout isOpened={isOpened} title="播放列表" scrollY onClose={() => setIsOpened(false)}>
        <View className='music__playlist'>
          {
            canPlayList.map((item) => <View key={item.id} className={classnames({
              music__playlist__item: true,
              current: item.current
            })}>
            <View className='music__playlist__item__info' onClick={() => playSong(item.id)}>
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

CMusic.defaultProps = {
  songInfo: {
    currentSongInfo: {
      name: ''
    }
  }
}

export default CMusic

