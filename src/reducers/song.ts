import { GETSONGDETAIL } from '../constants/song'

const INITIAL_STATE = {
  song: {

  }
}

export default function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case GETSONGDETAIL:
      console.log('action', action)
      return {
        ...state,
        song: {
          name: 'test'
        }
      }
     default:
       return state
  }
}
