showLoading();
Zepto(function($){
    ant.call('setTitle', {
        title: '附近快递资源',
    });
    Express.init();
    //进入附近快递资源埋点
    // BizLog.call('info',{
    //    spmId:"a106.b2112",
    //    actionId:'pageMonitor'
    // });

});

var Express = new Object({
    init:function(){

        ant.getSessionData({
            keys: ['cityCode']
        }, function (result) {
            if (!result.data.cityCode) {
                toast({
                    text: "未获取到当前城市",
                    type: 'exception'
                });
                return;
            }
            var info = {
                pageId: "NE1010",
                cityCode: result.data.cityCode
            };
            var url = jUrl + "/ep/index_info";
            $.axs(url, info, function (result) {
                hideLoading();
                if(result.meta.success)  {
                    var expresshtml = '';
                    var tagval = '';
                    var listOperation = '';
                    $.each(result.result.sendApps, function(i){
                        var taghtml = '';
                        var splitval = this.tag.substring(0, this.tag.length-1);
                        tagval=splitval.split(",");
                        $.each(tagval, function(i){
                            taghtml += '<span>'+tagval[i]+'</span>';
                        });
                        var spmv_i = i+1;
                        expresshtml += '<a _href="'+this.linkUrl+'" class="am-list-item" disabled="disabled" style="height: 0.90rem;" data-spmv="a106.b2112.c4633.'+ spmv_i +'">'
                            +'<div class="am-list-thumb choice_leftlogo">'
                            +'<img src="'+this.logo+'" alt="">'
                            +'</div>'
                            +'<div class="am-list-content" style="padding-top:0.04rem;">'
                            +'<div class="am-list-title list_lineheight">'
                            +'<span style="font-size:.16rem">'+this.name+'</span>'
                            +'</div>'
                            +'<span class="am-ft-gray advertisementvals" style="font-size:.14rem;padding-top: 0.03rem;padding-bottom: 0.03rem;">'+this.slogan+'</span>'
                            +'<div class="am-ft-orange bubble_font" style="height:.15rem;line-height:.15rem;">'+taghtml+'</div>'
                            +'</div>'
                            +'<div class="am-list-arrow"><span class="am-icon horizontal"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/indicator_icon.png"/></span></div>'
                            +'</a>';
                    });

                    $(".management_list").html(expresshtml);
                    $(".express_content").show();
                    if(isAndroid){
                        $(".bubble_font span").css({"border":"1px solid #ff8200","padding-top":"0.02rem","padding-bottom":"0.015rem","height":"auto","line-height":"1","font-size":".1rem"});
                      }
                    // if($(window).width()>=360){
                    //     $(".bubble_font span").css({"border":"1px solid #ff8200","height":".15rem","line-height":".15rem","font-size":".12rem"});
                    // }else{
                    //     $(".bubble_font span").css({"border":"1px solid #ff8200","height":".13rem","line-height":".13rem"});
                    // }
                    $(".management_list a").on("click",function () {

                        ant.pushWindow({
                            url: $(this).attr("_href")
                        });
                        var spmId = "";
                        if($(this).find("span").html() == "菜鸟驿站"){

                            spmId = "a106.b2112.c4633.1";

                        }else if($(this).find("span").html() == "附近快递网点"){
                            spmId = "a106.b2112.c4633.2";
                        }
                        BizLog.call('info',{
                            spmId:spmId,
                            actionId:'clicked',
                            params:{
                                CompName:$(this).find("span").html()
                            }
                        });
                    });
                }
            });
        });
    }
});
