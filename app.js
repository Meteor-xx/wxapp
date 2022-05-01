//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData: {
    userInfo: null,
    user_time:null,
    userData:null,
    accessToken:null,
    apiVersion:null,
    deviceId:null,
    user_latitude:null,
    user_longitude:null,
    userCars:null,
    shownCar:null,
    userAccount: { "account": "", "password": "" },
    userId:null,
    timer:''
  }
})