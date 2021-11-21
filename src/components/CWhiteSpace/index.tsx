import { FC } from "react";
import classnames from 'classnames'
import { View } from '@tarojs/components'

import './index.scss'
type Props = {
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  color: string
}


const CWhiteSpace: FC<Props> = ({ size, color }) => {
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

export default CWhiteSpace
