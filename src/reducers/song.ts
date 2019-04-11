import { GETSONGDETAIL, GETPLAYLISTDETAIL } from '../constants/song'

const INITIAL_STATE = {
  song: {

  },
  playListDetailInfo: {

  },
  
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

      }   
     default:
       return state
  }
}
