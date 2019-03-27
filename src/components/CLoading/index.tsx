import Taro, { Component } from '@tarojs/taro'
import classnames from 'classnames'
import { View } from '@tarojs/components'

import './index.scss'

type Props = {
  fullPage?: boolean,
  hide?: boolean
}

export default class CLoading extends Component<Props, {}> {

  componentWillMount() {
  }

  render() {
    const { fullPage, hide } = this.props
    const cls = classnames({
        loading_components: true,
        fullScreen: fullPage,
        hide: hide
    })
    return (
        <View className={cls}>
            
        </View>
    )
  }
}
