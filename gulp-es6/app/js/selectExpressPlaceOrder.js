Zepto(function ($) { // jshint ignore:line
	ant.call('setTitle', {
		title: '选快递下单',
	});
	window.isNotResume = true;
	FastClick.attach(document.body);
	ant.on('resume', function (event) {
		window.isNotResume = false;
		resumePage();
	});
	Express.init();

	function resumePage() {
		ant.setSessionData({
			data: {
				epCompanyId: '',
				epCompanyNo: '',
				epCompanyName: '',
				acceptOrderFrom: '',
				acceptOrderTo: '',
				productTypeId: "",
				productTypeName: "",
				presetWeight: "",
				presetWeightPrice: "",
				extraWeightUnit: "",
				extraWeightPrice: "",
				goodsOneValue: "",
				goodsOneIndex: "",
				goodstypeValue: "",
				dayValue: "",
				timeValue: "",
				timeDate: "",
				remarkContent: "",
			}
		});
		// promotion(window.cityCode, "SS1010", "a106.b2099.c4584");
		hideLoading();
	}
});
var Express = new Object({
	init: function () {
		showLoading();
		ant.getSessionData({
			keys: ['cityCode', 'pageId']
		}, function (result) {

			window.cityCode = result.data.cityCode; // 现阶段可测是 110100(北京 北京市)、120100(天津 天津市)、130100(河北 石家庄)
			var info = {
				cityCode: window.cityCode,
				pageNo: 1,
				pageId: "SS1010"
			};
			// alert(cityCode)
			console.log("cityCode " + window.cityCode);
			console.log("pageNo " + window.pageNo);

			var xhrurl = jUrl + '/ep/express/list';
			$.axs(xhrurl, info, function (result) {
				hideLoading();
				if (result.meta.success) {
					var expresshtml = '',
						xHtml = '';
					var tagval = '';
					var listOperation = '';

					if (!result.result.logises) {
						//暂时没有可服务的快递公司
						//服务范围扩展中，敬请期待
						console.log("/ep/express/list no data");
					} else {

						//  实现分页 加载 的判断
						var paginationArr = result.result.logises;
						$.each(paginationArr, function (i) {
							// 加载标签
							var taghtml = '',
								sHtml = '';
							var splitval = this.tag.substring(0, this.tag.length - 1);
							tagval = splitval.split(",");
							$.each(tagval, function (i) {
								taghtml += '<span style="height:.11rem;line-height: .11rem">' + tagval[i] + '</span>';
							});
							//不需要加载 几元起
							// if(this.presetWeightPrice!='' && this.presetWeightPrice!=null){
							//     sHtml='<div class="am-ft-orange" style="display:block;;font-size: .15rem;">'+this.presetWeightPrice*0.01+'元起</div>';
							// }
							var spmv_i = i + 1;
							// if(i==result.result.logises.length-1){
							xHtml = '<div epCompanyId="' + this.logisMerchId + '" epCompanyNo="' + this.merchantCode + '" epCompanyName="' + this.merchantName + '" acceptOrderFrom="' + this.acceptOrderFrom + '"  url="' + this.url + '"  accessStatus="' + this.accessStatus + '"  acceptOrderTo="' + this.acceptOrderTo + '" imgsrc="' + this.merchantLogo + '" slogan="' + this.slogan + '" tag="' + this.tag + '" class="am-list-item typelink" style="height:.90rem" data-spmv="a106.b2099.c4583.' + spmv_i + '">';
							// }else{
							// 	xHtml='<div epCompanyId="'+this.logisMerchId+'" epCompanyNo="'+this.merchantCode+'" epCompanyName="'+this.merchantName+'" acceptOrderFrom="'+this.acceptOrderFrom+'"  url="'+this.url+'"  accessStatus="'+this.accessStatus+'"  acceptOrderTo="'+this.acceptOrderTo+'" imgsrc="'+this.merchantLogo+'" slogan="'+this.slogan+'" tag="'+this.tag+'" class="am-list-item typelink" style="height: 0.90rem;" data-spmv="a106.b2099.c4583.'+ spmv_i +'">';
							// }
							/*jshint laxbreak : true  */
							expresshtml += xHtml + '<div class="am-list-thumb choice_leftlogo">' +
								'<img src="' + this.merchantLogo + '" alt="">' +
								'</div>' +
								'<div class="am-list-content">' +
								'<div class="am-list-title list_lineheight">' +
								'<span class="list_merchantName" style="font-size:.16rem">' + this.merchantName + '</span>' +
								'<span class="hot_icon hoticon' + this.hotStatus + '">热</span>' +
								'<span class="hot_icon newicon' + this.newStatus + '">新</span>' +
								'</div>' +
								'<span class="am-ft-gray advertisementvals" style="font-size:.14rem;padding-top: 0.025rem;padding-bottom: 0.005rem">' + this.slogan + '</span>' +
								'<div class="am-ft-orange bubble_font" style="height:.135rem;line-height:.135rem;;margin-top:0.005rem;margin-bottom:0.01rem;padding-top:0.0001rem;">' + taghtml + '</div>' +
								'</div>' +
								sHtml +
								'<div class="am-list-arrow"><span class="am-icon horizontal"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/indicator_icon.png"/></span></div>' +
								'</div>';
							BizLog.call('info', {
								spmId: "a106.b2099.c4583",
								actionId: 'exposure',
								params: {
									CompName: this.merchantName
								}
							});
						});
						//  分页加载 实现
					}

					//运营图片
					if(window.isNotResume){
						 promotion(window.cityCode, "SS1010", "a106.b2099.c4584");
						 getNotice(window.cityCode,"SS1010","a106.b2099.c5304");
					 }
					// if (!result.result.notice) {
					// 	$(".header_notification").hide();
					// } else {
					// 	$(".header_notification").show();
					// 	// $(".noticeval").html(result.result.notice.content);
					// 	$(".express-content-notice").css("margin-top", "0");
					// 	//公告显示埋点
					// 	BizLog.call('info', {
					// 		spmId: "a106.b2099.c5304",
					// 		actionId: 'exposure',
					// 		params: {
					// 			title: result.result.notice.content
					// 		}
					// 	});
					// }
					$(".management_list").append(expresshtml);
					$(".management_list .typelink:nth-child(n)").css({
						"padding-bottom": "0.005rem",
						"padding-top": "0"
					});
					$(".management_list .typelink:first-child").css("padding-top", "0.005rem");
					$(".express_content").show();
					if (isAndroid) {
						$(".borderTop").css("border-top", "1px solid #ddd !important");
						$(".bubble_font span").css({
							"border": "1px solid  #ff8200",
							"padding-top": "0.02rem",
							"padding-bottom": "0.015rem",
							"height": "auto",
							"line-height": "1",
							"font-size": ".1rem"
						});
					}

					// 点击事件 选择一个快递公司后 跳转
					$(".typelink").unbind().click(function () {
						var number = $(".typelink").index(this) + 1;
						var epCompanyId = $(this).attr("epCompanyId"),
							epCompanyNo = $(this).attr("epCompanyNo"),
							epCompanyName = $(this).attr("epCompanyName"),
							acceptOrderFrom = $(this).attr("acceptOrderFrom"),
							acceptOrderTo = $(this).attr("acceptOrderTo"),
							slogan = $(this).attr("slogan"),
							imgsrc = $(this).attr("imgsrc"),
							tag = $(this).attr("tag"),
							url = $(this).attr('url'),
							accessStatus = $(this).attr("accessStatus");
						console.log("accessStatus: " + accessStatus);
						console.log("url  : " + url);
						var tempUrl = "";
						if (accessStatus == "1") {
							tempUrl = "address-information-placeOrder.html";
						} else {
							tempUrl = url;
						}
						var spmIdNumbr = "a106.b2099.c4583." + number;
						BizLog.call('info', {
							spmId: spmIdNumbr,
							actionId: 'clicked',
							params: {
								ToURL: tempUrl,
								CompName: $(this).find(".list_merchantName").text()
							}
						});
						ant.setSessionData({
							data: {
								epCompanyId: epCompanyId,
								epCompanyNo: epCompanyNo,
								epCompanyName: epCompanyName,
								oldEpCompanyName: epCompanyName,
								acceptOrderFrom: acceptOrderFrom,
								acceptOrderTo: acceptOrderTo,
								slogan: slogan,
								imgsrc: imgsrc,
								tag: tag
							}
						});
						if (accessStatus == "1") {
							ant.pushWindow({
								url: "address-information-placeOrder.html"
							});
						} else {
							ant.pushWindow({
								url: url
							});
						}
					});
				} else {
					alert(result.meta.msg);
				}
			});
		});
	}
});
