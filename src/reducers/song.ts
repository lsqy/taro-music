import { 
  GETSONGDETAIL, 
  GETPLAYLISTDETAIL, 
  GETRECOMMENDPLAYLIST, 
  GETRECOMMENDDJ, 
  GETRECOMMENDNEWSONG, 
  GETRECOMMEND,
  GETSONGINFO,
  CHANGEPLAYMODE,
  GETLIKEMUSICLIST,
  UPDATELIKEMUSICLIST,
  UPDATEPLAYSTATUS,
  UPDATECANPLAYLIST,
  UPDATERECENTTAB
} from '../constants/song'

interface State {
  // 歌单详情
  playListDetailInfo: {
    coverImgUrl: string,
    name: string,
    playCount: number,
    tags: Array<{}>,
    creator: {
      avatarUrl: string,
      nickname: string
    },
    tracks: Array<{}>
  },
  // 可播放歌曲列表
  canPlayList: Array<{
    id: number
  }>,
  // 歌单详情中歌曲是否有版权播放
  playListDetailPrivileges: Array<{}>,
  // 推荐歌单
  recommendPlayList: Array<{}>,
  // 推荐歌单
  recommendDj: Array<{}>,
  // 推荐新音乐
  recommendNewSong: Array<{}>,
  // 推荐精彩节目
  recommend: Array<{}>,
  // 我创建的歌单
  myCreateList: Array<{}>,
  // 我收藏的歌单
  myCollectList: Array<{}>,
  // 当前播放的歌曲id
  currentSongId: string,
  // 当前播放的歌曲详情
  currentSongInfo: {
    id?: number
  },
  // 当前播放的歌曲在播放列表中的索引,默认第一首
  currentSongIndex: number,
  // 播放模式
  playMode: 'loop' | 'one' | 'shuffle',
  // 喜欢列表
  likeMusicList: Array<number>,
  isPlaying: boolean,
  recentTab: number
}

const INITIAL_STATE: State = {
  playListDetailInfo: {
    coverImgUrl: '',
    name: '',
    playCount: 0,
    tags: [],
    creator: {
      avatarUrl: '',
      nickname: ''
    },
    tracks: []
  },
  canPlayList: [],
  playListDetailPrivileges: [],
  recommendPlayList: [],
  recommendDj: [],
  recommendNewSong: [],
  recommend: [],
  myCreateList: [],
  myCollectList: [],
  currentSongId: '',
  currentSongInfo: {},
  currentSongIndex: 0,
  playMode: 'loop',
  likeMusicList: [],
  isPlaying: false,
  recentTab: 0
}

export default function song (state = INITIAL_STATE, action) {
  switch (action.type) {
    // 获取歌曲详情
    case GETSONGDETAIL:
      return {
        ...state
      }
    // 获取歌单详情
    case GETPLAYLISTDETAIL: 
      const { playListDetailInfo, playListDetailPrivileges } = action.payload
      let canPlayList = playListDetailInfo.tracks.filter((item, index) => {
        return playListDetailPrivileges[index].st !== -200
      })
      return {
        ...state,
        playListDetailInfo,
        playListDetailPrivileges,
        canPlayList
      }
    // 获取推荐歌单  
    case GETRECOMMENDPLAYLIST:
      const { recommendPlayList } = action.payload
      return {
        ...state,
        recommendPlayList
      }
    // 获取推荐电台
    case GETRECOMMENDDJ:
      const { recommendDj } = action.payload
      return {
        ...state,
        recommendDj
      }
    // 获取推荐新音乐
    case GETRECOMMENDNEWSONG:
      const { recommendNewSong } = action.payload
      return {
        ...state,
        recommendNewSong
      }
    // 获取推荐精彩节目  
    case GETRECOMMEND:
      const { recommend } = action.payload
      return {
        ...state,
        recommend
      }
    // 获取歌曲详情  
    case GETSONGINFO:  
      const { currentSongInfo } = action.payload
      let currentSongIndex = state.canPlayList.findIndex(item => item.id === currentSongInfo.id)
      return {
        ...state,
        currentSongInfo,
        currentSongIndex
      }
    // 切换播放模式  
    case CHANGEPLAYMODE:
      const { playMode } = action.payload
      return {
        ...state,
        playMode
      }  
    // 获取喜欢列表  
    case GETLIKEMUSICLIST:
      const { likeMusicList } = action.payload
      return {
        ...state,
        likeMusicList
      }  
    // 更新喜欢列表 
    case UPDATELIKEMUSICLIST:
      const { like, id } = action.payload
      let list: Array<number> = []
      if (like) {
        list = state.likeMusicList.concat([id])
      } else {
        state.likeMusicList.forEach((item) => {
          if (item !== id) list.push(item)
        })
      }
      return {
        ...state,
        likeMusicList: list
      } 
    case UPDATEPLAYSTATUS:
      const { isPlaying } = action.payload
      return {
        ...state,
        isPlaying
      }
    case UPDATECANPLAYLIST:
      console.log('action.payload', action.payload)
      currentSongIndex = action.payload.canPlayList.findIndex(item => item.id === action.payload.currentSongId)
      return {
        ...state,
        canPlayList: action.payload.canPlayList,
        currentSongIndex
      } 
    case UPDATERECENTTAB:
      const { recentTab } = action.payload
      return {
        ...state,
        recentTab
      }   
    default:
      return state
  }
}
