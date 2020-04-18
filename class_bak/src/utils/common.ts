/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-29 10:30:27
 * @LastEditTime: 2019-08-29 10:45:25
 * @LastEditors: Please set LastEditors
 */
import Taro from '@tarojs/taro'

Taro.getStorage({
  key: 'keywordsList'
})

export const formatNumber = (n: number | string) : string => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

// 转换歌词字符串为数组
export const parse_lrc = (lrc_content: string) => {
  let now_lrc: Array<{
    lrc_text: string,
    lrc_sec?: number
  }> = []; // 声明一个临时数组
  let lrc_row: Array<string> = lrc_content.split("\n"); // 将原始的歌词通过换行符转为数组
  let scroll = true; // 默认scroll初始值为true
  for (let i in lrc_row) {
    if ((lrc_row[i].indexOf(']') === -1) && lrc_row[i]) {
      now_lrc.push({ lrc_text: lrc_row[i] })
    } else if (lrc_row[i] !== '') {
      let tmp: string[] = lrc_row[i].split("]")
      for (let j in tmp) {
        scroll = false
        let tmp2: string = tmp[j].substr(1, 8)
        let tmp3: any = tmp2.split(":")
        let lrc_sec: any = Number(tmp3[0] * 60 + Number(tmp3[1]))
        if (lrc_sec && (lrc_sec > 0)) {
          let lrc = (tmp[tmp.length - 1]).replace(/(^\s*)|(\s*$)/g, "")
          lrc && now_lrc.push({ lrc_sec: lrc_sec, lrc_text: lrc })
        }
      }
    }
  }
  if (!scroll) {
    now_lrc.sort(function (a: {lrc_sec: number, lrc_text: string}, b: {lrc_sec: number, lrc_text: string}) : number {
      return a.lrc_sec - b.lrc_sec;
    });
  }
  return {
    now_lrc: now_lrc,
    scroll: scroll
  };
}

// 存储搜索关键字
export const setKeywordInHistory = (keyword: string) => {
  const keywordsList: Array<string> = Taro.getStorageSync('keywordsList') || []
  console.log('keywordsList', keywordsList)
  const index = keywordsList.findIndex((item) => item === keyword)
  if (index !== -1) {
    keywordsList.splice(index, 1)
  }
  keywordsList.unshift(keyword)
  Taro.setStorage({ key: 'keywordsList', data: keywordsList })
}

// 获取搜索关键字
export const getKeywordInHistory = () : Array<string> => {
  return Taro.getStorageSync('keywordsList')
}

// 清除搜索关键字
export const clearKeywordInHistory = () => {
  Taro.removeStorageSync('keywordsList')
}

// 格式化播放次数
export const formatCount = (times) => {
  let formatTime: any = 0
  times = times ? Number(times) : 0
  switch (true) {
    case times > 100000000 :
      formatTime = `${(times / 100000000).toFixed(1)}亿`
      break
    case times > 100000 :
        formatTime = `${(times / 10000).toFixed(1)}万`
        break  
    default:
      formatTime = times    
  }
  return formatTime
}

// 格式化时间戳为日期
export const formatTimeStampToTime = (timestamp) => {
  const date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  const year = date.getFullYear();
  const month = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  // const hour = date.getHours() + ':';
  // const minutes = date.getMinutes() + ':';
  // const second = date.getSeconds();
  return `${year}-${month}-${day}`
}