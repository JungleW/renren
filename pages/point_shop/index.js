// pages/point_shop/index.js
// var app = getApp();
var t = getApp(), a = t.requirejs("core");
var e = getApp(), r = e.requirejs("core"), t = e.requirejs("wxParse/wxParse");
Page({
  data: {
    route: "member",
    icons: e.requirejs("icons"),
    member: {},
    winHeight: "",
    //窗口高度 
    currentTab: 0,
    //预设当前项的值
    scrollLeft: 0,
    navbar: [],
    goods: {},
    //tab标题的滚动条位置
    expertList: [{
      //假数据
      img: "avatar.png",
      name: "欢顔",
      tag: "知名情感博主",
      answer: 134,
      listen: 2234,
      
    }]
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var that = this;
    var cur = e.target.dataset.current;
    if (this.data.currentTab == cur) { 
      return false; 
    } else {
      var navbar = that.data.navbar;
      that.showGoods(navbar[cur].id);
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },
  showNavbar: function(){
    var that = this;
    a.get("shop/goods_type", {}, function (a) {
      that.setData({
        navbar: a.types
      })
      that.showGoods()
    })
  },
  showGoods: function(navId){
    var that = this; 
    if (that.data.navbar.length == 0){
      a.alert('暂无商品');
      return;
    }
    var goods = this.data.goods;
    if(!navId){
      navId = that.data.navbar[0].id
    }
    var gs = goods[navId];
    if(gs == undefined){
      a.get("shop/point_shop", {id: navId}, function (a) {
        var gs = a.goods;
        goods[navId] = gs;
        that.setData({
          goods: goods
        })
      })
    }
  },
  onShow: function(){
    this.getInfo()
  },
  onLoad: function (r) {
    e.url(r),
      "" == e.getCache("userinfo") && wx.redirectTo({
        url: "/pages/message/auth/index"
      })
    var that = this;
    that.showNavbar();
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc
        });
      }
    });

  },
  getInfo: function () {
    var e = this;
    r.get("member", {}, function (r) {
      0 != r.error ? wx.redirectTo({
        url: "/pages/message/auth/index"
      }) : e.setData({
        member: r,
        show: !0
      }),
        t.wxParse("wxParseData", "html", r.copyright, e, "5")
    })
  },
  footerTap: t.footerTap
})