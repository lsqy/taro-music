
import Taro from '@tarojs/taro'
 
/**
 * 装饰器可以自己本身是个函数，或者可以是执行后是一个函数，这样可以传入需要的参数，如果本身是一个函数则使用的时候直接@injectPlaySong，如果想带参数则@injectPlaySong(params)
 * 该装饰器主要是为了解决在离开当前播放页到其他页面后可以继续播放的问题
 */
export function injectPlaySong() {
  return function songDecorator(constructor) {
    return class PlaySong extends constructor {
      componentWillReceiveProps (nextProps) {
        if (this.props.song.currentSongInfo.name !== nextProps.song.currentSongInfo.name) {
          this.setSongInfo(nextProps.song.currentSongInfo)
        }
        return super.componentWillReceiveProps && super.componentWillReceiveProps()
      }

      componentWillMount() {
        Taro.eventCenter.off('nextSong')
        return super.componentWillMount && super.componentWillMount()
      }
    
      componentDidMount() {
        console.log('test @injectPlaySong')
        Taro.eventCenter.on('nextSong', () => {
          const { playMode } = this.props.song
          this.playByMode(playMode)
        })
        return super.componentDidMount && super.componentDidMount()
      }
    
      setSongInfo(songInfo) {
        try {
          const backgroundAudioManager = Taro.getBackgroundAudioManager()
          const { name, al, url } = songInfo
          console.log('url', url)
          // if (!url) {
          //   this.getNextSong() 
          //   return
          // }
          backgroundAudioManager.title = name
          backgroundAudioManager.coverImgUrl = al.picUrl
          backgroundAudioManager.src = url
        } catch(err) {
          console.log('err', err)
          this.getNextSong()
        }
      }
      // 获取下一首
      getNextSong() {
        const { currentSongIndex, canPlayList, playMode } = this.props.song
        let nextSongIndex = currentSongIndex + 1
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
        const { canPlayList } = this.props.song
        let nextSongIndex = Math.floor(Math.random()*(canPlayList.length - 1))
        this.props.getSongInfo({
          id: canPlayList[nextSongIndex].id
        })
      }
    
      // 循环播放当前歌曲
      getCurrentSong() {
        const { currentSongInfo } = this.props.song
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
  
      componentWillUnmount() {
        // Taro.eventCenter.off('nextSong')
        return super.componentWillUnmount && super.componentWillUnmount()
      }
    }
  } as any
}