Zepto(function($){
	FastClick.attach(document.body);

	ant.on('resume', function (event) {
		initSelectSender();
	});
	ant.call('setTitle', {
      title: '选择寄件人地址',
    });

	// 打开时埋点
	// BizLog.call('info',{
	// 	spmId:"a106.b2101",
	// 	actionId:'pageMonitor'
	// });

	// 点击管理 添加点击态
	clickStatus.bind($(".manage_sender"))();
	$(".manage_sender").on("click", function () {
		BizLog.call('info',{
			spmId:"a106.b2101.c4590.d7097",
			actionId:'clicked'
		});
		pushWindow("manage-sender.html",true);
	});
	//$(".am-button").addClass("disabled");
	$(".btn-sender").click(function(){
		BizLog.call('info',{
			spmId:"a106.b2101.c4591.d7098",
			actionId:'clicked'
		});
		pushWindow("send-address.html",true);
	});
	var senderCount=0;
    initSelectSender();
    function initSelectSender(){
		showLoading();
	    var info = {
			};
			var xhrurl = jUrl+'/ep/sender/list';
			$.axs(xhrurl, info, function(data) {
				if (data.meta.success) {
					if(data.result && data.result.length >0){
						senderCount = data.result.length;
					}else{
						senderCount = 0;
					}
					ant.setSessionData({
						data: {
							senderCount:senderCount
						}
					});
					if(data.meta.code=="0000"||data.meta.success){
						ant.getSessionData({
							keys: ['senderAddrID']
						  }, function (results) {
								var senderAddrID = results.data.senderAddrID;
								var result = data.result,status='',checkInfo='',sHtml='',lHtml='',vHtml='';

								if(result && result.length>0){
									$(".manage_sender_div").show();
									$(".manageInfo").show();
									$(".emptyInfo").hide();
									for(var i=0;i<result.length;i++){

										// alert(getAreaNameByCode(result[i].districtCode).replace(/\s/g,""));
										var street = getAreaNameByCode(result[i].districtCode).replace(/\s/g,"");

										if(result[i].defaultStatus=="1"){
											status ="<span style='color:#f4333c;font-size: .14rem;padding-right: .06rem;'>[默认地址]</span>";
										}else{
											status='';
										}
										if(senderAddrID == result[i].id){
											checkInfo ='<input type="radio" checked="checked" class="sendRadio" name="sendRadio" senderAddrID="'+result[i].id+'" id="cx'+i+'" />';
											ant.setSessionData({
												data: {
													senderAddrID: result[i].id,
													sendName:result[i].name,
													real_sendName:result[i].realName,
													sendNumber:result[i].mobile,
													real_sendNumber: result[i].realMobile,
													sendProvinceCode:result[i].provinceCode,
													sendCityCode:result[i].cityCode,
													sendAreaCode:result[i].districtCode,
													sendStreet:street,
													sendAddress:result[i].address
												}
											});

										}else{
											checkInfo ='<input type="radio" class="sendRadio" name="sendRadio" senderAddrID="'+result[i].id+'" id="cx'+i+'" />';
										}
										var spmv_i = i+1;
										if(i<result.length-1){
											lHtml = '<label class="am-list-item check selectsender_listitem" data-spmv="a106.b2101.c4590.'+ spmv_i +'" for="cx'+i+'">';
										}else if(i==result.length-1){
											lHtml = '<label class="am-list-item check selectsender_listitem" data-spmv="a106.b2101.c4590.'+ spmv_i +'"  for="cx'+i+'">';
										}
										var sName = result[i].name;
										// if(sName.length>5){
										// 	 sName=sName.substring(0,5)+"...";
										// }
										sHtml += vHtml
											+lHtml
											+'<div class="am-list-content">'
											+'<div class="am-list-title selectsender_title">'
											+'<label class="sendName" style="color:#999;font-size:.17rem;" send-name="'+result[i].name+'" real-sendname="'+result[i].realName +'">'+sName+'</label>'
											+'<span class="sendNumber" style="float:right;color:#999;font-size:.17rem;" real-sendnumber="'+result[i].realMobile+'" send-number="'+result[i].mobile+'">'+result[i].mobile+''
											+'</span>'
											+'</div>'
											+'<div class="am-list-brief selectsender_content">'
											+'<label class="sendBrief" style="color:#333;font-size:.14rem;"  data-provinceNo="'+result[i].provinceCode+'" data-cityNo="'+result[i].cityCode+'" data-areaNo="'+result[i].districtCode+'">'+status+'<span data-street="'+street+'" class="dataStreet" style="color:#333;font-size:.14rem;">'+street+'</span><span data-address="'+result[i].address+'" class="dataAddress" style="color:#333;font-size:.14rem;">'+result[i].address+'</span></label>'
											+'</div>'
											+'</div>'
											+'<div class="am-checkbox">'
											+checkInfo
											+'<span class="icon-check btn-check-send"></span>'
											+'</div>'
											+'</label>';
									}
									$(".manageInfo").html(sHtml);
									hideLoading();

  									$(".am-list-item").click(function(){
										$(".am-list-item ").find("input[name='sendRadio']").attr('checked',false);
										$(this).find("input[name='sendRadio']").attr('checked',true);
										var senderAddrID = $(this).find("input[name='sendRadio']").attr("senderAddrID");
										var sendName= $(this).find(".am-list-title .sendName").attr("send-name");
										var realSendName = $(this).find(".am-list-title .sendName").attr("real-sendname");
										var sendNumber = $(this).find(".am-list-title .sendNumber").attr("send-number");
										var realSendNumber = $(this).find(".am-list-title .sendNumber").attr("real-sendnumber");
										var sendProvinceCode = $(this).find(".am-list-brief .sendBrief").attr("data-provinceNo");
										var sendCityCode = $(this).find(".am-list-brief .sendBrief").attr("data-cityNo");
										var sendAreaCode = $(this).find(".am-list-brief .sendBrief").attr("data-areaNo");
										var sendStreet = $(this).find(".am-list-brief .dataStreet").attr("data-street");
										var sendAddress = $(this).find(".am-list-brief .dataAddress").attr("data-address");
										ant.setSessionData({
											data: {
												senderAddrID: senderAddrID,
												sendName:sendName,
												real_sendName:realSendName,
												sendNumber:sendNumber,
												real_sendNumber:realSendNumber,
												sendProvinceCode:sendProvinceCode,
												sendCityCode:sendCityCode,
												sendAreaCode:sendAreaCode,
												sendStreet:sendStreet,
												sendAddress:sendAddress
											}
										});
										// 选择寄件人时埋点
										var number = $(".selectsender_listitem").index(this)+1;
										BizLog.call('info',{
											spmId:"a106.b2101.c4590." + number,
											actionId:'clicked',
											params:{
													AddrID:senderAddrID
											}
										});
										ant.popWindow();
										//location.href='address-information.html';
										// ant.pushWindow({
										// 	url: "address-information.html"
										// });
									});
								}else{
									$(".manageInfo").hide();
									$(".manage_sender_div").hide();
									//如果没有寄件人，则进入寄件人地址填写页面
									$(".emptyInfo").show();
									/*
									ant.pushWindow({
										url: "send-address.html?addInfosUid="+addInfosUid+"&addIndex=1",
										param: {
										  closeCurrentWindow: true
										}
									});
									*/
								}
							hideLoading();
						});

					}
				}
			});
    }
});
