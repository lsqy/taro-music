import Taro from '@tarojs/taro'
import classnames from 'classnames'
import { View } from '@tarojs/components'
import './index.scss'

type Props = {
  fullPage?: boolean,
  hide?: boolean
}

export default function CLoading (props: Props) {
  const { fullPage, hide } = props
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
