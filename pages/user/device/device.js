// pages/user/user.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    vehicleManufacturers: '',
    series: '',
    plateNumber: '',
    vehicleIdentificationNumber: '',
    deviceId: '',
    shown_mode: 'read',
    userCars: '',
    shownCar: '',
    modalName: '',
    shownIndex: '',
    shown_listL: '',
    allData: '',

    wVehicleManufacturers: '',
    wSeries: '',
    wPlateNumber: '',
    wVehicleIdentificationNumber: '',
    wDeviceId: '',
    isfullFill: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
  radioChange(e) {
    this.setData({
      shownIndex: e.detail.value,
      shownCar: app.globalData.userCars[e.detail.value].plateNumber
    })
    this.onShow()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    var data = wx.getStorageSync(app.globalData.userAccount.account)
    for (var i = 0; i < data.cars.length; i++) {
      if (data.shownCar == data.cars[i]) {
        this.setData({
          vehicleManufacturers: data.user_VehicleInfoList[i].vehicleManufacturers,
          series: data.user_VehicleInfoList[i].series,
          plateNumber: data.user_VehicleInfoList[i].plateNumber,
          vehicleIdentificationNumber: data.user_VehicleInfoList[i].vehicleIdentificationNumber,
          deviceId: data.user_VehicleInfoList[i].deviceId,
          allData: data.user_VehicleInfoList[i],
          shownCar: data.shownCar
        })
      }
    }
  },
  quit: function(e) {
    var that = this;
    var dataid = {
      "id": ""
    }
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
        app.globalData.userAccount = {
          "account": "",
          "password": ""
        }
        app.globalData.userId = null
        wx.reLaunch({
          url: '../../login/login' //页面路由，关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  editInfo: function() {
    this.setData({
      shown_mode: 'write',
      wVehicleManufacturers: '',
      wSeries: '',
      wPlateNumber: '',
      wVehicleIdentificationNumber: '',
      wDeviceId: '',
      isfullFill: false
    })
  },
  formSubmit: function(e) {
    var that = this
    var wVehicleManufacturers = e.detail.value.wVehicleManufacturers
    var wSeries = e.detail.value.wSeries
    var wPlateNumber = e.detail.value.wPlateNumber
    var wVehicleIdentificationNumber = e.detail.value.wVehicleIdentificationNumber
    var wDeviceId = e.detail.value.wDeviceId
    console.log('form发生了submit事件，携带数据为:\n'  + wDeviceId + '\n' + wVehicleIdentificationNumber + '\n' +
      wPlateNumber + '\n' + wVehicleManufacturers + '\n' +wSeries)
    if(wVehicleIdentificationNumber == '' || wSeries == '' || wPlateNumber == '' || wVehicleManufacturers == ''
    || wDeviceId == '')
    {
      this.setData({
        isfullFill:true
      })
    }else{
      this.setData({
        isfullFill: false,
        wVehicleManufacturers: wVehicleManufacturers,
        wSeries: wSeries,
        wPlateNumber: wPlateNumber,
        wVehicleIdentificationNumber: wVehicleIdentificationNumber,
        wDeviceId: wDeviceId,
      })
      var httpdata =  { "plateNumber": wPlateNumber, "deviceId": wDeviceId, "vin": wVehicleIdentificationNumber, "brand": wVehicleManufacturers, "series": wSeries, }
      wx.request({
        url: 'https://xiaochengxu.yunkeiot.cn/car_api/vehicle/vehicleBind',
        method: 'POST',
        data: {
          version: app.globalData.apiVersion,
          data: JSON.stringify(httpdata),
          accessToken: app.globalData.accessToken,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          console.log(res)
          if(res.data.resCode == 4004)
          {
            that.setData({
              modalName: 'DialogModal1'
            })
          }else if(res.data.resCode == 1000)
          {
            wx.showToast({
              title: '绑定成功',
              icon: 'success',
              duration: 1000,//持续的时间
            })
            setTimeout(function () {
              that.setData({
                shown_mode: 'read'
              })
            }, 1000)
          }
        }
      })
    } 
  },
  cancel: function() {
    console.log('form发生了cancel事件')
    this.setData({
      shown_mode: 'read',
      wVehicleManufacturers: '',
      wSeries: '',
      wPlateNumber: '',
      wVehicleIdentificationNumber: '',
      wDeviceId: '',
      isfullFill: false
    })
  },
  scanQrCode:function(){
    var that = this
    wx.scanCode({
      // onlyFromCamera:true,
      success(res){
        console.log(res)
        var reg = /^[0-9]+.?[0-9]*$/
        if(reg.test(res.result)){
          that.setData({
            wDeviceId: res.result
          })
        }else{
          that.setData({
            wDeviceId: res.result.substring(0,13)
          })
        }  
      }
    })
  },
  scanCode:function(){
    var that = this
    wx.scanCode({
      onlyFromCamera: true,
      success: function (res) {
        console.log(res)
        that.setData({
          wVehicleIdentificationNumber:res.result
        })
       },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  
})