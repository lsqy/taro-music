import Taro, { FC } from '@tarojs/taro'
import { View, Slider } from '@tarojs/components'

import './index.scss'

type Props = {
  percent: number,
  onChange: (object) => any,
  onChanging: (object) => any
}

 const CSlider: FC<Props> = ({ percent }) => {
  return (
    <View className='slider_components'>
      <Slider value={percent} blockSize={15} activeColor='#d43c33' onChange={(e) => this.props.onChange(e)} onChanging={(e) => this.props.onChanging(e) } />
    </View>
  )
}

export default CSlider