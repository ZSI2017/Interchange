Zepto(function($){
    ant.call('setTitle', {
        title: '附近快递资源',
    });
    Express.init();

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
                if(result.meta.success)  {
                    var expresshtml = '';
                    var tagval = '';
                    var listOperation = '';
                    $.each(result.result.sendApps, function(i){
                        var taghtml = '';
                        var splitval = this.tag.substring(0, this.tag.length-1);
                        tagval=splitval.split(",");
                        $.each(tagval, function(i){
                            taghtml += '<span style="padding: 0.5px 5px;">'+tagval[i]+'</span>';
                        });
                        expresshtml += '<a _href="'+this.linkUrl+'" class="am-list-item" disabled="disabled" style="height: 0.61rem;">'
                            +'<div class="am-list-thumb choice_leftlogo">'
                            +'<img src="'+this.logo+'" alt="">'
                            +'</div>'
                            +'<div class="am-list-content">'
                            +'<div class="am-list-title list_lineheight">'
                            +'<span class="am-ft-md">'+this.name+'</span>'
                            +'</div>'
                            +'<span class="am-ft-gray am-ft-sm advertisementvals" style="padding-top: 2.5px;padding-bottom: 1px;">'+this.slogan+'</span>'
                            +'<div class="am-ft-orange bubble_font" style="height:17.5px;line-height:17.5px;">'+taghtml+'</div>'
                            +'</div>'
                            +'<div class="am-list-arrow"><span class="am-icon horizontal"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/indicator_icon.png"/></span></div>'
                            +'</a>';
                    });

                    $(".management_list").html(expresshtml);
                    $(".express_content").show();
                    if(isAndroid){
                        $(".bubble_font span").css("border","1px solid #ff8200");
                    }

                    $(".management_list a").on("click",function () {

                        ant.pushWindow({
                            url: $(this).attr("_href")
                        });
                    });

                }
            });


        });

    }
});
