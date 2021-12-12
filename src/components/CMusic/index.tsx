import Taro from "@tarojs/taro";
import { useState, FC, memo } from "react";
import { View, Image } from "@tarojs/components";
import { AtIcon, AtFloatLayout } from "taro-ui";
import classnames from "classnames";
import { currentSongInfoType, MusicItemType } from "../../constants/commonType";
import "./index.scss";
type Props = {
  songInfo: {
    currentSongInfo: currentSongInfoType;
    isPlaying: boolean;
    canPlayList: Array<MusicItemType>;
  };
  isHome?: boolean;
  onUpdatePlayStatus: (object) => any;
};

const backgroundAudioManager = Taro.getBackgroundAudioManager();

const CMusic: FC<Props> = ({ songInfo, isHome, onUpdatePlayStatus }) => {
  console.log("CMusic Render");
  let { currentSongInfo, isPlaying, canPlayList } = songInfo;
  const [isOpened, setIsOpened] = useState(false);
  const updatePlayStatusFunc = onUpdatePlayStatus;
  currentSongInfo = currentSongInfo || {};
  if (!currentSongInfo.name) return <View></View>;
  function goDetail() {
    const { id } = currentSongInfo;
    Taro.navigateTo({
      url: `/pages/packageA/pages/songDetail/index?id=${id}`
    });
  }

  function switchPlayStatus() {
    const { isPlaying } = songInfo;
    if (isPlaying) {
      backgroundAudioManager.pause();
      updatePlayStatusFunc({
        isPlaying: false
      });
    } else {
      backgroundAudioManager.play();
      updatePlayStatusFunc({
        isPlaying: true
      });
    }
  }

  function playSong(id) {
    Taro.navigateTo({
      url: `/pages/packageA/pages/songDetail/index?id=${id}`
    });
  }

  return (
    <View
      className={classnames({
        music_components: true,
        isHome: isHome
      })}
    >
      <Image
        className={classnames({
          music__pic: true,
          "z-pause": false,
          circling: isPlaying
        })}
        src={currentSongInfo.al.picUrl}
      />
      <View className="music__info" onClick={() => goDetail()}>
        <View className="music__info__name">{currentSongInfo.name}</View>
        <View className="music__info__desc">
          {currentSongInfo.ar[0] ? currentSongInfo.ar[0].name : ""} -{" "}
          {currentSongInfo.al.name}
        </View>
      </View>
      <View className="music__icon--play">
        <AtIcon
          value={isPlaying ? "pause" : "play"}
          size="30"
          color="#FFF"
          onClick={() => switchPlayStatus()}
        ></AtIcon>
      </View>
      <AtIcon
        value="playlist"
        size="30"
        color="#FFF"
        className="icon_playlist"
        onClick={() => setIsOpened(true)}
      ></AtIcon>
      <AtFloatLayout
        isOpened={isOpened}
        title="播放列表"
        scrollY
        onClose={() => setIsOpened(false)}
      >
        <View className="music__playlist">
          {canPlayList.map(item => (
            <View
              key={item.id}
              className={classnames({
                music__playlist__item: true,
                current: item.current
              })}
            >
              <View
                className="music__playlist__item__info"
                onClick={() => playSong(item.id)}
              >
                {`${item.name} - ${item.ar[0] ? item.ar[0].name : ""}`}
              </View>
              <View className="music__playlist__item__close">
                <AtIcon value="chevron-right" size="16" color="#ccc" />
              </View>
            </View>
          ))}
        </View>
      </AtFloatLayout>
    </View>
  );
};

CMusic.defaultProps = {
  songInfo: {
    currentSongInfo: {
      id: 0,
      name: "",
      ar: [],
      al: {
        picUrl: "",
        name: ""
      },
      url: "",
      lrcInfo: "",
      dt: 0, // 总时长，ms
      st: 0 // 是否喜欢
    },
    canPlayList: [],
    isPlaying: false
  }
};
// const shouldUpdate =
// 通过memo来避免不必要的渲染,提高响应速度
export default memo(CMusic, (prevProps, nextProps) => {
  console.log("prevProps =>", prevProps);
  console.log("nextProps =>", nextProps);
  if (
    nextProps.songInfo.isPlaying !== prevProps.songInfo.isPlaying ||
    nextProps.songInfo.currentSongInfo.name !==
      prevProps.songInfo.currentSongInfo.name
  ) {
    return false; // 返回false本次则会渲染，反之则不会渲染
  }
  return true;
});
