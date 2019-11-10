import {
  GETDJLISTDETAIL
} from '../constants/dj'
import api from '../services/api'


// 获取电台节目列表详情
export const getDjListDetail = (payload) => {
  const { id } = payload
  return dispatch => {
    api.get('/dj/program/detail', {
      id: id
    }).then((res) => {
      dispatch({
        type: GETDJLISTDETAIL,
        payload: {
          djListDetailInfo: res.data.ids || []
        }
      })
    })
  }
}



