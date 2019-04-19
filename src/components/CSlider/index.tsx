import Taro, { Component } from '@tarojs/taro'
import { View, Slider } from '@tarojs/components'

import './index.scss'

type Props = {
  percent: number,
  onChange: (object) => any,
  onChanging: (object) => any
}

export default class CSlider extends Component<Props, {}> {

  componentWillMount() {
  }

  render() {
    const { percent } = this.props
    return (
      <View className='slider_components'>
        <Slider value={percent} blockSize={20} activeColor='#d43c33' onChange={(e) => this.props.onChange(e)} onChanging={(e) => this.props.onChanging(e) } />
      </View>
    )
  }
}
