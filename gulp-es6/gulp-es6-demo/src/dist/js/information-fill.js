Zepto(function ($) {
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

    $("#text-content").focus(function () {

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
          ant.getSessionData({
              keys: ['epCompanyId','sendAreaCode','recAreaCode', 'epCompanyName', 'cityCode', 'productTypeId',
                  'presetWeight', 'presetWeightPrice', 'extraWeightUnit', 'extraWeightPrice', 'epCompanyId',
                  'reciptiensAddrID', 'recName', 'recNumber',
                  'recProvinceCode', 'recCityCode',
                  'recAreaCode', 'recStreet', 'recAddress',
                  'senderAddrID', 'sendName', 'sendNumber',
                  'sendProvinceCode', 'sendCityCode',
                  'sendAreaCode', 'sendStreet', 'sendAddress',
                  'dayValue', 'timeValue', 'timeDate', 'goodstypeValue', 'goodsOneValue', 'goodsOneIndex', 'addServiceArrs', 'remarkContent',
                  'epCompanyNo', 'acceptOrderFrom', 'acceptOrderTo','merchantName'
              ]
          }, function(result) {
              snderDstrCode = result.data.sendAreaCode;
              rcvrDstrCode = result.data.recAreaCode;
              epCompanyId = result.data.epCompanyId;
              epCompanyName = result.data.epCompanyName;
              productTypeId = result.data.productTypeId;
              epCompanyNo = result.data.epCompanyNo;
              acceptOrderFrom = result.data.acceptOrderFrom;
              acceptOrderTo = result.data.acceptOrderTo;
              senderAddrID = result.data.senderAddrID;
              var cityCode = result.data.cityCode;
              //  presetWeight = parseFloat(result.data.presetWeight);
              //  presetWeightPricePec = parseFloat(result.data.presetWeightPrice); //首重价格
              //  extraWeightUnitPec = parseFloat(result.data.extraWeightUnit); //续重单位
              //  extraWeightPricePec = parseFloat(result.data.extraWeightPrice); //续重价格
              ant.call('setTitle', {
                  title: epCompanyName
              });
              // 初始化头部地址两行的地址信息
              var templateData = result.data;
              initTopAddressInform(templateData);

              //初始化剩余页面
              var dayValue = result.data.dayValue || '';
              var timeValue = result.data.timeValue || '';
              var timeDate = result.data.timeDate || '';
              var goodstypeValue = result.data.goodstypeValue || '';
              var goodsOneValue = result.data.goodsOneValue || '';
              var goodsOneIndex = result.data.goodsOneIndex || '0';
              var addServiceArrs = result.data.addServiceArrs || '';
              var remarkContent = result.data.remarkContent || '';
              orderInfoShow(epCompanyNo,epCompanyId,snderDstrCode,rcvrDstrCode, acceptOrderFrom, acceptOrderTo, dayValue, timeValue, timeDate, goodstypeValue, goodsOneValue, goodsOneIndex, addServiceArrs, remarkContent);
              //寄件信息显示
              function orderInfoShow(epCompanyNo,epCompanyId,snderDstrCode,rcvrDstrCode,acceptOrderFrom, acceptOrderTo, dayValue, timeValue, timeDate, goodstypeValue, goodsOneValue, goodsOneIndex, addServiceArrs, remarkContent) {
                  //加载旧数据?

                  if(remarkContent){
                      $("#text-content").val(remarkContent);
                      // $("#text-content").style.color='#000';
                  }else{
                      $("#text-content").val("其他要求请在此备注(选填)");
                      // $("#text-content").style.color='#ccc';
                  }
                  if(goodstypeValue&&goodstypeValue!=''){
                        $("#goodstype").text(goodstypeValue);
                  }else{
                      $("#goodstype").text("请选择")
                  }
                 if(timeDate&&timeDate!=''){
                         $("#timeDate").text(timeDate);
                 }else{
                      $("#timeDate").text("请选择");
                 }
                  $(".day1").val(dayValue);
                  $(".time1").val(timeValue);
                  $("#goodsweight").text(goodsOneValue);
                  checkInf();

                  var info = {
                      "logisMerchCode": epCompanyNo,
                      "acceptOrderFrom": acceptOrderFrom,
                      "acceptOrderTo": acceptOrderTo,
                      "logisMerchId":parseInt(epCompanyId),
                      "snderDstrCode":snderDstrCode,
                      "rcvrDstrCode":rcvrDstrCode
                  };
                  //初始化控件
                  var xhrurl = jUrl + '/ep/order/index';
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
                                  description    = result.productTypes[0].description;    // 产品类型描述
                                  discount  = result.productTypes[0].discount;          // 产品类型对应的折扣率
                                  productTypeCode = result.productTypes[0].productTypeCode;    // 服务类型的编码

                                 InitSelect.initExpressType(productType);   // 初始化选择产品类型

                                       // 产品类型 默认选中第一个
                                  $("#expressId").html(productType[0].productTypeName);
                                      // 默认 的首重 续重
                                  $(".priceNum").html("首重" + presetWeightPricePec/100 + "元，续重" + extraWeightPricePec/100 + "元");
                                  $(".goodsweightNum").val(presetWeight/1000);


                                  if (goodsOneValue&&goodsOneValue!='') {


                                    // 初始化 预计快递费
                                      var reg = /^[0-9\.]+/g;
                                      var goodsWeights = reg.exec(goodsOneValue);
                                      var goodsweightNum = goodsWeights*1000;
                                      var totalPrice = presetWeightPricePec + Math.ceil((goodsweightNum - presetWeight) / extraWeightUnitPec) * extraWeightPricePec;
                                            totalPrice=totalPrice/100;
                                      $(".estimatePrice-data").html(totalPrice.toFixed(2));
                                  }
                             InitSelect.initWeightData();
                             if(!goodsWeights){

                                 $("#goodsweight").html(goodsWeightTypes[0]);
                                 $(".estimatePrice-data").html((presetWeightPricePec/100).toFixed(2));
                           }
                              if (addServices && addServices != '') {
                                  $(".extra_service_show").show();
                                  $(".extra_service_txt").show();
                								  // $(".kd-height-show").show();
                								  // $(".kd-info").css({"border-top":"1px solid #ddd;"});
                								  $(".kd-info-text").css({"background-color":"#f5f5f9"});
                              } else {
                                  $(".extra_service_show").hide();
                                  $(".extra_service_txt").hide();
                								  // $(".kd-height-show").hide();
                                  //  $(".kd-info").removeClass("borderTopddd");
                								  // $(".kd-info").css({"border-top":"0px solid #ddd;"});
                								  $(".kd-info-text").css({"background-color":"#f5f5f9"});
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
                                  for (var j = 0; j < addServiceArrs.length; j++) {
                                      if (addServiceArrs[j] == addServices[i]) {
                                          var classChange = "express_active";
                                      } else {
                                          var classChange = "";
                                      }
                                  }
								if(i==0){
									mHtml += '<div class="am-flexbox-item ' + classChange + '" style="min-width:0rem;text-align:center;width: 1.5rem;margin: 0.15rem 0.125rem 0.15rem 0.25rem;border: 1px #108ee9 dotted;padding: 0.02rem 0.02rem;line-height: .24rem;margin-top:0rem;">'+addServices[i]+'</div>';
								}else{
									mHtml += '<div class="am-flexbox-item ' + classChange + '" style="min-width:0rem;text-align:center;width: 1.5rem;margin: 0.15rem 0.25rem 0.15rem 0.125rem;border: 1px #108ee9 dotted;padding: 0.02rem 0.02rem;line-height: .24rem;margin-top:0rem;">'+addServices[i]+'</div>';
								}
                              });

                              $(".extra_service").html(mHtml);
                              //点击切换样式
                              $(".extra_service div").click(function() {
                                  $(this).toggleClass('express_active');
                              });
                          }
                    }
                },function(d){
                  toast({
                    text: d.meta.msg,
                    type: 'exception'
                  })

                });
            }
        });
    }

    //取消次数过多
    $(".dialog-close-num").click(function () {
        $(".dialog-num").hide();
        enableButton = true;
        $(".single_btn").removeClass("loading");
        $(".single_btn").html("立即下单");

    });
    $("#btn-sumbit").click(function () {

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
                  arthtml += '<div  class=" am-list twoline" data-select="0" style="width:100%;padding:0;margin-bottom:.1rem">'+
                          '<div class="am-list-item expressType_border" style="background-size:0;border-radius:.05rem;padding-top:.085rem;padding-bottom:.12rem">'+
                              '<div class="am-list-thumb">'+
                                '<img data-select="1"  style="width:.21rem;height:.21rem" src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/noselect.png" alt="图片描述" />'+
                              '</div>'+
                                '<div class="am-list-content">'+
                                  '<div class="am-list-title am-flexbox twocolumn">'+
                                    '<label class="am-flexbox-item" style="color:#000;font-size:.24rem;line-height:.38rem">'+item.productTypeName+'</label>'+
                                    '<div class="am-list-right-brief" style="color:#f4333c;font-size:.14rem"><span>'+item.presetWeightPrice/100+'</span><span> 元起</span></div>'+
                                  '</div>'+
                                  '<div class="am-list-brief" style="white-space:normal;font-size:.14rem;line-height:.2rem">'+item.description+'</div>'+
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
                $(".myPop").show();
                 $("body").on('touchmove', function (event) {
                   event.preventDefault();
                }, false);

                if(clickFlag){
                     clickFlag = false;
                     if(isAndroid){
                       $(".iosselect-box").find(".am-list-item").css("border",'1px solid #ddd');
                     }
                     $(".iosselect-box").find("img").eq(0).attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/select.png");
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
                     $(this).click(function(){

                           var current = $(this);
                           if($(this).attr("data-select")=="0"){
                               current = $(this);
                               $(".iosselect-box").find(".am-list").each(function(){
                                       $(this).attr("data-select","0");
                                       $(this).find("img").attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/noselect.png")
                                       $(this).find(".am-list-item").css("border-color",'#ddd');
                               });
                               $(this).attr("data-select","1");
                               $(this).find("img").attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/select.png")
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
                         $(".myPop").hide();
                          $("body").off("touchmove");
                     });
             });
             $(".myPop").find(".close").click(function(){
                   $(".myPop").hide();
                   $("body").off("touchmove");
             });
             $(".myPop").find(".sure").click(function(){
                    $(".myPop").hide();
                    $("body").off('touchmove');
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
               myBtn.click(function() {

                 $("body").on('touchmove', function (event) {
                        event.preventDefault();
                }, false);
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
                 $("body").on('touchmove', function (event) {
                        event.preventDefault();
                }, false);
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
                var weightId = weightBtn.attr("data-weight_id");
                var weightName = weightBtn.attr("data-weight_value");
                $("body").on('touchmove', function (event) {
                       event.preventDefault();
               }, false);
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
        } else {
            $(".single_btn").removeClass("disabled");
            return true;
        }
    }

    // 过滤掉备注重点中的表情包
    // 超50 提示
    var informationLock = false;
    $("#text-content").bind("compositionstart", function () {
        informationLock = true;
    })
    $("#text-content").bind("compositionend", function () {
        informationLock = false;
    })
    $("#text-content").bind('input', function () {
        if (!informationLock) {
            var emoji = emojione.toShort($(this).val());
            $(this).val(emoji.replace(/\:[a-z0-9_]+\:/g, ''));
            // 屏蔽特殊字符
            // var pattern = new RegExp("[~%!+-*@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
            $(this).val($(this).val().replace(/%/, ''));

            if ($(this).val().length == 51) {
                var tempval = $(this).val().slice(0, 50);
                $(this).val(tempval);
                toast({
                    text: '备注不能超过 50 个汉字哦~'
                });
            }
        }
    });
    // 绑定“同意协议” 复选框的事件
    $("#defaultCheckBox").click(function () {

        if ($(this).hasClass("defaultSelect")) {
            $(".single_btn").addClass("disabled");
            $(this).find("img").attr("src", "http://kuaidi-dev.oss-cn-hangzhou.aliyuncs.com/mobile/default-noSelect.png");
        } else {
            if (checkInf()) {
                $(".single_btn").removeClass("disabled");
            }
            $(this).find("img").attr("src", "https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png")
        }
        $(this).toggleClass("defaultSelect");
    });

    // 绑定"立即下单"按钮的点击事件
    var enableButton = true;
    $(".single_btn").click(function () {
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

                },5000)
                addressOrder();
            }
        }

    });
    $(".price_rule").on("click", function () {
        ant.pushWindow({
            url: "price-rule.html"
        });
    });

    // 点击服务协议
    $(".service_agreement").on("click", function () {
        ant.pushWindow({
            url: "service-agreement.html"
        });
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
            var remarkStr= $("#text-content").val();
            if(remarkStr == '其他要求请在此备注(选填)'){
                remarkStr = "";
            }
        ant.setSessionData({
            data: {
                addServiceArr: addServiceArr,
                remarkContent: remarkStr
            }
        });
        if (checkInf()) {
              console.log("productTypeCode"+productTypeCode);
            var info = {
                "senderAddrID":JSON.parse(senderAddrID),
                "productTypeCode":productTypeCode,
                "discount":JSON.parse(discount),
                "logisMerchId": JSON.parse(epCompanyId),
                "productId": JSON.parse(productTypeId),
                "snderName": $(".data-senderName").text(),
                "snderMobile": $(".data-senderNumber").text(),
                "snderPrvnCode": $(".data-senderName").attr("data-provinceNo"),
                "snderCityCode": $(".data-senderName").attr("data-cityNo"),
                "snderDstrCode": $(".data-senderName").attr("data-areaNo"),
                "snderStreet": "",
                "snderAddress": $(".data-detailaddress").text(),
                "rcvrName": $(".data-recipientsName").text(),
                "rcvrMobile": $(".data-recipientsNumber").text(),
                "rcvrPrvnCode": $(".data-recipientsName").attr("data-recprovinceNo"),
                "rcvrCityCode": $(".data-recipientsName").attr("data-reccityNo"),
                "rcvrDstrCode": $(".data-recipientsName").attr("data-recareaNo"),
                "rcvrStreet": "",
                "rcvrAddress": $(".data-redetailaddress").text(),
                "bookedDay": ($(".day1").val() == "今天" ? "TDY" : ($(".day1").val() == "明天" ? "TOM" : "AFT")),
                "bookedTime": $(".time1").val(),
                "goodsType": $("#goodstype").text(),
                "goodsWeight": $(".goodsweightNum").val() * 1000,
                "remark": remarkStr,
                "addService": addServiceArr,
                "estimatePrice": JSON.parse($(".estimatePrice-data").text()) * 100
            };
            console.log("senderAddrID "+JSON.parse(senderAddrID));
            var xhrurl = jUrl + '/ep/order/save';
            $.axs(xhrurl, info, function (data) {
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
                 // 存在已取件 并未支付的订单
                if(data.meta.code == "1820"){
                   enableButton = false;
                   $(".single_btn").removeClass("loading");
                   $(".single_btn").html("立即下单");
                    $(".single_btn").addClass("disabled");

                   notPaidOrder(data.result.notPaidOrderNo,data.result.notPaidRemindCnt);
                }else  if (data.meta.code == '1811') {
                    //1811 用户取消次数过多，不允许下单，弹提示框

                    //保存订单失败，提示重试 toast
                } else if (data.meta.code == '1812') {
                      enableButton = true;
                      $(".single_btn").removeClass("disabled");
                      $(".dialog-num").show();

                    //保存订单失败，提示重试 toast
                } else if (data.meta.code == '1813') {
                    toast({
                        text: "创建订单失败，请重试",
                        type: 'exception'
                    })
                } else {
                    toast({
                        text: "创建订单失败，请重试",
                        type: 'exception'
                    })
                }

            });
        }
    }
});
