import Taro from '@tarojs/taro'
import { View, Slider } from '@tarojs/components'

import './index.scss'

type Props = {
  percent: number,
  onChange: (object) => any,
  onChanging: (object) => any
}

export default function CSlider (props: Props) {
  const { percent } = props
  return (
    <View className='slider_components'>
      <Slider value={percent} blockSize={15} activeColor='#d43c33' onChange={(e) => this.props.onChange(e)} onChanging={(e) => this.props.onChanging(e) } />
    </View>
  )
}
