import Taro from '@tarojs/taro'
import { FC, useState, useEffect } from 'react'
import { View } from '@tarojs/components'
import api from '../../../../services/api'
import './index.scss'

const Page: FC = () => {
  const [ userId ] = useState<number>(Taro.getStorageSync('userId'))
  useEffect(() => {
    api.get('/user/event', {
      uid: userId
    }).then((res) => {
      console.log('event =>', res)
    })
  }, [])
  return (
    <View className='template_container'>
    </View>
  )
}

export default Page
