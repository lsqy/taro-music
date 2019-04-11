import {
  GETSONGDETAIL,
  GETPLAYLISTDETAIL
} from '../constants/song'
import api from '../services/api'

export const getSongDetail = (payload) => {
  return {
    type: GETSONGDETAIL,
    payload
  }
}

export const GETPLAYLISTDETAIL = (payload) => {
  const { id } = payload
  api.get('/playlist/detail', {
    id
  }).then((res) => {
    return {
      playListDetailInfo: res.data.playlist,
      privileges: res.data.privileges
    }
  })
}
// export const minus = () => {
//   return {
//     type: MINUS
//   }
// }

// 异步的action
// export function asyncAdd () {
//   return dispatch => {
//     setTimeout(() => {
//       dispatch(add())
//     }, 2000)
//   }
// }
