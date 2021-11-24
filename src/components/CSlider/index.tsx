import { FC, memo } from "react";
import { View, Slider } from "@tarojs/components";

import "./index.scss";

type Props = {
  percent: number;
  onChange: (object) => any;
  onChanging: (object) => any;
};


const CSlider: FC<Props> = ({ percent, onChange, onChanging }) => {
  // console.log("CSlider render");
  return (
    <View className="slider_components">
      <Slider
        value={percent}
        blockSize={15}
        activeColor="#d43c33"
        onChange={e => onChange(e)}
        onChanging={e => onChanging(e)}
      />
    </View>
  );
};

export default memo(CSlider, (prevProps, nextProps) => {
  return prevProps.percent === nextProps.percent;
});
