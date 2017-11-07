// pages/error/error.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [
      '出现未知错误',
      '对不起，该小程序本城市暂未开放 ，敬请期待。',
      '无法获取地理位置，请退出小程序，重新进入。',
      '抱歉，需要获取您的地理授权，才能访问',
    ],
    message: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var t = options.type;
    t = parseInt(t);
    var messages = this.data.messages;
    if( t == undefined || t < 0 || t >= messages.length){
      t = 0;
    }
    this.setData({
      message: messages[t]
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