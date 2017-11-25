Zepto(function ($) {
	FastClick.attach(document.body);
	console.log(getUrlParam("edit") == "edit");
	var urlParam = getUrlParam("edit");
	var spmPageId = "";
	var spmName = "";
	var spmPhone = "";
	var spmDistrict = "";
	// var spmLocation="";
	var spmAddress = "";
	var spmSave = "";
	var spmComplete = "";
	var currentCityName = "" // 当前城市名
	var spm_AddrId = ""; //记录编辑寄件人地址ID
	if (urlParam == "edit") {
		spmPageId = "a106.b2104";
		spmName = "a106.b2104.c4601.d7120";
		spmPhone = "a106.b2104.c4601.d7121";
		spmDistrict = "a106.b2104.c4601.d7122";
		//    spmLocation="a106.b2104.c4601.d7123";
		spmAddress = "a106.b2104.c4601.d7124";
		spmComplete = "a106.b2104.c4600.d7119";
		$('body').attr("data-aspm", "b2104")
		$(".sender_name").attr("data-spmv", spmName);
		$(".sender_phone").attr("data-spmv", spmPhone);
		$(".sender_address").attr("data-spmv", spmDistrict);
		//  $(".get_location").attr("data-spmv",spmLocation);
		$(".sender_dizhi").attr("data-spmv", spmAddress);
		$(".am-button").attr("data-spmv", spmComplete);
		//添加编辑埋点 AddrId
		ant.getSessionData({
			keys: ['edit_senderAddrID']
		}, function (result) {
			spm_AddrId = result.data.edit_senderAddrID
		})
		ant.call('setTitle', {
			title: '编辑寄件人地址'
		});
	} else if (urlParam == "write") {
		spmPageId = "a106.b2102";
		spmName = "a106.b2102.c4593.d7100";
		spmPhone = "a106.b2102.c4593.d7101";
		spmDistrict = "a106.b2102.c4593.d7102";
		//    spmLocation="a106.b2102.c4593.d7103";
		spmAddress = "a106.b2102.c4593.d7104";
		spmSave = "a106.b2102.c4593.d7105";
		spmComplete = "a106.b2102.c4594.d7106";
		$('body').attr("data-aspm", "b2102")
		$(".sender_name").attr("data-spmv", spmName);
		$(".sender_phone").attr("data-spmv", spmPhone);
		$(".sender_address").attr("data-spmv", spmDistrict);
		//  $(".get_location").attr("data-spmv",spmLocation);
		$(".sender_dizhi").attr("data-spmv", spmAddress);
		$("#defaultClick").attr("data-spmv", spmSave);
		$(".am-button").attr("data-spmv", spmComplete);
		ant.call('setTitle', {
			title: '填写寄件人地址'
		});
		$(".defaultSelect").show();
	} else {
		spmPageId = "a106.b2122";
		spmName = "a106.b2122.c4681.d7296";
		spmPhone = "a106.b2122.c4681.d7297";
		spmDistrict = "a106.b2122.c4681.d7298";
		//    spmLocation="a106.b2122.c4681.d7299";
		spmAddress = "a106.b2122.c4681.d7300";
		spmComplete = "a106.b2122.c4682.d7301";
		$('body').attr("data-aspm", "b2122")
		$(".sender_name").attr("data-spmv", spmName);
		$(".sender_phone").attr("data-spmv", spmPhone);
		$(".sender_address").attr("data-spmv", spmDistrict);
		//  $(".get_location").attr("data-spmv",spmLocation);
		$(".sender_dizhi").attr("data-spmv", spmAddress);
		$(".am-button").attr("data-spmv", spmComplete);
		ant.call('setTitle', {
			title: '添加寄件人地址'
		});
	}
	ant.on('resume', function (event) {
		ant.getSessionData({
			 keys:['autocomplete_address']
		},function(result){
			 var autocomplete_address = result.data.autocomplete_address;
			 if(autocomplete_address !== ""){
			 var emoji = emojione.toShort(autocomplete_address);
	 		$(".sender_dizhi").val(emoji.replace(/\:[a-z0-9_]+\:/g, ''));
	 		$('textarea[autoHeight]').autoHeight();
		}
		})
	})
	ant.setSessionData({
		data: {
			autocomplete_address: "",
			autocomplete_cityName: ""
		}
	});

	// BizLog.call('info',{
	//     spmId:spmPageId,
	//     actionId:'pageMonitor'
	// });
	function getLocation() {
		AlipayJSBridge.call('showLoading', {
			text: '正在定位',
		});
		ant.call('getLocation', function (result) {
			setTimeout(function () {
				AlipayJSBridge.call('hideLoading');
			}, 300);
			// alert(JSON.stringify(result));
			// alert(result.error)
			if (result.error) {
				toast({
					text: "无法获取定位信息\n请设置允许app获取定位权限"
				});
				return;
			}

			var res = getAreaNameByCode(result.adcode, true);
			var arr = res.split(" ");
			if (arr.length <= 2) {
				toast({
					text: "无法获取定位信息"
				});
				return;
			}
			var provinceName = arr[0];
			var cityName = arr[1];
			currentCityName = cityName;
			var districtName = arr[2];

			var provinceCode = result.adcode.substring(0, 2) + "0000";
			var cityCode = result.adcode.substring(0, 4) + "00";
			var districtCode = result.adcode;
			$(".provincial_city").attr("data-province-code", provinceCode);
			$("#contact_province_code").val(provinceCode);
			$(".provincial_city").attr("data-city-code", cityCode);
			$("#contact_city_code").val(cityCode);
			$(".provincial_city").attr("data-district-code", districtCode);
			$("#contact_district_code").val(districtCode);

			var areaName = subAreaString(provinceName, cityName, districtName);
			$(".provincial_city").val(areaName);
			$("#contact_district_code").attr("data-district-name", districtName);
			$("#contact_city_code").attr("data-city-name", cityName);
			$("#contact_province_code").attr("data-province-name", provinceName);
		});
	}
	// 校验每个input中的值
	function checkInput() {
		if ($(".sender_name").val() == '' || $(".sender_name").val().trim().length === 0 || $(".sender_name").val().length >= 21) {
			toast({
				text: '姓名不能为空'
			});
			return false;
		}

		if ($(".sender_phone").val() == '' || !isCorrectPhoneNum($(".sender_phone").val())) {
			toast({
				text: "请输入正确的手机号或座机号"
			});
			return false;
		}
		if ($(".sender_address").val() == '' || $(".sender_address").val() == ' ') {
			toast({
				text: "请选择地区"
			});
			return;
		}
		if ($(".sender_dizhi").val() == '' || $(".sender_dizhi").val().trim().length === 0 || $(".sender_dizhi").val().length >= 51) {
			toast({
				text: '详细地址不能为空'
			});
			return false;
		}
		return true;
	}
	// 给每个input add 事件监听
	$.fn.autoHeight = function () {
		function autoHeight(elem) {
			elem.style.height = 'auto';
			elem.scrollTop = 0; //防抖动
			elem.style.height = elem.scrollHeight + 'px';

		}
		this.each(function () {
			autoHeight(this);
			$(this).on('input', function () {
				autoHeight(this);
			});

		});
	};
	$('textarea[autoHeight]').autoHeight();
	// $(".input_tab").on("input propertychange", function() {
	//     // checkInput();
	// });
	// 姓名input
	// bug  当用户当前输入法状态是中文时，在未选择词组到输入框也会触发事件
	var nameLock = false;
	$(".sender_name").bind("compositionstart", function () {
		console.log("compositionstart");
		nameLock = true;
	});
	$(".sender_name").bind("compositionend", function () {
		nameLock = false;
	});
	$(".sender_name").bind("input", function () {
		console.log("sendname  input" + $(this).val());
		if (!nameLock) {
			// 禁止表情 和 数字
			var emoji = emojione.toShort($(this).val());
			var reg = /\:[a-z0-9_]+\:/g;
			//  alert(" reg "+reg.test(emoji));
			if (reg.test(emoji)) {
				emoji = emoji.replace(/\:[a-z0-9_]+\:/g, '');
				$(this).val(emoji);
			}

			if ($(this).val().length >= 21) {
				var tempval = $(this).val().slice(0, 20);
				$(this).val(tempval);
			}
		}
	});
	// 手机号码 input
	$(".sender_phone").bind('input', function () {
		var phoneNum = $(this).val();
		phoneNum = processPhoneNum(phoneNum);
		$(this).val(phoneNum);
	});
	// 详细地址input
	// bug  当用户当前输入法状态是中文时，在未选择词组到输入框也会触发事件
	// var addressLock = false;
	// $(".sender_dizhi").bind("compositionstart",function(){
	//      addressLock=true;
	// })
	// $(".sender_dizhi").bind("compositionend",function(){
	//      var  emoji = emojione.toShort($(this).val());
	//        $(this).val(emoji.replace(/\:[a-z0-9_]+\:/g,''));
	//         // $(this).val($(this).val()+"h")
	//     if ($(this).val().length == 51) {
	//         var tempval = $(this).val().slice(0, 50);
	//         $(this).val(tempval);
	//     }
	//      addressLock=false;
	// });
	//  $(".sender_dizhi").bind('input', function() {
	//      if(!addressLock){
	//          var  emoji = emojione.toShort($(this).val());
	//           $(this).val(emoji.replace(/\:[a-z0-9_]+\:/g,''));
	//            // $(this).val($(this).val()+"h")
	//        if ($(this).val().length == 51) {
	//            var tempval = $(this).val().slice(0, 50);
	//            $(this).val(tempval);
	//        }
	//      }
	//  });
	// 获取定位按钮
	// $(".get_location").on("click", function() {
	//     BizLog.call('info',{
	//         seedId:spmLocation,
	//         actionId:'clicked'
	//     });
	//     getLocation();
	// });
	$(".sender_dizhi").bind('click', function () {
		if (currentCityName === ""){
			toast({
					text: "请先选择地区"
				});
				return;
			}
		var sender_address = $(".sender_dizhi").val();
		ant.setSessionData({
			data: {
				autocomplete_address: sender_address,
				autocomplete_cityName: currentCityName
			}
		});
		pushWindow('autocomplete.html', false);
	});

	//添加input click的 log 上报
	$(".sender_name").on("click", function () {
		if (urlParam == "edit") {
			BizLog.call('info', {
				spmId: spmName,
				actionId: 'clicked',
				params: {
					AddrID: spm_AddrId
				}
			});
		} else {
			BizLog.call('info', {
				spmId: spmName,
				actionId: 'clicked'
			});
		}

	});
	$(".sender_phone").on("click", function () {
		if (urlParam == "edit") {
			BizLog.call('info', {
				spmId: spmPhone,
				actionId: 'clicked',
				params: {
					AddrID: spm_AddrId
				}
			});
		} else {
			BizLog.call('info', {
				spmId: spmPhone,
				actionId: 'clicked'
			});
		}

	});
	$(".sender_dizhi").on("click", function () {
		if (urlParam == "edit") {
			BizLog.call('info', {
				spmId: spmAddress,
				actionId: 'clicked',
				params: {
					AddrID: spm_AddrId
				}
			});
		} else {
			BizLog.call('info', {
				spmId: spmAddress,
				actionId: 'clicked'
			});
		}

	});


	//区域选择
	(function () {
		var selectContactDom = $('#select_contact');
		var showContactDom = $('#show_contact');
		var contactProvinceCodeDom = $('#contact_province_code');
		var contactCityCodeDom = $('#contact_city_code');
		var contactDistrictCodeDom = $('#contact_district_code');
		$(".choise_addressstitle").click(function () {
			if (urlParam == "edit") {
				BizLog.call('info', {
					spmId: spmDistrict,
					actionId: 'clicked',
					params: {
						AddrID: spm_AddrId
					}
				});
			} else {
				BizLog.call('info', {
					spmId: spmDistrict,
					actionId: 'clicked'
				})
			}


			$("body").on('touchmove', function (event) {
				event.preventDefault();
			}, false);
			$(".sender_name").blur();
			$(".sender_phone").blur();
			$(".sender_dizhi").blur();
			selectContactDom.find("input").focusin(function () {
				this.blur();
			});
			var sccode = showContactDom.attr('data-city-code');
			var scname = showContactDom.attr('data-city-name');
			var oneLevelId = showContactDom.attr('data-province-code');
			var twoLevelId = showContactDom.attr('data-city-code');
			var threeLevelId = showContactDom.attr('data-district-code');
			var iosSelect = new IosSelect(3, [iosProvinces, iosCitys, iosCountys], {
				//title: '地址选择',
				itemHeight: 35,
				headerHeight: 42,
				cssUnit: 'px',
				relation: [1, 1, 0, 0],
				oneLevelId: oneLevelId,
				twoLevelId: twoLevelId,
				threeLevelId: threeLevelId,
				callback: function (selectOneObj, selectTwoObj, selectThreeObj) {

					contactProvinceCodeDom.val(selectOneObj.id);
					contactProvinceCodeDom.attr('data-province-name', selectOneObj.value);
					contactDistrictCodeDom.val(selectThreeObj.id);
					contactDistrictCodeDom.attr('data-district-name', selectThreeObj.value);
					contactCityCodeDom.val(selectTwoObj.id);
					contactCityCodeDom.attr('data-city-name', selectTwoObj.value);
					showContactDom.attr('data-province-code', selectOneObj.id);
					showContactDom.attr('data-city-code', selectTwoObj.id);
					showContactDom.attr('data-district-code', selectThreeObj.id);
					var provinceName = selectOneObj.value;
					var cityName = selectTwoObj.value;
					currentCityName = cityName;
					var districtName = selectThreeObj.value;

					console.log("provinceName " + provinceName + "cityName " + cityName + "districtName " + districtName + "selectThreeObj.id " + selectThreeObj.id);
					var areaName = subAreaString(provinceName, cityName, districtName);
					showContactDom.val(areaName);
				}
			});

		});
	})();

	// 判断 填写页面，checkbox 的点击事件
	if (urlParam == "write") {
		$("#defaultCheckBox").find("span").css({
			"background-image": "url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png)"
		});
		$("#defaultClick").click(function () {
			if (urlParam == "edit") {
				BizLog.call('info', {
					spmId: spmSave,
					actionId: 'clicked',
					params: {
						AddrID: spm_AddrId
					}
				});
			} else {
				BizLog.call('info', {
					spmId: spmSave,
					actionId: 'clicked'
				});
			}


			var _this = $("#defaultCheckBox");
			if (_this.hasClass("defaultSelect")) {
				_this.toggleClass("defaultSelect");
				_this.find("span").css({
					"background-image": "url(https://kuaidi-dev.oss-cn-hangzhou.aliyuncs.com/mobile/default-noSelect.png)"
				});
			} else {
				_this.toggleClass("defaultSelect");
				_this.find("span").css({
					"background-image": "url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png)"
				});
			}
		});
	}

	//点击提交操作 事件
	var submitFlag = false; //  防止误点多次，
	$(".am-button").click(function () {
		if (urlParam == "edit") {
			BizLog.call('info', {
				spmId: spmComplete,
				actionId: 'clicked',
				params: {
					AddrID: spm_AddrId
				}
			});
		} else {
			BizLog.call('info', {
				spmId: spmComplete,
				actionId: 'clicked'
			});
		}

		if (submitFlag || (!checkInput())) {
			return;
		} else {



			submitFlag = true;
			var loaging = '<i class="icon" aria-hidden="true"></i>' +
				'正在保存...';
			$(".am-button").html(loaging);
			setTimeout(function () {
				submitFlag = false;
				$(".am-button").html('完成');
			}, 8000);
			var id = $(".sender_name").attr("data-sendID");
			if (urlParam == "write") {
				var sendVal = cellPhoneHide($(".sender_phone").val())
				ant.setSessionData({
					data: {
						//  senderAddrID:0,
						sendName: nameHide(emojione.toShort($(".sender_name").val()).replace(/\:[a-z0-9_]+\:/g, '')),
						real_sendName: emojione.toShort($(".sender_name").val()).replace(/\:[a-z0-9_]+\:/g, ''),
						sendNumber: sendVal,
						real_sendNumber: $(".sender_phone").val(),
						sendProvinceCode: $('#show_contact').attr("data-province-code"),
						sendCityCode: $('#show_contact').attr("data-city-code"),
						sendAreaCode: $('#show_contact').attr("data-district-code"),
						sendStreet: getAreaNameByCode($('#show_contact').attr("data-district-code")).replace(/\s/g, ""),
						sendAddress: emojione.toShort($(".sender_dizhi").val()).replace(/\:[a-z0-9_]+\:/g, ''),
					}
				});
				if ($("#defaultCheckBox").hasClass("defaultSelect")) {
					if (id != "-1" && emojione.toShort($(".sender_name").val()).replace(/\:[a-z0-9_]+\:/g, '') == sendName && $(".sender_phone").val() == sendNumber && $('#show_contact').attr("data-district-code") == sendAreaCode && $(".sender_dizhi").val() == sendAddress) {
						ant.popWindow();
						console.log("write  data not change");
						return;
					} else {
						id = false;
					}
				} else {
					if (emojione.toShort($(".sender_name").val()).replace(/\:[a-z0-9_]+\:/g, '') == sendName && $(".sender_phone").val() == sendNumber && $('#show_contact').attr("data-district-code") == sendAreaCode && $(".sender_dizhi").val() == sendAddress) {} else {
						ant.setSessionData({
							data: {
								senderAddrID: -1,
							}
						});
					}
					ant.popWindow();
					return;
				}
			}
			if (id) {
				var info = {
					"id": id,
					"name": emojione.toShort($(".sender_name").val()).replace(/\:[a-z0-9_]+\:/g, ''),
					"mobile": $(".sender_phone").val(),
					"provinceCode": $('#show_contact').attr("data-province-code"),
					"cityCode": $('#show_contact').attr("data-city-code"),
					"districtCode": $('#show_contact').attr("data-district-code"),
					"street": '',
					"address": emojione.toShort($(".sender_dizhi").val()).replace(/\:[a-z0-9_]+\:/g, '')
				};
				var xhrurl = jUrl + '/ep/sender/edit';
			} else {
				//add
				var info = {
					"name": emojione.toShort($(".sender_name").val()).replace(/\:[a-z0-9_]+\:/g, ''),
					"mobile": $(".sender_phone").val(),
					"provinceCode": $('#show_contact').attr("data-province-code"),
					"cityCode": $('#show_contact').attr("data-city-code"),
					"districtCode": $('#show_contact').attr("data-district-code"),
					"street": '',
					"address": emojione.toShort($(".sender_dizhi").val()).replace(/\:[a-z0-9_]+\:/g, '')
				};
				var xhrurl = jUrl + '/ep/sender/add';

			}
			$.axs(xhrurl, info, function (data) {
				if (data.meta.success) {


					//说明是从地址页直接跳转过来，将当前新增地址当做被选中地址，并将senderCount 置为1
					if ((senderCount == 0 && !id) || urlParam == "write") {
						senderCount++;
						ant.setSessionData({
							data: {
								senderCount: senderCount
							}
						});
						if (senderCount == 1 && !id && isFromAddress == -1) {} else {
							var sendVal = cellPhoneHide(data.result.mobile)
							var tempSendNumber = sendVal;
							var tempSendName = nameHide(data.result.name);
							var tempStreet = getAreaNameByCode(data.result.districtCode).replace(/\s/g, "")
							ant.setSessionData({
								data: {
									senderAddrID: data.result.id,
									sendName: tempSendName,
									sendNumber: tempSendNumber,
									real_sendName: data.result.name,
									real_sendNumber: data.result.mobile,
									sendProvinceCode: data.result.provinceCode,
									sendCityCode: data.result.cityCode,
									sendAreaCode: data.result.districtCode,
									sendStreet: tempStreet,
									sendAddress: data.result.address,
								}
							});
						}

					}
					ant.popWindow();
				}
			});
		}
	});
	var senderCount = 0;
	var sendName; // 记录寄件人姓名
	var sendNumber; // 记录寄件人手机号
	var areaNameInit; // 记录寄件人地区
	var sendAreaCode; // 记录寄件人地区code
	var sendAddress; // 记录寄件人详细地址
	var isFromAddress // 判断是否从地址填写界面有临时填写的地址。 -1 代表存在临时地址
	/**
	 * 下面 判断add or edit
	 */
	//新增
	ant.getSessionData({
		keys: ['edit_senderAddrID',
        'edit_sendName',
        'edit_sendNumber',
        'edit_sendAddress',
        'edit_sendProvinceCode',
        'edit_sendCityCode',
        'edit_sendAreaCode',
        'senderCount', 'senderAddrID']
	}, function (result) {
		// edit  事件过来
		isFromAddress = result.data.senderAddrID;
		// alert(isFromAddress);
		// alert(isFromAddress!=-1)
		if (result.data.senderCount) {
			senderCount = result.data.senderCount;
		}
		if (result.data.edit_senderAddrID && (urlParam == "edit" || urlParam == "write")) {
			var senderAddrID = result.data.edit_senderAddrID;
			sendName = result.data.edit_sendName || '';
			sendNumber = result.data.edit_sendNumber || '';
			sendAddress = result.data.edit_sendAddress || '';
			var sendProvinceCode = result.data.edit_sendProvinceCode || '';
			var sendCityCode = result.data.edit_sendCityCode || '';
			sendAreaCode = result.data.edit_sendAreaCode || '';
			$(".sender_name").attr("data-sendID", senderAddrID);
			$(".sender_name").val(sendName);
			$(".sender_phone").val(sendNumber);
			$(".sender_dizhi").val(sendAddress);

			$('textarea[autoHeight]').autoHeight();
			var sRid = getUrlParam('sRid');
			var selectSUid = getUrlParam('selectSUid');
			for (var i = 0; i < iosProvinces.length; i++) {
				if (sendProvinceCode == iosProvinces[i].id) {
					$("#contact_province_code").val(iosProvinces[i].id);
					$("#contact_province_code").attr("data-province-name", iosProvinces[i].value);
				}
			}
			for (var i = 0; i < iosCitys.length; i++) {
				if (sendCityCode == iosCitys[i].id) {
					$("#contact_city_code").val(iosCitys[i].id);
					$("#contact_city_code").attr("data-city-name", iosCitys[i].value);
				}
			}
			for (var i = 0; i < iosCountys.length; i++) {
				if (sendAreaCode == iosCountys[i].id) {
					$("#contact_district_code").val(iosCountys[i].id);
					$("#contact_district_code").attr("data-district-name", iosCountys[i].value);
				}
			}

			var provinceName = $("#contact_province_code").attr("data-province-name");
			var cityName = $("#contact_city_code").attr("data-city-name");
			currentCityName = cityName;
			var districtName = $("#contact_district_code").attr("data-district-name");
			areaNameInit = subAreaString(provinceName, cityName, districtName);
			$(".sender_address").val(areaNameInit);
			$(".sender_address").attr("data-province-code", $("#contact_province_code").val());
			$(".sender_address").attr("data-city-code", $("#contact_city_code").val());
			$(".sender_address").attr("data-district-code", $("#contact_district_code").val());

		} else {
			// 这里表示新增
			getLocation();
		}
	});

});
