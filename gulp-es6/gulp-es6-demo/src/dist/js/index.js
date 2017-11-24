showLoading();
Zepto(function($){
    FastClick.attach(document.body);
    //清空seesion
    clearSeesion();

    ant.on('resume', function (event) {
        clearSeesion();
      //  $("#cityClick img").attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/syca_icon.png");
        // hideLoading();
        promotion(cityCode,indexUid);  //
    });
    //首页埋点
    document.addEventListener('AlipayJSBridgeReady', function(){
        var objBiz = window.BizLog.call('info',{seedId:'a106.b01',actionId:'exposure'});
    });
    var city,cityCode,adcode,auth_code;

    // 点击帮助中心
    clickStatus.bind($(".help_center"))();
    $(".help_center").on("click", function () {
        ant.pushWindow({
            url: "help-center.html"
        });
    });
    // 点击我的订单
    $(".my_order").on("click", function () {
        ant.pushWindow({
            url: "alipays://platformapi/startapp?appId=20000754&url=%2Fapp%2Fsrc%2FexpressRecord.html%3Ffrom%3DSendEXClient%26externalReferer%3D1"
        });
    });
    document.addEventListener('AlipayJSBridgeReady', function(){
        AlipayJSBridge.call("getAuthCode",{
            scopeNicks:['auth_base'] //主动授权：auth_user，静默授权：auth_base
        },function(result){
            auth_code=result.authcode;
            getAuth_Code(auth_code);
        });
    });
    $("#cityTitle").html('定位中...');



    // 添加点击态
    clickStatus.bind($("#cityClick"))();
    $("#cityClick").click(function(){
        getCity(city,cityCode);
  });

    //获取auth_code
    function getAuth_Code(auth_code){
        var info = {
            "authCode" : auth_code
        };
        var xhrurl = jUrl+'/ep/user/base_auth';
        $.axs(xhrurl, info, function(data) {
            if (data.meta.success) {
                alertLocation();
            }
        });
    }
    //定位窗口
    function alertLocation(){
        ant.call('getLocation', function (result) {
            if(result.error){
                //定位失败
                dingweiInfo();
            }else{
                //定位成功
                city = JSON.parse(JSON.stringify(result.city));
                adcode = JSON.parse(JSON.stringify(result.adcode));
                cityCode = adcode.substr(0, 4)+"00";
                if(city.indexOf("市")>0){
                    city = city.substr(0,city.length-1);
                }else if(city.indexOf("地区")>0){
                    city = city.substr(0,city.length-2);
                }
                $("#cityTitle").html(city);
                initStateComfirmData(cityCode);
            }
        });
    }

    //定位不成功从数据库取
    function dingweiInfo(){
        var info = {
        };
        var xhrurl = jUrl+'/ep/get_last_city';
        $.axs(xhrurl, info, function(data) {
            if (data.meta.success) {
                if(data.result && data.result.cityCode){
                    console.log(data.result.cityCode);
                    var cityCode = data.result.cityCode;
                    var areaName = getAreaNameByCode(cityCode);
                    // console.log("areaName "+areaName[1]);
                    if(areaName) {
                        var names = areaName.split(" ");
                        var city = names[1];
                        if(city.indexOf("市")>0){
                            city = city.substr(0,city.length-1);
                        }else if(city.indexOf("地区")>0){
                            city = city.substr(0,city.length-2);
                        }
                        $("#cityTitle").html(city);
                    }else{
                        alert(data.result.cityCode + " no name");
                    }

                    initStateComfirmData(cityCode);
                }else{
                    //获取选择城市
                    getCity(city,cityCode);
                }
            }
        });
    }

    //定位确定拉取后台数据
    function initStateComfirmData(cityCode){

        var info = {
            "pageId" : indexUid,
            "cityCode" :cityCode
        };

        var xhrurl = jUrl+'/ep/index_info';
        $.axs(xhrurl, info, function(data) {
            if (data.meta.success) {
                hideLoading();
                var serviceAuthStatus =data.result.serviceAuthStatus;
                ant.setSessionData({
                    data: {
                        serviceAuthStatus:serviceAuthStatus,
                        cityCode:cityCode
                    }
                });
                var xHtml='',sHtml='',recentExprComs = data.result.recentExprComs,sendApps = data.result.sendApps;
                //常用快递
                if(recentExprComs!=null){
                    xHtml+='<div class="am-ft-gray commonlyex_title kd-common">常用快递</div>';
                    xHtml+='<div class="am-flexbox commonly_express">';
                    if(recentExprComs.length==1){
                        xHtml+=['<div class="am-list sicon" style="width:100%;padding-top: .12rem;padding-bottom: .1rem;">',
                            '<div class="am-list-body">',
                            '<div class="am-list-item kd-common-express" style="padding: 0rem .15rem;background: #fff;" data-id='+recentExprComs[0].id+' data-merchantCode='+recentExprComs[0].merchantCode+' data-merchantName='+recentExprComs[0].merchantName+' data-cityCode='+cityCode+' data-acceptOrderFrom='+recentExprComs[0].acceptOrderFrom+' data-acceptOrderTo='+recentExprComs[0].acceptOrderTo+' data-indexId=0>',
                            '<div class="am-list-thumb" style="margin-right: .12rem;">',
                            '<img src="'+recentExprComs[0].merchantLogo+'" style="border-radius: .04rem;width: .45rem;height: .45rem;border: 0.01rem solid #f5f5f9;" />',
                            '</div>',
                            '<div class="am-list-content am-ft-12">'+recentExprComs[0].merchantName+'</div>',
                            '<div class="am-list-arrow" aria-hidden="true" style="margin-right: 0rem;">',
                            '<span class="am-icon arrow horizontal"></span>',
                            '</div>',
                            '</div>',
                            '</div>',
                            '</div>'
                        ].join('');
                    }else if(recentExprComs.length==2){
                        for(var i=0;i<recentExprComs.length;i++){
                            xHtml+=['<div class="am-flexbox-item am-ft-center am-ft-ellipsis am_express_modular">',
                                '<div class="am-list twoline" style="padding: .12rem 0 .12rem;">',
                                '<div data-id='+recentExprComs[i].id+' data-merchantCode='+recentExprComs[i].merchantCode+' data-merchantName='+recentExprComs[i].merchantName+' data-cityCode='+cityCode+' data-acceptOrderFrom='+recentExprComs[i].acceptOrderFrom+' data-acceptOrderTo='+recentExprComs[i].acceptOrderTo+' data-indexId=0 class="am-list-item kd-common-express" style="padding:.0rem;background-size: 0;">',
                                '<div class="am-list-thumb" style="margin-right: .0rem;margin-left: .15rem;"><img src="'+recentExprComs[i].merchantLogo+'" class="kd-logo" /></div>',
                                '<div class="am-list-content">',
                                '<div class="am-list-title am-ft-12" style="padding-left: .12rem;">'+recentExprComs[i].merchantName+'</div>',
                                '</div>',
                                '</div>',
                                '</div>',
                                '</div>'
                            ].join('');
                        }
                    }else if(recentExprComs.length==3){
                        for(var i=0;i<recentExprComs.length;i++){
                            xHtml+=['<div class="am-flexbox-item am-ft-center am-ft-ellipsis am_express_modular kd-express3">',
                                '<div class="kd-common-express" data-id='+recentExprComs[i].id+' data-merchantCode='+recentExprComs[i].merchantCode+' data-merchantName='+recentExprComs[i].merchantName+' data-cityCode='+cityCode+' data-acceptOrderFrom='+recentExprComs[i].acceptOrderFrom+' data-acceptOrderTo='+recentExprComs[i].acceptOrderTo+' data-indexId=0>',
                                '<img class="am-ft-center kd-logo" src="'+recentExprComs[i].merchantLogo+'" />',
                                '<p class="am-ft-center am-ft-black am-ft-12" style="padding-top: .12rem;">'+recentExprComs[i].merchantName+'</p>',
                                '</div>',
                                '</div>'
                            ].join('');
                        }
                    }
                    xHtml +='</div>';
                   // $(".express_content").html(xHtml);
                    $(".kd-common-express").click(function(){
                        var merchantId = $(this).attr("data-id");
                        var merchantCode = $(this).attr("data-merchantCode");
                        var merchantName = $(this).attr("data-merchantName");
                        var acceptOrderFrom = $(this).attr("data-acceptOrderFrom");
                        var acceptOrderTo = $(this).attr("data-acceptOrderTo");
                        ant.setSessionData({
                            data: {
                                cityCode:cityCode,
                                epCompanyId:merchantId,
                                epCompanyNo:merchantCode,
                                epCompanyName:merchantName,
                                acceptOrderFrom:acceptOrderFrom,
                                acceptOrderTo:acceptOrderTo
                            }
                        });
                      pushWindow('address-information.html',true);
                    });
                }else{
                    $(".commonlyex_title").css({"border-top":"0"});
                }
                //常用功能
                if(sendApps!=null){
                    //$(".exprComsTitle").show();
                    var ssHtml='',fsHtml='';
                    for(var j=0;j<sendApps.length;j++){
                        ssHtml='<div data-url="'+sendApps[j].linkUrl+'" class="am-list-item kd-item kd-url" style="line-height:0.895rem;height:0.895rem; padding-bottom: .13rem;padding-top: .08rem;padding-right:0.06rem;">';
                        if(j%2){
                            sHtml+='<div class="kd-flexbox-right">';

                        }else{
                            sHtml+='<div class="kd-flexbox-left">';
                        }
                        if(sendApps[j].icon!=''){
                            sHtml+='<div class="kd-icon"><img src="'+sendApps[j].icon+'"></div>';
                        }
						if(j==sendApps.length-1){
							fsHtml='<div class="am-list-title kd-title" style="font-size:.16rem;">'+sendApps[j].name+'</div>';
						}else{
							fsHtml='<div class="am-list-title kd-title">'+sendApps[j].name+'</div>';
						}
                        sHtml+=['<div class="am-list twoline" style="padding:0rem;">',
                            ssHtml,
                            '<div class="am-list-thumb"><img src="'+sendApps[j].logo+'" /></div>',
                            '<div class="am-list-content">',
                            fsHtml,
                            '<div class="am-list-brief kd-content" style="margin-top: .07rem;color:#a4a9b0">'+sendApps[j].description+'</div>',
                            '</div>',
                            '</div>',
                            '</div>'
                        ].join('');
                        sHtml+='</div>';
                    }
                    $(".am_express_list").html(sHtml);
                    $(".kd-url").click(function(){
                        var url = $(this).attr("data-url");
                        ant.pushWindow({
                            url: ""+url+""
                        });
                    });
                    if($(window).width()<=320){
                      $(".am_express_list .twoline .am-list-thumb img").css({"width":".3rem","height":".28rem"});
                      $(".am_express_list .twoline .am-list-content .kd-title").css({"font-size":".16rem","white-space":"normal"});
                    }
                }else{
                    $(".exprComsTitle").hide();
                }

                //运营图片
              promotion(cityCode,indexUid);

            }
            // console.log("notPaidOrderNo :"+data.result.notPaidOrderNo);
            // console.log("notPaidRemindCnt :"+data.result.notPaidRemindCnt);
              setTimeout(function(){
                    notPaidOrder(data.result.notPaidOrderNo,data.result.notPaidRemindCnt);
              },500);
        });



    }
    //获取城市
    function getCity(city,cityCode){
        ant.call('getCities', {
            currentCity: city,
            adcode:cityCode,
            needHotCity:true,
            customHotCities:[{name:"杭州",adcode:"330100",pinyin:"hangzhou"},{name:"北京",adcode:"110100",pinyin:"beijing"},{name:"上海",adcode:"310100",pinyin:"shanghai"},{name:"深圳",adcode:"440300",pinyin:"shenzhen"},{name:"广州",adcode:"440100",pinyin:"guangzhou"}]
        }, function (result) {

            // ant.call('setTitle', {
            //     title: JSON.parse(JSON.stringify(result.city)),
            // });

            cityCode = JSON.parse(JSON.stringify(result.adcode));
            //天津郊县、重庆郊县、上海郊县、
            if(cityCode == '120200'){
                cityCode = '120100';
                $("#cityTitle").html('天津');
            }else if(cityCode == '500200'){
                cityCode = '500100';
                $("#cityTitle").html('重庆');
            }else  if(cityCode == '310200'){
                cityCode = '310100';
                $("#cityTitle").html('上海');
            }else{
                $("#cityTitle").html( JSON.parse(JSON.stringify(result.city)));
            }

             $("#cityClick img").attr("src","https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/syca_icon.png");
            initStateComfirmData(cityCode);
        });
    }
});
