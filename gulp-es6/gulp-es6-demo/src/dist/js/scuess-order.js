Zepto(function($){
    FastClick.attach(document.body);
	//下单成功页面 取消成功页面 支付成功页面
	ant.setSessionData({
		data: {
			timeDate:'',
			dayValue:'',
			timeValue:'',
			goodstypeValue:'',
			goodsOneValue:'',
			goodsOneIndex:'',
			addServiceArrs:'',
			remarkContent:''
		}
	});


	if(isAndroid){
		$("#checkDetail").css("border",'1px solid #ddd');
	}
	var orderNo = getUrlParam('orderNo');
	$(".code").html("订单号："+orderNo);

	//点击完成按钮
	$("#finishOrder").click(function(){
		ant.popTo({
				   url:"index.html"
			});
	});

	// 下单成功页面 点击查看订单详情按钮
	$("#checkDetail").click(function(){
				ant.pushWindow({
				 url: "order-details.html?orderNo="+orderNo+"&orderUid="+orderUid+"&webview_options=pullRefresh%3DYES",
				 param: {
							showLoading: true,
							pullRefresh:true
						}
			 });
	});
	// 取消成功页面 ，点击查看订单详情按钮
	$("#checkDetailcancell").click(function(){
			ant.popWindow({
          data:{
            info:true
          }
      });
	});
});
