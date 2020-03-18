import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { View } from '@tarojs/components'

import './index.scss'
type Props = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  color: string
}


export default function CWhiteSpace (props: Props) {
  const { size, color } = props
  const cls = classnames({
    whiteSpace_components: true,
    xs: size === 'xs',
    sm: size === 'sm',
    md: size === 'md',
    lg: size === 'lg',
    xl: size === 'xl'
  })
  return (
      <View className={cls} style={{ 'backgroundColor': color}}>
      </View>
  )
}
