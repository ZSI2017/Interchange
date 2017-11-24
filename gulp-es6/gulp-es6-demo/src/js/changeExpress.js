Zepto(function($){
	var epCompanyName = getUrlParam("epCompanyName")|| " ";
	// BizLog.call('info',{
	// 		 spmId:"a106.b14.c01.d01",
	// 		 actionId:'openPage'
	//  });
	// BizLog.call('info',{
	// 		spmId:"a106.b2416",
	// 		actionId:'pageMonitor',
	// });
	$(".express-desc").html(epCompanyName);
	ant.call('setTitle', {
		title: '下单失败',
	});
	ant.getSessionData({
			keys: ['epCompanyId','snderDstrCode','rcvrDstrCode']
		  }, function (result) {
			var epCompanyId = result.data.epCompanyId;
			var snderDstrCode =  result.data.snderDstrCode;
			var rcvrDstrCode =  result.data.rcvrDstrCode;
			var cityCode = getUrlParam("cityCode");
			$(".changeExpress").on("touchstart",function(){
				ant.setSessionData({
						data: {
								epCompanyId:'',
						}
				});
				// BizLog.call('info',{
				// 		 spmId:"a106.b14.c03.d01",
				// 		 actionId:'clicked'
				//  });
				BizLog.call('info',{
	           spmId:"a106.b2416.c5306.d8438",
	           actionId:'clicked',
	       });
				ant.pushWindow({
					url: "select-express.html?isServicing=1"
				});
			});
	});
});
