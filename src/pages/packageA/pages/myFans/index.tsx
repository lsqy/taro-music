import Taro from '@tarojs/taro'
import { FC, useState, useEffect } from 'react'
import { View, ScrollView } from '@tarojs/components'
import CLoading from '../../../../components/CLoading'
import api from '../../../../services/api'
import CUserListItem from '../../../../components/CUserListItem'
import './index.scss'

type userList = Array<{
  avatarUrl: string,
  nickname: string,
  signature?: string,
  gender: number,
  userId: number
}>

const Page: FC = () => {
  const [ userId ] = useState<number>(Taro.getStorageSync('userId'))
  const [ userList, setUserList ] = useState<userList>([])
  const [ hasMore, setHasMore ] = useState<boolean>(true)
  useEffect(() => {
    getFollowedList()
  }, [])

  function getFollowedList() {
    if (!hasMore) return
    api.get('/user/followeds', {
      uid: userId,
      limit: 20,
      offset: userList.length
    }).then((res) => {
      setUserList(userList.concat(res.data.followeds))
      setHasMore(res.data.more)
    })
  }

  function goUserDetail() {
    Taro.showToast({
      title: '详情页面正在开发中，敬请期待',
      icon: 'none'
    })
    // Taro.navigateTo({
    //   url: `/pages/user/index?id=${id}`
    // })
  }

  return (
    <View className='my_fans_container'>
      <ScrollView scrollY onScrollToLower={getFollowedList} className='user_list'>
        {
          userList.map((item) => <CUserListItem userInfo={item} key={item.userId} clickFunc={goUserDetail}/>)
        }
        <CLoading hide={!hasMore} />
      </ScrollView>
    </View>
  )
}

export default Page
