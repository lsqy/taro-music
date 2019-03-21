import Taro, { Component } from '@tarojs/taro'
import classnames from 'classnames'
import { View, Image } from '@tarojs/components'

import './index.scss'
type Props = {
    isFixed: boolean
}


export default class CTitle extends Component<Props, {}> {

  render() {
    const { isFixed } = this.props
    const cls = classnames({
        title_components: true,
        fixed: isFixed
    })
    return (
        <View className={cls}>
            <Image className='title_components__logo' src={require('../../assets/images/logo.png')} />
        </View>
    )
  }
}
