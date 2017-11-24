Zepto(function($){
	FastClick.attach(document.body);
	ant.call('setTitle', {
      title: '地址信息'
    });
	var senderAddrID ='';
	var sendName ='';
	var sendNumber ='';
	var sendProvinceCode ='';
	var sendCityCode ='';
	var sendAreaCode ='';
	var sendStreetByAreaCode ="";
	var sendStreet ='';
	var sendAddress ='';
	var reciptiensAddrID='';
	var recName='';
	var recNumber='';
	var recProvinceCode='';
	var recCityCode='';
	var recAreaCode='';
	var recStreetByAreaCode ="";
	var recStreet='';
	var recAddress='';
	var senderCount = 0;
	var receiverCount = 0;
	var epCompanyId = '';  // 判断选快递下单  '' 表示从页面进入， 不为空 表示已经选择快递
	ant.on('resume', function (event) {
		resumePage();
	});
	initPage();

	function resumePage(){
		showLoading();
		ant.getSessionData({
			keys: ['reciptiensAddrID','recName','recNumber','recProvinceCode','recCityCode','recAreaCode','recStreet','recAddress',
				'senderAddrID','sendName','sendNumber','sendProvinceCode','sendCityCode','sendAreaCode','sendStreet','sendAddress',
				'serviceAuthStatus','receiverCount','senderCount']
		}, function (result) {
			senderAddrID =result.data.senderAddrID || '';
			sendName =result.data.sendName || '';
			sendNumber =result.data.sendNumber || '';
			sendProvinceCode =result.data.sendProvinceCode|| '';
			sendCityCode =result.data.sendCityCode|| '';
			sendAreaCode =result.data.sendAreaCode|| '';
			sendStreetByAreaCode= getAreaNameByCode(sendAreaCode).replace(/\s/g,"");
			sendStreet =sendStreetByAreaCode;
			sendAddress =result.data.sendAddress|| '';
			reciptiensAddrID=result.data.reciptiensAddrID || '';
			recName=result.data.recName || '';
			recNumber=result.data.recNumber || '';
			recProvinceCode=result.data.recProvinceCode || '';
			recCityCode=result.data.recCityCode || '';
			recAreaCode=result.data.recAreaCode || '';
			recStreetByAreaCode = getAreaNameByCode(recAreaCode).replace(/\s/g,"");
			recStreet = recStreetByAreaCode;
			recAddress=result.data.recAddress || '';

			receiverCount = result.data.receiverCount || 0;
			senderCount = result.data.senderCount || 0;
			intiAddressArea();
			hideLoading();
		});

		// 如果从信息填写页面返回的话
		ant.setSessionData({
				data: {
						productTypeId:"",
						productTypeName:"",
						presetWeight:"",
						presetWeightPrice:"",
						extraWeightUnit:"",
						extraWeightPrice:"",
						goodsOneValue:"",
						goodsOneIndex:"",
						goodstypeValue:"",
						dayValue: "",
						timeValue: "",
						timeDate:"",
						remarkContent:"",
				}
		});


	}
	function initPage(){
        showLoading();
		initPageDataFromServer();
	}
    function initPageDataFromServer(){
		ant.getSessionData({
			keys: ['epCompanyId','serviceAuthStatus']
		}, function (result) {
			epCompanyId =result.data.epCompanyId || '';
			serviceAuthStatus =result.data.serviceAuthStatus || '';

			var info = {
			};
			var xhrurl = jUrl+'/ep/address/index';
			$.axs(xhrurl, info, function(data) {
				if (data.meta.success) {
					var sender = data.result.sender;
					var receiver = data.result.receiver;
					senderCount = data.result.senderCount ;
					receiverCount = data.result.receiverCount ;
					if(sender!=null){
						senderAddrID =sender.id;
						sendName =sender.name;
						sendNumber =sender.mobile;
						sendProvinceCode =sender.provinceCode;
						sendCityCode =sender.cityCode;
						sendAreaCode =sender.districtCode;
						sendStreetByAreaCode= getAreaNameByCode(sendAreaCode).replace(/\s/g,"");
						sendStreet =sendStreetByAreaCode;
						sendAddress =sender.address;
					}
					if(receiver!=null) {
						reciptiensAddrID = receiver.id;
						recName = receiver.name;
						recNumber = receiver.mobile;
						recProvinceCode = receiver.provinceCode;
						recCityCode = receiver.cityCode;
						recAreaCode = receiver.districtCode;
						recStreetByAreaCode = getAreaNameByCode(recAreaCode).replace(/\s/g,"");
						recStreet = recStreetByAreaCode;
						recAddress = receiver.address;
					}
					if(receiver == null){

					}
					//保存收寄件人信息到session，快递公司信息在首页点击时已经保存
					ant.setSessionData({
						data: {
							senderAddrID: senderAddrID,
							sendName:sendName,
							sendNumber:sendNumber,
							sendProvinceCode:sendProvinceCode,
							sendCityCode:sendCityCode,
							sendAreaCode:sendAreaCode,
							sendStreet:sendStreet,
							sendAddress:sendAddress,
							reciptiensAddrID:reciptiensAddrID,
							recName: recName,
							recNumber:recNumber,
							recProvinceCode:recProvinceCode,
							recCityCode:recCityCode,
							recAreaCode:recAreaCode,
							recStreet:recStreet,
							recAddress:recAddress,
							receiverCount:receiverCount,
							senderCount :senderCount
						}
					});
					intiAddressArea();
					initAddressBookButon(serviceAuthStatus);
					initSubmitButton();
					hideLoading();
				}
			});

		});

	}
	function intiAddressArea(){

		//如果寄件人姓名存在，说明有寄件人信息
		if(sendName && sendName != ''){
			$(".send_where").css({"display":"none","color":"#888;"});
			$(".sendTitle").css({"display":"block"});
			$(".senddesc").css({"display":"-webkit-box"});
			if(sendName.length>5){
				var sName=sendName.substring(0,5)+"...";
                $(".sender-name").text(sName);
			}else{
                $(".sender-name").text(sendName);
            }

			$(".sender-number").text(sendNumber );
			$(".senddesc").attr("data-id",senderAddrID );
			$(".senddesc").attr("data-provinceNo",sendProvinceCode );
			$(".senddesc").attr("data-cityNo",sendCityCode);
			$(".senddesc").attr("data-areaNo",sendAreaCode);
			$(".senddesc").text(sendStreet+sendAddress);
		}else{
			$(".send_where").css({"display":"block","color":"#888;"});
			$(".sendTitle").css({"display":"none"});
			$(".senddesc").css({"display":"none"});
		}
		//如果收件人姓名存在，说明有收件人信息
		if(recName && recName != ''){
			$(".recp_where").css({"display":"none","color":"#666;"});
			$(".recTitle").css({"display":"block"});
			$(".recdesc").css({"display":"-webkit-box"});

			if(recName.length>5){
				var rName=recName.substring(0,5)+"...";
                $(".recp-name").text(rName);
			}else{
                $(".recp-name").text(recName);
            }
			$(".recp-number").text(recNumber);
			$(".recdesc").attr("data-id",reciptiensAddrID );
			$(".recdesc").attr("data-provinceNo",recProvinceCode);
			$(".recdesc").attr("data-cityNo",recCityCode);
			$(".recdesc").attr("data-areaNo",recAreaCode);
			$(".recdesc").text(recStreet+recAddress );
		}else{
			$(".recp_where").css({"display":"block","color":"#888;"});
			$(".recTitle").css({"display":"none"});
			$(".recdesc").css({"display":"none"});
		}
		//如果收寄件人信息都存在，则按钮可点
		if(sendName && sendName != ''&& recName && recName != ''){
			$("#btn-address-submit").removeClass("disabled");
		}else{
			  $("#btn-address-submit").addClass("disabled");
		}
	}

	//提交操作
	function initSubmitButton(){
		$("#btn-address-submit").click(function(){
			if(!recAreaCode || !sendAreaCode){
				return;
			}else{
				if(epCompanyId){
					var info = {
						"logisMerchId":epCompanyId,
						"snderDstrCode":sendAreaCode,
						"rcvrDstrCode":recAreaCode
					};
					var xhrurl = jUrl+'/ep/address/judge_comp_service_area';
					$.axs(xhrurl, info, function(data) {
							if(data.meta.code == "0000"){
								var isServicing = data.result.isServicing;
								if(isServicing){
									// 此次不在显示产品类型
									 //expressTypeInfo();
									 pushWindow('information-fill.html',true)
								}else{
									pushWindow('select-express.html',true);
								}
							}
					});
				}else{
					pushWindow('select-express.html?isServicing=1',true);
				}
			}
		});
	}


	function initAddressBookButon(serviceAuthStatus){
		//点击地址簿
    //  clickStatus.bind($(".sendAddress-btn"))();
		$(".sendAddress-btn").click(function() {
			console.log("sendAddress-btn  touchend");
			if (!serviceAuthStatus) {
				authInfo(selectSUid,"1");
				return;
			}
			if(senderCount >0){
				pushWindow("select-sender.html",true);
			}else{
				pushWindow("send-address.html",true);
			}

		});

		//  clickStatus.bind($(".recpAddress-btn"))();
		$(".recpAddress-btn").click(function() {
			if (!serviceAuthStatus) {
				authInfo(selectRUid,"2");
				return;
			}
			if(receiverCount >0){
			   pushWindow("select-recipient.html",true)
			}else{
				pushWindow("recipient-address.html",true);
			}

		});
        hideLoading();
	}
    function authInfo(flag,addrType){
	    document.addEventListener('AlipayJSBridgeReady', function(){
    	  AlipayJSBridge.call("getAuthCode",{
    	    scopeNicks:['auth_logis_platform'] //主动授权：auth_user，静默授权：auth_base
    	    },function(result){
				if (result.authcode) {
					//认证成功
					var auth_code=result.authcode;
					userCodeInfo(auth_code,flag,addrType);
				}
    	  });
    	});
    }
	function userCodeInfo(auth_code,flag,addrType){
		var info = {
			"authCode" : auth_code,
			"addrType":addrType
		};
		var xhrurl = jUrl+'/ep/address/service_auth';
		$.axs(xhrurl, info, function(data) {
			if (data.meta.success) {

				if(data.meta.code == "0000"){
					if(flag=="AR1040"){
						if(data.result == "0"){
							pushWindow("send-address.html",true);
						}else{
							pushWindow("select-sender.html",true);

						}
					}else if(flag=="AR1050"){
						if(data.result == "0"){
							pushWindow("recipient-address.html",true);
						}else{
							pushWindow("select-recipient.html",true);
						}

					}
				}
			}
		});
	}
	function expressTypeInfo(){
		var info = {
			"logisMerchId":JSON.parse(epCompanyId),
			"snderDstrCode":sendAreaCode,
			"rcvrDstrCode":recAreaCode
		};
		var xhrurl = jUrl+'/ep/common/product_type/list';
		$.axs(xhrurl, info, function(data) {
			if (data.meta.success) {
				if(data.meta.code == "0000"){
					var result = data.result;
					var productTypes = result.productTypes;
					if(productTypes.length>1){
						 pushWindow("express-type.html",true)
					}else{
						pushWindow('information-fill.html',true);
					}
				}
			}
		});
	}
});
