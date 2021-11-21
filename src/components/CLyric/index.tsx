import { FC, memo } from "react";
import classnames from "classnames";
import { View } from "@tarojs/components";

import "./index.scss";
type Props = {
  lrc: {
    scroll: boolean;
    nolyric: boolean;
    uncollected: boolean;
    lrclist: Array<{
      lrc_text: string;
      lrc_sec: number;
    }>;
  };
  lrcIndex: number;
  showLyric: boolean;
  onTrigger: () => void;
};

const CLyric: FC<Props> = ({ lrc, lrcIndex, showLyric, onTrigger }) => {
  const cls = classnames({
    song__lyric_components: true,
    hidden: !showLyric
  });
  // console.log("CLyric render");
  return (
    <View
      className={cls}
      style={{
        overflow:
          lrc.scroll && !lrc.nolyric && !lrc.uncollected ? "auto" : "hidden"
      }}
      onClick={() => onTrigger()}
    >
      <View
        className="song__lyric__wrap"
        style={{
          transform: `translateY(-${(lrcIndex * 100) / lrc.lrclist.length}%)`
        }}
      >
        {lrc.nolyric && !lrc.uncollected ? (
          <View className="song__lyric__notext">纯音乐，无歌词</View>
        ) : (
          ""
        )}
        {lrc.scroll && !lrc.nolyric && !lrc.uncollected ? (
          <View className="song__lyric__notext">*歌词不支持滚动*</View>
        ) : (
          ""
        )}
        {lrc.uncollected && !lrc.nolyric ? (
          <View className="song__lyric__notext">暂无歌词</View>
        ) : (
          ""
        )}
        {lrc.lrclist.map((item, index) => (
          <View
            key={item.lrc_sec}
            className={classnames({
              song__lyric__text: true,
              "song__lyric__text--current": index === lrcIndex && !lrc.scroll,
              siblings2:
                index === lrcIndex - 7 ||
                index === lrcIndex + 7 ||
                index === lrcIndex - 6 ||
                index === lrcIndex + 6,
              siblings1: index === lrcIndex - 5 || index === lrcIndex + 5
            })}
            data-time={item.lrc_sec}
          >
            {item.lrc_text}
          </View>
        ))}
      </View>
    </View>
  );
};
CLyric.defaultProps = {
  lrc: {
    scroll: false,
    nolyric: false,
    uncollected: false,
    lrclist: []
  },
  lrcIndex: 0,
  showLyric: false
};
export default memo(CLyric, (prevProps, nextProps) => {
  return (
    prevProps.showLyric === nextProps.showLyric &&
    prevProps.lrcIndex === nextProps.lrcIndex
  );
});
