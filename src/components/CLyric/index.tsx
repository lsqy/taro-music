import Taro, { Component } from '@tarojs/taro'
import classnames from 'classnames'
import { View, Text } from '@tarojs/components'

import './index.scss'
type Props = {
  lrc: {
    scroll: boolean,
    nolyric: boolean,
    uncollected: boolean,
    lrc: Array<{
      lrc: string,
      lrc_sec: number
    }>
  },
  lrcIndex: number,
  showLyric: boolean,
  onTrigger: () => void
}


export default class CLyric extends Component<Props, {}> {

  render() {
    const { lrc, lrcIndex, showLyric } = this.props
    console.log('this.props', this.props)
    const cls = classnames({
      song__lyric_components: true,
      hidden: !showLyric
    })
    return (
      <View className={cls} style={{
        overflow: lrc.scroll && !lrc.nolyric && !lrc.uncollected ? 'auto' : 'hidden'
      }}
      onClick={() => this.props.onTrigger()}
      >
        <View className='song__lyric__wrap' style={{
            transform: `translateY(-${lrcIndex*100/(lrc.lrc.length+6)}%)`
        }}>
          {
            lrc.nolyric ?  
            <View className='song__lyric__notext'>
              纯音乐，无歌词
            </View> : ''
          }
          {
            lrc.scroll && !lrc.nolyric && !lrc.uncollected ?  
            <View className='song__lyric__notext'>
              *歌词不支持滚动*
            </View> : ''
          }
          {
            lrc.uncollected ?  
            <View className='song__lyric__notext'>
              暂无歌词
            </View> : ''
          }
          {
            lrc.lrc.map((item, index) => 
                <View key={index} className={
                  classnames({
                    song__lyric__text: true,
                    'song__lyric__text--current': index === lrcIndex  && !lrc.scroll,
                    siblings2: (index === lrcIndex - 7 || index === lrcIndex + 7) || (index === lrcIndex - 6 || index === lrcIndex + 6),
                    siblings1: index === lrcIndex - 5 || index === lrcIndex + 5
                  })
                }
                data-time={item.lrc_sec}
                >
                  {item.lrc}
                </View>
            )
          }         
        </View>
      </View>
    )
  }
}
