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
  UPDATERECENTTAB,
  RESETPLAYLIST
} from '../constants/song'

import { songType } from '../constants/commonType'

const INITIAL_STATE: songType = {
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
  currentSongInfo: {
    id: 0,
    name: '',
    ar: [],
    al: {
      picUrl: '',
      name: ''
    },
    url: '',
    lrcInfo: '',
    dt: 0, // 总时长，ms
    st: 0 // 是否喜欢
  },
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
      let canPlayList = playListDetailInfo.tracks.filter((_, index) => {
        return playListDetailPrivileges[index].st !== -200
      })
      return {
        ...state,
        playListDetailInfo,
        playListDetailPrivileges,
        canPlayList
      }  
    case RESETPLAYLIST:
      return {
        ...state,
        playListDetailInfo: INITIAL_STATE.playListDetailInfo,
        playListDetailPrivileges: [],
        canPlayList: []
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
      state.canPlayList.map((item, index) => {
        item.current = false
        if (currentSongIndex === index) {
          item.current = true
        }
        return item
      })
      return {
        ...state,
        currentSongInfo,
        currentSongIndex,
        canPlayList: state.canPlayList
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
