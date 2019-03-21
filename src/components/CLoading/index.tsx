import Taro, { Component } from '@tarojs/taro'
import classnames from 'classnames'
import { View } from '@tarojs/components'

import './index.scss'

type Props = {
  fullPage: boolean
}

export default class CLoading extends Component<Props, {}> {

  componentWillMount() {
  }

  render() {
    const { fullPage } = this.props
    const cls = classnames({
        loading_components: true,
        fullScreen: fullPage
    })
    return (
        <View className={cls}>
            
        </View>
    )
  }
}
