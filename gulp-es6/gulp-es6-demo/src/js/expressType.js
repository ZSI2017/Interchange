Zepto(function($){

	FastClick.attach(document.body);
	ant.getSessionData({
			keys: ['sendAreaCode','recAreaCode','epCompanyId']
		  }, function (result) {
			var snderDstrCode =  result.data.sendAreaCode;
			var rcvrDstrCode =  result.data.recAreaCode;
			var epCompanyId = result.data.epCompanyId;
			var info = {
				"logisMerchId":JSON.parse(epCompanyId),
				"snderDstrCode" : snderDstrCode,
				"rcvrDstrCode" : rcvrDstrCode
			};
			var xhrurl = jUrl+'/ep/common/product_type/list';
			$.axs(xhrurl, info, function(data) {
				if (data.meta.success) {
					var result = data.result,sHtml='';
					var productTypes  = result.productTypes;
					var tHtml='',tagStrs=[];
					var splitval = result.tag.substring(0, result.tag.length-1);
					var tagStrs =splitval.split(",");
					$.each(tagStrs,function(i){
						tHtml += '<span style="padding: 0.5px 5px;border: 0.5px solid #ff8200;margin-right: 10px;border-radius: 0.04rem;font-size: 10px;vertical-align: super;line-height: 20px;">'+tagStrs[i]+'</span>';
					});
					for(var i=0;i<productTypes.length;i++){
						sHtml+='<div data-epCompanyNo="'+result.merchantCode+'" data-merchantName="'+result.merchantName+'" data-acceptOrderFrom="'+result.acceptOrderFrom+'" data-acceptOrderTo="'+result.acceptOrderTo+'" data-productTypeId="'+productTypes[i].productTypeId+'" data-productTypeName="'+productTypes[i].productTypeName+'" data-presetWeight="'+productTypes[i].presetWeight+'" data-presetWeightPrice="'+productTypes[i].presetWeightPrice+'" data-extraWeightUnit="'+productTypes[i].extraWeightUnit+'" data-extraWeightPrice="'+productTypes[i].extraWeightPrice+'" class="am-list-item kd-type-item">'
							+'<div class="am-list-thumb">'
							  +'<img src="'+result.merchantLogo+'" style="border: 0.01rem solid #f5f5f9;border-radius: .05rem;width:0.6rem;height:0.6rem;" />'
							+'</div>'
							+'<div class="am-list-content">'
							  +'<div class="am-list-title" style="line-height: 1.1em;margin-bottom: 0.5px;">'+productTypes[i].productTypeName+'</div>'
							  +'<div class="am-ft-gray am-ft-sm advertisementvals" style="padding-top: 2.5px;padding-bottom: 1px;">'+result.slogan+'</div>'
							  +'<div class="am-ft-orange bubble_font" style="height:17.5px;padding-top: 0px;">'+tHtml+'</div>'
							+'</div>'
							+'<div class="am-ft-orange prisetag_right">'+(productTypes[i].presetWeightPrice)/100+'元起</div>'
							+'<div class="am-list-arrow" aria-hidden="true">'
							  +'<span class="am-icon arrow horizontal"></span>'
							+'</div>'
						+'</div>';
					}
					$(".express-type-serve").html(sHtml);
					$(".kd-type-item").click(function(){

						var productTypeId = $(this).attr("data-productTypeId");
						var productTypeName = $(this).attr("data-productTypeName");
						var presetWeight = $(this).attr("data-presetWeight");
						var presetWeightPrice = $(this).attr("data-presetWeightPrice");
						var extraWeightUnit = $(this).attr("data-extraWeightUnit");
						var extraWeightPrice = $(this).attr("data-extraWeightPrice");
						ant.setSessionData({
							data: {
								productTypeId:productTypeId,
								productTypeName:productTypeName,
								presetWeight:presetWeight,
								presetWeightPrice:presetWeightPrice,
								extraWeightUnit:extraWeightUnit,
								extraWeightPrice:extraWeightPrice,
								goodsOneValue:"",
                goodsOneIndex:"",
                goodstypeValue:"",
                dayValue: "",
                timeValue: "",
                timeDate:"",
								remarkContent:""
							}
						});
						ant.pushWindow({
							url: 'information-fill.html'
						});
					});
				}
			});
	});
});
