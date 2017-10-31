var t = getApp(), e = t.requirejs("core"), i = t.requirejs("foxui"),a = (t.requirejs("icons"), t.requirejs("jquery"));

var GetList = function (that) {
  var is_req = that.data.is_req
  if (is_req) {
    return false;
  }
  that.setData({
    is_req: true
  });
  that.setData({
    hidden: false
  });
  var t = that;
  var page = t.data.page
  if(page==1)
  {
    page++;
  }
  console.log('page::::::::::::::',page)
  var leftNavs = t.data.leftNavs;
  var cate = leftNavs[t.data.currentLeftNav];
  console.log(leftNavs)
  console.log(cate)
  t.setData({
    loading: !0
  })
  var params = {
    cate: t.data.cate,
    brand: t.data.brandIdSelected,
    page: page,
    pagesize: 10
  }
  e.get("goods/get_list", params, function (a) {
    var goods = a.list;
    //上拉加载
    var goods_list = t.data.goods;
    
    if (goods.length>0)
    {
      for (var i = 0, len = goods.length; i < len; i++) {
        //上拉加载
        goods_list.push(goods[i]);

        goods[i].amount = 0;
      }
    }
    t.setData({
      goods: goods_list,
      loading: 0
    })
    t.refreshGoods();
    page++;
    t.data.page = page;
    setTimeout(function () {
      t.setData({
        hidden: true,
        is_req: false
      });
    }, 500)
  })

}

Page({
  data: {
    hidden: true,
    scrollTop: 0,
    page:1,
    is_req: false,
    loaded: false,
    city: t.globalData.city,
    category: {},
    navBars: [],
    carrentNavbar: 0,
    leftNavs: [],
    currentLeftNav: 0,
    currentTab: 0,
    allCates: {},
    cates: [],
    allBrands: {},
    brands: [],
    cateIdSelected: '',
    brandIdSelected: '',
    cate: '',
    needCate: 1,
    goods: [],
    loading: 1,
    cartMapping: {}
  },
  submit: function (e) {
    var cateId = this.data.cateIdSelected;
    var brandId = this.data.brandIdSelected;
    wx.navigateTo({
      url: '/pages/goods/index/index'+'?cate='+cateId+'&brand='+brandId,
    })
  },
  showCategory : function () {
    var t = this;
    e.get("shop/get_category", {}, function (e) {
       t.setData({
         category: e.category,
         navBars: e.category,
         allBrands: e.brands,
         loaded: true,
       })
       t.tapNavBar();
    })
  },
  tapNavBar: function(e){
    var t = this;
    var currentNavBar = (e && e.currentTarget && e.currentTarget.dataset.id);
    if(currentNavBar === undefined) {
      currentNavBar = 0;
    }
    var category = t.data.category;
    var navBars = category;
    var leftNavs = navBars[currentNavBar].child;
    var currentLeftNav = 0;
    var cates = leftNavs[currentLeftNav].child;
    var allCates = {};
    for(var i=0, len=cates.length; i<len; i++){
      var c = cates[i];
      allCates[c['id']] = c['name'];
    }
    t.setData({
      leftNavs: leftNavs,
      allCates: allCates,
      currentNavBar: currentNavBar,
      currentLeftNav: currentLeftNav,
      currentTab: 0,
      cateIdSelected: '',
      brandIdSelected: '',
      cate: leftNavs[currentLeftNav].id,
      needCate: 1
    })
    t.showGoods();
  }, 
  tapLeftNav: function (e) {
    var t = this;
    var currentNavBar = t.data.currentNavBar;
    var currentLeftNav = (e && e.currentTarget && e.currentTarget.dataset.id) || 0;
    var category = t.data.category;
    var navBars = category;
    var leftNavs = navBars[currentNavBar].child;
    var cates = leftNavs[currentLeftNav].child; 
    var allCates = {};
    for (var i = 0, len = cates.length; i < len; i++) {
      var c = cates[i];
      allCates[c['id']] = c['name'];
    }
    t.setData({
      allCates: allCates,
      currentLeftNav: currentLeftNav,
      currentTab: 0,
      cateIdSelected: '',
      brandIdSelected: '',
      cate: leftNavs[currentLeftNav].id,
      page: 1,
      needCate: 1
    })
    t.showGoods();
  },
  tapTab: function(e) {
    var index = e.currentTarget.dataset.index;
    var currentTab = this.data.currentTab;
    if(currentTab == index){
      index = 0;
    }
    this.setData({
      currentTab: index,
      page: 1
    })
  },
  tapCate:function (e) {
    var cateId = e.currentTarget.dataset.id
    this.setData({
      cateIdSelected: cateId,
      cate: cateId,
      currentTab: 0,
      page:1
    })
    this.showGoods()
  },
  tapBrand: function (e) {
    var brandId = e.currentTarget.dataset.id;
    this.setData({
      brandIdSelected: brandId,
      currentTab: 0,
      page: 1
    })
    this.showGoods()
  },
  tapNum: function(ev){
    var that = this;
    var goodId = ev.currentTarget.dataset.id;
    var num = parseInt(ev.detail.value);
    if(num < 1){
      num = 1;
    }
    var curNum = 0;
    var goods = this.data.goods;
    for (var i = 0, len = goods.length; i < len; i++) {
      if (goods[i].id == goodId) {
        curNum = parseInt(goods[i].amount); 
        goods[i].amount = num;
      }
    }
    if (num > curNum) {
      var params = {
        id: goodId,
        total: num - curNum
      };
      e.post('member/cart/add', params, function (a) {
        that.setData({
          goods: goods
        });
        wx.showToast({
          title: '已加入购物车',
          icon: 'success',
          duration: 1000
        });
        that.get_cart();
      });
    } else if (num < curNum) {
      var params = {
        id: goodId,
        total: curNum - num
      };
      e.post('member/cart/minus', params, function (a) {
        that.setData({
          goods: goods
        });
        wx.showToast({
          title: '已移除商品',
          icon: 'success',
          duration: 1000
        });
        that.get_cart();
      });
    }
  },
  tapPlus: function(ev){
    var that = this;
    var goodId = ev.currentTarget.dataset.id;
    var goods = this.data.goods;
    for(var i=0,len=goods.length; i<len; i++){
      if(goods[i].id == goodId){
        goods[i].amount++;
      }
    } 
    var params = {
      id: goodId,
      total: 1
    }
    e.post('member/cart/add', params, function (a) {
      that.setData({
        goods: goods
      });
      wx.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 1000
      });
      that.get_cart();
    });
  },
  tapMinus: function (ev) {
    var that = this;
    var goodId = ev.currentTarget.dataset.id;
    var goods = this.data.goods;
    for (var i = 0, len = goods.length; i < len; i++) {
      if (goods[i].id == goodId) {
        goods[i].amount--;
        if (goods[i].amount<0){
          goods[i].amount=0;
        }
      }
    }
    var params = {
      id: goodId,
      total: 1
    }
    e.post('member/cart/minus', params, function(a){
        that.setData({
          goods: goods
        });
        wx.showToast({
          title: '已移除商品',
          icon: 'success',
          duration: 1000
        });
        that.get_cart();
    });
  },

  bindManual: function (ev) {
    var that = this;
    console.log(ev.detail.value)
    var num = ev.detail.value
    var goodId = ev.currentTarget.dataset.id;
    var goods = this.data.goods;
    for (var i = 0, len = goods.length; i < len; i++) {
      if (goods[i].id == goodId) {
        goods[i].amount = num;
      }
    }
    var params = {
      id: goodId,
      total: num
    }
    e.post('member/cart/change_num', params, function (a) {
      that.setData({
        goods: goods
      });
      that.get_cart()
      wx.showToast({
        title: '已加入购物车',
        icon: 'success',
        duration: 1000
      });

    });
  },
  bindDownLoad: function () {
    var that = this;
    GetList(that);
  },
  showGoods: function(){
    var t = this;
    var leftNavs = t.data.leftNavs;
    var cate = leftNavs[t.data.currentLeftNav];
    t.setData({
      loading: !0
    })
    var params = {
      cate: t.data.cate,
      brand: t.data.brandIdSelected,
      needcate: t.data.needCate
    }
    e.get("goods/get_list", params, function (a) {
      var goods = a.list;
      for (var i = 0, len = goods.length; i < len; i++) {
        goods[i].amount = 0;
      }

      if(t.data.needCate){
        // 获取品牌 & 规格
        var allBrands = t.data.allBrands;
        var allCates = t.data.allCates;

        var brandObject = {};
        var cateObject = {};

        if (a.catebrandlist && a.catebrandlist.length) {
          for (var i = 0, len = a.catebrandlist.length; i < len; i++) {
            var cb = a.catebrandlist[i];
            var brandId = cb.brand;
            var tcateIds = cb.tcates.split(',');

            if (brandId) {
              brandObject[brandId] = allBrands[brandId];
            }
            if (tcateIds.length > 0) {
              for (var j = 0, lenJ = tcateIds.length; j < len; j++) {
                if (!tcateIds[j] || !allCates[tcateIds[j]]) continue;
                cateObject[tcateIds[j]] = allCates[tcateIds[j]];
              }
            }
          }
        }
        var keys = Object.keys(brandObject);
        var brands = [];
        for (var i = 0, len = keys.length; i < len; i++) {
          brands.push({
            'id': keys[i],
            'brand': brandObject[keys[i]]
          })
        }
        keys = Object.keys(cateObject);
        var cates = [];
        for (var i = 0, len = keys.length; i < len; i++) {
          cates.push({
            'id': keys[i],
            'name': cateObject[keys[i]]
          })
        }
        t.setData({
          goods: goods,
          brands: brands,
          cates: cates,
          loading: 0,
          needCate: 0
        })
      }else{
        t.setData({
          goods: goods,
          loading: 0,
          needCate: 0
        })
      }
      t.refreshGoods();
    })
  },
  refreshGoods: function() {
    var that = this;
    var cartMapping = that.data.cartMapping;
    var goods = that.data.goods;
    console.log("refreshGoods:::::::::::::")
    console.log(goods)
    for(var i=0,len=goods.length; i<len; i++){
      var g = goods[i];
      if (cartMapping['g'+g['id']] > 0) {
        g['amount'] = cartMapping['g'+g['id']];
      }
    }
    that.setData({
      goods: goods
    })
  },
  get_cart: function () {
    var t, i = this;
    e.get("member/cart/get_cart", {}, function (e) {
      var list = e.list;
      var cartMapping = {};
      var total = 0;
      for (var ii = 0, len = list.length; ii < len; ii++){
        var l = list[ii];
        cartMapping['g' + l['goodsid']] = parseInt(l['total']);
        total += parseInt(l['total']);
      }
      t = {
        show: !0,
        ismerch: !1,
        ischeckall: e.ischeckall,
        cartMapping: cartMapping,
        total: total,
        cartcount: e.total,
        totalprice: e.totalprice,
        empty: e.empty || !1
      }, void 0 === e.merch_list ? (t.list = e.list || [], i.setData(t)) : (t.merch_list = e.merch_list || [], t.ismerch = !0, i.setData(t))
      i.refreshGoods();
    })
  },
  onShow : function () {
    var goods = this.data.goods;
    for (var i = 0, len = goods.length; i < len; i++) {
      goods[i].amount = 0;
    } 
    this.setData({
      city: t.globalData.city,
      goods:goods
    }),
    this.get_cart()
  },
  edit: function (t) {
    var i, s = e.data(t),
      c = this;
    switch (s.action) {
      case "edit":
        this.setData({
          edit: !0
        });
        break;
      case "complete":
        this.allgoods(!1), this.setData({
          edit: !1
        });
        break;
      case "move":
        i = this.checked_allgoods().data, a.isEmptyObject(i) || e.post("member/cart/tofavorite", {
          ids: i
        }, function (t) {
          c.get_cart()
        });
        break;
      case "delete":
        i = this.checked_allgoods().data, a.isEmptyObject(i) || e.confirm("是否确认删除该商品?", function () {
          e.post("member/cart/remove", {
            ids: i
          }, function (t) {
            c.get_cart()
          })
        });
        break;
      case "pay":
        wx.navigateTo({
          url: "/pages/member/cart/index"
        })
    }
  },
  number: function (t) {
    var a = this,
      s = e.pdata(t),
      c = i.number(this, t),
      r = s.id,
      o = s.optionid;
    1 == c && 1 == s.value && "minus" == t.target.dataset.action || s.value == s.max && "plus" == t.target.dataset.action || e.post("member/cart/update", {
      id: r,
      optionid: o,
      total: c
    }, function (t) {
      a.get_cart()
    })
  },
  edt: function (e) {
    wx.switchTab({
      url: '../../member/cart/index'
    })
  },
  onShareAppMessage : function () {
    return e.onShareAppMessage()
  },
  onLoad: function (options) {
    this.showCategory()
  } 
})
