import Taro, { FC } from '@tarojs/taro'
import classnames from 'classnames'
import { View } from '@tarojs/components'
import './index.scss'

type Props = {
  fullPage?: boolean,
  hide?: boolean
}

const CLoading: FC<Props> = ({ fullPage, hide }) => {
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

export default CLoading
