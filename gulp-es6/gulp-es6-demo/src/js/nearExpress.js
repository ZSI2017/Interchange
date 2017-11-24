$(".location").hide();
Zepto(function($){
    ant.call('setTitle', {
      title: '附近快递网点',
    });

     //进入附近快递网点埋点
    // BizLog.call('info',{
    //    spmId:"a106.b2113",
    //    actionId:'pageMonitor'
    // });

    $(".express_content").show();
    $(window).unbind("scroll");
    $(".am-input-autoclear").on('click',".location",function(e) {
        //选择城市埋点
        BizLog.call('info',{
           spmId:"a106.b2113.c4635.d7179",
           actionId:'clicked'
        });
        $(".near_expresscontent").html("");
        getCity($("#cityTitle").html(),cityCode);
    })

    resumePage();
    //获取经纬度
    function resumePage () {
      ant.call("getLocation", function (result) {
        $(window).unbind("scroll");
        if (result.error) {
          getSession();
          dingweiInfo();
          toast({
               text:"无法获取定位，请先授权app使用定位"
          });
          $(".nolocation").html('<p>定位失败</p>');
          $(".nearsearch_input").val("请输入详细地址");
          return;
        }else{

          //定位成功
          city = result.city;
          adcode = result.adcode;
          cityCode = adcode.substr(0, 4)+"00";
          if(city.indexOf("市")>0){
              city = city.substr(0,city.length-1);
          }else if(city.indexOf("地区")>0){
              city = city.substr(0,city.length-2);
          }
          $("#cityTitle").html(city);
          searchLication(city);
          setCitySesstion (city);

          $(".locationcontent").show();
          $(".nolocation").html('<p>定位中...</p>');
          $(".nearsearch_input").css("color","#000");


          $(".nearsearch_input").val(result.pois[0].address);
          var posAdcode = result.adcode;
          var poisAddress = result.pois[0].address;
          var longitude = JSON.stringify(JSON.parse(result.longitude));
          var latitude = JSON.stringify(JSON.parse(result.latitude));
          var poiLocation = {site_name:poisAddress,site_lng:longitude,site_lat:latitude,site_adcode:posAdcode};
          poiLocation = JSON.stringify(poiLocation);
          set_searchSession(poiLocation)

          var info = {"lng":longitude,"lat":latitude,pageNum:pageNum,rows:row};
          Express.Near(info);
          if($(".nearsearch_input").val() == poisAddress){
            pageNum = 1;
            Scroll (longitude,latitude,pageNum,row);
          }
        }

      });
    }

    /*失去焦点*/
    $(".nearsearch_input").blur(function(e){
      if (this.value == '') {
          this.value = '请输入详细地址';
          this.style.color = '#9c9c9d';
      }else{
        this.style.color = '#000';
      }

    })
    /*获取焦点*/
    $(".nearsearch_input").focus(function(){
      //聚焦输入埋点
      BizLog.call('info',{
         spmId:"a106.b2113.c4634.d7177",
         actionId:'clicked'
      });
      if($(".locationbtn").html() == "定位"){
        $(".am-icon-clear").css("visibility","hidden");
      }
      if($(".locationbtn").html() == "取消" && $('.nearsearch_input').val() != ""){
          $(".am-icon-clear").css("visibility","visible");
      }
      $(".am-loading").remove();
    	this.style.color = '#000';
      if (this.value == '请输入详细地址') {
          this.value = '';
      }
      $('.am-search-clear').css("background-color","#f1f1f1");

      //获取本地中的城市
      AlipayJSBridge.call('getSessionData', {
        keys: ['site']
      }, function (result) {
        $(".location").show();
        $("#cityTitle").html(result.data.site);
        if($(".locationbtn").html() == "定位"){
          $(".nearsearch_input").val("");
          $(".locationbtn").html("取消");
          $(".locationbtn").attr("data-spmv","a106.b2113.c4634.d7180");
          seeHistory();
        }
      });
      if($(".nearsearch_input").val() == ""){
        $(".am-icon-clear").css("visibility","hidden");
        seeHistory();
      }
      //解决点击清除按钮有时无法显示历史记录问题
      $(document).on("click",".am-search-clear",function(){
        if($(".nearsearch_input").val() == ""){
          $(".am-icon-clear").css("visibility","hidden");
          seeHistory();
        }
      })

    })

    $(".search-start").click(function(){
      $(".nearsearch_input").focus();
    })

    //点击定位/取消
    $(".locationbtn").on('click',function(){
      $(window).unbind("scroll");
        if ($(this).html()=="定位") {
            //点击定位埋点
              BizLog.call('info',{
                 spmId:"a106.b2113.c4634.d7178",
                 actionId:'clicked'
              });
            $(this).attr("data-spmv","a106.b2113.c4634.d7178");
            $(".near_expresscontent").html("");
            $(".nearsearch_input").unbind("input propertychange");
            $(".locationcontent").show();
            $(".nearsearch_input").css("color","#9c9c9d");
            $(".nearsearch_input").val("正在定位中...");
            $(".nolocation").html('<p>定位中...</p>');
            $(".nearsearch_input").attr("disabled","disabled");
            setTimeout(function(){
              $(".nearsearch_input").removeAttr("disabled");
              resumePage();
            },500)


        }else{
            //点击取消埋点
              BizLog.call('info',{
                 spmId:"a106.b2113.c4635.d7180",
                 actionId:'clicked'
              });

            $(".nearsearch_input").val("");
            AlipayJSBridge.call('getSessionData', {
              keys: ['searchSite']
            }, function (result) {
              var search_result = JSON.parse(result.data.searchSite);
              var e_name = search_result.site_name;
              var w_lng = search_result.site_lng;
              var q_lat = search_result.site_lat;
              $(".nearsearch_input").val(e_name);
              $(".nearsearch_input").css("color","#000");
              var info = {"lng":w_lng,"lat":q_lat,pageNum:pageNum,rows:row};
              Express.Near(info);
              if($(".nearsearch_input").val() == e_name){
                pageNum = 1;
                Scroll (w_lng,q_lat,pageNum,row);
              }
            });

            $(".location").hide();
            $(this).html("定位");
        }
    })
    //点历史记录埋点
    $(".near_expresscontent").on("click",".borderSee",function(){
      BizLog.call('info',{
          spmId:"a106.b2113.c4635.d7181",
          actionId:'clicked'
      });
    })

    //呈现历史记录
    function seeHistory () {
      var sitee = TyrionStorage.get();
      var zhao = "";
      if(sitee){
        var eachlength = sitee.array.length;
          zhao += '<li class="hairline-bottom" style="height:.37rem;line-height:.37rem;background-color:#f5f5f9;font-size:.13rem;color:#888;padding:0 .14rem 0;">历史记录</li><ul class="borderSee">';
          for(var i=0; i<eachlength; i++){
              zhao += '<li class="historySite hairline-bottom" style="height:.47rem;line-height:.47rem;font-size:.16rem;margin-left:.14rem;"><i class="siteLeft" style="font-style:normal;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 1.4rem);display:inline-block;float:left;">'+ sitee.array[i].site_name + '</i>'
              if(sitee.array[i].site_name.length > 15){
                zhao += '<span class = "siteRight" style="margin-left:10px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:1.2rem;display:inline-block;float:left;">'+ sitee.array[i].self_district +'</span>' + '</li>';
              }else{
                  zhao += '<span class = "siteRight" style="margin-left:10px;color:#888;">'+ sitee.array[i].self_district +'</span>' + '</li>';
              }
          }
          zhao += '</ul><li   data-spmv="a106.b2113.c4635.d8439" class="clearLocation hairline-bottom" style="height:.47rem;line-height:.47rem;font-size:.16rem;text-align:center;color:#888888;background-color:#fff;border-botom:1px solid #ddd;">清除历史记录</li>';
          $(".near_expresscontent").html(zhao);

          $(".locationcontent").hide();
          $(".borderSee li:last-child").css({"margin-left":"0","padding-left":"0.14rem"});
      }else{
          zhao += '<li class="hairline-bottom" style="height:.37rem;line-height:.37rem;background-color:#f5f5f9;font-size:.13rem;color:#888;padding:0 .14rem 0;">历史记录</li>';
          zhao += '<li class="hairline-bottom" style="height:.47rem;line-height:.47rem;font-size:.16rem;text-align:center;color:#888888;background-color:#fff;">暂无历史记录</li>';
          $(".near_expresscontent").html(zhao);
          $(".locationcontent").hide();
      }

    }
    //清除历史记录
    $(".near_expresscontent").on("click",".clearLocation",function(){
      BizLog.call('info',{
           spmId:"a106.b2113.c4635.d8439",
           actionId:'clicked',
       });
        TyrionStorage.del();
        $(".near_expresscontent").html("");
    });
    $(".near_expresscontent").on("touchmove",".historySite",function(){
      $(window).unbind("scroll");
    })
    //历史记录点击事件
    $(".near_expresscontent").on("click",".historySite",function(){
        pageNum = 1;
        $(window).unbind("scroll");
        var input_text = $(this).find("i").html();
        $(".nearsearch_input").css("color","#000");
        $(".nearsearch_input").val(input_text);
        $(".near_expresscontent").html("");
        $(".locationcontent").show();
        $(".nolocation").html('<p>正在查询...</p>');

        var key = $(this).find("i").html();
        var sitet = TyrionStorage.get();
        var eachlength = sitet.array.length;
        for (var i = 0; i <eachlength; i++) {
          var keyy = sitet.array[i].site_name;  //显示出来的地点
          var keys = sitet.array[i].site_district;   //灰色地区
          var key_lng = sitet.array[i].site_lng;
          var key_lat = sitet.array[i].site_lat;
          var key_adcode = sitet.array[i].site_adcode;
          var key_distric = sitet.array[i].self_district;
          if(key == keyy){
              var poiLocation = {site_name:keyy,site_district:keys,site_lng:key_lng,site_lat:key_lat,site_adcode:key_adcode,self_district:key_distric};
              TyrionStorage.set(poiLocation);
              // var poiLocation = {site_name:keyy,site_district:keys,site_lng:key_lng,site_lat:key_lat,site_adcode:key_adcode};
              poiLocation = JSON.stringify(poiLocation);
              set_searchSession(poiLocation)
              var info = {"lng":key_lng,"lat":key_lat,pageNum:pageNum,rows:row};
              Express.Near(info)
              if($(".nearsearch_input").val() == input_text){
                Scroll (key_lng,key_lat,pageNum,row);
              }

              var myAdcode = getAreaNameByCode(key_adcode,true);
              if(myAdcode != "") {
                  var names = myAdcode.split(" ");
                  var city = names[1] || names[0];
                  if(city.indexOf("市")>0){
                      city = city.substr(0,city.length-1);
                  }else if(city.indexOf("地区")>0){
                      city = city.substr(0,city.length-2);
                  }else if(city.indexOf("盟")>0){
                      city = city.substr(0,city.length-1);
                  }else if(city.indexOf("自治州")>0){
                    city = city.substr(0,city.length-3);
                  }else if(city.indexOf("自治区")>0){
                    city = city.substr(0,city.length-3);
                  }else if(city.indexOf("州")>0){
                    city = city.substr(0,city.length-1);
                  }else if(city.indexOf("省")>0){
                    city = city.substr(0,city.length-1);
                  }
                  $("#cityTitle").html(city);
                  AlipayJSBridge.call('setSessionData', {
                    data: {
                      site:city
                    }
                  });
                  $(".nearsearch_input").unbind("input propertychange");
                  searchLication(city);
              }else{
                  toast({
                      text:"暂不支持该地区的搜索"
                  });
                  return;
              }
          }

        }
    })

    //拨打电话埋点
    $(document).on("click",".near_phonenumber",function(){
      var number = $(".near_phonenumber").index(this)+1;
      BizLog.call('info',{
          spmId:"a106.b2113.c4636_"+ number +".d7183",
          actionId:'clicked',
          params:{
            CompPhone:$(this).find("a").text(),
            CompName:$(this).siblings(".am-list-title").find("span").text(),
            CompAddr:$(this).siblings(".near_address").find("span").text()
          }
      })
    })
});

    function searchLication (a) {
      var search_loaction = a;
      AMap.plugin(["AMap.Autocomplete"], function() {
        var Autocomplete = new AMap.Autocomplete({
          city:search_loaction,
          citylimit:true
        })
        //compositionend 是指中文输入法输入完成时触发；
        $(".nearsearch_input").bind("compositionend", function () {
          $(".near_expresscontent").html("");
          if(this.value.length < 1){
              var sitee = TyrionStorage.get();
              var zhao = "";
              if(sitee){
                var eachlength = sitee.array.length;
                  zhao += '<li class="hairline-bottom" style="height:.37rem;line-height:.37rem;background-color:#f5f5f9;font-size:.13rem;color:#888;padding:0 .14rem 0;">历史记录</li><ul class="borderSee">';
                  for(var i=0; i<eachlength; i++){
                      zhao += '<li class="historySite hairline-bottom" style="height:.47rem;line-height:.47rem;font-size:.16rem;margin-left:.14rem;"><i class="siteLeft" style="font-style:normal;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 1.4rem);display:inline-block;float:left;">'+ sitee.array[i].site_name + '</i>'
                      if(sitee.array[i].site_name.length > 15){
                        zhao += '<span class = "siteRight" style="margin-left:10px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:1.2rem;display:inline-block;float:left;">'+ sitee.array[i].self_district +'</span>' + '</li>';
                      }else{
                        zhao += '<span class = "siteRight" style="margin-left:10px;color:#888;">'+ sitee.array[i].self_district +'</span>' + '</li>';
                      }
                  }
                  zhao += '</ul><li   data-spmv="a106.b2113.c4635.d8439" class="clearLocation hairline-bottom" style="height:.47rem;line-height:.47rem;font-size:.16rem;text-align:center;color:#888888;background-color:#fff;border-botom:1px solid #ddd;padding-bottom:2px;">清除历史记录</li>';
                  $(".near_expresscontent").html(zhao);

                  $(".locationcontent").hide();
                  $(".borderSee li:last-child").css({"margin-left":"0","padding-left":"0.14rem"});
              }else{
                  zhao += '<li class="hairline-bottom" style="height:.37rem;line-height:.37rem;background-color:#f5f5f9;font-size:.13rem;color:#888;padding:0 .14rem 0;">历史记录</li>';
                  zhao += '<li class="clearLocation hairline-bottom" style="height:.47rem;line-height:.47rem;font-size:.16rem;text-align:center;color:#888888;background-color:#fff;">暂无历史记录</li>';
                  $(".near_expresscontent").html(zhao);
                  $(".locationcontent").hide();
              }

          }
        })
        $(".nearsearch_input").bind('input propertychange',function(){
          // console.log("字数 ：" + $(".nearsearch_input").val());
          if(this.value.length < 1){
              $(".near_expresscontent").html("");
              var sitee = TyrionStorage.get();
              var zhao = "";
              if(sitee){
                var eachlength = sitee.array.length;
                  zhao += '<li class="hairline-bottom" style="height:.37rem;line-height:.37rem;background-color:#f5f5f9;font-size:.13rem;color:#888;padding:0 .14rem 0;">历史记录</li><ul class="borderSee" data-spmv="a106.b2113.c4634.d7181">';
                  for(var i=0; i<eachlength; i++){
                      zhao += '<li class="historySite hairline-bottom" style="height:.47rem;line-height:.47rem;font-size:.16rem;margin-left:.14rem;"><i class="siteLeft" style="font-style:normal;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 1.4rem);display:inline-block;float:left;">'+ sitee.array[i].site_name + '</i>'
                      if(sitee.array[i].site_name.length > 15){
                        zhao += '<span class = "siteRight" style="margin-left:10px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:1.2rem;display:inline-block;float:left;">'+ sitee.array[i].self_district +'</span>' + '</li>';
                      }else{
                        zhao += '<span class = "siteRight" style="margin-left:10px;color:#888;">'+ sitee.array[i].self_district +'</span>' + '</li>';
                      }
                  }
                  zhao += '</ul><li   data-spmv="a106.b2113.c4635.d8439" class="clearLocation hairline-bottom" style="height:.47rem;line-height:.47rem;font-size:.16rem;text-align:center;color:#888888;background-color:#fff;border-botom:1px solid #ddd;padding-bottom:2px;">清除历史记录</li>';
                  $(".near_expresscontent").html(zhao);

                  $(".locationcontent").hide();
                  $(".borderSee li:last-child").css({"margin-left":"0","padding-left":"0.14rem"});
              }else{
                  zhao += '<li class="hairline-bottom" style="height:.37rem;line-height:.37rem;background-color:#f5f5f9;font-size:.13rem;color:#888;padding:0 .14rem 0;">历史记录</li>';
                  zhao += '<li class="clearLocation hairline-bottom" style="height:.47rem;line-height:.47rem;font-size:.16rem;text-align:center;color:#888888;background-color:#fff;">暂无历史记录</li>';
                  $(".near_expresscontent").html(zhao);
                  $(".locationcontent").hide();
              }
          }else{
              var kw = $(".nearsearch_input").val();
              Autocomplete.search(kw,
                function (status,result) {
                  var autocompleteHtml = "";
                  if(status == 'complete'){
                    $(".near_expresscontent").html("");
                    $(".nearsearch_input").css("color","#000");
                    $.each(result.tips, function(i){
                      var poiName = result.tips[i].name;
                      var poiDistrict = result.tips[i].district;
                      var poiAdress = result.tips[i].address;
                      var longitude = result.tips[i].location.lng;
                      var latitude = result.tips[i].location.lat;
                      var poiAdcode = result.tips[i].adcode;
                      var poiDistrict_demo = getAreaNameByCode(poiAdcode,true);
                      if(poiDistrict_demo != "") {
                          var names = poiDistrict_demo.split(" ");
                          var city = names[2] || names[1] || names[0];
                          autocompleteHtml += '<div class="auto-item-self hairline-bottom" style="font-size:0.16rem;background-color: #fff;" selfLng="'+ longitude +'" selfLat="' + latitude + '" selfAdcode="'+ poiAdcode +'" selfDistrict="'+ poiDistrict + '"><span class="showName" style="display:inline-block;float:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:calc(100% - 0.8rem);display:inline-block;">' + poiName + '</span><span class="showDistrict" style="margin-left:5px;color:#9c9c9d;display:inline-block;">'+ city +'</span></div>';
                      }else{
                          return;
                      }
                    })
                    $(".near_expresscontent").html(autocompleteHtml);
                    $('.near_expresscontent').on("touchstart",".auto-item-self",function(){
                      $(this).css("background-color","#CAE1FF")
                    })
                    $(".auto-item-self").on('touchmove',function(){
                        this.isMove = true;
                    },true)
                    $(".auto-item-self").on('touchend',function(){
                          $(".auto-item-self").css("background-color","#fff")
                          if(!this.isMove){
                            pageNum = 1;
                            $(window).unbind("scroll");

                            $(".near_expresscontent").html("");
                            $(".locationcontent").show();
                            $(".nolocation").html('<p>正在查询...</p>');
                            var self_only_lng = $(this).attr("selfLng");
                            var self_only_lat = $(this).attr("selfLat");
                            var self_only_adcode = $(this).attr("selfAdcode");
                            var self_only_district = $(this).attr("selfDistrict");
                            var self_only_name = $(this).find(".showName").html();
                            var self_only_distriict = $(this).find(".showDistrict").html();
                            $(".nearsearch_input").val("");
                            $(".nearsearch_input").val(self_only_name);
                            $(".nearsearch_input").blur();

                            var poiLocation = {site_name:self_only_name,site_district:self_only_distriict,site_lng:self_only_lng,site_lat:self_only_lat,site_adcode:self_only_adcode,self_district:self_only_district};
                            TyrionStorage.set(poiLocation);
                            var search_poi = JSON.stringify(poiLocation);
                            set_searchSession(search_poi);
                              //交互请求
                            var info = {"lng":self_only_lng,"lat":self_only_lat,pageNum:pageNum,rows:row};
                            Express.Near(info)
                            if($(".nearsearch_input").val() == self_only_name){
                              Scroll (self_only_lng,self_only_lat,pageNum,row);
                            }
                          }
                          this.isMove = false;
                       })

                  }else if(status == 'no_data'){
                    autocompleteHtml += '<div class="auto-item-self hairline-bottom" style="color:#888888;text-align:center;padding-left:0;background-color:#fff;">暂无搜索结果，换个地址试试</div>';
                    $(".near_expresscontent").html(autocompleteHtml);

                  }else if(status == 'error'){
                    autocompleteHtml += '<div class="auto-item-self hairline-bottom" style="color:#888888;text-align:center;padding-left:0;background-color:#fff;">暂无搜索结果，换个地址试试</div>';
                    $(".near_expresscontent").html(autocompleteHtml);
                  }
                }
              )
          }
        })
      })
    }
      var isSearch =false;
      var pageNum = 1;
      var row = 10;
      function Scroll (lng,lat,pageNum,row) {

        $(window).bind("scroll",function(){
          if($(".near_expresscontent").children().is(".auto-item-self")){
            return;
          }
          if(isSearch == true){
            return;
          }
          var contentHeight = $(".near_expresscontent").height();
          var clientHeight   = $(window).height();
          var scrollHeight = $(window).scrollTop();
          // console.log("contentHeight + "+ contentHeight +"clientHeight +" +clientHeight + "windowHeight +" + windowHeight)
          var need_height = contentHeight - scrollHeight - clientHeight;
          // console.log(need_height)
          if(contentHeight <= clientHeight){
            return;
          }
          if(need_height < -5 ){
              if(!isNetworkAvailable){
                $(".am-loading").remove();
                return;
              }
              isSearch = true;
              var info = {"lng":lng,"lat":lat,pageNum:++pageNum,rows:row};
              Express.Near(info)
          }
        });
      }

    //历史位置缓存封装
    TyrionStorage = {
      storage : {},
      isinit : 0,
      maxnum : 6,
      key : 'historySiteData',
      _init:function(){
          if (TyrionStorage.isinit === 1) {
              return true;
          } else if (TyrionStorage.isinit === 0 && window.localStorage) {
              TyrionStorage.isinit = 1;
              TyrionStorage.storage = window.localStorage;
              return true;
          } else {
              return false;
          }
      },
      get:function(){
          if(TyrionStorage._init()){
            var data = TyrionStorage.storage.getItem(TyrionStorage.key);
            return JSON.parse(data);
          }else{
              return false;
          }
      },
      set:function(value){
          if(TyrionStorage._init()){
              var data = TyrionStorage.storage.getItem(TyrionStorage.key);
              data = JSON.parse(data);
              if(data === null){
                data = {array:[]};
                data.array.unshift(value);
                data = JSON.stringify(data);
                TyrionStorage.storage.setItem(TyrionStorage.key, data);
              }else{
                for (var i=0; i < data.array.length; i++){
                  var dataJson = JSON.stringify(data.array[i]);
                  var valueJson = JSON.stringify(value);
                  if(dataJson == valueJson){
                    data.array.splice(i,1);
                  }
                }
                data.array.unshift(value);
                if (data.array.length === TyrionStorage.maxnum) {
                    data.array.pop();
                }
                data = JSON.stringify(data);
                TyrionStorage.storage.setItem(TyrionStorage.key, data);
              }
              return true;
          }else{
              return false;
          }
      },
      del:function(){
        TyrionStorage.storage.removeItem(TyrionStorage.key);
      }
    };

    //从主页获取缓存地址
    function getSession(){
      AlipayJSBridge.call('getSessionData', {
        keys: ['name']
      }, function (result) {
        var str = JSON.stringify(result);
        var strObj = JSON.parse(str);
        $("#cityTitle").html(strObj.data.name);
        var cityData = strObj.data.name;
        searchLication(strObj.data.name)
        setCitySesstion(cityData);
        $(".location").hide();
      });
    };
    //设置城市查询缓存
    function setCitySesstion (cityData) {
      AlipayJSBridge.call('setSessionData', {
          data: {
            site: cityData
          }
        });
    }
    //设置搜索缓存
    function set_searchSession(a){
      AlipayJSBridge.call('setSessionData', {
        data: {
          searchSite:a
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
                    // console.log(data.result.cityCode);
                  window.cityCode = data.result.cityCode;
                    // var areaName = getAreaNameByCode(window.cityCode);
                    // var areaName =  getCityNameByCode(window.cityCode);
                    var areaName = data.result.cityName;
                    // console.log("areaName "+areaName[1]);
                    if(areaName) {
                        // var names = areaName.split(" ");
                        // var city = names[1];
                        var city = areaName;
                        if(city.indexOf("市")>0){
                            city = city.substr(0,city.length-1);
                        }else if(city.indexOf("地区")>0){
                            city = city.substr(0,city.length-2);
                        }
                        $("#cityTitle").html(city);
                        siteLocation();
                    }else{
                        // alert(data.result.cityCode + " no name");
                    }

                    initStateComfirmData(window.cityCode);
                }else{
                    //获取选择城市
                    getCity(city,window.cityCode);
                }
            }
        });
    };

    //获取城市
    function getCity(city,cityCode){
        ant.call('getCities', {
            currentCity: city,
            adcode:cityCode,
            needHotCity:true,
            customHotCities:[{name:"杭州",adcode:"330100",pinyin:"hangzhou"},{name:"北京",adcode:"110100",pinyin:"beijing"},{name:"上海",adcode:"310100",pinyin:"shanghai"},{name:"深圳",adcode:"440300",pinyin:"shenzhen"},{name:"广州",adcode:"440100",pinyin:"guangzhou"}]
        }, function (result) {
            var cityName;
            cityCode = JSON.parse(JSON.stringify(result.adcode));
            var cityCode_hide = cityCode.slice(0,3)
            //天津郊县、重庆郊县、上海郊县、
            if(cityCode == '120200'){
                cityCode = '120100';
                $("#cityTitle").html('天津');
                cityName = "天津";
            }else if(cityCode == '500200'){
                $("#cityTitle").html('重庆');
                cityName = "重庆";
            }else  if(cityCode == '310200'){
                cityCode = '310100';
                $("#cityTitle").html('上海');
                cityName = "上海";
            }else if(cityCode_hide == '810'){
                toast({
                    text:"暂不支持香港地区的搜索"
                });
                return;
            }else if(cityCode_hide == '820'){
                toast({
                    text:"暂不支持澳门地区的搜索"
                });
                return;
            }else if(cityCode_hide == '710'){
                toast({
                    text:"暂不支持台湾地区的搜索"
                });
                return;
            }else{
                $("#cityTitle").html(JSON.parse(JSON.stringify(result.city)));
                cityName = JSON.parse(JSON.stringify(result.city));
            }
            setCitySesstion (cityName);
            // $(".nearsearch_input").val("请输入详细地址");
            $(".nearsearch_input").val("");
            $(".nearsearch_input").css("color","#9c9c9d");
            $(".near_expresscontent").html("");
            $(".am-loading").remove();
            $(".nearsearch_input").unbind("input propertychange");
            searchLication(cityName);
        });
    }

  var Express = new Object({
	  Near:function(obj){
      var xhrurl = jUrl + "/ep/site/near";
      console.log(xhrurl);
        $.axs(xhrurl,obj,function(result){
          // alert(JSON.stringify(result))
          console.log("dataaa : "+ JSON.stringify(result) )
          $(".am-loading").remove();
          if(result.meta.code == "0000"){
              $(".locationcontent").hide();
              var html = '';
              var item_length = $(".near_expresscontent .am-list-item").length;
              if(result.result.list.length > 0){
                $.each(result.result.list, function(i){
                  if(this.contactTel != null){
                    var contactTel_str = '';
                    var tagval=this.contactTel.split(",");
                    var len = tagval.length;
                    var tagval_tel = "";
                      $.each(tagval, function(i,item){
                        var tagval_arr = tagval[i].split("");
                        var tagval_filter = tagval_arr.slice(5);
                        tagval_tel = tagval[i];
                        for (var m = 0; m < tagval_filter.length; m++) {
                          if(tagval_filter[m] == "-"){
                            var tagval_reverse = tagval[i].split("").reverse();
                            var tagval_splice = tagval_reverse.splice(tagval_reverse.indexOf("-")+1,tagval_reverse.length)
                            tagval_reverse = tagval_splice.reverse();
                            tagval_tel = tagval_reverse.join("");
                          }
                        }
                        if(len>0){
                          if(len<2){
                            contactTel_str += '<a href="tel:'+tagval_tel+'" style="color:#108ee9;">'+tagval[i]+'</a>';
                          }else{
                            contactTel_str += '<a href="tel:'+tagval_tel+'" style="color:#108ee9;display:inline-block;">'+tagval[i]+'</a>';
                          }
                        }else if(len==0){
                          contactTel_str += '<a href="tel:'+tagval_tel+'" style="color:#108ee9;">'+tagval[i]+'</a>';
                        }
                      });
                  }else{
                    contactTel_str = "";
                  }
                    var spmv_i =item_length+i+1;
                    html += '<div class="am-list-item" style="border-botom:1px solid #ddd;" data-spmv="a106.b2113.c4636_'+ spmv_i +'">'
                            +'<div class="am-list-content near_eplist">'
                            +'<div class="am-list-title" style="font-size: .17rem;line-height:.28rem;padding-bottom:.01rem;"><span>'+this.merchantName+'</span>-'+this.siteName+'</div>'
                            +'<div class="near_address" style="line-height: .2rem;">地址：<span>'+this.address+'</span></div>'
                            +'<div style="line-height: .2rem;">营业时间：<span>'+this.serviceTimeDesc+'</span></div>'
                            +'<div style="line-height: .2rem;">取件时间：<span>'+this.pickupTimeDesc+'</span></div>'
                            +'<div class="near_phonenumber" data-spmv="a106.b2113.c4636_'+ spmv_i +'.d7183" style="line-height: .2rem;">电话：'+contactTel_str+'</div>'
                            +'</div>'
                            +'</div>'
                            var j = item_length+i+1;
                            var spmIdNumber = "a106.b2113.c4636_" + j;
                             BizLog.call('info',{
                                spmId:spmIdNumber,
                                actionId:'exposure',
                                params:{
                                  CompName:this.merchantName,
                                  CompAddr:this.address
                                }
                            })

                })
                if(JSON.stringify(obj.pageNum) == 1){
                  $(".near_expresscontent").html(html);
                }else{
                  $(".near_expresscontent").append(html);
                }
                $(".near_expresscontent").append('<div class="am-loading" aria-label="加载中"><i class="am-icon loading" aria-hidden="true" style="display:inline-block;"></i><span style="position:relative;top:-0.05rem;">正在加载</span></div>')
                if (result.result.hasNextPage == false && JSON.stringify(obj.pageNum) > 1) {
                  $(".am-loading").remove();
                  $(".near_expresscontent").append('<div class="am-loading" style="display:flex;justify-content:center;align-items:center;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;padding: .08rem 0 .12rem;"><p class="am-loading-text" style="display:inline-block;">没有更多数据了</p></div>');
                }else if(result.result.hasNextPage == false && JSON.stringify(obj.pageNum) == 1){
                  $(".am-loading").remove();
                  $(".near_expresscontent").append('<div class="am-loading" style="display:flex;justify-content:center;align-items:center;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;padding: .08rem 0 .12rem;"><p class="am-loading-text" style="display:inline-block;">没有更多数据了</p></div>');
                  $(window).unbind("scroll");
                }
                if(result.result.hasNextPage == false && result.result.list.length < 5 && JSON.stringify(obj.pageNum) == 1){
                  $(".am-loading").remove();
                  $(window).unbind("scroll");
                }


                $(".am-flexbox:after").css("hight","0")
                $(".locationcontent").hide();

                isSearch = false;

              }else{
                if(JSON.stringify(obj.pageNum) == 1){
                  $(".locationcontent").show();
                  $(".near_expresscontent").html("");
                  $(".am-input-autoclear").addClass("am-input-autoclear-empty");
                  $(".nolocation").html('<p>这个地址附近没有发现快递网点，</p><p style="margin-top: .05rem;">换个地址试试~</p>');
                  $(window).unbind("scroll");
                  isSearch = false;
                }
                if(result.result.hasNextPage == false && JSON.stringify(obj.pageNum) != 1){
                  $(".near_expresscontent").append('<div class="am-loading" style="display:flex;justify-content:center;align-items:center;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;padding: .08rem 0 .12rem;"><p class="am-loading-text" style="display:inline-block;">没有更多数据了</p></div>');
                  $(window).unbind("scroll");
                  return false;
                }
              }
          }else{
           $(".locationcontent").show();
           $(".near_expresscontent").html("");
           $(".am-input-autoclear").addClass("am-input-autoclear-empty");
           $(".nolocation").html('<p>这个地址附近没有发现快递网点，</p><p style="margin-top: .05rem;">换个地址试试~</p>');
           $(".near_expresscontent").unbind("scroll");
            isSearch = false;
          }
      },function (result) {
         $(".locationcontent").show();
         $(".near_expresscontent").html("");
         $(".am-input-autoclear").addClass("am-input-autoclear-empty");
         $(".nolocation").html('<p>这个地址附近没有发现快递网点，</p><p style="margin-top: .05rem;">换个地址试试~</p>');
         $(window).unbind("scroll");
          isSearch = false;
      });
	  }
  })
