/*
  优化建议：
    1.数据存储，用户点击过的数据进行存储，减少网络请求调用时间，增加页面效率
*/
const app = getApp();
var util = require('../../utils/util.js');
var base = require('../../utils/base.js');
Page({
  data: {
    isHide:false,
    loading:"正在加载......",
    page:1,
    userInfo: {},
    hasUserInfo: false,
    time:'',
    trip_list: '',
    shown_list:'',
    httpData: { "plateNumber": "", "travelType": "1", "fuelType": "2", "mileageType": "2", "speedType": "1", },
    userCars:'',
    shownCar:'',
    modalName:'',
    shownIndex:'',
    shown_listL:'',
    showtime:'',
    mileage:0,
    driverTime:0,
    avgSpeed:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var accountData = wx.getStorageSync(app.globalData.userAccount.account)
    var httpdata = that.data.httpData
    httpdata.plateNumber = accountData.shownCar

    that.setData({
      httpData: httpdata,
      page:1,
      showtime:''
    })

    wx.request({
      url: 'https://xiaochengxu.yunkeiot.cn/car_api/travel/travelList',
      method: 'POST',
      data: {
        version: app.globalData.apiVersion,
        data: JSON.stringify(httpdata),
        accessToken: app.globalData.accessToken,
        descOrAsc: 'desc',
        orderBy: 'start_time'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        var trip_list = res.data.data
        for (var i = 0; i < trip_list.length; i++) {
          trip_list[i].travelStartTimeYMD = base.getLocalTimeStyleYMD(trip_list[i].travelStartTime)
          trip_list[i].travelStartTime = base.getLocalTime(trip_list[i].travelStartTime)
          trip_list[i].travelEndTime = base.getLocalTime(trip_list[i].travelEndTime)
          trip_list[i].startGpsLocation.gpsTime = base.getLocalTimeStyleH_m(trip_list[i].startGpsLocation.gpsTime)
          trip_list[i].endGpsLocation.gpsTime = base.getLocalTimeStyleH_m(trip_list[i].endGpsLocation.gpsTime)
        }
        that.setData({
          trip_list: trip_list,
          shown_list: trip_list,
          shown_listL: trip_list.length,
          shownCar: httpdata.plateNumber
        })
      }
    })
    wx.request({
      url: 'https://xiaochengxu.yunkeiot.cn/car_api/travel/travelNowDate',
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
        if(res.data.data.length != 0){
          that.setData({
            mileage: res.data.data[0].mileage,
            driverTime: res.data.data[0].driverTime,
            avgSpeed: res.data.data[0].avgSpeed,
            fuel:res.data.data[0].fuel
          })
        }else{
          that.setData({
            mileage: 0,
            driverTime: 0,
            avgSpeed: 0,
            fuel: -1
          })
        } 
      }
    })
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
    if(app.globalData.user_time == null){
      var time = util.formatDate(new Date());
      app.globalData.user_time = time
      this.setData({
        time: time
      })
    }else{
      this.setData({
        time:app.globalData.user_time
      })
    }
    console.log("onload")
  },
  onShow:function(){
    var that = this
    var shownCar = wx.getStorageSync(app.globalData.userAccount.account).shownCar
    if (shownCar != that.data.shownCar) {
      that.onLoad();
    }
    console.log("onshow")
  },
  itemtaped: function (e) {
    var item = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '../detail/l-detail/l-detail?item=' + item
    })
  },
  bindDateChange(e) {
    var that = this
    console.log(e.detail.value)
    that.setData({
      shown_list: ''
    })
    // var http = { "plateNumber": "", "travelType": "1", "fuelType": "2", "mileageType": "2", "speedType": "1", "date" : ""}
    // http.plateNumber = that.data.shownCar
    // http.date = e.detail.value
    // wx.request({
    //   url: 'http://127.0.0.1:8080/car_api/travel/travelDateList',
    //   method: 'POST',
    //   data: {
    //     version: app.globalData.apiVersion,
    //     data: JSON.stringify(http),
    //     accessToken: app.globalData.accessToken,
    //     descOrAsc: 'desc',
    //     orderBy: 'start_time'
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded' // 默认值
    //   },
    //   success(res) {
    //     var trip_list = res.data.data
    //     for (var i = 0; i < trip_list.length; i++) {
    //       trip_list[i].travelStartTimeYMD = base.getLocalTimeStyleYMD(trip_list[i].travelStartTime)
    //       trip_list[i].travelStartTime = base.getLocalTime(trip_list[i].travelStartTime)
    //       trip_list[i].travelEndTime = base.getLocalTime(trip_list[i].travelEndTime)
    //       trip_list[i].startGpsLocation.gpsTime = base.getLocalTimeStyleH_m(trip_list[i].startGpsLocation.gpsTime)
    //       trip_list[i].endGpsLocation.gpsTime = base.getLocalTimeStyleH_m(trip_list[i].endGpsLocation.gpsTime)
    //     }
    //     that.setData({
    //       trip_list: trip_list,
    //       shown_list: trip_list,
    //       shown_listL: trip_list.length,
    //       shownCar: http.plateNumber,
    //       showtime: e.detail.value,
    //     })
    //   }
    // })
    for (var i = 0, j = 0; i < that.data.trip_list.length; i++) {
      if (e.detail.value == that.data.trip_list[i].travelStartTimeYMD) {
        var list = 'shown_list[' + j + ']'
        j++
        that.setData({
          showtime:e.detail.value,
          [list]: that.data.trip_list[i],
          shown_listL: j
        })
      }
      if (i == (that.data.trip_list.length - 1) && j == 0)
        that.setData({
          showtime: e.detail.value,
          shown_listL: 0
        })
    }
  },
  reloader:function(){
    var that = this
    this.setData({
      shown_list:this.data.trip_list,
      shown_listL: this.data.trip_list.length
    })
  },
  // showModal(e) {
  //   this.setData({
  //     modalName: e.currentTarget.dataset.target
  //   })
  // },
  // hideModal(e) {
  //   this.setData({
  //     modalName: null
  //   })
  // },
  // radioChange(e){
  //   this.setData({
  //     shownIndex:e.detail.value,
  //     shownCar: app.globalData.userCars[e.detail.value].plateNumber
  //   })
  //   this.onShow()
  // },
  onPullDownRefresh(){
    var that= this
    setTimeout(function () {
      that.onLoad();
    },300)
    wx.stopPullDownRefresh()
  },
  showuserinfo: function () {
    wx.navigateTo({
      url: '../user/device/device',
    })
  },

  /**
     * 页面上拉触底事件的处理函数
     */
  onReachBottom: function () {
    console.log("上拉加载")
    let that = this;
    var accountData = wx.getStorageSync(app.globalData.userAccount.account)
    var httpdata = that.data.httpData
    httpdata.plateNumber = accountData.shownCar
    var a=that.data.page+1;
    // 显示加载图标  
    this.setData({
     page:a,
     isHide:true,
      loading: "正在加载......",
    })
    // 上拉获取更多数据
    wx.request({
      url: 'https://xiaochengxu.yunkeiot.cn/car_api/travel/travelList',
      method: 'POST',
      data: {
        version: app.globalData.apiVersion,
        data: JSON.stringify(httpdata),
        accessToken: app.globalData.accessToken,
        page: JSON.stringify(that.data.page),
        orderBy:'start_time',
        descOrAsc:'desc'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        if(res.data.data !=0){
          var trip_list = res.data.data
          for (var i = 0; i < trip_list.length; i++) {
            trip_list[i].travelStartTimeYMD = base.getLocalTimeStyleYMD(trip_list[i].travelStartTime)
            trip_list[i].travelStartTime = base.getLocalTime(trip_list[i].travelStartTime)
            trip_list[i].travelEndTime = base.getLocalTime(trip_list[i].travelEndTime)
            trip_list[i].startGpsLocation.gpsTime = base.getLocalTimeStyleH_m(trip_list[i].startGpsLocation.gpsTime)
            trip_list[i].endGpsLocation.gpsTime = base.getLocalTimeStyleH_m(trip_list[i].endGpsLocation.gpsTime)
          }
          that.setData({
            isHide: true,
          })
          setTimeout(function () {
            that.setData({
              trip_list: that.data.trip_list.concat(trip_list),
              shown_list: that.data.trip_list.concat(trip_list),
              shown_listL: that.data.trip_list.length,
            }) 
          }, 1000)
         
        }else{    
            that.setData({
              isHide: true,
              loading:"没有更多信息"
            })
        }
        console.log(that.data.shown_list)
        console.log(a)
      }
    })
    // // 隐藏加载框  
    setTimeout(function () {
      that.setData({
        isHide: false,
      })
    }, 2000)
    
  },

})