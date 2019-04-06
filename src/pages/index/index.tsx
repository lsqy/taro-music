import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import { connect } from '@tarojs/redux'
import api from '../../services/api'
import CLoading from '../../components/CLoading'

import { add, minus, asyncAdd } from '../../actions/counter'

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
  }
}

type PageDispatchProps = {
  add: () => void
  dec: () => void
  asyncAdd: () => any
}

type PageOwnProps = {}

type PageState = {
  current: number,
  recommend_playlist: Array<{
    name: string,
    picUrl: string
  }>
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

interface Index {
  props: IProps;
}

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
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
      recommend_playlist: []
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
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
    Taro.navigateTo({
      url: '/pages/my/index'
    })
  }

  /**
   * 获取推荐歌单
   */
  getPersonalized() {
    api.get('/personalized').then((res) => {
      this.setState({
        recommend_playlist: res.data.result
      })
    })
  }

  /**
   * 获取推荐新音乐
   */
  getNewsong() {
    api.get('/personalized/newsong').then((res) => {
      
    })
  }

  /**
   * 获取推荐电台
   */
  getDjprogram() {
    api.get('/personalized/djprogram').then((res) => {
      
    })
  }

  /**
   * 获取推荐节目
   */
  getRecommend() {
    api.get('/program/recommend').then((res) => {
      
    })
  }

  render () {
    const { recommend_playlist } = this.state
    return (
      <View className='index_container'>
        <CLoading fullPage={true} />
        <View className='recommend_playlist'>
          <View className='recommend_playlist__title'>
            推荐歌单
          </View>
          <View className='recommend_playlist__content'>
            {
              recommend_playlist.map((item, index) => <View key={index} className='recommend_playlist__item'>
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

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Index as ComponentClass<PageOwnProps, PageState>
