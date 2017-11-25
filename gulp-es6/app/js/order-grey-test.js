 showLoading();
Zepto(function ($) {
  BizLog.call('info',{
			 seedId:"a106.b12.c01.d01",
			 actionId:'openPage'
	 });
    FastClick.attach(document.body);

    var epCompanyName;
    var epCompanyId;
    var productTypeId;
    var epCompanyNo;
    var acceptOrderFrom;
    var acceptOrderTo;
    var snderDstrCode;
    var clickFlag = true;
    var rcvrDstrCode;
    var senderAddrID;   // 寄件人id
    var reciptiensAddrID;  // 收件人 id

    var productType;   // 新增的产品类型数组
    var presetWeight;          // 首重重量  默认是数组中的第一个
    var presetWeightPricePec; //首重价格 默认是数组中的第一个
    var extraWeightUnitPec; //续重单位  默认是数组中的第一个
    var extraWeightPricePec; //续重价格  默认是数组中的第一个
    var description;   // 产品类型   默认是数组中的第一个
    var goodsMaxWeight;   // 选择重量的最大值
    var goodsWeightTypes = []; // 选择重量的数组
    var discount;            // 选择服务类型后的折扣率
    var productTypeCode;    // 服务类型编码
    var logisMerchLog;      // 物流机构的log url;

    var real_recName;    // 收件人真实地址
    var real_sendName;   // 寄件人 真实地址

   var enableButton = true;  //  立即下单 点击 标志 判断

 // $(window).bind("scroll",function(){
 //   var  clientHeight   = $(window).height();
 //     var  scrollHeight  = $(window).scrollTop();
 //     console.log(scrollHeight);
 // })

    $("#text-content").focus(function () {
        BizLog.call('info',{
             seedId:"a106.b12.c03.d05",
             actionId:'clicked'
         });
       setTimeout(function(){
           scrollAble = true;
           console.log("#text6666 "+scrollAble);
       },600);

        this.style.color = '#000';
        if (this.value == '其他要求请在此备注(选填)') {
            this.value = '';
        }
    });
    $("#text-content").blur(function () {

        if (this.value == '') {
            this.value = '其他要求请在此备注(选填)';
            this.style.color = '#ccc';
        }
    });
    ant.on('resume', function (event) {
        enableButton = true;
        $(".single_btn").removeClass("loading");
        $(".single_btn").html("立即下单");
    });
     initPage();
     function initPage(){

                  checkInf();
                  var info_id = getUrlParam("id");
                  var info_snderDstrCode = getUrlParam("snderDstrCode");
                  var info_rcvrDstrCode = getUrlParam("rcvrDstrCode");
                  var kUrl = "https://sendex.alipay-eco.com";
                  var info = {
                      "snderDstrCode":"110105",
                      "rcvrDstrCode":"110105",
                      "id":info_id
                  };
                  //初始化控件
                var xhrurl = kUrl + "/api/ep/test/order/index";
                $.axs(xhrurl, info, function(data) {

                    if (data.meta.success) {
                        var result = data.result,
                            mHtml = '',
                            timeNum;
                        if (result && result != '') {
                            var servicingText = result.servicingText,
                                goodsTypes = result.goodsTypes,
                                data2 = result.times,
                                addServices = result.addServices;

                                //为全局变量赋值
                                goodsMaxWeight = JSON.parse(result.goodsMaxWeight);//最大值
                                productType =  result.productTypes;
                                productTypeId = result.productTypes[0].productTypeId;
                                presetWeight = parseFloat(result.productTypes[0].presetWeight);
                                presetWeightPricePec = parseFloat(result.productTypes[0].presetWeightPrice); //首重价格
                                extraWeightUnitPec = parseFloat(result.productTypes[0].extraWeightUnit); //续重单位
                                extraWeightPricePec = parseFloat(result.productTypes[0].extraWeightPrice); //续重价格
                                description = result.productTypes[0].description;    // 产品类型描述
                                discount  = result.productTypes[0].discount;          // 产品类型对应的折扣率
                                productTypeCode = result.productTypes[0].productTypeCode;    // 服务类型的编码

                                InitSelect.initExpressType(productType);   // 初始化选择产品类型

                                    // 产品类型 默认选中第一个
                                $("#expressId").html(productType[0].productTypeName);
                                    // 默认 的首重 续重
                                $(".priceNum").html("首重" + presetWeightPricePec/100 + "元，续重" + extraWeightPricePec/100 + "元");
                                $(".goodsweightNum").val(presetWeight/1000);


                                // if (goodsOneValue&&goodsOneValue!='') {

                                //     // 初始化 预计快递费
                                //     var reg = /^[0-9\.]+/g;
                                //     var goodsWeights = reg.exec(goodsOneValue);
                                //     var goodsweightNum = goodsWeights*1000;
                                //     var totalPrice = presetWeightPricePec + Math.ceil((goodsweightNum - presetWeight) / extraWeightUnitPec) * extraWeightPricePec;
                                //             totalPrice=totalPrice/100;
                                //     $(".estimatePrice-data").html(totalPrice.toFixed(2));
                                // }
                            InitSelect.initWeightData();
                        //     if(!goodsWeights){

                                $("#goodstype").text(goodsTypes[0]);
                                for (var i in data2) {
                                    var temp = (i == "TDY" ? "今天" : (i == "TOM" ? "明天" : "后天"));
                                    var tempTime = data2[i][0];
                                    var spanHtml = "<span style='padding-left:.05rem;'></span>";
                                    $("#timeDate").html(JSON.parse(JSON.stringify(temp + spanHtml + tempTime)));
                                    $(".day1").val(JSON.parse(JSON.stringify(temp)));
                                    $(".time1").val(JSON.parse(JSON.stringify(tempTime)));
                                    break;
                                }

                                $("#goodsweight").html(goodsWeightTypes[0]);
                                $(".estimatePrice-data").html((presetWeightPricePec/100).toFixed(2));
                        // }
                            if (addServices && addServices != '') {
                                $(".extra_service_show").show();
                                $(".extra_service_txt").show();
                                $(".extra_service").css("padding-bottom","0.05rem");
                                                // $(".kd-height-show").show();
                                                // $(".kd-info").css({"border-top":"1px solid #ddd;"});
                                                $(".kd-info-text").css({"background-color":"#f5f5f9"});
                            } else {
                                $(".extra_service_show").hide();
                                $(".extra_service_txt").hide();
                                $(".extra_service").css("padding-bottom","0");

                                                // $(".kd-height-show").hide();
                                //  $(".kd-info").removeClass("borderTopddd");
                                                // $(".kd-info").css({"border-top":"0px solid #ddd;"});
                                                $(".kd-info-text").css({"background-color":"#f5f5f9","border-bottom":"0"});
                            }
                            // 绑定选择日期    事件
                            InitSelect.initselectDateEvent(data2);
                            // 绑定选择物品类型  事件
                            InitSelect.initSelectTypeEvent(goodsTypes);
                            //  绑定选择物品重量  事件
                            InitSelect.initSelectWeightEvent(goodsWeightTypes, presetWeightPricePec, presetWeight, extraWeightUnitPec, extraWeightPricePec);
                            // 绑定选择产品类型的 事件
                            InitSelect.initselectExpressType();

                            $(".timeText").text(servicingText);
                            $.each(addServices, function(i) {
                            //     for (var j = 0; j < addServiceArrs.length; j++) {
                            //         if (addServiceArrs[j] == addServices[i]) {
                            //             var classChange = "express_active";
                            //         } else {
                            //             var classChange = "";
                            //         }
                            //     }
                                var classChange = "";
                                if(i==0){
                                    mHtml += '<div class="' + classChange + '" style="min-width:0rem;text-align:center;width: 1.46rem;margin: 0.15rem 0rem 0.1rem 0.25rem;border: 1px #108ee9 dotted;padding: 0.02rem 0.02rem;line-height: .24rem;margin-top:0rem;">'+addServices[i]+'</div>';
                                }else{
                                    mHtml += '<div class="' + classChange + '" style="min-width:0rem;text-align:center;width: 1.46rem;margin: 0.15rem 0rem 0.1rem 0.25rem;border: 1px #108ee9 dotted;padding: 0.02rem 0.02rem;line-height: .24rem;margin-top:0rem;">'+addServices[i]+'</div>';
                                }
                            });

                            $(".extra_service").html(mHtml);
                            //点击切换样式
                            $(".extra_service div").click(function() {
                                BizLog.call('info',{
                                    seedId:"a106.b12.c03.d04",
                                    actionId:'clicked'
                                });
                                $(this).toggleClass('express_active');
                            });
                        }
                        hideLoading();
                    }
                },function(d){
                    toast({
                        text: d.meta.msg,
                        type: 'exception'
                    })
                });

    }
    //取消次数过多
    $(".dialog-close-num").click(function () {
      BizLog.call('info',{
           seedId:"a106.b16.c02.d02",
           actionId:'clicked'
       });
        $(".dialog-num").hide();
        enableButton = true;
        $(".single_btn").removeClass("loading");
        $(".single_btn").html("立即下单");

    });
    $("#btn-kefu").click(function(){
      BizLog.call('info',{
           seedId:"a106.b16.c02.d03",
           actionId:'clicked'
       });
    })
    $("#btn-sumbit").click(function () {
      BizLog.call('info',{
           seedId:"a106.b16.c02.d04",
           actionId:'clicked'
       });

        $(".dialog-num").hide();
        enableButton = true;
        $(".single_btn").removeClass("loading");
        $(".single_btn").html("立即下单");
    });
    // 头部两行的地址信息初始化
    function initTopAddressInform(templateData) {
        var sendHtml = template("sendTemplate", templateData);
        document.getElementById("sendId").innerHTML = sendHtml;
        var recHtml = template("recpAddressTemplate", templateData);
        document.getElementById("recAddressId").innerHTML = recHtml;
        var tempSendName = templateData.sendName;
        var temprecName = templateData.recName;
        // if(tempSendName.length>5){
        //   tempSendName=tempSendName.substring(0,5)+"...";
        // }
       $(".data-senderName").html(tempSendName);
        // if(temprecName.length>5){
        //   temprecName=temprecName.substring(0,5)+"...";
        // }
          $(".data-recipientsName").html(temprecName);


    }

      // 选择组件对象
     var InitSelect = new Object({

       // 初始化 选择重量 下拉数据
           initWeightData:function(){
                   goodsWeightTypes=[];
                  var maxNum = Math.round((goodsMaxWeight - presetWeight) / extraWeightUnitPec)+1;

                   console.log(maxNum);
                  for (var m = 0; m < maxNum; m++) {
                      var goodsWeightTypesVal = (presetWeight + m * extraWeightUnitPec) / 1000;
                      if (m == 0) {
                          goodsWeightTypesVal = goodsWeightTypesVal + " 公斤及以下";
                      } else if (m == maxNum - 1) {
                          goodsWeightTypesVal = goodsWeightTypesVal + " 公斤及以上";
                      } else {
                          goodsWeightTypesVal = goodsWeightTypesVal + " 公斤";
                      }
                      goodsWeightTypes.push(goodsWeightTypesVal);
                  }
                },
             // 初始化 产品类型 下拉选择
           initExpressType:function(productType){
                var arthtml=''
                productType.map(function(item,index){
                  var tempDescription = item.description;
                    var otherClass='';
                  if(tempDescription == "-"||tempDescription == ""){
                      // tempDescription = '';
                      otherClass ="displayNone";
                  }
                  arthtml += '<div  class=" am-list twoline" data-select="0" style="width:100%;padding:0;margin-bottom:.1rem">'+
                          '<div class="am-list-item expressType_border" style="background-size:0;border-radius:.05rem;padding-top:.15rem;min-height:0;padding-bottom:.135rem">'+
                              '<div class="am-list-thumb" data-select="1" style="width:.21rem;height:.21rem;background-size:contain;background-image: url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/noselect.png);background-repeat: no-repeat;">'+
                                // '<img data-select="1"  style="width:.21rem;height:.21rem" src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/noselect.png" alt="图片描述" />'+
                              '</div>'+
                                '<div class="am-list-content" style="margin-left:.05rem">'+
                                  '<div class="am-list-title am-flexbox twocolumn" style="margin-bottom:0;line-height:1">'+
                                    '<label class="am-flexbox-item" style="color:#000;font-size:.24rem;line-height:.24rem">'+item.productTypeName+'</label>'+
                                    '<div class="am-list-right-brief" style="color:#f4333c;font-size:.14rem;line-height:.24rem;"><span>'+item.presetWeightPrice/100+'</span><span> 元起</span></div>'+
                                  '</div>'+
                                  '<div class="am-list-brief '+otherClass+'"'+ 'style="white-space:normal;font-size:.14rem;line-height:.2rem;margin-top:0.05rem;margin-bottom:-0.02rem;">'+tempDescription+'</div>'+
                                '</div>'+
                          '</div>'+
                      '</div>';
                 });
                 $(".iosselect-box").html(arthtml);
               },
           // 选择产品类型
           initselectExpressType:function(){
             var _this = this;
             var myBtn = $(".alertInfo").find(".am-list-item").eq(2);
             var temp = $("#expressId").html();

             myBtn.click(function(){
               BizLog.call('info',{
                   seedId:"a106.b12.c03.d06",
                   actionId:'clicked'
               });
                if(!enableButton){return;}
                $(".myPop").show();
                 $("body").on('touchmove', function (event) {
                   event.preventDefault();
                }, false);

                if(clickFlag){
                     clickFlag = false;
                     if(isAndroid){
                       $(".iosselect-box").find(".am-list-item").css("border",'1px solid #ddd');
                     }
                     // $(".iosselect-box").find("img").eq(0).attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/select.png");
                     $(".iosselect-box").find(".am-list-thumb").eq(0).css({"background-image":"url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/select.png)"});
                     $(".iosselect-box").find(".am-list").eq(0).attr("data-select","1");
                     $(".iosselect-box").find(".am-list-item").eq(0).css("border-color",'#108ee9');
                     $(".iosselect-box").find(".am-list:last").css("margin-bottom",'0');
                  }

                    // console.log(".iosselect  "+$(".iosselect-box").find("img").eq(0));
                // $(".iosselect-box").find("img:first").src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/select.png";
                        // $(".iosselect-box").find(".am-list:last").css("margin-bottom",'0');

             });
             $(".iosselect-box").find(".am-list").map(function(item,index){

                    //  $(this).attr("data-index",item);
                     $(this).on("click",function(){
                           var current = $(this);
                           if($(this).attr("data-select")=="0"){
                               current = $(this);
                               $(".iosselect-box").find(".am-list").each(function(){
                                       $(this).attr("data-select","0");
                                       // $(this).find("img").attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/noselect.png")
                                       $(this).find(".am-list-thumb").css({"background-image":"url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/noselect.png)"});
                                       $(this).find(".am-list-item").css("border-color",'#ddd');
                               });
                               $(this).attr("data-select","1");
                              $(this).find(".am-list-thumb").css({"background-image":"url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/select.png)"});
                               // $(this).find("img").attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/select.png")
                               $(this).find(".am-list-item").eq(0).css("border-color",'#108ee9');
                           }
                         temp= current.find("label").html();
                         $("#expressId").html(temp);
                         var num = $(this).index();
                         productTypeId =  productType[num].productTypeId;    // 更换产品类型id
                         presetWeight = parseFloat(productType[num].presetWeight);
                         presetWeightPricePec = parseFloat(productType[num].presetWeightPrice); //首重价格
                         extraWeightUnitPec = parseFloat(productType[num].extraWeightUnit); //续重单位
                         extraWeightPricePec = parseFloat(productType[num].extraWeightPrice); //续重价格
                         description    = productType[num].description;   //  //预存描述
                         discount  =  parseFloat(productType[num].discount);
                         productTypeCode = productType[num].productTypeCode;    // 服务类型的编码


                         // 选择完服务类型后，初始化 首重 和 重量选择数组
                         _this.initWeightData();
                        $(".priceNum").html("首重" + presetWeightPricePec/100 + "元，续重" + extraWeightPricePec/100 + "元");
                         $("#goodsweight").html(goodsWeightTypes[0]);
                         $(".estimatePrice-data").html((presetWeightPricePec/100).toFixed(2));
                        setTimeout(function(){
                          $(".myPop").hide();
                          $("body").off("touchmove");
                        },200);

                     });
             });
             $(".myPop").find(".close").click(function(){
                   $(".myPop").hide();
                   $("body").off("touchmove");
             });
             $(".myPop").find(".sure").click(function(){
                    $(".myPop").hide();
                    $("body").off("touchmove");
                    $("#expressId").html(temp);
             });
           },
           // 选择日期 函数
           initselectDateEvent: function(data2) {
               //选择时间
               console.log(data2);
               var dateDom = document.querySelector('#dateId');
               var timeDom = document.querySelector('#timeId');
               var myBtn = $(".alertInfo").find(".am-list-item").eq(0);
               myBtn.unbind();
               myBtn.click(function() {
                 BizLog.call('info',{
                     seedId:"a106.b12.c03.d01",
                     actionId:'clicked'
                 });
                 if(!enableButton){return;}

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
                               "value": tempArr[j],
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
                           $("#timeDate").html(JSON.parse(JSON.stringify(selectOneObj.value + spanHtml + selectTwoObj.value)));
                           $(".day1").val(JSON.parse(JSON.stringify(selectOneObj.value)));
                           $(".time1").val(JSON.parse(JSON.stringify(selectTwoObj.value)));
                           ant.setSessionData({
                               data: {
                                   dayValue: JSON.parse(JSON.stringify(selectOneObj.value)),
                                   timeValue: JSON.parse(JSON.stringify(selectTwoObj.value)),
                                   timeDate: JSON.parse(JSON.stringify(selectOneObj.value + selectTwoObj.value))
                               }
                           });
                           checkInf();
                       }
                   };
                   var data = [date2, time];
                   var myScroll = new IosSelect(level, data, options);
               });

           },
           // 选择物品类型 函数
           initSelectTypeEvent:function(goodsTypes) {
               var typeDom = document.querySelector("#typeId")
               var typeBtn = $(".alertInfo").find(".am-list-item").eq(1);
               typeBtn.click(function() {
                 BizLog.call('info',{
                     seedId:"a106.b12.c03.d02",
                     actionId:'clicked'
                 });
                  if(!enableButton){return;}
                //  $("body").on('touchmove', function (event) {
                //         event.preventDefault();
                // }, false);
                   var typeId = typeBtn.attr("data-type_id");
                   var typeName = typeBtn.attr("data-type_value");

                   var typeLevel = 1;
                   var typeArr = [];
                   for (var i = 0; i < goodsTypes.length; i++) {
                       typeArr.push({
                           "id": i.toString(),
                           "value": goodsTypes[i]
                       })
                   }
                   var option2 = {
                       title: "",
                       itemHeight: 35,
                       headerHeight: 42,
                       cssUtil: "px",
                       oneLevelId: typeId,
                       callback: function(selectOneObj) {
                           typeDom.value = selectOneObj.id;
                           typeBtn.attr('data-type_id', selectOneObj.id);
                           typeBtn.attr('data-type_value', selectOneObj.value);
                           $("#goodstype").text(JSON.parse(JSON.stringify(selectOneObj.value)));
                           ant.setSessionData({
                               data: {
                                   goodstypeValue: JSON.parse(JSON.stringify(selectOneObj.value))
                               }
                           });
                           checkInf();
                       }
                   }
                   var oneSelect = new IosSelect(typeLevel, [typeArr], option2);
               });

           },
        // 选择物品重量 函数
           initSelectWeightEvent: function () {
            //选择物品重量
            var weightDom = document.querySelector("#weightId")
            var weightBtn = $(".alertInfo").find(".am-list-item").eq(3);
            weightBtn.click(function () {
              BizLog.call('info',{
                   seedId:"a106.b12.c03.d03",
                   actionId:'clicked'
               });
               if(!enableButton){return;}
                var weightId = weightBtn.attr("data-weight_id");
                var weightName = weightBtn.attr("data-weight_value");
              //   $("body").on('touchmove', function (event) {
              //          event.preventDefault();
              //  }, false);
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
                        if (selectOneObj.id == '') {
                            var reg = /^[0-9\.]+/g;
                            var addServicesOne = reg.exec(goodsWeightTypes[0]) * 1000;
                            var totalPrice = presetWeightPricePec + Math.ceil((addServicesOne - presetWeight) / extraWeightUnitPec) * extraWeightPricePec;
                            totalPrice = totalPrice / 1000;
                            $(".estimatePrice-data").html(totalPrice.toFixed(2));
                        } else {
                            $("#goodsweight").text(JSON.parse(JSON.stringify(selectOneObj.value)));
                            var reg = /^[0-9\.]+/g;
                            var weight = reg.exec(selectOneObj.value);
                            var totalPrice = presetWeightPricePec + Math.ceil((weight * 1000 - presetWeight) / extraWeightUnitPec) * extraWeightPricePec;
                            totalPrice = totalPrice / 100;
                            console.log("weight: "+weight);
                            console.log("presetWeightPricePec :"+presetWeightPricePec);
                           console.log("Math.ceil((weight * 1000 - presetWeight) / extraWeightUnitPec): "+Math.ceil((weight * 1000 - presetWeight) / extraWeightUnitPec));

                            $(".goodsweightNum").val(weight);
                            $(".estimatePrice-data").html(totalPrice.toFixed(2));
                            ant.setSessionData({
                                data: {
                                    goodsOneValue: JSON.parse(JSON.stringify(selectOneObj.value)),
                                    goodsOneIndex: JSON.parse(JSON.stringify(selectOneObj.value))
                                }
                            });
                        }
                        checkInf();
                    }
                }
                var weightSelect = new IosSelect(weightLevel, [weightArr], option2);
            });
        }
    });



    // 检查日期 重量 类型 是否填写完整   完整返回 真
    function checkInf() {
        if ($("#timeDate").text() == "请选择") {
            return false;
        } else if ($("#goodstype").text() == "请选择") {
            return false;
        } else if ($(".goodsweightNum").val() == '') {
            return false;
        }else if(!$("#defaultCheckBox").hasClass("defaultSelect")){
              return false;
        } else  {
            $(".single_btn").removeClass("disabled");
            return true;
        }
    }

    // 过滤掉备注重点中的表情包
    // 超50 提示
    var informationLock = false;
    var scrollAble = false;
    $("#text-content").bind("compositionstart", function () {
       console.log(" into compositionstart")
        informationLock = true;
    })
    $("#text-content").bind("compositionend", function () {
         console.log(" into compositionend")
         var emoji = emojione.toShort($(this).val());
         $(this).val(emoji.replace(/\:[a-z0-9_]+\:/g, ''));
         if ($(this).val().length >= 51) {
             var tempval = $(this).val().slice(0, 50);
             $(this).val(tempval);
             $(".am-toast").show();
             setTimeout(function(){
                  $(".am-toast").hide();
             },800)
         }
        informationLock = false;
    })
    $("#text-content").bind('input', function () {
       console.log("into input"+informationLock);
        if (!informationLock) {
            var emoji = emojione.toShort($(this).val());
            $(this).val(emoji.replace(/\:[a-z0-9_]+\:/g, ''));
            if ($(this).val().length >=51) {
                var tempval = $(this).val().slice(0, 50);
                $(this).val(tempval);
                $(".am-toast").show();
                setTimeout(function(){
                     $(".am-toast").hide();
                },800)
            }
        }
    });
    $("#text-content").bind("blur",function(){
        scrollAble =false;
    });


    if(isAndroid){
      $(window).on('scroll', function (event) {
             console.log(scrollAble);
             if(scrollAble){
               console.log("dasdfa");
                $("#text-content").blur();
             }

      }, false);
    }

   $("#defaultCheckBox").find("span").css({"background-image":"url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png)"})
    // 绑定“同意协议” 复选框的事件
    $("#defaultCheckBox").click(function () {
      BizLog.call('info',{
           seedId:"a106.b12.c04.d02",
           actionId:'clicked'
       });
        if ($(this).hasClass("defaultSelect")) {
            $(this).toggleClass("defaultSelect");
            $(".single_btn").addClass("disabled");
            $(this).find("span").css({"background-image":"url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-noSelect.png)"});
            // $(this).find("span").attr("src", "http://kuaidi-dev.oss-cn-hangzhou.aliyuncs.com/mobile/default-noSelect.png");
        } else {

            $(this).toggleClass("defaultSelect");
            if (checkInf()) {
                $(".single_btn").removeClass("disabled");
            }
              $(this).find("span").css({"background-image":"url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png)"});
        }

    });

    // 绑定"立即下单"按钮的点击事件

    $(".single_btn").click(function () {
      BizLog.call('info',{
           seedId:"a106.b12.c04.d04",
           actionId:'clicked'
       });
        console.log("enableButton "+enableButton);
        if (enableButton) {
            if ($(this).hasClass("disabled")) {
                return;
            } else {
                enableButton = false;
                $(this).addClass("loading");
                $(this).attr("role","alert");
                $(this).attr("aria-live","assertive");
                $(this).html('<i class="icon" aria-hidden="true"></i>加载中...');
                // var loaging =
                //     '<a class="am-button blue single_btn loading" role="alert" aria-live="assertive">' +
                //     '<i class="icon" aria-hidden="true"></i>' +
                //     '加载中...' +
                //     '</a>';
                // $(".buttonContent").html(loaging);
                setTimeout(function(){
                        enableButton = true;
                        $(".single_btn").removeClass("loading");
                        $(".single_btn").html("立即下单");

                },7000);
                addressOrder();
            }
        }

    });
    $(".price_rule").on("click", function () {
      BizLog.call('info',{
           seedId:"a106.b12.c04.d01",
           actionId:'clicked'
       });
          $("#text-content").blur();
        setTimeout(function(){
          ant.pushWindow({
              url: "price-rule.html"
          });
        },300)
    });

    // 点击服务协议
    $(".service_agreement").on("click", function () {
      BizLog.call('info',{
           seedId:"a106.b12.c04.d03",
           actionId:'clicked'
       });
        $("#text-content").blur();
      setTimeout(function(){
        ant.pushWindow({
              url: "service-agreement.html"
          });
      },300)
    });
    // 提交订单信息
    function addressOrder() {
        var addServiceArr = [],
            classArr = $(".extra_service div");
            console.log("vclassArr.length: "+classArr.length);
            if(classArr&&classArr.length != 0){
              for (var i = 0; i < classArr.length; i++) {
                  if ($(classArr[i]).hasClass("express_active")) {
                      addServiceArr.push($(classArr[i]).text());
                  }
              }
              addServiceArr =  addServiceArr.join(",");
            }else{
                 addServiceArr="1";
            }
            console.log(addServiceArr);
            var remarkStr= emojione.toShort($("#text-content").val()).replace(/\:[a-z0-9_]+\:/g,'')
            if(remarkStr == '其他要求请在此备注(选填)'){
                remarkStr = "";
            }
        ant.setSessionData({
            data:{
                addServiceArr: addServiceArr,
                remarkContent: remarkStr
            }
        });
        if (checkInf()) {
              console.log("productTypeCode"+productTypeCode);
            var info = {
                "logisMerchLog":"",
                "senderAddrID":15,
                "reciptiensAddrID":7,
                "productTypeCode":productTypeCode,
                "discount":JSON.parse(discount),
                "logisMerchId": 2,
                "productId": JSON.parse(productTypeId),
                "snderName": $(".data-senderName").html(),
                "snderMobile": $(".data-senderNumber").html(),
                "snderPrvnCode": "110000",
                "snderCityCode": "110100",
                "snderDstrCode": "110105",
                "snderStreet": "",
                "snderAddress": $(".data-street").text(),
                "rcvrName": $(".data-recipientsName").html(),
                "rcvrMobile": $(".data-recipientsNumber").html(),
                "rcvrPrvnCode": "110000",
                "rcvrCityCode": "110100",
                "rcvrDstrCode": "110105",
                "rcvrStreet": "",
                "rcvrAddress": $(".data-restreet").text(),
                "bookedDay": ($(".day1").val() == "今天" ? "TDY" : ($(".day1").val() == "明天" ? "TOM" : "AFT")),
                "bookedTime": $(".time1").val(),
                // "bookedTime":"13:30-15:30",
                "goodsType": $("#goodstype").text(),
                "goodsWeight": $(".goodsweightNum").val() * 1000,
                "remark": remarkStr,
                "addService": addServiceArr,
                "estimatePrice": JSON.parse($(".estimatePrice-data").text()) * 100
            };
            // console.log("senderAddrID "+JSON.parse(senderAddrID));
            var xhrurl = jUrl + '/ep/order/save';
            // 在没网的情况下 除去加载状态
            if(!isNetworkAvailable){
                enableButton = true;
                $(".single_btn").removeClass("loading");
                $(".single_btn").html("立即下单");
            }
            $.axs(xhrurl, info, function (data) {

                $(".single_btn").removeClass("loading");
                $(".single_btn").html("立即下单");
                if (data.meta.code=="0000") {
                   var data = data.result.orderNo;
                        //  var data = data.result;
                    if (data && data != '') {
                        var orderNo = data;
                    }
                    //下单成功，清空seesion
                    //clearSeesion();
                   pushWindow("scuess-order.html?orderNo=" + orderNo + "",false);
                } else {
                    ant.pushWindow({
                        url: "single-failure.html"
                    });
                }
            },function (data) {
                enableButton = true;
                $(".single_btn").removeClass("loading");
                $(".single_btn").html("立即下单");
                 // 存在已取件 并未支付的订单
                if(data.meta.code == "1820"){
                  // alert("dfasdfasd")
                  enableButton = true;
                  // alert(  $(".single_btn").html())
                  $(".single_btn").removeClass("loading");
                  $(".single_btn").html("立即下单");

                    // $(".single_btn").addClass("disabled");

                   setTimeout(function(){
                      notPaidOrder(data.result.notPaidOrderNo,data.result.notPaidRemindCnt);
                    },10);
                }else  if (data.meta.code == '1810') {
                  toast({
                      text: "预约取件时间无效",
                      type: 'exception'
                  })

                    //保存订单失败，提示重试 toast
                } else if (data.meta.code == '1812') {
                      enableButton = true;
                      $(".single_btn").removeClass("disabled");
                      BizLog.call('info',{
                           seedId:"a106.b16.c02.d01",
                           actionId:'openPage'
                       });
                      $(".dialog-num").show();

                    //保存订单失败，提示重试 toast
                } else if (data.meta.code == '1813') {
                    toast({
                        text: "快递公司下单失败",
                        type: 'exception'
                    })
                }else if(data.meta.code == '1817'){

                  var tempData2= data.result.times;
                   InitSelect.initselectDateEvent(tempData2);
                   for (var i in tempData2) {
                       var temp = (i == "TDY" ? "今天" : (i == "TOM" ? "明天" : "后天"));
                       var tempTime = tempData2[i][0];
                       var spanHtml = "<span style='padding-left:.05rem;'></span>";
                       $("#timeDate").html(JSON.parse(JSON.stringify(temp + spanHtml + tempTime)));
                       $(".day1").val(JSON.parse(JSON.stringify(temp)));
                       $(".time1").val(JSON.parse(JSON.stringify(tempTime)));
                       break;
                    }
                    toast({
                          text:"请重新确认上门时间",
                      })
                }else {
                    toast({
                        text: "创建订单失败，请重试",
                        type: 'exception'
                    })
                }

            });
        }
    }
});
