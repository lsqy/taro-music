import {
  GETSONGDETAIL
} from '../constants/song'

export const getSongDetail = (payload) => {
  return {
    type: GETSONGDETAIL,
    payload
  }
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
