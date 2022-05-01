// pages/w-detail/w-detail.js
//路线是通过微信小程序记录还是通过服务器接口获取？（认为是服务器获取：因微信小程序实时记录每次行程不切实际）在此暂做一个路径规划而非路程记录
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:'',
    deviceId:'',
    company:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item = JSON.parse(options.item)
    this.setData({
      list:item,
      deviceId:app.globalData.deviceId,
      company: app.globalData.userInfo.nickName
    })
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