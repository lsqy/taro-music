import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Video, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
// import CWhiteSpace from '../../components/CWhiteSpace'
import { formatCount, formatNumber } from '../../utils/common'
import CWhiteSpace from '../../components/CWhiteSpace'
import api from '../../services/api'
import './index.scss'


type PageState = {
  videoInfo: {
    coverUrl: string,
    title: string,
    shareCount: number,
    playTime: number,
    praisedCount: number,
    commentCount: number,
    subscribeCount: number,
    creator: {
      nickname: string,
      avatarUrl: string
    },
    videoGroup: Array<{
      id: number,
      name: string
    }>
  },
  mvInfo: {
    cover: string,
    name: string,
    briefDesc: string,
    desc: string,
    shareCount: number,
    playCount: number,
    likeCount: number,
    commentCount: number,
    subCount: number,
    artists: Array<{
      name: string,
      id: number
    }>,
    avatarUrl: string,
    publishTime: string
  },
  videoUrl: string,
  relatedList: Array<{
    vid: string,
    title: string,
    durationms: number,
    playTime: number,
    coverUrl: string,
    creator: Array<{
      userName: string
    }>
  }>,
  mvRelatedList: Array<{
    id: string,
    name: string,
    duration: number,
    playCount: number,
    cover: string,
    artistName: string
  }>,
  type: any
}

class Page extends Component<{}, PageState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '精彩视频'
  }

  constructor (props) {
    super(props)
    this.state = {
      videoInfo: {
        coverUrl: '',
        title: '',
        shareCount: 0,
        playTime: 0,
        praisedCount: 0,
        commentCount: 0,
        subscribeCount: 0,
        creator: {
          nickname: '',
          avatarUrl: ''
        },
        videoGroup: []
      },
      mvInfo: {
        cover: '',
        name: '',
        briefDesc: '',
        desc: '',
        shareCount: 0,
        playCount: 0,
        likeCount: 0,
        commentCount: 0,
        subCount: 0,
        artists: [],
        publishTime: '',
        avatarUrl: ''
      },
      videoUrl: '',
      relatedList: [],
      mvRelatedList: [],
      type: ''
    }
  }

  componentDidMount() {
    // const id = "5DCA972C0F5C920F22F91997A931D326"
    // const id = 10858662
    const { id, type } = this.$router.params
    this.setState({
      type: type
    })
    this.getDetailByType(id)
  }

  getDetailByType(id) {
    const { type } = this.$router.params
    if (type === 'mv') {
      this.getMvDetail(id)
    } else {
      this.getVideoDetail(id)
    }
  }

  getMvDetail(id) {
    const videoContext = Taro.createVideoContext('myVideo')
    videoContext.pause()
    api.get('/mv/detail', {
      mvid: id
    }).then(({ data }) => {
      console.log('mv', data)
      if (data.data) {
        let mvInfo = data.data
        api.get('/artists', {
          id: data.data.artists[0].id
        }).then(({ data }) => {
          // artist.picUrl
          mvInfo.avatarUrl = data.artist.picUrl
          this.setState({
            mvInfo
          })
        })
      }
    })
    api.get('/mv/url', {
      id
    }).then(({ data }) => {
      console.log('mv-url', data)
      if (data.data && data.data.url) {
        this.setState({
          videoUrl: data.data.url
        })
      }
    })
    api.get('/simi/mv', {
      mvid: id
    }).then(({ data }) => {
      console.log('mv sim', data)
      if (data.mvs && data.mvs.length) {
        this.setState({
          mvRelatedList: data.mvs
        })
      }
    })
    api.get('/comment/mv', {
      id
    }).then(({ data }) => {
      console.log('mv-comment', data)
      if (data.data && data.data.length) {
        this.setState({
          relatedList: data.data
        })
      }
    })
  }

  getVideoDetail(id) {
    const videoContext = Taro.createVideoContext('myVideo')
    videoContext.pause()
    api.get('/video/detail', {
      id
    }).then(({ data }) => {
      console.log('video', data)
      if (data.data) {
        this.setState({
          videoInfo: data.data
        })
      }
    })
    api.get('/video/url', {
      id
    }).then(({ data }) => {
      console.log('video-url', data)
      if (data.urls && data.urls.length) {
        this.setState({
          videoUrl: data.urls[0].url
        })
      }
    })
    api.get('/related/allvideo', {
      id
    }).then(({ data }) => {
      console.log('related', data)
      if (data.data && data.data.length) {
        this.setState({
          relatedList: data.data
        })
      }
    })
    api.get('/comment/video', {
      id
    }).then(({ data }) => {
      console.log('comment', data)
      if (data.data && data.data.length) {
        this.setState({
          relatedList: data.data
        })
      }
    })
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {

  }

  formatDuration(ms: number) {
    // @ts-ignore
    let minutes: string = formatNumber(parseInt(ms / 60000))
    // @ts-ignore
    let seconds: string = formatNumber(parseInt((ms / 1000) % 60))
    return `${minutes}:${seconds}`
  }

  componentDidHide () { }


  render () {
    const { videoInfo, videoUrl, relatedList, mvInfo, mvRelatedList, type } = this.state
    return (
      <View className='videoDetail_container'>
        <Video
          src={videoUrl}
          controls={true}
          autoplay={false}
          poster={type === 'video' ? videoInfo.coverUrl : mvInfo.cover}
          className='videoDetail__play'
          loop={false}
          muted={false}
          id="myVideo"
        />
        {
          type === 'video' ?
          <View className='videoDetail__play__container'>
            <View className='videoDetail__play__title'>
              {videoInfo.title}
            </View>
            <View className='videoDetail__play__desc'>
              <Text className='videoDetail__play__playtime'>{ formatCount(videoInfo.playTime) }次观看</Text> 
              {
                videoInfo.videoGroup.map((videoGroupItem) => <Text className='videoDetail__play__tag' key={videoGroupItem.id}>{videoGroupItem.name}</Text>)
              }
            </View>
            <View className='flex videoDetail__play__numinfo'>
              <View className='flex-item'>
                <AtIcon prefixClass='fa' value='thumbs-o-up' size='24' color='#323232'></AtIcon>
                <View className='videoDetail__play__numinfo__text'>{videoInfo.praisedCount}</View>
              </View>
              <View className='flex-item'>
                <AtIcon value='star' size='24' color='#323232'></AtIcon>
                <View className='videoDetail__play__numinfo__text'>{videoInfo.subscribeCount}</View>
              </View>
              <View className='flex-item'>
                <AtIcon value='message' size='24' color='#323232'></AtIcon>
                <View className='videoDetail__play__numinfo__text'>{videoInfo.commentCount}</View>
              </View>
              <View className='flex-item'>
                <AtIcon value='share' size='24' color='#323232'></AtIcon>
                <View className='videoDetail__play__numinfo__text'>{videoInfo.shareCount}</View>
              </View>
            </View>
            <View className='videoDetail__play__user'>
              <Image src={videoInfo.creator.avatarUrl} className='videoDetail__play__user__cover'/>
              <Text>{videoInfo.creator.nickname}</Text>
            </View>
          </View> :
          <View className='videoDetail__play__container'>
            <View className='videoDetail__play__title'>
              {mvInfo.name}
            </View>
            <View className='videoDetail__play__desc'>
              <Text className='videoDetail__play__playtime'>{ formatCount(mvInfo.playCount) }次观看</Text> 
            </View>
            <View className='videoDetail__play__descinfo'>
              <View>
                发行： {mvInfo.publishTime}
              </View>
              <CWhiteSpace size='xs' color='#ffffff'/>
              <View>
                {mvInfo.briefDesc}
              </View>
              <CWhiteSpace size='xs' color='#ffffff'/>
              <View>
                {mvInfo.desc}
              </View>
            </View>
            <View className='flex videoDetail__play__numinfo'>
              <View className='flex-item'>
                <AtIcon prefixClass='fa' value='thumbs-o-up' size='24' color='#323232'></AtIcon>
                <View className='videoDetail__play__numinfo__text'>{mvInfo.likeCount}</View>
              </View>
              <View className='flex-item'>
                <AtIcon value='star' size='24' color='#323232'></AtIcon>
                <View className='videoDetail__play__numinfo__text'>{mvInfo.subCount}</View>
              </View>
              <View className='flex-item'>
                <AtIcon value='message' size='24' color='#323232'></AtIcon>
                <View className='videoDetail__play__numinfo__text'>{mvInfo.commentCount}</View>
              </View>
              <View className='flex-item'>
                <AtIcon value='share' size='24' color='#323232'></AtIcon>
                <View className='videoDetail__play__numinfo__text'>{mvInfo.shareCount}</View>
              </View>
            </View>
            <View className='videoDetail__play__user'>
              <Image src={mvInfo.avatarUrl} className='videoDetail__play__user__cover'/>
              <Text>{mvInfo.artists[0].name}</Text>
            </View>
          </View>
        }
        <CWhiteSpace size='sm' color='#f8f8f8'/>
        <View className='videoDetail_relation'>
          <View className='videoDetail__title'>
            相关推荐
          </View>
          {
            type === 'video' ?
            <View>
              {
                relatedList.map((item, index) => (
                  <View className='search_content__video__item' key={index} onClick={this.getDetailByType.bind(this, item.vid)}>
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
            </View> :
            <View>
              {
                mvRelatedList.map((item, index) => (
                  <View className='search_content__video__item' key={index} onClick={this.getDetailByType.bind(this, item.id)}>
                    <View className='search_content__video__item__cover--wrap'>
                      <View className='search_content__video__item__cover--playtime'>
                        <Text className='at-icon at-icon-play'></Text>
                        <Text>{formatCount(item.playCount)}</Text>
                      </View>
                      <Image src={item.cover} className='search_content__video__item__cover'/>
                    </View>
                    <View className='search_content__video__item__info'>
                      <View className='search_content__video__item__info__title'>
                        {item.name}
                      </View>
                      <View className='search_content__video__item__info__desc'>
                        <Text>{this.formatDuration(item.duration)},</Text>
                        <Text className='search_content__video__item__info__desc__nickname'>
                          by {item.artistName}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              }
            </View>
          }
 
        </View>
        <CWhiteSpace size='sm' color='#f8f8f8'/>
        {/* <View className='videoDetail_comment'>
          <View className='videoDetail__title'>
            精彩评论
          </View>
        </View>   */}
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
