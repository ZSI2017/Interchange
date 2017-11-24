Zepto(function($){
	FastClick.attach(document.body);
	ant.call('setTitle', {
      title: '选择收件人地址'
    });

	// 打开时埋点
	// BizLog.call('info',{
	// 	spmId:"a106.b2125",
	// 	actionId:'pageMonitor'
	// });
	ant.on('resume', function (event) {
		initSelectRecipient();
	});
	$(".btn-recipient").click(function(){
		BizLog.call('info',{
			spmId:"a106.b2125.c4686.d7310",
			actionId:'clicked'
		});
		pushWindow("recipient-address.html",true);
	});
	// 点击管理  添加点击态
	clickStatus.bind($(".manage_receiver"))();
	$(".manage_receiver").on("click", function (){
		BizLog.call('info',{
			spmId:"a106.b2125.c4685.d7309",
			actionId:'clicked'
		});
		pushWindow("manage-recipient.html",true);
	});
	var receiverCount =0;
    initSelectRecipient();
	$(".select-bottom").show();
    function initSelectRecipient(){
		showLoading();
	    var info = {
			};
			var xhrurl = jUrl+'/ep/receiver/list';
			$.axs(xhrurl, info, function(data) {
				if (data.meta.code=="0000"||data.meta.success) {
					if(data.result && data.result.length >0){
						receiverCount = data.result.length;
					}else{
						receiverCount =0;
					}
					ant.setSessionData({
						data: {
							receiverCount:receiverCount
						}
					});
					ant.getSessionData({
						keys: ['reciptiensAddrID']
					}, function (results) {
						var reciptiensAddrID = results.data.reciptiensAddrID;
						var result = data.result,status='',checkInfo='',sHtml='',lHtml='',vHtml='';
						if(result && result.length>0){
							$(".manage_receiver_div").show();
							$(".manageInfoRec").show();
							$(".emptyInfoRec").hide();
							for(var i=0;i<result.length;i++){
								var street= getAreaNameByCode(result[i].districtCode).replace(/\s/g,"");
								// alert(getAreaNameByCode(result[i].districtCode).replace(/\s/g,""));
								if(result[i].defaultStatus=="1"){
									status ="<span style='color:#f4333c;font-size: .14rem;padding-right: .06rem;'>[默认地址]</span>";
								}else{
									status='';
								}
								//勾选中
								if(reciptiensAddrID==result[i].id){
									checkInfo ='<input type="radio" name="sendRadioRec"  class="sendRadioRec" checked="checked" reciptiensAddrID="'+result[i].id+'" id="cx'+i+'" />';
									ant.setSessionData({
										data: {
											reciptiensAddrID: result[i].id,
											recName: result[i].name,
											real_recName:result[i].realName,
											recNumber:result[i].mobile,
											real_recNumber:result[i].realMobile,
											recProvinceCode:result[i].provinceCode,
											recCityCode:result[i].cityCode,
											recAreaCode:result[i].districtCode,
											recStreet:street,
											recAddress:result[i].address
										}
									});
								}else{
									checkInfo ='<input type="radio" name="sendRadioRec"  class="sendRadioRec" reciptiensAddrID="'+result[i].id+'" id="cx'+i+'" />';
								}
								var spmv_i = i+1;
								if(i<result.length-1){
									lHtml = '<label class="am-list-item check selectsender_listitem" for="cx'+i+'" data-spmv="a106.b2125.c4685.'+ spmv_i +'">';
								}else if(i==result.length-1){
									lHtml = '<label class="am-list-item check selectsender_listitem" for="cx'+i+'" data-spmv="a106.b2125.c4685.'+ spmv_i +'">';
								}
								var sName = result[i].name
								// if(sName.length>5){
								// 	 sName=sName.substring(0,5)+"...";
								// }
								sHtml+=vHtml
									+lHtml
									+'<div class="am-list-content">'
									+'<div class="am-list-title selectsender_title">'
									+'<label class="sendNameRec"  style="color:#999;font-size:.17rem;" send-name="'+result[i].name+'" real-sendName="'+result[i].realName+'">'+sName+'</label>'
									+'<span class="sendNumberRec" style="float:right;color:#999;font-size:.17rem;" real-recNumber="'+result[i].realMobile+'" send-number="'+result[i].mobile+'">'+result[i].mobile+'</span>'
									+'</div>'
									+'<div class="am-list-brief selectsender_content">'
									+'<label class="sendBriefRec" style="color:#333;font-size:.14rem;" data-recprovinceNo="'+result[i].provinceCode+'" data-reccityNo="'+result[i].cityCode+'" data-recareaNo="'+result[i].districtCode+'">'+status+'<span data-streetRec="'+street+'" class="dataStreetRec" style="color:#333;font-size:.14rem;">'+street+'</span><span data-addressRec="'+result[i].address+'" class="dataAddressRec" style="color:#333;font-size:.14rem;">'+result[i].address+'</span></label>'
									+'</div>'
									+'</div>'
									+'<div class="am-checkbox">'
									+checkInfo
									+'<span class="icon-check icon-check-Rec"></span>'
									+'</div>'
									+'</label>';
							}
							$(".manageInfoRec").html(sHtml);
							//点击勾选返回
							$(".am-list-item ").click(function(){
								$(".am-list-item ").find("input[name='sendRadioRec']").attr('checked',false);
								$(this).find("input[name='sendRadioRec']").attr('checked',true);
								var reciptiensAddrID = $(this).find("input[name='sendRadioRec']").attr("reciptiensAddrID");
								var recName= $(this).find(".am-list-title .sendNameRec").attr("send-name");
								var realRecName = $(this).find(".am-list-title .sendNameRec").attr("real-sendName");
								var recNumber = $(this).find(".am-list-title .sendNumberRec").attr("send-number");
								var realRecNumber = $(this).find(".am-list-title .sendNumberRec").attr("real-recNumber")
								var recProvinceCode = $(this).find(".am-list-brief .sendBriefRec").attr("data-recprovinceNo");
								var recCityCode = $(this).find(".am-list-brief .sendBriefRec").attr("data-reccityNo");
								var recAreaCode = $(this).find(".am-list-brief .sendBriefRec").attr("data-recareaNo");
								var recStreet = $(this).find(".am-list-brief .dataStreetRec").attr("data-streetrec");
								var recAddress = $(this).find(".am-list-brief .dataAddressRec").attr("data-addressrec");
								ant.setSessionData({
									data: {
										reciptiensAddrID: reciptiensAddrID,
										recName: recName,
										real_recName:realRecName,
										recNumber:recNumber,
										real_recNumber:realRecNumber,
										recProvinceCode:recProvinceCode,
										recCityCode:recCityCode,
										recAreaCode:recAreaCode,
										recStreet:recStreet,
										recAddress:recAddress
									}
								});
								var number = $(".selectsender_listitem").index(this)+1;
								BizLog.call('info',{
									spmId:"a106.b2125.c4685." + number,
									actionId:'clicked',
									params:{
										AddrID:reciptiensAddrID
									}
								});
								ant.popWindow();
							});
						}else{
							$(".manageInfoRec").hide();
							$(".manage_receiver_div").hide();
							$(".emptyInfoRec").show();
						}
						hideLoading();
					});
				}
			});
    }
});
