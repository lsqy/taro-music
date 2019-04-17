import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text, ScrollView } from '@tarojs/components'
import classnames from 'classnames'
import { connect } from '@tarojs/redux'
import CLoading from '../../components/CLoading'
import { getPlayListDetail } from '../../actions/song'
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

type PageStateProps = {
  song: {
    playListDetailInfo: {
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
    playListDetailPrivileges: Array<{
      st: number
    }>
  }
}

type PageDispatchProps = {
  getPlayListDetail: (object) => any
}

type PageState = {
}

@connect(({
  song
}) => ({
  song
}), (dispatch) => ({
  getPlayListDetail (payload) {
    dispatch(getPlayListDetail(payload))
  }
}))

class Page extends Component<PageDispatchProps & PageStateProps, PageState> {

  config: Config = {
    navigationBarTitleText: '歌单详情'
  }

  constructor (props) {
    super(props)
    this.state = {
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
    this.props.getPlayListDetail({
      id
    })
  }

  componentDidShow () {
  }

  componentDidHide () { }

  playSong(songId, canPlay) {
    if (canPlay) {
      Taro.navigateTo({
        url: `/pages/songDetail/index?id=${songId}`
      })
    } else {
      Taro.showToast({
        title: '暂无版权',
        icon: 'none'
      })
    }
  }

  render () {
    const { playListDetailInfo, playListDetailPrivileges } = this.props.song
    return (
      <ScrollView 
        className='playList_container'  
        scrollY 
        lowerThreshold={20}>
        <View className='playList__header'>
          <Image 
            className='playList__header__bg'
            src={playListDetailInfo.coverImgUrl}
          />
          <View className='playList__header__cover'>
            <Image 
              className='playList__header__cover__img'
              src={playListDetailInfo.coverImgUrl}
            />
            <Text className='playList__header__cover__desc'>歌单</Text>
            <View className='playList__header__cover__num'>
              <Text className='at-icon at-icon-sound'></Text>
              {
                playListDetailInfo.playCount < 10000 ?
                playListDetailInfo.playCount : 
                `${Number(playListDetailInfo.playCount/10000).toFixed(1)}万`
              }
            </View>
          </View>
          <View className='playList__header__info'>
            <View className='playList__header__info__title'>
            {playListDetailInfo.name}
            </View>
            <View className='playList__header__info__user'>
              <Image 
                className='playList__header__info__user_avatar'
                src={playListDetailInfo.creator.avatarUrl}
              />{playListDetailInfo.creator.nickname}
            </View>
          </View>
        </View>
        <View className='playList__header--more'>
          <View className='playList__header--more__tag'>
              标签：
              {
                playListDetailInfo.tags.map((tag, index) => <Text key={index} className='playList__header--more__tag__item'>{tag}</Text>)
              }
              {
                playListDetailInfo.tags.length === 0 ? '暂无' : ''
              }
          </View>
          <View className='playList__header--more__desc'>
            简介：{playListDetailInfo.description || '暂无'}
          </View>
        </View>
        <View className='playList__content'>
          <View className='playList__content__title'>
              歌曲列表
          </View>
          {
            playListDetailInfo.tracks.length === 0 ? <CLoading /> : ''
          }
          <View 
            className='playList__content__list'
          >
              {
                playListDetailInfo.tracks.map((track, index) => <View className={classnames({
                  playList__content__list__item: true,
                  disabled: playListDetailPrivileges[index].st === -200
                })}
                key={index}
                onClick={this.playSong.bind(this, track.id, playListDetailPrivileges[index].st !== -200)}
                >
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
      </ScrollView>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Page as ComponentClass<PageDispatchProps, PageState>
