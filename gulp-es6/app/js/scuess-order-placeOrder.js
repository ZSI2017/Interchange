Zepto(function($){
    FastClick.attach(document.body);

      var myfrom = getUrlParam("from") || "";
      if(myfrom!=""&& myfrom.toLowerCase() == "list") {
            $("#finishOrder").parent().hide();
      }
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
		$("#checkDetail").css("border",'1px solid #ddd !important');
	}
	var orderNo = getUrlParam('orderNo');

	$(".code").html("订单号："+orderNo);
	// BizLog.call('info',{
	// 		spmId:"a106.b2114",
	// 		actionId:'pageMonitor',
	// 		params:{
	// 			OrderNO:orderNo
	// 		}
	// });

	//点击完成按钮
  // "alipays://platformapi/startapp?appId=20000754&url=%2Fapp%2Fsrc%2FexpressRecord.html%3Ffrom%3DSendEXClient%26externalReferer%3D1%26noTabType%3DsendTab"
//alipays://platformapi/startapp?appId=20000754&url=%2Fapp%2Fsrc%2Findex.html%3Ffrom%3DSendEXClient
  $("#finishOrder").click(function(){

    // BizLog.call('info',{
    //      seedId:"a106.b2114.c4638.d7185",
    //      actionId:'clicked',
		// 		 params:{
		// 			 	OrderNO:orderNo
		// 		 }
    //  });

		 ant.popTo({
				   urlPattern:"index.html"
			},function(e){
           console.log(JSON.stringify(e));
           ant.popTo({
                urlPattern:"expressRecord.html"
           },function(e){
                  console.log(JSON.stringify(e));
                     ant.popTo({
                          urlPattern:"index.html"
                       },function(e){
                           console.log(e);
                            ant.exitApp();
                       })

           })
      });
	});

	// 下单成功页面 点击查看订单详情按钮  +"&webview_options=pullRefresh%3DYES"
	$("#checkDetail").click(function(){

    // BizLog.call('info',{
    //      seedId:"a106.b2114.c4638.d7186",
    //      actionId:'clicked',
		// 		 params:{
		// 			 OrderNO:orderNo
		// 		 }
    //  });

				ant.pushWindow({
				 url: "order-details.html?orderNo="+orderNo+"&orderUid="+orderUid,
				 param: {
							showLoading: true,
              allowsBounceVertical:true
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
    $("#cancellationPhone").click(function(){
      BizLog.call('info',{
           spmId:"a106.b2116.c4644.d7222",
           actionId:'clicked',
           params:{
              OrderNO:orderNo,
          }
       });
    })

});
