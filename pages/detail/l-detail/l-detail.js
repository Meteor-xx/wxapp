// pages/detail/l-detail/l-detail.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
var qqmapsdk;
const app = getApp();
var locRecoder = require('../../../utils/locrecoder.js')
var recoder;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: '',
    longitude: '',
    latitude1: '39.913607',
    longitude1: '116.403694',
    clocation: '',

    elatitude: '',
    elongitude: '',
    st: null,
    _end: null,

    scale: '14',
    cscale: '',

    list: '',
    markers: [],
    polyline: '',
    showModal:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.mapCtx = wx.createMapContext('myMap', this);
    var item = JSON.parse(options.item)
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        that.setData({
          latitude1: res.latitude,
          longitude1: res.longitude,
          isHidden: false,
        })
      }
    })
    that.setData({
      list: item
    });
    var tid = (item.tvavelId).toString();
    var jsonId = {
      travelId: tid
    }

    qqmapsdk = new QQMapWX({
      key: 'RE7BZ-EIQC4-IHTUC-DGJLJ-S6O5E-YAF7V' //'SKBBZ-LK6RX-Z2J4V-ZPIGA-QHGGE-GABSX'
    })
    var p = new Promise(function(resolve, reject) {
      wx.request({
        url: 'https://xiaochengxu.yunkeiot.cn/car_api/travel/travelInfo',
        method: 'POST',
        data: {
          version: app.globalData.apiVersion,
          data: JSON.stringify(jsonId),
          accessToken: app.globalData.accessToken
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        success(res) {
          for (var i = 0; i < res.data.data[0].gpsLocations.length; i++) {
            res.data.data[0].gpsLocations[i].latitude = locRecoder.gcj_encrypt(res.data.data[0].gpsLocations[i].latitude, res.data.data[0].gpsLocations[i].longitude, 1)
            res.data.data[0].gpsLocations[i].longitude = locRecoder.gcj_encrypt(res.data.data[0].gpsLocations[i].latitude, res.data.data[0].gpsLocations[i].longitude, 2)
          }
          resolve(res);
        },
        fail: function() {
          reject();
        }
      })
    })

    function setPollyline(res) {
      return new Promise(function(resolve, reject) {
        if (res.data.data[0].gpsLocations.length != 0) {
          that.setData({
            polyline: [{
              points: res.data.data[0].gpsLocations,
              color: '#00aeff',
              width: 3
            }]
          })
          that.setData({
            showModal:false,
            latitude: res.data.data[0].gpsLocations[0].latitude,
            longitude: res.data.data[0].gpsLocations[0].longitude,
            elatitude: res.data.data[0].gpsLocations[res.data.data[0].gpsLocations.length - 1].latitude,
            elongitude: res.data.data[0].gpsLocations[res.data.data[0].gpsLocations.length - 1].longitude,
            markers: [{
                id: 0,
                latitude: res.data.data[0].gpsLocations[0].latitude,
                longitude: res.data.data[0].gpsLocations[0].longitude,
                iconPath: '../../../image/end.png', //图标路径
                width: 29,
                height: 36,
                callout: { //可根据需求是否展示经纬度
                  content: that.data.list.endGpsLocation.addressText,
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
                iconPath: '../../../image/start.png', //图标路径
                width: 29,
                height: 36,
                callout: { //可根据需求是否展示经纬度
                  content: that.data.list.startGpsLocation.addressText,
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
          that.mapCtx.includePoints({
            padding: [10],
            points: [{
              latitude: that.data.markers[0].latitude,
              longitude: that.data.markers[0].longitude,
            }, {
              latitude: that.data.markers[1].latitude,
              longitude: that.data.markers[1].longitude,
            }]
          })
        } else {
          that.setData({
            showModal: false,
          })
          wx.showToast({
            title: '暂无车辆位置信息',
            icon: 'none',
            duration: 1000,//持续的时间
          })
        }
        resolve();
      })
    }
    p.then(setPollyline)
  },

  refresh: function(e) {
    var that = this
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: that.data.markers[0].latitude,
        longitude: that.data.markers[0].longitude,
      }, {
        latitude: that.data.markers[1].latitude,
        longitude: that.data.markers[1].longitude,
      }]
    })
  },

  getCenterLocation: function() {
    var that = this
    this.mapCtx.moveToLocation()
    // this.mapCtx.getCenterLocation({
    //   success: function (res) {
    //     that.setData({
    //       scale: 14,
    //     })
    //   }
    // })
  }, //获取并移动到当前所在位置

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
  }, //缩小

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
  }, //放大
  // regionChange: function (e) {
  //   if (e.type == 'end')
  //     this.mapCtx.getScale({
  //       success: res => {
  //         this.setData({
  //           cscale: res.scale
  //         })
  //       }
  //     })
  // }//缩放级别
})

//   function startGeocoder(address) {
//     return new Promise(function (resolve, reject) {
//       //调用地址解析接口
//       qqmapsdk.geocoder({
//         address: address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
//         success: function (res) {//成功后的回调
//           var sres = res.result;
//           var slatitude = sres.location.lat;
//           var slongitude = sres.location.lng;
//           var string = 'markers[' + 0 + ']'  //解决方案出自https://blog.csdn.net/qq_36618620/article/details/84865598
//           //根据地址解析在地图上标记解析地址位置
//           that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
//             latitude: slatitude,
//             longitude: slongitude,
//             /* [st]:{
//                latitude:slatitude,
//                longitude:slongitude
//              },*/
//             st: slatitude + ',' + slongitude,
//             [string]: {
//               id: 0,
//               title: sres.title,
//               latitude: slatitude,
//               longitude: slongitude,
//               iconPath: '../../../image/start.png',//图标路径
//               width: 20,
//               height: 20,
//               callout: { //可根据需求是否展示经纬度
//                 content: slatitude + ',' + slongitude,
//                 color: '#fff',
//                 fontSize: 12,
//                 borderRadius: 10,
//                 padding: 5,
//                 borderColor: '#00000090',
//                 bgColor: '#00000090',
//                 display: 'BYCLICK'
//               }
//             },
//             poi: { //根据自己data数据设置相应的地图中心坐标变量名称
//               latitude: slatitude,
//               longitude: slongitude
//             }
//           });
//         },
//         fail: function (error) {
//           console.error(error);
//           reject();
//         },
//         complete: function (res) {
//           resolve(that.data.list.end);
//         }
//       })
//     })

//   }

//       function endGeocoder(address) {
//     return new Promise(function (resolve, reject) {
//       //调用地址解析接口
//       qqmapsdk.geocoder({
//         address: address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
//         success: function (res) {//成功后的回调
//           var eres = res.result;
//           var elatitude = eres.location.lat;
//           var elongitude = eres.location.lng;
//           var string1 = 'markers[' + 1 + ']';
//           //根据地址解析在地图上标记解析地址位置
//           that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
//             elatitude: elatitude,
//             elongitude: elongitude,
//             _end: elatitude + ',' + elongitude,
//             [string1]: {
//               id: 1,
//               title: eres.title,
//               latitude: elatitude,
//               longitude: elongitude,
//               iconPath: '../../../image/end.png',//图标路径
//               width: 20,
//               height: 20,
//               callout: { //可根据需求是否展示经纬度
//                 content: elatitude + ',' + elongitude,
//                 color: '#fff',
//                 fontSize: 12,
//                 borderRadius: 10,
//                 padding: 5,
//                 borderColor: '#00000090',
//                 bgColor: '#00000090',
//                 display: 'BYCLICK'
//               }
//             },
//           });
//         },
//         fail: function (error) {
//           console.error(error);
//           reject();
//         },
//         complete: function (res) {
//           resolve();
//         }
//       })
//     })
//   }


//       function wxDirection(st, ed) {
//     return new Promise(function (resolve, reject) {
//       qqmapsdk.direction({
//         mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
//         //from参数不填默认当前地址
//         from: that.data.st,
//         to: that.data._end,
//         success: function (res) {
//           var ret = res;
//           var coors = ret.result.routes[0].polyline, pl = [];
//           //坐标解压（返回的点串坐标，通过前向差分进行压缩）
//           var kr = 1000000;
//           for (var i = 2; i < coors.length; i++) {
//             coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
//           }
//           //将解压后的坐标放入点串数组pl中
//           for (var i = 0; i < coors.length; i += 2) {
//             pl.push({ latitude: coors[i], longitude: coors[i + 1] })
//           }
//           //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
//           that.setData({
//             polyline: [{
//               points: pl,
//               color: '#00aeff',
//               width: 3
//             }]
//           })
//         },
//         fail: function (error) {
//           console.error(error);
//           reject();
//         },
//         complete: function (res) {
//           resolve();
//         }
//       })
//     })
//   }

//       var p = new Promise(function (resolve, reject) {
//   resolve(that.data.list.start);
// })
// /*
//   Promise处理单次调用异步方便快捷
// */


// p.then(startGeocoder)
//   .then(endGeocoder)
//   .then(wxDirection)