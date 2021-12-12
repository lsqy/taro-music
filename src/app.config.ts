/*
 * @Date: 2021-12-02 19:15:41
 * @LastEditors: yiqian.lsq
 * @LastEditTime: 2021-12-12 20:04:41
 * @FilePath: /taro-music/src/app.config.ts
 * @Description:
 */
export default {
  pages: [
    "pages/index/index",
    "pages/my/index",
    "pages/user/index",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#d43c33",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "white",
  },
  requiredBackgroundModes: ["audio"],
  "subpackages": [
    {
      "root": "pages/packageA",
      "pages": [
        "pages/videoDetail/index",
        "pages/djprogramListDetail/index",
        "pages/search/index",
        "pages/searchResult/index",
        "pages/songDetail/index",
        "pages/playListDetail/index",
        "pages/login/index",
        "pages/myFans/index",
        "pages/myFocus/index",
        "pages/myEvents/index",
        "pages/recentPlay/index",
      ]
    }
  ]
};
