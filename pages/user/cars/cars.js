// pages/cars/cars.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCars:'',
    shownCar:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item = JSON.parse(options.item)
    var shownCar = options.now
    console.log(options) 
    this.setData({
      shownCar: shownCar,
      userCars: item
    });
  },
  radioChange:function(e){
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      shownIndex:e.detail.value,
      carChoosed:true
    })
    wx.navigateBack({})
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
})