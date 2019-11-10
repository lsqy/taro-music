import { 
  GETDJLISTDETAIL
} from '../constants/dj'

import { djListType } from '../constants/commonType'

const INITIAL_STATE: djListType = {
  djListDetailInfo: {
    name: ''
  },
}

export default function dj (state = INITIAL_STATE, action) {
  switch (action.type) {
    // 获取电台节目列表详情
    case GETDJLISTDETAIL:
      const { djListDetailInfo } = action.payload
      return {
        ...state,
        djListDetailInfo: djListDetailInfo
      } 
    default:
      return state
  }
}
