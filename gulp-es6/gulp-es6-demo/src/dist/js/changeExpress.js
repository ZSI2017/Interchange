Zepto(function($){
	var epCompanyName = getUrlParam("epCompanyName")|| " ";
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
				ant.pushWindow({
					url: "select-express.html?epCompanyId="+epCompanyId+"&cityCode="+cityCode+"&snderDstrCode="+snderDstrCode+"&rcvrDstrCode="+rcvrDstrCode+""
				});
			});
	});
});