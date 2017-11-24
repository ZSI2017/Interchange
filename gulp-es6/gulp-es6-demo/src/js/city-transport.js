Zepto(function ($) {
//   BizLog.call('info',{
//       spmId:"a106.b2098",
//       actionId:'pageMonitor'
//   });
    ant.call('setTitle', {
        title: '同城货运',
    });
    Express.init();
});

var Express = new Object({
    init: function () {
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
            showLoading()
            var info = {
                pageId: "SAMECITYFREIGHT",
                cityCode: result.data.cityCode
            };
            var url = jUrl + "/ep/index_info";
            $.axs(url, info, function (result) {
                if (result.meta.success) {
                    var expresshtml = '';
                    var tagval = '';
                    var listOperation = '';
                    $.each(result.result.sendApps, function (i) {
                        var taghtml = '';
                        var splitval = this.tag.substring(0, this.tag.length-1);
                        tagval = splitval.split(",");
                        $.each(tagval, function (i) {
                            taghtml += '<span style="">' + tagval[i] + '</span>';
                        });
                        var spmv_i = i+1;
                        expresshtml += '<a _href="' + this.linkUrl + '" class="am-list-item" data-spmv="a106.b2098.c4581.'+ spmv_i +'" style="height:.90rem">'
                            + '<div class="am-list-thumb choice_leftlogo">'
                            + '<img src="' + this.logo + '" alt="">'
                            + '</div>'
                            + '<div class="am-list-content" style="padding-top:.06rem;">'
                            + '<div class="am-list-title list_lineheight">'
                            + '<span style="font-size:.16rem">' + this.name + '</span>'
                            + '</div>'
                            + '<span class="am-ft-gray  advertisementvals" style="font-size:.14rem;padding-top:0.04rem;padding-bottom:.01rem;overflow:hidden:text-overflow:ellipsis">' + this.slogan + '</span>'
                            + '<div class="am-ft-orange bubble_font" style="height:.15rem;line-height:.15rem;">' + taghtml + '</div>'
                            + '</div>';
                        if(this.markPrice){
                            expresshtml += '<div class="am-ft-orange prisetag_right">' + this.markPrice + '元起</div>';
                        }else{
                            expresshtml += '<div class="am-ft-orange prisetag_right"></div>'
                        }
                        expresshtml += '<div class="am-list-arrow" style="padding-top:.19rem;padding-bottom::.11rem;"><span class="am-icon horizontal"><img src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/indicator_icon.png"/></span></div>'
                            + '</a>'

                        BizLog.call('info',{
                            spmId:"a106.b2098.c6089",
                            actionId:'exposure',
                            params:{
                                    CompName:this.name,
                            }
                        });

                    });
                    $(".management_list").html(expresshtml);
                    $(".management_list .am-list-item:nth-child(n)").css({"padding-bottom":"0.005rem","padding-top":"0"});
                    $(".management_list .am-list-item:first-child").css("padding-top","0.005rem");
                    $(".express_content").show();
                    hideLoading();
                    if(isAndroid){
                        $(".bubble_font span").css({"border":"1px solid #ff8200","padding-top":"0.02rem","padding-bottom":"0.015rem","height":"auto","line-height":"1","font-size":".1rem"});
                      //   alert($(window).width());
                      // if($(window).width()>=360){
                      //
                      // }else{
                      //     $(".bubble_font span").css({"border":"1px solid #ff8200","height":".13rem","line-height":".13rem"});
                      // }
                    }
                    $(".management_list a").on("click",function () {
                      var number =  $(".management_list a").index(this)+1;
                      var tempurl =$(this).attr("_href");
                      var spmIdNumber = "a106.b2121.c6089" + number;
                      BizLog.call('info',{
                          spmId:spmIdNumber,
                          actionId:'clicked',
                          params:{
                                 ToURL:tempurl,
                                 CompName:$(this).find(".am-list-title").text(),

                          }
                      });
                        ant.pushWindow({
                            url: $(this).attr("_href")
                        });
                    });
                }
            });
        });

    }
});
