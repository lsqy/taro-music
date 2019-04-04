import { ComponentClass } from 'react'
import Taro, { Component, Config } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtIcon, AtButton, AtToast } from 'taro-ui'
import CTitle from '../../components/CTitle'
import api from '../../services/api'
import './index.scss'


type PageState = {
    phone: string,
    password: string,
    showLoading: boolean,
    showTip: boolean,
    tip: string
}

type InputType = 'phone' | 'password'

class Login extends Component<{}, PageState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '登录'
  }

  constructor (props) {
    super(props)
    this.state = {
        phone: '',
        password: '',
        showLoading: false,
        showTip: false,
        tip: ''
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () {
   }

  componentDidHide () { }

  login() {
      const { phone, password } = this.state
      if (!phone) {
        this.setState({
            showTip: true,
            tip: '请输入手机号'
        })
        return
      }
      if (!password) {
        this.setState({
            showTip: true,
            tip: '请输入密码'
        })
        return
      }
      this.setState({
          showLoading: true
      })
      api.get('/login/cellphone', {
          phone,
          password
      }).then((res) => {
          const { code } = res.data
          let tip = '登录成功'
          if (code !== 200) {
            tip = res.data.msg || '登录失败'
          }
          this.setState({
            showLoading: false,
            showTip: true,
            tip
          })
          if (code === 200) {
            Taro.setStorageSync('userInfo', res.data)
            Taro.setStorageSync('userId', res.data.account.id)
            Taro.setStorageSync('cookie', res.cookie)
            Taro.navigateTo({
              url: '/pages/index/index'
            })
          }
      })
  }

  handleChange (type: InputType, event) {
    const { value } = event.detail
    if (type === 'phone') {
        this.setState({
            phone: value
        })
    } else {
        this.setState({
            password: value
        })
    }
  }


  render () {
    const { showLoading, tip, showTip } = this.state
    return (
      <View className='login_container'>
        <CTitle isFixed={false} />
        <View className='login_content'>
            <View className='login_content__item'>
                <AtIcon value='iphone' size='24' color='#ccc'></AtIcon>
                <Input type='number' placeholder='手机号' className='login_content__input' onInput={ (e) : void => {this.handleChange('phone', e)} } />
            </View>
            <View className='login_content__item'>
                <AtIcon value='lock' size='24' color='#ccc'></AtIcon>
                <Input type='text' password placeholder='密码' className='login_content__input' onInput={ (e) : void => {this.handleChange('password', e)} } />
            </View>
            <AtButton className='login_content__btn' onClick={this.login.bind(this)}>登录</AtButton>
        </View>
        <AtToast isOpened={showLoading} text='登录中' status='loading' hasMask duration={30000000}></AtToast>
        <AtToast isOpened={showTip} text={tip} hasMask duration={2000}></AtToast>
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

export default Login as ComponentClass
