Zepto(function($){
	FastClick.attach(document.body);
	ant.call('setTitle', {
      title: '管理收件人地址'
    });
	$(".btn-recipient-select").click(function(){
		pushWindow("recipient-address.html",true);

	});

	ant.on('resume', function (event) {
		initSelectRecipient();
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
					if(result.length>0){
						$(".manageInfoRec-select").show();
						$(".emptyInfoRec").hide();
						for(var i=0;i<result.length;i++){
							var street = getAreaNameByCode(result[i].districtCode).replace(/\s/g,"");
							if(result[i].defaultStatus=="1"){
								statusInfo='<span class="setDefaultRec" style="vertical-align: super;" data-senderAddrID=1 reciptiensAddrID="'+result[i].id+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png" style="width: .18rem;height: .18rem;margin-right: .05rem;"><span class="am-list-title" style="color:#108ee9;font-size:.13rem">默认地址</span></span>';
							}else{
								statusInfo='<span class="setDefaultRec" style="vertical-align: super;" data-senderAddrID=0 reciptiensAddrID="'+result[i].id+'"><img src="http://kuaidi-dev.oss-cn-hangzhou.aliyuncs.com/mobile/default-noSelect.png" style="width: .18rem;height: .18rem;margin-right: .05rem;"><span class="am-list-title" style="font-size:.13rem">设为默认</span></span>';
							}
							var sName = result[i].name
							if(sName.length>5){
								 sName=sName.substring(0,5)+"...";
							}
							sHtml+='<div class="am-list twoline" style="padding: .0rem;padding-bottom: 0.08rem">'
								+'<div class="am-list-body">'
								+'<div class="am-list-item" style="padding-top: .09rem;padding-bottom: .125rem;padding-right: .12rem;">'
								+'<div class="am-list-content">'
								+'<div class="am-list-title">'
								+'<label style="font-size:.15rem;color: #888;">'+sName+'</label>'
								+'<span style="font-size:.15rem;float:right;color: #888;">'+result[i].mobile+''
								+'</span>'
								+'</div>'
								+'<div class="am-list-brief selectsender_content">'
								+'<label style="font-size:.15rem;color: #000;">'+street+result[i].address+'</label>'
								+'</div>'
								+'</div>'
								+'</div>'
								+'<div class="am-list-item oneline" style="padding-top: .065rem;padding-bottom: .06rem;">'
								+'<div class="am-list-content">'
								+statusInfo
								+'</div>'
								+'<div class="am-list-right-brief" style="margin-right:.005rem;">'
								+'<span class="am-ft-black editRec" style="font-size:.13rem;" detailAddress="'+result[i].address+'" provinceNo="'+result[i].provinceCode+'" cityNo="'+result[i].cityCode+'" areaNo="'+result[i].districtCode+'" street="'+result[i].street+'" recipientsName="'+result[i].name+'" recipientsNumber="'+result[i].mobile+'" defaultStatus="'+result[i].defaultStatus+'" reciptiensAddrID="'+result[i].id+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/edit-icon.png" style="margin-right:.05rem;width: .19rem;height: .19rem;"" />编辑</span>'
								+'<span class="am-ft-black delRec" style="padding-left: .20rem;font-size:.13rem;" reciptiensAddrID="'+result[i].id+'"><img src="http://kuaidi-dev.oss-cn-hangzhou.aliyuncs.com/mobile/del-icon.png" style="margin-right:.05rem;width: .19rem;height: .19rem;"" />删除</span>'
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
							if($(this).attr("data-senderAddrID")=="1"){
								$(this).attr("data-senderAddrID","0");
								$(this).find("img").attr("src","http://kuaidi-dev.oss-cn-hangzhou.aliyuncs.com/mobile/default-noSelect.png");
								$(this).find(".am-list-title").css({"color":"#000"});
								$(this).find(".am-list-title").html("设为默认");
							}else{
								current=$(this);
								$(".setDefaultRec").map(function(){
									$(this).attr("data-senderAddrID","0");
									$(this).find("img").attr("src","http://kuaidi-dev.oss-cn-hangzhou.aliyuncs.com/mobile/default-noSelect.png");
									$(this).find(".am-list-title").css({"color":"#000"});
									$(this).find(".am-list-title").html("设为默认");
								});
								$(this).attr("data-senderAddrID","1");
								$(this).find("img").attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png");
								$(this).find(".am-list-title").css({"color":"#108ee9"});
								$(this).find(".am-list-title").html("默认地址");
							}
							var reciptiensAddrID = current.attr("reciptiensAddrID");
							setDefaultRec(reciptiensAddrID,$(this).parents('.oneline').find(".editRec"));
						});

						$(".editRec").click(function(e){
							e.preventDefault();
							var reciptiensAddrID = $(this).attr("reciptiensAddrID"),
								recName = $(this).attr("recipientsName"),
								recNumber = $(this).attr("recipientsNumber"),
							  recAddress = $(this).attr("detailAddress"),
								recProvinceCode = $(this).attr("provinceNo"),
								recCityCode = $(this).attr("cityNo"),
								recAreaCode = $(this).attr("areaNo"),
								recStreet = getAreaNameByCode(recAreaCode).replace(/\s/g,"");
							ant.setSessionData({
								data: {
									edit_reciptiensAddrID:reciptiensAddrID,
									edit_recName:recName,
									edit_recNumber:recNumber,
									edit_recAddress: recAddress,
									edit_recProvinceCode:recProvinceCode,
									edit_recCityCode:recCityCode,
									edit_recAreaCode:recAreaCode,
									edit_recStreet:recStreet
								}
							});
							pushWindow("recipient-address.html",true);

						});
						$(".delRec").click(function(e){
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
        if(obj.attr("data-senderAddrID")=="0"){
            defaultStatus ='0';
        }
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
										recName: '',
										recNumber:'',
										recProvinceCode:'',
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
			  console.log("取消删除！");
		  }
    }
});
