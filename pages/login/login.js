//获取应用实例
const app = getApp()

Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    account: { account: "", password: "" },
    version: 'v1.0',
    user_account:'',
    user_password:'',
    userNoEnter:false,
    userErrorInput:false,
    isChecked:true,
    accountValue: '',//点击结果项之后替换到文本框的值
    keyValue:'',
    bindSource: [],
    scrollHide:false
  },

  onLoad: function () {
    
  },
  onShow:function(){
    var that = this;
    var lastAccount = wx.getStorageSync('lastAccount')
    if (lastAccount != '') {
      app.globalData.userAccount.account = lastAccount.account
      app.globalData.userAccount.password = lastAccount.password
      this.setData({
        keyValue: lastAccount.password,
        accountValue: lastAccount.account
      })
      console.log(lastAccount)
    }

    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo'] && res.authSetting['scope.userLocation']) {
          // wx.getUserInfo({
          //   success: function (res) {
          //     // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
          //     // 根据自己的需求有其他操作再补充
          //     // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
          //     app.globalData.userInfo = res.userInfo
          //     wx.login({
          //       success: res => {
          //         // 获取到用户的 code 之后：res.code
          //         console.log("用户的code:" + res.code);
          //         // 可以传给后台，再经过解析获取用户的 openid
          //         // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
          //         // wx.request({
          //         //     // 自行补上自己的 APPID 和 SECRET
          //         //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=' + res.code + '&grant_type=authorization_code',
          //         //     success: res => {
          //         //         // 获取到用户的 openid
          //         //         console.log("用户的openid:" + res.data.openid);
          //         //     }
          //         // });
          //       }
          //     });
          //   }
          // });
          that.setData({ isHide: true })//如果具有授权权限，进入登录页面
        } else if (!res.authSetting['scope.userLocation']) {
          that.setData({ isHide: true })//如果没有位置权限，进入登录页面并获取位置权限
          wx.authorize({
            scope: 'scope.userLocation',
            success: function () {
            },
            fail: function () {
              console.log('failed')
              wx.showModal({
                title: '警告',
                content: '您拒绝了位置授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '前往授权',
                success: function (res) {
                  // 用户没有授权成功，不需要改变 isHide 的值
                  if (res.confirm) {
                    console.log('用户点击了“前往授权”');
                    wx.openSetting({})
                  }
                }
              });
            }
          })
        } else if (!res.authSetting['scope.userInfo']) {
          that.setData({//如果没有用户权限，进入登陆页面通过bindGetUserinfo获得
            isHide: true
          })
        }
      }
    });
  },
  bindGetUserInfo: function (e) {
    var that = this
    var accounts = {'accounts':[],'password':[]}
    accounts = wx.getStorageSync('accounts')
    if(accounts == '')
      accounts = { 'accounts': [], 'password': [] }
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      // 获取到用户的信息了，打印到控制台上看下
      console.log("用户的信息如下：");
      console.log(e.detail.userInfo);
      console.log(app.globalData.userAccount.account + "  " + app.globalData.userAccount.password)
      app.globalData.userInfo = e.detail.userInfo;
      wx.login({
        success: res => {
          // 获取到用户的 code 之后：res.code
          console.log("用户的code:" + res.code);
          // 可以传给后台，再经过解析获取用户的 openid
          // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
          // wx.request({
          //     // 自行补上自己的 APPID 和 SECRET
          //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=' + res.code + '&grant_type=authorization_code',
          //     success: res => {
          //         // 获取到用户的 openid
          //         console.log("用户的openid:" + res.data.openid);
          //     }
          // });
        }
      });
      if (app.globalData.userAccount.account == "" || app.globalData.userAccount.password == "") {
        that.setData({
          userNoEnter: true
        })
      }else{
        wx.request({
          url: 'https://xiaochengxu.yunkeiot.cn/car_api/admin/login',
          method: 'POST',
          data: {
            version: that.data.version,
            data: JSON.stringify(app.globalData.userAccount)
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          success(res) {
            if (res.data.resCode == 1000) {
              try { wx.setStorageSync('user_data', res.data) }
              catch (e) { console.log('setStorage failed!!!') }
              app.globalData.accessToken = res.data.data.accessToken
              app.globalData.userId = res.data.data.id 
              var flag = true;       
              if(that.data.isChecked)
              {
                for(var i=0;i<accounts.accounts.length;i++)
                {
                  if(accounts.accounts[i]==app.globalData.userAccount.account)
                  {
                    var flag = false;
                    break;
                  }
                }
                if(flag)
                {
                  accounts.accounts[accounts.accounts.length] = app.globalData.userAccount.account
                  accounts.password[accounts.password.length] = app.globalData.userAccount.password
                  wx.setStorageSync('accounts', accounts)
                }
                var lastAccount = { 'account': '', 'password': '' }
                lastAccount.account = app.globalData.userAccount.account
                lastAccount.password = app.globalData.userAccount.password
              }else{
                var lastAccount = { 'account': '', 'password': '' }
                lastAccount.account = app.globalData.userAccount.account
              }
              wx.setStorageSync('lastAccount', lastAccount)
              wx.reLaunch({
                url: '../location/location',//'../detail/l-detail/l-detail',
              })
            } else {
              that.setData({
                userErrorInput: true
              })
              that.onShow();
            }
          }
        }) 
      }     
    } else {
      //用户按了拒绝按钮
      that.sModal();
    }
  },
  sModal:function(){
    var that = this;
    wx.showModal({
      title: '警告',
      content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
      showCancel: false,
      confirmText: '前往授权',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击了“前往授权”');
          wx.openSetting({})
        }
      }
    });
  },
  userAccountInput:function(e){
    var that = this
    console.log('input')
    app.globalData.userAccount.account = e.detail.value
    accounts = wx.getStorageSync('accounts')
    if (accounts == '')
      var accounts = { 'accounts': [], 'password': [] }
    this.setData({
      userErrorInput: false,
      userNoEnter: false
    })
    var prefix = e.detail.value//用户实时输入值
    var newSource = []//匹配的结果
    if (prefix != "") {
      accounts.accounts.forEach(function (e) {
        if (e.indexOf(prefix) != -1) {
          newSource.push(e)
        }
      })
    }
    if (newSource.length != 0) {
      this.setData({
        bindSource: newSource,
        scrollHide:true
      })
    } else {
      this.setData({
        bindSource: [],
        scrollHide:false
      })
    }
  },
  userPasswordInput: function (e) {
    app.globalData.userAccount.password = e.detail.value
    this.setData({
      userErrorInput: false,
      userNoEnter: false
    })
  },
  checkboxChanged:function(e){
    if(e.detail.value == '')
      var isChecked = false
    else if(e.detail.value == 'true')
      var isChecked = true
    this.setData({
      isChecked: isChecked
    })
  },
  itemtap: function (e) {
    var that = this
    var accounts = wx.getStorageSync('accounts')
    accounts.accounts.forEach(function (k,index) {
      if (k == e.target.id) {
        var key = accounts.password[index]
        app.globalData.userAccount.account = e.target.id
        app.globalData.userAccount.password = key
        that.setData({
          accountValue: e.target.id,
          keyValue: key,
          bindSource: [],
          scrollHide:false
        })
      }
    })
  },
  screenTaped:function(e){
    this.setData({
      scrollHide:false
    })
  }
})