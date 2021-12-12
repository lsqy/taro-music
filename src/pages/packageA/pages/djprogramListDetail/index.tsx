import { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import classnames from "classnames";
import { connect } from "../../../../utils/connect";
import CLoading from "../../../../components/CLoading";
import CMusic from "../../../../components/CMusic";
import {
  getSongInfo,
  getPlayListDetail,
  updatePlayStatus
} from "../../../../actions/song";
import { getDjListDetail } from "../../../../actions/dj";
// import { injectPlaySong } from "../../utils/decorators";
import { formatCount } from "../../../../utils/common";
import { songType, djListType } from "../../../../constants/commonType";
import "./index.scss";

type PageStateProps = {
  song: songType;
  dj: djListType;
};

type PageDispatchProps = {
  getPlayListDetail: (object) => any;
  getSongInfo: (object) => any;
  updatePlayStatus: (object) => any;
  getDjListDetail: (object) => any;
};

type PageState = {};

// @injectPlaySong()
@connect(
  ({ song, dj }) => ({
    song: song,
    dj: dj
  }),
  dispatch => ({
    getPlayListDetail(payload) {
      dispatch(getPlayListDetail(payload));
    },
    getSongInfo(object) {
      dispatch(getSongInfo(object));
    },
    updatePlayStatus(object) {
      dispatch(updatePlayStatus(object));
    },
    getDjListDetail(object) {
      dispatch(getDjListDetail(object));
    }
  })
)
class Page extends Component<PageDispatchProps & PageStateProps, PageState> {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    const { id, name = "" } = getCurrentInstance()?.router?.params || {};
    Taro.setNavigationBarTitle({
      title: name
    });
    this.props.getDjListDetail({
      id
    });
  }

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  playSong(songId, playStatus) {
    if (playStatus === 0) {
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

  render() {
    const {
      playListDetailInfo,
      playListDetailPrivileges,
      currentSongInfo,
      isPlaying,
      canPlayList
    } = this.props.song;
    return (
      <View
        className={classnames({
          playList_container: true,
          hasMusicBox: !!currentSongInfo.name
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
        <View className="playList__header">
          <Image
            className="playList__header__bg"
            src={playListDetailInfo.coverImgUrl}
          />
          <View className="playList__header__cover">
            <Image
              className="playList__header__cover__img"
              src={playListDetailInfo.coverImgUrl}
            />
            <Text className="playList__header__cover__desc">歌单</Text>
            <View className="playList__header__cover__num">
              <Text className="at-icon at-icon-sound"></Text>
              {formatCount(playListDetailInfo.playCount)}
            </View>
          </View>
          <View className="playList__header__info">
            <View className="playList__header__info__title">
              {playListDetailInfo.name}
            </View>
            <View className="playList__header__info__user">
              <Image
                className="playList__header__info__user_avatar"
                src={playListDetailInfo.creator.avatarUrl}
              />
              {playListDetailInfo.creator.nickname}
            </View>
          </View>
        </View>
        <View className="playList__header--more">
          <View className="playList__header--more__tag">
            标签：
            {playListDetailInfo.tags.map(tag => (
              <Text key={tag} className="playList__header--more__tag__item">
                {tag}
              </Text>
            ))}
            {playListDetailInfo.tags.length === 0 ? "暂无" : ""}
          </View>
          <View className="playList__header--more__desc">
            简介：{playListDetailInfo.description || "暂无"}
          </View>
        </View>
        <View className="playList__content">
          <View className="playList__content__title">歌曲列表</View>
          {playListDetailInfo.tracks.length === 0 ? <CLoading /> : ""}
          <View className="playList__content__list">
            {playListDetailInfo.tracks.map((track, index) => (
              <View
                className={classnames({
                  playList__content__list__item: true,
                  disabled: playListDetailPrivileges[index].st === -200
                })}
                key={track.id}
                onClick={this.playSong.bind(
                  this,
                  track.id,
                  playListDetailPrivileges[index].st
                )}
              >
                <Text className="playList__content__list__item__index">
                  {index + 1}
                </Text>
                <View className="playList__content__list__item__info">
                  <View>
                    <View className="playList__content__list__item__info__name">
                      {track.name}
                    </View>
                    <View className="playList__content__list__item__info__desc">
                      {track.ar[0] ? track.ar[0].name : ""} - {track.al.name}
                    </View>
                  </View>
                  <Text className="at-icon at-icon-chevron-right"></Text>
                </View>
              </View>
            ))}
          </View>
        </View>
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
