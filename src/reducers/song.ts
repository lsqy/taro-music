import { GETSONGDETAIL, GETPLAYLISTDETAIL, GETRECOMMENDPLAYLIST, GETRECOMMENDDJ, GETRECOMMENDNEWSONG, GETRECOMMEND } from '../constants/song'

const INITIAL_STATE = {
  // 歌单详情
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
  // 可播放歌曲列表
  canPlayList: [],
  // 歌单详情中歌曲是否有版权播放
  playListDetailPrivileges: [],
  // 推荐歌单
  recommendPlayList: [],
  // 推荐歌单
  recommendDj: [],
  // 推荐新音乐
  recommendNewSong: [],
  // 推荐精彩节目
  recommend: []
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
    default:
      return state
  }
}
