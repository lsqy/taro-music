import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtSearchBar, AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import classnames from 'classnames'
import CLoading from '../../components/CLoading'
import { connect } from '@tarojs/redux'
import CMusic from '../../components/CMusic'
import { injectPlaySong } from '../../utils/decorators'
import { updateCanplayList, getSongInfo, updatePlayStatus } from '../../actions/song'
import { songType } from '../../constants/commonType'
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
  songList: Array<{
    id: number,
    name: string,
    album: {
      id: number,
      name: string
    },
    artists: Array<{
      name: string
    }>
  }>,
  tabList: Array<{
    title: string
  }>,
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
    moreText: string
  },
  videoInfo: { // 视频
    videos: Array<{
      name: string,
      id: number,
      picUrl: string
    }>,
    more: boolean,
    moreText: string
  },
  userListInfo: { // 用户
    users: Array<{
      name: string,
      id: number,
      picUrl: string
    }>,
    more: boolean,
    moreText: string
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
    more: boolean,
    moreText: string
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
      keywords,
      songList: [],
      activeTab: 0,
      tabList: [
        {
          title: '综合'
        },
        {
          title: '单曲'
        },
        {
          title: '视频'
        },{
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
      sim_query: []
    }
  }

  componentWillMount() {
    const { keywords } = this.state
    Taro.setNavigationBarTitle({
      title: `${keywords}的搜索结果`
    })
    this.getResult(keywords)
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {
   }

  componentDidHide () { }

  getResult(keywords) {
    api.get('/search', {
      keywords,
      type: 1018
    }).then((res) => {
      console.log('res', res)
      const result = res.data.result
      if (result) {
        if (result.album) {
          this.setState({
            albumInfo: result.album
          })
        }
        if (result.artist) {
          this.setState({
            artistInfo: result.artist
          })
        }
        if (result.djRadio) {
          this.setState({
            djRadioInfo: result.djRadio
          })
        }
        if (result.playList) {
          this.setState({
            playListInfo: result.playList
          })
        }
        if (result.song) {
          this.setState({
            songInfo: result.song
          })
        }
        if (result.user) {
          this.setState({
            userListInfo: result.user
          })
        }
        if (result.video) {
          this.setState({
            videoInfo: result.video
          })
        }
        if (result.sim_query && result.sim_query.sim_querys) {
          this.setState({
            sim_query: result.sim_query.sim_querys
          })
        }

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

  }

  switchTab(activeTab) {
    if (activeTab !== 0) {
      Taro.showToast({
        title: '正在开发，敬请期待',
        icon: 'none'
      })
      return
    }
    this.setState({
      activeTab
    })
  }


  render () {
    const { songList, keywords, activeTab, tabList, songInfo, playListInfo } = this.state
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
                songInfo.songs.length === 0 ? <CLoading /> : 
                <View>
                  <View>
                    <View className='search_content__title'>
                      单曲
                    </View>
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
                    <View className='search_content__more'>
                      {songInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                    </View>
                  </View>
                  <View>
                    <View className='search_content__title'>
                      歌单
                    </View>
                    <View>
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
                                  {item.playCount}次
                                </Text>
                              </View>
                            </View>
                          </View>
                        ))
                      }
                    <View className='search_content__more'>
                      {playListInfo.moreText}<AtIcon value='chevron-right' size='16' color='#ccc'></AtIcon>
                    </View>  
                    </View>
                  </View>
                </View>
              }
            </AtTabsPane>
            <AtTabsPane current={activeTab} index={1}>
              <View style='font-size:18px;text-align:center;height:100px;'>标签页二的内容</View>
            </AtTabsPane>
            <AtTabsPane current={activeTab} index={2}>
              <View style='font-size:18px;text-align:center;height:100px;'>标签页三的内容</View>
            </AtTabsPane>
            <AtTabsPane current={activeTab} index={3}>
              <View style='font-size:18px;text-align:center;height:100px;'>标签页四的内容</View>
            </AtTabsPane>
            <AtTabsPane current={activeTab} index={4}>
              <View style='font-size:18px;text-align:center;height:100px;'>标签页五的内容</View>
            </AtTabsPane>
            <AtTabsPane current={activeTab} index={5}>
              <View style='font-size:18px;text-align:center;height:100px;'>标签页六的内容</View>
            </AtTabsPane>
          </AtTabs>
          {
            songList.map((item, index) => (
              <View key={index} className='searchResult__music'>
                <View className='searchResult__music__info' onClick={this.playSong.bind(this, item.id)}>
                  <View className='searchResult__music__info__name'>
                    {item.name}
                  </View>
                  <View className='searchResult__music__info__desc'>
                    {`${item.artists[0] ? item.artists[0].name : ''} - ${item.album.name}`}
                  </View>
                </View>
                <View className='fa fa-ellipsis-v searchResult__music__icon' onClick={this.showMore.bind(this)}></View>
              </View>
            ))
          }
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
