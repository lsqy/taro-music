import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import classnames from 'classnames'
import api from '../../services/api'
import './index.scss'

type MusicItem = {
  name: string,
  id: number,
  ar: Array<{
    name: string
  }>,
  al: {
    name: string
  },
  copyright: number
}

type PageState = {
  playListInfo: {
    coverImgUrl: string,
    playCount: number,
    name: string,
    description?: string,
    tags: Array<string | undefined>,
    creator: {
      avatarUrl: string,
      nickname: string
    },
    tracks: Array<MusicItem>
  },
  privileges: Array<{
    st: number
  }>
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
        coverImgUrl: '',
        name: '',
        playCount: 0,
        tags: [],
        creator: {
          avatarUrl: '',
          nickname: ''
        },
        tracks: []
      },
      privileges: []
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
        playListInfo: res.data.playlist,
        privileges: res.data.privileges
      })
    })
  }

  componentDidShow () {
  }

  componentDidHide () { }


  render () {
    const { playListInfo, privileges } = this.state
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
        <View className='playList__header--more'>
          <View className='playList__header--more__tag'>
              标签：
              {
                playListInfo.tags.map((tag, index) => <Text key={index} className='playList__header--more__tag__item'>{tag}</Text>)
              }
              {
                playListInfo.tags.length === 0 ? '暂无' : ''
              }
          </View>
          <View className='playList__header--more__desc'>
            简介：{playListInfo.description || '暂无'}
          </View>
        </View>
        <View className='playList__content'>
          <View className='playList__content__title'>
              歌曲列表
          </View>
          <View className='playList__content__list'>
              {
                playListInfo.tracks.map((track, index) => <View className={classnames({
                  playList__content__list__item: true,
                  disabled: privileges[index].st === -200
                })}>
                  <Text className='playList__content__list__item__index'>{index+1}</Text>
                  <View className='playList__content__list__item__info'>
                    <View>
                      <View className='playList__content__list__item__info__name'>
                        {track.name}
                      </View>
                      <View className='playList__content__list__item__info__desc'>
                        {track.ar[0] ? track.ar[0].name : ''} - {track.al.name}
                      </View>
                    </View>
                    <View className='at-icon at-icon-play'></View>
                  </View>
                </View>)
              }
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
