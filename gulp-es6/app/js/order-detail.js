showLoading();
Zepto(function($){
		FastClick.attach(document.body);
		var orderNo = getUrlParam('orderNo'),cancelCount=0,weight,wuliuStatus="00";
		var payways3 =  getUrlParam('payways3')||'';       // 判断是否是在限制下单的情况下跳转过来

		// BizLog.call('info',{
		// 	spmId:"a106.b2115",
		// 	actionId:'pageMonitor',
		// 	params:{
		// 		OrderNO:orderNo,
		// 	}
		// });
		var orderId;
		var discount;  // 折扣率 服务类型折扣率 百分制，
		var complainStatus;   //string  已投诉标识（0：未投诉，1：已投诉，已投诉时投诉按钮置灰不可用）
		var defriendFlag = false;     // 代表是否被拉黑   false: 表示没有，  true:表示拉黑了
		var isManualPrice;       // 是否可议价
		var timeoutStatus;       // 标记超时取消状态
		var merchantCode;        // 快递公司编码
		var actCarrierCode;       // 承运公司编号
    var cleanPayFlag;       // 支付 收银台吊起 是否成功
		var waybillNo;          // 运单号
		var isResume= false;    // 判断是否 resume 事件加载的

		pushDownRefresh(function(dist){
			      console.log("dist "+(0-dist)+"px");
		        $("#mesage1").show();
		        $("#message2").hide();
		},function(){
		       $("#mesage1").hide();
		       $("#message2").show();
		},function(){
		        $("#mesage1").hide();
		        $("#message2").hide();
		        $("body").hide();
		        // showLoading();
		      //  window.location.reload();
		},"express_content",function(){ orderScuess(orderNo,wuliuStatus,function(){ $("#mesage1").hide();
		 $("#message2").hide();}) });

		ant.on('resume', function (event) {
			  isResume = true;
				refreshFlag=true;
			// alert(JSON.stringify(event.data));
			if(event.data&&event.data.info){
				  showLoading();
			 }
			orderScuess(orderNo,wuliuStatus);
		});
		//初始化下单成功点完成
		orderScuess(orderNo,wuliuStatus);
		// $(".dialog-complain").find("label").on("click",function(){
		// 	$("#btn-complain-sumbit").removeClass("disabled");
		// });
	    ant.call('setTitle', {
	      title: '订单详情'
	    });
		//取消订单tips
		var cancelFlag = false;
		$("#cancleOrder").click(function(){
			BizLog.call('info',{
					 spmId:"a106.b2115.c4640.d7188",
					 actionId:'clicked',
					 params:{
		 				  OrderNO:orderNo,
		 			}
			 });
			// alert(cancelFlag);
			// alert(cancelFlag);
			if(cancelFlag){

			}else{
				cancelFlag = true;
				showReasonSelectPage();
			}
		});

        // //关闭订单tips
        // $(".dialog-close-cancel").on("touchstart",function(){
		//     $(".dialog_cancel").hide();
		// });
	    //订单tips暂不取消
	    $("#btn-cancel").on("click",function(){
				BizLog.call('info',{
						spmId:"a106.b2115.c4643.d7211",
						actionId:'clicked',
						params:{
 							OrderNO:orderNo,
 					}
				});
				cancelFlag = false;
		     $(".dialog_cancel").hide();
				 $("body").off("touchmove");
				 refreshFlag = true;
		});
	    //取消次数过多
			 $(".dialog-close-num").unbind();
	    $(".dialog-close-num").click(function(){
				BizLog.call('info',{
						spmId:"a106.b2115.c4651.d7231",
						actionId:'clicked',
						params:{
							 OrderNO:orderNo,
					 }
				});
		    $(".dialog-num").hide();
				window.location.reload();

		});

		 $("#btn-kefu").unbind();
		 $("#btn-kefu").on("click",function(){
			 BizLog.call('info',{
					 spmId:"a106.b2115.c4651.d7232",
					 actionId:'clicked',
					 params:{
		 				  OrderNO:orderNo,
		 			}
			 });
		 })

		  $("#btn-sumbit").unbind();
	    $("#btn-sumbit").on("click",function(){
				BizLog.call('info',{
						 spmId:"a106.b2115.c4651.d7233",
						 actionId:'clicked',
						 params:{
			 				  OrderNO:orderNo,
			 			}
				 });
				// ant.pushWindow({
				// 	url: "cancellation-order.html?orderNo="+orderNo+""
				// });
		    $(".dialog-num").hide();
					window.location.reload();

		});
	    //订单取消过多警告
			 $("#btn-warning-submit").unbind();
	    $("#btn-warning-submit").on("click",function(){
				BizLog.call('info',{
						 spmId:"a106.b2115.c4650.d7230",
						 actionId:'clicked',
						 params:{
			 				  OrderNO:orderNo,
			 			}
				 });
		    $(".dialog-warning").hide();
					ant.pushWindow({
						url: "cancellation-order.html?orderNo="+orderNo+""
					});
		});
	    //快递公司无响应

	    $(".dialog-close-kuaidi").on("touchstart",function(){
				BizLog.call('info',{
 						spmId:"a106.b16.c01.d02",
 						actionId:'clicked'
 				});
		});
		//增数
	    $(".num-add").on("click",function(){
				BizLog.call('info',{
						 spmId:"a106.b2115.c4642.d7204",
						 actionId:'clicked',
						 params:{
								OrderNO:orderNo,
						}
				 });
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
	    $(".num-dec").on("click",function(){
				BizLog.call('info',{
						 spmId:"a106.b2115.c4642.d7205",
						 actionId:'clicked',
						 params:{
								OrderNO:orderNo,
						}
				 });
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
				BizLog.call('info',{
						 spmId:"a106.b2115.c4642.d7210",
						 actionId:'clicked',
						 params:{
								OrderNO:orderNo,
						}
				 });
				console.log("isManualPrice :"+ isManualPrice);

				if($(this).hasClass("disabled")){
					return;
				}

				if((isManualPrice== "1"&&parseFloat($("#pay-input-1").val())==0)||(isManualPrice== "0"&&parseFloat($(".pay-money").text())==0)){
					toast({
				   	text:"请确认金额是否正确哦"
				   });
					  return;
				}else{
					cleanPayFlag = true;
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
				BizLog.call('info',{
						 spmId:"a106.b2115.c4642.d7203",
						 actionId:'clicked',
						 params:{
			 				  OrderNO:orderNo,
			 			}
				 });
				 if(cleanPayFlag){return };
	        $(".dialog_mask").hide();
					 $("body").off("touchmove");
					 refreshFlag = true;
	    });

		//支付2方式关闭
		$(".dialog-close-pay").click(function(){
			BizLog.call('info',{
					 spmId:"a106.b2115.c4642.d7203",
					 actionId:'clicked',
					 params:{
							OrderNO:orderNo,
					}
			 });
			  if(cleanPayFlag){return };
			  	$("#pay-input-1").val("");
					$(".payment_btn").addClass("disabled");
					$(".payment_btn").html("支付"+"<span style='width:2px;display: inline-block;'></span>"+"");
	        $(".dialog_mask_pay").hide();
					 $("body").off("touchmove");
					 refreshFlag = true;
	    });
		//支付3方式关闭
		$(".dialog-close-pay-sys").click(function(){
			BizLog.call('info',{
					 spmId:"a106.b2115.c4642.d7203",
					 actionId:'clicked',
					 params:{
							OrderNO:orderNo,
					}
			 });
				if(cleanPayFlag){ return; }
					$(".dialog_mask_pay_sys").hide();
					$("body").off("touchmove");
					refreshFlag = true;
	    });
	    $(".dialog-close-complain").click(function(){
				BizLog.call('info',{
						 spmId:"a106.b2115.c4641.d7196",
						 actionId:'clicked',
						 params:{
							 OrderNO:orderNo,
					 }
				 });
				$("body").off("touchmove");
				refreshFlag = true;
			   $(".dialog-complain").find("input").prop("checked", false);
			   $("#btn-complain-sumbit").addClass("disabled");
		     $(".dialog-complain").hide();
		});
	    $("#btn-complain-cancel").on("click",function(){
				BizLog.call('info',{
						 spmId:"a106.b2115.c4641.d7195",
						 actionId:'clicked',
						 params:{
							 OrderNO:orderNo,
					 }
				 });
				 $("body").off("touchmove");
				 refreshFlag = true;
		    $(".dialog-complain").find("input").prop("checked", false);
				$("#btn-complain-sumbit").addClass("disabled");
		    $(".dialog-complain").hide();
		});
		//投诉成功
	  	$("#btn-complain-sumbit").unbind();
	    $("#btn-complain-sumbit").on("click",function(){
				BizLog.call('info',{
						spmId:"a106.b2115.c4641.d7197",
						actionId:'clicked',
						params:{
							 OrderNO:orderNo,
					 }
				});
				if( $("#btn-complain-sumbit").hasClass("disabled")){
					 return ;
				 }else{

					 var complainDesc = $(".dialog-complain").find("span[data-desc='1']").find(".am-list-content").html();
	 				 $(".dialog-complain").find("input").prop("checked", false);
					//  alert(complainDesc);
					  	 complaintsSuccess(orderId,complainDesc);

				 }
	    });
	    //扫一扫
			$("#btn-saosao-submit").unbind();
	    $("#btn-saosao-submit").click(function(){
				BizLog.call('info',{
						 spmId:"a106.b2115.c4694.d7336",
						 actionId:'clicked',
						 params:{
							 OrderNO:orderNo,
					 }
				 });
		    $(".dialog-saosao").hide();
			  var barCode = $(".saosao-desc").html(),orderId = $(".data-orderId").val();
			  barCode = barCode.replace(/[^0-9\.]/g,"");
		    saosaoInfo(orderId,barCode);
		});
	    $("#btn-saosao-cancel").on("click",function(){
				BizLog.call('info',{
						 spmId:"a106.b2115.c4694.d7335",
						 actionId:'clicked',
						 params:{
			 				  OrderNO:orderNo,
			 			}
				 });
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

			$(".prise_val").focus(function(){
				BizLog.call('info',{
					 spmId:"a106.b2115.c4642.d7206",
					 actionId:'clicked',
					 params:{
							OrderNO:orderNo,
					}
			 });
			})

			$("#pay-input-1").focus(function(){
				BizLog.call('info',{
					 spmId:"a106.b2115.c4642.d7209",
					 actionId:'clicked',
					 params:{
							OrderNO:orderNo,
					}
			 });
				  //  alert( $(this).attr("placeholder"));
				   $(this).attr("placeholder","");
					 $(this).css("font-size",".3rem");
			});
			$("#pay-input-1").blur(function(){
				  //  alert( $(this).attr("placeholder"));
				   $(this).attr("placeholder","请输入金额");
					 if($(this).val() == ""){
						 $(this).css("font-size",".17rem");
					 }
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


			// 投诉弹窗的点击事
			 $(".mycomplain").unbind();
	    $(".mycomplain").on("click",function(e){
				var sendid = "a106.b2115.c4641.";
				var titleInfo = "";
				 if($(this).find(".am-list-content").text()=="上门速度慢"){
								sendid +="d7198";
								titleInfo = "上门速度慢";
				 }else if($(this).find(".am-list-content").text()=="未上门取件"){
								 sendid +="d7199";
								 titleInfo = "未上门取件";
				 }else if($(this).find(".am-list-content").text()=="服务态度差"){
									 sendid +="d7200";
									 titleInfo = "服务态度差";
				 }else if($(this).find(".am-list-content").text()=="快递员报价过高"){
								 sendid +="d7201";
								 titleInfo = "快递员报价过高";
				 }else if($(this).find(".am-list-content").text()=="快递员称重过高"){
								 sendid +="d7202";
								 titleInfo = "快递员称重过高";
				 }
				 BizLog.call('info',{
							spmId:sendid,
							actionId:'clicked',
							params:{
	 		 				  OrderNO:orderNo,
								title:titleInfo
	 		 			}
					});
	    	 $(".dialog-complain .am-list-item").attr("data-desc","0");
				 $(".dialog-complain .am-list-item").find("input").prop("checked", false);
				 $(this).find("input").prop("checked",true);
				//  alert($(this).find(".am-list-content").html());
	    	 $(this).attr("data-desc","1");
				 $("#btn-complain-sumbit").removeClass("disabled");
	    });
	    //下单成功点完成
			// 渲染页面基本数据
	  function orderScuess(orderNo,wuliuStatus,refreshcb){
			var info = {
				"orderNo" : orderNo
			};
			var xhrurl = jUrl+'/ep/order/detail';
			$.axs(xhrurl, info, function(data2) {
				if (data2.meta.success) {
					if(data2.meta.code=="0000"){
						var data = data2.result,sHtml='',bHtml='',oHtml='',wHtml='',qHtml='',cHtml='',merHtml='',pHtml='',couponTemp='',myDiscount='';
						  orderId = data.orderId;
							discount= data.discount;
							merchantCode = data.merchantCode;
							actCarrierCode = data.actCarrierCode;
							complainStatus = data.complainStatus;
							waybillNo = data.waybillNo;

               console.log("sdadsfasddfasd "+data.receiptAmount);
						if(data!='' || data!=null){
							 var localsnderDstrName = data.snderDstrName || "";
							 var  localrcvrDstrName = data.rcvrDstrName || "";
							 var indexofName = localsnderDstrName.indexOf("市");
							 var indexofNamerec = localrcvrDstrName.indexOf("市")
							 if(indexofName%2 == 0){
								    if(localsnderDstrName.substring(0,indexofName/2) == localsnderDstrName.substring(indexofName/2,indexofName)){
											     localsnderDstrName = localsnderDstrName.substring(indexofName/2);
										}
							 }
							 if(indexofNamerec%2 == 0){
								    if(localrcvrDstrName.substring(0,indexofNamerec/2) == localrcvrDstrName.substring(indexofNamerec/2,indexofNamerec)){
											     localrcvrDstrName = localrcvrDstrName.substring(indexofNamerec/2);
										}
							 }
							// alert(data.snderDstrName);
							//发件信息
							qHtml+='<div class="am-list-title" style="color:#888;font-size:.15rem;"><span>'+data.snderName+'</span><span style="padding-left:.14rem;">'+data.snderMobile+'</span></div>';
							qHtml+='<div class="address_describe am-ft-gray" style="display:block" data-provinceNo="'+data.snderPrvnCode+'" data-cityNo="'+data.snderCityCode+'" data-areaNo="'+data.snderDstrCode+'">'+localsnderDstrName+data.snderAddress+'</div>';
							$(".send-msg").html(qHtml);
							//收件信息
							cHtml+='<div class="am-list-title" style="color:#888;font-size:.15rem;"><span>'+data.rcvrName+'</span><span style="padding-left:.14rem;">'+data.rcvrMobile+'</span></div>';
							cHtml+='<div class="address_describe am-ft-gray" style="display:block" data-recprovinceNo="'+data.rcvrPrvnCode+'" data-reccityNo="'+data.rcvrCityCode+'" data-recareaNo="'+data.rcvrDstrCode+'">'+localrcvrDstrName+data.rcvrAddress+'</div>';
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
											'<div class="am-list-item-part pickUpCode" style="display:none;">',
											 '<div class="am-list-content am-ft-gray">取件码</div>',
											 '<div class="am-list-extra" style="color:#FF5B05">'+data.pickUpCode+'</div>',
										 '</div>',
										'<div class="am-list-item-part yuji-time" style="display:none;padding-top:0.04rem">',
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
											'<div class="am-list-content merchantName am-ft-gray">快递公司</div>',
											'<div class="am-list-extra">'+data.merchantName+'</div>',
										'</div>',
										'<div class="am-list-item-part sys-type" style="display:none;">',
											'<div class="am-list-content am-ft-gray">服务类型</div>',
											'<div class="am-list-extra">'+productTypeTempNamecli+'</div>',
										'</div>',
										'<div class="am-list-item-part actCarrierName" style="display:none">',
											'<div class="am-list-content am-ft-gray">承运快递</div>',
											'<div class="am-list-extra">'+data.actCarrierName+'</div>',
										'</div>',
										'<div class="am-list-item-part">',
											'<div class="am-list-content am-ft-gray">客服电话</div>',
											'<div class="am-list-extra"><a id="serverPhone"  data-spmv="a106.b2115.c4640.d7189" href="tel:'+data.custServiceTel+'">'+data.custServiceTel+'</a></div>',
										'</div>',
									'</div>',
									'<div class="am-list-item kd-order-item oneline sao-number" data-spmv="a106.b2115.c4640.d7333" style="background:linear-gradient(to bottom, #ddd, #ddd 33%, transparent 33%) no-repeat left top;background-size:100% 1px;text-align:center;padding: .04rem 0rem .045rem;margin:0 0.15rem;display:none;">',
									  '<div class="am-list-content"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/scan_icon.png" style="margin-right:.12rem;width: .19rem;height: .19rem;vertical-align: sub;" /><span style="font-size:.14rem;color:#108ee9;">扫描快递单查看物流信息</span></div>',
									'</div>',
									'<div class="am-list-item kd-order-item oneline wuliu" data-spmv="a106.b2115.c4640.d7334"  style="padding-top:0;padding-bottom:0;background:linear-gradient(to bottom, #ddd, #ddd 33%, transparent 33%) no-repeat left top;background-size:100% 1px;text-align:center;display:none;height: .4rem;line-height:1;margin:0 0.15rem;">',
									  '<div class="am-list-content"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/Logistics_infor_icon.png" style="margin-right:.12rem;width: .19rem;height: .19rem;vertical-align: sub;" /><span style="font-size:.14rem;color:#108ee9;">查看物流信息</span></div>',
									'</div>'
							].join('');
							$(".top-list").html(sHtml);
                 // 判断快递公司还是 快递平台
							 if(data.logisMerchantType =="3") {
										$(".merchantName").html("快递平台");
								 }
							 if(data.pickUpCode){
										  $(".pickUpCode").show();
											$(".pickUpCode").css("padding-top","0.04rem");
		  					}
                if(data.actCarrierName) {
									    $(".actCarrierName").show();
							   }
              clickStatus.bind($("#serverPhone"))();
							$("#serverPhone").click(function(){
								var phone = $(this).html();
								BizLog.call('info',{
										 spmId:"a106.b2115.c4640.d7189",
										 actionId:'clicked',
										 params:{
							 				OrderNO:orderNo,
											CompPhone:phone
							 			}
								 });
							})
							if(isAndroid){
									$(".borderTopddd").css("border-top","1px solid #ddd");
									// $(".kd-info-text").css("border-bottom","1px solid #ddd");
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
										'<div class="am-list-item extra-serves-data" style="padding-top:0.065rem">',
											'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">额外服务</div>',
											'<div class="am-ft-gray" style="font-size:.15rem;">'+addService+'</div>',
										'</div>',
										'<div style="margin-left: .15rem;"></div>',
										'<div class="am-list-item remark-data" style="padding: .07rem .15rem;padding-bottom:.065rem">',
											'<div class="am-list-content am-ft-gray" style="font-size:.15rem;white-space: normal;line-height: 19px;"><span id="remarksID" style="white-space:nowrap">备注：</span><span class="orderstatus_remarks am-ft-gray" style="color:#8a8a8a">'+remark+'<span></div>',
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
							// alert(data.payStatus);
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
									                    '<div class="lastpayStatus am-ft-black" style="font-size:.15rem;">'+pHtml+'</div>'+
								                 '</div>';
							}
							if(data.couponAmount!=null && data.couponAmount!=''&&data.payStatus=="3"&&data.couponAmount!=0){
				 				cHtml+='<div class="am-list-item youhui-coupon"  style="padding-bottom:0.065rem">'
				 						+'<div class="am-list-content am-ft-red" style="font-size:.15rem;">优惠劵</div>'
				 						+'<div class="am-ft-red" style="font-size:.15rem;">'+'-'+(data.couponAmount/100).toFixed(2)+'</div>'
				 					+'</div>';
				 			}
				     if(data.pricingMode == "1"&&data.payStatus=="3"&&data.orderAmount-data.payableAmount!= 0){
				 			  couponTemp +='<div class="am-list-item youhui-discount"  style="padding-bottom:0.065rem">'
				 					+'<div class="am-list-content am-ft-red" style="font-size:.15rem;">优惠折扣</div>'
				 					+'<div class="am-ft-red" style="font-size:.15rem;">'+'-'+((data.orderAmount-data.payableAmount)/100).toFixed(2)+'</div>'
				 				+'</div>'
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
										 couponTemp,
										 myDiscount,
										'<div class="am-list-item kuaidi-evaluate" style="padding-bottom:0.065rem;background-size: .0rem .01rem,.0rem .01rem,100% 0,100% .01rem;">',
											'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">预计快递费</div>',
											'<div class="am-ft-red data-kuaidi-evaluate" style="font-size:.15rem;">'+'约'+estimatePrice.toFixed(2)+'元'+'</div>',
										'</div>',
										  hasPayed,
										'<div class="am-list-footer footer-des" style="padding: .115rem .15rem;padding-top:.07rem;padding-bottom:.12rem;">',
											'<div class="am-ft-12">',
												'首重'+(data.presetWeightPrice)/100+'元，续重'+(data.extraWeightPrice)/100+'元<a class="am-ft-12 price_rule" data-spmv="a106.b2115.c4640.d7190" style="padding-left: .15rem;" >如何计算？</a>',
											'</div>',
											'<p style="margin-top:.31rem;color:#566b96;font-size:13px;text-align:center;"><span class="helpCenter" data-spmv="a106.b2115.c4640.d7191">帮助中心</span></p>',
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
							// timeoutStatus = "2";
							// alert("data.timeoutStatus "+data.timeoutStatus);
							console.log("data.timeoutstatus "+data.timeoutStatus);
						if(timeoutStatus=="2"){
							// if(isResume){ return; }
							BizLog.call('info',{
									 spmId:"a106.b2115.c4649",
									 actionId:'exposure',
									 params:{
										 OrderNO:orderNo,
								 }
							 });
							 $("body").on('touchmove', function (event) {
											event.preventDefault();
							}, false);
							refreshFlag = false;
							$(".dialog-kuaidi").show();
							//初始化tips弹窗一次
						};

						$(".price_rule").click(function(){
							BizLog.call('info',{
									 spmId:"a106.b2115.c4640.d7190",
									 actionId:'clicked',
									 params:{
										 OrderNO:orderNo,
								 }

							 });
							ant.pushWindow({
								url: "price-rule.html"
							});
						});
						$(".single_btn").click(function(){
							BizLog.call('info',{
						       spmId:"a106.b2115.c4640.d7332",
						       actionId:'clicked',
									 params:{
										 OrderNO:orderNo,
								 }

						   });
							console.log("data.pricingMode"+data.pricingMode );
							isManualPrice = data.isManualPrice;
							// 弹窗弹起，阻止背景滚动
							$("body").on('touchmove', function (event) {
								event.preventDefault();
						 }, false);
						   refreshFlag = false;
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
								$(".payment_btn").html("支付"+"<span style='width:7px;display: inline-block;margin-left:0.05rem'></span>"+$(".data-pay-show").text()+"元");
							}
						});


						$("#btn-kuaidi-sumbit").unbind();    // 解除 跟换的绑定
						$("#btn-kuaidi-sumbit").on("touchstart",function(){
							BizLog.call('info',{
									 spmId:"a106.b2115.c4649.d7229",
									 actionId:'clicked',
									 params:{
						 				  OrderNO:orderNo,
						 			}
							 });
							  timeoutStatus = "3";
							//更换快递公司接口
							$("body").off("touchmove");
 						 refreshFlag = true;
							$(".dialog-kuaidi").hide();
							agreeChange(orderId);
						});
						$("#btn-kuaidi-cancel").on("touchstart",function(){
							BizLog.call('info',{
									spmId:"a106.b2115.c4649.d7228",
									actionId:'clicked',
									params:{
			 		 				  OrderNO:orderNo,
			 		 			}
							});
							   timeoutStatus = "3";
								 $("body").off("touchmove");
								 refreshFlag = true;
						  	$(".dialog-kuaidi").hide();
									updChangeExpress(orderId);
							  //状态改换为 3 表示是超时后状态
						});
					  $("#btn-ok").unbind();
						//订单取消 tips确定
						$("#btn-ok").on("click",function(){
							BizLog.call('info',{
									 spmId:"a106.b2115.c4643.d7212",
									 actionId:'clicked',
									 params:{
											OrderNO:orderNo,
									}
							 });
							cancelFlag = true;
							if($(this).hasClass("disabled")){return;};
							var cancelnum1 = $("#count-data").val(),cancelnum2 = $("#count-cancelCntLimit").val();
							var warnNum = JSON.parse(cancelnum1)+1;
							 $(".dialog-warning").find(".am-dialog-brief").html("您当日已取消"+warnNum+"次，若再次取消，将被限制下单操作");

                      console.log("click #btn-ok");
							 if($(".extra_service .am-flexbox-item").hasClass("express_active")){
								 var odCancelReason = $(".extra_service").find(".express_active").text();
								   $(".dialog_cancel").hide();

									 ant.showLoading();
								   confirmCancel(orderId,odCancelReason,cancelnum1,cancelnum2);
							 }
						});
						//催一催
						$(".reminder_btn").click(function(){
							BizLog.call('info',{
									 spmId:"a106.b2115.c4640.d7192",
									 actionId:'clicked',
									 params:{
										 OrderNO:orderNo,
								 }
							 });
							if($(".reminder_btn").hasClass("disabled_btn")){
								return;
							}else{
								ant.showLoading();
								urgeInfo(orderId);
							}
						});
						//投诉tips
						$(".complaint_btn").click(function(e){
							BizLog.call('info',{
									spmId:"a106.b2115.c4640.d7193",
									actionId:'clicked',
									params:{
										 OrderNO:orderNo,
								 }
							});
							e.preventDefault();
							if($(".complaint_btn").hasClass("disabled_btn")||$(".complaint_btn").hasClass("disabled_btn2")){
								return;
							}else{
								$("body").on('touchmove', function (event) {
											 event.preventDefault();
							 }, false);
							 refreshFlag = false;
								$(".dialog-complain").show();
							}
						});
						// 查看物流信息
						$(".wuliu").click(function(){
							BizLog.call('info',{
									spmId:"a106.b2115.c4640.d7334",
									actionId:'clicked',
									params:{
										 OrderNO:orderNo
								 }
							});
							var logisticsCode = merchantCode;
							if(actCarrierCode) { logisticsCode = actCarrierCode}
							ant.startApp({
									appId: '20000754',
									param: {
										url: '/app/src/expressDetail.html?logisticsNo='+waybillNo+'&logisticsCode='+logisticsCode+'&from=SendEXClient',
										startMultApp: 'YES',
										appClearTop: false
									},
									appClearTop: false,
									closeCurrentApp: false
								});
								//  ant.pushWindow({
								// 	url:'alipays://platformapi/startapp?appId=20000754&url=' + encodeURIComponent('/app/src/expressDetail.html?logisticsNo='+waybillNo+'&logisticsCode='+logisticsCode+'&from=SendEXClient')
								// });
						})
						//帮助中心点击
						$(".helpCenter").click(function(){
							BizLog.call('info',{
									 spmId:"a106.b2115.c4640.d7191",
									 actionId:'clicked',
									 params:{
										 OrderNO:orderNo,
								 }
							 });
							pushWindow("alipays://platformapi/startapp?appId=20000691&url=%2Fwww%2Fsrc%2Findex.html%3Fscene%3Dapp_jijianpingtai%23%2FhallIndex",true);

						})
						//扫一扫
						$(".sao-number").click(function(){
							BizLog.call('info',{
									spmId:"a106.b2115.c4640.d7333",
									actionId:'clicked',
									params:{
										 OrderNO:orderNo
								 }
							});
							ant.scan({
								type: 'bar'
							  }, function (result) {
									// BizLog.call('info',{
									// 		 spmId:"a106.b17.c01.d01",
									// 		 actionId:'openPage'
									//  });
								  var barCode = JSON.parse(JSON.stringify(result.barCode));
								  $(".data-orderId").val(orderId);
								  $(".dialog-saosao").show();
									$(".saosao-desc").html(barCode);
									// if(window.confirm("快递单号: "+barCode)){
									// 	   alert(orderId)
									//      $(".dialog-saosao").hide();
									// 	   saosaoInfo(orderId,barCode);
									// 		 return false;
									// }
							});
						});
						//支付弹框，只要系统发起支付产生了账单，每次加载详情页就弹出蒙层及支付弹框
						if(data.payStatus == "1" && data.pricingMode == "1"&&data.orderStatus!="4"){
							 $(".single_btn").click();
						}
						// 这里的是从限制下单提示后出现的
						if(payways3){
							  $(".single_btn").click();
						}else{
							//  判断 限制下单的窗口
							// setTimeout(function(){ notPaidOrder(data.notPaidOrderNo,data.notPaidRemindCnt)},300);
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
           if(refreshcb){refreshcb()};
					hideLoading();
					// if(isAndroid){
					// 	$(".am-notice-content").html('<marquee behavior="scroll" align="absmiddle" scrollamount="3" class="noticeval">快递员取件后，系统会自动提示您支付费用，无需现金</marquee>');
					// }else{
						$(".noticeval").html("费用以快递员当面确认为准，快递员录入信息后，支付宝会生成账单提示支付，不支持现金及扫码支付～");
						var marqueeWidth = $(".am-notice-content").width() - parseFloat($(".am-notice-content").css("padding-left"));
					 var marqueeContentWidth = marqueeWidth+$(".noticeval").width() -15;
						$("#kong").width(marqueeWidth);
						$("#outcontent").width(marqueeContentWidth);
					// }

				}
			},function(data){
				 if(data.meta.code=="0310"){
				    var htmlTemp = '<div class="am-page-result" role="alert">'+
					                     '<div class="am-page-result-wrap">'+
					                          '<div class="am-page-result-pic am-icon page-nofound" aria-hidden="true"></div>'+
					                          '<div class="am-page-result-title">订单不存在</div>'+
					                     '</div>'+
				                 	'</div>'
					$(document.body).html(htmlTemp);
					hideLoading();
				}else{
					hideLoading();
					toast({
								text: "加载出错，请重试",
								type: 'exception'
						 });
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

            $("#dialog-show .am-flexbox-item").each(function(){
							var sendid = "a106.b2115.c4643.";
							if($(this).text()=="不想寄了"){
										 sendid +="d7213";
							}else if($(this).text()=="信息填错了"){
											sendid +="d7214";
							}else if($(this).text()=="上门速度慢"){
											sendid +="d7215";
							}else if($(this).text()=="未上门取件"){
											sendid +="d7216";
							}else if($(this).text()=="服务态度差"){
											sendid +="d7217";
							}else if($(this).text()=="快递费用高"){
											sendid +="d7218";
							}
							 $(this).attr("data-spmv",sendid)
						});


						//点击切换样式
						$("#dialog-show .am-flexbox-item").on("click",function(){
							var sendid = "a106.b2115.c4643.";
							var titleInfo = '';
							if($(this).text()=="不想寄了"){
								     sendid +="d7213";
										 titleInfo = "不想寄了";
							}else if($(this).text()=="信息填错了"){
											sendid +="d7214";
											titleInfo = "信息填错了";
							}else if($(this).text()=="上门速度慢"){
											sendid +="d7215";
											titleInfo = "上门速度慢";
							}else if($(this).text()=="未上门取件"){
											sendid +="d7216";
											titleInfo = "未上门取件";
							}else if($(this).text()=="服务态度差"){
											sendid +="d7217";
											titleInfo = "服务态度差";
							}else if($(this).text()=="快递费用高"){
											sendid +="d7218";
											titleInfo = "快递费用高";
							}
							BizLog.call('info',{
				           spmId:sendid,
				           actionId:'clicked',
									 params:{
		 	 		 				  OrderNO:orderNo,
		 								title:titleInfo
		 	 		 			}

				       });

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
										$("#dialog-show").find(".msg").html("您当日已取消"+cancelCount+"单，若再次取消，将被限制下单操作");
									}
							}
							$(".dialog_cancel").show();
							$("body").on('touchmove', function (event) {
										 event.preventDefault();
						 }, false);
						 refreshFlag = false;

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
				// alert("调用了取消订单接口！")
				if(!isNetworkAvailable){
					$("body").off("touchmove");
					refreshFlag = true;
					ant.hideLoading();
				}
    		var xhrurl = jUrl+'/ep/order/cancel/confirm';
    		$.axs(xhrurl, info, function(data) {
    			if (data.meta.success) {
				     	console.log(data.meta.msg);
							$("body").off("touchmove");
							refreshFlag = true;
              ant.hideLoading();
							// cancelFlag =false;

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
									BizLog.call('info',{
											 spmId:"a106.b2115.c4651",
											 actionId:'exposure',
											 params:{
												 OrderNO:orderNo,
										   }
									 });

										$(".dialog-num").show();

							}
					}
    			}
    		},function(d){
					$("body").off("touchmove");
					refreshFlag = true;
					ant.hideLoading();
					 if(d.meta.code=="0214"){
						  toast({
							  	 text: "订单已取件,不能取消"
						  })
					 }else if(d.meta.code == "0215"){
							 toast({
									text: "订单已取消"
							 })
							window.location.reload();
					 }else{
						 toast({
								 text: d.meta.msg,
						 })
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
						     alert("EMS服务暂未覆盖，建议取消订单");
			          // toast({
			          //     text: "EMS无法服务，建议取消订单",
			          //     type: 'exception'
			          //  });
			       }else if(d.meta.code=="0911" || d.meta.code=="0910" ){
                    if(window.confirm('更换失败，点击确定重试')){
                           agreeChange(orderId);
										}
							}else if(d.meta.code=="0914"){
								   alert("更换成功，EMS将为你服务");
									 window.location.reload();
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
			$(".order-wait-desc").text("下单成功，待快递公司接单");
			$(".order-wait-desc").css({"color":"#ff5b05"});
			$(".yuji-time").show();
     if(data.pricingMode !="1"){
         $(".order-notice").hide();
			 }
			//$(".extra-serves-data").hide();
			//$(".remark-data").hide();
			$(".data-person-list").hide();
			$(".extra-list").html(merHtml);


			$(".express_distance").css("padding-bottom","0");
		}
		//待取件
		function showOrderState2(data,merHtml){
      $(".express_distance").css("padding-bottom",".88rem");
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
				$(".order-notice").hide();
				vHtml+='<div class="am-button-wrap am-fixed-bottom" style="padding-top:.055rem">'
						+'<div class="am-ft-center am-ft-12 am-ft-gray single_top" data-pricingMode='+data.pricingMode+' data-isManualPrice='+data.isManualPrice+' style="padding-bottom: 0.08rem;padding-top:0.005rem;color:#ccc;font-size:.14rem">请在快递员上门称重后支付，不要提前支付哟~</div>'
						+'<a class="am-button single_btn" data-spmv="a106.b2115.c4640.d7332" style="vertical-align:center;" data-pricingMode='+data.pricingMode+' data-isManualPrice='+data.isManualPrice+'>与快递员核对完成，去支付</a>'
					+'</div>';
			}else if(data.pricingMode =="1"){
				//系统发起支付方式3
				$(".order-notice").show();
				// var marqueeWidth = $(".am-notice-content").width() - parseFloat($(".am-notice-content").css("padding-left"));
				// alert($(".am-notice-content").width());
				// alert($(".am-notice-content").css("padding-left"))
				// var marqueeContentWidth = marqueeWidth+$(".noticeval").width() -15;
				//  $("#kong").width(marqueeWidth);
				//  $("#outcontent").width(marqueeContentWidth);
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
				 var courierHeader = data.courierHeardUrl;
				 if(typeof courierHeader == "undefined" || courierHeader == ""){
					  courierHeader ="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/courier_head_icon.png";
				 }
				xHtmlOrderImg ='<div class="am-list-thumb" style="margin-right: .12rem;"><img src="'+courierHeader+'" style="width:.5rem;height:.5rem;" /></div>';
				xHtmlOrderInfo = '<div class="am-list-title" style="font-size:.15rem;"><span  style="vertical-align:super;margin-bottom:2px;"  class="bizlogCourierName">'+data.courierName+'</span><span style="padding-left:.15rem;vertical-align:super;margin-bottom:2px;" class="bizlogCourierMobile">'+data.courierMobile+'</span></div>';
				xHtmlOrderTel = '<div data-spmv="a106.b2115.c4640.d7194" class="am-list-extra bizlogCourierPhone" style="overflow:visible;min-width: .36rem;width:.36rem;-webkit-box-flex: 0;-webkit-flex: 0;margin-top: .08rem;"style="min-width: .36rem;width:.36rem;-webkit-box-flex: 0;-webkit-flex: 0;margin-top: .07rem;"><a  href="tel:'+data.courierMobile+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/phone_icon.png" style="width:.36rem;height:.36rem;" /></a></div>';
			}else{
				//https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/courier_head_icon.png
				// http://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/station_head_icon.png
				xHtmlOrderImg ='<div class="am-list-thumb" style="margin-right: .12rem;"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/station_head_icon.png" style="width:.5rem;height:.5rem;" /></div>';
				xHtmlOrderInfo = '<div class="am-list-title" style="font-size:.15rem;"><span>'+data.siteName+'</span><span style="padding-left:.15rem;">'+data.managerMobile+'</span></div>';
				xHtmlOrderTel = '<div class="am-list-extra " style="overflow:visible;min-width: .36rem;width:.36rem;-webkit-box-flex: 0;-webkit-flex: 0;margin-top: .08rem;"><a  href="tel:'+data.managerMobile+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/phone_icon.png" style="width:.36rem;height:.36rem;" /></a></div>';
			}
			if(data.remindStatus!=null && data.remindStatus ==1){
				xHtmlPushInfo='<span class="reminder_btn disabled_btn" data-spmv="a106.b2115.c4640.d7192">已催单</span>';
			}else{
				xHtmlPushInfo='<span class="reminder_btn" data-spmv="a106.b2115.c4640.d7192">催一催</span>';
			}
			// 如果 data.managerMobile  不是 手机号  或者为空，或者空格 ，就没有催一催
			 console.log("data.managerMobile: "+data.managerMobile||data.courierMobile);
			if(!isCorrectPhoneNum(data.managerMobile||data.courierMobile)){
          xHtmlPushInfo='';
			}
			xHtml+='<div class="am-list-item" style="padding-top:.13rem;padding-bottom:.155rem;padding-right: .23rem;">'
						+xHtmlOrderImg
						+'<div class="am-list-content address_listwhere">'
							+xHtmlOrderInfo
							+'<div class="am-list-brief" style="overflow:visible;height:.26rem;line-height:.26rem;">'
								+xHtmlPushInfo
								+'<span class="complaint_btn" data-spmv="a106.b2115.c4640.d7193">投诉</span>'
							+'</div>'
						+'</div>'
						+xHtmlOrderTel
					+'</div>';
			$(".data-person").html(xHtml);
			$(".extra-list").html(merHtml);
			if(complainStatus == "1"){
				$(".complaint_btn").html("已投诉");
				// alert("已投诉");
				$(".complaint_btn").addClass("disabled_btn2");
				  // $(".complaint_btn").addClass("disabled_btn");
			}
			$(".bizlogCourierPhone").click(function(){
				var courierName =  $(".bizlogCourierName").html();
				var courierPhone = $(".bizlogCourierMobile").html();
						 BizLog.call('info',{
			            spmId:"a106.b2115.c4640.d7194",
			            actionId:'clicked',
									params:{
										 OrderNO:orderNo,
										 CourierName:courierName,
										 CourierPhone:courierPhone
								 }
			        });
			})
		}
		//已取件
		function showOrderState3(data,oHtml){
			$(".data-person-list").show();
			console.log("已取件 data.payStatus " + data.payStatus);
			 $(".express_distance").css("padding-bottom",".88rem");
			$("#cancleOrder").hide();
			if(data.payStatus=="1"){
          		$(".order-wait-desc").text("快递员已取件，待支付");
								$(".order-wait-desc").css({"color":"#ff5b05"});
			}else if(data.payStatus=="3" || data.payStatus=="5"){
          		$(".order-wait-desc").text("快递员已取件，支付完成");
							$(".order-wait-desc").css({"color":"#42ae55"});
			}else{
					  $(".order-wait-desc").text("快递员已取件");
						$(".order-wait-desc").css({"color":"#ff5b05"});
			}
			// $(".order-wait-desc").css({"color":"#ff5b05"});
			$(".yuji-time").hide();
			$(".pickUpCode").hide();
			$(".pickUpCode").css("padding-top","0");
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

			// $(".data-person-list").hide();
			var oHtml2='',oPayHtml2='',vHtml='',cHtml='',coupon='' ;
			var   tempOrderAmount = data.orderAmount/100;
			var presetWeightList='<div class="am-ft-12">'
					+'首重'+(data.presetWeightPrice)/100+'元，续重'+(data.extraWeightPrice)/100+'元<a class="am-ft-12 price_rule" data-spmv="a106.b2115.c4640.d7190" style="padding-left: .15rem;" >如何计算？</a>'
				+'</div>'
				+'<p style="margin-top:.31rem;color:#566b96;font-size:13px;text-align:center"><span class="helpCenter" data-spmv="a106.b2115.c4640.d7191">帮助中心</span></p>';
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

				// 针对菜鸟新需求
				if(data.payStatus=="1"){
					if(data.isPushBill == "false"){
						// 已取件 未回传账单时 显示预估价
						  tempOrderAmount = data.estimatePrice/100;
							$(".order-wait-desc").text("快递员已取件，账单生成中");
							$(".order-wait-desc").css({"color":"#ff5b05"});
					}else {
						$(".order-wait-desc").text("快递员已取件，待支付");
						$(".order-wait-desc").css({"color":"#ff5b05"});
					vHtml+='<div class="am-button-wrap">'
							+'<div class="am-ft-center am-ft-12 am-ft-red single_top" data-pricingMode='+data.pricingMode+' style="padding-bottom: 0.1rem;">请于24小时内完成支付，以免影响物品派送~</div>'
							+'<a class="am-button single_btn" data-spmv="a106.b2115.c4640.d7332" data-pricingMode='+data.pricingMode+'>立即支付 <span class="data-money">'+(data.payableAmount/100).toFixed(2)+'</span> 元</a>'
						+'</div>';
					}
				}
				if(data.payStatus=="5") {
					if(data.isPushBill == "false"){
						// 未回传账单 显示预计快递费
						 tempOrderAmount = data.estimatePrice/100;
					}
				}
			}else{
				$(".order-notice").hide();
				vHtml+='<div class="am-button-wrap am-fixed-bottom" style="padding-top:.055rem">'
						+'<div class="am-ft-center am-ft-12 am-ft-gray single_top" data-pricingMode='+data.pricingMode+' data-isManualPrice='+data.isManualPrice+' style="padding-bottom: 0.08rem;padding-top:0.005rem;color:#ccc;font-size:.14rem">请在快递员上门称重后支付，不要提前支付哟~</div>'
						+'<a class="am-button single_btn" data-spmv="a106.b2115.c4640.d7332" style="vertical-align:center;" data-pricingMode='+data.pricingMode+' data-isManualPrice='+data.isManualPrice+'>与快递员核对完成，去支付</a>'
					+'</div>';
			}

			if(data.payStatus=="1"){
			  	oPayHtml2+='<div class="am-list-content am-ft-gray" style="font-size:.15rem;">支付状态</div><div class="lastpayStatus am-ft-black" style="font-size:.15rem;">待支付</div>';

				//未支付状态，显示支付按钮
				if(vHtml==''){
					// $(".show-order-submit").hide();
				  $(".express_distance").css("padding-bottom","0");
				}else{
					   $(".show-order-submit").html(vHtml);
             $(".express_distance").css("padding-bottom",".88rem");
					 }

			}else if(data.payStatus=="3"){
				$("#cancleOrder").hide();
				console.log("receiptAmount 已取件"+parseFloat(data.receiptAmount).toFixed(2));
				$(".order-notice").hide();
			  oPayHtml2+='<div class="am-list-content am-ft-black" style="font-size:.15rem;">已支付</div><div class="am-ft-black" style="font-size:.15rem;">'+(parseFloat(data.receiptAmount)/100).toFixed(2)+'元<span id="payResult"></span></div>';
				presetWeightList='<p style="margin-top:.31rem;color:#566b96;font-size:13px;text-align:center"><span class="helpCenter" data-spmv="a106.b2115.c4640.d7191">帮助中心</span></p>';
			}else if(data.payStatus=="4") {
			  oPayHtml2+='<div class="am-list-content am-ft-gray" style="font-size:.15rem;">支付状态</div><div class="lastpayStatus am-ft-black" style="font-size:.15rem;">支付失败</div>';
			}else if(data.payStatus =="5"){
					$("#cancleOrder").hide();
					// console.log("receiptAmount 已取件"+parseFloat(data.receiptAmount).toFixed(2));
					$(".order-notice").hide();
					oHtml ='<div class="am-ft-gray" style="font-size:.15rem;">其它</div>';
					oPayHtml2+='<div class="am-list-content am-ft-gray" style="font-size:.15rem;">支付状态</div><div class="lastpayStatus am-ft-black" style="font-size:.15rem;">已支付</div>';
					// oPayHtml2+='<div class="am-list-content am-ft-black" style="font-size:.15rem;">已支付</div><div class="am-ft-black" style="font-size:.15rem;">'+(parseFloat(data.receiptAmount)/100).toFixed(2)+'元<span id="payResult"></span></div>';
					presetWeightList='<p style="margin-top:.31rem;color:#566b96;font-size:13px;text-align:center"><span class="helpCenter" data-spmv="a106.b2115.c4640.d7191">帮助中心</span></p>';

			}else{
				 oPayHtml2+='<div class="am-list-content am-ft-gray" style="font-size:.15rem;">支付状态</div><div class="lastpayStatus am-ft-black" style="font-size:.15rem;">支付中</div>';
			}
			if(data.couponAmount!=null && data.couponAmount!=''&&data.payStatus=="3"&&data.couponAmount!=0){
				cHtml+='<div class="am-list-item youhui-coupon"  style="padding-bottom:0.065rem">'
						+'<div class="am-list-content am-ft-red" style="font-size:.15rem;">优惠劵</div>'
						+'<div class="am-ft-red" style="font-size:.15rem;">'+'-'+(data.couponAmount/100).toFixed(2)+'</div>'
					+'</div>';
			}
    if(data.pricingMode == "1"&&data.payStatus=="3"&&(data.orderAmount-data.payableAmount)!= 0){
			  coupon +='<div class="am-list-item youhui-discount"  style="padding-bottom:0.065rem">'
					+'<div class="am-list-content am-ft-red" style="font-size:.15rem;">优惠折扣</div>'
					+'<div class="am-ft-red" style="font-size:.15rem;">'+'-'+((data.orderAmount-data.payableAmount)/100).toFixed(2)+'</div>'
				+'</div>'
		}

			oHtml2+='<div class="am-list-item">'
						+'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">支付方式</div>'
						+oHtml
					+'</div>'
					+'<div class="am-list-item" style="padding-bottom:0.065rem">'
						+'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">物品重量</div>'
						+'<div class="am-ft-gray" style="font-size:.15rem;"><span class="data-weight">'+data.goodsWeight/1000+'</span><span style="padding-left:.06rem">公斤</span></div>'
						+'<input type="hidden" class="data-presetWeight" value='+data.presetWeight+' />'
						+'<input type="hidden" class="data-presetWeightPrice" value='+data.presetWeightPrice+' />'
						+'<input type="hidden" class="data-extraWeightUnit" value='+data.extraWeightUnit+' />'
						+'<input type="hidden" class="data-extraWeightPrice" value='+data.extraWeightPrice+' />'
					+'</div>'
					+'<div class="am-list-item kuaidi-ok"  style="padding-bottom:0.065rem">'
						+'<div class="am-list-content am-ft-gray" style="font-size:.15rem;">快递费</div>'
						+'<div class="am-ft-gray" style="font-size:.15rem;">'+tempOrderAmount.toFixed(2)+'元'+'</div>'
					+'</div>'
					+coupon
					+cHtml
					+'<div class="am-list-item paid" style="padding-bottom:0.065rem">'
						+oPayHtml2
					+'</div>';

			$(".extra-list").html(oHtml2);
			$(".footer-des").html(presetWeightList);
			$(".footer-des").css({"padding-top":"0.07rem;","padding-bottom":".115rem"});


			//已取件状态下的 快递员或站点信息展示
			var xHtmlInfo='',xHtmlPushInfo='',xHtmlOrderImg='',xHtmlOrderInfo='',xHtmlOrderTel='',xhtmlPerson='';
			if(data.accepterType =="1"){
				 var courierHeader = data.courierHeardUrl;
				 if(typeof courierHeader == "undefined" || courierHeader == ""){
					  courierHeader ="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/courier_head_icon.png";
				 }
				xHtmlOrderImg ='<div class="am-list-thumb" style="margin-right: .12rem;"><img src="'+courierHeader+'" style="width:.5rem;height:.5rem;" /></div>';
				xHtmlOrderInfo = '<div class="am-list-title" style="font-size:.15rem;"><span  style="vertical-align:super;margin-bottom:2px;"  class="bizlogCourierName">'+data.courierName+'</span><span style="padding-left:.15rem;vertical-align:super;margin-bottom:2px;" class="bizlogCourierMobile">'+data.courierMobile+'</span></div>';
				xHtmlOrderTel = '<div data-spmv="a106.b2115.c4640.d7194" class="am-list-extra bizlogCourierPhone" style="overflow:visible;min-width: .36rem;width:.36rem;-webkit-box-flex: 0;-webkit-flex: 0;margin-top: .08rem;"style="min-width: .36rem;width:.36rem;-webkit-box-flex: 0;-webkit-flex: 0;margin-top: .07rem;"><a  href="tel:'+data.courierMobile+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/phone_icon.png" style="width:.36rem;height:.36rem;" /></a></div>';
			}else{
				//https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/courier_head_icon.png
				// http://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/station_head_icon.png
				xHtmlOrderImg ='<div class="am-list-thumb" style="margin-right: .12rem;"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/station_head_icon.png" style="width:.5rem;height:.5rem;" /></div>';
				xHtmlOrderInfo = '<div class="am-list-title" style="font-size:.15rem;"><span>'+data.siteName+'</span><span style="padding-left:.15rem;">'+data.managerMobile+'</span></div>';
				xHtmlOrderTel = '<div class="am-list-extra " style="overflow:visible;min-width: .36rem;width:.36rem;-webkit-box-flex: 0;-webkit-flex: 0;margin-top: .08rem;"><a  href="tel:'+data.managerMobile+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/phone_icon.png" style="width:.36rem;height:.36rem;" /></a></div>';
			}
			// if(data.remindStatus!=null && data.remindStatus ==1){
			// 	xHtmlPushInfo='<span class="reminder_btn disabled_btn" data-spmv="a106.b2115.c4640.d7192">已催单</span>';
			// }else{
			// 	xHtmlPushInfo='<span class="reminder_btn" data-spmv="a106.b2115.c4640.d7192">催一催</span>';
			// }
			// 如果 data.managerMobile  不是 手机号  或者为空，或者空格 ，就没有催一催
		// 	 console.log("data.managerMobile: "+data.managerMobile||data.courierMobile);
		// 	if(!isCorrectPhoneNum(data.managerMobile||data.courierMobile)){
        //   xHtmlPushInfo='';
		// 	}
			xhtmlPerson+='<div class="am-list-item" style="padding-top:.13rem;padding-bottom:.155rem;padding-right: .23rem;">'
						+xHtmlOrderImg
						+'<div class="am-list-content address_listwhere">'
							+xHtmlOrderInfo
							+'<div class="am-list-brief" style="overflow:visible;height:.26rem;line-height:.26rem;">'
								// +xHtmlPushInfo
								+'<span class="complaint_btn" data-spmv="a106.b2115.c4640.d7193">投诉</span>'
							+'</div>'
						+'</div>'
						+xHtmlOrderTel
					+'</div>';

			// if(data.payStatus=="3"){
			// 	xhtmlPerson+='<div class="am-list-item" style="padding-top:.13rem;padding-bottom:.155rem;padding-right: .23rem;">'
			// 			+xHtmlOrderImg
			// 			+'<div class="am-list-content address_listwhere">'
			// 				+ xHtmlOrderInfo
			// 			+'</div>'
			// 			+xHtmlOrderTel
			// 		+'</div>';
			// }

			$(".data-person").html(xhtmlPerson);
			// $(".extra-list").html(merHtml);
			if(complainStatus == "1"){
				$(".complaint_btn").html("已投诉");
				// alert("已投诉");
				$(".complaint_btn").addClass("disabled_btn2");
				  // $(".complaint_btn").addClass("disabled_btn");
			}

			$(".bizlogCourierPhone").click(function(){
				var courierName =  $(".bizlogCourierName").html();
				var courierPhone = $(".bizlogCourierMobile").html();
						 BizLog.call('info',{
			            spmId:"a106.b2115.c4640.d7194",
			            actionId:'clicked',
									params:{
										 OrderNO:orderNo,
										 CourierName:courierName,
										 CourierPhone:courierPhone
								 }
			        });
			})
		}
		//已取消
		function showOrderState4(data,merHtml){

			$(".order-wait-desc").css({"color":"grey"});
			$(".order-wait-desc").text("已取消");
			$(".order-wait-desc").addClass("am-ft-gray");
			$(".footer-des").html("");
			$(".footer-des").hide();
			$(".extra-list").html(merHtml);
			$(".yuji-time").show();
			 $(".pickUpCode").hide();
			 $(".pickUpCode").css("padding-top","0");
			$(".show-order-submit").hide();
			$(".order-notice").hide();
			//$(".extra-serves-data").show();
			//$(".remark-data").show();
			$(".data-person-list").show();
			$("#cancleOrder").hide();
				$(".express_distance").css("padding-bottom","0");
	 		console.log(defriendFlag);
			 if(defriendFlag){
			 }


			 //已取消状态下的 快递员或站点信息展示
			var xHtmlInfo='',xHtmlPushInfo='',xHtmlOrderImg='',xHtmlOrderInfo='',xHtmlOrderTel='',xhtmlPerson='';
			if(data.accepterType =="1"){
				 var courierHeader = data.courierHeardUrl;
				 if(typeof courierHeader == "undefined" || courierHeader == ""){
					  courierHeader ="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/courier_head_icon.png";
				 }
				xHtmlOrderImg ='<div class="am-list-thumb" style="margin-right: .12rem;"><img src="'+courierHeader+'" style="width:.5rem;height:.5rem;" /></div>';
				xHtmlOrderInfo = '<div class="am-list-title" style="font-size:.15rem;"><span  style="vertical-align:super;margin-bottom:2px;"  class="bizlogCourierName">'+data.courierName+'</span><span style="padding-left:.15rem;vertical-align:super;margin-bottom:2px;" class="bizlogCourierMobile">'+data.courierMobile+'</span></div>';
				xHtmlOrderTel = '<div data-spmv="a106.b2115.c4640.d7194" class="am-list-extra bizlogCourierPhone" style="overflow:visible;min-width: .36rem;width:.36rem;-webkit-box-flex: 0;-webkit-flex: 0;margin-top: .08rem;"style="min-width: .36rem;width:.36rem;-webkit-box-flex: 0;-webkit-flex: 0;margin-top: .07rem;"><a  href="tel:'+data.courierMobile+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/phone_icon.png" style="width:.36rem;height:.36rem;" /></a></div>';
			}else{
				//https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/courier_head_icon.png
				// http://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/station_head_icon.png
				xHtmlOrderImg ='<div class="am-list-thumb" style="margin-right: .12rem;"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/station_head_icon.png" style="width:.5rem;height:.5rem;" /></div>';
				xHtmlOrderInfo = '<div class="am-list-title" style="font-size:.15rem;"><span>'+data.siteName+'</span><span style="padding-left:.15rem;">'+data.managerMobile+'</span></div>';
				xHtmlOrderTel = '<div class="am-list-extra " style="overflow:visible;min-width: .36rem;width:.36rem;-webkit-box-flex: 0;-webkit-flex: 0;margin-top: .08rem;"><a  href="tel:'+data.managerMobile+'"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/phone_icon.png" style="width:.36rem;height:.36rem;" /></a></div>';
			}
			// if(data.remindStatus!=null && data.remindStatus ==1){
			// 	xHtmlPushInfo='<span class="reminder_btn disabled_btn" data-spmv="a106.b2115.c4640.d7192">已催单</span>';
			// }else{
			// 	xHtmlPushInfo='<span class="reminder_btn" data-spmv="a106.b2115.c4640.d7192">催一催</span>';
			// }
			// 如果 data.managerMobile  不是 手机号  或者为空，或者空格 ，就没有催一催

		// 	 console.log("data.managerMobile: "+data.managerMobile||data.courierMobile);
		// 	if(!isCorrectPhoneNum(data.managerMobile||data.courierMobile)){
        //   xHtmlPushInfo='';
		// 	}
			xhtmlPerson+='<div class="am-list-item" style="padding-top:.13rem;padding-bottom:.155rem;padding-right: .23rem;">'
							+xHtmlOrderImg
							+'<div class="am-list-content address_listwhere">'
								+xHtmlOrderInfo
								+'<div class="am-list-brief" style="overflow:visible;height:.26rem;line-height:.26rem;">'
									+'<span class="complaint_btn" data-spmv="a106.b2115.c4640.d7193">投诉</span>'
								+'</div>'
							+'</div>'
							+xHtmlOrderTel
						+'</div>';
			if( data.managerMobile||data.courierMobile){}else{
			       	xhtmlPerson='';
			}

			$(".data-person").html(xhtmlPerson);
			// $(".extra-list").html(merHtml);
			if(complainStatus == "1"){
				$(".complaint_btn").html("已投诉");
				// alert("已投诉");
				$(".complaint_btn").addClass("disabled_btn2");
				  // $(".complaint_btn").addClass("disabled_btn");
			}
			if(data.payStatus=="1"){
				$(".lastpayStatus").html("未支付");
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
						ant.hideLoading();
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
						 $("body").off("touchmove");
						 refreshFlag = true;
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
								refreshFlag = true;
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

								// <span style='width:2px;display: inline-block;'></span>
						$(".payment_btn").html("支付"+"<span style='width:2px;display: inline-block;margin-left:.05rem'></span>"+parseFloat(temppayAmount).toFixed(2)+"元");
						}
							 console.log(JSON.stringify(result))
						});
					}else{
						toast({
							text: data.meta.code,
							type: 'exception'
						});
					}
    		},function(data){
					    //  cleanPayFlag = false;

						// 	 $(".payment_btn").removeClass("loading");
 					// 	// 	$(".payment_btn").removeClass("disabled");
            //    var temppayAmount;
 					// 		if(payAmount == null || !payAmount){
            //          temppayAmount = $(".data-pay-show").text();
 					// 			}else{
            //             temppayAmount =  payAmount/100;
 					// 			}
						//
 					// 			// <span style='width:2px;display: inline-block;'></span>
 					// 	$(".payment_btn").html("支付"+"<span style='width:2px;display: inline-block;margin-left:.05rem'></span>"+parseFloat(temppayAmount).toFixed(2)+"元");
					    if(data.meta.code=="0513"){
								toast({
								 text: "订单已取消",
								 type: 'exception'
							 });
						 } else if(data.meta.code =="0515") {
							  alert("订单已支付过，无需重复支付");
						 }else{
							 toast({
								 text: data.meta.msg,
								 type: 'exception'
							 });
						 }
						 $("body").off("touchmove");
						 refreshFlag = true;
						$(".dialog_mask_pay").hide();
						$(".dialog_mask_pay_sys").hide();
						$(".dialog_mask").hide();

						window.location.reload();
				});
	    }
		//扫一扫
		function saosaoInfo(orderId,waybillNoT){
			var info = {
				"orderNo": orderNo,
				"orderId" : JSON.parse(orderId),
				"waybillNo" : waybillNoT
    		};

				//  ********************
    		var xhrurl = jUrl+'/ep/order/save_way_bill';
    		$.axs(xhrurl, info, function(data) {
					if(data.meta.success){
						 $(".waybillNo-type").show();
					   $(".wuliu").show();
						 $(".waybillNo-type .am-list-extra").html(waybillNoT);
					   $(".sao-number").hide();
						 waybillNo = waybillNoT;
					}
    		},function(data){
		     if(data.meta.code=="0611"){
						toast({
				  		text: "与已有单号重复，请扫描对应的真实运单~",
						});
					}else{
						toast({
						 text: "加载出错，请重试",
						 type: 'exception'
					 });
					}

				});
		}

});
