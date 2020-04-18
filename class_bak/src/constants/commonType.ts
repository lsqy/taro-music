export type MusicItemType = {
  name: string,
  id: number,
  ar: Array<{
    name: string
  }>,
  al: {
    name: string
  },
  song: {
    id: number
  },
  copyright: number,
  st?: number,
  current?: boolean
}

export type currentSongInfoType = {
  id: number,
  name: string,
  ar: Array<{
    name: string
  }>,
  al: {
    picUrl: string,
    name: string
  },
  url: string,
  lrcInfo: any,
  dt: number, // 总时长，ms
  st: number // 是否喜欢
}

export type playListDetailInfoType = {
  coverImgUrl: string,
  playCount: number,
  name: string,
  description?: string,
  tags: Array<string | undefined>,
  creator: {
    avatarUrl: string,
    nickname: string
  },
  tracks: Array<MusicItemType>
}

export type songType = {
  playListDetailInfo: playListDetailInfoType,
  playListDetailPrivileges: Array<{
    st: number
  }>,
  // 可播放歌曲列表
  canPlayList: Array<MusicItemType>,
  // 是否正在播放
  isPlaying: boolean,
  // 推荐歌单
  recommendPlayList: Array<{}>,
  // 推荐歌单
  recommendDj: Array<{}>,
  // 推荐新音乐
  recommendNewSong: Array<{}>,
  // 推荐精彩节目
  recommend: Array<{}>,
  // 我创建的歌单
  myCreateList: Array<{}>,
  // 我收藏的歌单
  myCollectList: Array<{}>,
  // 当前播放的歌曲id
  currentSongId: string,
  // 当前播放的歌曲详情
  currentSongInfo: currentSongInfoType,
  // 当前播放的歌曲在播放列表中的索引,默认第一首
  currentSongIndex: number,
  // 播放模式
  playMode: 'loop' | 'one' | 'shuffle',
  // 喜欢列表
  likeMusicList: Array<number>,
  recentTab: number
}

export type djListType = {
  djListDetailInfo: {
    name: string
  },
}