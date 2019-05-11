import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import './index.scss'
type Props = {
  isFixed: boolean
}


export default class CMusic extends Component<Props, {}> {

  render() {
    return (
      <View className='music_components'>
      </View>
    )
  }
}
