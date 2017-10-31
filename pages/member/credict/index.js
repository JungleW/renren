var e = getApp(), t = e.requirejs("core"), a = e.requirejs("jquery");
Page({
	data : {
    show: 0, 
    disabled: !0,
		credit: 0,
    money: 0,
    limit: 0,
	},
	onLoad : function (t) {
    this.showCredit();
	},
  showCredit: function(){
    var that = this;
    t.get("member/credit", {}, function (e) {
      if (0 == e.error){
        var disabled = 0;
        if (e.minCredit > e.credit2 || e.credit2==0){
          disabled = 1;
        }
       that.setData({
          show: !0,
          acts: e.acts,
          credit: e.credit1,
          money: e.credit2,
          limit: e.minCredit,
          disabled: disabled
        })
      }
    })
  },
	submit : function () {
    var that = this;
    !that.data.disabled && t.post("member/credit", {}, function (e) {
      if (0 == e.error) {
        var disabled = 1;
        that.setData({
          show: !0,
          credit: e.credit1,
          money: e.credit2,
          limit: e.minCredit,
          disabled: disabled
        })
      }
    })
  }
})
