//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    modalName: null,
    shownCar:"",
    cars:null,
    // newMessages:'8',
    // list: [
    //   {
    //     id: 'cars',
    //     name: '我的车辆',
    //     open: false,
    //     pages: 'cars'
    //   },
    //   {
    //     id: 'settings',
    //     name: '设置',
    //     open: false,
    //     pages: 'settings'
    //   }
    // ]
  },
  //事件处理函数
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(){
    var that = this
    var userAccountData = wx.getStorageSync(app.globalData.userAccount.account)
    if(userAccountData == '')
      setInterval(function(){
        that.onShow();
      },3000)
    that.setData({
      shownCar: userAccountData.shownCar,
      cars: userAccountData.cars
    })
  },
  showuserinfo:function(){
    wx.navigateTo({
      url: '../user/device/device',
    })
  },
  
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  radioChange(e){
    this.setData({
      shownCar: e.detail.value
    })
    var accountData = wx.getStorageSync(app.globalData.userAccount.account)
    accountData.shownCar = e.detail.value
    wx.setStorageSync(app.globalData.userAccount.account, accountData)
    this.hideModal()
  },
  onHide:function(){
    this.hideModal()
  }
})
