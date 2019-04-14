import { GETSONGDETAIL, GETPLAYLISTDETAIL } from '../constants/song'

const INITIAL_STATE = {
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
  playListDetailPrivileges: []
}

export default function song (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GETSONGDETAIL:
      console.log('action', action)
      return {
        ...state,
        song: {
          name: 'test'
        }
      }
    case GETPLAYLISTDETAIL: 
      return {
        ...state,
        playListDetailInfo: action.payload.playListDetailInfo,
        playListDetailPrivileges: action.payload.playListDetailPrivileges
      }   
     default:
       return state
  }
}
