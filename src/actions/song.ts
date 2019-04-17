import {
  GETSONGDETAIL,
  GETPLAYLISTDETAIL,
  GETRECOMMENDPLAYLIST,
  GETRECOMMENDDJ,
  GETRECOMMENDNEWSONG
} from '../constants/song'
import api from '../services/api'

export const getSongDetail = (payload) => {
  return {
    type: GETSONGDETAIL,
    payload
  }
}

// 获取歌单详情
export const getPlayListDetail = (payload) => {
  const { id } = payload
  return dispatch => {
    api.get('/playlist/detail', {
      id
    }).then((res) => {
      let playListDetailInfo = res.data.playlist
      playListDetailInfo.tracks = playListDetailInfo.tracks.map((item) => {
        let temp: any = {}
        temp.name = item.name
        temp.id = item.id
        temp.ar = item.ar
        temp.al = item.al
        temp.copyright = item.copyright
        return temp
      })
      dispatch({
        type: GETPLAYLISTDETAIL,
        payload: {
          playListDetailInfo,
          playListDetailPrivileges: res.data.privileges
        }
      })
    })
  }
}

// 获取推荐歌单
export const getRecommendPlayList = () => {
  return dispatch => {
    api.get('/personalized').then((res) => {
      let recommendPlayList = res.data.result
      dispatch({
        type: GETRECOMMENDPLAYLIST,
        payload: {
          recommendPlayList
        }
      })
    })
  }
}

// 获取推荐电台
export const getRecommendDj = () => {
  return dispatch => {
    api.get('/personalized/djprogram').then((res) => {
      let recommendDj = res.data.result
      dispatch({
        type: GETRECOMMENDDJ,
        payload: {
          recommendDj
        }
      })
    })
  }
}

// 获取推荐新音乐
export const getRecommendNewSong = () => {
  return dispatch => {
    api.get('/personalized/newsong').then((res) => {
      let recommendNewSong = res.data.result
      dispatch({
        type: GETRECOMMENDNEWSONG,
        payload: {
          recommendNewSong
        }
      })
    })
  }
}

// 获取推荐精彩节目
export const GETRECOMMEND = () => {
  return dispatch => {
    api.get('/personalized/recommend').then((res) => {
      let recommend = res.data.result
      dispatch({
        type: GETRECOMMEND,
        payload: {
          recommend
        }
      })
    })
  }
}


