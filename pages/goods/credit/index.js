var t = getApp(), e = t.requirejs("core"), a = (t.requirejs("icons"), t.requirejs("foxui")), o = t.requirejs("biz/diyform"), i = t.requirejs("jquery"), s = t.requirejs("wxParse/wxParse"); 
Page({
	data : {
		icons : t.requirejs("icons"),
    loading: !0,
    loaded: 0,
		goods : {},
		indicatorDots : !0,
		autoplay : !0,
		interval : 5e3,
		duration : 500,
		circular : !0,
    canBuy: false,
	},
	getDetail : function (goodsId) {
		var a = this,
		o = parseInt(Date.now() / 1e3);
		a.setData({
			loading : !0
		}),
		e.get("shop/goods_info", {
      id: goodsId
		}, function (data) {
      s.wxParse("wxParseData", "html", data.goods.goodsdetail, a, 0);
      data.goods.params = [];
      let canBuy = true;
      if(parseInt(data.goods.total)<=0){
        canBuy = false
      }
      a.setData({
        loading : !0,
        loaded: 1,
        goods: data.goods,
        canBuy: canBuy,
      })
		})
	},
	onLoad : function (e) {
    console.log(e);
    var a = this;
    "" == t.getCache("userinfo") && wx.redirectTo({
      url: "/pages/message/auth/index"
    }),
      a.setData({
        options: e,
        areas: t.getCache("cacheset").areas
      }),
      wx.getSystemInfo({
        success: function (t) {
          a.setData({
            advWidth: t.windowWidth
          })
        }
      }),
      this.getDetail(e.id);
	},
	onShow : function (e) {

	},
  toSubmit: function(){
    var self = this;
    wx.redirectTo({
      url: "/pages/order/credit_create/index?id="+ self.data.goods.id +"&total=1&optionid=0"
    })
  }
})
