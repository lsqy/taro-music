import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { AtTabBar } from 'taro-ui'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from '../../actions/counter'
import { baseurl } from '../../constants/baseurl'

import './index.less'

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
  banner: Array<Object>,
  baseurl: string
}

type IProps = PageStateProps & PageDispatchProps & PageOwnProps

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
    navigationBarTitleText: '发现音乐'
  }

  constructor (props) {
    super(props)
    this.state = {
      current: 0,
      banner: [],
      baseurl: baseurl
    }
  }

  handleClick (value) {
    this.setState({
      current: value
    })
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { 
  }

  async componentDidShow () { 
    const banner = await this.getBannerUrl()
    this.setState({
      banner
    })
  }

  async getBannerUrl() : Promise<Array<Object>> {
    try {
      const { baseurl } = this.state
      const serverData = await Taro.request({
        url: `${baseurl}banner`
      })
      console.log('serverData', serverData)
      if (serverData.data && serverData.data.code === 200) {
        return serverData.data.banners
      } else {
        return []
      }
    } catch(err) {
      console.log('err', err)
      return []
    }
  }

  componentDidHide () { }

  render () {
    const { banner } = this.state
    console.log('banner', banner)
    return (
      <View className='homeContainer'>
        <Swiper
          className='home_banner'
          indicatorColor='#999'
          indicatorActiveColor='#333'
          indicatorDots>
          {
            banner.map((item) => <SwiperItem>
            <Image
              className='home_banner_img'
              src={item.imageUrl}
            />
          </SwiperItem>)
          }
        </Swiper>
        <AtTabBar
          fixed
          tabList={[
            { title: '发现', iconPrefixClass:'fa', iconType: 'feed'},
            { title: '我的', iconPrefixClass:'fa', iconType: 'music' }
          ]}
          onClick={this.handleClick.bind(this)}
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
