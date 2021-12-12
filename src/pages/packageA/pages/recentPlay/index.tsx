import { Component } from "react";
import Taro from "@tarojs/taro";
import { AtTabs, AtTabsPane } from "taro-ui";
import { View } from "@tarojs/components";
import api from "../../../../services/api";
import { connect } from "../../../../utils/connect";
import classnames from "classnames";
import CLoading from "../../../../components/CLoading";
import CMusic from "../../../../components/CMusic";
import {
  getSongInfo,
  updatePlayStatus,
  updateCanplayList,
  updateRecentTab
} from "../../../../actions/song";
// import { injectPlaySong } from "../../utils/decorators";
import { MusicItemType, songType } from "../../../../constants/commonType";
import "./index.scss";

type PageStateProps = {
  song: songType;
};

type PageDispatchProps = {
  getSongInfo: (object) => any;
  updateCanplayList: (object) => any;
  updateRecentTab: (object) => any;
  updatePlayStatus: (object) => any;
};

type PageState = {
  tabList: Array<{
    title: string;
  }>;
  list: Array<{
    playCount: number;
    song: MusicItemType;
  }>;
  currentTab: number;
};

// @injectPlaySong()
@connect(
  ({ song }) => ({
    song: song
  }),
  dispatch => ({
    getSongInfo(object) {
      dispatch(getSongInfo(object));
    },
    updateCanplayList(object) {
      dispatch(updateCanplayList(object));
    },
    updateRecentTab(object) {
      dispatch(updateRecentTab(object));
    },
    updatePlayStatus(object) {
      dispatch(updatePlayStatus(object));
    }
  })
)
class Page extends Component<PageDispatchProps & PageStateProps, PageState> {

  constructor(props) {
    super(props);
    this.state = {
      tabList: [
        {
          title: "最近7天"
        },
        {
          title: "全部"
        }
      ],
      list: [],
      currentTab: props.song.recentTab || 0
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(this.props, nextProps);
  }

  componentDidMount() {
    this.getData();
  }

  getData() {
    const { currentTab } = this.state;
    const userId = Taro.getStorageSync("userId");
    api
      .get("/user/record", {
        uid: userId,
        type: currentTab === 0 ? 1 : 0
      })
      .then(res => {
        const dataType = currentTab === 0 ? "weekData" : "allData";
        if (res.data && res.data[dataType] && res.data[dataType].length > 0) {
          this.setState({
            list: res.data[dataType]
          });
        }
      });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  switchTab(val) {
    this.setState(
      {
        currentTab: val,
        list: []
      },
      () => {
        this.getData();
      }
    );
  }

  playSong(songId, canPlay) {
    if (canPlay) {
      this.saveData(songId);
      Taro.navigateTo({
        url: `/pages/packageA/pages/songDetail/index?id=${songId}`
      });
    } else {
      Taro.showToast({
        title: "暂无版权",
        icon: "none"
      });
    }
  }

  saveData(songId) {
    const { list, currentTab } = this.state;
    const tempList = list.map(item => {
      let temp: any = {};
      temp.name = item.song.name;
      temp.id = item.song.id;
      temp.ar = item.song.ar;
      temp.al = item.song.al;
      temp.copyright = item.song.copyright;
      temp.st = item.song.st;
      return temp;
    });
    const canPlayList = tempList.filter(item => {
      return item.st !== -200;
    });
    this.props.updateCanplayList({
      canPlayList,
      currentSongId: songId
    });
    this.props.updateRecentTab({
      recentTab: currentTab
    });
  }

  showMore() {
    Taro.showToast({
      title: "暂未实现，敬请期待",
      icon: "none"
    });
  }

  render() {
    const { list, currentTab, tabList } = this.state;
    const { currentSongInfo, isPlaying, canPlayList } = this.props.song;
    return (
      <View
        className={classnames({
          recentPlay_container: true,
          hasMusicBox: !!this.props.song.currentSongInfo.name
        })}
      >
        <CMusic
          songInfo={{
            currentSongInfo,
            isPlaying,
            canPlayList
          }}
          onUpdatePlayStatus={this.props.updatePlayStatus.bind(this)}
        />
        <AtTabs
          current={currentTab}
          swipeable={false}
          tabList={tabList}
          onClick={this.switchTab.bind(this)}
        >
          <AtTabsPane current={currentTab} index={0}>
            {list.length === 0 ? (
              <CLoading />
            ) : (
              list.map(item => (
                <View key={item.song.id} className="recentPlay__music">
                  <View
                    className="recentPlay__music__info"
                    onClick={this.playSong.bind(
                      this,
                      item.song.id,
                      item.song.st !== -200
                    )}
                  >
                    <View className="recentPlay__music__info__name">
                      {item.song.name}
                    </View>
                    <View className="recentPlay__music__info__desc">
                      {`${item.song.ar[0] ? item.song.ar[0].name : ""} - ${
                        item.song.al.name
                      }`}
                    </View>
                  </View>
                  <View
                    className="fa fa-ellipsis-v recentPlay__music__icon"
                    onClick={this.showMore.bind(this)}
                  ></View>
                </View>
              ))
            )}
          </AtTabsPane>
          <AtTabsPane current={currentTab} index={1}>
            {list.length === 0 ? (
              <CLoading />
            ) : (
              list.map((item) => (
                <View key={item.song.id} className="recentPlay__music">
                  <View
                    className="recentPlay__music__info"
                    onClick={this.playSong.bind(
                      this,
                      item.song.id,
                      item.song.st !== -200
                    )}
                  >
                    <View className="recentPlay__music__info__name">
                      {item.song.name}
                    </View>
                    <View className="recentPlay__music__info__desc">
                      {`${item.song.ar[0] ? item.song.ar[0].name : ""} - ${
                        item.song.al.name
                      }`}
                    </View>
                  </View>
                  <View
                    className="fa fa-ellipsis-v recentPlay__music__icon"
                    onClick={this.showMore.bind(this)}
                  ></View>
                </View>
              ))
            )}
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default Page;
