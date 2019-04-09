export const formatNumber = n => {
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
export const parse_lrc = (lrc_content) => {
  let now_lrc = []; // 声明一个临时数组
  let lrc_row = lrc_content.split("\n"); // 将原始的歌词通过换行符转为数组
  let scroll = true; // 默认scroll初始值为true
  for (let i in lrc_row) {
    if ((lrc_row[i].indexOf(']') === -1) && lrc_row[i]) {
      now_lrc.push({ lrc: lrc_row[i] });
    } else if (lrc_row[i] !== '') {
      var tmp = lrc_row[i].split("]");
      for (let j in tmp) {
        scroll = false
        let tmp2 = tmp[j].substr(1, 8);
        tmp2 = tmp2.split(":");
        let lrc_sec = parseInt(tmp2[0] * 60 + tmp2[1] * 1);
        if (lrc_sec && (lrc_sec > 0)) {
          let lrc = (tmp[tmp.length - 1]).replace(/(^\s*)|(\s*$)/g, "");
          lrc && now_lrc.push({ lrc_sec: lrc_sec, lrc: lrc });
        }
      }
    }
  }
  if (!scroll) {
    now_lrc.sort(function (a, b) {
      return a.lrc_sec - b.lrc_sec;
    });
  }
  return {
    now_lrc: now_lrc,
    scroll: scroll
  };
}