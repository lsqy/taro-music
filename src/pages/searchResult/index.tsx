import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import { AtSearchBar, AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import classnames from 'classnames'
import CLoading from '../../components/CLoading'
import { connect } from '@tarojs/redux'
import CMusic from '../../components/CMusic'
import CWhiteSpace from '../../components/CWhiteSpace'
import { injectPlaySong } from '../../utils/decorators'
import { updateCanplayList, getSongInfo, updatePlayStatus } from '../../actions/song'
import { songType } from '../../constants/commonType'
import { setKeywordInHistory, formatCount, formatNumber } from '../../utils/common'
import api from '../../services/api'
import './index.scss'

type PageStateProps = {
  song: songType,
}

type PageDispatchProps = {
  updateCanplayList: (object) => any,
  getSongInfo: (object) => any,
  updatePlayStatus: (object) => any
}

type IProps = PageStateProps & PageDispatchProps 

type PageState = {
  keywords: string,
  activeTab: number,
  totalInfo: {
    loading: boolean,
    noData: boolean,
    songInfo: { // 单曲
      songs: Array<{
        id: number,
        name: string,
        al: {
          id: number,
          name: string
        },
        ar: Array<{
          name: string
        }>
      }>,
      more: boolean,
      moreText?: string
    },
    videoInfo: { // 视频
      videos: Array<{
        title: string,
        vid: string,
        coverUrl: string,
        creator: Array<{
          userName: string
        }>,
        durationms: number,
        playTime: number
      }>,
      more: boolean,
      moreText: string
    },
    userListInfo: { // 用户
      users: Array<{
        nickname: string,
        userId: number,
        avatarUrl: string,
        gender: number,
        signature: string
      }>,
      more: boolean,
      moreText: string
    },
    djRadioInfo: { // 电台
      djRadios: Array<{
        name: string,
        id: number,
        picUrl: string
      }>,
      more: boolean,
      moreText: string
    },
    playListInfo: { // 歌单
      playLists: Array<{
        name: string,
        id: number,
        coverImgUrl: string,
        trackCount: number,
        playCount: number,
        creator: {
          nickname: string
        }
      }>,
      more: boolean,
      moreText?: string
    },
    albumInfo: { // 专辑
      albums: Array<{
        name: string,
        id: number
      }>,
      more: boolean,
      moreText: string
    },
    artistInfo: { // 歌手
      artists: Array<{
        name: string,
        id: number,
        picUrl: string
      }>,
      more: boolean,
      moreText: string
    },
    sim_query: {
      sim_querys: Array<{
        keyword: string
      }>,
      more: boolean
    }
  },
  tabList: Array<{
    title: string
  }>,
  albumInfo: { // 专辑
    albums: Array<{
      name: string,
      id: number
    }>,
    more: boolean
  },
  artistInfo: { // 歌手
    artists: Array<{
      name: string,
      id: number,
      picUrl: string
    }>,
    more: boolean,
  },
  djRadioInfo: { // 电台
    djRadios: Array<{
      name: string,
      id: number,
      picUrl: string
    }>,
    more: boolean
  },
  playListInfo: { // 歌单
    playLists: Array<{
      name: string,
      id: number,
      coverImgUrl: string,
      trackCount: number,
      playCount: number,
      creator: {
        nickname: string
      }
    }>,
    more: boolean,
    moreText?: string
  },
  videoInfo: { // 视频
    videos: Array<{
      title: string,
      vid: string,
      coverUrl: string,
      creator: Array<{
        userName: string
      }>,
      durationms: number,
      playTime: number
    }>,
    more: boolean,
  },
  userListInfo: { // 用户
    users: Array<{
      nickname: string,
      userId: number,
      avatarUrl: string,
      gender: number,
      signature: string
    }>,
    more: boolean
  },
  songInfo: { // 单曲
    songs: Array<{
      id: number,
      name: string,
      al: {
        id: number,
        name: string
      },
      ar: Array<{
        name: string
      }>
    }>,
    more: boolean
  },
  sim_query: Array<{
    keyword: string,
  }>
}

@injectPlaySong()
@connect(({
  song
}) => ({
  song: song
}), (dispatch) => ({
  updateCanplayList (object) {
    dispatch(updateCanplayList(object))
  },
  getSongInfo (object) {
    dispatch(getSongInfo(object))
  },
  updatePlayStatus (object) {
    dispatch(updatePlayStatus(object))
  }
}))
class Page extends Component<IProps, PageState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '搜索'
  }

  constructor (props) {
    super(props)
    const { keywords } = this.$router.params
    this.state = {
      // keywords: '海阔天空',
      keywords,
      activeTab: 0,
      totalInfo: {
        loading: true,
        noData: false,
        userListInfo: {
          users: [],
          more: false,
          moreText: ''
        },
        videoInfo: {
          videos: [],
          more: false,
          moreText: ''
        },
        playListInfo: {
          playLists: [],
          more: false,
          moreText: ''
        },
        songInfo: {
          songs: [],
          more: false,
          moreText: ''
        },
        albumInfo: {
          albums: [],
          more: false,
          moreText: ''
        },
        djRadioInfo: {
          djRadios: [],
          more: false,
          moreText: ''
        },
        artistInfo: {
          artists: [],
          more: false,
          moreText: ''
        },
        sim_query: {
          sim_querys: [],
          more: false
        }
      },
      tabList: [
        {
          title: '综合'
        },
        {
          title: '单曲'
        },
        {
          title: '歌单'
        },
        {
          title: '视频'
        },
        {
          title: '歌手'
        },
        {
          title: '专辑'
        },
        {
          title: '主播电台'
        },
        {
          title: '用户'
        }
      ],
      userListInfo: {
        users: [],
        more: true,
      },
      videoInfo: {
        videos: [],
        more: true,
      },
      playListInfo: {
        playLists: [],
        more: true,
        moreText: ''
      },
      songInfo: {
        songs: [],
        more: true
      },
      albumInfo: {
        albums: [],
        more: true,
      },
      djRadioInfo: {
        djRadios: [],
        more: true,
      },
      artistInfo: {
        artists: [],
        more: true,
      },
      sim_query: []
    }
  }

  componentWillMount() {
    const { keywords } = this.state
    Taro.setNavigationBarTitle({
      title: `${keywords}的搜索结果`
    })
    this.getResult()
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {
   }

  componentDidHide () { }

  getResult() {
    const { keywords, totalInfo } = this.state
    Taro.setNavigationBarTitle({
      title: `${keywords}的搜索结果`
    })
    this.setState({
      totalInfo: Object.assign(totalInfo, {
        loading: true
      })
    })
    api.get('/search', {
      keywords,
      type: 1018
    }).then((res) => {
      const result = res.data.result
      if (!result.data || !res.data.result) {
        this.setState({
          totalInfo: Object.assign(this.state.totalInfo, {
            loading: false
          })
        })
        return
      }
      if (result) {
        this.setState({
          totalInfo: {
            loading: false,
            albumInfo: result.album,
            artistInfo: result.artist,
            djRadioInfo: result.djRadio,
            playListInfo: result.playList,
            songInfo: result.song,
            userListInfo: result.user,
            videoInfo: result.video,
            sim_query: result.sim_query
          }
        })
        // this.props.updateCanplayList({
        //   canPlayList: res.data.result.songs
        // })
      }
    })
  }

  playSong(songId) {
    api.get('/check/music', {
      id: songId
    }).then((res) => {
      if (res.data.success) {
        Taro.navigateTo({
          url: `/pages/songDetail/index?id=${songId}`
        })
      } else {
        Taro.showToast({
          title: res.data.message,
          icon: 'none'
        })
      }
    })
  }

  goVideoDetail(videoId) {
    api.get('/video/url', {
      id: videoId
    }).then(({ data }) => {
      if (data.urls && data.urls.length) {
        Taro.navigateTo({
          url: `/pages/videoDetail/index?id=${videoId}`
        })
      } else {
        Taro.showToast({
          title: '该视频暂时无法播放',
          icon: 'none'
        })
      }
    })
    
  }

  // 获取单曲列表
  getSongList() {
    const { keywords, songInfo } = this.state
    if (!songInfo.more) return
    api.get('/search', {
      keywords,
      type: 1,
      limit: 30,
      offset: songInfo.songs.length
    }).then(({ data }) => {
      console.log('getSongList=>data', data)
      if (data.result && data.result.songs) {
        let tempSongList = data.result.songs.map((item) => {
          item.al = item.album
          item.ar = item.artists
          return item
        })
        this.setState({
          songInfo: {
            songs: songInfo.songs.concat(tempSongList),
            more: songInfo.songs.concat(data.result.songs).length < data.result.songCount
          }
        })
      }
    })
  }

  // 获取歌单列表
  getPlayList() {
    const { keywords, playListInfo } = this.state
    if (!playListInfo.more) return
    api.get('/search', {
      keywords,
      type: 1000,
      limit: 30,
      offset: playListInfo.playLists.length
    }).then(({ data }) => {
      console.log('getPlayList=>data', data)
      if (data.result && data.result.playlists) {
        this.setState({
          playListInfo: {
            playLists: playListInfo.playLists.concat(data.result.playlists),
            more: playListInfo.playLists.concat(data.result.playlists).length < data.result.playlistCount
          }
        })
      }
    })
  }

  // 获取视频列表
  getVideoList() {
    const { keywords, videoInfo } = this.state
    if (!videoInfo.more) return
    api.get('/search', {
      keywords,
      type: 1014,
      limit: 30,
      offset: videoInfo.videos.length
    }).then(({ data }) => {
      console.log('getVideoList=>data', data)
      if (data.result && data.result.videos) {
        this.setState({
          videoInfo: {
            videos: videoInfo.videos.concat(data.result.videos),
            more: videoInfo.videos.concat(data.result.videos).length < data.result.videoCount
          }
        })
      }
    })
  }

  // 获取歌手列表
  getArtistList() {
    const { keywords, artistInfo } = this.state
    if (!artistInfo.more) return
    api.get('/search', {
      keywords,
      type: 100,
      limit: 30,
      offset: artistInfo.artists.length
    }).then(({ data }) => {
      console.log('getArtistList=>data', data)
      if (data.result && data.result.artists) {
        this.setState({
          artistInfo: {
            artists: artistInfo.artists.concat(data.result.artists),
            more: artistInfo.artists.concat(data.result.artists).length < data.result.artistCount
          }
        })
      }
    })
  }

  // 获取用户列表
  getUserList() {
    const { keywords, userListInfo } = this.state
    if (!userListInfo.more) return
    api.get('/search', {
      keywords,
      type: 1002,
      limit: 30,
      offset: userListInfo.users.length
    }).then(({ data }) => {
      console.log('getUserList=>data', data)
      if (data.result && data.result.userprofiles) {
        this.setState({
          userListInfo: {
            users: userListInfo.users.concat(data.result.userprofiles),
            more: userListInfo.users.concat(data.result.userprofiles).length < data.result.userprofileCount
          }
        })
      }
    })
  }

  goPlayListDetail(item) {
    Taro.navigateTo({
      url: `/pages/playListDetail/index?id=${item.id}&name=${item.name}`
    })
  }

  showMore() {
    Taro.showToast({
      title: '暂未实现，敬请期待',
      icon: 'none'
    })
  }

  searchTextChange(val) {
    this.setState({
      keywords: val
    })
  }

  searchResult() {
    setKeywordInHistory(this.state.keywords)
    this.getResult()
  }

  queryResultBySim(keyword) {
    setKeywordInHistory(keyword)
    this.setState({
      keywords: keyword
    }, () => {
      this.getResult()
    })
  }

  switchTab(activeTab) {
    console.log('activeTab', activeTab)
    if (activeTab !== 0 && activeTab !== 1 && activeTab !== 2  && activeTab !== 3 && activeTab !== 4 && activeTab !== 7) {
      Taro.showToast({
        title: '正在开发，敬请期待',
        icon: 'none'
      })
      return
    }
    switch (activeTab) {
      case 0:
        this.getResult()
        break 
      case 1:
        this.getSongList()
        break
      case 2:
        this.getPlayList()
        break
      case 3:
        this.getVideoList()
        break  
      case 4:
        this.getArtistList()
        break  
      case 7:
        this.getUserList()
        break   
    }
    this.setState({
      activeTab
    })
  }

  formatDuration(ms: number) {
    // @ts-ignore
    let minutes: string = formatNumber(parseInt(ms / 60000))
    // @ts-ignore
    let seconds: string = formatNumber(parseInt((ms / 1000) % 60))
    return `${minutes}:${seconds}`
  }


  render () {
    const { keywords, activeTab, tabList, songInfo, playListInfo, totalInfo, videoInfo, artistInfo, userListInfo } = this.state
    console.log('playListInfo', playListInfo)
    return (
      <View className={
        classnames({
          searchResult_container: true,
          hasMusicBox: !!this.props.song.currentSongInfo.name
        })
      }>
        <CMusic songInfo={ this.props.song } onUpdatePlayStatus={this.props.updatePlayStatus.bind(this)} />
        <AtSearchBar
          actionName='搜一下'
          value={keywords}
          onChange={this.searchTextChange.bind(this)}
          onActionClick={this.searchResult.bind(this)}
          onConfirm={this.searchResult.bind(this)}
          className='search__input'
          fixed={true}
        />
        <View className='search_content'>
          <AtTabs
            current={activeTab}
            scroll
            tabList={tabList}
            onClick={this.switchTab.bind(this)}>
            <AtTabsPane current={activeTab} index={0}>
              {
                totalInfo.loading ? <CLoading /> : 
                <ScrollView scrollY className='search_content__scroll'>
                  <View>
                    <View className='search_content__title'>
                      单曲
                    </View>
                    {
                      totalInfo.songInfo.songs.map((item, index) => (
                        <View key={index} className='searchResult__music'>
                          <View className='searchResult__music__info' onClick={this.playSong.bind(this, item.id)}>
                            <View className='searchResult__music__info__name'>
                            {item.name}
                            </View>
                            <View className='searchResult__music__info__desc'>
                              {`${item.ar[0] ? item.ar[0].name : ''} - ${item.al.name}`}
                            </View>
                          </View>
                          <View className='fa fa-ellipsis-v searchResult__music__icon' onClick={this.showMore.bind(this)}></View>
                        </View>
                      ))
                    }
                    {
                      totalInfo.songInfo.moreText ? <View className='search_content__more' onClick={this.switchTab.bind(this, 1)}>
                        {totalInfo.songInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                      </View>  : ''
                    }
                  </View>
                  <View>
                    <View className='search_content__title'>
                      歌单
                    </View>
                    <View>
                      {
                        totalInfo.playListInfo.playLists.map((item, index) => (
                          <View className='search_content__playList__item' key={index} onClick={this.goPlayListDetail.bind(this, item)}>
                            <View>
                              <Image src={item.coverImgUrl} className='search_content__playList__item__cover'/>
                            </View>
                            <View className='search_content__playList__item__info'>
                              <View className='search_content__playList__item__info__title'>
                                {item.name}
                              </View>
                              <View className='search_content__playList__item__info__desc'>
                                <Text>
                                  {item.trackCount}首音乐
                                </Text>
                                <Text className='search_content__playList__item__info__desc__nickname'>
                                  by {item.creator.nickname}
                                </Text>
                                <Text>
                                  {formatCount(item.playCount)}次
                                </Text>
                              </View>
                            </View>
                          </View>
                        ))
                      }
                      {
                        totalInfo.playListInfo.moreText ? <View className='search_content__more' onClick={this.switchTab.bind(this, 2)}>
                          {totalInfo.playListInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                        </View>  : ''
                      }
                    </View>
                  </View>
                  <View>
                    <View className='search_content__title'>
                      视频
                    </View>
                    <View>
                      {
                        totalInfo.videoInfo.videos.map((item, index) => (
                          <View className='search_content__video__item' key={index} onClick={this.goVideoDetail.bind(this, item.vid)}>
                            <View className='search_content__video__item__cover--wrap'>
                              <View className='search_content__video__item__cover--playtime'>
                                <Text className='at-icon at-icon-play'></Text>
                                <Text>{formatCount(item.playTime)}</Text>
                              </View>
                              <Image src={item.coverUrl} className='search_content__video__item__cover'/>
                            </View>
                            <View className='search_content__video__item__info'>
                              <View className='search_content__video__item__info__title'>
                                {item.title}
                              </View>
                              <View className='search_content__video__item__info__desc'>
                                <Text>{this.formatDuration(item.durationms)},</Text>
                                <Text className='search_content__video__item__info__desc__nickname'>
                                  by {item.creator[0].userName}
                                </Text>
                              </View>
                            </View>
                          </View>
                        ))
                      }
                      {
                        totalInfo.videoInfo.moreText ? <View className='search_content__more' onClick={this.switchTab.bind(this, 3)}>
                          {totalInfo.videoInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                        </View>  : ''
                      }
                    </View>
                  </View>
                  {
                    totalInfo.sim_query.sim_querys.length ? <View>
                      <View className='search_content__title'>
                        相关搜索
                      </View>
                      <View className='search_content__simquery'>
                        {
                          totalInfo.sim_query.sim_querys.map((item, index) => <Text key={index} onClick={this.queryResultBySim.bind(this, item.keyword)} className='search_content__simquery__item'>{item.keyword}</Text>)
                        }
                      </View>
                    </View> : ''
                  }
                  <View>
                    <View className='search_content__title'>
                      歌手
                    </View>
                    <View>
                      {
                        totalInfo.artistInfo.artists.map((item, index) => (
                          <View className='search_content__artist__item' key={index}>
                            <Image src={item.picUrl} className='search_content__artist__item__cover'/>
                            <Text>{item.name}</Text>
                          </View>
                        ))
                      }
                      {
                        totalInfo.artistInfo.moreText ? <View className='search_content__more' onClick={this.switchTab.bind(this, 4)}>
                          {totalInfo.artistInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                        </View>  : ''
                      }
                    </View>                    
                  </View> 
                  <View>
                    <View className='search_content__title'>
                      用户
                    </View>
                    <View>
                      {
                        totalInfo.userListInfo.users.map((item, index) => (
                          <View className='search_content__artist__item' key={index}>
                            <Image src={item.avatarUrl} className='search_content__artist__item__cover'/>
                            <Text>{item.nickname}</Text>
                          </View>
                        ))
                      }
                      {
                        totalInfo.userListInfo.moreText ? <View className='search_content__more' onClick={this.switchTab.bind(this, 7)}>
                          {totalInfo.userListInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                        </View>  : ''
                      }
                    </View>                    
                  </View>                     
                </ScrollView>
              }
            </AtTabsPane>
            <AtTabsPane current={activeTab} index={1}>
              <ScrollView scrollY onScrollToLower={this.getSongList.bind(this)} className='search_content__scroll'>
              {
                songInfo.songs.map((item, index) => (
                  <View key={index} className='searchResult__music'>
                    <View className='searchResult__music__info' onClick={this.playSong.bind(this, item.id)}>
                      <View className='searchResult__music__info__name'>
                      {item.name}
                      </View>
                      <View className='searchResult__music__info__desc'>
                        {`${item.ar[0] ? item.ar[0].name : ''} - ${item.al.name}`}
                      </View>
                    </View>
                    <View className='fa fa-ellipsis-v searchResult__music__icon' onClick={this.showMore.bind(this)}></View>
                  </View>
                ))
              }
              { songInfo.more ? <CLoading /> : ''}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={activeTab} index={2}>
              <ScrollView scrollY onScrollToLower={this.getPlayList.bind(this)} className='search_content__scroll'>
                <CWhiteSpace size='sm' color='#fff'/>
                {
                  playListInfo.playLists.map((item, index) => (
                    <View className='search_content__playList__item' key={index} onClick={this.goPlayListDetail.bind(this, item)}>
                      <View>
                        <Image src={item.coverImgUrl} className='search_content__playList__item__cover'/>
                      </View>
                      <View className='search_content__playList__item__info'>
                        <View className='search_content__playList__item__info__title'>
                          {item.name}
                        </View>
                        <View className='search_content__playList__item__info__desc'>
                          <Text>
                            {item.trackCount}首音乐
                          </Text>
                          <Text className='search_content__playList__item__info__desc__nickname'>
                            by {item.creator.nickname}
                          </Text>
                          <Text>
                            {formatCount(item.playCount)}次
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                }
                { playListInfo.more ? <CLoading /> : ''}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={activeTab} index={3}>
              <ScrollView scrollY onScrollToLower={this.getVideoList.bind(this)} className='search_content__scroll'>
                  <CWhiteSpace size='sm' color='#fff'/>
                  {
                    videoInfo.videos.map((item, index) => (
                      <View className='search_content__video__item' key={index} onClick={this.goVideoDetail.bind(this, item.vid)}>
                        <View className='search_content__video__item__cover--wrap'>
                          <View className='search_content__video__item__cover--playtime'>
                            <Text className='at-icon at-icon-play'></Text>
                            <Text>{formatCount(item.playTime)}</Text>
                          </View>
                          <Image src={item.coverUrl} className='search_content__video__item__cover'/>
                        </View>
                        <View className='search_content__video__item__info'>
                          <View className='search_content__video__item__info__title'>
                            {item.title}
                          </View>
                          <View className='search_content__video__item__info__desc'>
                            <Text>{this.formatDuration(item.durationms)},</Text>
                            <Text className='search_content__video__item__info__desc__nickname'>
                              by {item.creator[0].userName}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))
                  }
                  { videoInfo.more ? <CLoading /> : ''}
                </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={activeTab} index={4}>
              <ScrollView scrollY onScrollToLower={this.getArtistList.bind(this)} className='search_content__scroll'>
                <CWhiteSpace size='sm' color='#fff'/>
                {
                  artistInfo.artists.map((item, index) => (
                    <View className='search_content__artist__item' key={index}>
                      <Image src={item.picUrl} className='search_content__artist__item__cover'/>
                      <Text>{item.name}</Text>
                    </View>
                  ))
                }
                { artistInfo.more ? <CLoading /> : ''}
              </ScrollView>
            </AtTabsPane>
            <AtTabsPane current={activeTab} index={5}>
              <View style='font-size:18px;text-align:center;height:100px;'>标签页六的内容</View>
            </AtTabsPane>
            <AtTabsPane current={activeTab} index={6}>
              <View style='font-size:18px;text-align:center;height:100px;'>标签页七的内容</View>
            </AtTabsPane>
            <AtTabsPane current={activeTab} index={7}>
              <ScrollView scrollY onScrollToLower={this.getUserList.bind(this)} className='search_content__scroll'>
                <CWhiteSpace size='sm' color='#fff'/>
                {
                  userListInfo.users.map((item, index) => (
                    <View className='search_content__artist__item' key={index}>
                      <Image src={item.avatarUrl} className='search_content__artist__item__cover'/>
                      <Text>{item.nickname}</Text>
                    </View>
                  ))
                }
                { userListInfo.more ? <CLoading /> : ''}
              </ScrollView>
            </AtTabsPane>
          </AtTabs>
        </View>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Page as ComponentClass
