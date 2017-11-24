Zepto(function($){
	FastClick.attach(document.body);
	ant.call('setTitle', {
		title: '编辑收件人地址'
	});

	$.fn.autoHeight = function(){
		function autoHeight(elem){
			elem.style.height = 'auto';
			elem.scrollTop = 0;
			elem.style.height = elem.scrollHeight + 'px';
		}
		this.each(function(){
			autoHeight(this);
			$(this).on('input', function(){
				autoHeight(this);
			});
		});
	}
	initPage();
	var receiverCount =0;
	function initPage(){
		ant.getSessionData({
			keys: ['edit_reciptiensAddrID',
				'edit_recName',
				'edit_recNumber',
				'edit_recProvinceCode',
				'edit_recCityCode',
				'edit_recAreaCode',
				'edit_recStreet',
				'edit_recAddress',
				'receiverCount']
		}, function (result) {
			var reciptiensAddrID = result.data.edit_reciptiensAddrID || '';
			var recName = result.data.edit_recName  || '';
			var recNumber = result.data.edit_recNumber  || '';
			var recAddress = result.data.edit_recAddress  || '';
			var recProvinceCode = result.data.edit_recProvinceCode  || '';
			var recCityCode = result.data.edit_recCityCode  || '';
			var recAreaCode = result.data.edit_recAreaCode  || '';
			var recStreet = result.data.edit_recStreet || '';
			var recAddress = result.data.edit_recAddress || '';
			receiverCount = result.data.receiverCount;
			//session中有信息，则说明是编辑模式,进行页面初始化
			if(reciptiensAddrID){
				$("#reciptiens_id").val(reciptiensAddrID);
				$(".recipient_name").val(recName);
				$(".mobile_numbers").val(recNumber);
				$(".sender_dizhi").val(recAddress);
				$('textarea[autoHeight]').autoHeight();
				for(var i=0;i<iosProvinces.length;i++){
					if(recProvinceCode == iosProvinces[i].id){
						$("#contact_province_code_re").val(iosProvinces[i].id);
						$("#contact_province_code_re").attr("data-province-name-re",iosProvinces[i].value);
					}
				}
				for(var i=0;i<iosCitys.length;i++){
					if(recCityCode == iosCitys[i].id){
						$("#contact_city_code_re").val(iosCitys[i].id);
						$("#contact_city_code_re").attr("data-city-name-re",iosCitys[i].value);
					}
				}
				for(var i=0;i<iosCountys.length;i++){
					if(recAreaCode == iosCountys[i].id){
						$("#contact_district_code_re").val(iosCountys[i].id);
						$("#contact_district_code_re").attr("data-district-name-re",iosCountys[i].value);
					}
				}
				var provinceName = $("#contact_province_code_re").attr("data-province-name-re");
				var cityName =$("#contact_city_code_re").attr("data-city-name-re");
				var districtName =  $("#contact_district_code_re").attr("data-district-name-re");
				var areaName =subAreaString(provinceName,cityName,districtName,"true");
				$(".recipient_address").val(areaName);
				$(".recipient_address").attr("data-province-code-re",$("#contact_province_code_re").val());
				$(".recipient_address").attr("data-city-code-re",$("#contact_city_code_re").val());
				$(".recipient_address").attr("data-district-code-re",$("#contact_district_code_re").val());
				$(".complete_btn button").removeClass("disabled");
			}else{
				$(".complete_btn button").addClass("disabled");
			}

			$('textarea[autoHeight]').autoHeight();

			initButtonStatus();
			bindInputCheckEvent();
			initSubmitButton();


		});
	}

	function bindInputCheckEvent() {

		$(".input_tab").on("input propertychange",function(){
			checkInput();
		});

		// 姓名input
		// bug  当用户当前输入法状态是中文时，在未选择词组到输入框也会触发事件
		var recipientLock= false;
		$(".recipient_name").bind("compositionstart",function(){
				 recipientLock=true;
		})
		$(".recipient_name").bind("compositionend",function(){
				 recipientLock=false;
		})
		$(".recipient_name").bind('input',function(){
			if(!recipientLock){
				  // 禁止表情 和 数字
				var  emoji = emojione.toShort($(this).val());
				emoji = emoji.replace(/\:[a-z0-9_]+\:/g,'');
				// emoji = emoji.replace(/[0-9]/g,'');
				$(this).val(emoji);

				if ($(this).val().length == 21) {
					var tempval = $(this).val().slice(0,20);
					$(this).val(tempval);
					toast({
						text: '姓名不能超过20个汉字'
					});
				}
	  	}
		});
		// 失去焦点时判断 不能为空格
		$(".recipient_name").bind("blur",function() {
						if ($(this).val().trim().length === 0) {
								// toast({
								// 		text: '姓名不能为空'
								// });
						 }
				});
		$(".mobile_numbers").bind('input',function(){
			var phoneNum = $(this).val();
			phoneNum = processPhoneNum(phoneNum);
			$(this).val(phoneNum);
			checkInput();
		});
		$(".mobile_numbers").bind('blur',function(){
			var phoneNum = $(this).val();
			if(phoneNum == ''){
				return;
			}
			if(!isCorrectPhoneNum(phoneNum)){
				$(".complete_btn button").addClass("disabled");
				toast({
					text:"请输入正确的手机号"
				});
			}
		});

		// 详细地址input
		// bug  当用户当前输入法状态是中文时，在未选择词组到输入框也会触发事件
		var recipientAddressLock= false;
		$(".recipient_dizhi").bind("compositionstart",function(){
				 recipientAddressLock=true;
		});
		$(".recipient_dizhi").bind("compositionend",function(){
				 recipientAddressLock=false;
		});
		$(".recipient_dizhi").bind('input',function(){
			if(!recipientAddressLock){
				var  emoji = emojione.toShort($(this).val());
				 $(this).val(emoji.replace(/\:[a-z0-9_]+\:/g,''));

					if ($(this).val().length == 51) {
						var tempval = $(this).val().slice(0,50);
						$(this).val(tempval);
						toast({
							text: '详细地址不能超过50个汉字'
						});
					}
		 }
		});
		  // 失去焦点时判断 不能为空格
		$(".recipient_dizhi").bind("blur",function() {
            if ($(this).val().trim().length === 0) {
                // toast({
                //     text: '详细地址不能为空'
                // });
             }
        });

	}

	function initButtonStatus(){
		//通信录按钮
		$(".get_location").on("touchstart",function(){

			ant.call("contact", function(result) {
				if(result.errorCode && result.errorCode == 10 ){
                    toast({
                        text: "无通讯录访问权限\n请设置允许app访问通讯录"
                    });
					// alert("无通讯录访问权限\n请设置允许app访问通讯录");
				}else{
					//处理姓名超过10个字符 和 手机号的特殊字符处理操作
					$(".recipient_name").val(JSON.parse(JSON.stringify(result.name)));
					var mobile_numbers = JSON.parse(JSON.stringify(result.mobile)).replace(/[^0-9]/ig,"");
					// 从右往左截取11位
					var temp =mobile_numbers.length-11;
					if(temp>0){
						mobile_numbers=mobile_numbers.substring(temp);
					}
					// 正则验证手机号
					var reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
					if(!(reg.test(mobile_numbers))){
								toast({
										text:"请输入正确的手机号"
								})

					}
					$(".mobile_numbers").val(mobile_numbers);



					checkInput();
				}

			});
		});

		var selectContactDomRe = $('#select_contact_re');
		var showContactDomRe = $('#show_contact_re');
		var contactProvinceCodeDomRe = $('#contact_province_code_re');
		var contactCityCodeDomRe = $('#contact_city_code_re');
		var contactDistrictCodeDomRe = $('#contact_district_code_re');
		//城市选择下拉
		selectContactDomRe.click(function(){
			$(".recipient_name").blur();
			$(".mobile_numbers").blur();
			$(".recipient_dizhi").blur();
			selectContactDomRe.find("input").focusin(function(){
				this.blur();
			});
			$("body").on('touchmove', function (event) {
						 event.preventDefault();
		 }, false);
			var sccodeRe = showContactDomRe.attr('data-city-code-re');
			var scnameRe = showContactDomRe.attr('data-city-name-re');
			var oneLevelIdRe = showContactDomRe.attr('data-province-code-re');
			var twoLevelIdRe = showContactDomRe.attr('data-city-code-re');
			var threeLevelIdRe = showContactDomRe.attr('data-district-code-re');
			var iosSelectRe = new IosSelect(3,
				[iosProvinces, iosCitys, iosCountys],
				{
					title: '',
					itemHeight: 35,
					headerHeight: 42,
					cssUnit: 'px',
					relation: [1, 1, 0, 0],
					oneLevelId: oneLevelIdRe,
					twoLevelId: twoLevelIdRe,
					threeLevelId: threeLevelIdRe,
					callback: function (selectOneObj, selectTwoObj, selectThreeObj) {
						contactProvinceCodeDomRe.val(selectOneObj.id);
						contactProvinceCodeDomRe.attr('data-province-name-re', selectOneObj.value);
						contactDistrictCodeDomRe.val(selectThreeObj.id);
						contactDistrictCodeDomRe.attr('data-district-name-re', selectThreeObj.value);
						contactCityCodeDomRe.val(selectTwoObj.id);
						contactCityCodeDomRe.attr('data-city-name-re', selectTwoObj.value);
						showContactDomRe.attr('data-province-code-re', selectOneObj.id);
						showContactDomRe.attr('data-city-code-re', selectTwoObj.id);
						showContactDomRe.attr('data-district-code-re', selectThreeObj.id);
						var provinceName = selectOneObj.value;
						var cityName =selectTwoObj.value;
						var districtName =  selectThreeObj.value;
						var areaName =subAreaString(provinceName,cityName,districtName,"true");
						showContactDomRe.val(areaName);
						checkInput();
					}
				});
		});
	}
	var submitFlag=false;  //  防止误点多次，
	function initSubmitButton(){
		if($(".recipient_name").val()!='' && $(".mobile_numbers").val()!='' && $(".recipient_address").val()!='' && $(".recipient_dizhi").val()!=''){
			$(".complete_btn button").removeClass("disabled");
		}else{
			$(".complete_btn button").addClass("disabled");
		}
		$(".am-button-Rec").click(function() {
			if($(".complete_btn button").hasClass("disabled")||submitFlag){
				return;
			}else{
				//add
				submitFlag=true;
				var loaging =
					'<a class="am-button blue loading" role="alert" aria-live="assertive">'+
					'<i class="icon" aria-hidden="true"></i>'+
					'正在保存...'+
					'</a>';
				$(".complete_btn").html(loaging);
				var id = $("#reciptiens_id").val();
				var name = $(".recipient_name").val();
				var mobile = $(".mobile_numbers").val();
				var provinceCode = $('#contact_province_code_re').val();
				var cityCode = $('#contact_city_code_re').val();
				var districtCode = $('#contact_district_code_re').val();
				var street= '';
				var address =$(".recipient_dizhi").val();
				var info;
				var xhrurl;
				if(id){
					info = {
						"id" :id,
						"name" : name,
						"mobile" : mobile,
						"provinceCode" : provinceCode,
						"cityCode" : cityCode,
						"districtCode" : districtCode,
						"street" :'',
						"address" : address
					};
					xhrurl = jUrl+'/ep/receiver/edit';
				}else{
					info = {
						"name" : name,
						"mobile" : mobile,
						"provinceCode" : provinceCode,
						"cityCode" : cityCode,
						"districtCode" : districtCode,
						"street" :'',
						"address" : address
					};
					xhrurl = jUrl+'/ep/receiver/add';
				}
				$.axs(xhrurl, info, function(data) {
					if (data.meta.success) {
						ant.setSessionData({
							data: {
								edit_reciptiensAddrID: "",
								edit_recName: "",
								edit_recNumber:"",
								edit_recProvinceCode:"",
								edit_recCityCode:"",
								edit_recAreaCode:"",
								edit_recStreet:"",
								edit_recAddress:""
							}
						});
						if(receiverCount == 0 && !id){
							receiverCount++;
							ant.setSessionData({
								data: {
									reciptiensAddrID: data.result.id,
									recName:data.result.name,
									recNumber:data.result.mobile,
									recProvinceCode:data.result.provinceCode,
									recCityCode:data.result.cityCode,
									recAreaCode:data.result.districtCode,
									recStreet:data.result.street,
									recAddress:data.result.address,
									receiverCount:receiverCount
								}
							});
						}
						// ant.popTo({
						// 	urlPattern: 'select-recipient.html',
						// }, function(e){
						// 	alert(JSON.stringify(e));
						// });
						ant.popWindow();
					}
				});
			}
		});

	}
	function checkInput() {
		if ($(".recipient_name").val() == ''|| $(".recipient_name").val().trim().length === 0  || $(".sender_name").val().length > 21) {
			$(".complete_btn button").addClass("disabled");
			return;
		}
		// if ( $(".mobile_numbers").val() == '' || $(".sender_phone").val().length > 12 || $(".sender_phone").val().length < 11) {
		// 	$(".complete_btn button").addClass("disabled");
		// 	return;
        //
		// }
		if ($(".mobile_numbers").val() == '' || !isCorrectPhoneNum($(".mobile_numbers").val())) {
			$(".complete_btn button").addClass("disabled");
			return;
		}
		if ($(".recipient_address").val() == '') {
			$(".complete_btn button").addClass("disabled");
			return;
		}
		if ($(".recipient_dizhi").val() == ''|| $(".recipient_dizhi").val().trim().length === 0  || $(".recipient_dizhi").val().length > 51) {
			$(".complete_btn button").addClass("disabled");
			return;
		}
		console.info("check input ok");
		$(".complete_btn button").removeClass("disabled");
	}


});
