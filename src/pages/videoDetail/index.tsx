import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Video, Text, Image } from '@tarojs/components'
// import CWhiteSpace from '../../components/CWhiteSpace'
import { formatCount } from '../../utils/common'
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
    creator: {
      nickname: string,
      avatarUrl: string
    },
    videoGroup: Array<{
      id: number,
      name: string
    }>
  },
  videoUrl: string
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
        creator: {
          nickname: '',
          avatarUrl: ''
        },
        videoGroup: []
      },
      videoUrl: ''
    }
  }

  componentWillMount() {
    const { id } = this.$router.params
    // const id = "5DCA972C0F5C920F22F91997A931D326"
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

  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {

  }

  componentDidHide () { }


  render () {
    const { videoInfo, videoUrl } = this.state
    return (
      <View className='videoDetail_container'>
        <Video
          src={videoUrl}
          controls={true}
          autoplay={false}
          poster={videoInfo.coverUrl}
          className='videoDetail__play'
          loop={false}
          muted={false}
        />
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
          <View className='videoDetail__play__user'>
            <Image src={videoInfo.creator.avatarUrl} className='videoDetail__play__user__cover'/>
            <Text>{videoInfo.creator.nickname}</Text>
          </View>
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
