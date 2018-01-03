 showLoading();
 Zepto(function ($) {
 	FastClick.attach(document.body);
 	var epCompanyName;
 	var epCompanyId;
 	var productTypeId;
 	var epCompanyNo;
 	var acceptOrderFrom;
 	var acceptOrderTo;
 	var snderDstrCode;
 	var clickFlag = true;
 	var rcvrDstrCode;
  var orderNo = "";   // 订单号
  var orderStr = "";  // 支付字符串
 	var senderAddrID; // 寄件人id
 	var reciptiensAddrID; // 收件人 id
 	var productType; // 新增的产品类型数组
 	var presetWeight; // 首重重量  默认是数组中的第一个
 	var presetWeightPricePec; //首重价格 默认是数组中的第一个
 	var extraWeightUnitPec; //续重单位  默认是数组中的第一个
 	var extraWeightPricePec; //续重价格  默认是数组中的第一个
 	var description; // 产品类型   默认是数组中的第一个
 	var goodsMaxWeight; // 选择重量的最大值
 	var goodsWeightTypes = []; // 选择重量的数组
 	var discount; // 选择服务类型后的折扣率
 	var productTypeCode; // 服务类型编码
 	var logisMerchLog; // 物流机构的log url;
  var internalProductTypeCode  // 从选择快递页面获得的产品类型code
 	var real_recName; // 收件人真实地址
 	var real_sendName; // 寄件人 真实地址
 	var isCompanyService = getUrlParam('isCompanyService') || '';
 	var snderAddress; // 寄件人详细地址；
  var recAddress;  // 收件人详细地址
 	var filterCompanyId; // 过滤快递公司
 	var reg = /^[0-9\.]+/g; // 筛选数字 或者 小数点。
 	var enableButton = true; //  立即下单 点击 标志 判断
 	var bFromCityDirect; // 同城直送业务逻辑判断
 	var dayValue;
 	var timeValue;
 	var timeDate;
 	var goodstypeValue;
 	var addressGoodsOneValue;
 	var addressGoodsOneIndex;
 	var addressDayValue;
 	var addressTimeValue;
 	var addServiceArrs;
 	var remarkContent;
 	var informationLock = false;
 	var scrollAble = false; // 是否允许页面上下滑动
 	var orderFlag = false;
  var internalTotalPrice = 0; // 同城直送 总价
  var priceDetail;       // 获取价格明细的
  var oldTotalPrice;     // 选择快递页面获取的价格
  var bObtainPriceAjax;  //请求 获取金额 接口

 	ant.setSessionData({
 		data: {
 			fromInformation: "0"
 		}
 	});

 	ant.on('resume', function (event) {
 		orderFlag = true;
 		enableButton = true;
 		selectDateEventForCityDirect.setEnableButton(enableButton)
 		$(".single_btn").removeClass("loading");
 		$(".single_btn").html("立即下单");

 		$(".single_btn").click(function () {
 			if ($(".single_btn").hasClass("disabled")) {
 				return;
 			}
 			ant.getSessionData({
 				keys: ['fromInformation']
 			}, function (result) {
 				if (orderFlag && result.data.fromInformation == "1") {
 					$(".once_order").hide();
 					$(".otherOrder").show();
 				}
 			});
 		});

 	});

 	initPage();

 	function initPage() {
 		ant.call('setTitle', {
 			title: '完善寄件信息'
 		});
 		ant.getSessionData({
 			keys: ['filterCompanyId', 'epCompanyId', 'sendAreaCode', 'recAreaCode', 'epCompanyName', 'cityCode', 'productTypeId',
                  'presetWeight', 'presetWeightPrice', 'extraWeightUnit', 'extraWeightPrice', 'epCompanyId',
                  'reciptiensAddrID', 'recName', 'recNumber',
                  'recProvinceCode', 'recCityCode',
                  'recAreaCode', 'recStreet', 'recAddress',
                  'senderAddrID', 'sendName', 'sendNumber', 'real_sendNumber', 'real_recNumber',
                  'sendProvinceCode', 'sendCityCode', 'real_sendName', 'real_recName', 'sendAreaCode', 'sendStreet', 'sendAddress',
                  'dayValue', 'timeValue', 'timeDate', 'goodstypeValue', 'addServiceArrs', 'remarkContent',
                  'epCompanyNo', 'acceptOrderFrom', 'acceptOrderTo', 'merchantName', 'imgsrc', 'addressGoodsOneValue', 'addressGoodsOneIndex', 'addressDayValue', 'addressTimeValue', 'bFromCityDirect',,'productTypeCode','priceDetail',"price"
              ]
 		}, function (result) {
 			filterCompanyId = result.data.filterCompanyId;
 			snderAddress = result.data.sendAddress;
      recAddress = result.data.recAddress;
 			real_sendName = result.data.real_sendName;
 			real_recName = result.data.real_recName;
 			snderDstrCode = result.data.sendAreaCode;
 			rcvrDstrCode = result.data.recAreaCode;
 			epCompanyId = result.data.epCompanyId;
 			epCompanyName = result.data.epCompanyName;
 			productTypeId = result.data.productTypeId;
 			epCompanyNo = result.data.epCompanyNo;
 			acceptOrderFrom = result.data.acceptOrderFrom;
 			acceptOrderTo = result.data.acceptOrderTo;
 			senderAddrID = result.data.senderAddrID;
 			reciptiensAddrID = result.data.reciptiensAddrID;
 			logisMerchLog = result.data.imgsrc;
 			bFromCityDirect = result.data.bFromCityDirect || '';
 			//初始化剩余页面
 			dayValue = result.data.dayValue || '';
 			timeValue = result.data.timeValue || '';
 			timeDate = result.data.timeDate || '';
 			goodstypeValue = result.data.goodstypeValue || '';
 			addressGoodsOneValue = result.data.addressGoodsOneValue || '';
 			addressGoodsOneIndex = result.data.addressGoodsOneIndex || '';
 			addressDayValue = result.data.addressDayValue || '';
 			addressTimeValue = result.data.addressTimeValue || '';
 			addServiceArrs = result.data.addServiceArrs || '';
 			remarkContent = result.data.remarkContent || '';
      internalProductTypeCode = result.data.productTypeCode || '';
      priceDetail = result.data.priceDetail || '';
      oldTotalPrice = result.data.price || '';
 			// 初始化头部地址两行的地址信息
 			initTopAddressInform(result.data);
 			//寄件信息显示
 			orderInfoShow();
 			// 绑定事件
 			bindEventUtil();
 			// 针对安卓样式兼容
 			handleAndroid();
      // 断网监听
      // networkChange(networkError);
 		});
 	}

 	// 绑定事件
 	function bindEventUtil() {
 		$(".text-content").blur(function () {
 			if (this.value == '') {
 				this.value = '其他要求请在此备注(选填)';
 				this.style.color = '#ccc';
 			}
 		});
 		//备注信息
 		$(".text-content").focus(function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c4629.d7168",
 				actionId: 'clicked',
 				params: {
 					CompName: epCompanyName
 				}
 			});
 			setTimeout(function () {
 				scrollAble = true;
 				console.log("#text6666 " + scrollAble);
 			}, 600);

 			this.style.color = '#000';
 			if (this.value == '其他要求请在此备注(选填)') {
 				this.value = '';
 			}
 		});

 		$("#btn-sumbit").click(function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c4855.d7606",
 				actionId: 'clicked',
 				params: {
 					CompName: epCompanyName
 				}
 			});
 			$(".dialog-num").hide();
 			enableButton = true;
 			selectDateEventForCityDirect.setEnableButton(enableButton)
 			$(".single_btn").removeClass("loading");
 			$(".single_btn").html("立即下单");
 		});

 		$(".dialog-close-num").click(function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c4855.d7604",
 				actionId: 'clicked',
 				params: {
 					CompName: epCompanyName
 				}
 			});
 			$(".dialog-num").hide();
 			enableButton = true;
 			selectDateEventForCityDirect.setEnableButton(enableButton)
 			$(".single_btn").removeClass("loading");
 			$(".single_btn").html("立即下单");
 		});


 		$("#defaultCheckBox").find("span").css({
 			"background-image": "url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/select-36.png)"
 		})
 		// 绑定“同意协议” 复选框的事件
 		$("#defaultCheckBox").click(function () {
 			if ($(this).hasClass("defaultSelect")) {
 				$(this).toggleClass("defaultSelect");
 				$(".single_btn").addClass("disabled");
 				$(this).find("span").css({
 					"background-image": "url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/unSelect-36.png)"
 				});
 			} else {
 				$(this).toggleClass("defaultSelect");
 				if (checkInf()) {
 					$(".single_btn").removeClass("disabled");
 				}
 				$(this).find("span").css({
 					"background-image": "url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/select-36.png)"
 				});
 			}
 		});

 		// 绑定"立即下单"按钮的点击事件
 		$(".single_btn").click(function () {
 			if ($(".single_btn").hasClass("disabled")) {
 				return;
 			}
 			$(".once_order").show();
 		});
 		// 点击服务协议
 		$(".service_agreement").on("click", function () {
 			$(".text-content").blur();
 			setTimeout(function () {
 				ant.pushWindow({
 					url: "service-agreement.html"
 				});
 			}, 300)
 		});

 		// 费用明细点击事件
 		$("#details-Charges").on('click', function () {
 			$(".detailsOfCharges").show();
 		})
 		$(".detailsOfCharges .am-dialog-button").on('click', function () {
 			$(".detailsOfCharges").hide();
 		})
 		setSpm();
 		remarkInputEvents();
 		orderPromptDialogEvent();
    quitTradePayDialogEvent();
 	}

 	// 设置业务埋点
 	function setSpm() {
 		//期望上门时间 spm
 		$(".alertInfo").on("click", "#selectTime", function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c4629.d7164",
 				actionId: 'clicked',
 				params: {
 					CompName: epCompanyName
 				}
 			});
 		})
 		//物品类型 spm
 		$(".alertInfo").on("click", ".wpType", function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c4629.d7165",
 				actionId: 'clicked',
 				params: {
 					CompName: epCompanyName
 				}
 			});
 		})
 		//服务类型 spm
 		$(".alertInfo").on("click", ".fwType", function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c4629.d7331",
 				actionId: 'clicked',
 				params: {
 					CompName: epCompanyName
 				}
 			});
 		})
 		//物品重量 spm
 		$(".alertInfo").on("click", ".wpWeight", function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c4629.d7166",
 				actionId: 'clicked',
 				params: {
 					CompName: epCompanyName
 				}
 			});
 		})
 		//如何计算 spm
 		$(".price_rule").on("click", function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c4629.d7169",
 				actionId: 'clicked',
 				params: {
 					CompName: epCompanyName
 				}
 			});
 			$(".text-content").blur();
 			setTimeout(function () {
 				ant.pushWindow({
 					url: "price-rule.html"
 				});
 			}, 300)
 		});
 		// 绑定“同意协议” 复选框的事件 spm
 		$("#defaultCheckBox").click(function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c4630.d7170",
 				actionId: 'clicked',
 				params: {
 					CompName: epCompanyName
 				}
 			});
 		})
 		// 点击服务协议 spm
 		$(".service_agreement").on("click", function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c4630.d7171",
 				actionId: 'clicked',
 				params: {
 					CompName: epCompanyName
 				}
 			});
 		})
 		// 绑定"立即下单"按钮的点击事件 spm
 		$(".single_btn").click(function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c4630.d7172",
 				actionId: 'clicked',
 				params: {
 					CompName: epCompanyName
 				}
 			});
 		})

 		$("#btn-kefu").click(function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c4855.d7605",
 				actionId: 'clicked',
 				params: {
 					CompName: epCompanyName
 				}
 			});
 		})
 	}

 	//寄件信息显示
 	function orderInfoShow() {
 		//加载旧数据?
 		// if (remarkContent) {
 		// 	$(".text-content").val(remarkContent);
 		// 	$(".text-content").css('color', '#000');
 		// } else {
 		// 	$(".text-content").val("其他要求请在此备注(选填)");
 		// 	$(".text-content").css('color', '#ccc');
 		// }
 		cityDirect(bFromCityDirect);
 		checkInf();
    // alert(reg.exec(addressTimeValue)[0])
 		var info = {
 			"snderAddress": snderAddress,
 			"logisMerchCode": epCompanyNo,
 			"acceptOrderFrom": acceptOrderFrom,
 			"acceptOrderTo": acceptOrderTo,
 			"logisMerchId": parseInt(epCompanyId),
 			"snderDstrCode": snderDstrCode,
 			"rcvrDstrCode": rcvrDstrCode,
 			'bookedDay': (addressDayValue == "今天" ? "TDY" : (addressDayValue == "明天" ? "TOM" : "AFT")),
 			'bookedHour': parseFloat(addressTimeValue)||0,
      'isCompanyService': isCompanyService,
      "receiverAddress":recAddress,
      "weight":(parseFloat(addressGoodsOneValue) * 1000).toString(),
      "productTypeCode":internalProductTypeCode,
 		};

 		//初始化控件
 		var xhrurl = jUrl + '/ep/order/index';
 		$.axs(xhrurl, info, function (data) {
 			if (data.meta.success) {
 				var result = data.result,
 					mHtml = '',
 					timeNum;
 				if (result.pricingMode == "2") {
 					$(".systemPay").html('实际费用以<span style="color:#f4333c;">快递员当面确认为准</span>，在订单详情页即可完成在线支付，<span style="color:#f4333c;">不支持现金及扫码支付</span>')
 				} else {
 					$(".systemPay").html('实际费用以<span style="color:#f4333c;">快递员当面确认为准</span>，快递员录入信息后，支付宝会在订单详情生成账单提示支付，<span style="color:#f4333c;">不支持现金及扫码支付</span>')
 				}
 				if (result && result != '') {
 					var servicingText = result.servicingText,
 						goodsTypes = result.goodsTypes,
 						data2 = result.times,
 						addServices = result.addServices;
 					if (isCompanyService == "1" && data2.isChangeTime == "0") {
 						setTimeout(function () {
 							toast({
 								text: "该时段已不可服务，请重新确认时间"
 							})
 						}, 600)
 					}

 					//为全局变量赋值
 					goodsMaxWeight = JSON.parse(result.goodsMaxWeight); //最大值
 					productType = result.productTypes;
 					productTypeId = result.productTypes[0].productTypeId;
 					presetWeight = parseFloat(result.productTypes[0].presetWeight);
 					presetWeightPricePec = parseFloat(result.productTypes[0].presetWeightPrice); //首重价格
 					extraWeightUnitPec = parseFloat(result.productTypes[0].extraWeightUnit); //续重单位
 					extraWeightPricePec = parseFloat(result.productTypes[0].extraWeightPrice); //续重价格
 					description = result.productTypes[0].description; // 产品类型描述
 					discount = result.productTypes[0].discount; // 产品类型对应的折扣率
 					productTypeCode = result.productTypes[0].productTypeCode; // 服务类型的编码
 					InitSelect.initExpressType(productType); // 初始化选择产品类型
 					// 初始化快递公司相关信息
 					InitSelect.initCompanyInf(logisMerchLog, epCompanyName, productType[0].productTypeName)

 					// 产品类型 默认选中第一个
 					$("#expressId").html(productType[0].productTypeName);
 					// 默认 的首重 续重
 					$(".priceNum").html(presetWeight / 1000 + "公斤内" + presetWeightPricePec / 100 + "元，每增加" + extraWeightUnitPec / 1000 + "公斤加收" + extraWeightPricePec / 100 + "元");
 					$(".goodsweightNum").val(presetWeight / 1000);
 					InitSelect.initWeightData();
 					if (addressGoodsOneValue && addressGoodsOneValue != '') {
 						var addressWeight = parseFloat(addressGoodsOneValue);
 						var phaseWeight = parseFloat(addressWeight) - (presetWeight / 1000);
 						var addressEstimatePrice;
 						$("#goodsweight").html(addressGoodsOneValue);
 						$(".goodsweightNum").val(parseFloat(addressGoodsOneValue));
 						$(".alertInfo").find(".wpWeight").attr('data-weight_id', addressGoodsOneIndex.toString());
 						$(".alertInfo").find(".wpWeight").attr('data-weight_value', addressGoodsOneValue);
 						if (phaseWeight <= 0) {
 							addressEstimatePrice = presetWeightPricePec;
 							addressEstimatePrice = addressEstimatePrice / 100
 						} else {
 							addressEstimatePrice = presetWeightPricePec + Math.ceil((addressWeight * 1000 - presetWeight) / extraWeightUnitPec) * extraWeightPricePec;
 							addressEstimatePrice = addressEstimatePrice / 100;
 						}
 						$(".estimatePrice-data").html(addressEstimatePrice.toFixed(2));
 					}
 					// 	console.log("goodsWeights");
 					var goodsWeights = "";
 					if (!goodsWeights) {
 						$(".goodstype").text(goodsTypes[0]);
 						if (!addressWeight) {
 							$("#goodsweight").html(goodsWeightTypes[0]);
 							$(".goodsweightNum").val(parseFloat(goodsWeightTypes[0]));
 							$(".estimatePrice-data").html((presetWeightPricePec / 100).toFixed(2));
 						}
 					}
 					//  addServices = ["我需要纸箱",'我需要胶带','我需要胶带']
 					if (addServices && addServices != '') {
 						console.log("addService")
 						$(".extra_service_show").show();
 						$(".extra_service_txt").show();
 						$(".extra_service").css("padding-bottom", "0.05rem");
 						// $(".kd-height-show").show();
 						// $(".kd-info").css({"border-top":"1px solid #ddd;"});
 						$(".kd-info-text").css({
 							"background-color": "#f5f5f9",
 							"border-bottom": "0"
 						});
 					} else {
 						$(".extra_service_show").hide();
 						$(".extra_service_txt").hide();
 						$(".extra_service").css("padding-bottom", "0");
 						$(".remarks-class").css('backgroundSize', '0 0,0 0,100% 0px,100% 1px');
 						// $(".kd-height-show").hide();
 						//  $(".kd-info").removeClass("borderTopddd");
 						// $(".kd-info").css({"border-top":"0px solid #ddd;"});
 						$(".kd-info-text").css({
 							"background-color": "#f5f5f9",
 							"border-bottom": "0"
 						});
 					}
 					// 绑定选择日期    事件
 					if (bFromCityDirect) {
 						$(".systemPay").html('若信息填写不准确产生价格变化请与快递员沟通处理，<span style="color:#f4333c;">取消订单可能产生费用，</span>详细规则请见<span style="color:#f4333c;">' + epCompanyName + '使用帮助</span>')
 						// $(".once_order").show();
 						selectDateEventForCityDirect.initselectDateEventForCityDirect(bFromCityDirect, false, enableButton,dynamicPriceCityDirect);
            handlePriceDataCityDirect({totalPrice:oldTotalPrice,priceDetail:priceDetail})
 						selectDateEventForCityDirect.initSelectData(bFromCityDirect);
 					} else {
 						InitSelect.initselectDateEvent(data2);
 					}
 					// 绑定选择物品类型  事件
 					InitSelect.initSelectTypeEvent(goodsTypes);
 					//  绑定选择物品重量  事件
 					InitSelect.initSelectWeightEvent(goodsWeightTypes, presetWeightPricePec, presetWeight, extraWeightUnitPec, extraWeightPricePec);
 					// 绑定选择产品类型的 事件
 					InitSelect.initselectExpressType();

 					$(".timeText").text(servicingText);
 					$.each(addServices, function (i) {
 						for (var j = 0; j < addServiceArrs.length; j++) {
 							if (addServiceArrs[j] == addServices[i]) {
 								var classChange = "express_active_change";
 							} else {
 								var classChange = "";
 							}
 						}
 						if (i == 0) {
 							mHtml += '<div class="' + classChange + '" data-spmv="a106.b2109.c4629.d7167" style="min-width:0rem;text-align:center;width: 1.46rem;margin: 0.15rem 0rem 0.1rem 0.25rem;border: 1px #888 solid;padding: 0.02rem 0.02rem;line-height: .24rem;margin-top:0rem;">' + addServices[i] + '</div>';
 						} else {
 							mHtml += '<div class="' + classChange + '" data-spmv="a106.b2109.c4629.d7167" style="min-width:0rem;text-align:center;width: 1.46rem;margin: 0.15rem 0rem 0.1rem 0.25rem;border: 1px #888 solid;padding: 0.02rem 0.02rem;line-height: .24rem;margin-top:0rem;">' + addServices[i] + '</div>';
 						}
 					});

 					$(".extra_service").html(mHtml);
 					//点击切换样式
 					$(".extra_service div").click(function () {
 						BizLog.call('info', {
 							spmId: "a106.b2109.c4629.d7167",
 							actionId: 'clicked',
 							params: {
 								CompName: epCompanyName
 							}
 						});
 						$(this).toggleClass('express_active_change');
 					});
 				}
 				hideLoading();
 			}
 		}, function (d) {
 			if (d.meta.code == "3214") {
 				BizLog.call('info', {
 					spmId: "a106.b2109.c5643",
 					actionId: 'exposure',
 				});
 				hideLoading();
 				$('.show_mask').show();
 				// alert(Object.prototype.toString.call(temp) === "[object Array]");
 				var filterTemp = filterCompanyId;
 				if (!(Object.prototype.toString.call(filterTemp) === "[object Array]")) {
 					if (filterTemp.length == 2) {
 						filterTemp = [];
 					} else {
 						filterTemp = filterCompanyId.slice(1, filterCompanyId.length - 1).split(",");
 					}
 				}
 				filterTemp.push(epCompanyNo);
 				setTimeout(function () {
 					ant.setSessionData({
 						data: {
 							filterCompanyId: filterTemp
 						}
 					});
 					alert("温馨提示\n抱歉，" + epCompanyName + "暂时无法服务\n换一家试试吧");
 					BizLog.call('info', {
 						spmId: "a106.b2109.c5643.d8921",
 						actionId: 'clicked',
 					});
 					$('.show_mask').hide();
 					ant.popWindow();
 				}, 100);
 			} else {
 				toast({
 					text: d.meta.msg,
 					type: 'exception'
 				})
 			}
      hideLoading();
 		});
 	}

 	// 头部两行的地址信息初始化
 	function initTopAddressInform(templateData) {
 		var sendHtml = template("sendTemplate", templateData);
 		document.getElementById("sendId").innerHTML = sendHtml;
 		var recHtml = template("recpAddressTemplate", templateData);
 		document.getElementById("recAddressId").innerHTML = recHtml;
 		var tempSendName = templateData.sendName;
 		var temprecName = templateData.recName;
 		$(".data-senderName").html(tempSendName);
 		$(".data-recipientsName").html(temprecName);
 	}

 	// 选择组件对象
 	var InitSelect = new Object({
 		// 初始化快递公司信息
 		initCompanyInf: function (imgSrc, expressName, productTypeName) {
 			$("#companyLogo").attr("src", imgSrc);
 			$('#companyInfName').html(expressName);
 			$("#companyInfProductType").html(productTypeName)
 		},
 		// 初始化 选择重量 下拉数据
 		initWeightData: function () {
 			goodsWeightTypes = [];
 			var maxNum = 100,
 				internalPresetWeight = 0.5,
 				internalExtraWeightUnitPec = 0.5;
 			if (bFromCityDirect) {
 				maxNum = 50;
 				internalPresetWeight = 1;
 				internalExtraWeightUnitPec = 1;
 			}
 			for (var m = 0; m < maxNum; m++) {
 				var goodsWeightTypesVal = (internalPresetWeight + m * internalExtraWeightUnitPec);
 				if (m == 0) {
 					goodsWeightTypesVal = goodsWeightTypesVal + " 公斤及以下";
 				} else if (m == maxNum - 1) {
 					goodsWeightTypesVal = goodsWeightTypesVal + " 公斤及以上";
 				} else {
 					goodsWeightTypesVal = goodsWeightTypesVal + " 公斤";
 				}
 				goodsWeightTypes.push(goodsWeightTypesVal);
 			}
 		},
 		// 初始化 产品类型 下拉选择
 		initExpressType: function (productType) {
 			var arthtml = ''
 			productType.map(function (item, index) {
 				var tempDescription = item.description;
 				var otherClass = '';
 				if (tempDescription == "-" || tempDescription == "") {
 					// tempDescription = '';
 					otherClass = "displayNone";
 				}
 				arthtml += '<div  class=" am-list twoline" data-select="0" style="width:100%;padding:0;margin-bottom:.1rem">' +
 					'<div class="am-list-item expressType_border" style="background-size:0;border-radius:.05rem;padding-top:.15rem;min-height:0;padding-bottom:.135rem">' +
 					'<div class="am-list-thumb" data-select="1" style="width:.22rem;height:.22rem;background-size:contain;background-image: url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/unSelect-44.png);background-repeat: no-repeat;">' +
 					// '<img data-select="1"  style="width:.21rem;height:.21rem" src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/noselect.png" alt="图片描述" />'+
 					'</div>' +
 					'<div class="am-list-content" style="margin-left:.05rem">' +
 					'<div class="am-list-title am-flexbox twocolumn" style="margin-bottom:0;line-height:1">' +
 					'<div class="am-flexbox-item typeName-classs" style="color:#000;font-size:.24rem;line-height:.24rem">' + item.productTypeName + '</div>' +
 					'<div class="am-list-right-brief" style="color:#f4333c;font-size:.14rem;line-height:.24rem;"><span>' + item.presetWeightPrice / 100 + '</span><span> 元起</span></div>' +
 					'</div>' +
 					'<div class="am-list-brief ' + otherClass + '"' + 'style="white-space:normal;font-size:.14rem;line-height:.2rem;margin-top:0.05rem;margin-bottom:-0.02rem;">' + tempDescription + '</div>' +
 					'</div>' +
 					'</div>' +
 					'</div>';
 			});
 			$(".iosselect-box").html(arthtml);
 		},
 		// 选择产品类型
 		initselectExpressType: function () {
 			var _this = this;
 			var myBtn = $(".alertInfo").find(".fwType")
 			var temp = $("#expressId").html();

 			myBtn.click(function () {
 				if (!enableButton) {
 					return;
 				}
 				$(".myPop").show();
 				$("body").on('touchmove', function (event) {
 					event.preventDefault();
 				}, false);

 				if (clickFlag) {
 					clickFlag = false;
 					if (isAndroid) {
 						$(".iosselect-box").find(".am-list-item").css("border", '1px solid #ddd');
 					}
 					// $(".iosselect-box").find("img").eq(0).attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/select.png");
 					$(".iosselect-box").find(".am-list-thumb").eq(0).css({
 						"background-image": "url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/select-44.png)"
 					});
 					$(".iosselect-box").find(".am-list").eq(0).attr("data-select", "1");
 					$(".iosselect-box").find(".am-list-item").eq(0).css("border-color", '#108ee9');
 					$(".iosselect-box").find(".am-list:last").css("margin-bottom", '0');
 				}

 				// console.log(".iosselect  "+$(".iosselect-box").find("img").eq(0));
 				// $(".iosselect-box").find("img:first").src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/select.png";
 				// $(".iosselect-box").find(".am-list:last").css("margin-bottom",'0');

 			});
 			$(".iosselect-box").find(".am-list").map(function (item, index) {

 				//  $(this).attr("data-index",item);
 				$(this).on("click", function () {
 					var current = $(this);
 					if ($(this).attr("data-select") == "0") {
 						current = $(this);
 						$(".iosselect-box").find(".am-list").each(function () {
 							$(this).attr("data-select", "0");
 							// $(this).find("img").attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/noselect.png")
 							$(this).find(".am-list-thumb").css({
 								"background-image": "url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/unSelect-44.png)"
 							});
 							$(this).find(".am-list-item").css("border-color", '#ddd');
 						});
 						$(this).attr("data-select", "1");
 						$(this).find(".am-list-thumb").css({
 							"background-image": "url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/select-44.png)"
 						});
 						// $(this).find("img").attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/select.png")
 						$(this).find(".am-list-item").eq(0).css("border-color", '#108ee9');
 					}
 					temp = current.find(".typeName-classs").html();
 					$("#expressId").html(temp);
 					$("#companyInfProductType").html(temp);
 					var num = $(this).index();
 					productTypeId = productType[num].productTypeId; // 更换产品类型id
 					presetWeight = parseFloat(productType[num].presetWeight);
 					presetWeightPricePec = parseFloat(productType[num].presetWeightPrice); //首重价格
 					extraWeightUnitPec = parseFloat(productType[num].extraWeightUnit); //续重单位
 					extraWeightPricePec = parseFloat(productType[num].extraWeightPrice); //续重价格
 					description = productType[num].description; //  //预存描述
 					discount = parseFloat(productType[num].discount);
 					productTypeCode = productType[num].productTypeCode; // 服务类型的编码


 					// 选择完服务类型后，初始化 首重 和 重量选择数组
 					//  _this.initWeightData();
 					// $(".priceNum").html("首重" + presetWeightPricePec/100 + "元，续重" + extraWeightPricePec/100 + "元");
 					$(".priceNum").html(presetWeight / 1000 + "公斤内" + presetWeightPricePec / 100 + "元，每增加" + extraWeightUnitPec / 1000 + "公斤加收" + extraWeightPricePec / 100 + "元");
 					var oldWeight = parseFloat($("#goodsweight").html());
 					//       var phaseWeight = parseFloat(oldWeight)- (presetWeight/1000);
 					//       var  weightId;
 					//       console.log("phaseWeight: "+phaseWeight);
 					//
 					//       if(phaseWeight<=0){
 					//          weightId= 0;
 					//      }else{
 					//          weightId = Math.ceil(phaseWeight/(extraWeightUnitPec/1000));
 					//     }
 					//     console.log("weightId: "+weightId);
 					//     console.log(".goodsweightNum: "+presetWeight/1000+weightId*(extraWeightUnitPec/1000))
 					//
 					//     $("#goodsweight").html(goodsWeightTypes[weightId]);
 					//  //  alert(presetWeight/1000);
 					//      $(".goodsweightNum").val(presetWeight/1000+weightId*(extraWeightUnitPec/1000));
 					//      // 初始化 联动控件
 					//       $(".alertInfo").find(".wpWeight").attr('data-weight_id', weightId.toString());
 					//       $(".alertInfo").find(".wpWeight").attr('data-weight_value', goodsWeightTypes[weightId]);

 					var totalPrice = presetWeightPricePec + Math.ceil((oldWeight * 1000 - presetWeight) / extraWeightUnitPec) * extraWeightPricePec;
 					totalPrice = totalPrice / 100;
 					$(".estimatePrice-data").html(totalPrice.toFixed(2));
 					setTimeout(function () {
 						$(".myPop").hide();
 						$("body").off("touchmove");
 					}, 200);

 				});
 			});
      $(".myPop").unbind().click(function(){
        $(".myPop").hide();
 				$("body").off("touchmove");
      })
      $(".myPop>:first-child").click(function(e){
        e.stopPropagation();
      })
 			$(".myPop").find(".close").click(function () {
 				$(".myPop").hide();
 				$("body").off("touchmove");
 			});
 			$(".myPop").find(".sure").click(function () {
 				$(".myPop").hide();
 				$("body").off("touchmove");
 				$("#companyInfProductType").html(temp)
 				$("#expressId").html(temp);
 			});
 		},
 		initselectDateEvent: function (data2) {
 			console.log(data2);
 			var timeInternal = data2;
 			var outChecked = 0,
 				outNewTime = '',
 				outNewDate = '',
        value;
 			for (value in timeInternal) {
 				if (Array.isArray(timeInternal[value]) && timeInternal[value].some(function (item, dex) {
 						return item.hasOwnProperty('isChecked') && item['isChecked'] == "1";
 					})) {
 					outNewDate = value;
 				}
 			};
 			timeInternal[outNewDate].some(function (item, dex) {
 				outNewTime = item.time;
 				return item.hasOwnProperty('isChecked') && item['isChecked'] == "1";
 			})
 			if (outNewDate != "TDY") {
 				$("#timeDate").css("color", "#f4333c");
 			} else {
 				$("#timeData").css("color", "#888");
 			}
 			var spanHtml = "<span style='padding-left:.05rem;'></span>";
 			$("#timeDate").html(JSON.parse(JSON.stringify((outNewDate == "TDY" ? '今天' : outNewDate == "TOM" ? '明天' : "后天") + spanHtml + outNewTime)));
 			$(".day1").val(JSON.parse(JSON.stringify(outNewDate == "TDY" ? '今天' : outNewDate == "TOM" ? '明天' : "后天")));
 			$(".time1").val(JSON.parse(JSON.stringify(outNewTime)));

 			var dateDom = document.querySelector('#dateId');
 			var timeDom = document.querySelector('#timeId');
 			var myBtn = $(".alertInfo").find("#selectTime")
 			var _this = this;
 			myBtn.unbind().click(function () {
 				if (!enableButton) {
 					return;
 				}
 				$(".newDate").show();
 				$("body").on('touchmove', function (event) {
 					event.preventDefault();
 				}, false);
 				//初始化 默认选择的日期
 				_this.initDateTimes();
 				var checked = 0;
 				$(".dataItem").each(function (index) {
 					var newDate = index === 0 ? "TDY" : index === 1 ? "TOM" : "AFT";
 					if (timeInternal[newDate].every(function (item, index) {
 							return item.status != "1"
 						})) {
 						$(this).addClass('clickDisabled');
 						$(this).find('img').hide();
 						$(this).find('span').html($(this).find('span').html().replace('约满', '') + '约满');
 					} else {
 						$(this).removeClass('clickDisabled');
 						$(this).find('img').hide();
 						// $(this).find('img.imgNoSelect').show();
 						$(this).find('span').html($(this).find('span').html().replace('约满', ''))
 					};
 					// if(timeInternal[newDate].some(function(item, dex){return item.hasOwnProperty('isChecked')&&item['isChecked'] === "1";})){
 					//      checked = index
 					// }
 				})
 				// 设置选中状态
 				var internalNewDate = $(".day1").val() == '今天' ? 'TDY' : $(".day1").val() == '明天' ? 'TOM' : 'AFT';
 				var internalNewTime = $(".time1").val();
 				var $checked = $(".dataItem").eq(checked);
 				var internalNewDateId = internalNewDate === "TDY" ? 0 : internalNewDate === "TOM" ? 1 : 2;
 				var tempButton = '';
 				$('.dataItem').css('borderColor', '#ddd');
 				$(".dataItem").eq(internalNewDateId).find('img.imgSelect').show();
 				$(".dataItem").eq(internalNewDateId).css('borderColor', '#108ee9');
 				// $(".dataItem").eq(internalNewDateId).find('img.imgNoSelect').hide();
 				timeInternal[internalNewDate].forEach(function (item, index) {
 					var form = format('<button style="float:left;padding:0;font-size:.14rem;margin-bottom:12px;width:1.08rem;height:.42rem;line-height:1" class="am-button \
                                     {0}"\
                                     {1}>\
                                     <span>{3}</span>\
                                     <p {4}\
                                     >{2}</p>\
                                     </button>',
 						internalNewTime === item.time ? '' : 'white',
 						item.status == "1" ? '' : 'disabled',
 						item.time,
 						item.status == "2" ? '约满' : '',
 						item.status == "2" ? 'style="padding-top:.03rem;"' : ''
 					)
 					tempButton = tempButton + form;
 				})
 				$('.times').html(tempButton);

 				$('.times button').unbind().click(function (event) {
 					outNewTime = $(this).find('p').html();
 					$('.times button').addClass('white')
 					$(this).removeClass('white');
 				})
 				// 初始化今天 明天 后天的日期
 			})
 			//  初始化 预约上面的 弹窗
 			$(".dataItem").unbind().click(function () {
 				if ($(this).hasClass('clickDisabled')) return;
 				$(".dataItem").find('img.imgSelect').hide();
 				$('.dataItem').css('borderColor', '#ddd')
 				$(this).find("img.imgSelect").show();
 				$(this).css('borderColor', '#108ee9');
 				var tempCheckDate = $(this).index() === 0 ? "TDY" : $(this).index() === 1 ? "TOM" : "AFT"
 				outNewDate = tempCheckDate;
 				var tempButtonInternal = '';
 				timeInternal[tempCheckDate].forEach(function (item, index) {
 					var form = format('<button style="float:left;padding:0;font-size:.14rem;margin-bottom:12px;width:1.08rem;height:.42rem;line-height:1" class="am-button \
                 {0}"\
                 {1}>\
                 <span>{3}</span>\
                 <p {4}\
                 >{2}</p>\
                 </button>',
 						item.hasOwnProperty('isChecked') && item['isChecked'] === "1" ? 'white' : 'white',
 						item.status === "1" ? '' : 'disabled',
 						item.time,
 						item.status === "2" ? '约满' : '',
 						item.status === "2" ? 'style="padding-top:.03rem;"' : ''
 					)
 					tempButtonInternal += form;
 				})
 				$('.times').html(tempButtonInternal);
 				if (timeInternal[tempCheckDate].some(function (item, index) {
 						if (item.status === "1") {
 							$('.times button').eq(index).removeClass('white')
 							outNewTime = item.time;
 						}
 						return item.status === "1"
 					})) {} else {
 					outNewTime = '';
 				}

 				$('.times button').unbind().click(function (event) {
 					outNewTime = $(this).find('p').html()
 					$('.times button').addClass('white')
 					$(this).removeClass('white');
 				})
 			})
      $(".newDate").unbind().click(function(){
        $(".newDate").hide();
        $("body").off("touchmove");
      })
      $(".newDate>:first-child").click(function(e){
        e.stopPropagation();
      })
 			$(".newDate").find(".close").unbind().click(function () {
 				$(".newDate").hide();
 				$("body").off("touchmove");
 			});
 			$(".newDate").find(".sure").unbind().click(function () {
 				if (outNewTime !== '') {
 					$(".time1").val(JSON.parse(JSON.stringify(outNewTime)));
 					$(".day1").val(JSON.parse(JSON.stringify(outNewDate == "TDY" ? '今天' : outNewDate == "TOM" ? '明天' : "后天")));

 					$("#timeDate").html(JSON.parse(JSON.stringify((outNewDate == "TDY" ? '今天' : outNewDate == "TOM" ? '明天' : "后天") + spanHtml + outNewTime)));
 					if (outNewDate != "TDY") {
 						$("#timeDate").css("color", "#f4333c");
 					} else {
 						$("#timeDate").css("color", "#888");
 					}
 				}
 				$(".newDate").hide();
 				$("body").off("touchmove");
 			});
 		},
 		initDateTimes: function () {
 			ready(function () {
 				AlipayJSBridge.call('getServerTime', function (data) {
 					$('.dataItem p').each(function (index) {
 						$(this).html(getFullDate(data.time, index))
 					})
 				});
 			});

 			function ready(callback) {
 				if (window.AlipayJSBridge) {
 					callback && callback();
 				} else {
 					// 如果没有注入则监听注入的事件
 					document.addEventListener('AlipayJSBridgeReady', callback, false);
 				}
 			}
 		},
 		// 选择物品类型 函数
 		initSelectTypeEvent: function (goodsTypes) {
 			var typeDom = document.querySelector(".typeId")
 			var typeBtn = $(".alertInfo").find(".wpType")
 			typeBtn.click(function () {
 				if (!enableButton) {
 					return;
 				}
 				var typeId = typeBtn.attr("data-type_id");
 				var typeName = typeBtn.attr("data-type_value");

 				var typeLevel = 1;
 				var typeArr = [];
 				for (var i = 0; i < goodsTypes.length; i++) {
 					typeArr.push({
 						"id": i.toString(),
 						"value": goodsTypes[i]
 					})
 				}
 				var option2 = {
 					title: "",
 					itemHeight: 35,
 					headerHeight: 42,
 					cssUtil: "px",
 					oneLevelId: typeId,
 					callback: function (selectOneObj) {
 						typeDom.value = selectOneObj.id;
 						typeBtn.attr('data-type_id', selectOneObj.id);
 						typeBtn.attr('data-type_value', selectOneObj.value);
 						$(".goodstype").text(JSON.parse(JSON.stringify(selectOneObj.value)));
 						ant.setSessionData({
 							data: {
 								goodstypeValue: JSON.parse(JSON.stringify(selectOneObj.value))
 							}
 						});
            // dynamicPriceCityDirect();
 						checkInf();
 					}
 				}
 				var oneSelect = new IosSelect(typeLevel, [typeArr], option2);
 			});

 		},
 		// 选择物品重量 函数
 		initSelectWeightEvent: function () {
 			//选择物品重量
 			var weightDom = document.querySelector("#weightId")
 			var weightBtn = $(".alertInfo").find(".wpWeight")
 			weightBtn.click(function () {
 				if (!enableButton) {
 					return;
 				}
 				var weightId = weightBtn.attr("data-weight_id");
 				var weightName = weightBtn.attr("data-weight_value");
 				//   $("body").on('touchmove', function (event) {
 				//          event.preventDefault();
 				//  }, false);
 				var weightLevel = 1;
 				var weightArr = [];
 				for (var i = 0; i < goodsWeightTypes.length; i++) {
 					weightArr.push({
 						"id": i.toString(),
 						"value": goodsWeightTypes[i]
 					});
 				}
 				var option2 = {
 					title: "",
 					itemHeight: 35,
 					headerHeight: 42,
 					cssUtil: "px",
 					oneLevelId: weightId,
 					callback: function (selectOneObj) {
 						weightDom.value = selectOneObj.id;
 						weightBtn.attr('data-weight_id', selectOneObj.id);
 						weightBtn.attr('data-weight_value', selectOneObj.value);
 						// $(".goodstype").text(JSON.parse(JSON.stringify(selectOneObj.value)));
 						if (selectOneObj.id == '') {
 							var addServicesOne = parseFloat(goodsWeightTypes[0]) * 1000;
 							var totalPrice = presetWeightPricePec + Math.ceil((addServicesOne - presetWeight) / extraWeightUnitPec) * extraWeightPricePec;
 							totalPrice = totalPrice / 1000;
 							$(".estimatePrice-data").html(totalPrice.toFixed(2));
 						} else {
 							$("#goodsweight").text(JSON.parse(JSON.stringify(selectOneObj.value)));
 							var weight = parseFloat(selectOneObj.value);
 							var totalPrice = presetWeightPricePec + Math.ceil((weight * 1000 - presetWeight) / extraWeightUnitPec) * extraWeightPricePec;
 							totalPrice = totalPrice / 100;
 							$(".goodsweightNum").val(weight);
 							$(".estimatePrice-data").html(totalPrice.toFixed(2));
 							ant.setSessionData({
 								data: {
 									goodsOneValue: JSON.parse(JSON.stringify(selectOneObj.value)),
 									goodsOneIndex: JSON.parse(JSON.stringify(selectOneObj.value)),
 									addressGoodsOneValue: JSON.parse(JSON.stringify(selectOneObj.value)),
 									addressGoodsOneIndex: JSON.parse(JSON.stringify(selectOneObj.id))

 								}
 							});
 						}
 						checkInf();
 						dynamicPriceCityDirect();
 					}
 				}
 				var weightSelect = new IosSelect(weightLevel, [weightArr], option2);
 			});
 		}
 	});

 	function cityDirect(bFromCityDirect) {
 		if (bFromCityDirect) {
 			$(".notCityDirect").css('display', 'none !important;');
 			$(".alertInfo").not(".notCityDirect").css('margin-bottom', '1.4rem')
      $(".single_btn").html("支付下单");
 		} else {
 			$(".hide-class").css('display', 'none !important');
 			$(".alertInfo").not(".notCityDirect").css('margin-bottom', '0.85rem')
      $(".single_btn").html("立即下单");
 		}
 	}

 	// 检查日期 重量 类型 是否填写完整   完整返回 真
 	function checkInf() {
 		if ($("#timeDate").text() == "请选择") {
 			return false;
 		} else if ($(".goodstype").text() == "请选择") {
 			return false;
 		} else if ($(".goodsweightNum").val() == '') {
 			return false;
 		} else if (!$("#defaultCheckBox").hasClass("defaultSelect")) {
 			return false;
 		} else {
 			$(".single_btn").removeClass("disabled");
 			return true;
 		}
 	}

 	// 过滤掉备注重点中的表情包  超50 提示
 	function remarkInputEvents() {
 		$(".text-content").bind("compositionstart", function () {
 			informationLock = true;
 		})
 		$(".text-content").bind("compositionend", function () {
 			var emoji = emojione.toShort($(this).val());
 			$(this).val(emoji.replace(/\:[a-z0-9_]+\:/g, ''));
 			if ($(this).val().length >= 51) {
 				var tempval = $(this).val().slice(0, 50);
 				$(this).val(tempval);
 				$(".am-toast").show();
 				setTimeout(function () {
 					$(".am-toast").hide();
 				}, 800)
 			}
 			informationLock = false;
 		})
 		$(".text-content").bind('input', function () {
 			console.log("into input" + informationLock);
 			if (!informationLock) {
 				var emoji = emojione.toShort($(this).val());
 				$(this).val(emoji.replace(/\:[a-z0-9_]+\:/g, ''));
 				if ($(this).val().length >= 51) {
 					var tempval = $(this).val().slice(0, 50);
 					$(this).val(tempval);
 					$(".am-toast").show();
 					setTimeout(function () {
 						$(".am-toast").hide();
 					}, 800)
 				}
 			}
 		});
 		$(".text-content").bind("blur", function () {
 			scrollAble = false;
 		});
 	}

  // 未完成支付，退出弹窗事件
  function quitTradePayDialogEvent(){
    // 退出下单事件
    $("#quitPay").on("click",function(){
      $(".tradePay-class").removeClass("show").attr("aria-hidden","true");
      ant.popTo({
  				   urlPattern:"index.html"
  		});
    })
   // 继续支付
   $("#continuePay").on("click",function(){
     $(".tradePay-class").removeClass("show").attr("aria-hidden","true");
     startTradePay();
   })
  }
 	// 安卓样式兼容处理
 	function handleAndroid() {
 		if (isAndroid) {
 			$(window).on('scroll', function (event) {
 				console.log(scrollAble);
 				if (scrollAble) {
 					console.log("dasdfa");
 					$(".text-content").blur();
 				}
 			}, false);
 		}
 	}

 // 处理断网后页面样式变动
  function networkError(){
    // 这里获取金额 /ep/service_info  断网判断
    // console.log("################# 重新计算计算" + bObtainPriceAjax);
     // if(!bObtainPriceAjax) {return;}
      $("p.obtain-price-loading").addClass("obtain-price-loading-click");
      $(".obtain-price-loading-click").text("点击重新计算");
      $(".obtain-price-loading-click").unbind().on("click",function(){
        if($(".obtain-price-loading-click").text() == "点击重新计算"){
          console.log("开始重新计算。。。。。。。。。。。。。   ")
          dynamicPriceCityDirect();
        }
      })
  }

 	function dynamicPriceCityDirect() {
    if(!bFromCityDirect){return;}
    bObtainPriceAjax = true;
 		$(".single_btn").addClass("disabled");
 		enableButton = false;
 		selectDateEventForCityDirect.setEnableButton(enableButton)
    $("p.obtain-price-loading").text("计算中").removeClass("obtain-price-loading-click")
 		$(".obtain-price-loading").show();
 		$(".obtain-price").hide();
    //获取金额接口
    var xhrurl = jUrl + '/ep/service_info';
    var info = {
      "senderAreaCode":snderDstrCode,
      "senderAddress":snderAddress,
      "receiverAreaCode":rcvrDstrCode,
      "receiverAddress":recAddress,
      'bookedDay':($(".day1").val() == "今天" ? "TDY" : ($(".day1").val() == "明天" ? "TOM" : " ")),
      'bookedHour':$(".time1").val() == "立即取件"?"NOW":$(".time1").val(),
      "bookedMins":$(".minutes").val()||"0",
      "goodsName":$(".goodstype").text(),
      "goodsWeight":$(".goodsweightNum").val() * 1000+"",
      "logisMerchCode": epCompanyNo,
      "productTypeCode":productTypeCode
    };
    if(!isNetworkAvailable){
      networkError();
    }
    setTimeout(function(){
      if(!isNetworkAvailable){
        networkError();
      }
    },10000);
    $.axs(xhrurl, info, function (data) {
      bObtainPriceAjax = false;
      if (data.meta.code == "0000") {
        var result = data.result;
        handlePriceDataCityDirect(result)
      }
    },function(d){
      bObtainPriceAjax = false;
      toast({
        test:"获取价格失败",
        type: 'exception'
      })
    })
 	}

  // 获取金额后，处理返回数据，渲染到页面上
  function handlePriceDataCityDirect(result){
    var pricePrest;                           //起步价
    var priceDistance;                        //里程费
    var pricePremium;                         // 溢价
    var internalDistance;                    // 里程
    internalTotalPrice = parseFloat(result.totalPrice)/100 || 0; // 总价格
    var priceDetailArray = result.priceDetail
    if (!Array.isArray(priceDetailArray)){
        priceDetailArray = JSON.parse(priceDetailArray);
    }
   priceDetailArray.forEach(function(item,idx){
      if(item.price_type === "PRICE_PRESET") {
        pricePrest = parseFloat(item.price)/100|| 0;
      }else if(item.price_type === "PRICE_DISTANCE"){
        priceDistance = parseFloat(item.price)/100 || 0;
        internalDistance = parseFloat(item.distance)||0;
      }else if(item.price_type === "PRICE_PREMIUM"){
        pricePremium = parseFloat(item.price)/100|| 0;
      }
    })
    $(".obtain-total-price").html(internalTotalPrice.toFixed(2));
    if(pricePremium>0){
      $(".obtain-price .am-ft-red").html("（含"+pricePremium+"元溢价）");
    }else {
      $(".obtain-price .am-ft-red").empty();
    }
    $(".detailed-price span").eq(0).html(pricePrest);
    $(".detailed-price span").eq(1).html(internalDistance);
    $(".detailed-price span").eq(2).html(priceDistance);
    $(".obtain-price-loading").hide();
    $(".obtain-price").show();
    checkInf();
    enableButton = true;
    selectDateEventForCityDirect.setEnableButton(enableButton);
    initdetailsOfChargesDiglosDom(pricePrest,internalDistance,priceDistance,pricePremium,internalTotalPrice)
  }

  // 费用明细弹窗 数据 DOM 初始化
  function initdetailsOfChargesDiglosDom(pricePrest,internalDistance,priceDistance,pricePremium,internalTotalPrice){

    $("#pricePrest-id").html(pricePrest.toFixed(2));
    $("#internalDistance-id").html(internalDistance);
    $("#priceDistance-id").html(priceDistance.toFixed(2));
    $("#pricePremium-id").html(pricePremium.toFixed(2));
    $("#internalTotalPrice-id").html(internalTotalPrice.toFixed(2));
  }
 	function orderPromptDialogEvent() {
 		// 绑定"仍然下单"按钮的点击事件
 		$(document).on("click", ".continue_order", function () {
 			$(".otherOrder").hide();
 			$(".once_order").show();
 		})
 		// 绑定 关闭dialog 的点击事件
 		$(document).on("click", ".closeDialog", function () {
 			$(".once_order").hide();
 			$(".otherOrder").hide();
 		})
 		// 绑定"知道了"按钮的点击事件
 		$(document).on("click", ".Iknow", function () {
 			BizLog.call('info', {
 				spmId: "a106.b2109.c5305.d8437",
 				actionId: 'clicked',
 			});
 			$(".once_order").hide();
 			if (enableButton) {
 				if ($(".single_btn").hasClass("disabled")) {
 					return;
 				} else {
 					enableButton = false;
 					selectDateEventForCityDirect.setEnableButton(enableButton)
 					$(".single_btn").addClass("loading");
 					$(".single_btn").attr("role", "alert");
 					$(".single_btn").attr("aria-live", "assertive");
 					$(".single_btn").html('<i class="icon" aria-hidden="true"></i>加载中...');
 					setTimeout(function () {
 						enableButton = true;
 						selectDateEventForCityDirect.setEnableButton(enableButton)
 						$(".single_btn").removeClass("loading");
 						$(".single_btn").html("立即下单");
 					}, 7000);
 					addressOrder();
 				}
 			}
 		})
 	}

 	// 提交订单信息
 	function addressOrder() {
 		var addServiceArr = [],
 			classArr = $(".extra_service div");
 		if (classArr && classArr.length != 0) {
 			for (var i = 0; i < classArr.length; i++) {
 				if ($(classArr[i]).hasClass("express_active_change")) {
 					addServiceArr.push($(classArr[i]).text());
 				}
 			}
 			addServiceArr = addServiceArr.join(",");
 		} else {
 			addServiceArr = "1";
 		}
 		var remarkStr = emojione.toShort(bFromCityDirect?$("#text-content").val():$(".text-content").val()).replace(/\:[a-z0-9_]+\:/g, '')
 		if (remarkStr == '其他要求请在此备注(选填)') {
 			remarkStr = "";
 		}
 		ant.setSessionData({
 			data: {
 				addServiceArr: addServiceArr,
 				remarkContent: remarkStr
 			}
 		});
 		if (checkInf()) {
 			var info = {
 				"logisMerchLog": logisMerchLog,
 				"senderAddrID": JSON.parse(senderAddrID) == -1 ? 0 : JSON.parse(senderAddrID),
 				"reciptiensAddrID": JSON.parse(reciptiensAddrID) == -1 ? 0 : JSON.parse(reciptiensAddrID),
 				"productTypeCode": productTypeCode,
 				"discount": JSON.parse(discount),
 				"logisMerchId": JSON.parse(epCompanyId),
 				"productId": JSON.parse(productTypeId),
 				"snderName": real_sendName,
 				"snderMobile": $(".data-senderNumber").attr("real-sendnumber"),
 				"snderPrvnCode": $(".data-senderName").attr("data-provinceNo"),
 				"snderCityCode": $(".data-senderName").attr("data-cityNo"),
 				"snderDstrCode": $(".data-senderName").attr("data-areaNo"),
 				"snderStreet": "",
 				"snderAddress": $(".data-detailaddress").text(),
 				"rcvrName": real_recName,
 				"rcvrMobile": $(".data-recipientsNumber").attr("real-recNumber"),
 				"rcvrPrvnCode": $(".data-recipientsName").attr("data-recprovinceNo"),
 				"rcvrCityCode": $(".data-recipientsName").attr("data-reccityNo"),
 				"rcvrDstrCode": $(".data-recipientsName").attr("data-recareaNo"),
 				"rcvrStreet": "",
 				"rcvrAddress": $(".data-redetailaddress").text(),
 				"bookedDay": ($(".day1").val() == "今天" ? "TDY" : ($(".day1").val() == "明天" ? "TOM" : "AFT")),
 				"bookedTime": $(".time1").val() == "立即取件"?"NOW":$(".time1").val(),
        "bookedMinute":$(".minutes").val()||"0",
 				"goodsType": $(".goodstype").text(),
 				"goodsWeight": $(".goodsweightNum").val() * 1000,
 				"remark": remarkStr,
 				"addService": addServiceArr,
 				"estimatePrice": JSON.parse($(".estimatePrice-data").text()) * 100,
        "orderAmout":(internalTotalPrice*100)+""
 			};
 			var xhrurl = jUrl + '/ep/order/save';
 			// 在没网的情况下 除去加载状态
 			if (!isNetworkAvailable) {
 				enableButton = true;
 				selectDateEventForCityDirect.setEnableButton(enableButton)
 				$(".single_btn").removeClass("loading");
 				$(".single_btn").html("立即下单");
 			}
 			$.axs(xhrurl, info, function (data) {

 				$(".single_btn").removeClass("loading");
 				$(".single_btn").html("立即下单");
 				if (data.meta.code == "0000") {
          var result = data.result;
 					orderNo = result.orderNo|| '';
          orderStr = result.orderStr || ''
 					//下单成功，清空seesion
 					//clearSeesion();
 					if(bFromCityDirect){
            startTradePay();
          }else {
            pushWindow("success-order.html?orderNo=" + orderNo + ""+"&bFromCityDirect="+bFromCityDirect, false);
          }
 				} else {
 					ant.pushWindow({
 						url: "single-failure.html?epCompanyName=" + epCompanyName
 					});
 				}
 			}, function (data) {
 				enableButton = true;
 				selectDateEventForCityDirect.setEnableButton(enableButton)
 				$(".single_btn").removeClass("loading");
 				$(".single_btn").html("立即下单");
 				// 存在已取件 并未支付的订单
 				if (data.meta.code == "1820") {
 					enableButton = true;
 					selectDateEventForCityDirect.setEnableButton(enableButton)
 					$(".single_btn").removeClass("loading");
 					$(".single_btn").html("立即下单");
 					setTimeout(function () {
 						notPaidOrder(data.result.notPaidOrderNo, data.result.notPaidRemindCnt);
 					}, 10);
 				} else if (data.meta.code == '1810') {
 					toast({
 						text: "预约取件时间无效",
 						type: 'exception'
 					})
 					//保存订单失败，提示重试 toast
 				} else if (data.meta.code == '1812') {
 					enableButton = true;
 					selectDateEventForCityDirect.setEnableButton(enableButton)
 					$(".single_btn").removeClass("disabled");
 					ant.getSessionData({
 						keys: ['epCompanyName']
 					}, function (result) {
 						epCompanyName = result.data.epCompanyName;
 						BizLog.call('info', {
 							spmId: "a106.b2109.c4855",
 							actionId: 'exposure',
 							params: {
 								CompName: epCompanyName
 							}
 						});
 					})

 					$(".dialog-num").show();
 					//保存订单失败，提示重试 toast
 				} else if (data.meta.code == '1813') {
 					toast({
 						text: "快递公司下单失败",
 						type: 'exception'
 					})
 				} else if (data.meta.code == '1817') {
 					var tempData2 = data.result.times;
 					InitSelect.initselectDateEvent(tempData2);
 					toast({
 						text: "请重新确认上门时间",
 					})
 				} else if(data.meta.code == '1830'){
          handlePriceDataCityDirect(data.result);
          toast({
 						text: "请重新确认订单金额"
 					})
        }else {
 					toast({
 						text: "创建订单失败，请重试",
 						type: 'exception'
 					})
 				}
 			});
 		}
 	}

  // 调用收银台，进入快捷支付
  function startTradePay(){
    var	internalOrderStr = orderStr.replace(/&amp;/g,"&")
                      .replace(/&lt;/g,"<")
                      .replace(/&gt;/g,">")
                      .replace(/&nbsp;/g," ")
                      .replace(/&#39;/g,"\'")
                      .replace(/&quot;/g,"\"");
    console.log(internalOrderStr)
    AlipayJSBridge.call('tradePay',{
          orderStr:internalOrderStr
    },function(result){
      if(result.resultCode == "9000"){
        // "9000"  表示支付成功，跳转下单成功页面
        pushWindow("success-order.html?orderNo=" + orderNo + ""+"&bFromCityDirect="+bFromCityDirect, false);

      }else {
        // 中途退出下单, 弹窗提示
        $(".tradePay-class").addClass("show").attr("aria-hidden","false");
      }
    })}

 });
