import { Component } from 'react'
import { AtSearchBar, AtIcon } from 'taro-ui'
import Taro from '@tarojs/taro'
import CLoading from '../../../../components/CLoading'
import classnames from 'classnames'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { getKeywordInHistory, setKeywordInHistory, clearKeywordInHistory } from '../../../../utils/common'
import api from '../../../../services/api'
import './index.scss'


type PageState = {
  searchValue: string,
  hotList: Array<{
    searchWord: string,
    score: number,
    iconUrl: string,
    content: string,
    iconType: number
  }>,
  historyList: Array<string>
}

class Page extends Component<{}, PageState> {

  constructor (props) {
    super(props)
    this.state = {
      searchValue: '',
      hotList: [],
      historyList: []
    }
  }

  componentWillReceiveProps (nextProps) {
    console.log(this.props, nextProps)
  }

  componentDidMount() {
    this.getHotSearch()
  }

  componentWillUnmount () { }

  componentDidShow () {
    console.log('getKeywordInHistory()', getKeywordInHistory())
    this.setState({
      historyList: getKeywordInHistory()
    })
  }

  componentDidHide () { }

  searchTextChange(val) {
    this.setState({
      searchValue: val
    })
  }

  searchResult() {
    this.goResult(this.state.searchValue)
  }

  goResult(keywords) {
    setKeywordInHistory(keywords)
    Taro.navigateTo({
      url: `/pages/packageA/pages/searchResult/index?keywords=${keywords}`
    })
  }

  clearKeywordInHistory() {
    this.setState({
      historyList: []
    })
    clearKeywordInHistory()
  }

  getHotSearch() {
    api.get('/search/hot/detail', {
    }).then((res) => {
      if (res.data && res.data.data) {
        this.setState({
          hotList: res.data.data
        })
      }
    })
  }


  render () {
    const { searchValue, hotList, historyList } = this.state
    return (
      <View className='search_container'>
        <AtSearchBar
          actionName='搜一下'
          value={searchValue}
          onChange={this.searchTextChange.bind(this)}
          onActionClick={this.searchResult.bind(this)}
          onConfirm={this.searchResult.bind(this)}
          focus={true}
          className='search__input'
          fixed={true}
        />
        <ScrollView className='search_content' scrollY>
          {
            historyList.length ? <View className='search__history'>
              <View className='search__history__title'>
                <Text className='search__history__title__label'>
                  搜索历史
                </Text>
                <AtIcon prefixClass='fa' value='trash-o' size='20' color='#cccccc' className='search__history__title__icon' onClick={this.clearKeywordInHistory.bind(this)}></AtIcon>
              </View>
              <ScrollView className='search__history__list' scrollX>
                {
                  historyList.map((keyword) => <Text className='search__history__list__item' key={keyword} onClick={this.goResult.bind(this, keyword)}>{keyword}</Text>)
                }
              </ScrollView>
            </View> : ''
          }
          <View className='search__hot'>
            <View className='search__history__title'>
              <Text className='search__history__title__label'>
                热搜榜
              </Text>
            </View>
            {
              hotList.length === 0 ? <CLoading /> : ''
            }
            <View className='search__hot__list'>
              {
                hotList.map((item, index) => <View className='search__hot__list__item flex flex-align-center' key={item.searchWord} onClick={this.goResult.bind(this, item.searchWord)}>
                  <View className={
                    classnames({
                      search__hot__list__item__index: true,
                      spec: index <= 2
                    })
                  }>
                    {index + 1}
                  </View>
                  <View className='search__hot__list__item__info'>
                    <View className="flex flex-align-center">
                      <Text className={
                        classnames({
                          search__hot__list__item__info__title: true,
                          spec: index <= 2
                        })
                      }>
                        {item.searchWord}
                      </Text>
                      <Text className='search__hot__list__item__info__score'>
                        {item.score}
                      </Text>
                      {
                        item.iconUrl ? <Image src={item.iconUrl} mode="widthFix" className={
                          classnames({
                            search__hot__list__item__info__icon: true,
                            spec: item.iconType === 5
                          })
                        }/> : ''
                      }
                    </View>
                    <View className='search__hot__list__item__info__desc'>
                      {item.content}
                    </View>
                  </View>
                </View>)
              }
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Page;
