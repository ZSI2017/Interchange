showLoading();
Zepto(function($){
		FastClick.attach(document.body);
		var orderNo = getUrlParam('orderNo'),cancelCount=0,weight,wuliuStatus="00";
		var payways3 =  getUrlParam('payways3')||'';       // 判断是否是在限制下单的情况下跳转过来
		var orderId;
		var discount;  // 折扣率 服务类型折扣率 百分制，
		var complainStatus;   //string  已投诉标识（0：未投诉，1：已投诉，已投诉时投诉按钮置灰不可用）
		var defriendFlag = false;     // 代表是否被拉黑   false: 表示没有，  true:表示拉黑了
		var isManualPrice;       // 是否可议价
		var timeoutStatus;       // 标记超时取消状态
		var merchantCode;        // 快递公司编码
    var cleanPayFlag;       // 支付 收银台吊起 是否成功

		ant.on('resume', function (event) {
			// alert(JSON.stringify(event.data));
			if(event.data.info){
				 showLoading();
			 }
			orderScuess(orderNo,wuliuStatus);
		});
		//初始化下单成功点完成
		orderScuess(orderNo,wuliuStatus);
		$(".dialog-complain").find("label").on("touchstart",function(){
			$("#btn-complain-sumbit").removeClass("disabled");
		});
	    ant.call('setTitle', {
	      title: '订单详情'
	    });
		//取消订单tips
		$("#cancleOrder").click(function(){
			showReasonSelectPage();
		});

        // //关闭订单tips
        // $(".dialog-close-cancel").on("touchstart",function(){
		//     $(".dialog_cancel").hide();
		// });
	    //订单tips暂不取消
	    $("#btn-cancel").on("touchstart",function(){
		     $(".dialog_cancel").hide();
				 $("body").off("touchmove");
		});
	    //取消次数过多
			 $(".dialog-close-num").unbind();
	    $(".dialog-close-num").click(function(){

		    $(".dialog-num").hide();
				window.location.reload();

		});

		  $("#btn-sumbit").unbind();
	    $("#btn-sumbit").on("touchstart",function(){
				// ant.pushWindow({
				// 	url: "cancellation-order.html?orderNo="+orderNo+""
				// });
		    $(".dialog-num").hide();
					window.location.reload();

		});
	    //订单取消过多警告
			 $("#btn-warning-submit").unbind();
	    $("#btn-warning-submit").on("touchstart",function(){
		    $(".dialog-warning").hide();
					ant.pushWindow({
						url: "cancellation-order.html?orderNo="+orderNo+""
					});
		});
	    //快递公司无响应
		/*
	    $(".dialog-close-kuaidi").on("touchstart",function(){
		    $(".dialog-kuaidi").hide();
		});
		*/
		//增数
	    $(".num-add").on("touchstart",function(){
						var presetWeightPrice = JSON.parse($(".data-presetWeightPrice-number").val());
						var extraWeightUnit = JSON.parse($(".data-extraWeightUnit-number").val());
						var extraWeightPrice = JSON.parse($(".data-extraWeightPrice-number").val());
						var presetWeightPricePec = presetWeightPrice;//首重价格
						var extraWeightUnitPec = extraWeightUnit;//续重单位
						var extraWeightPricePec = extraWeightPrice;//续重价格
					  var presetWeight = JSON.parse($(".data-presetWeight").val());  // 首重重量
			    		var num_add = parseFloat($(".prise_val").val())+extraWeightUnitPec/1000;
			    		if($(".prise_val").val()==''){
			    			num_add =extraWeightUnitPec/1000;
			    		}
			    		$(".prise_val").val(num_add.toFixed(1));
						var weight = JSON.parse($(".prise_val").val());//总重
						var totalPrice;
 					 if(weight*1000>=presetWeight){
 					    totalPrice = presetWeightPricePec+Math.ceil((weight*1000-presetWeight)/extraWeightUnitPec)*extraWeightPricePec;
 						}else{
 							  totalPrice = presetWeightPricePec;
 						}
 					   totalPrice=totalPrice/100;
			    	$(".payment_btn").removeClass("disabled");
						$(".pay-money").html(totalPrice.toFixed(2));
						$(".payment_btn").text("支付 "+totalPrice.toFixed(2)+"元");
	    });
	    //减数
	    $(".num-dec").on("touchstart",function(){
					var presetWeightPrice = JSON.parse($(".data-presetWeightPrice-number").val());
					var extraWeightUnit = JSON.parse($(".data-extraWeightUnit-number").val());
					var extraWeightPrice = JSON.parse($(".data-extraWeightPrice-number").val());
					var presetWeightPricePec = presetWeightPrice;//首重价格
					var extraWeightUnitPec = extraWeightUnit;//续重单位
					var extraWeightPricePec = extraWeightPrice;//续重价格
				  var presetWeight = JSON.parse($(".data-presetWeight").val());  // 首重重量
						 var num_dec = parseFloat($(".prise_val").val())-extraWeightUnitPec/1000;
				     if(num_dec< presetWeight/1000){
                 num_dec=presetWeight/1000;
								 toast({
		 						   text:"不能小于首重重量哦～"
		 					   });
						 }
						 	$(".prise_val").val(num_dec.toFixed(1));
					var weight = JSON.parse($(".prise_val").val());//总重
           var totalPrice;
					 if(weight*1000>=presetWeight){
					    totalPrice = presetWeightPricePec+Math.ceil((weight*1000-presetWeight)/extraWeightUnitPec)*extraWeightPricePec;
						}else{
							  totalPrice = presetWeightPricePec;
						}
					   totalPrice=totalPrice/100;

			    $(".payment_btn").removeClass("disabled");
					$(".pay-money").html(totalPrice.toFixed(2));
					$(".payment_btn").text("支付 "+totalPrice.toFixed(2)+"元");
	    });
	    //拉取支付接口
	    $(".payment_btn").click(function(){
				console.log("isManualPrice :"+ isManualPrice);
			 	cleanPayFlag = true;
				if($(this).hasClass("disabled")){return;}else{
					// 设置支付按钮点击后 动画
					$(this).addClass("disabled");
					$(this).addClass("loading");
					var tempHtml = $(this).html();
					// console.log("payment_btn tempHTML " + tempHtml);
					$(this).attr("tempHtml",tempHtml);
				 $(this).html('<i class="icon" aria-hidden="true"></i>加载中...');
				//  $(".single_btn").removeClass("loading");
				// 	$(".single_btn").html("立即下单");

						var inputValue = $("#pay-input-1").val();
						var indexOfdot =inputValue.indexOf(".");
						if(indexOfdot == inputValue.length-1 ){
							  $("#pay-input-1").val(inputValue.substring(0,indexOfdot));
						}
						indexOfdot = indexOfdot == -1 ? inputValue.length:indexOfdot;
              var payAmount = parseFloat(inputValue)*100;
                if(isManualPrice== "1"){
								    // 直接输入价格
			               checkWeightForPay(orderNo,null,payAmount);
								 }else if(isManualPrice== "0"){
									    var  payAmountTemp = parseFloat($(".pay-money").text())*100;
											var weight = parseFloat($(".prise_val").val())*1000;
                      checkWeightForPay(orderNo,weight,payAmountTemp);
								 }else{
									     // 由系统发起支付
											 checkWeightForPay(orderNo,null,null);
								 }
			  }
	    });
		//支付1方式关闭
	    $(".close_icon").click(function(){
				 if(cleanPayFlag){return };
	        $(".dialog_mask").hide();
					 $("body").off("touchmove");
	    });

		//支付2方式关闭
		$(".dialog-close-pay").click(function(){
			  if(cleanPayFlag){return };
			  	$("#pay-input-1").val("");
					$(".payment_btn").addClass("disabled");
					$(".payment_btn").html("支付"+"<span style='width:2px;display: inline-block;'></span>"+"");
	        $(".dialog_mask_pay").hide();
					 $("body").off("touchmove");
	    });
		//支付3方式关闭
		$(".dialog-close-pay-sys").click(function(){
				if(cleanPayFlag){ return; }
					$(".dialog_mask_pay_sys").hide();
					$("body").off("touchmove");
	    });
	    $(".dialog-close-complain").click(function(){
			   $(".dialog-complain").find("input").prop("checked", false);
			   $("#btn-complain-sumbit").addClass("disabled");
		     $(".dialog-complain").hide();
		});
	    $("#btn-complain-cancel").on("touchstart",function(){
		    $(".dialog-complain").find("input").prop("checked", false);
				$("#btn-complain-sumbit").addClass("disabled");
		    $(".dialog-complain").hide();
		});
		//投诉成功
	  	$("#btn-complain-sumbit").unbind();
	    $("#btn-complain-sumbit").on("touchend",function(){
				if( $("#btn-complain-sumbit").hasClass("disabled")){
					 return ;
				 }else{
					 var complainDesc = $(".dialog-complain").find("label[data-desc='1']").find(".am-list-content").html();
	 				 $(".dialog-complain").find("input").prop("checked", false);
	 	    	 complaintsSuccess(orderId,complainDesc);

				 }
	    });
	    //扫一扫
			$("#btn-saosao-submit").unbind();
	    $("#btn-saosao-submit").click(function(){
		    $(".dialog-saosao").hide();
			  var barCode = $(".saosao-desc").html(),orderId = $(".data-orderId").val();
			  barCode = barCode.replace(/[^0-9\.]/g,"");
		    saosaoInfo(orderId,barCode);
		});
	    $("#btn-saosao-cancel").on("touchstart",function(){
		    $(".dialog-saosao").hide();
		});
	    //支付不加样式
	    $(".prise_val").on("input",function(){

				$(this).val($(this).val().replace(/[^0-9\.]/g,""));
			// console.log($(this).val());
			var flag = false;
			 var inputValue = $(this).val();
			 var indexOfdot =inputValue.indexOf(".");
				indexOfdot = indexOfdot == -1 ? inputValue.length:indexOfdot;
			 if(indexOfdot==4){
						inputValue= inputValue.substring(0,3);
							$(this).val(inputValue);
						toast({
						 text:"请确认重量是否正确哦"
					 });
			 }
			 indexOfdot =inputValue.indexOf(".");
			 indexOfdot = indexOfdot == -1 ? inputValue.length:indexOfdot;

			 if(inputValue.length-indexOfdot == 3){
						inputValue=inputValue.substring(0,inputValue.length-1);
							$(this).val(inputValue);
						toast({
						 text:"请确认重量是否正确哦"
					 });
			 }

				var weight = parseFloat($(".prise_val").val());//总重
				var presetWeightPricePec = JSON.parse($(".data-presetWeightPrice-number").val());//首重价格
				var extraWeightUnitPec = JSON.parse($(".data-extraWeightUnit-number").val());//续重单位
				var extraWeightPricePec =  JSON.parse($(".data-extraWeightPrice-number").val());//续重价格
				var presetWeight = JSON.parse($(".data-presetWeight").val());  // 首重重量
				var totalPrice;
				if(weight*1000>=presetWeight){
					totalPrice = presetWeightPricePec+Math.ceil((weight*1000-presetWeight)/extraWeightUnitPec)*extraWeightPricePec;
				}else{
					   totalPrice = presetWeightPricePec;
				}
         totalPrice=totalPrice/100;
				if(totalPrice){
					  $(".payment_btn").removeClass("disabled");
						$(".pay-money").html(totalPrice.toFixed(2));
						$(".payment_btn").text("支付 "+totalPrice.toFixed(2)+"元");
					}

					if($(".prise_val").val()=='' ){
						$(".payment_btn").addClass("disabled");
						$(".payment_btn").text("支付 ");
					}else{
						$(".payment_btn").removeClass("disabled");
					}
    		// checkWeightForPay(orderNo,weight);
	    });
		//快递费支付input
		$("#pay-input-1").on("input propertychange",function(){
			$(this).val($(this).val().replace(/[^0-9\.]/g,""));
		// console.log($(this).val());
		var flag = false;
		 var inputValue = $(this).val();
		 var indexOfdot =inputValue.indexOf(".");
			indexOfdot = indexOfdot == -1 ? inputValue.length:indexOfdot;
		 if(indexOfdot==6){
					inputValue= inputValue.substring(0,5);
						$(this).val(inputValue);
				  toast({
				   text:"请确认金额是否正确哦"
				 });
		 }
		 indexOfdot =inputValue.indexOf(".");
		 indexOfdot = indexOfdot == -1 ? inputValue.length:indexOfdot;

		 if(inputValue.length-indexOfdot == 4){
					inputValue=inputValue.substring(0,inputValue.length-1);
						$(this).val(inputValue);
				  toast({
				   text:"请确认金额是否正确哦"
				 });
		 }
	    	if($("#pay-input-1").val()==''){
	    		$(".payment_btn").addClass("disabled");
					$(".payment_btn").html("支付"+"<span style='width:2px;display: inline-block;'></span>"+"");
	    	}else{
	    		$(".payment_btn").removeClass("disabled");
					var payExpressWay2 = parseFloat($("#pay-input-1").val()).toFixed(2);
						$(".payment_btn").html("支付"+"<span style='width:2px;display: inline-block;'></span>"+payExpressWay2+"元");
	    	}
	    });

			$(".dialog_mask_pay").find(".am-list-clear").click(function(){
				  $("#pay-input-1").blur();
			   	$(".payment_btn").addClass("disabled");
			    $(".payment_btn").html("支付"+"<span style='width:2px;display: inline-block;'></span>"+"");
			});


			// 投诉弹窗的点击事件
	    $(".dialog-complain .am-list-item").on("touchstart",function(){
	    	 $(".dialog-complain .am-list-item").attr("data-desc","0");
	    	 $(this).attr("data-desc","1");
				 $("#btn-complain-sumbit").removeClass("disabled");

	    });
	    //下单成功点完成
			// 渲染页面基本数据
	  function orderScuess(orderNo,wuliuStatus){
			var info = {
				"orderNo" : orderNo
			};
			var xhrurl = jUrl+'/ep/order/detail';
			$.axs(xhrurl, info, function(data2) {
				if (data2.meta.success) {
					if(data2.meta.code=="0000"){
						var data = data2.result,sHtml='',bHtml='',oHtml='',wHtml='',qHtml='',cHtml='',merHtml='',pHtml='';
						  orderId = data.orderId;
							discount= data.discount;
							merchantCode = data.merchantCode;
							complainStatus = data.complainStatus;


						if(data!='' || data!=null){
							//发件信息
							qHtml+='<div class="am-list-title" style="color:#888;font-size:.15rem;"><span>'+data.snderName+'</span><span style="padding-left:.14rem;">'+data.snderMobile+'</span></div>';
							qHtml+='<div class="address_describe am-ft-gray" style="display:block" data-provinceNo="'+data.snderPrvnCode+'" data-cityNo="'+data.snderCityCode+'" data-areaNo="'+data.snderDstrCode+'">'+getAreaNameByCode(data.snderDstrCode).replace(/\s/g,"")+data.snderAddress+'</div>';
							$(".send-msg").html(qHtml);
							//收件信息
							cHtml+='<div class="am-list-title" style="color:#888;font-size:.15rem;"><span>'+data.rcvrName+'</span><span style="padding-left:.14rem;">'+data.rcvrMobile+'</span></div>';
							cHtml+='<div class="address_describe am-ft-gray" style="display:block" data-recprovinceNo="'+data.rcvrPrvnCode+'" data-reccityNo="'+data.rcvrCityCode+'" data-recareaNo="'+data.rcvrDstrCode+'">'+getAreaNameByCode(data.rcvrDstrCode).replace(/\s/g,"")+data.rcvrAddress+'</div>';
							$(".collect-msg").html(cHtml);

            var  productTypeTempNamecli;
          if(data.productTypeName!='' && data.productTypeName!=null){
							    productTypeTempNamecli = data.productTypeName;
							console.log("productTypeTempNamecli: "+productTypeTempNamecli);
						  console.log(productTypeTempNamecli.length);
						 if(productTypeTempNamecli.length>6){
								 productTypeTempNamecli = productTypeTempNamecli.substring(0,6);
						 }
					 }

							sHtml+=['<div class="am-list-item orderstatus_top kd-info" style="background-size: 0">',
										'<div class="am-list-item-part yuji-time" style="display:none;">',
											'<div class="am-list-content am-ft-gray">期望上门</div>',
											'<div class="am-list-extra" style="min-width: 2rem;max-width: 3rem;">'+data.bookedTime+'</div>',
										'</div>',
										'<div class="am-list-item-part">',
											'<div class="am-list-content am-ft-gray">订&nbsp;&nbsp;单&nbsp;&nbsp;号</div>',
											'<div class="am-list-extra" style="min-width: 2rem;max-width: 3rem;">'+data.orderNo+'</div>',
										'</div>',
										'<div class="am-list-item-part waybillNo-type" style="display:none;">',
											'<div class="am-list-content am-ft-gray">运&nbsp;&nbsp;单&nbsp;&nbsp;号</div>',
											'<div class="am-list-extra">'+data.waybillNo+'</div>',
										'</div>',
										'<div class="am-list-item-part">',
											'<div class="am-list-content am-ft-gray">快递公司</div>',
											'<div class="am-list-extra">'+data.merchantName+'</div>',
										'</div>',
										'<div class="am-list-item-part sys-type" style="display:none;">',
											'<div class="am-list-content am-ft-gray">服务类型</div>',
											'<div class="am-list-extra">'+productTypeTempNamecli+'</div>',
										'</div>',
										'<div class="am-list-item-part">',
											'<div class="am-list-content am-ft-gray">客服电话</div>',
											'<div class="am-list-extra"><a href="tel:'+data.custServiceTel+'">'+data.custServiceTel+'</a></div>',
										'</div>',
									'</div>',
									'<div class="am-list-item kd-order-item oneline sao-number" style="text-align:center;padding: .04rem .15rem .045rem;display:none;">',
									  '<div class="am-list-content"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/scan_icon.png" style="margin-right:.12rem;width: .19rem;height: .19rem;vertical-align: sub;" /><span style="font-size:.14rem;color:#108ee9;">扫描快递单查看物流信息</span></div>',
									'</div>',
									'<div class="am-list-item kd-order-item oneline wuliu" style="text-align:center;display:none; min-height: .285rem;">',
									  '<div class="am-list-content"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/Logistics_infor_icon.png" style="margin-right:.12rem;width: .19rem;height: .19rem;vertical-align: sub;" /><span style="font-size:.14rem;color:#108ee9;">查看物流信息</span></div>',
									'</div>'
							].join('');
							$(".top-list").html(sHtml);
							if(isAndroid){
									$(".kd-info").css("border-top","1px solid #ddd");
									$(".kd-info").css("border-bottom","1px solid #ddd");
							}
							if(data.productTypeName!='' && data.productTypeName!=null){
								   $(".sys-type").show();
							}else{
								$(".sys-type").hide();
							}
							// var addService = data.addService || "无";
							var remark = data.remark || "无";
							var addService = data.addService || "无";
							bHtml+=['<div class="am-list-body">',
										'<div class="am-list-item">',
											'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">物品类型</div>',
											'<div class="am-ft-gray" style="font-size:.15rem;">'+data.goodsType+'</div>',
										'</div>',
										'<div class="am-list-item extra-serves-data">',
											'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">额外服务</div>',
											'<div class="am-ft-gray" style="font-size:.15rem;">'+addService+'</div>',
										'</div>',
										'<div style="margin-left: .15rem;"></div>',
										'<div class="am-list-item remark-data" style="padding: .07rem .15rem;padding-bottom:.065rem">',
											'<div class="am-list-content am-ft-gray" style="font-size:.15rem;white-space: normal;line-height: 19px;"><span id="remarksID">备注：</span><span class="orderstatus_remarks am-ft-gray">'+remark+'<span></div>',
										'</div>',
									'</div>'
							].join('');
							$(".basic-list").html(bHtml);
							if(data.addService == "1"){
								    $(".extra-serves-data").hide();
							}
								if(remark =="无"){
										$(".orderstatus_remarks").css("float","right");
										$(".orderstatus_remarks").css("color","#8a8a8a");
										$("#remarksID").html("备注");
								}else{
										 $(".orderstatus_remarks").css("float","none");
								}

							$(".data-weight").text(data.goodsWeight/1000);
							$(".data-kuaidi-evaluate").text(data.estCosts);
							$(".data-discount").text(data.discount);
							$(".data-coupon").text(data.couponCosts);
							$(".data-paid").text(data.paidCosts);
							oHtml+='<div class="am-ft-gray" style="font-size:.15rem;">支付宝在线支付</div>';
							if(data.payStatus=="1"){
								pHtml+='待支付';
							}else if(data.payStatus=="2"){
								pHtml+='支付中';
							}else if(data.payStatus=="4"){
								pHtml+='支付失败';
							}
							var payStatus='',hasPayed='';
							if(data.payStatus=="3"){
								console.log("receiptAmount  "+(parseFloat(data.receiptAmount)/100).toFixed(2));
							hasPayed ='<div class="am-list-item paid">'+
									       '<div class="am-list-content am-ft-black" style="font-size:.15rem;">已支付</div><div class="am-ft-black" style="font-size:.15rem;">'+(parseFloat(data.receiptAmount)/100).toFixed(2)+'元<span id="payResult"></span></div>'+
								         '</div>';
								$("#cancleOrder").hide();
							}else{
								payStatus = '<div class="am-list-item wait-pay" style="padding-bottom:0.065rem">'+
									                    '<div class="am-list-content am-ft-gray" style="font-size:.15rem;">支付状态</div>'+
									                    '<div class="am-ft-black" style="font-size:.15rem;">'+pHtml+'</div>'+
								                 '</div>';
							}
							var estimatePrice = data.estimatePrice/100;
							merHtml+=['<div class="am-list-item">',
											'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">支付方式</div>',
												oHtml,
											'</div>',
										'</div>',
										payStatus,
										'<div class="am-list-item"  style="padding-bottom:0.065rem">',
											'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">物品重量</div>',
											'<div class="am-ft-red" style="font-size:.15rem;"><span class="data-weight">'+data.goodsWeight/1000+'</span><span style="padding-left:.06rem">公斤</span></div>',
											'<input type="hidden" class="data-presetWeight" value='+data.presetWeight+' />',
											'<input type="hidden" class="data-presetWeightPrice" value='+data.presetWeightPrice+' />',
											'<input type="hidden" class="data-extraWeightUnit" value='+data.extraWeightUnit+' />',
											'<input type="hidden" class="data-extraWeightPrice" value='+data.extraWeightPrice+' />',
										'</div>',
										'<div class="am-list-item kuaidi-evaluate" style="padding-bottom:0.065rem;background-size: .0rem .01rem,.0rem .01rem,100% 0,100% .01rem;">',
											'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">预计快递费</div>',
											'<div class="am-ft-red data-kuaidi-evaluate" style="font-size:.15rem;">'+estimatePrice.toFixed(2)+'</div>',
										'</div>',
										  hasPayed,
										'<div class="am-list-footer footer-des" style="padding: .115rem .15rem;padding-top:.065rem">',
											'<div class="am-ft-12">',
												'首重'+(data.presetWeightPrice)/100+'元，续重'+(data.extraWeightPrice)/100+'元<a class="am-ft-12 price_rule" style="padding-left: .15rem;" >如何计算？</a>',
											'</div>',
										'</div>',

							].join('');
							var orderStatus = data.orderStatus;
							switch (orderStatus){
								case "1":
									//待接单
									showOrderState1(data,merHtml);
									break;
								case "2":
									//待取件
									showOrderState2(data,merHtml);
									break;
								case "3":
									//已取件
									showOrderState3(data,oHtml);
									break;
								case "4":
									//已取消
									showOrderState4(data,merHtml);
									break;
							}
						}
						/**************点击事件方法**************************/
						var epCompanyId = data.epCompanyId,epCompanyNo=data.epCompanyNo,odTakingName=data.orderTakingName,odTakingNumber =data.orderTakingNo;
						//若快递公司无响应
						var epCompanyName=data.merchantName;
						$(".data-express-show-info").html(epCompanyName);
						  timeoutStatus = data.timeoutStatus;
							// alert("data.timeoutStatus "+data.timeoutStatus);
						if(timeoutStatus=="2"){
							$(".dialog-kuaidi").show();
							//初始化tips弹窗一次
							timeoutStatus = "3";
							updChangeExpress(orderId);
						};

						$(".price_rule").click(function(){
							ant.pushWindow({
								url: "price-rule.html"
							});
						});
						$(".single_btn").click(function(){
							console.log("data.pricingMode"+data.pricingMode );
							isManualPrice = data.isManualPrice;
							// 弹窗弹起，阻止背景滚动
							$("body").on('touchmove', function (event) {
								event.preventDefault();
						 }, false);
							if(data.pricingMode =="2"){
								//非系统发起支付方式
								if(data.isManualPrice == "0"){
									//加减重量算价格
									$(".dialog_mask").show();
									console.log("weight "+$(".data-weight").text());

									$(".prise_val").val(parseFloat($(".data-weight").text()).toFixed(1));
									$(".data-presetWeightPrice-number").val($(".data-presetWeightPrice").val());
									$(".data-extraWeightUnit-number").val($(".data-extraWeightUnit").val());
									$(".data-extraWeightPrice-number").val($(".data-extraWeightPrice").val());
									var weight = parseFloat($(".data-weight").text());
									var presetWeightPrice = JSON.parse($(".data-presetWeightPrice-number").val());
									console.log($(".data-extraWeightUnit-number").val());
									var extraWeightUnit = JSON.parse($(".data-extraWeightUnit-number").val());
									var extraWeightPrice = JSON.parse($(".data-extraWeightPrice-number").val());
									var presetWeight = JSON.parse($(".data-presetWeight").val());
									var presetWeightPricePec = presetWeightPrice;//首重价格
									var extraWeightUnitPec = extraWeightUnit;//续重单位
									var extraWeightPricePec = extraWeightPrice;//续重价格
                  console.log(presetWeight +"+"+presetWeightPricePec+"+"+extraWeightUnitPec+"+"+extraWeightPricePec);
									var totalPrice = presetWeightPricePec+Math.ceil((weight*1000-presetWeight)/extraWeightUnitPec)*extraWeightPricePec;
									totalPrice = totalPrice/100;
									console.log(totalPrice);
									$(".pay-money").html(totalPrice.toFixed(2));
									$(".payment_btn").html("支付 "+"<span style='width:2px;display: inline-block;'></span>"+$(".pay-money").text()+"元");
								}else if(data.isManualPrice == "1"){
									//直接输入价格
									$("#pay-input-1").val("");
									$(".dialog_mask_pay").show();
								}
							}else{
								// alert(data.orderAmount);
								$(".dialog_mask_pay_sys").show();
								$(".data-weight-sys").text((data.goodsWeight)/1000);
								if(data.discountDesc!='' && data.discountDesc!=null){
									$(".pay-sys-desc").show();
									$(".pay-sys-desc").html(data.discountDesc);
								}else{
									$(".pay-sys-desc").hide();
								}
								$(".data-pay-sys").text(data.orderAmount/100);
								$(".data-pay-show").text((data.payableAmount/100).toFixed(2));
								$(".payment_btn").html("支付"+"<span style='width:7px;display: inline-block;'></span>"+$(".data-pay-show").text()+"元");
							}
						});


						$("#btn-kuaidi-sumbit").unbind();    // 解除 跟换的绑定
						$("#btn-kuaidi-sumbit").on("touchstart",function(){
							//更换快递公司接口
							$(".dialog-kuaidi").hide();
							agreeChange(orderId);
						});
						$("#btn-kuaidi-cancel").on("touchstart",function(){
						  	$(".dialog-kuaidi").hide();
							  //状态改换为 3 表示是超时后状态
							  timeoutStatus = "3";
						});

					  $("#btn-ok").unbind();
						//订单取消 tips确定
						$("#btn-ok").on("touchstart",function(){
							if($(this).hasClass("disabled")){return;};
							var cancelnum1 = $("#count-data").val(),cancelnum2 = $("#count-cancelCntLimit").val();
							var warnNum = JSON.parse(cancelnum1)+1;
							 $(".dialog-warning").find(".am-dialog-brief").html("您当日已取消"+warnNum+"次，若再次取消将被列入黑名单，无法再次下单");

                      console.log("click #btn-ok");
							 if($(".extra_service .am-flexbox-item").hasClass("express_active")){
								 var odCancelReason = $(".extra_service").find(".express_active").text();
								   $(".dialog_cancel").hide();
									 $("body").off("touchmove");

								   confirmCancel(orderId,odCancelReason,cancelnum1,cancelnum2);
							 }



						});
						//催一催
						$(".reminder_btn").click(function(){
							if($(".reminder_btn").hasClass("disabled_btn")){
								return;
							}else{
								urgeInfo(orderId);
							}
						});
						//投诉tips
						$(".complaint_btn").click(function(e){
							e.preventDefault();
							if($(".complaint_btn").hasClass("disabled_btn")||$(".complaint_btn").hasClass("disabled_btn2")){
								return;
							}else{
								$(".dialog-complain").show();
							}
						});
						// 查看物流信息
						$(".wuliu").click(function(){
								 ant.pushWindow({
									url:'alipays://platformapi/startapp?appId=20000754&url=' + encodeURIComponent('/app/src/expressDetail.html?logisticsNo='+orderNo+'&logisticsCode='+merchantCode+'&from=SendEXClient')
								});
						})
						//扫一扫
						$(".sao-number").click(function(){
							ant.scan({
								type: 'bar'
							  }, function (result) {
								  var barCode = JSON.parse(JSON.stringify(result.barCode));
								  $(".data-orderId").val(orderId);
								  $(".dialog-saosao").show();
									$(".saosao-desc").html("快递单号: "+barCode);
									// if(window.confirm("快递单号: "+barCode)){
									// 	   alert(orderId)
									//      $(".dialog-saosao").hide();
									// 	   saosaoInfo(orderId,barCode);
									// 		 return false;
									// }
							});
						});
						// 这里的是从限制下单提示后出现 的
						if(payways3){
							  $(".single_btn").click();
						}else{
							//  判断 限制下单的窗口
							setTimeout(function(){ notPaidOrder(data.notPaidOrderNo,data.notPaidRemindCnt)},300);
						}
					}else if(data.meta.code=="0310"){
						toast({
							text: data.meta.msg,
							type: 'exception'
						});
					}else if(data.meta.code=="0311"){
						toast({
							text: data.meta.msg,
							type: 'exception'
						});
					}

					hideLoading();
				}
			});
		   }
	    //取消订单弹窗载入
	    function showReasonSelectPage(){
	    	var info = {
    		};
    		var xhrurl = jUrl+'/ep/order/cancel_cause';
    		$.axs(xhrurl, info, function(data) {
    			if (data.meta.success) {
					if(data.meta.code == "0000"){
						var cancelReason = data.result.cancelCause,cHtml0='',cHtml1='',cHtml2='',cancelCount=data.result.cancelCount,cancelCntLimit=data.result.cancelCntLimit;
						if(cancelReason!='' || cancelReason!=null){
							var len = cancelReason.length;
							for(var i=0;i<len;i++){
								if(i<2){
									if(i==0){
										cHtml0+='<div class="am-flexbox-item cancel_listorder">'+cancelReason[i]+'</div>';
									}else{
										cHtml0+='<div class="am-flexbox-item cancel_listorder">'+cancelReason[i]+'</div>';
									}
								}else if(i<len-2){
									if(i==2){
										cHtml1+='<div class="am-flexbox-item cancel_listorder">'+cancelReason[i]+'</div>';
									}else{
										cHtml1+='<div class="am-flexbox-item cancel_listorder">'+cancelReason[i]+'</div>';
									}
								}else{
									if(i==4){
										cHtml2+='<div class="am-flexbox-item cancel_listorder">'+cancelReason[i]+'</div>';
									}else{
										cHtml2+='<div class="am-flexbox-item cancel_listorder">'+cancelReason[i]+'</div>';
									}
								}
							}
							$(".cancelReason1").html(cHtml0);
							$(".cancelReason2").html(cHtml1);
							$(".cancelReason3").html(cHtml2);
						}
						if(isAndroid){
							$(".cancel_listorder").css("border",'1px solid #888');
						}
						$("#btn-ok").addClass("disabled");
						$("#count-data").val(cancelCount);
						$("#count-cancelCntLimit").val(cancelCntLimit);

						//点击切换样式
						$("#dialog-show .am-flexbox-item").on("touchstart",function(){
							$("#dialog-show .am-flexbox-item").removeClass('express_active');
							if(isAndroid){
								$("#dialog-show .am-flexbox-item").css("border-color",'#888 !important;');
							}
							if($(this).hasClass('express_active')){
								$(this).removeClass('express_active');
							}else{
								if(isAndroid){
									$(this).css("border",'1px #108ee9 solid !important;');
								}
								$(this).addClass('express_active');
							}
							if($("#btn-ok").hasClass('disabled')){
                $("#btn-ok").removeClass("disabled");
              }
						});
								//  	alert("after cancel " +timeoutStatus);
								// alert(timeoutStatus =="3");
								if(timeoutStatus =="3"){
									$("#dialog-show").find(".msg").removeClass("alert_orerred");
									$("#dialog-show").find(".msg").html("取消订单后<p>快递小哥将不会上门取件</p>");
								}else{
									if(cancelCount ==cancelCntLimit-1){
										$("#dialog-show").find(".msg").addClass("alert_orerred");
										$("#dialog-show").find(".msg").html("您当日已取消"+cancelCount+"单，若再次取消将被列入黑名单，无法再次下单");
									}
							}
							$(".dialog_cancel").show();
							$("body").on('touchmove', function (event) {
										 event.preventDefault();
						 }, false);

					}else if(data.meta.code == "0110"){
						toast({
							text: data.meata.msg,
							type: 'exception'
						});
					}
    			}
    		});

	    }
	    //取消订单计数
	    function confirmCancel(orderId,odCancelReason,cancelnum1,cancelnum2){

	    	var info = {
				"orderId":orderId,
				"cancelCause":odCancelReason
    		};
        console.log("调用了取消订单接口！");
    		var xhrurl = jUrl+'/ep/order/cancel/confirm';
    		$.axs(xhrurl, info, function(data) {
    			if (data.meta.success) {
				     	console.log(data.meta.msg);

            //  alert("cancelnum1 "+cancelnum1);
						//   alert("cancelnum2 "+cancelnum2);
						// 	alert("timeoutStatus "+timeoutStatus);
							 //这里判读警告框 和 拉黑提示框
							 // 判断 取消是否是拉黑后取消

          if(timeoutStatus=="3"){
								//取消订单
								ant.pushWindow({
									url: "cancellation-order.html?orderNo="+orderNo+""
								});
					}else{
						var count = 2;
						// 取消成功后的页面跳转
					if(JSON.parse(cancelnum1)<(JSON.parse(cancelnum2)-count)){
						//取消订单
						ant.pushWindow({
							url: "cancellation-order.html?orderNo="+orderNo+""
						});
					}
					if(JSON.parse(cancelnum1) == (JSON.parse(cancelnum2)-count)){
									// 现在已经取消了 cancelCntLimit -1 次
									$(".dialog-warning").show();
							}else if(JSON.parse(cancelnum1)>(JSON.parse(cancelnum2)-count)){
									 // 现在已经取消了 cancelCntLimit 次
									//  window.location.reload();  //页面刷新！
										$(".dialog-num").show();
							}
					}

    			}
    		});
	    }
	    //弹窗只载入一次
	    function updChangeExpress(orderId){
	    	var info = {
	    		"orderId" : JSON.parse(orderId)
    		};
    		var xhrurl = jUrl+'/ep/order/save_pop_status';
    		$.axs(xhrurl, info, function(data) {
    			if (data.meta.success) {
    			}
    		});
	    }
	    //更新快递公司信息
	    function agreeChange(orderId){
				console.log("into agreeChange");
	    	var info = {
				"orderId" : JSON.parse(orderId)
    		};
    		var xhrurl = jUrl+'/ep/order/change_express';
    		$.axs(xhrurl, info, function(data) {
					if(data.meta.code=="0000"){
						$(".dialog-kuaidi").hide();
								toast({
											text: "更换成功",
											type: 'success'
										 });
								console.log("更换成功");
						//更新订单物流信息
						wuliuStatus ="01";
						orderScuess(orderNo,wuliuStatus);
					}else{
						toast({
								text: data.meta.msg,
								type: 'exception'
				     	});
						}},function(d){
					if(d.meta.code =="0912" ||d.meta.code=="0913" ){
						     alert("EMS无法服务，建议取消订单");
			          // toast({
			          //     text: "EMS无法服务，建议取消订单",
			          //     type: 'exception'
			          //  });
			       }else if(d.meta.code=="0911" || d.meta.code=="0910" ){
                    if(window.confirm('更换失败，点击确定重试')){
                           agreeChange(orderId);
										}
							}else{
								toast({
									text: d.meta.msg,
									type: 'exception'
								});
				    	}
				});
	    }
		//待接单
		function showOrderState1(data,merHtml){
			$(".order-wait-desc").text("下单成功，正在安排快递员");
			$(".order-wait-desc").css({"color":"#ff5b05"});
			$(".yuji-time").show();

			//$(".extra-serves-data").hide();
			//$(".remark-data").hide();
			$(".data-person-list").hide();
			$(".extra-list").html(merHtml);

			$(".express_distance").css("padding-bottom","0");
		}
		//待取件
		function showOrderState2(data,merHtml){

			$(".order-wait-desc").text("已安排快递员，等待取件");
			$(".order-wait-desc").css({"color":"#ff5b05"});
			$(".yuji-time").show();
			$(".yuji-time .am-list-content").html("预计上门");
			//$(".extra-serves-data").show();
			//$(".remark-data").show();
			$(".data-person-list").show();
			var xHtml='',vHtml='';
			//支付几种方式
			if(data.pricingMode =="2"){
				vHtml+='<div class="am-button-wrap am-fixed-bottom kd-bottom" style="padding-top:.055rem">'
						+'<div class="am-ft-center am-ft-12 am-ft-gray single_top" data-pricingMode='+data.pricingMode+' data-isManualPrice='+data.isManualPrice+' style="padding-bottom: 0.1rem;padding-top:0.015rem;color:#ccc;font-size:.14rem">请在快递员上门称重后支付，不要提前支付哟~</div>'
						+'<a class="am-button single_btn" style="vertical-align:center;" data-pricingMode='+data.pricingMode+' data-isManualPrice='+data.isManualPrice+'>与快递员核对完成，去支付</a>'
					+'</div>';
			}else if(data.pricingMode =="1"){
				//系统发起支付方式3
				$(".order-notice").show();
				$(".express_distance").css("padding-bottom","0");
				// vHtml+='<div class="am-button-wrap">'
				// 		+'<div class="am-ft-center" data-pricingMode='+data.pricingMode+' style="font-size:.14rem;color:#ccc;"6</div>'
				// 		+'<a class="am-button" data-pricingMode='+data.pricingMode+' style="background:#fff;color: #108ee9;border: 1px solid #108ee9;margin-top:.1rem;">等待快递员取件</a>'
				// 	+'</div>';
			}
			if(data.payStatus=="3"){
			       	$("#cancleOrder").hide();
				      $(".order-notice").hide();
              $(".show-order-submit").hide();
							$(".express_distance").css("padding-bottom","0");
			}else{
					$(".show-order-submit").html(vHtml);
			}

			var xHtmlInfo='',xHtmlPushInfo='',xHtmlOrderImg='',xHtmlOrderInfo='',xHtmlOrderTel='';
			if(data.accepterType =="1"){
				xHtmlOrderImg ='<div class="am-list-thumb" style="margin-right: .12rem;"><img src="'+data.courierHeardUrl+'" style="width:.5rem;height:.5rem;" /></div>';
				xHtmlOrderInfo = '<div class="am-list-title" style="font-size:.15rem;"><span style="vertical-align:super;margin-bottom:2px;">'+data.courierName+'</span><span style="padding-left:.15rem;vertical-align:super;margin-bottom:2px;">'+data.courierMobile+'</span></div>';
				xHtmlOrderTel = '<div class="am-list-extra" style="overflow:visible;min-width: .36rem;width:.36rem;-webkit-box-flex: 0;-webkit-flex: 0;margin-top: .01rem;"style="min-width: .36rem;width:.36rem;-webkit-box-flex: 0;-webkit-flex: 0;margin-top: .07rem;"><a href="tel:'+data.courierMobile+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/phone_icon.png" style="width:.36rem;height:.36rem;" /></a></div>';
			}else{
				xHtmlOrderImg ='<div class="am-list-thumb" style="margin-right: .12rem;"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/courier_head_icon.png" style="width:.5rem;height:.5rem;" /></div>';
				xHtmlOrderInfo = '<div class="am-list-title" style="font-size:.15rem;"><span>'+data.siteName+'</span><span style="padding-left:.15rem;">'+data.managerMobile+'</span></div>';
				xHtmlOrderTel = '<div class="am-list-extra" style="overflow:visible;min-width: .36rem;width:.36rem;-webkit-box-flex: 0;-webkit-flex: 0;margin-top: .01rem;"><a href="tel:'+data.managerMobile+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/phone_icon.png" style="width:.36rem;height:.36rem;" /></a></div>';
			}
			if(data.remindStatus!=null && data.remindStatus ==1){
				xHtmlPushInfo='<span class="reminder_btn disabled_btn">已催单</span>';
			}else{
				xHtmlPushInfo='<span class="reminder_btn">催一催</span>';
			}
			// 如果 data.managerMobile  不是 手机号  或者为空，或者空格 ，就没有催一催
			 console.log("data.managerMobile: "+data.managerMobile||data.courierMobile);
			if(!isCorrectPhoneNum(data.managerMobile||data.courierMobile)){
          xHtmlPushInfo='';
			}
			xHtml+='<div class="am-list-item" style="padding-top: .13rem;padding-bottom: .145rem;padding-right: .23rem;">'
						+xHtmlOrderImg
						+'<div class="am-list-content address_listwhere">'
							+xHtmlOrderInfo
							+'<div class="am-list-brief" style="overflow:visible">'
								+xHtmlPushInfo
								+'<span class="complaint_btn">投诉</span>'
							+'</div>'
						+'</div>'
						+xHtmlOrderTel
					+'</div>';
			$(".data-person").html(xHtml);
			$(".extra-list").html(merHtml);
			if(complainStatus == "1"){
				  $(".complaint_btn").addClass("disabled_btn");
			}

		}
		//已取件
		function showOrderState3(data,oHtml){
			console.log("已取件 data.payStatus " + data.payStatus);
			$("#cancleOrder").hide();
			$(".order-wait-desc").text("快递员已取件");
			$(".order-wait-desc").css({"color":"#42ae55"});
			$(".yuji-time").hide();
			$(".waybillNo").show();
			//$(".extra-serves-data").show();
			//$(".remark-data").show();

			// 已经支付时，隐藏支付按钮
     if(data.payStatus !="1"){
			 $(".show-order-submit").hide();
			 $(".express_distance").css("padding-bottom","0");
		 }
			//存在运单号
			if(data.waybillNo!=null&&data.waybillNo != ''){
				$(".waybillNo-type").show();
				$(".wuliu").show();
				$(".sao-number").hide();
			}else{
				$(".waybillNo-type").hide();
				$(".wuliu").hide();
				$(".sao-number").show();
			}
			$(".data-person-list").hide();
			var oHtml2='',oPayHtml2='',vHtml='',cHtml='';
			var presetWeightList='<div class="am-list-footer footer-des" style="padding: .115rem .15rem;padding-top:.065rem">'
				+'<div class="am-ft-12">'
					+'首重'+(data.presetWeightPrice)/100+'元，续重'+(data.extraWeightPrice)/100+'元<a class="am-ft-12 price_rule" style="padding-left: .15rem;" >如何计算？</a>'
				+'</div>'
			'</div>';
			if(data.productTypeName!='' && data.productTypeName!=null){
				   $(".sys-type").show();
			  	$(".server-type-show-info").show();
					var productTypeTempName = data.productTypeName;
					if(productTypeTempName.length>6){
              productTypeTempName = productTypeTempName.substring(0,6);
					}
				 $(".server-type-show-info-data").html(productTypeTempName);
			}else{
				$(".sys-type").hide();
				$(".server-type-show-info").hide();
			}
			if(data.pricingMode =="1"){
				//系统发起支付方式3
				$(".order-notice").show();
				vHtml+='<div class="am-button-wrap">'
						+'<div class="am-ft-center am-ft-12 am-ft-red single_top" data-pricingMode='+data.pricingMode+' style="padding-bottom: 0.1rem;">请于24小时内完成支付，以免影响物品派送~</div>'
						+'<a class="am-button single_btn" data-pricingMode='+data.pricingMode+'>立即支付 <span class="data-money">'+(data.payableAmount/100).toFixed(2)+'</span> 元</a>'
					+'</div>';
			}else{
				vHtml+='<div class="am-button-wrap am-fixed-bottom kd-bottom" style="padding-top:.055rem">'
						+'<div class="am-ft-center am-ft-12 am-ft-gray single_top" data-pricingMode='+data.pricingMode+' data-isManualPrice='+data.isManualPrice+' style="padding-bottom: 0.1rem;padding-top:0.015rem;color:#ccc;font-size:.14rem">请在快递员上门称重后支付，不要提前支付哟~</div>'
						+'<a class="am-button single_btn" style="vertical-align:center;" data-pricingMode='+data.pricingMode+' data-isManualPrice='+data.isManualPrice+'>与快递员核对完成，去支付</a>'
					+'</div>';
			}

			if(data.payStatus=="1"){
			  	oPayHtml2+='<div class="am-list-content am-ft-gray" style="font-size:.15rem;">支付状态</div><div class="am-ft-black" style="font-size:.15rem;">待支付</div>';

				//未支付状态，显示支付按钮
				$(".show-order-submit").html(vHtml);
			}else if(data.payStatus=="3"){
				$("#cancleOrder").hide();
				console.log("receiptAmount 已取件"+parseFloat(data.receiptAmount).toFixed(2));
				$(".order-notice").hide();
			  oPayHtml2+='<div class="am-list-content am-ft-black" style="font-size:.15rem;">已支付</div><div class="am-ft-black" style="font-size:.15rem;">'+(parseFloat(data.receiptAmount)/100).toFixed(2)+'元<span id="payResult"></span></div>';
				presetWeightList='';


			}else if(data.payStatus=="4") {
			  oPayHtml2+='<div class="am-list-content am-ft-gray" style="font-size:.15rem;">支付状态</div><div class="am-ft-black" style="font-size:.15rem;">支付失败</div>';
			}else{
				 oPayHtml2+='<div class="am-list-content am-ft-gray" style="font-size:.15rem;">支付状态</div><div class="am-ft-black" style="font-size:.15rem;">支付中</div>';
			}
			if(data.couponAmount!=null && data.couponAmount!=''){
				cHtml+='<div class="am-list-item youhui-coupon">'
						+'<div class="am-list-content am-ft-red" style="font-size:.15rem;">优惠劵</div>'
						+'<div class="am-ft-red" style="font-size:.15rem;">'+'-'+(data.couponAmount/100).toFixed(2)+'</div>'
					+'</div>';
			}
			oHtml2+='<div class="am-list-item">'
						+'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">支付方式</div>'
						+oHtml
					+'</div>'
					+'<div class="am-list-item">'
						+'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">物品重量</div>'
						+'<div class="am-ft-black" style="font-size:.15rem;"><span class="data-weight">'+data.goodsWeight/1000+'</span><span style="padding-left:.06rem">公斤</span></div>'
						+'<input type="hidden" class="data-presetWeight" value='+data.presetWeight+' />'
						+'<input type="hidden" class="data-presetWeightPrice" value='+data.presetWeightPrice+' />'
						+'<input type="hidden" class="data-extraWeightUnit" value='+data.extraWeightUnit+' />'
						+'<input type="hidden" class="data-extraWeightPrice" value='+data.extraWeightPrice+' />'
					+'</div>'
					+'<div class="am-list-item kuaidi-ok">'
						+'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">快递费</div>'
						+'<div class="am-ft-black" style="font-size:.15rem;">'+(data.orderAmount/100).toFixed(2)+'</div>'
					+'</div>'
					+'<div class="am-list-item youhui-discount">'
						+'<div class="am-list-content am-ft-red" style="font-size:.15rem;">优惠折扣</div>'
						+'<div class="am-ft-red" style="font-size:.15rem;">'+'-'+((data.orderAmount-data.payableAmount)/100).toFixed(2)+'</div>'
					+'</div>'
					+cHtml
					+'<div class="am-list-item paid">'
						+oPayHtml2
					+'</div>'
					+ presetWeightList;
			$(".extra-list").html(oHtml2);
		}
		//已取消
		function showOrderState4(data,merHtml){

			$(".order-wait-desc").css({"color":"grey"});
			$(".order-wait-desc").text("订单已取消");
			$(".order-wait-desc").addClass("am-ft-gray");
			$(".extra-list").html(merHtml);
			$(".yuji-time").show();
			$(".show-order-submit").hide();
			//$(".extra-serves-data").show();
			//$(".remark-data").show();
			$(".data-person-list").hide();
			$("#cancleOrder").hide();
				$(".express_distance").css("padding-bottom","0");
	 		console.log(defriendFlag);
			 if(defriendFlag){

			 }
		}
	    //催一催
	    function urgeInfo(orderId){
	    	var info = {
	    		"orderId" : JSON.parse(orderId)
    		};
    		var xhrurl = jUrl+'/ep/order/remind';
    		$.axs(xhrurl, info, function(data) {
    			if (data.meta.success) {
					if(data.meta.code=="0000"){
						toast({
							text: '亲，已通知快递小哥火速上门，请耐心等待哦~'
						});
						$(".reminder_btn").addClass("disabled_btn");
						$(".reminder_btn").html("已催单");
					}else if(data.meta.code=="0410"){
						toast({
							text: data.meta.msg,
							type: 'exception'
						});
					}
    			}
    		});
	    }
	    //投诉成功提交
	    function complaintsSuccess(orderId,complainDesc){
	    	var info = {
				"orderId" : JSON.parse(orderId),
				"content":complainDesc
    		};
    		var xhrurl = jUrl+'/ep/order/complain';
    		$.axs(xhrurl, info, function(data) {
					if(data.meta.code=="0000"){
						toast({
							text: '投诉成功',
							type: 'success'
						});
							$("#btn-complain-sumbit").addClass("disabled");
							$(".dialog-complain").hide();
							$(".complaint_btn").html("已投诉");
							// alert("已投诉");
							$(".complaint_btn").addClass("disabled_btn2");
					}
    		});
	    }
	    //快递费计算
	    function checkWeightForPay(orderNo,weight,payAmount){
				   console.log("orderNo "+orderNo);
					 console.log("weight "+weight);
					 console.log("payAmount "+payAmount);
				  var info;
		    	if(weight == null){
							 if(payAmount == null ||!payAmount){
								 info={
									 	"orderNo":orderNo,
								 }
							 }else{
					    	info = {
								"orderNo":orderNo,
								"payAmount":payAmount
						    	};
								}
						}else{
							info = {
							"orderNo": orderNo,
							"weight":weight,
							"payAmount":payAmount
							};
						}

    		var xhrurl = jUrl+'/ep/order/pay';
    		$.axs(xhrurl, info, function(data) {
					if(data.meta.code=="0000"){
						var orderStr =  data.result.orderStr;
						var	s = orderStr.replace(/&amp;/g,"&");
								s = s.replace(/&lt;/g,"<");
								s = s.replace(/&gt;/g,">");
								s = s.replace(/&nbsp;/g," ");
								s = s.replace(/&#39;/g,"\'");
								s = s.replace(/&quot;/g,"\"");
							console.log("orderStr04: "+s);

						AlipayJSBridge.call('tradePay',{
							  orderStr:s
						},function(result){

							//三种 弹出框 右上角的点击事件
							cleanPayFlag = false;
							if(result.resultCode == "9000"){
               payways3 = null;
							 // 隐藏三中支付状态的 弹窗 并且恢复背景 的滚动
							  $("body").off("touchmove");
							 $(".dialog_mask_pay").hide();
							 $(".dialog_mask_pay_sys").hide();
							 $(".dialog_mask").hide();

							ant.pushWindow({
								url: "paySuccess.html?orderNo="+orderNo+""
							});
						}else{

							$(".payment_btn").removeClass("loading");
							$(".payment_btn").removeClass("disabled");
              var temppayAmount;
							if(payAmount == null || !payAmount){
                    temppayAmount = $(".data-pay-show").text();
								}else{
                       temppayAmount =  payAmount/100;
								}
					$(".payment_btn").html("支付"+"<span style='width:7px;display: inline-block;'></span>"+temppayAmount+"元");
						}
							 console.log(JSON.stringify(result))
						});
					}else{
						toast({
							text: data.meta.code,
							type: 'exception'
						});
					}
    		});
	    }
		//扫一扫
		function saosaoInfo(orderId,waybillNo){
			var info = {
				"orderNo": orderNo,
				"orderId" : JSON.parse(orderId),
				"waybillNo" : waybillNo
    		};
    		var xhrurl = jUrl+'/ep/order/save_way_bill';
    		$.axs(xhrurl, info, function(data) {
					if(data.meta.success){
						 $(".waybillNo-type").show();
					   $(".wuliu").show();
						 $(".waybillNo-type .am-list-extra").html(waybillNo);
					   $(".sao-number").hide();
					}else if(data.meta.code=="0611"){
						toast({
							text: "与已有单号重复，请扫描对应的真实运单！",
							type: 'exception'
						});
					}
    		});
		}

});
