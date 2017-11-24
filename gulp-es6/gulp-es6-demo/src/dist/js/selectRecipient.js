Zepto(function($){
	FastClick.attach(document.body);
	ant.call('setTitle', {
      title: '选择收件人地址'
    });


	ant.on('resume', function (event) {

		initSelectRecipient();
	});
	$(".btn-recipient").click(function(){
		pushWindow("recipient-address.html",true);
	});
	// 点击管理  添加点击态
	clickStatus.bind($(".manage_receiver"))();
	$(".manage_receiver").on("click", function (){
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
				if (data.meta.success) {
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
						if(result.length>0){
							$(".manage_receiver_div").show();
							$(".manageInfoRec").show();
							$(".emptyInfoRec").hide();
							for(var i=0;i<result.length;i++){
								var street= getAreaNameByCode(result[i].districtCode).replace(/\s/g,"");
								// alert(getAreaNameByCode(result[i].districtCode).replace(/\s/g,""));
								if(result[i].defaultStatus=="1"){
									status ="<span style='color:#f4333c;font-size: .15rem;padding-right: .06rem;'>[默认地址]</span>";
								}else{
									status='';
								}
								//勾选中
								if(reciptiensAddrID==result[i].id){
									checkInfo ='<input type="radio" name="sendRadioRec"  class="sendRadioRec" checked="checked" reciptiensAddrID="'+result[i].id+'" id="cx'+i+'" />';
								}else{
									checkInfo ='<input type="radio" name="sendRadioRec"  class="sendRadioRec" reciptiensAddrID="'+result[i].id+'" id="cx'+i+'" />';
								}

								if(i<result.length-1){
									lHtml = '<label class="am-list-item check selectsender_listitem" for="cx'+i+'">';
								}else if(i==result.length-1){
									lHtml = '<label class="am-list-item check selectsender_listitem" for="cx'+i+'">';
								}
								var sName = result[i].name
								if(sName.length>5){
									 sName=sName.substring(0,5)+"...";
								}
								sHtml+=vHtml
									+lHtml
									+'<div class="am-list-content">'
									+'<div class="am-list-title selectsender_title">'
									+'<label class="sendNameRec" send-name="'+result[i].name+'">'+sName+'</label>'
									+'<span class="sendNumberRec" style="float:right;" send-number="'+result[i].mobile+'">'+result[i].mobile+'</span>'
									+'</div>'
									+'<div class="am-list-brief selectsender_content">'
									+'<label class="sendBriefRec" data-recprovinceNo="'+result[i].provinceCode+'" data-reccityNo="'+result[i].cityCode+'" data-recareaNo="'+result[i].districtCode+'">'+status+'<span data-streetRec="'+street+'" class="dataStreetRec">'+street+'</span><span data-addressRec="'+result[i].address+'" class="dataAddressRec">'+result[i].address+'</span></label>'
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
								var recNumber = $(this).find(".am-list-title .sendNumberRec").attr("send-number");
								var recProvinceCode = $(this).find(".am-list-brief .sendBriefRec").attr("data-recprovinceNo");
								var recCityCode = $(this).find(".am-list-brief .sendBriefRec").attr("data-reccityNo");
								var recAreaCode = $(this).find(".am-list-brief .sendBriefRec").attr("data-recareaNo");
								var recStreet = $(this).find(".am-list-brief .dataStreetRec").attr("data-streetrec");
								var recAddress = $(this).find(".am-list-brief .dataAddressRec").attr("data-addressrec");
								ant.setSessionData({
									data: {
										reciptiensAddrID: reciptiensAddrID,
										recName: recName,
										recNumber:recNumber,
										recProvinceCode:recProvinceCode,
										recCityCode:recCityCode,
										recAreaCode:recAreaCode,
										recStreet:recStreet,
										recAddress:recAddress
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
