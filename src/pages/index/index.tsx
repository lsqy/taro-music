import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import api from '../../services/api'
import CLoading from '../../components/CLoading'
import { getRecommendPlayList, getRecommendDj } from '../../actions/song'

import './index.scss'

// #region 书写注意
// 
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {
  counter: {
    num: number
  },
  recommendPlayList: Array<{
    name: string,
    picUrl: string,
    playCount: number
  }>,
  recommendDj: Array<{
    name: string,
    picUrl: string
  }>,
}

type PageDispatchProps = {
  getRecommendPlayList: () => any,
  getRecommendDj: () => any
}

type PageOwnProps = {}

type PageState = {
  current: number,
  showLoading: boolean
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ song }) => ({
  recommendPlayList: song.recommendPlayList,
  recommendDj: song.recommendDj
}), (dispatch) => ({
  getRecommendPlayList () {
    dispatch(getRecommendPlayList())
  },
  getRecommendDj () {
    dispatch(getRecommendDj())
  }
}))
class Index extends Component<IProps, PageState> {

    /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
    config: Config = {
    navigationBarTitleText: '网易云音乐'
  }

  constructor (props) {
    super(props)
    this.state = {
      current: 0,
      showLoading: true
    }
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
    this.setState({
      showLoading: false
    })
  }

  componentWillMount() {
    this.getPersonalized()
    this.getNewsong()
    this.getDjprogram()
    this.getRecommend()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  switchTab (value) {
    if (value !== 1) return
    Taro.reLaunch({
      url: '/pages/my/index'
    })
  }

  /**
   * 获取推荐歌单
   */
  getPersonalized() {
    this.props.getRecommendPlayList()
  }

  /**
   * 获取推荐新音乐
   */
  getNewsong() {
    api.get('/personalized/newsong').then((res) => {
      console.log('推荐新音乐', res)
    })
  }

  /**
   * 获取推荐电台
   */
  getDjprogram() {
    this.props.getRecommendDj()
  }

  /**
   * 获取推荐节目
   */
  getRecommend() {
    api.get('/program/recommend').then((res) => {
      console.log('推荐节目', res)
    })
  }

  goDetail(item) {
    Taro.navigateTo({
      url: `/pages/playListDetail/index?id=${item.id}&name=${item.name}`
    })
  }

  render () {
    const { recommendPlayList, recommendDj } = this.props
    const { showLoading } = this.state
    return (
      <View className='index_container'>
        <CLoading fullPage={true} hide={!showLoading} />
        <View className='recommend_playlist'>
          <View className='recommend_playlist__title'>
            推荐歌单
          </View>
          <View className='recommend_playlist__content'>
            {
              recommendPlayList.map((item, index) => <View key={index} className='recommend_playlist__item' onClick={this.goDetail.bind(this, item)}>
                <Image 
                  src={item.picUrl}
                  className='recommend_playlist__item__cover'
                />
                <View className='recommend_playlist__item__cover__num'>
                  <Text className='at-icon at-icon-sound'></Text>
                  {
                    item.playCount < 10000 ?
                    item.playCount : 
                    `${Number(item.playCount/10000).toFixed(0)}万`
                  }
                </View>
                <View className='recommend_playlist__item__title'>{item.name}</View>
              </View>)
            }
          </View>
        </View>
        <View className='recommend_playlist'>
          <View className='recommend_playlist__title'>
            推荐电台
          </View>
          <View className='recommend_playlist__content'>
            {
              recommendDj.map((item, index) => <View key={index} className='recommend_playlist__item' onClick={this.goDetail.bind(this, item)}>
                <Image 
                  src={item.picUrl}
                  className='recommend_playlist__item__cover'
                />
                <View className='recommend_playlist__item__title'>{item.name}</View>
              </View>)
            }
          </View>
        </View>
        <AtTabBar
          fixed
          selectedColor='#d43c33'
          tabList={[
            { title: '发现', iconPrefixClass:'fa', iconType: 'feed'},
            { title: '我的', iconPrefixClass:'fa', iconType: 'music' }
          ]}
          onClick={this.switchTab.bind(this)}
          current={this.state.current}
        />
      </View>
    )
  }
}

export default Index as ComponentClass<IProps, PageState>
