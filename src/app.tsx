// import "@tarojs/async-await";
import { Component } from 'react'
import { Provider } from "react-redux";
// react-redux

import configStore from "./store";

import "taro-ui/dist/style/index.scss"; // 全局引入一次即可
import "./app.scss";
import "./assets/iconFont/icon.scss";

const store = configStore();

class App extends Component {

  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentCatchError() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    );
  }
}

export default App
