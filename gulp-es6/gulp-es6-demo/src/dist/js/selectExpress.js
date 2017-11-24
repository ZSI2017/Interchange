Zepto(function($){
    ant.call('setTitle', {
        title: '选择快递',
    });
    FastClick.attach(document.body);
    var isServicing = getUrlParam("isServicing") || "2";  // 判断如果已经选择了快递后，是否在服务区！
    ant.on('resume', function (event) {
        resumePage();
    });
    Express.init();
    function resumePage(){
        ant.setSessionData({
            data: {
                epCompanyId:'',
                epCompanyNo:'',
                epCompanyName:'',
                acceptOrderFrom:'',
                acceptOrderTo:'',
                productTypeId:"",
                productTypeName:"",
                presetWeight:"",
                presetWeightPrice:"",
                extraWeightUnit:"",
                extraWeightPrice:"",
                goodsOneValue:"",
                goodsOneIndex:"",
                goodstypeValue:"",
                dayValue: "",
                timeValue: "",
                timeDate:"",
                remarkContent:"",
            }
        });
    }
});
var Express = new Object({
    init:function(){
        showLoading();
        ant.getSessionData({
                keys: ['cityCode','sendAreaCode','recAreaCode','epCompanyId','epCompanyName']
            }, function (result) {

                var cityCode = result.data.cityCode;
                var snderDstrCode = result.data.sendAreaCode;
                var rcvrDstrCode =  result.data.recAreaCode;
                var swiperflag = true;
                   //判断 是否从选快递下单页面转来
                     console.log("是否从选快递下单页面转来" +result.data.epCompanyId )
                    //  alert(isServicing);
                 if(result.data.epCompanyId&&result.data.epCompanyId!=""&&window.isServicing!="1"){
                          $(".sorrynotic").show();
                          $("#oldExpressName").html(result.data.epCompanyName);
                          swiperflag = false;

                 }

                var info = {
                    cityCode: cityCode,
                    snderDstrCode:snderDstrCode,
                    rcvrDstrCode: rcvrDstrCode
                };
                console.log("cityCode "+cityCode);
                console.log("snderDstrCode "+snderDstrCode);
                console.log("rcvrDstrCode "+rcvrDstrCode);
                var xhrurl = jUrl+'/ep/express_com/list';
                $.axs(xhrurl, info, function(result) {
                    hideLoading();
                    if(result.meta.success)  {
                        var expresshtml = '',xHtml='';
                        var tagval = '';
                        var listOperation = '';
                        if(!result.result.listPageMenuConf){
                            //暂时没有可服务的快递公司
                            //服务范围扩展中，敬请期待
                            $(".sorrynotic").hide();
                            $(".select_expresscontent_empty").show();
                        }else{
                            $(".select_expresscontent_empty").hide();
                            $.each(result.result.listPageMenuConf, function(i){
                                var taghtml = '',sHtml='';
                                var splitval = this.tag.substring(0, this.tag.length-1);
                                tagval=splitval.split(",");
                                $.each(tagval, function(i){
                                    taghtml += '<span style="padding: 0px 5px;">'+tagval[i]+'</span>'
                                })
                                if(this.presetWeightPrice!='' && this.presetWeightPrice!=null){
                                    sHtml='<div class="am-ft-orange" style="display:block;;font-size: .15rem;">'+this.presetWeightPrice*0.01+'元起</div>';
                                }
                                if(i==result.result.listPageMenuConf.length-1){
										xHtml='<div epCompanyId="'+this.logisMerchId+'" epCompanyNo="'+this.logisMerchCode+'" epCompanyName="'+this.logisMerchName+'" acceptOrderFrom="'+this.acceptOrderFrom+'" acceptOrderTo="'+this.acceptOrderTo+'" imgsrc="'+this.logisMerchLog+'" slogan="'+this.slogan+'" tag="'+this.tag+'" class="am-list-item typelink">';
                                    }else{
										xHtml='<div epCompanyId="'+this.logisMerchId+'" epCompanyNo="'+this.logisMerchCode+'" epCompanyName="'+this.logisMerchName+'" acceptOrderFrom="'+this.acceptOrderFrom+'" acceptOrderTo="'+this.acceptOrderTo+'" imgsrc="'+this.logisMerchLog+'" slogan="'+this.slogan+'" tag="'+this.tag+'" class="am-list-item typelink" style="height: 0.61rem;">';
									}
									expresshtml+=xHtml +'<div class="am-list-thumb choice_leftlogo">'
                                    +'<img src="'+this.logisMerchLog+'" alt="">'
                                    +'</div>'
                                    +'<div class="am-list-content">'
                                    +'<div class="am-list-title list_lineheight">'
                                    +'<span class="am-ft-md">'+this.logisMerchName+'</span>'
                                    +'<span class="hot_icon hoticon'+this.hotStatus+'">热</span>'
                                    +'<span class="hot_icon newicon'+this.newStatus+'">新</span>'
                                    +'</div>'
                                    +'<span class="am-ft-gray am-ft-sm advertisementvals" style="padding-top: 2.5px;padding-bottom: 1px;">'+this.slogan+'</span>'
                                    +'<div class="am-ft-orange bubble_font" style="height:17.5px;line-height:17.5px;">'+taghtml+'</div>'
                                    +'</div>'
                                    +sHtml
                                    +'<div class="am-list-arrow"><span class="am-icon horizontal"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/indicator_icon.png"/></span></div>'
                                    +'</div>'
                            })
                        }
                       if(swiperflag){
                         promotion(cityCode,"BM1010");
                       }

                        if (!result.result.notice) {
                            $(".header_notification").hide();
                        }else{
                            $(".header_notification").show();
                            $(".noticeval").html(result.result.notice.content);
                              $(".express_content").css("margin-top","0");
                        }


                        $(".management_list").html(expresshtml);
                        $(".express_content").show();
                        if(isAndroid){
                            $(".bubble_font span").css("border","1px solid #ff8200");
                        }
                        //判断是否有多个快递产品类型
                        $(".typelink").click(function(){
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
                                    epCompanyId:epCompanyId,
                                    epCompanyNo:epCompanyNo,
                                    epCompanyName:epCompanyName,
                                    acceptOrderFrom:acceptOrderFrom,
                                    acceptOrderTo:acceptOrderTo,
                                    slogan:slogan,
                                    imgsrc:imgsrc,
                                    tag:tag
                                }
                            });
                            var info = {
                                "logisMerchId" : JSON.parse(epCompanyId),
                                "snderDstrCode" : snderDstrCode,
                                "rcvrDstrCode" : rcvrDstrCode
                            };
                            ant.pushWindow({
                                        url: "information-fill.html"
                                  });
                        });
                    }else{
                        alert(result.meta.msg);
                    }

                });
            }
        );
    }
});
