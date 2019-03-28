import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import api from '../../services/api'
import './index.scss'


type PageState = {
  songInfo: {
    name: string,
    al: {
      picUrl: string
    }
  },
  songUrl: string
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
    navigationBarTitleText: '加载中...'
  }

  constructor (props) {
    super(props)
    this.state = {
      songInfo: {
        name: '',
        al: {
          picUrl: ''
        }
      },
      songUrl: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentWillMount() {
    // const { id } = this.$router.params
    const id = 1336856777
    api.get('/song/detail', {
      ids: id
    }).then((res1) => {
      this.setState({
        songInfo: res1.data.songs[0]
      })
      Taro.setNavigationBarTitle({
        title: res1.data.songs[0].name
      })
      api.get('/song/url', {
        id
      }).then((res) => {
        this.setState({
          songUrl: res.data.data[0].url
        })
        // Taro.playBackgroundAudio({
        //   dataUrl: res.data.data[0].url,
        //   title: res1.data.songs[0].name,
        //   coverImgUrl: res1.data.songs[0].al.picUrl
        // })
      })
    })
    
  }

  componentDidMount() {

  }

  componentDidShow () {

  }

  componentDidHide () { }


  render () {
    const { songInfo } = this.state
    return (
      <View className='song_container'>
        <Image 
          className='song__bg'
          src={songInfo.al.picUrl}
        />
        <View className='song__box'>
          <View className='song__box__main'>
            <View className='song__box__main__cover'> 
              <View className='song__box__main__img a-circling'>
                {/* <Image className='' src={songInfo.al.picUrl} /> */}
              </View>
            </View>
          </View>
          <View className='song__box__lgour'>
            <View className='song__box__lgour__cover a-circling'>
            </View>
          </View>
          <View className='at-icon at-icon-play song__box__play'></View>
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
