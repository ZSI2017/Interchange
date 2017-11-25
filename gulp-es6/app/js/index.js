showLoading();
Zepto(function ($) {
    FastClick.attach(document.body);
    //清空seesion
    clearSeesion();
    var resumeFlag = false;
    var fromLocationFlag = false; // 判断是否从选择城市页面返回
    window.getLocationReady = false; //判断选择城市页面的数据是不成功返回了
    ant.on('resume', function (event) {
//       let name='守候'
// let sex='男'
// let info= {name, sex}
// console.log(info)
        clearSeesion();
        showLoading();
        resumeFlag = true;
        let intervalCount = 0;
        // promotion(cityCode,indexUid);  //
        var myInterval = setInterval(function () {
            intervalCount++;
            if ((fromLocationFlag && window.getLocationReady) || (!fromLocationFlag) || intervalCount > 3) {
                fromLocationFlag = false;
                // alert(window.cityCode);
                window.getLocationReady = false;
                initStateComfirmData(window.cityCode);
                window.clearInterval(myInterval);
            }

        }, 600);
    });
    var city,
        adcode,
        auth_code;

    // 点击帮助中心
    clickStatus.bind($(".help_center"))();
    $(".help_center").on("click", function () {
        BizLog.call('info', {
            spmId: "a106.b2097.c4574.d7081",
            actionId: 'clicked'
        });
        pushWindow("setting.html", true)
    });
    // 点击我的订单
    $(".my_order").on("click", function () {
        BizLog.call('info', {
            spmId: "a106.b2097.c4574.d7082",
            actionId: 'clicked'
        });
        pushWindow("alipays://platformapi/startapp?appId=20000754&url=%2Fapp%2Fsrc%2FexpressRecord.h" +
                "tml%3Ffrom%3DSendEXClient%26externalReferer%3D1%26noTabType%3DsendTab&appClearTo" +
                "p=false&startMultApp=YES",
        true);
    });
    // 点击我的实名码
    $(".my_namecode").on("click", function () {
        // BizLog.call('info', {     spmId: "a106.b2097.c4574.d7082",     actionId:
        // 'clicked' });
        pushWindow("https://custweb.alipay.com/realname/qrcode", true);
    });

    document.addEventListener('AlipayJSBridgeReady', function () {
        // AlipayJSBridge.call("getAuthCode",{     scopeNicks:['auth_base']
        // //主动授权：auth_user，静默授权：auth_base },function(result){
        // auth_code=result.authcode;     getAuth_Code(auth_code); });

        var authData = {
            scopeNicks: ['auth_base'] //主动授权：auth_user，静默授权：auth_base
        }

        if (env == "sit") {
            authData = {
                scopeNicks: ['auth_base'], //主动授权：auth_user，静默授权：auth_base
                appId: "2017010904949252"
            }
        }
        // console.log("authData :" + authData)

        AlipayJSBridge
            .call("getAuthCode", authData, function (result) {
                auth_code = result.authcode;
                getAuth_Code(auth_code);
            });
    });
    // $("#cityTitle").html('定位中...'); 添加点击态
    clickStatus.bind($("#cityClick"))();
    $("#cityClick").click(function () {
        BizLog.call('info', {
            spmId: "a106.b2097.c4574.d7080",
            actionId: 'clicked'
        });
        $(document.body).hide();
        fromLocationFlag = true;
        getCity(city, window.cityCode);
    });

    //获取auth_code
    function getAuth_Code(auth_code) {
        var info = {
            "authCode": auth_code
        };
        var xhrurl = jUrl + '/ep/user/base_auth';
        $.axs(xhrurl, info, function (data) {
            if (data.meta.success) {
                alertLocation();
            }
        });
    }
    //定位窗口
    function alertLocation() {
        ant
            .call('getLocation', function (result) {
                if (result.error) {
                    //定位失败
                    $("#cityTitle").html('定位中...');
                    dingweiInfo();
                } else {
                    //定位成功
                    city = JSON.parse(JSON.stringify(result.city));
                    adcode = JSON.parse(JSON.stringify(result.adcode));
                    window.cityCode = getcityCodeBycountyCode(adcode);
                    if (city.indexOf("市") > 0) {
                        city = city.substr(0, city.length - 1);
                    } else if (city.indexOf("地区") > 0) {
                        city = city.substr(0, city.length - 2);
                    }
                    $("#cityTitle").html(city);
                    siteLocation();
                    initStateComfirmData(window.cityCode);
                }
            });
    }

    //定位不成功从数据库取
    function dingweiInfo() {
        var info = {};
        var xhrurl = jUrl + '/ep/get_last_city';
        $.axs(xhrurl, info, function (data) {
            if (data.meta.success) {
                if (data.result && data.result.cityCode) {
                    // console.log(data.result.cityCode);
                    window.cityCode = data.result.cityCode;
                    // var areaName = getAreaNameByCode(window.cityCode); var areaName =
                    // getCityNameByCode(window.cityCode);
                    var areaName = data.result.cityName;
                    // console.log("areaName "+areaName[1]);
                    if (areaName) {
                        // var names = areaName.split(" "); var city = names[1];
                        var city = areaName;
                        if (city.indexOf("市") > 0) {
                            city = city.substr(0, city.length - 1);
                        } else if (city.indexOf("地区") > 0) {
                            city = city.substr(0, city.length - 2);
                        }
                        $("#cityTitle").html(city);
                        siteLocation();
                    } else {
                        // alert(data.result.cityCode + " no name");
                    }

                    initStateComfirmData(window.cityCode);
                } else {
                    //获取选择城市
                    fromLocationFlag = true;
                    getCity(city, window.cityCode);
                }
            }
        });
    };
    function getCityNameByCode(citycode) {
        var length = iosCitys.length;
        var result = "";
        for (var i = 0; i < length; i++) {
            if (iosCitys[i].id == citycode) {
                result = iosCitys[i].value;
                break;
            }
        }
        //  console.log("getCityNameByCode：　＋"+result);
        return result;
    }
    //设置地点缓冲
    function siteLocation() {
        var cityTitle = $("#cityTitle").html();
        AlipayJSBridge.call('setSessionData', {
            data: {
                name: cityTitle
            }
        });
    };
    //定位确定拉取后台数据
    function initStateComfirmData(cityCode) {
        //  alert("initStateComfirmData: "+ cityCode)
        var info = {
            "pageId": indexUid,
            "cityCode": cityCode
        };
        var xhrurl = jUrl + '/ep/index_info';
        $.axs(xhrurl, info, function (data) {
            if (data.meta.success) {
                hideLoading();
                var serviceAuthStatus = data.result.serviceAuthStatus;
                ant.setSessionData({
                    data: {
                        serviceAuthStatus: serviceAuthStatus,
                        cityCode: cityCode
                    }
                });
                var xHtml = '',
                    sHtml = '',
                    recentExprComs = data.result.recentExprComs,
                    sendApps = data.result.sendApps;
                //常用快递
                if (recentExprComs != null) {
                    xHtml += '<div class="am-ft-gray commonlyex_title kd-common">常用快递</div>';
                    xHtml += '<div class="am-flexbox commonly_express">';
                    if (recentExprComs.length == 1) {
                        xHtml += [
                            '<div class="am-list sicon" style="width:100%;padding-top: .12rem;padding-bottom:' +
                                    ' .1rem;">',
                            '<div class="am-list-body">',
                            '<div class="am-list-item kd-common-express" style="padding: 0rem .15rem;backgrou' +
                                    'nd: #fff;" data-id=' + recentExprComs[0].id + ' data-merchantCode=' + recentExprComs[0].merchantCode + ' data-merchantName=' + recentExprComs[0].merchantName + ' data-cityCode=' + cityCode + ' data-acceptOrderFrom=' + recentExprComs[0].acceptOrderFrom + ' data-acceptOrderTo=' + recentExprComs[0].acceptOrderTo + ' data-indexId=0>',
                            '<div class="am-list-thumb" style="margin-right: .12rem;">',
                            '<img src="' + recentExprComs[0].merchantLogo + '" style="border-radius: .04rem;width: .45rem;height: .45rem;border: 0.01rem soli' +
                                    'd #f5f5f9;" />',
                            '</div>',
                            '<div class="am-list-content am-ft-12">' + recentExprComs[0].merchantName + '</div>',
                            '<div class="am-list-arrow" aria-hidden="true" style="margin-right: 0rem;">',
                            '<span class="am-icon arrow horizontal"></span>',
                            '</div>',
                            '</div>',
                            '</div>',
                            '</div>'
                        ].join('');
                    } else if (recentExprComs.length == 2) {
                        for (var i = 0; i < recentExprComs.length; i++) {
                            xHtml += [
                                '<div class="am-flexbox-item am-ft-center am-ft-ellipsis am_express_modular">', '<div class="am-list twoline" style="padding: .12rem 0 .12rem;">', '<div data-id=' + recentExprComs[i].id + ' data-merchantCode=' + recentExprComs[i].merchantCode + ' data-merchantName=' + recentExprComs[i].merchantName + ' data-cityCode=' + cityCode + ' data-acceptOrderFrom=' + recentExprComs[i].acceptOrderFrom + ' data-acceptOrderTo=' + recentExprComs[i].acceptOrderTo + ' data-indexId=0 class="am-list-item kd-common-express" style="padding:.0rem;back' +
                                        'ground-size: 0;">',
                                '<div class="am-list-thumb" style="margin-right: .0rem;margin-left: .15rem;"><img' +
                                        ' src="' + recentExprComs[i].merchantLogo + '" class="kd-logo" /></div>',
                                '<div class="am-list-content">',
                                '<div class="am-list-title am-ft-12" style="padding-left: .12rem;">' + recentExprComs[i].merchantName + '</div>',
                                '</div>',
                                '</div>',
                                '</div>',
                                '</div>'
                            ].join('');
                        }
                    } else if (recentExprComs.length == 3) {
                        for (var i = 0; i < recentExprComs.length; i++) {
                            xHtml += [
                                '<div class="am-flexbox-item am-ft-center am-ft-ellipsis am_express_modular kd-ex' +
                                        'press3">',
                                '<div class="kd-common-express" data-id=' + recentExprComs[i].id + ' data-merchantCode=' + recentExprComs[i].merchantCode + ' data-merchantName=' + recentExprComs[i].merchantName + ' data-cityCode=' + cityCode + ' data-acceptOrderFrom=' + recentExprComs[i].acceptOrderFrom + ' data-acceptOrderTo=' + recentExprComs[i].acceptOrderTo + ' data-indexId=0>',
                                '<img class="am-ft-center kd-logo" src="' + recentExprComs[i].merchantLogo + '" />',
                                '<p class="am-ft-center am-ft-black am-ft-12" style="padding-top: .12rem;">' + recentExprComs[i].merchantName + '</p>',
                                '</div>',
                                '</div>'
                            ].join('');
                        }
                    }
                    xHtml += '</div>';
                    // $(".express_content").html(xHtml);
                    $(".kd-common-express").click(function () {
                        var merchantId = $(this).attr("data-id");
                        var merchantCode = $(this).attr("data-merchantCode");
                        var merchantName = $(this).attr("data-merchantName");
                        var acceptOrderFrom = $(this).attr("data-acceptOrderFrom");
                        var acceptOrderTo = $(this).attr("data-acceptOrderTo");
                        ant.setSessionData({
                            data: {
                                cityCode: cityCode,
                                epCompanyId: merchantId,
                                epCompanyNo: merchantCode,
                                epCompanyName: merchantName,
                                acceptOrderFrom: acceptOrderFrom,
                                acceptOrderTo: acceptOrderTo
                            }
                        });
                        pushWindow('address-information.html', true);
                    });
                } else {
                    $(".commonlyex_title").css({"border-top": "0"});
                }

                //常用功能
                if (sendApps != null) {
                    //$(".exprComsTitle").show();
                    var ssHtml = '',
                        fsHtml = '',
                        pHtml = '',
                        internalBorder = "";
                    Ft_icon = "";
                    for (var j = 0; j < sendApps.length; j++) {
                        if (j == 0) {
                            internalBorder = " index-background-size-top1";
                        } else if (j == 1) {
                            internalBorder = " index-background-size-top2";
                        } else if (j >= sendApps.length - 2) {
                            if (sendApps.length % 2 == 1 && j == (sendApps.length - 2)) {
                                internalBorder = " index-background-size-right";
                            } else {
                                internalBorder = " index-background-size-zero";
                            }
                        } else {
                            if (j % 2 == 0) {
                                internalBorder = " index-background-size-left"
                            } else {
                                internalBorder = " index-background-size-right"
                            }
                        }

                        ssHtml = '<div data-url="' + sendApps[j].linkUrl + '" class="am-list-item kd-item-padding kd-url' + internalBorder + '" style="line-height:0.64rem;height:0.64rem;padding-bottom: 0px;margin-top: .065' +
                                'rem;padding-right:0.06rem;">';
                        if (j % 2) {
                            sHtml += '</div><div class="kd-flexbox-right" style="float:left;border:0;">';
                        } else {
                            sHtml += '</div><div class="kd-flexbox-right eyeline-right" style="float:left;border:0;pad' +
                                    'ding-right:-0.015rem;">';
                        }
                        if (sendApps[j].icon != '') {
                            sHtml += '<img class="unit-kd-icon" style="width:0.31rem;height:0.14rem;z-index:999;" src=' +
                                    '"' + sendApps[j].icon + '">';
                        }

                        // if(j==sendApps.length-1){ 	fsHtml='<div class="am-list-title kd-title"
                        // style="font-size:.16rem;">'+sendApps[j].name+'</div>'; }else{
                        fsHtml = '<div class="am-list-title kd-title" style="font-size:.14rem;background-color:#ff' +
                                'f;">' + sendApps[j].name + '</div>';
                        // }
                        sHtml += [
                            '<div class="am-list twoline" style="padding:0rem;">', ssHtml, pHtml, '<div class="am-list-thumb" style="margin-top:-0.08rem;margin-left:0.01rem;"><img' +
                                    ' style="width:0.3rem;height:0.3rem;" src="' + sendApps[j].logo + '" /></div>',
                            '<div class="am-list-content" style="align-self:flex-start;margin-top:.08rem;">',
                            fsHtml,
                            '<div class="am-list-brief kd-content" style="margin-top: -0.02rem;color:#a4a9b0;' +
                                    'font-size:.12rem;">' + sendApps[j].description + '</div>',
                            '</div>',
                            '</div>',
                            '</div>'
                        ].join('');
                        sHtml += '</div>';
                    }
                    $(".am_express_list").html(sHtml);
                    $(".kd-url").click(function () {
                        var number = $(".kd-url").index(this) + 1;
                        var url = $(this).attr("data-url");
                        var seedid = "";
                        if ($(this).find(".kd-title").text() == "预约寄件") {
                            seedid = "a106.b2097.c4575.1"
                        } else if ($(this).find(".kd-title").text() == "菜鸟裹裹") {
                            seedid = "a106.b2097.c4575.2"
                        } else if ($(this).find(".kd-title").text() == "同城直送") {
                            seedid = "a106.b2097.c4575.3"
                        } else if ($(this).find(".kd-title").text() == "同城货运") {
                            seedid = "a106.b2097.c4575.4"
                        } else if ($(this).find(".kd-title").text() == "附近快递资源") {
                            seedid = "a106.b2097.c4575.5"
                        } else if ($(this).find(".kd-title").text() == "选快递下单") {
                            seedid = "a106.b2097.c4575.6"
                        }
                        $(this).attr("data-spmv", seedid);
                        if (seedid == "") {} else {
                            BizLog.call('info', {
                                spmId: seedid,
                                actionId: 'clicked',
                                params: {
                                    ToURL: url,
                                    title: $(this)
                                        .find(".kd-title")
                                        .text()
                                }
                            });
                        }

                        pushWindow(url, true);
                    });
                } else {
                    $(".exprComsTitle").hide();
                }
                //运营图片 和 公告 缓存加载
                getPromotionAndNoticeCache(cityCode, indexUid)
            }
            setTimeout(function () {
                notPaidOrder(data.result.notPaidOrderNo, data.result.notPaidRemindCnt);
            }, 500);
            // }
        });

    }
    /**
     *  通过缓存获取运营位和公告的 公共方法
     *  @method getPromotionAndNoticeCache
     *  @param  {String}                   cityCode 当前城市code
     *  @param  {String}                   pageId 当前页面pageID
     *  @return {null}                            无返回值
     */
    function getPromotionAndNoticeCache(cityCode, pageId) {
        var internalPageId = pageId;
        ant.getSessionData({
            keys: [
                'indexPromotion' + cityCode,
                "indexNotice" + cityCode
            ]
        }, function (result) {
            var indexPromotion = result.data['indexPromotion' + cityCode];
            var indexNotice = result.data['indexNotice' + cityCode];
            getPromotion(indexPromotion, cityCode, 'indexPromotion', internalPageId);
            getIndexNotice(indexNotice, cityCode, "indexNotice", internalPageId);
        })
    }

    /**
     *  判断是否使用缓存数据还是请求接口数据获取运营位
     *  @method getPromotion
     *  @param  {Array}     indexPromotion 缓存中的运营位数据
     *  @param  {String}     cityCode       当前城市code
     *  @param  {String}     cacheName      传入缓存名
     *  @param  {String}     internalPageId 当前页面的PageId
     *  @return {null}                     无返回值
     */
    function getPromotion(indexPromotion, cityCode, cacheName, internalPageId) {
        if (indexPromotion || indexPromotion === null) {
            if (indexPromotion === null) {
                $(".promotion-txt").hide();
                return;
            } else {
                if (Array.isArray(indexPromotion)) {} else {
                    indexPromotion = JSON.parse(indexPromotion);
                }
            }
            setPromotionImg(indexPromotion, "a106.b2097.c4576")
        } else {
            promotion(cityCode, internalPageId, "a106.b2097.c4576", cacheName);
        }
    }
    // 获取公告
    /**
     *  获取公告
     *  @method getIndexNotice
     *  @param  {String}       indexNotice    缓存中的公告内容
     *  @param  {String}       cityCode       当前城市的cityCode
     *  @param  {String}       cacheName      存入缓存的名
     *  @param  {String}       internalPageId 当前页面的pageId
     *  @return {null}                      无返回值
     */
    function getIndexNotice(indexNotice, cityCode, cacheName, internalPageId) {
        if (indexNotice || indexNotice === null) {
            if (indexNotice === null) {
                $(".header_notification").hide();
                return;
            }
            $(".header_notification").show();
            window.cancelAnimationFrame(window.stop);
            $(".marquee3k").empty();
            $(".am-notice-content").empty();
            $(".am-notice-content").html('<div class="marquee3k" data-speed="0.4" data-pausable="bool">\
                 ' +
                    '                 <h1 style="font-size:.14rem;font-weight:normal">\
             ' +
                    '                      <span class="noticeval" >' + indexNotice + '</span>\
                                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                    '&nbsp;&nbsp;\
                                  </h1>\
                         ' +
                    '         </div>')
            Marquee3k.init()
            Marquee3k.refreshAll();
        } else {
            getNotice(cityCode, internalPageId, "a106.b2097.c4576", cacheName);
        }
    }
    //获取城市
    function getCity(city, cityCode) {
        ant
            .call('getCities', {
                currentCity: city,
                adcode: cityCode,
                needHotCity: true,
                customHotCities: [
                    {
                        name: "杭州",
                        adcode: "330100",
                        pinyin: "hangzhou"
                    }, {
                        name: "北京",
                        adcode: "110100",
                        pinyin: "beijing"
                    }, {
                        name: "上海",
                        adcode: "310100",
                        pinyin: "shanghai"
                    }, {
                        name: "深圳",
                        adcode: "440300",
                        pinyin: "shenzhen"
                    }, {
                        name: "广州",
                        adcode: "440100",
                        pinyin: "guangzhou"
                    }
                ]
            }, function (result) {

                // ant.call('setTitle', {     title: JSON.parse(JSON.stringify(result.city)),
                // });

                window.cityCode = JSON.parse(JSON.stringify(result.adcode));
                //天津郊县、重庆郊县、上海郊县、
                if (window.cityCode == '120200') {
                    window.cityCode = '120100';
                    $("#cityTitle").html('天津');
                    siteLocation();
                } else if (window.cityCode == '500200') {
                    window.cityCode = '500100';
                    $("#cityTitle").html('重庆');
                    siteLocation();
                } else if (window.cityCode == '310200') {
                    window.cityCode = '310100';
                    $("#cityTitle").html('上海');
                    siteLocation();
                } else {
                    $("#cityTitle").html(JSON.parse(JSON.stringify(result.city)));
                    siteLocation();
                }
                $("#cityClick img").attr("src", "https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/citydown.png");
                window.cityCode = getcityCodeBycountyCode(window.cityCode);
                window.getLocationReady = true;
                //  alert(" window.cityCode "+window.cityCode);
                // initStateComfirmData(window.cityCode);
            });
    }
});
