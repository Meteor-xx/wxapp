/*待完善
  76
*/
const app = getApp();
var util = require('../../utils/util.js');
var base = require('../../utils/base.js')
Page({

  data: {
    isHide: false,
    loading: "",
    page: 1,
    date: '',
    shown_list: '',
    warn_list: '',
    deviceId: '',
    httpData: {
      "plateNumber": "",
      "dataType": 0
    },
    userCars: '',
    shownCar: '',
    // modalName: '',
    shownIndex: '',
    shown_listL: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var httpdata = that.data.httpData
    var accountData = wx.getStorageSync(app.globalData.userAccount.account)
    httpdata.plateNumber = accountData.shownCar
    that.setData({
      httpData: httpdata,
      shownCar: httpdata.plateNumber,
      deviceId: app.globalData.deviceId,
      page: 1,
    })
    wx.request({
      url: 'https://xiaochengxu.yunkeiot.cn/car_api/alarm/alarmList',
      method: 'POST',
      data: {
        version: app.globalData.apiVersion,
        data: JSON.stringify(httpdata),
        accessToken: app.globalData.accessToken,
        descOrAsc: 'desc',
        orderBy: 'machine_time'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        var warn_list = res.data.data
        for (var i = 0; i < warn_list.length; i++) {
          warn_list[i].alarmTimeYMD = base.getLocalTimeStyleYMD(warn_list[i].alarmTime)
          warn_list[i].alarmTime = base.getLocalTime(warn_list[i].alarmTime)
          if (warn_list[i].startGpsLocation.addressText == "")
            warn_list[i].startGpsLocation.addressText = null
          switch (warn_list[i].dataType) {
            case 0:
              warn_list[i].dataType = '全部告警';
              break;
            case 1:
              warn_list[i].dataType = '普通告警';
              warn_list[i].iconPath = '/image/dot_b.png'
              warn_list[i].style = 'sticker_b'
              break;
            case 2:
              warn_list[i].dataType = '驾驶行为';
              warn_list[i].iconPath = '/image/dot_y.png'
              warn_list[i].style = 'sticker_y'
              break;
            case 3:
              warn_list[i].dataType = '严重告警';
              warn_list[i].iconPath = '/image/dot_r.png'
              warn_list[i].style = 'sticker_r'
              break;
            case 4:
              warn_list[i].dataType = '故障';
              warn_list[i].iconPath = '/image/dot_r.png'
              warn_list[i].style = 'sticker_r'
              break;
            case 5:
              warn_list[i].dataType = '电子围栏';
              warn_list[i].iconPath = '/image/dot_gray.png'
              warn_list[i].style = 'sticker_gray'
              break;
            case 6:
              warn_list[i].dataType = '安防';
              warn_list[i].iconPath = '/image/dot_b.png'
              warn_list[i].style = 'sticker_b'
              break;
            case 7:
              warn_list[i].dataType = 'ACC';
              warn_list[i].iconPath = '/image/dot_g.png'
              warn_list[i].style = 'sticker_g'
              break;
            case 8:
              warn_list[i].dataType = '电动车';
              warn_list[i].iconPath = '/image/dot_g.png'
              warn_list[i].style = 'sticker_g'
              break;
            case 9:
              warn_list[i].dataType = '设备上报';
              warn_list[i].iconPath = '/image/dot_g.png';
              warn_list[i].style = 'sticker_g';
              break;
          }
          // startGpsLocation/endGpsLocation.gpsTime转换 部分会出现-9999缺少逻辑判断     *76
        }
        that.setData({
          warn_list: warn_list,
          shown_list: warn_list,
          shown_listL: warn_list.length,
          shownCar: httpdata.plateNumber
        })
      }
    })


    if (app.globalData.user_time) {
      that.setData({
        date: app.globalData.user_time
      })
    } else {
      var time = util.formatDate(new Date());
      app.globalData.user_time = time
      that.setData({
        date: app.globalData.user_time
      })
    }
    console.log("onload")
  },


  onShow: function() {
    var that = this
    var shownCar = wx.getStorageSync(app.globalData.userAccount.account).shownCar
    if (shownCar != that.data.shownCar) {
      that.onLoad();
    }
    console.log("onshow")

  },



  bindDateChange(e) {
    var that = this
    that.setData({
      shown_list: ''
    })

    for (var i = 0, j = 0; i < that.data.warn_list.length; i++) {
      if (e.detail.value == that.data.warn_list[i].alarmTimeYMD) {
        var list = 'shown_list[' + j + ']'
        j++
        that.setData({
          [list]: that.data.warn_list[i],
          shown_listL: j
        })
      }
      if (i == (that.data.warn_list.length - 1) && j == 0)
        that.setData({
          shown_listL: 0
        })
    }
  },
  itemtaped: function(e) {
    var item = JSON.stringify(e.currentTarget.dataset.item)
    wx.navigateTo({
      url: '../detail/w-detail/w-detail?item=' + item
    })
  },
  reloader: function() {
    this.setData({
      shown_list: this.data.warn_list
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
  // radioChange(e) {
  //   this.setData({
  //     shownIndex: e.detail.value,
  //     shownCar: app.globalData.userCars[e.detail.value].plateNumber
  //   })
  //   this.onShow()
  // },
  onPullDownRefresh() {
    var that = this
    setTimeout(function() {
      that.onShow();
    }, 300)
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log("上拉加载")
    var that = this
    var httpdata = that.data.httpData
    var accountData = wx.getStorageSync(app.globalData.userAccount.account)
    httpdata.plateNumber = accountData.shownCar
    var a = that.data.page + 1;

    this.setData({
      page: a,
      isHide: true, // 显示加载图标
      loading: "正在加载......",
    })
    // 上拉获取更多数据
    wx.request({
      url: 'https://xiaochengxu.yunkeiot.cn/car_api/alarm/alarmList',
      method: 'POST',
      data: {
        version: app.globalData.apiVersion,
        data: JSON.stringify(httpdata),
        accessToken: app.globalData.accessToken,
        page: JSON.stringify(that.data.page),
        descOrAsc: 'desc',
        orderBy: 'machine_time'
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      success(res) {
        console.log(res)
        if (res.data.data != 0) {
          var warn_list = res.data.data
          for (var i = 0; i < warn_list.length; i++) {
            warn_list[i].alarmTimeYMD = base.getLocalTimeStyleYMD(warn_list[i].alarmTime)
            warn_list[i].alarmTime = base.getLocalTime(warn_list[i].alarmTime)
            if (warn_list[i].startGpsLocation.addressText == "")
              warn_list[i].startGpsLocation.addressText = null
            switch (warn_list[i].dataType) {
              case 0:
                warn_list[i].dataType = '全部告警';
                break;
              case 1:
                warn_list[i].dataType = '普通告警';
                warn_list[i].iconPath = '/image/dot_b.png'
                warn_list[i].style = 'sticker_b'
                break;
              case 2:
                warn_list[i].dataType = '驾驶行为';
                warn_list[i].iconPath = '/image/dot_y.png'
                warn_list[i].style = 'sticker_y'
                break;
              case 3:
                warn_list[i].dataType = '严重告警';
                warn_list[i].iconPath = '/image/dot_r.png'
                warn_list[i].style = 'sticker_r'
                break;
              case 4:
                warn_list[i].dataType = '故障';
                warn_list[i].iconPath = '/image/dot_r.png'
                warn_list[i].style = 'sticker_r'
                break;
              case 5:
                warn_list[i].dataType = '电子围栏';
                warn_list[i].iconPath = '/image/dot_gray.png'
                warn_list[i].style = 'sticker_gray'
                break;
              case 6:
                warn_list[i].dataType = '安防';
                warn_list[i].iconPath = '/image/dot_b.png'
                warn_list[i].style = 'sticker_b'
                break;
              case 7:
                warn_list[i].dataType = 'ACC';
                warn_list[i].iconPath = '/image/dot_g.png'
                warn_list[i].style = 'sticker_g'
                break;
              case 8:
                warn_list[i].dataType = '电动车';
                warn_list[i].iconPath = '/image/dot_g.png'
                warn_list[i].style = 'sticker_g'
                break;
              case 9:
                warn_list[i].dataType = '设备上报';
                warn_list[i].iconPath = '/image/dot_g.png';
                warn_list[i].style = 'sticker_g';
                break;
            }
            // startGpsLocation/endGpsLocation.gpsTime转换 部分会出现-9999缺少逻辑判断     *76
          }
          console.log(warn_list)
          that.setData({
            isHide: true,
          })
          setTimeout(function() {
            that.setData({
              warn_list: that.data.warn_list.concat(warn_list),
              shown_list: that.data.warn_list.concat(warn_list),
              shown_listL: that.data.warn_list.length,
            })
          }, 1000)

        } else {
          that.setData({
            isHide: true,
            loading: "没有更多信息"
          })
        }
        console.log(that.data.warn_list)
        console.log(that.data.warn_list.length)
      }
    })
    // // 隐藏加载框  
    setTimeout(function() {
      that.setData({
        isHide: false,
      })
    }, 2000)


  },


})