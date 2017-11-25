Zepto(function ($) {
    ant.call('setTitle', {title: '选择快递'});
    window.isNotResume = true;
    // FastClick.attach(document.body);
    window.isServicing = getUrlParam("isServicing") || "2"; // 判断如果已经选择了快递后，是否在服务区！
    // alert(window.isServicing !="1");
    ant.on('resume', function (event) {
        window.isNotResume = false;
        resumePage();
    });

    window.pageNo = 1; //  默认拉取 第一页的数据
    window.nextPagination = false; // 默认是不执行 下一页 分页
    var filterCompanyId = [] //  过滤到快递公司
    // BizLog.call('info',{     spmId:"a106.b2108",     actionId:'pageMonitor' });
    window.prePagination = false; // 默认是不执行 上一页 分页

    // 这里实现分页效果 $(window).bind("scroll",function(){   var  contentHeight  =
    // $(".express_content").height();   var  clientHeight   = $(window).height();
    // var  scrollHeight  = $(window).scrollTop();   console.log(" contentHeight
    // "+contentHeight +" clientHeight "+clientHeight+" scrollHeight:
    // "+scrollHeight);   var total = contentHeight - clientHeight - scrollHeight
    // console.log("total "+(contentHeight - clientHeight - scrollHeight));
    // console.log(contentHeight - clientHeight - scrollHeight<40);
    // if(window.nextPagination){       if(contentHeight - clientHeight -
    // scrollHeight<10){    // 加载下一页           window.nextPagination = false;
    // window.pageNo++;             $(".am-loading").show(); Express.init();       }
    //   } });

    Express.init();
    function resumePage() {

        ant.setSessionData({
            data: {
                // epCompanyId:'',
                epCompanyNo: '',
                epCompanyName: '',
                acceptOrderFrom: '',
                acceptOrderTo: '',
                productTypeId: "",
                productTypeName: "",
                presetWeight: "",
                presetWeightPrice: "",
                extraWeightUnit: "",
                extraWeightPrice: "",
                goodsOneValue: "",
                goodsOneIndex: "",
                goodstypeValue: "",
                dayValue: "",
                timeValue: "",
                timeDate: "",
                remarkContent: ""
            }
        });
        if (window.swiperflag) {
            // promotion(window.cityCode,"BM1010","a106.b2108.c4627");
        }
        Express.init();
        // hideLoading();
    }
});
var Express = new Object({
    init: function () {
        showLoading();
        ant.getSessionData({
            keys: [
                'filterCompanyId',
                'cityCode',
                'sendAreaCode',
                'recAreaCode',
                'epCompanyId',
                'epCompanyName',
                'addressDayValue',
                'addressTimeValue',
                'addressGoodsOneValue',
                'sendAddress'
            ]
        }, function (result) {
            filterCompanyId = result.data.filterCompanyId;
            window.cityCode = result.data.cityCode;
            var snderDstrCode = result.data.sendAreaCode;
            var sendAddress = result.data.sendAddress;
            var rcvrDstrCode = result.data.recAreaCode;
            var weight = (parseFloat(result.data.addressGoodsOneValue) * 1000).toString();
            var addressDayValue = result.data.addressDayValue;
            var bookedDay = addressDayValue == "今天"
                ? "TDY"
                : (addressDayValue == "明天"
                    ? "TOM"
                    : "AFT");
            var bookedHour = parseFloat(result.data.addressTimeValue).toString();

            var nextUrl = "information-fill.html"

            window.swiperflag = true;
            //判断 是否从选快递下单页面转来
            console.log("是否从选快递下单页面转来" + result.data.epCompanyId)
            //  alert(window.isServicing);
            if (result.data.epCompanyId && result.data.epCompanyId != "" && window.isServicing != "1") {

                nextUrl = "information-fill-placeorder.html";
                $(".sorrynotic").show();
                $("#oldExpressName").html(result.data.epCompanyName);
                window.swiperflag = false;
                $(".express_content").css("padding-bottom", "0");
            }
            var info = {
                cityCode: window.cityCode,
                snderDstrCode: snderDstrCode,
                senderAddress: sendAddress,
                rcvrDstrCode: rcvrDstrCode,
                weight: weight,
                bookedDay: bookedDay,
                bookedHour: bookedHour
            };
            console.log("cityCode " + window.cityCode);
            console.log("snderDstrCode " + snderDstrCode);
            console.log("sendAddress " + sendAddress);
            console.log("rcvrDstrCode " + rcvrDstrCode);
            console.log("weight " + weight);
            console.log("bookedDay " + bookedDay);
            console.log("bookedHour " + bookedHour);

            var xhrurl = jUrl + '/ep/express_com/list/v2';
            $.axs(xhrurl, info, function (result) {
                console.log(result)
                hideLoading();
                if (result.meta.success) {
                    // var expresshtml = '',
                    var xHtml = '';
                    var tagval = '';
                    var listOperation = '';
                    if ((result.result.serviceMap.length == 0) && (result.result.nonServiceMap.length == 0)) {
                        //暂时没有可服务的快递公司 服务范围扩展中，敬请期待
                        $(".sorrynotic").hide();
                        $(".select_expresscontent_empty").show();
                        window.swiperflag = false;
                    } else {
                        $(".select_expresscontent_empty").hide();
                        //  实现分页 加载 的判断
                        var paginationArr = result.result;
                        //  if(paginationArr.length>=11){     paginationArr.length = 10;       // 表示下一页
                        // 还有数据     window.nextPagination = true;
                        //
                        //  }else {      window.nextPagination = false;      $(".am-loading").hide();  }

                        var filterTemp = filterCompanyId;

                        if (Object.prototype.toString.call(filterTemp) === "[object Array]") {} else {
                            if (filterTemp.length == 2) {
                                filterTemp = [];
                            } else {
                                filterTemp = filterCompanyId
                                    .slice(1, filterCompanyId.length - 1)
                                    .split(",");
                            }
                        }
                        // alert(Object.prototype.toString.call(filterTemp)) var aadd =
                        // filterTemp[0].replace(/\"/g,''); if(filterTemp[0]){
                        // alert(filterTemp[0].replace(/\"/g,'').replace(/\\/g,'')); }

                        showList(paginationArr, filterTemp, bookedHour, addressDayValue);

                    }
                    if (window.swiperflag) {
                        if (window.isNotResume) {
                            promotion(window.cityCode, "BM1010", "a106.b2108.c4627");
                            getNotice(window.cityCode, "BM1010", "a106.b2108.c4625")
                        }
                    }
                    // $(".management_list
                    // .typelink:nth-child(n)").css({"padding-bottom":"0.005rem","padding-top":"0"})
                    // ; $(".management_list .typelink:first-child").css("padding-top","0.005rem");

                    $(".express_content").show();
                    if (isAndroid) {
                        $(".borderTop").css("border-top", "1px solid #ddd");
                        $(".bubble_font span").css({
                            "border": "1px solid #ff8200",
                            "padding-top": "0.02rem",
                            "padding-bottom": "0.015rem",
                            "height": "auto",
                            "line-height": "1",
                            "font-size": ".1rem"
                        });
                    }

                    //判断是否有多个快递产品类型
                    $(".management_list")
                        .unbind()
                        .on("click", ".typelink", function () {
                            var number = $(".typelink").index(this) + 1;
                            BizLog.call('info', {
                                spmId: "a106.b2108.c4626." + number,
                                actionId: 'clicked',
                                params: {
                                    CompName: $(this)
                                        .find(".am-list-title .compName")
                                        .text()
                                }
                            });
                            var epCompanyId = $(this).attr("epCompanyId"),
                                epCompanyNo = $(this).attr("epCompanyNo"),
                                epCompanyName = $(this).attr("epCompanyName"),
                                acceptOrderFrom = $(this).attr("acceptOrderFrom"),
                                acceptOrderTo = $(this).attr("acceptOrderTo"),
                                slogan = $(this).attr("slogan"),
                                imgsrc = $(this).attr("imgsrc"),
                                tag = $(this).attr("tag");
                            ant.setSessionData({
                                data: {
                                    epCompanyId: epCompanyId,
                                    epCompanyNo: epCompanyNo,
                                    epCompanyName: epCompanyName,
                                    acceptOrderFrom: acceptOrderFrom,
                                    acceptOrderTo: acceptOrderTo,
                                    slogan: slogan,
                                    imgsrc: imgsrc,
                                    tag: tag
                                }
                            });
                            // var info = {     "id" : JSON.parse(epCompanyId),     "snderDstrCode" :
                            // snderDstrCode,     "rcvrDstrCode" : rcvrDstrCode };
                            $(document.body).hide();
                            //判断点击时间是可服务还是不可服务
                            console.log('跳转页面之前');
                            if ($(this).find('.serverTime').length && $(this).find('.serverTime').length > 0) {
                                ant.pushWindow({url: "information-fill.html?isCompanyService=0"});
                            } else {
                                ant.pushWindow({url: "information-fill.html?isCompanyService=1"});
                            }
                        });
                } else {
                    alert(result.meta.msg);
                }

            });
        });
    }
});

function showList(paginationArr, filterTemp, bookedHour, addressDayValue) {
    var expresshtml = '';
    //可服务列表
    if (paginationArr.serviceMap.length != 0) {
        expresshtml += '<div class="hairline-bottom" style="font-size: .13rem;background:#f5f5f9;padding' +
                ':0.075rem 0.145rem 0.07rem 0.14rem;"><span class="am-ft-gray">' + addressDayValue + bookedHour + '点左右可服务</span><span class="am-ft-orange" style="display:inline-block;float:right;' +
                '">价格均为预估值</span></div>'
    }
    $
        .each(paginationArr.serviceMap, function (i) {
            var isFilter = false;

            for (var j = 0; j < filterTemp.length; j++) {
                if (this.code == filterTemp[j].replace(/\"/g, '').replace(/\\/g, '')) {
                    isFilter = true;
                }
            };
            if (isFilter) {
                return;
            };
            var taghtml = '',
                sHtml = '';
            var splitval = this
                .tag
                .substring(0, this.tag.length - 1);
            tagval = splitval.split(",");
            $.each(tagval, function (i) {
                taghtml += '<span style="height:.11rem;line-height: .11rem;">' + tagval[i] + '</span>'
            })
            if (this.price != '' && this.price != null) {
                sHtml = '<div class="am-ft-orange" style="display:block;;font-size: .15rem;">' + this.price + '元</div>';
            }
            var spmv_i = i + 1;
            if (i == paginationArr.serviceMap.length - 1) {
                xHtml = '<div epCompanyId="' + this.id + '" epCompanyNo="' + this.code + '" epCompanyName="' + this.name + '" acceptOrderFrom="' + this.acceptOrderFrom + '" acceptOrderTo="' + this.acceptOrderTo + '" imgsrc="' + this.logo + '" slogan="' + this.slogan + '" tag="' + this.tag + '" class="am-list-item typelink " style="height:0.885rem;margin-left:-0.01rem;bac' +
                        'kground-size: 0 0,0 0,0 0,0 0;" data-spmv="a106.b2108.c4626.' + spmv_i + '">';
            } else {
                xHtml = '<div epCompanyId="' + this.id + '" epCompanyNo="' + this.code + '" epCompanyName="' + this.name + '" acceptOrderFrom="' + this.acceptOrderFrom + '" acceptOrderTo="' + this.acceptOrderTo + '" imgsrc="' + this.logo + '" slogan="' + this.slogan + '" tag="' + this.tag + '" class="am-list-item typelink" style="height:.885rem;margin-left:-0.01rem;" dat' +
                        'a-spmv="a106.b2108.c4626.' + spmv_i + '">';
            }
            expresshtml += xHtml + '<div class="am-list-thumb choice_leftlogo"><img src="' + this.logo + '" alt=""></div><div class="am-list-content" style="padding-top:.04rem;"><div cla' +
                    'ss="list_lineheight"><span class="compName" style="font-size:.16rem">' + this.name + '</span><span class="hot_icon hoticon' + this.hotStatus + '">热</span><span class="hot_icon newicon' + this.newStatus + '">新</span></div><span class="am-ft-gray advertisementvals" style="font-size:.14r' +
                    'em;padding-top: 0.04rem;padding-bottom: .01rem;">' + this.slogan + '</span><div class="am-ft-orange bubble_font" style="height:.135rem;line-height:.' +
                    '135rem;margin-top:0.005rem;margin-bottom:0.01rem;padding-top:0.01rem;">' + taghtml + '</div></div>' + sHtml + '<div class="am-list-arrow"><span class="am-icon horizontal" style="vertical-alig' +
                    'n:middle"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/' +
                    'indicator_icon.png"/></span></div></div>'
            BizLog.call('info', {
                spmId: "a106.b2108.c4626",
                actionId: 'exposure',
                params: {
                    CompName: this.name
                }
            });

        })
    // 不可服务列表
    if (paginationArr.nonServiceMap.length != 0 && paginationArr.serviceMap.length != 0) {
        expresshtml += '<div class="hairline-bottom hairline-top" style="font-size: .13rem;background:#f' +
                '5f5f9;padding:0.075rem 0.145rem 0.07rem 0.14rem;"><span class="am-ft-gray">' + addressDayValue + bookedHour + '点左右不可服务，选择后将匹配最早服务时间</span></div>'
    } else if (paginationArr.nonServiceMap.length != 0 && paginationArr.serviceMap.length == 0) {
        expresshtml += '<div style="background:#fff;height:2.065rem;text-align: center;"><img src="https' +
                '://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/sorry_pic.png" style="wid' +
                'th:0.88rem;height:0.88rem;margin:0.455rem auto 0.085rem;"/><br/><span style="fon' +
                't-size: .15rem;color:#888;">暂无公司' + addressDayValue + bookedHour + '点左右可服务</span></div>'
        expresshtml += '<div class="hairline-bottom hairline-top" style="font-size: .13rem;background:#f' +
                '5f5f9;padding:0.075rem 0.145rem 0.07rem 0.14rem;"><span class="am-ft-gray">建议从如下' +
                '公司选择</span><span class="am-ft-orange" style="display:inline-block;float:right;">' +
                '价格均为预估值</span></div>'
    }else{
        expresshtml += '<div class="hairline-top"></div>'
    }

    $
        .each(paginationArr.nonServiceMap, function (i) {
            var isFilter = false;

            for (var j = 0; j < filterTemp.length; j++) {
                if (this.code == filterTemp[j].replace(/\"/g, '').replace(/\\/g, '')) {
                    isFilter = true;
                }
            };
            if (isFilter) {
                return;
            };
            var taghtml = '',
                sHtml = '';
            var splitval = this
                .tag
                .substring(0, this.tag.length - 1);
            tagval = splitval.split(",");
            $.each(tagval, function (i) {
                taghtml += '<span style="height:.11rem;line-height: .11rem;">' + tagval[i] + '</span>'
            })
            if (this.price != '' && this.price != null) {
                sHtml = '<div class="am-ft-orange" style="display:block;;font-size: .15rem;">' + this.price + '元</div>';
            }
            var spmv_i = i + 1;
            // if(i==paginationArr.nonServiceMap.length-1){ xHtml='<div
            // epCompanyId="'+this.id+'" epCompanyNo="'+this.code+'"
            // epCompanyName="'+this.name+'" acceptOrderFrom="'+this.acceptOrderFrom+'"
            // acceptOrderTo="'+this.acceptOrderTo+'" imgsrc="'+this.logo+'"
            // slogan="'+this.slogan+'" tag="'+this.tag+'" class="am-list-item typelink"
            // style="height:.90rem;margin-left:-0.01rem;" data-spmv="a106.b2108.c4626.'+
            // spmv_i +'">'; }else{
            xHtml = '<div epCompanyId="' + this.id + '" epCompanyNo="' + this.code + '" epCompanyName="' + this.name + '" acceptOrderFrom="' + this.acceptOrderFrom + '" acceptOrderTo="' + this.acceptOrderTo + '" imgsrc="' + this.logo + '" slogan="' + this.slogan + '" tag="' + this.tag + '" class="am-list-item typelink" style="height:.885rem" data-spmv="a106.b2108.c46' +
                    '26.' + spmv_i + '">';
            // }
            expresshtml += xHtml + '<div class="am-list-thumb choice_leftlogo"><img src="' + this.logo + '" alt=""></div><div class="am-list-content" style="padding-top:.02rem;"><div cla' +
                    'ss="list_lineheight"><span class="compName" style="font-size:.16rem">' + this.name + '</span><span class="hot_icon hoticon' + this.hotStatus + '">热</span><span class="hot_icon newicon' + this.newStatus + '">新</span>'
            //merchantName数字过长时 serviceTimeDesc溢出导致页面滑动 用于控制serviceTimeDesc 字数 显示...
            if (this.name.length > 6 && (this.hotStatus == '1' || this.newStatus == '1')) {
                expresshtml += '<span class="serverTime" style="font-size:0.12rem;margin-left:-0.02rem;margin-to' +
                        'p:0.04rem;color:#a5a5a5;position:absolute;width:1.2rem;overflow:hidden;text-over' +
                        'flow: ellipsis;display: inline-block;">（' + this.serviceTimeDesc + '）</span>'
            } else {
                expresshtml += '<span class="serverTime" style="font-size:0.12rem;margin-left:-0.02rem;margin-to' +
                        'p:0.04rem;color:#a5a5a5;position:absolute;">（' + this.serviceTimeDesc + '）</span>'
            }
            expresshtml += '</div><span class="am-ft-gray advertisementvals" style="font-size:.14rem;padding' +
                    '-top: 0.04rem;padding-bottom: .01rem;">' + this.slogan + '</span><div class="am-ft-orange bubble_font" style="height:.135rem;line-height:.' +
                    '135rem;margin-bottom:0.01rem;padding-top:0.0001rem;">' + taghtml + '</div></div>' + sHtml + '<div class="am-list-arrow"><span class="am-icon horizontal" style="vertical-alig' +
                    'n:middle"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/' +
                    'indicator_icon.png"/></span></div></div>' 
                BizLog.call('info', {
                spmId: "a106.b2108.c4626",
                actionId: 'exposure',
                params: {
                    CompName: this.name
                }
            });

        })

    $(".management_list").html(expresshtml);
}
