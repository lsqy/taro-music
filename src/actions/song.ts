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

export const getPlayListDetail = (payload) => {
  const { id } = payload
  return dispatch => {
    api.get('/playlist/detail', {
      id
    }).then((res) => {
      dispatch({
        type: GETPLAYLISTDETAIL,
        payload: {
          playListDetailInfo: res.data.playlist,
          privileges: res.data.privileges
        }
      })
    })
  }
}
