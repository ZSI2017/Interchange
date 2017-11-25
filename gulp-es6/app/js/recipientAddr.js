Zepto(function($){
	FastClick.attach(document.body);
	console.log(getUrlParam("edit")=="edit");
	var urlParam = getUrlParam("edit")
	var spmPageId="";
    var spmName="";
	var spmAddressBook="";
    var spmPhone="";
    var spmDistrict="";
    var spmAddress="";
    var spmSave="";
			var currentCityName = "" // 当前城市名
    var spmComplete="";
	var spm_AddrId = ""; //记录编辑收件人地址ID
	if(urlParam=="edit"){
		spmPageId ="a106.b2128";
        spmName="a106.b2128.c4693.d7326";
		spmAddressBook="a106.b2128.c4693.d7327";
        spmPhone="a106.b2128.c4693.d7328";
        spmDistrict="a106.b2128.c4693.d7329";
        spmAddress="a106.b2128.c4693.d7330";
        spmComplete="a106.b2128.c4692.d7325";
		$('body').attr("data-aspm","b2128");
        $(".sender_name").attr("data-spmv",spmName);
        $(".get_location").attr("data-spmv",spmAddressBook);
        $(".sender_phone").attr("data-spmv",spmPhone);
        $(".sender_address").attr("data-spmv",spmDistrict);
        $(".sender_dizhi").attr("data-spmv",spmAddress);
        $(".am-button").attr("data-spmv",spmComplete);
		//添加编辑埋点 AddrId
        ant.getSessionData({
            keys: ['edit_reciptiensAddrID']
            }, function(result) {
                spm_AddrId = result.data.edit_reciptiensAddrID
            }
        )
		ant.call('setTitle', {
			title: '编辑收件人地址'
		});
	}else if(urlParam=="write"){
		spmPageId ="a106.b2126";
        spmName="a106.b2126.c4687.d7311";
		spmAddressBook="a106.b2126.c4687.d7312";
        spmPhone="a106.b2126.c4687.d7313";
        spmDistrict="a106.b2126.c4687.d7314";
        spmAddress="a106.b2126.c4687.d7315";
        spmSave="a106.b2126.c4687.d7316";
        spmComplete="a106.b2126.c4688.d7317";
		$('body').attr("data-aspm","b2126");
        $(".sender_name").attr("data-spmv",spmName);
        $(".get_location").attr("data-spmv",spmAddressBook);
        $(".sender_phone").attr("data-spmv",spmPhone);
        $(".sender_address").attr("data-spmv",spmDistrict);
        $(".sender_dizhi").attr("data-spmv",spmAddress);
		$("#defaultClick").attr("data-spmv",spmSave);
        $(".am-button").attr("data-spmv",spmComplete);
		ant.call('setTitle', {
			title: '填写收件人地址'
		});
		 $(".defaultSelect").show();
	}else{
		spmPageId ="a106.b2123";
        spmName="a106.b2123.c4683.d7303";
		spmAddressBook="a106.b2123.c4683.d7304";
        spmPhone="a106.b2123.c4683.d7305";
        spmDistrict="a106.b2123.c4683.d7306";
        spmAddress="a106.b2123.c4683.d7307";
        spmComplete="a106.b2123.c4684.d7308";
		$('body').attr("data-aspm","b2123");
        $(".sender_name").attr("data-spmv",spmName);
        $(".get_location").attr("data-spmv",spmAddressBook);
        $(".sender_phone").attr("data-spmv",spmPhone);
        $(".sender_address").attr("data-spmv",spmDistrict);
        $(".sender_dizhi").attr("data-spmv",spmAddress);
        $(".am-button").attr("data-spmv",spmComplete);
		ant.call('setTitle', {
			title: '添加收件人地址'
		});
	}

	ant.on('resume', function (event) {
		ant.getSessionData({
			 keys:['autocomplete_address']
		},function(result){
			 var autocomplete_address = result.data.autocomplete_address;
			 if(autocomplete_address !== ""){
				 var emoji = emojione.toShort(autocomplete_address);
				 $(".recipient_dizhi").val(emoji.replace(/\:[a-z0-9_]+\:/g, ''));
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
	// 	spmId:spmPageId,
	// 	actionId:'pageMonitor'
	// });
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
  var recName;
	var recNumber;
	var areaNameInit;
	var recAddress;
	var recAreaCode;
	var isFromAddress  // 判断是否从地址填写界面有临时填写的地址。 -1 代表存在临时地址

	var toastShow = false;    //提示信息 出现的标识  默认是不出现

	//添加input click的 log 上报
	$(".sender_name").on("click", function() {
		if(urlParam=="edit"){
			BizLog.call('info',{
				spmId:spmName,
				actionId:'clicked',
				params:{
					AddrID:spm_AddrId
				}
			});
		}else{
			BizLog.call('info',{
				spmId:spmName,
				actionId:'clicked'
			});
		}

	});
	$(".sender_phone").on("click", function() {
		if(urlParam=="edit"){
			BizLog.call('info',{
				spmId:spmPhone,
				actionId:'clicked',
				params:{
					AddrID:spm_AddrId
				}
			});
		}else{
			BizLog.call('info',{
				spmId:spmPhone,
				actionId:'clicked',
			});
		}

	});
	$(".recipient_address").on("click", function() {
		if(urlParam=="edit"){
			BizLog.call('info',{
				spmId:spmDistrict,
				actionId:'clicked',
				params:{
					AddrID:spm_AddrId
				}
			});
		}else{
			BizLog.call('info',{
				spmId:spmDistrict,
				actionId:'clicked'
			});
		}

	});
	$(".recipient_dizhi").on("click", function() {
		if(urlParam=="edit"){
			BizLog.call('info',{
				spmId:spmAddress,
				actionId:'clicked',
				params:{
					AddrID:spm_AddrId
				}
			});
		}else{
			BizLog.call('info',{
				spmId:spmAddress,
				actionId:'clicked'
			});
		}

	});

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
				'receiverCount',
			  'reciptiensAddrID']
		}, function (result) {
			isFromAddress = result.data.reciptiensAddrID;
			var reciptiensAddrID = result.data.edit_reciptiensAddrID || '';
			    recName = result.data.edit_recName  || '';
			    recNumber = result.data.edit_recNumber  || '';
			    recAddress = result.data.edit_recAddress  || '';
			var recProvinceCode = result.data.edit_recProvinceCode  || '';
			var recCityCode = result.data.edit_recCityCode  || '';
			     recAreaCode = result.data.edit_recAreaCode  || '';
			var recStreet = result.data.edit_recStreet || '';
			// var recAddress = result.data.edit_recAddress || '';
			receiverCount = result.data.receiverCount;
			//session中有信息，则说明是编辑模式,进行页面初始化
			if(reciptiensAddrID&&(urlParam=="edit"||urlParam == "write")){
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
        currentCityName = cityName;
				var districtName =  $("#contact_district_code_re").attr("data-district-name-re");
				areaNameInit =subAreaString(provinceName,cityName,districtName,"true");
				$(".recipient_address").val(areaNameInit);
				$(".recipient_address").attr("data-province-code-re",$("#contact_province_code_re").val());
				$(".recipient_address").attr("data-city-code-re",$("#contact_city_code_re").val());
				$(".recipient_address").attr("data-district-code-re",$("#contact_district_code_re").val());
			}

			$('textarea[autoHeight]').autoHeight();

			initButtonStatus();
			bindInputCheckEvent();
			initSubmitButton();
			initCheckBox();
		});
	}
	function bindInputCheckEvent() {

		$(".input_tab").on("input propertychange",function(){
			// checkInput();
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
        var reg = /\:[a-z0-9_]+\:/g;
				if(reg.test(emoji)){
					emoji = emoji.replace(/\:[a-z0-9_]+\:/g,'');
					$(this).val(emoji);
				}
				if ($(this).val().length >=21) {
					var tempval = $(this).val().slice(0,20);
					$(this).val(tempval);
				}
	  	}
		});
		$(".mobile_numbers").bind('input',function(){
			var phoneNum = $(this).val();
			phoneNum = processPhoneNum(phoneNum);
			$(this).val(phoneNum);
		});

		// 详细地址input
		// bug  当用户当前输入法状态是中文时，在未选择词组到输入框也会触发事件
		// var recipientAddressLock= false;
		// $(".recipient_dizhi").bind("compositionstart",function(){
		// 		 recipientAddressLock=true;
		// });
		// $(".recipient_dizhi").bind("compositionend",function(){
		// 	var  emoji = emojione.toShort($(this).val());
		// 	 $(this).val(emoji.replace(/\:[a-z0-9_]+\:/g,''));
    //
		// 		if ($(this).val().length == 51) {
		// 			var tempval = $(this).val().slice(0,50);
		// 			$(this).val(tempval);
		// 			// keyboardHide();
		// 		}
		// 		 recipientAddressLock=false;
		// });
		// $(".recipient_dizhi").bind('input',function(){
		// 	if(!recipientAddressLock){
		// 		var  emoji = emojione.toShort($(this).val());
		// 		 $(this).val(emoji.replace(/\:[a-z0-9_]+\:/g,''));
    //
		// 			if ($(this).val().length == 51) {
		// 				var tempval = $(this).val().slice(0,50);
		// 				$(this).val(tempval);
		// 				// keyboardHide();
		// 			}
		//  }
		// });
		$(".recipient_dizhi").bind('click', function () {
			if (currentCityName === ""){
				toast({
						text: "请先选择地区"
					});
					return;
				}
			var recipient_address = $(".recipient_dizhi").val();
			ant.setSessionData({
				data: {
					autocomplete_address: recipient_address,
					autocomplete_cityName: currentCityName
				}
			});
			pushWindow('autocomplete.html', false);
		});

		//

	}
  function initCheckBox(){
		// 判断 填写页面，checkbox 的点击事件
		if(urlParam=="write"){
			$("#defaultCheckBox").find("span").css({"background-image":"url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png)"});
		      $("#defaultClick").click(function () {
				  BizLog.call('info',{
					spmId:spmSave,
					actionId:'clicked'
				  });
						var _this =$("#defaultCheckBox");
		          if (_this.hasClass("defaultSelect")) {
		              _this.toggleClass("defaultSelect");
		              _this.find("span").css({"background-image":"url(https://kuaidi-dev.oss-cn-hangzhou.aliyuncs.com/mobile/default-noSelect.png)"});
		            }else{
		                _this.toggleClass("defaultSelect");
		                _this.find("span").css({"background-image":"url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png)"});
		           }
		       });
		}

	}
	function initButtonStatus(){
		//通信录按钮
		$("#getLocation").on("click",function(){
			if(urlParam=="edit"){
				BizLog.call('info',{
					spmId:spmAddressBook,
					actionId:'clicked',
					params:{
						AddrID:spm_AddrId
					}
				});
			}else{
				BizLog.call('info',{
					spmId:spmAddressBook,
					actionId:'clicked'
				});
			}

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

					if(mobile_numbers.indexOf("86") ==0){
						mobile_numbers = mobile_numbers.slice(2, mobile_numbers.length);
					}
					var temp =mobile_numbers.length-15;
					if(temp>0){
						mobile_numbers=mobile_numbers.substring(temp);
					}
					// 正则验证手机号
					var reg = /^\d{1,15}$/;
					if(!(reg.test(mobile_numbers))){
								// toast({
								// 		text:"请输入正确的手机号"
								// })

					}
					$(".mobile_numbers").val(mobile_numbers);



					// checkInput();
				}

			});
		});

		var selectContactDomRe = $('#select_contact_re');
		var showContactDomRe = $('#show_contact_re');
		var contactProvinceCodeDomRe = $('#contact_province_code_re');
		var contactCityCodeDomRe = $('#contact_city_code_re');
		var contactDistrictCodeDomRe = $('#contact_district_code_re');
		//城市选择下拉
		$(".choise_addressstitle").click(function(){

			if(toastShow){return;}
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
						currentCityName = cityName;
						var districtName =  selectThreeObj.value;
						var areaName =subAreaString(provinceName,cityName,districtName,"true");
						showContactDomRe.val(areaName);
						// checkInput();
					}
				});
		});
	}
	var submitFlag=false;  //  防止误点多次，
	function initSubmitButton(){
		$(".am-button-Rec").click(function() {
			if(urlParam=="edit"){
				BizLog.call('info',{
					spmId:spmComplete,
					actionId:'clicked',
					params:{
						AddrID:spm_AddrId
					}
				});
			}else{
				BizLog.call('info',{
					spmId:spmComplete,
					actionId:'clicked'
				});
			}

			if(submitFlag||(!checkInput())){
				return;
			}else{


				//add
				submitFlag=true;
				var loaging ='<i class="icon" aria-hidden="true"></i>'+
					'正在保存...';
				$(".am-button-Rec").html(loaging);
				setTimeout(function(){
								   submitFlag = false;
								 	$(".am-button-Rec").html('完成');
				},8000);
				var id = $("#reciptiens_id").val();

				// var name = $(".recipient_name").val();
        var name =emojione.toShort($(".recipient_name").val()).replace(/\:[a-z0-9_]+\:/g,'');
				var mobile = $(".mobile_numbers").val();
				var provinceCode = $('#contact_province_code_re').val();
				var cityCode = $('#contact_city_code_re').val();
				var districtCode = $('#contact_district_code_re').val();
				var street= '';
				var address =emojione.toShort($(".recipient_dizhi").val()).replace(/\:[a-z0-9_]+\:/g,'');
				var info;
				var xhrurl;
				if(urlParam == "write"){
					var recVal = cellPhoneHide(mobile)
					ant.setSessionData({
							data: {
								 //  senderAddrID:0,
									recName:nameHide(name),
									recNumber:recVal,
									real_recNumber:mobile,
									real_recName:name,
									recProvinceCode: provinceCode,
									recCityCode:cityCode,
									recAreaCode:districtCode,
									recStreet:getAreaNameByCode(districtCode).replace(/\s/g,""),
									recAddress:address,
							}
					});
					if($("#defaultCheckBox").hasClass("defaultSelect")){
						  if(id!="-1"&&name ==recName&&mobile == recNumber&&address == recAddress&&parseFloat(recAreaCode)== parseFloat(districtCode)){
								    ant.popWindow();
								    console.log("write  data not change");
								   return;
							}else{
								   id=false;
							}
					}else{
						if(name ==recName&&mobile == recNumber&&address == recAddress&& parseFloat(recAreaCode) ==  parseFloat(districtCode)){}else{
							ant.setSessionData({
									data: {
											reciptiensAddrID:-1,

									}
							});
						}
						ant.popWindow();
							return;
					}
				}
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
						if((receiverCount == 0 && !id)||urlParam == "write"){
							receiverCount++;
							ant.setSessionData({
									data: {
												receiverCount:receiverCount
									}
							});
					  if(receiverCount == 1 && !id&&isFromAddress==-1){}else{
							  var tempRecNumber = cellPhoneHide(data.result.mobile);
								var tempRecName = nameHide(data.result.name);
								var tempStreet =getAreaNameByCode(data.result.districtCode).replace(/\s/g,"")
							ant.setSessionData({
								data: {
									reciptiensAddrID: data.result.id,
									recName:tempRecName,
									recNumber:tempRecNumber,
									real_recNumber:data.result.mobile,
									real_recName:data.result.name,
									recProvinceCode:data.result.provinceCode,
									recCityCode:data.result.cityCode,
									recAreaCode:data.result.districtCode,
									recStreet:tempStreet,
									recAddress:data.result.address,
								}
							});
						 }
						}
						ant.popWindow();
					}
				});
			}
		});

	}
	function checkInput() {
		if ($(".recipient_name").val() == ''|| $(".recipient_name").val().trim().length === 0  || $(".sender_name").val().length >= 21) {
					toast({
							text: '姓名不能为空'
					});
					return false;
		}
		if ($(".mobile_numbers").val() == '' || !isCorrectPhoneNum($(".mobile_numbers").val())) {
					toast({
							 text:"请输入正确的手机号或座机号"
					 });
					return false;
		}
		if ($(".recipient_address").val() == ''||$(".recipient_address").val() == ' ') {
					toast({
							 text:"请选择地区"
					 });
					return;
		}
		if ($(".recipient_dizhi").val() == ''|| $(".recipient_dizhi").val().trim().length === 0  || $(".recipient_dizhi").val().length >= 51) {
						toast({
								text: '详细地址不能为空'
						});
						return  false;
		}
		        return true;
	}


});
