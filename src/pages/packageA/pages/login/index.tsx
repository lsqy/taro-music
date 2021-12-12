import Taro from "@tarojs/taro";
import { FC, useState } from "react";
import { View, Input } from "@tarojs/components";
import { AtIcon, AtButton, AtToast } from "taro-ui";
import CTitle from "../../../../components/CTitle";
import api from "../../../../services/api";
import "./index.scss";

type InputType = "phone" | "password";

const Page: FC = () => {
  // const { showLoading, tip, showTip } = this.state
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [showTip, setShowTip] = useState<boolean>(false);
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [tip, setTip] = useState<string>("");

  function useLoginStatus(res) {
    const { code } = res.data;
    let tip = "登录成功";
    if (code !== 200) {
      tip = res.data.msg || "登录失败";
    }
    setShowLoading(false);
    setShowTip(true);
    setTip(tip);
    setTimeout(() => {
      setShowTip(false);
    }, 2000);
    if (code === 200) {
      Taro.setStorageSync("userInfo", res.data);
      Taro.setStorageSync("userId", res.data.account.id);
      Taro.navigateTo({
        url: "/pages/index/index"
      });
    }
  }

  function login() {
    if (!phone) {
      this.setState({
        showTip: true,
        tip: "请输入手机号"
      });
      return;
    }
    if (!password) {
      this.setState({
        showTip: true,
        tip: "请输入密码"
      });
      return;
    }
    setShowLoading(true);
    api
      .get("/login/cellphone", {
        phone,
        password
      })
      .then(res => {
        useLoginStatus(res);
      });
  }

  function handleChange(type: InputType, event) {
    const { value } = event.detail;
    if (type === "phone") {
      setPhone(value);
    } else {
      setPassword(value);
    }
  }

  return (
    <View className="login_container">
      <CTitle isFixed={false} />
      <View className="login_content">
        <View className="login_content__item">
          <AtIcon value="iphone" size="24" color="#ccc"></AtIcon>
          <Input
            type="text"
            placeholder="手机号"
            className="login_content__input"
            onInput={(e): void => {
              handleChange("phone", e);
            }}
          />
        </View>
        <View className="login_content__item">
          <AtIcon value="lock" size="24" color="#ccc"></AtIcon>
          <Input
            type="text"
            password
            placeholder="密码"
            className="login_content__input"
            onInput={(e): void => {
              handleChange("password", e);
            }}
          />
        </View>
        <AtButton className="login_content__btn" onClick={() => login()}>
          登录
        </AtButton>
      </View>
      <AtToast
        isOpened={showLoading}
        text="登录中"
        status="loading"
        hasMask
        duration={30000000}
      ></AtToast>
      <AtToast isOpened={showTip} text={tip} hasMask duration={2000}></AtToast>
    </View>
  );
};

export default Page;
