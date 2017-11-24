Zepto(function($){
    ant.call('setTitle', {
        title: '选择快递下单',
    });
    FastClick.attach(document.body);
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
                keys: ['cityCode','pageNo','pageId']
            }, function (result) {

                var cityCode = result.data.cityCode;   // 现阶段可测是 110100(北京 北京市)、120100(天津 天津市)、130100(河北 石家庄)
                var pageNo = result.data.pageNo;
                var pageId =  result.data.pageId;    // 可以固定写死 SS1010
                var info = {
                    cityCode: cityCode,
                    pageNo:0,
                    pageId: "SS1010"
                };
                // alert(cityCode)
                console.log("cityCode "+cityCode);
                console.log("pageNo "+pageNo);

                var xhrurl = jUrl+'/ep/express/list';
                $.axs(xhrurl, info, function(result) {
                    hideLoading();
                    if(result.meta.success)  {
                        var expresshtml = '',xHtml='';
                        var tagval = '';
                        var listOperation = '';
                        if(!result.result.logises){
                            //暂时没有可服务的快递公司
                            //服务范围扩展中，敬请期待
                          console.log("/ep/express/list no data")
                        }else{
                          //  这里遍历 快递公司列表

                            $.each(result.result.logises, function(i){
                               // 加载标签
                                var taghtml = '',sHtml='';
                                var splitval = this.tag.substring(0, this.tag.length-1);
                                tagval=splitval.split(",");
                                $.each(tagval, function(i){
                                    taghtml += '<span style="padding: 0px 5px;">'+tagval[i]+'</span>'
                                });
                                //不需要加载 几元起
                                // if(this.presetWeightPrice!='' && this.presetWeightPrice!=null){
                                //     sHtml='<div class="am-ft-orange" style="display:block;;font-size: .15rem;">'+this.presetWeightPrice*0.01+'元起</div>';
                                // }
                                if(i==result.result.logises.length-1){
										xHtml='<div epCompanyId="'+this.logisMerchId+'" epCompanyNo="'+this.merchantCode+'" epCompanyName="'+this.merchantName+'" acceptOrderFrom="'+this.acceptOrderFrom+'"  url="'+this.url+'"  accessStatus="'+this.accessStatus+'"  acceptOrderTo="'+this.acceptOrderTo+'" imgsrc="'+this.merchantLogo+'" slogan="'+this.slogan+'" tag="'+this.tag+'" class="am-list-item typelink">';
                                    }else{
										xHtml='<div epCompanyId="'+this.logisMerchId+'" epCompanyNo="'+this.merchantCode+'" epCompanyName="'+this.merchantName+'" acceptOrderFrom="'+this.acceptOrderFrom+'"  url="'+this.url+'"  accessStatus="'+this.accessStatus+'"  acceptOrderTo="'+this.acceptOrderTo+'" imgsrc="'+this.merchantLogo+'" slogan="'+this.slogan+'" tag="'+this.tag+'" class="am-list-item typelink" style="height: 0.61rem;">';
									}
									expresshtml+=xHtml +'<div class="am-list-thumb choice_leftlogo">'
                                    +'<img src="'+this.merchantLogo+'" alt="">'
                                    +'</div>'
                                    +'<div class="am-list-content">'
                                    +'<div class="am-list-title list_lineheight">'
                                    +'<span class="am-ft-md">'+this.merchantName+'</span>'
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
                        //运营图片
                            // alert(result.result.promos);
                        // if(!result.result.promos || result.result.promos.length ==0 ){
                        //     $(".swiper-container").hide();
                        // }else{
                        //     $.each(result.result.promos,function(i){
                        //       console.log(this.linkUrl);
                        //         listOperation += '<div class="swiper-slide"><a href='+this.linkUrl+'></span><img src="'+this.imageUrl+'" style="height:.75rem;"></a></div>';
                        //     })
                        //
                        //     var mySwiper = new Swiper('.swiper-container', {
                        //         pagination: '.swiper-pagination',
                        //         paginationClickable: true,
                        //         speed:300,
                        //         autoplay: 5000,
                        //         observer:true,
                        //         observeParents:true
                        //     });
                        //     $(".swiper-wrapper").append(listOperation);
                        //     mySwiper.update(true);
                        // }

                        //运营图片
                        promotion(cityCode,"SS1010");

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
                         // 点击事件 选择一个快递公司后 跳转
                        $(".typelink").click(function(){
                            var epCompanyId = $(this).attr("epCompanyId"),
                                epCompanyNo = $(this).attr("epCompanyNo"),
                                epCompanyName = $(this).attr("epCompanyName"),
                                acceptOrderFrom = $(this).attr("acceptOrderFrom"),
                                acceptOrderTo = $(this).attr("acceptOrderTo"),
                                slogan = $(this).attr("slogan"),
                                imgsrc = $(this).attr("imgsrc"),
                                tag = $(this).attr("tag"),
                                url=$(this).attr('url'),
                               accessStatus =$(this).attr("accessStatus");
                              console.log("accessStatus: "+accessStatus);
                              console.log("url  : "+url);

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
                            if(accessStatus == "1"){
                              ant.pushWindow({
                                            url: "address-information.html"
                                        });
                            }else{
                                ant.pushWindow({
                                       url:url
                                });
                            }

                        });
                    }else{
                        alert(result.meta.msg);
                    }

                });
            }
        );
    }
});
