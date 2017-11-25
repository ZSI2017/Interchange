Zepto(function($){
	FastClick.attach(document.body);
	ant.call('setTitle', {
      title: '管理收件人地址'
    });
	$(".btn-recipient-select").click(function(){
		BizLog.call('info',{
			spmId:"a106.b2127.c4689.d7318",
			actionId:'clicked'
		});
		pushWindow("recipient-address.html",true);

	});

	// 打开时埋点
	// BizLog.call('info',{
	// 	spmId:"a106.b2127",
	// 	actionId:'pageMonitor'
	// });

	ant.on('resume', function (event) {
		initSelectRecipient();
		ant.setSessionData({
			data: {
				edit_reciptiensAddrID: "",
				edit_recName:"",
				edit_recNumber:"",
				edit_recProvinceCode:"",
				edit_recCityCode:"",
				edit_recAreaCode:"",
				edit_recStreet:"",
				edit_recAddress:""
			}
		});
	});
    initSelectRecipient();
    function initSelectRecipient(){
		showLoading();
	    var info = {
			};
			var xhrurl = jUrl+'/ep/receiver/list';
			$.axs(xhrurl, info, function(data) {
				hideLoading();
				if(data.meta.success) {
					$(".manage-bottom").show();
					var result = data.result,statusInfo='',checkInfo='',sHtml='';
					if(result){
						ant.setSessionData({
							data: {
								receiverCount:result.length
							}
						});
					}
					if(result&&result.length>0){
						$(".manageInfoRec-select").show();
						$(".emptyInfoRec").hide();
						for(var i=0;i<result.length;i++){
							var street = getAreaNameByCode(result[i].districtCode).replace(/\s/g,"");
							if(result[i].defaultStatus=="1"){
								statusInfo='<span class="setDefaultRec" style="vertical-align: super;" data-senderAddrID=1 reciptiensAddrID="'+result[i].id+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/selected.png" style="float:left;width: .16rem;height: .16rem;margin-right: .055rem;"><span class="am-list-title" style="float:left;color:#108ee9;font-size:.12rem">默认地址</span></span>';
							}else{
								statusInfo='<span class="setDefaultRec" style="vertical-align: super;" data-senderAddrID=0 reciptiensAddrID="'+result[i].id+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/unselected.png"  style="float:left;width: .16rem;height: .16rem;margin-right: .055rem;"><span class="am-list-title" style="float:left;font-size:.12rem;color:#999;">设为默认</span></span>';
							}
							var sName = result[i].name
							// if(sName.length>5){
							// 	 sName=sName.substring(0,5)+"...";
							// }
							sHtml+='<div class="am-list twoline" style="padding: .0rem;padding-bottom: 0.08rem;padding-top:1px;">'
								+'<div class="am-list-body" style="padding-top:1px;">'
								+'<div class="am-list-item">'
								+'<div class="am-list-content">'
								+'<div class="am-list-title"  style="margin-bottom:0">'
								+'<label style="font-size:.17rem;color: #999;">'+sName+'</label>'
								+'<span style="font-size:.17rem;float:right;color: #999;">'+result[i].mobile+''
								+'</span>'
								+'</div>'
								+'<div class="am-list-brief selectsender_content">'
								+'<label style="font-size:.14rem;color: #333;">'+street+result[i].address+'</label>'
								+'</div>'
								+'</div>'
								+'</div>'
								+'<div class="am-list-item oneline" style="padding:0.065rem 0.16rem 0.06rem 0.16rem;">'
								+'<div class="am-list-content">'
								+statusInfo
								+'</div>'
								+'<div class="am-list-right-brief" style="margin-right:.005rem;">'
								+'<span class="am-ft-black editRec" style="font-size:.13rem;" detailAddress="'+result[i].address+'" provinceNo="'+result[i].provinceCode+'" cityNo="'+result[i].cityCode+'" areaNo="'+result[i].districtCode+'" street="'+result[i].street+'" recipientsName="'+result[i].name+'" real-recipientsName="'+result[i].realName+'" recipientsNumber="'+result[i].mobile+'" real-recipientsNumber="'+result[i].realMobile+'" defaultStatus="'+result[i].defaultStatus+'" reciptiensAddrID="'+result[i].id+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/edit.png" style="margin-right:.045rem;width: .16rem;float:left;height: .16rem;"" /><span style="float:left;line-height:.16rem;font-size:.12rem;color:#999">编辑</span></span>'
								+'<span class="am-ft-black delRec" style="font-size:.13rem;" reciptiensAddrID="'+result[i].id+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/del.png" style="margin-right:.05rem;width: .16rem;float:left;padding-left: .205rem;height: .16rem;"" /><span style="float:left;line-height:.16rem;font-size:.12rem;color:#999">删除</span></span>'
								+'</div>'
								+'</div>'
								+'</div>'
								+'</div>';
						}
						$(".manageInfoRec-select").html(sHtml);
						$(".icon-check-Rec").on("touchend",function(){
							$(".icon-check-Rec").parent().find("input[name='sendRadioRec']").attr('checked',false);
							$(this).parent().find("input[name='sendRadioRec']").attr('checked',true);
						});
						$(".setDefaultRec").click(function(e){
							e.preventDefault();
							var current = $(this);
							var reciptiensAddrID = current.attr("reciptiensAddrID");
							var number = $(".setDefaultRec").index(this)+1;
							if($(this).attr("data-senderAddrID")=="1"){
								$(this).attr("data-senderAddrID","0");
								$(this).find("img").attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/unselected.png");
								$(this).find(".am-list-title").css({"color":"#999"});
								$(this).find(".am-list-title").html("设为默认");
								var number = $(".setDefaultRec").index(this)+1;
								$(this).attr("data-spmv","a106.b2127.c4690_"+ number +".d7322");
								BizLog.call('info',{
									spmId:"a106.b2127.c4690_"+ number +".d7322",
									actionId:'clicked',
									params:{
											AddrID:reciptiensAddrID
									}
								});

							}else{
								//  current=$(this);
								$(".setDefaultRec").map(function(){
									$(this).attr("data-senderAddrID","0");
									$(this).find("img").attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/unselected.png");
									$(this).find(".am-list-title").css({"color":"#999"});
									$(this).find(".am-list-title").html("设为默认");
								});
								$(this).attr("data-senderAddrID","1");
								$(this).find("img").attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/selected.png");
								$(this).find(".am-list-title").css({"color":"#108ee9"});
								$(this).find(".am-list-title").html("默认地址");
								$(this).attr("data-spmv","a106.b2127.c4690_"+ number +".d7319");
								BizLog.call('info',{
									spmId:"a106.b2127.c4690_"+ number +".d7319",
									actionId:'clicked',
									 params:{
											AddrID:reciptiensAddrID
									}
								});
							}

							setDefaultRec(reciptiensAddrID,$(this).parents('.oneline'));
						});

						$(".editRec").click(function(e){
							var reciptiensAddrID = $(this).attr("reciptiensAddrID");
							var number = $(".editRec").index(this)+1;
							$(this).attr("data-spmv","a106.b2127.c4690_"+ number +".d7320");
							BizLog.call('info',{
								spmId:"a106.b2127.c4690_"+ number +".d7320",
								actionId:'clicked',
								params:{
									AddrID:reciptiensAddrID
								}
							});
							e.preventDefault();
							var reciptiensAddrID = $(this).attr("reciptiensAddrID"),
								recName = $(this).attr("recipientsName"),
								realRecName = $(this).attr("real-recipientsName"),
								realRecNumber = $(this).attr("real-recipientsNumber"),
							  recAddress = $(this).attr("detailAddress"),
								recProvinceCode = $(this).attr("provinceNo"),
								recCityCode = $(this).attr("cityNo"),
								recAreaCode = $(this).attr("areaNo"),
								recStreet = getAreaNameByCode(recAreaCode).replace(/\s/g,"");
							ant.setSessionData({
								data: {
									edit_reciptiensAddrID:reciptiensAddrID,
									edit_recName:realRecName,
									edit_recNumber:realRecNumber,
									edit_recAddress: recAddress,
									edit_recProvinceCode:recProvinceCode,
									edit_recCityCode:recCityCode,
									edit_recAreaCode:recAreaCode,
									edit_recStreet:recStreet
								}
							});
							pushWindow("recipient-address.html?edit=edit",true);

						});
						$(".delRec").click(function(e){
							var reciptiensAddrID = $(this).attr("reciptiensAddrID");
							var number = $(".delRec").index(this)+1;
							$(this).attr("data-spmv","a106.b2127.c4690_"+ number +".d7321");
							BizLog.call('info',{
								spmId:"a106.b2127.c4690_"+ number +".d7321",
								actionId:'clicked',
								params:{
									AddrID:reciptiensAddrID
								}
							});
							e.preventDefault();
							var reciptiensAddrID = $(this).attr("reciptiensAddrID");
							delRec(reciptiensAddrID);
						});

					}else{
						$(".manageInfoRec-select").hide();
						$(".emptyInfoRec").show();
					}
				}else{

				}


			});
    }
    //设为默认
    function setDefaultRec(reciptiensAddrID,obj){

        var defaultStatus = '1';
        if(obj.find(".setDefaultRec").attr("data-senderAddrID")=="0"){
            defaultStatus ='0';
        }
			obj = obj.find(".editRec");
    	var info = {
			"receiverId" : JSON.parse(reciptiensAddrID),
			"defaultStatus" : defaultStatus
		};
		console.info(JSON.stringify(info));
		var xhrurl = jUrl+'/ep/receiver/set_default';
		$.axs(xhrurl, info, function(data) {
			if (data.meta.success) {
				ant.getSessionData({keys:['reciptiensAddrID']},function (result) {
					if(!result.data.reciptiensAddrID){
						ant.setSessionData({
							data: {
								reciptiensAddrID:obj.attr("reciptiensAddrID"),
								recName:obj.attr("recipientsName"),
								recNumber:obj.attr("recipientsNumber"),
								recAddress: obj.attr("detailAddress"),
								recProvinceCode: obj.attr("provinceNo"),
								recCityCode:obj.attr("cityNo"),
								recAreaCode:obj.attr("areaNo"),
								recStreet: getAreaNameByCode(obj.attr("areaNo")).replace(/\s/g,"")
							}
						});
					}
				});
			}
		});
    }

    function delDefaultRec(reciptiensAddrID){
		var info = {
			"receiverId" : JSON.parse(reciptiensAddrID),
			"defaultStatus" : "0"

		};
		var xhrurl = jUrl+'/ep/receiver/set_default';
		$.axs(xhrurl, info, function(data) {
			if (data.meta.success) {

			}
		});
	}
    //删除  fix bug by liqi
    function delRec(reciptiensAddrID){
		  if(confirm('确认删除?')){
			  BizLog.call('info',{
				  spmId:"a106.b2127.c4691.d7324",
				  actionId:'clicked',
				  params:{
					  AddrID:reciptiensAddrID
				  }
			  });
			    	var info = {
						"receiverId" : JSON.parse(reciptiensAddrID)
					};
				var xhrurl = jUrl+'/ep/receiver/delete';
				$.axs(xhrurl, info, function(data) {
					if (data.meta.success) {
						toast({
							text: '删除成功',
							type: 'success'
						});
						initSelectRecipient();
						ant.getSessionData({keys:['reciptiensAddrID']},function (result) {
							if(reciptiensAddrID == result.data.reciptiensAddrID){
								ant.setSessionData({
									data: {
										reciptiensAddrID:'',
										recName:'',
										recNumber:'',
										recProvinceCode:'',
										real_recName:'',
										real_recNumber:'',
										recCityCode:'',
										recAreaCode:'',
										recStreet:'',
										recAddress:'',
										recStreet:''
									}
								});
							}
						});
					}
				});
		 }else{
			  BizLog.call('info',{
				  spmId:"a106.b2127.c4691.d7323",
				  actionId:'clicked',
				  params:{
					  AddrID:reciptiensAddrID
				  }
			  });
			  console.log("取消删除！");
		  }
    }
});
