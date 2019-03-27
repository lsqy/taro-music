import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import api from '../../services/api'
import './index.scss'


type PageState = {
  playListInfo: {
    coverImgUrl: string,
    playCount: number,
    name: string,
    creator: {
      avatarUrl: string,
      nickname: string
    }
  }
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
    navigationBarTitleText: '歌单详情'
  }

  constructor (props) {
    super(props)
    this.state = {
      playListInfo: {
        playCount: 0
      }
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentWillMount () {
    const { id, name } = this.$router.params
    Taro.setNavigationBarTitle({
      title: name
    })
    api.get('/playlist/detail', {
      id
    }).then((res) => {
      this.setState({
        playListInfo: res.data.playlist
      })
    })
  }

  componentDidShow () {
  }

  componentDidHide () { }


  render () {
    const { playListInfo } = this.state
    return (
      <View className='playList_container'>
        <View className='playList__header'>
          <Image 
            className='playList__header__bg'
            src={playListInfo.coverImgUrl}
          />
          <View className='playList__header__cover'>
            <Image 
              className='playList__header__cover__img'
              src={playListInfo.coverImgUrl}
            />
            <Text className='playList__header__cover__desc'>歌单</Text>
            <View className='playList__header__cover__num'>
              <Text className='at-icon at-icon-sound'></Text>
              {
                playListInfo.playCount < 10000 ?
                playListInfo.playCount : 
                `${Number(playListInfo.playCount/10000).toFixed(1)}万`
              }
            </View>
          </View>
          <View className='playList__header__info'>
            <View className='playList__header__info__title'>
            {playListInfo.name}
            </View>
            <View className='playList__header__info__user'>
              <Image 
                className='playList__header__info__user_avatar'
                src={playListInfo.creator.avatarUrl}
              />{playListInfo.creator.nickname}
            </View>
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
