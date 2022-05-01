// pages/user/settings/settings.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  primary:function(e){
    var that=this;
    var dataid = {"id":""}
    dataid.id = app.globalData.userId
    wx.request({
      url: 'https://xiaochengxu.yunkeiot.cn/car_api/admin/logout',
      method: 'POST',
      data: {
        version: app.globalData.apiVersion,
        data: JSON.stringify(dataid),
        accessToken: app.globalData.accessToken
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res)
        wx.clearStorage();//清理本地缓存
        app.globalData.userInfo = null
        app.globalData.user_time = null
        app.globalData.userData = null
        app.globalData.accessToken = null
        app.globalData.apiVersion = null
        app.globalData.deviceId = null
        app.globalData.user_latitude = null
        app.globalData.user_longitude = null
        app.globalData.userCars = null
        app.globalData.shownCar = null
        app.globalData.userAccount = { "account": "", "password": "" }
        app.globalData.userId = null
        wx.reLaunch({
         url: '../../login/login'//页面路由，关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
        })
      }
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})