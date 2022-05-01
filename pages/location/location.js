//index.js
//获取应用实例
//6s刷新
/**
 *  line:361,362严重BUG  脏数据处理*****五星级
 * 
 *  ********               ***          ***                ***********
 *  ***      ***           ***          ***             ***************
 *  ***      ****          ***          ***            ****
 *  ***      ***           ***          ***           ****
 *  *** *****              ***          ***          ****        *****
 *  *** *****              ***          ***          ****        ******* 
 *  ***      ***           ***          ***          ****           ****
 *  ***      ****          ***          ***           ****          ****
 *  ***      ***            ****      ****             *****************
 *  ********                    ******                    ************
 * 
 * 
 *        
 */
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
var Promisify = require('../../utils/util.js');
const app = getApp();
var util = require('../../utils/util.js');
var base = require('../../utils/base.js');
var locRecoder = require('../../utils/locrecoder.js')
var recoder;
var zxd=1;//控制中心点不重复移动屏幕,只移动一次，刷新会移动，切换页面会，6秒刷新不会
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '',
    longitude: '',
    latitude1: '39.918097',
    longitude1: '116.397014',
    scale: 16,
    clocation: '',
    markers: [],
    polyline: [],
    timer:'',
    account: {
      account: "",
      password: ""
    },
    version: 'v1.0',
    cscale: 16,
    userCars: '',
    shownCar: '',
    shownIndex: '',
    carChoosed: false,
    userData: '',
    carDetailsHidden: false,
    showGif:true
  },


  onLoad: function() {
    // console.log(app.globalData.userAccount.account)
    // console.log(app.globalData.userAccount.password)
    var that = this;
    console.log("onload")
    this.mCtx = wx.createMapContext('Map', this);
    qqmapsdk = new QQMapWX({
      key: 'RE7BZ-EIQC4-IHTUC-DGJLJ-S6O5E-YAF7V' //'SKBBZ-LK6RX-Z2J4V-ZPIGA-QHGGE-GABSX'
    })
    console.log(app.globalData.timer)
    // clearInterval(app.globalData.timer);
    // app.globalData.timer = ''
    var p = new Promise(function(resolve, reject) { //获得本地位置
      wx.getLocation({
        type: 'gcj02',
        success: function(res) {
          that.setData({
            longitude: res.longitude,
            latitude: res.latitude,
          })
          resolve(res)
        },
        fail: function() {
          reject()
        }
      })
    })


    function getLocal(input) { //通过腾讯地图接口获取当前地理位置信息
      return new Promise(function(resolve, reject) {
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: input.latitude,
            longitude: input.longitude
          },
          success: function(res) {
            let clocation = res.result.address;
            that.setData({
              clocation: clocation,
            });
            resolve()
          },
          fail: function(e) {
            reject()
          }
        })
      })
    }
    function getTrueCar(res) { //通过腾讯地图接口获取当前地理位置信息
      return new Promise(function (resolve, reject) {
        for (var i = 0; i < res.data.data[0].gpsLocations.length;i++)
        {
          res.data.data[0].gpsLocations[i].latitude = locRecoder.gcj_encrypt(res.data.data[0].gpsLocations[i].latitude, res.data.data[0].gpsLocations[i].longitude,1)
          res.data.data[0].gpsLocations[i].longitude = locRecoder.gcj_encrypt(res.data.data[0].gpsLocations[i].latitude, res.data.data[0].gpsLocations[i].longitude, 2)
        }
        console.log(res)
        resolve(res);
      })
    }

    function httpRequest() { //通过api调取车辆信息(包括获取用户账户全部车辆列表，无论是否第一次使用均覆盖缓存)
      return new Promise(function(resolve, reject) {

        wx.request({
          url: 'https://xiaochengxu.yunkeiot.cn/car_api/vehicle/vehicleInfoList',
          method: 'POST',
          data: {
            version: 'v1.0',
            resSrt: 'tessssss',
            accessToken: app.globalData.accessToken,
            data: JSON.stringify({
              "plateNumber": ""
            }),
            page: 1,
            pageSize: 50,
            orderBy: 'created_tm',
            descOrAsc: 'desc'
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success(res) {
            var cars = []
            var userData = res.data.data
            var accountData = {}
            for (var i = 0; i < res.data.data.length; i++) {
              cars[i] = res.data.data[i].plateNumber
              userData[i].dateAdded = base.getLocalTime(userData[i].dateAdded)
            }
            app.globalData.userCars = userData
            accountData.cars = cars
            accountData.user_VehicleInfoList = userData
            //  wx.setStorageSync(app.globalData.userAccount.account, accountData)
            var shownCar = wx.getStorageSync(app.globalData.userAccount.account).shownCar
            if (shownCar != undefined) { //如果有打开过选择过显示车辆，则
              accountData.shownCar = shownCar
              wx.setStorageSync(app.globalData.userAccount.account, accountData)
              for (i = 0; i < cars.length; i++) {
                if (shownCar == cars[i]) {
                  app.globalData.deviceId = res.data.data[i].deviceId
                  that.setData({
                    userCars: cars,
                    userData: userData,
                    shownCar: shownCar,
                    shownIndex: i,
                  })
                  //   if (res.data.data[i].gpsLocation != null) {
                  //     app.globalData.deviceId = res.data.data[i].deviceId
                  //     that.setData({
                  //       userCars: cars,
                  //       userData: userData,
                  //       latitude1: res.data.data[i].gpsLocation.latitude,
                  //       longitude1: res.data.data[i].gpsLocation.longitude,
                  //       shownCar: shownCar,
                  //       shownIndex: i,
                  //       markers: [{
                  //         iconPath: '/image/car1.png',
                  //         latitude: res.data.data[i].gpsLocation.latitude,
                  //         longitude: res.data.data[i].gpsLocation.longitude,
                  //         name: '',
                  //         callout: {
                  //           content: res.data.data[i].gpsLocation.addressText,
                  //           color: '#fff',
                  //           fontSize: 12,
                  //           borderRadius: 10,
                  //           padding: 5,
                  //           borderColor: '#00000090',
                  //           bgColor: '#00000090',
                  //           display: 'BYCLICK'
                  //         },
                  //       }, {
                  //         iconPath: '/image/ditublue.png',
                  //         latitude: that.data.latitude,
                  //         longitude: that.data.longitude,
                  //         name: '',
                  //         callout: {
                  //           content: that.data.clocation,
                  //           color: '#fff',
                  //           fontSize: 12,
                  //           borderRadius: 10,
                  //           padding: 5,
                  //           borderColor: '#00000090',
                  //           bgColor: '#00000090',
                  //           display: 'BYCLICK'
                  //         }
                  //       }, ]
                  //     })
                  //   } else {
                  //     app.globalData.deviceId = res.data.data[i].deviceId
                  //     that.setData({
                  //       userCars: cars,
                  //       userData: userData,
                  //       shownCar: shownCar,
                  //       shownIndex: i,
                  //       latitude1: that.data.latitude,
                  //       longitude1: that.data.longitude,
                  //       markers: [{
                  //         iconPath: '/image/ditublue.png',
                  //         latitude: that.data.latitude,
                  //         longitude: that.data.longitude,
                  //         name: '',
                  //         callout: {
                  //           content: that.data.clocation,
                  //           color: '#fff',
                  //           fontSize: 12,
                  //           borderRadius: 10,
                  //           padding: 5,
                  //           borderColor: '#00000090',
                  //           bgColor: '#00000090',
                  //           display: 'BYCLICK'
                  //         }
                  //       }, ]
                  //     })
                  //     wx.showToast({
                  //       title: '暂时无位置信息',
                  //       icon: 'loading',
                  //       duration: 3000
                  //     })
                  //   }
                  //   break;
                  // }
                }
              }
            } else { //如果没有选择过车辆，则显示车辆为车辆列表第一辆
              accountData.shownCar = res.data.data[0].plateNumber
              wx.setStorageSync(app.globalData.userAccount.account, accountData)
              app.globalData.shownCar = res.data.data[0].plateNumber
              app.globalData.deviceId = res.data.data[0].deviceId
              that.setData({
                userCars: cars,
                userData: userData,
                shownCar: res.data.data[0].plateNumber,
                shownIndex: 0,
              })
              // if (res.data.data[0].gpsLocation != null) {
              //   app.globalData.shownCar = res.data.data[0].plateNumber
              //   app.globalData.deviceId = res.data.data[0].deviceId
              //   that.setData({
              //     userCars: cars,
              //     userData: userData,
              //     latitude1: res.data.data[0].gpsLocation.latitude,
              //     longitude1: res.data.data[0].gpsLocation.longitude,
              //     shownCar: res.data.data[0].plateNumber,
              //     shownIndex: 0,
              //     markers: [{
              //       iconPath: '/image/car1.png',
              //       latitude: res.data.data[0].gpsLocation.latitude,
              //       longitude: res.data.data[0].gpsLocation.longitude,
              //       name: '',
              //       callout: {
              //         content: res.data.data[0].gpsLocation.addressText,
              //         color: '#fff',
              //         fontSize: 12,
              //         borderRadius: 10,
              //         padding: 5,
              //         borderColor: '#00000090',
              //         bgColor: '#00000090',
              //         display: 'BYCLICK'
              //       },
              //     }, {
              //       iconPath: '/image/ditublue.png',
              //       latitude: that.data.latitude,
              //       longitude: that.data.longitude,
              //       name: '',
              //       callout: {
              //         content: that.data.clocation,
              //         color: '#fff',
              //         fontSize: 12,
              //         borderRadius: 10,
              //         padding: 5,
              //         borderColor: '#00000090',
              //         bgColor: '#00000090',
              //         display: 'BYCLICK'
              //       }
              //     }, ]
              //   })
              // } else {
              //   app.globalData.shownCar = res.data.data[0].plateNumber
              //   app.globalData.deviceId = res.data.data[0].deviceId
              //   that.setData({
              //     userCars: cars,
              //     userData: userData,
              //     shownCar: res.data.data[0].plateNumber,
              //     shownIndex: 0,
              //     latitude1: that.data.latitude,
              //     longitude1: that.data.longitude,
              //     markers: [{
              //       iconPath: '/image/ditublue.png',
              //       latitude: that.data.latitude,
              //       longitude: that.data.longitude,
              //       name: '',
              //       callout: {
              //         content: that.data.clocation,
              //         color: '#fff',
              //         fontSize: 12,
              //         borderRadius: 10,
              //         padding: 5,
              //         borderColor: '#00000090',
              //         bgColor: '#00000090',
              //         display: 'BYCLICK'
              //       }
              //     }, ]
              //   })
              //   wx.showToast({
              //     title: '暂时无位置信息',
              //     icon: 'loading',
              //     duration: 3000
              //   })
              // }
            }
            resolve()
          },
          fail: function() {
            reject()
          }
        })
      })
    }

    function liveRequest() {
      return new Promise(function(resolve, reject) {
        var http = {
          "plateNumber": ""
        }
        http.plateNumber = that.data.shownCar
        wx.request({
          url: 'https://xiaochengxu.yunkeiot.cn/car_api/travel/travelPath',
          method: 'POST',
          data: {
            version: 'v1.0',
            accessToken: app.globalData.accessToken,
            data: JSON.stringify(http),
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success(res) {
            //定时器在onload promise中会创建2^n个有重复的金字塔型定时器
            /*定时器编号
                         1
                       2   2
                    3    3    3
                  4    4   4     4
            */
            // app.globalData.timer = setInterval(function () {
            //   that.onLoad();
            // }, 6000)
            console.log(res)
            if (res.data.data.length == 0)
               res.data.data[0] = {gpsLocations:'',travleIsEnd:-1}
            resolve(res);
          },
          fail() {
            reject();
          }
        })
      })
    }
    function setPollyline(res){
      return new Promise(function(resolve,reject){
        
        if (res.data.data[0].travleIsEnd == 0) {
          if (zxd == 1) {
            that.setData({
              latitude1: res.data.data[0].gpsLocations[0].latitude,
              longitude1: res.data.data[0].gpsLocations[0].longitude,
            })
            zxd = zxd + 1;
          }
          that.setData({
            showGif: false,
            polyline: [{
              points: res.data.data[0].gpsLocations,
              color: '#00aeff',
              width: 3
            }],
            
            // elatitude: res.data.data[0].gpsLocations[res.data.data[0].gpsLocations.length - 1].latitude,
            // elongitude: res.data.data[0].gpsLocations[res.data.data[0].gpsLocations.length - 1].longitude,
            // scale: 16,
            markers: [{
              id: 0,
              latitude: res.data.data[0].gpsLocations[0].latitude,
              longitude: res.data.data[0].gpsLocations[0].longitude,
              iconPath: '/image/car_driving_icon.png', //图标路径
              callout: { //可根据需求是否展示经纬度
                content: res.data.data[0].gpsLocations[0].addressText, //that.data.list.startGpsLocation.addressText,
                color: '#fff',
                fontSize: 12,
                borderRadius: 10,
                padding: 5,
                borderColor: '#00000090',
                bgColor: '#00000090',
                display: 'BYCLICK'
              }
            },
            {
              id: 1,
              latitude: res.data.data[0].gpsLocations[res.data.data[0].gpsLocations.length - 1].latitude,
              longitude: res.data.data[0].gpsLocations[res.data.data[0].gpsLocations.length - 1].longitude,
              iconPath: '/image/start.png', //图标路径
              width: 29,
              height: 36,
              callout: { //可根据需求是否展示经纬度
                content: res.data.data[0].gpsLocations[0].addressText, //that.data.list.endGpsLocation.addressText,
                color: '#fff',
                fontSize: 12,
                borderRadius: 10,
                padding: 5,
                borderColor: '#00000090',
                bgColor: '#00000090',
                display: 'BYCLICK'
              }
            }
            ],
          })

        } else if (res.data.data[0].travleIsEnd == 1) {
          if (res.data.data[0].gpsLocations.length != 0) {
            that.setData({
              polyline: '',
              latitude1: res.data.data[0].gpsLocations[0].latitude,
              longitude1: res.data.data[0].gpsLocations[0].longitude,
              showGif: false,
              markers: [{
                id: 0,
                latitude: res.data.data[0].gpsLocations[0].latitude,
                longitude: res.data.data[0].gpsLocations[0].longitude,
                iconPath: '/image/car_stop_icon.png', //图标路径
                callout: { //可根据需求是否展示经纬度
                  content: res.data.data[0].gpsLocations[0].addressText, //that.data.list.startGpsLocation.addressText,
                  color: '#fff',
                  fontSize: 12,
                  borderRadius: 10,
                  padding: 5,
                  borderColor: '#00000090',
                  bgColor: '#00000090',
                  display: 'BYCLICK'
                }
              }]
            })
          } else {
            that.setData({
              markers: '',
              polyline: '',
              latitude1: that.data.latitude,
              longitude1: that.data.longitude,
              showGif: false
            })  
            wx.showToast({
              title: '暂无车辆位置信息',
              icon: 'none',
              duration: 1000,//持续的时间
            })
            clearInterval(app.globalData.timer)
            // wx.showModal({
            //   title: '提示',
            //   content: '这是一个模态弹窗',
            //   success: function (res) {
            //     if (res.confirm) {//这里是点击了确定以后
            //       console.log('用户点击确定')
            //     }
            //   }
            // })
          }
        } else if (res.data.data[0].travleIsEnd == -1) {
          that.setData({
            markers: '',
            polyline: '',
            latitude1: that.data.latitude,
            longitude1: that.data.longitude,
            showGif:false
          })
          wx.showToast({
            title: '暂无车辆位置信息',
            icon: 'none',
            duration: 1000,//持续的时间
          })
          clearInterval(app.globalData.timer)
        }
      })
      resolve();
    }
    p.then(getLocal)
      .then(httpRequest)
      .then(liveRequest)
      .then(getTrueCar)
      .then(setPollyline)
  },



  onReady: function() {},
  onHide:function(){
    clearInterval(app.globalData.timer)
  },
  

  onShow: function() {
    var that = this
    var shownCar = wx.getStorageSync(app.globalData.userAccount.account).shownCar
    // var cars = wx.getStorageSync(app.globalData.userAccount.account).cars
    // var userData = wx.getStorageSync(app.globalData.userAccount.account).user_VehicleInfoList
    //定时器在onshow中只会创建一个
    zxd =1;
    console.log("onshow")
    app.globalData.timer = setInterval(function () {
      that.onLoad();
    }, 6000)
    if (shownCar != that.data.shownCar) {
      // clearInterval(app.globalData.timer);
      // app.globalData.timer = ''
      that.setData({
        showGif:true
      })
      that.onLoad();
    }
  },
  /*
    异步调用解决方法取自
    https://blog.csdn.net/m0_37992327/article/details/70258302
    设置定时器，比起promise优点，解决重复点击事件，不至于线程卡顿，缺点，嵌套复杂，调用复杂
  */
  refresh: function() {
    var that = this
    zxd=1
   
    that.onLoad()
  },

  minusmap: function() {
    let that = this;
    var currentScale = that.data.cscale;
    if (currentScale == 5)
      that.setData({
        scale: 5
      })
    else
      that.setData({
        scale: currentScale - 1
      })
  },

  plusmap: function() {
    let that = this;
    var currentScale = that.data.cscale;
    if (currentScale == 19)
      that.setData({
        scale: 19
      })
    else
      that.setData({
        scale: currentScale + 1
      })
  },
  regionChange: function(e) {
    if (e.type == 'end')
      this.mCtx.getScale({
        success: res => {
          this.setData({
            cscale: res.scale
          })
        }
      })
  },
  getCenterLocation: function() {
    var that = this
    this.mCtx.moveToLocation()
    // this.mCtx.getCenterLocation({
    //   success: function(res) {
    //     that.setData({
    //       scale: 14
    //     })
    //   }
    // })
  }, //获取并移动到当前所在位置

  //  showModal:function(){
  //    var item = JSON.stringify(this.data.userCars)
  //    this.setData({
  //      carChoosed:false
  //    })
  //    wx.navigateTo({
  //      url: '../cars/cars?item=' + item + '&now=' + this.data.shownCar
  //    })
  //  },
  //  showModals(e){
  //   this.setData({
  //     carDetailsHidden: true,
  //   })
  //  },
  //  hideModals:function(){
  //    this.setData({
  //      carDetailsHidden:false
  //    })
  //  }
  // showModal(e) {
  //   console.log('taped')
  //   this.setData({
  //     modalName: e.currentTarget.dataset.target,
  //     hiddenmodal:false
  //   })
  // },
  // hideModal(e) {
  //   this.setData({
  //     modalName: null,
  //     hiddenmodal:true
  //   })
  // },
  // radioChange(e) {
  //   var that = this
  //   var index = e.detail.value
  //   if (that.data.userCars[index].gpsLocation != null) {
  //     that.setData({
  //       markers: [{
  //         iconPath: '/image/car.png',
  //         latitude: that.data.userCars[index].gpsLocation.latitude,
  //         longitude: that.data.userCars[index].gpsLocation.longitude,
  //         name: '',
  //         callout: {
  //           content: that.data.userCars[index].gpsLocation.addressText,
  //           color: '#fff',
  //           fontSize: 12,
  //           borderRadius: 10,
  //           padding: 5,
  //           borderColor: '#00000090',
  //           bgColor: '#00000090',
  //           display: 'BYCLICK'
  //         }
  //       }, {
  //         iconPath: '/image/ditublue.png',
  //         latitude: that.data.latitude,
  //         longitude: that.data.longitude,
  //         name: '',
  //         callout: {
  //           content: that.data.clocation,
  //           color: '#fff',
  //           fontSize: 12,
  //           borderRadius: 10,
  //           padding: 5,
  //           borderColor: '#00000090',
  //           bgColor: '#00000090',
  //           display: 'BYCLICK'
  //         }
  //       }]
  //     })
  //   } else {
  //     that.setData({
  //       markers:[{
  //         iconPath: '/image/ditublue.png',
  //         latitude: that.data.latitude,
  //         longitude: that.data.longitude,
  //         name: '',
  //         callout: {
  //           content: that.data.clocation,
  //           color: '#fff',
  //           fontSize: 12,
  //           borderRadius: 10,
  //           padding: 5,
  //           borderColor: '#00000090',
  //           bgColor: '#00000090',
  //           display: 'BYCLICK'
  //         }
  //       }]
  //     })
  //   }
  //   that.hideModal()
  // }
})
//定时器预览程序时有卡顿，改为promise
// getLocal: function (latitude, longitude){
//   let that = this;
//   qqmapsdk.reverseGeocoder({
//     location:{
//       latitude:latitude,
//       longitude:longitude
//     },
//     success:function(res){
//     //  console.log(JSON.stringify(res));
//       let province = res.result.ad_info.province;
//       let city = res.result.ad_info.city;
//       let district = res.result.ad_info.district;
//       let clocation = res.result.address; 
//       that.setData({
//         province:province,
//         city:city,
//         district:district,
//         clocation:clocation,
//       });            
//     }
//   })
// }
// wx.getLocation({
//   type: 'gcj02',
//   success: function (res) {
//     that.setData({
//       longitude: res.longitude,
//       latitude: res.latitude,
//     });
//     that.getLocal(that.data.latitude,that.data.longitude);
//   },
// })
// var times = setInterval(function () {
//   if(app.globalData.accessToken&&that.data.clocation){
//     wx.request({
//       url: 'http://47.107.190.49:8082/car_api/vehicle/vehicleInfoList',
//       method: 'POST',
//       data: {
//         version: 'v1.0',
//         resSrt: 'tessssss',
//         accessToken: app.globalData.accessToken,
//         data: JSON.stringify({ "plateNumber": "粤B64592" }),
//         page: 1,
//         pageSize: 20,
//         orderBy: 'created_tm',
//         descOrAsc: 'desc'
//       },
//       header: {
//         'content-type': 'application/x-www-form-urlencoded' // 默认值
//       },
//       success(res) {
//         app.globalData.deviceId = res.data.data[0].deviceId
//         that.setData({
//           markers: [{
//             iconPath: '/image/car.png',
//             latitude: res.data.data[0].gpsLocation.latitude,
//             longitude: res.data.data[0].gpsLocation.longitude,
//             name: '',
//             callout: {
//               content: res.data.data[0].gpsLocation.addressText,
//               color: '#fff',
//               fontSize: 12,
//               borderRadius: 10,
//               padding: 5,
//               borderColor: '#00000090',
//               bgColor: '#00000090',
//               display: 'BYCLICK'
//             },
//           },
//             {
//               iconPath: '/image/ditublue.png',
//               latitude: that.data.latitude,
//               longitude: that.data.longitude,
//               name: '',
//               callout: {
//                 content: that.data.clocation,
//                 color: '#fff',
//                 fontSize: 12,
//                 borderRadius: 10,
//                 padding: 5,
//                 borderColor: '#00000090',
//                 bgColor: '#00000090',
//                 display: 'BYCLICK'
//               },
//             }]
//         })
//         try{
//           wx.setStorageSync('vehicleInfoList', res.data)
//         }
//         catch(e){
//           console.log('vehicleInfoList setStorage failed')
//         }
//       }
//     })
//     clearTimeout(times);
//   }
// })





/*
   Promise 
     起初采用Promise方法解决 放大/缩小 地图无法从现有scale开始计算的问题，进行后因有Promise本身
   缺点限制原因放弃使用。（BUG：反复点击 放大/缩小 会造成界面反复放大缩小，流程卡顿） 
     Promise缺点。无法取消Promise，一旦新建它就会立即执行，无法中途取消。
   如果某些事件不断地反复发生，一般来说，使用 Stream 模式是比部署Promise更好的选择。            （http://es6.ruanyifeng.com/#docs/promise）
*/

// minusmap: function() {
//   let that = this;
//   function setCScale(input) {
//     return new Promise(function (resolve, reject) {
//       that.setData({
//         scale: input
//       })
//       if (that.data.scale == input)
//         resolve();
//       else
//         reject();
//     })
//   };
//   function setMinus() {
//     return new Promise(function (resolve, reject) {
//       var currentScale = that.data.scale;
//       if (currentScale == 5)
//         that.setData({
//           scale: 5
//         })
//       else
//         that.setData({
//           scale: currentScale - 1
//         })
//       resolve();
//     })
//   };
//   var p = new Promise(function (resolve, reject) {
//     that.mapCtx.getScale(
//       {
//         success: function (res) {
//           resolve(res.scale);
//         }
//       }
//     )
//   })
//   p.then(setCScale)
//     .then(setMinus)
// },

// plusmap: function () {
//   let that = this;
//   function setCScale(input) {
//     return new Promise(function (resolve, reject) {
//       that.setData({
//         scale: input
//       })
//       if (that.data.scale == input) {
//         resolve();
//       }
//       else
//         reject();
//     })
//   };
//   function setPlus() {
//     return new Promise(function (resolve, reject) {
//       var currentScale = that.data.scale;
//       if (currentScale == 19)
//         that.setData({
//           scale: 19
//         })
//       else
//         that.setData({
//           scale: currentScale + 1
//         })
//       resolve();
//     })
//   };
//   var p = new Promise(function (resolve, reject) {
//     that.mapCtx.getScale(
//       {
//         success: function (res) {
//           resolve(res.scale);
//         }
//       }
//     )
//   })
//   p.then(setCScale)
//     .then(setPlus)
// },