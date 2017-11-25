Zepto(function($){
	FastClick.attach(document.body);
	ant.call('setTitle', {
      title: '寄收件地址'
    });
		// BizLog.call('info',{
		// 		 spmId:"a106.b2100",
		// 		 actionId:'pageMonitor'
		//  });
	var senderAddrID ='';
	var sendName ='';
	var sendNumber ='';
  var	real_sendNumber ='';
	var real_sendName='';
	var sendProvinceCode ='';
	var sendCityCode ='';
	var sendAreaCode ='';
	var sendStreetByAreaCode ="";
	var sendStreet ='';
	var sendAddress ='';
	var reciptiensAddrID='';
	var recName='';
	var recNumber='';
	var real_recNumber ='';
	var real_recName='';
	var recProvinceCode='';
	var recCityCode='';
	var recAreaCode='';
	var recStreetByAreaCode ="";
	var recStreet='';
	var recAddress='';
	var senderCount = 0;
	var receiverCount = 0;
	var epCompanyId = '';  // 判断选快递下单  '' 表示从页面进入， 不为空 表示已经选择快递
	var addressGoodsOneIndex = '';
	var addressGoodsOneValue = '';
	var data2;
	ant.on('resume', function (event) {
		resumePage();
	});
	initPage();
	if(isAndroid){
		 $(".express_address_book").css("border-left","1px solid #ddd");
	}

	function resumePage(){
		showLoading();
		ant.getSessionData({
			keys: ['reciptiensAddrID','recName','recNumber','recProvinceCode','recCityCode','recAreaCode','recStreet','recAddress',
				'senderAddrID','sendName','sendNumber','sendProvinceCode','sendCityCode','sendAreaCode','sendStreet','sendAddress',
				'serviceAuthStatus','receiverCount','senderCount','real_sendNumber','real_recNumber','real_sendName','real_recName','addressGoodsOneValue','addressGoodsOneIndex']
		}, function (result) {

			real_recNumber = result.data.real_recNumber || '';
			real_sendNumber= result.data.real_sendNumber || '';
      real_sendName= result.data.real_sendName || '';
			real_recName= result.data.real_recName || '';

			addressGoodsOneIndex = result.data.addressGoodsOneIndex || '';
      addressGoodsOneValue =  result.data.addressGoodsOneValue || '';
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
			resumeWeightData();
			hideLoading();
			ant.setSessionData({
						data: {
									edit_senderAddrID: senderAddrID,
									edit_sendName: real_sendName,
									edit_sendNumber: real_sendNumber,
								  edit_sendAddress: sendAddress,
									edit_sendProvinceCode: sendProvinceCode,
									edit_sendCityCode: sendCityCode,
									edit_sendAreaCode: sendAreaCode,
									edit_street: sendStreet,
									edit_reciptiensAddrID:reciptiensAddrID,
									edit_recName:real_recName,
									edit_recNumber:real_recNumber,
									edit_recAddress: recAddress,
									edit_recProvinceCode:recProvinceCode,
									edit_recCityCode:recCityCode,
									edit_recAreaCode:recAreaCode,
									edit_recStreet:recStreet,
				   	}
					});
		});

		// 如果从信息填写页面返回的话
		ant.setSessionData({
				data: {
					  filterCompanyId:[],
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
			// var  myInterval = setInterval(function(){
			// 	  if(iosProvinces){
						 initPageDataFromServer();
			// 			 clearInterval(myInterval);
			// 		}
			// },600)

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
           // 设置延时 异步加载area.js
		var  myInterval = setInterval(function(){
			//   data2 = {
			// 	"TDY": ["9",
			// 				  "10"],
			// 	 "AFT": [
			// 			 "9",
			// 			 "10",
			// 			 "11",
			// 			 "12"
			// 	 ],
			// 	 "TOM": [
			// 			 "9",
			// 			 "10",
			// 			 "11",
			// 			 "12"
			// 	 ]3

			// };
			if(iosProvinces){
					var sender = data.result.sender;
					var receiver = data.result.receiver;
					data2= data.result.date;
					console.log(data2);
					senderCount = data.result.senderCount ;
					receiverCount = data.result.receiverCount ;
					if(sender!=null){
						senderAddrID =sender.id;
						sendName =sender.name;
						real_sendName = sender.realName;
						sendNumber =sender.mobile;
						real_sendNumber = sender.realMobile;
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
						real_recName = receiver.realName;
						recNumber = receiver.mobile;
						real_recNumber = receiver.realMobile;
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
							filterCompanyId:[],
							senderAddrID: senderAddrID,
							sendName:sendName,
							real_sendName:real_sendName,
							sendNumber:sendNumber,
              real_sendNumber:real_sendNumber,
							sendProvinceCode:sendProvinceCode,
							sendCityCode:sendCityCode,
							sendAreaCode:sendAreaCode,
							sendStreet:sendStreet,
							sendAddress:sendAddress,

							edit_senderAddrID: senderAddrID,
							edit_sendName: real_sendName,
							edit_sendNumber: real_sendNumber,
							edit_sendAddress: sendAddress,
							edit_sendProvinceCode: sendProvinceCode,
							edit_sendCityCode: sendCityCode,
							edit_sendAreaCode: sendAreaCode,
							edit_street: sendStreet,

							reciptiensAddrID:reciptiensAddrID,
							recName: recName,
							real_recName:real_recName,
							recNumber:recNumber,
							real_recNumber:real_recNumber,
							recProvinceCode:recProvinceCode,
							recCityCode:recCityCode,
							recAreaCode:recAreaCode,
							recStreet:recStreet,
							recAddress:recAddress,
							receiverCount:receiverCount,
							senderCount :senderCount,

							edit_reciptiensAddrID:reciptiensAddrID,
							edit_recName:real_recName,
							edit_recNumber:real_recNumber,
							edit_recAddress: recAddress,
							edit_recProvinceCode:recProvinceCode,
							edit_recCityCode:recCityCode,
							edit_recAreaCode:recAreaCode,
							edit_recStreet:recStreet
						}
					});
					if(!epCompanyId) {
						 $(".wpWeight").show();
						 $("#weightTip").addClass('weightTip');
						 initDate(data2);
	           initSelectWeightEvent(initWeightData())
						 initselectDateEvent();
			 	}
					intiAddressArea();
					initAddressBookButon(serviceAuthStatus);
					initSubmitButton();
					hideLoading();
					clearInterval(myInterval);
				 }
		},600)

				}
			});

		});

	}
	function intiAddressArea(){

		//如果寄件人姓名存在，说明有寄件人信息
		if(sendName && sendName != ''){
			$(".send_where").css({"display":"none","color":"#888","padding-top":"0","padding-bottom":"0"});
			$(".sendTitle").css({"display":"block"});
			$(".senddesc").css({"display":"-webkit-box"});

			// if(sendName.length>5){
			// 	 var sName=sendName.substring(0,5)+"...";
      //           $(".sender-name").text(sName);
			// }else{
                $(".sender-name").text(sendName);
            // }

			$(".sender-number").text(sendNumber );
			$(".senddesc").attr("data-id",senderAddrID );
			$(".senddesc").attr("data-provinceNo",sendProvinceCode );
			$(".senddesc").attr("data-cityNo",sendCityCode);
			$(".senddesc").attr("data-areaNo",sendAreaCode);
			$(".senddesc").text(sendStreet+sendAddress);
		}else{
			$(".send_where").css({"display":"block","color":"#888","padding-top":".15rem","padding-bottom":".15rem"});
			$(".sendTitle").css({"display":"none"});
			$(".senddesc").css({"display":"none"});
		}
		//如果收件人姓名存在，说明有收件人信息
		if(recName && recName != ''){
			$(".recp_where").css({"display":"none","color":"#666;","padding-top":"0","padding-bottom":"0"});
			$(".recTitle").css({"display":"block"});
			$(".recdesc").css({"display":"-webkit-box"});

			// if(recName.length>5){
			// 	var rName=recName.substring(0,5)+"...";
      //           $(".recp-name").text(rName);
			// }else{
                $(".recp-name").text(recName);
            // }
			$(".recp-number").text(recNumber);
			$(".recdesc").attr("data-id",reciptiensAddrID );
			$(".recdesc").attr("data-provinceNo",recProvinceCode);
			$(".recdesc").attr("data-cityNo",recCityCode);
			$(".recdesc").attr("data-areaNo",recAreaCode);
			$(".recdesc").text(recStreet+recAddress );
		}else{
			$(".recp_where").css({"display":"block","color":"#888;","padding-top":".15rem","padding-bottom":".15rem"});
			$(".recTitle").css({"display":"none"});
			$(".recdesc").css({"display":"none"});
		}
		//如果收寄件人信息都存在，则按钮可点
		// if(sendName && sendName != ''&& recName && recName != ''){
		// 	$("#btn-address-submit").removeClass("disabled");
		// }else{
		// 	  $("#btn-address-submit").addClass("disabled");
		// }
	}

	//提交操作
	function initSubmitButton(){
		$("#btn-address-submit").click(function(){

			BizLog.call('info',{
					 spmId:"a106.b2100.c4588.d7095",
					 actionId:'clicked'
			 });
			if(!sendAreaCode){
					toast({
	 				 text:'请完善寄件地址'
	 				});
				return;
			}else if(!recAreaCode){
					toast({
	 				 text:"请完善收件地址"
	 				});
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
		$(".sendaddressClick").click(function() {
			BizLog.call('info',{
					 spmId:"a106.b2100.c4586.d7092",
					 actionId:'clicked'
			 });
			console.log("sendAddress-btn  touchend");
			if (serviceAuthStatus =="0") {
				console.log("serviceAuthStatus "+serviceAuthStatus);
				authInfo(selectSUid,"1");
				return;
			}
			if(senderCount >0){
				pushWindow("select-sender.html",true);
			}else{
				pushWindow("send-address.html",true);
			}

		});

		$(".sendClick").click(function(){
			BizLog.call('info',{
					 spmId:"a106.b2100.c4586.d7091",
					 actionId:'clicked'
			 });
			console.log("sendClick  touchend");
			if (serviceAuthStatus =="0") {
				console.log("serviceAuthStatus "+serviceAuthStatus);
				authInfo(selectSUid,"1","1");
				return;
			}
			pushWindow('send-address.html?edit=write');

		})

		//  clickStatus.bind($(".recpAddress-btn"))();
		$(".recpaddressClick").click(function() {
			BizLog.call('info',{
					 spmId:"a106.b2100.c4587.d7094",
					 actionId:'clicked'
			 });
			if (serviceAuthStatus == "0") {
				authInfo(selectRUid,"2");
				return;
			}
			if(receiverCount >0){
			   pushWindow("select-recipient.html",true)
			}else{
				pushWindow("recipient-address.html",true);
			}

		});

		$(".recpClick").click(function(){
			BizLog.call('info',{
					 spmId:"a106.b2100.c4587.d7093",
					 actionId:'clicked'
			 });
			console.log("recpClick  touchend");
			if (serviceAuthStatus =="0") {
				console.log("serviceAuthStatus "+serviceAuthStatus);
				authInfo(selectRUid,"2","2");
				return;
			}
			pushWindow('recipient-address.html?edit=write');

		})


        hideLoading();
	}
    function authInfo(flag,addrType,tempData){
	    document.addEventListener('AlipayJSBridgeReady', function(){
			var authData={
				scopeNicks:['auth_logis_platform']//主动授权：auth_user，静默授权：auth_base
			}

			if(env == "sit"){
				authData ={
					scopeNicks:['auth_logis_platform'], //主动授权：auth_user，静默授权：auth_base
					appId:"2017010904949252"
				}
			}
    	  AlipayJSBridge.call("getAuthCode",authData,function(result){
				if (result.authcode) {
					//认证成功
					console.log("认证成功 "+ result.authcode);
					var auth_code=result.authcode;
					userCodeInfo(auth_code,flag,addrType,tempData);
				}
    	  });
    	});
    }
	function userCodeInfo(auth_code,flag,addrType,tempData){
		var info = {
			"authCode" : auth_code,
			"addrType":addrType
		};
		var xhrurl = jUrl+'/ep/address/service_auth';
		$.axs(xhrurl, info, function(data) {
			if (data.meta.success) {

				if(data.meta.code == "0000"){
         console.log("tempData "+tempData);
					if(flag=="AR1040"){
						if(tempData=="1"){
              pushWindow("send-address.html?edit=write",true);
						}else{
							if(data.result == "0"){
								pushWindow("send-address.html",true);
							}else{
								pushWindow("select-sender.html",true);
							}
						}

					}else if(flag=="AR1050"){
						if(tempData=="2"){
							 pushWindow("recipient-address.html?edit=write",true);
						}else{
							if(data.result == "0"){
								pushWindow("recipient-address.html",true);
							}else{
								pushWindow("select-recipient.html",true);
							}
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
	function resumeWeightData(){

		 var oldAddressGoodOneValue = $(".wpWeight").attr('data-weight_value');
		 console.log('resumeWeightData');
		 console.log(oldAddressGoodOneValue + "+++"+addressGoodsOneIndex+ '++'+addressGoodsOneValue);
		 console.log(addressGoodsOneValue === oldAddressGoodOneValue);
		 if(addressGoodsOneIndex === '') return;
		 if(addressGoodsOneValue === oldAddressGoodOneValue) return;
		 $(".wpWeight").attr('data-weight_id',addressGoodsOneIndex);
		 $(".wpWeight").attr('data-weight_value', addressGoodsOneValue);
		 $("#goodsweight").text(JSON.parse(JSON.stringify(addressGoodsOneValue)));
	}
 // 初始化 选择重量 下拉数据
  function	initWeightData(){
		ant.setSessionData({
					data: {
							addressGoodsOneValue:'0.5公斤及以下',
							addressGoodsOneIndex: '0'
					}
			});
		       var  goodsWeightTypes=[];
					 var internalPresetWeight =0.5,internalExtraWeightUnitPec=0.5,maxNum = 100;
					 for (var m = 0; m < maxNum; m++) {
							 var goodsWeightTypesVal = internalPresetWeight + m * internalExtraWeightUnitPec;
							 if (m == 0) {
									 goodsWeightTypesVal = goodsWeightTypesVal + " 公斤及以下";
							 } else if (m == maxNum - 1) {
									 goodsWeightTypesVal = goodsWeightTypesVal + " 公斤及以上";
							 } else {
									 goodsWeightTypesVal = goodsWeightTypesVal + " 公斤";
							 }
								 goodsWeightTypes.push(goodsWeightTypesVal);
					 }
						$(".wpWeight").attr('data-weight_id',"0");
						$(".wpWeight").attr('data-weight_value', goodsWeightTypes[0]);
						return goodsWeightTypes;
		}

function initSelectWeightEvent(goodsWeightTypes) {
		 //选择物品重量
	 var weightDom = document.querySelector("#weightId");
	 var weightBtn = $(".wpWeight");
     weightBtn.click(function () {
			 var weightId = weightBtn.attr("data-weight_id");
			 var weightName = weightBtn.attr("data-weight_value");
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
							 // $("#goodstype").text(JSON.parse(JSON.stringify(selectOneObj.value)));
							//  if (selectOneObj.id == '') {
							// 		 var reg = /^[0-9\.]+/g;
							 //
							 //
								//  } else {
									 $("#goodsweight").text(JSON.parse(JSON.stringify(selectOneObj.value)));
									 var reg = /^[0-9\.]+/g;
										 var weight = reg.exec(selectOneObj.value);
									 $(".goodsweightNum").val(weight);
								//  $(".estimatePrice-data").html(totalPrice.toFixed(2));
								 ant.setSessionData({
											 data: {
													 addressGoodsOneValue: JSON.parse(JSON.stringify(selectOneObj.value)),
													 addressGoodsOneIndex: JSON.parse(JSON.stringify(selectOneObj.id))
											 }
									 });
						 }
				 }
				 var weightSelect = new IosSelect(weightLevel, [weightArr], option2);
		 });
	 }

 function initDate(tempData2){
	 for (var i in tempData2) {
			 var temp = (i == "TDY" ? "今天" : (i == "TOM" ? "明天" : "后天"));
			 var tempTime = tempData2[i][0]+'点左右';
			 var spanHtml = "<span style='padding-left:.05rem;'></span>";
			//  if(temp != "今天"){
			// 				 $("#timeDate").css("color","#f4333c");
			// 		 }else{
			// 				 $("#timeData").css("color","#888");
			// 		 }
			ant.setSessionData({
					data: {
							addressDayValue: JSON.parse(JSON.stringify(temp)),
							addressTimeValue: JSON.parse(JSON.stringify(tempTime)),
							addressTimeDate: JSON.parse(JSON.stringify(temp + tempTime))
					}
			});
			 $("#timeDate").html(JSON.parse(JSON.stringify(temp + spanHtml + tempTime)));
			 $(".day1").val(JSON.parse(JSON.stringify(temp)));
			 $(".time1").val(JSON.parse(JSON.stringify(tempTime)));
			 break;
		}
 }
// 初始化选择日期 函数
	function initselectDateEvent() {
			 //选择时间
			 console.log(data2);
			 var dateDom = document.querySelector('#dateId');
			 var timeDom = document.querySelector('#timeId');
			 var myBtn = $("#selectTime")
			 myBtn.unbind();
			 myBtn.click(function() {

				//  if(!enableButton){return;}

				//  $("body").on('touchmove', function (event) {
				//         event.preventDefault();
				// }, false);
					 var date2 = [], // 天
							 k = 0,
							 time = []; // 时间段
					 for (var i in data2) {
							 var temp = (i == "TDY" ? "今天" : (i == "TOM" ? "明天" : "后天"));
							 date2.push({
									 "id": k.toString(),
									 "value": temp,
									 "parentId": "0"
							 })
							 var tempArr = data2[i];
							 for (var j = 0; j < tempArr.length; j++) {
									 time.push({
											 "id": (j + 10).toString(),
											 "value": tempArr[j]+"点左右",
											 "parentId": k.toString()
									 })
							 }
							 k++;
					 }
					 var dateId = myBtn.attr('data-date_id');
					 var dateValue = myBtn.attr('data-date_value');
					 var timeId = myBtn.attr('data-time_id');
					 var timeValue = myBtn.attr('data-time_value');
					 var level = 2;
					 var options = {
							 title: "",
							 itemHeight: 35,
							 headerHeight: 42,
							 cssUtil: 'px',
							 relation: [1, 1, 1, 1],
							 oneLevelId: dateId,
							 twoLevelId: timeId,
							 callback: function(selectOneObj, selectTwoObj) {
									 dateDom.value = selectOneObj.id;
									 timeDom.value = selectTwoObj.id;
									 myBtn.attr('data-date_id', selectOneObj.id);
									 myBtn.attr('data-date_value', selectOneObj.value);
									 myBtn.attr('data-time_id', selectTwoObj.id);
									 myBtn.attr('data-time_value', selectTwoObj.value);
									 var spanHtml = "<span style='padding-left:.05rem;'></span>";
									//  if(myBtn.attr('data-date_value') != "今天"){
									// 		 $("#timeDate").css("color","#f4333c");
									//  }else{
									// 		 $("#timeDate").css("color","#888");
									//  }
									 $("#timeDate").html(JSON.parse(JSON.stringify(selectOneObj.value + spanHtml + selectTwoObj.value)));
									 $(".day1").val(JSON.parse(JSON.stringify(selectOneObj.value)));
									 $(".time1").val(JSON.parse(JSON.stringify(selectTwoObj.value)));
									 ant.setSessionData({
											 data: {
													 addressDayValue: JSON.parse(JSON.stringify(selectOneObj.value)),
													 addressTimeValue: JSON.parse(JSON.stringify(selectTwoObj.value)),
													 addressTimeDate: JSON.parse(JSON.stringify(selectOneObj.value + selectTwoObj.value))
											 }
									 });
									 checkInf();
							 }
					 };
					 var data = [date2, time];
					 var myScroll = new IosSelect(level, data, options);
			 });

	 }


});