import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import classnames from 'classnames'
import { currentSongInfoType } from '../../constants/commonType'
import './index.scss'
type Props = {
  musicInfo: currentSongInfoType
}


export default class CMusic extends Component<Props, {}> {

  goDetail() {
    const { id } = this.props.musicInfo
    Taro.navigateTo({
      url: `/pages/songDetail/index?id=${id}`
    })
  }

  render() {
    const { musicInfo } = this.props
    return (
      <View className='music_components'>
        <Image 
          className={
            classnames({
              music__pic: true,
              'z-pause': false,
              circling: true
            })
          }
          src={musicInfo.al.picUrl}
        />
        <View className="music__name" onClick={this.goDetail.bind(this)}>{musicInfo.name}</View>
      </View>
    )
  }
}
