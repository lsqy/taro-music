import Taro from "@tarojs/taro";
import { Component } from "react";
import { View, Image, Text, Swiper, SwiperItem } from "@tarojs/components";
import { AtTabBar, AtSearchBar, AtIcon } from "taro-ui";
import { connect } from "../../utils/connect";
import classnames from "classnames";
import CLoading from "../../components/CLoading";
import CMusic from "../../components/CMusic";
import api from "../../services/api";
// import { injectPlaySong } from "../../utils/decorators";
import { songType } from "../../constants/commonType";
import {
  getRecommendPlayList,
  getRecommendDj,
  getRecommendNewSong,
  getRecommend,
  getSongInfo,
  updatePlayStatus
} from "../../actions/song";

import "./index.scss";

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796

type PageStateProps = {
  song: songType;
  counter: {
    num: number;
  };
  recommendPlayList: Array<{
    id: number;
    name: string;
    picUrl: string;
    playCount: number;
  }>;
  recommendDj: Array<{
    name: string;
    picUrl: string;
  }>;
  recommendNewSong: any;
  recommend: any;
};

type PageDispatchProps = {
  getRecommendPlayList: () => any;
  getRecommendDj: () => any;
  getRecommendNewSong: () => any;
  getRecommend: () => any;
  getSongInfo: (object) => any;
  updatePlayStatus: (object) => any;
};

type PageOwnProps = {};

type PageState = {
  current: number;
  showLoading: boolean;
  bannerList: Array<{
    typeTitle: string;
    pic: string;
    targetId: number;
  }>;
  searchValue: string;
};

type IProps = PageStateProps & PageDispatchProps & PageOwnProps;

interface Index {
  props: IProps;
}

// @injectPlaySong()
@connect(({ song }) => ({
    song: song,
    recommendPlayList: song.recommendPlayList,
    recommendDj: song.recommendDj,
    recommendNewSong: song.recommendNewSong,
    recommend: song.recommend
  }),
  (dispatch) => ({
    getRecommendPlayList() {
      dispatch(getRecommendPlayList());
    },
    getRecommendDj() {
      dispatch(getRecommendDj());
    },
    getRecommendNewSong() {
      dispatch(getRecommendNewSong());
    },
    getRecommend() {
      dispatch(getRecommend());
    },
    getSongInfo(object) {
      dispatch(getSongInfo(object));
    },
    updatePlayStatus(object) {
      dispatch(updatePlayStatus(object));
    }
}))
class Index extends Component<IProps, PageState> {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      showLoading: true,
      bannerList: [],
      searchValue: ""
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
    this.setState({
      showLoading: false
    });
  }

  componentWillMount() {
    this.getPersonalized();
    this.getNewsong();
    this.getDjprogram();
    this.getRecommend();
    this.getBanner();
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidMount() {
    this.removeLoading();
  }

  switchTab(value) {
    if (value !== 1) return;
    Taro.reLaunch({
      url: "/pages/my/index"
    });
  }

  /**
   * 获取推荐歌单
   */
  getPersonalized() {
    this.props.getRecommendPlayList();
  }

  /**
   * 获取推荐新音乐
   */
  getNewsong() {
    this.props.getRecommendNewSong();
  }

  /**
   * 获取推荐电台
   */
  getDjprogram() {
    this.props.getRecommendDj();
  }

  /**
   * 获取推荐节目
   */
  getRecommend() {
    this.props.getRecommend();
  }

  getBanner() {
    api
      .get("/banner", {
        type: 1
      })
      .then(({ data }) => {
        console.log("banner", data);
        if (data.banners) {
          this.setState({
            bannerList: data.banners
          });
        }
      });
  }

  goSearch() {
    Taro.navigateTo({
      url: `/pages/packageA/pages/search/index`
    });
  }

  goDetail(item) {
    Taro.navigateTo({
      url: `/pages/packageA/pages/playListDetail/index?id=${item.id}&name=${item.name}`
    });
  }

  goPage() {
    // Taro.navigateTo({
    //   url: `/pages/${pageName}/index`
    // })
    Taro.showToast({
      title: "正在开发中，敬请期待",
      icon: "none"
    });
  }

  goDjDetail(item) {
    // Taro.showToast({
    //   title: '暂未实现，敬请期待',
    //   icon: 'none'
    // })
    Taro.navigateTo({
      url: `/pages/packageA/pages/djprogramListDetail/index?id=${item.id}&name=${item.name}`
    });
  }

  removeLoading() {
    const { recommendPlayList, recommendDj } = this.props;
    if (recommendPlayList.length || recommendDj.length) {
      this.setState({
        showLoading: false
      });
    }
  }

  render() {
    const { recommendPlayList, song } = this.props;
    const { showLoading, bannerList, searchValue } = this.state;
    const { currentSongInfo, isPlaying, canPlayList } = song;
    return (
      <View
        className={classnames({
          index_container: true,
          hasMusicBox: !!song.currentSongInfo.name
        })}
      >
        <CLoading fullPage={true} hide={!showLoading} />
        <CMusic
          songInfo={{
            currentSongInfo,
            isPlaying,
            canPlayList
          }}
          isHome={true}
          onUpdatePlayStatus={this.props.updatePlayStatus.bind(this)}
        />
        <View onClick={this.goSearch.bind(this)}>
          <AtSearchBar
            actionName="搜一下"
            disabled={true}
            value={searchValue}
            onChange={this.goSearch.bind(this)}
          />
        </View>
        <Swiper
          className="banner_list"
          indicatorColor="#999"
          indicatorActiveColor="#d43c33"
          circular
          indicatorDots
          autoplay
        >
          {bannerList.map(item => (
            <SwiperItem key={item.targetId} className="banner_list__item">
              <Image src={item.pic} className="banner_list__item__img" />
            </SwiperItem>
          ))}
        </Swiper>
        <View className="handle_list">
          <View
            className="handle_list__item"
            onClick={this.goPage.bind(this, "dailyRecommend")}
          >
            <View className="handle_list__item__icon-wrap">
              <AtIcon
                prefixClass="fa"
                value="calendar-minus-o"
                size="25"
                color="#ffffff"
                className="handle_list_item__icon"
              ></AtIcon>
            </View>
            <Text className="handle_list__item__text">每日推荐</Text>
          </View>
          <View
            className="handle_list__item"
            onClick={this.goPage.bind(this, "rank")}
          >
            <View className="handle_list__item__icon-wrap">
              <AtIcon
                prefixClass="fa"
                value="bar-chart"
                size="25"
                color="#ffffff"
                className="handle_list_item__icon"
              ></AtIcon>
            </View>
            <Text className="handle_list__item__text">排行榜</Text>
          </View>
        </View>
        <View className="recommend_playlist">
          <View className="recommend_playlist__title">推荐歌单</View>
          <View className="recommend_playlist__content">
            {recommendPlayList.map(item => (
              <View
                key={item.id}
                className="recommend_playlist__item"
                onClick={this.goDetail.bind(this, item)}
              >
                <Image
                  src={`${item.picUrl}?imageView&thumbnail=250x0`}
                  className="recommend_playlist__item__cover"
                />
                <View className="recommend_playlist__item__cover__num">
                  <Text className="at-icon at-icon-sound"></Text>
                  {item.playCount < 10000
                    ? item.playCount
                    : `${Number(item.playCount / 10000).toFixed(0)}万`}
                </View>
                <View className="recommend_playlist__item__title">
                  {item.name}
                </View>
              </View>
            ))}
          </View>
        </View>
        {/* <View className='recommend_playlist'>
          <View className='recommend_playlist__title'>
            推荐电台
          </View>
          <View className='recommend_playlist__content'>
            {
              recommendDj.map((item, index) => <View key={index} className='recommend_playlist__item' onClick={this.goDjDetail.bind(this, item)}>
                <Image
                  src={`${item.picUrl}?imageView&thumbnail=250x0`}
                  className='recommend_playlist__item__cover'
                />
                <View className='recommend_playlist__item__title'>{item.name}</View>
              </View>)
            }
          </View>
        </View> */}
        <AtTabBar
          fixed
          selectedColor="#d43c33"
          tabList={[
            { title: "发现", iconPrefixClass: "fa", iconType: "feed" },
            { title: "我的", iconPrefixClass: "fa", iconType: "music" }
          ]}
          onClick={this.switchTab.bind(this)}
          current={this.state.current}
        />
      </View>
    );
  }
}

export default Index;
