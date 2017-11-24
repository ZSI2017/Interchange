Zepto(function($){
    ant.call('setTitle', {
      title: '附近快递网点',
    });
    //获取经纬度
    ant.call("getLocation", function (result) {
	    if (result.error) {
         toast({
             text:"无法获取定位，请先授权app使用定位"
         });
	      // alert("result.errorMessage");
        $(".nearsearch_input").placeholder("正在定位中...");
	      return;
	    }
	    $(".nearsearch_input").val(result.pois[0].address);
  		// $(".nearsearch_input").css({"color":"#000"});
  		var info = {"lng":result.longitude,"lat":result.latitude};
  		Express.Near(info);
    });

    //点击定位
    $(".locationbtn").on('click',function(){
    	ant.call("getLocation", function (result) {
  	    if (result.error) {
          toast({
              text:"无法获取定位，请先授权app使用定位"
          });
  	      return;
  	    }
  	    $(".nearsearch_input").val(result.pois[0].address);
    		var info = {"lng":result.longitude,"lat":result.latitude}
    		Express.Near(info);
    	});
    })
    //取消
    $(".cancel_button").on("click",function(){
      ant.call("getLocation", function (result) {
        if (result.error) {
          toast({
              text:"无法获取定位，请先授权app使用定位"
          });
          return;
        }
        $(".nearsearch_input").val(result.pois[0].address);
        var info = {"lng":result.longitude,"lat":result.latitude}
        Express.Near(info);
      });
      $(".location").css("display","none");
      $(".cancel_button").css("display","none");
      $(".locationbtn").css("display","inline-block");
    })


    $(".express_content").show();
    /*失去焦点*/
    $(".nearsearch_input").blur(function(){
    	var key = $(".nearsearch_input").val();
    	if(key == ''){}else{
	    	var info = {keyword: key};
	    	Express.Search(info);
    	}
      $(".search-start,.am-search-icon,am-search-clear,search,.nearsearch_input,.clear-tiny").css("background","#fff");
      $(".am-input-autoclear").css("background","#f1f1f1");
    })
    /*获取焦点*/
    $(".nearsearch_input").focus(function(){
    	$(".near_expresscontent").hide();
      $(".search-start,.am-search-icon,am-search-clear,search,.nearsearch_input,.clear-tiny").css("background","#f1f1f1");
      $(".am-input-autoclear").css("background","#fff");
      $('.location').css("display","inline-block");
      $(".nearsearch_input").val("");
      $(".locationbtn").css("display","none");
      $(".cancel_button").css("display","inline-block");
      // alertLocation();
      searchLication();

       
    })
    

    $(".location").on('click',function(e) {
          // alert(11);
          getCity(city,cityCode);
        })

   // $(".locationcontent").hide();

  
});


    function searchLication () {
      var search_loaction = $("#cityTitle").html();
      AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
      // alert(search_loaction);
       var autoOptions = {
          city: search_loaction, //城市，默认全国
          input: "input_id"//使用联想输入的input的id
       };
       autocomplete= new AMap.Autocomplete(autoOptions);
       var placeSearch = new AMap.PlaceSearch({
            city:"",
            map:map
       });
      AMap.event.addListener(autocomplete, "select", function(e){
        //TODO 针对选中的poi实现自己的功能
        placeSearch.search(e.poi.name)
        var info = {keyword: e.poi.name};
        Express.Search(info);
      });
       
       
      });

    }
    
/*********获取当前市**********/

      //定位窗口
    alertLocation();
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
                searchLication();

            }
        });
    }
      //定位不成功
    function dingweiInfo(){

    }

    //定位确定拉取后台数据
    function initStateComfirmData(cityCode){


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

            initStateComfirmData(cityCode);
            // searchLication();
        });
    }



  var Express = new Object({
	  Search:function(obj){
      var xhrurl = jUrl + "/ep/site/search";
      $.axs(xhrurl,obj,function(result){
		  // $.ajax({
      //     type:"POST",
      //     url:jUrl + "ep/site/search",
      //     data: JSON.stringify(obj),
      //     dataType: 'json',
      //     contentType: 'application/json',
      //     beforeSend:function(){
      //   	  ant.showLoading({
  		// 			 text: '加载中',
  		// 	    });
      //     },
      //     complete:function(){
      //   	  ant.hideLoading();
      //     },
      //     success:function(result) {
          if(result.meta.code == "0000"){ 
           var html = '';
        	 $.each(result.result, function(i){
          	 var contactTel = '';
  						var splitval = this.contactTel.substring(0, this.contactTel.length-1);
                tagval=splitval.split(",");
                $.each(tagval, function(j){
    							if(j>0){
                    if(j<2){
                      contactTel += '<a href="tel:'+tagval[j]+'" style="color:#108ee9;padding-left:.15rem;">'+tagval[j]+'</a>';
                    }else{
                      contactTel += '<a href="tel:'+tagval[j]+'" style="color:#108ee9;padding-left:.15rem;display:inline-block;padding-left: .45rem;">'+tagval[j]+'</a>';
                    }
                  }else if(j==0){
                    contactTel += '<a href="tel:'+tagval[j]+'" style="color:#108ee9;">'+tagval[j]+'</a>';
                  }
  	            });
          		  html += '<div class="am-list-item">'
          		        +'<div class="am-list-content near_eplist">'
          		        +'<div class="am-list-title" style="font-size: .17rem;line-height:.28rem;padding-bottom:.04rem;">'+this.merchantName+'-'+this.siteName+'</div>'
          		        +'<div style="line-height: .2rem;">地址：<span>'+this.address+'</span></div>'
          		        +'<div style="line-height: .2rem;">营业时间：<span>'+this.serviceTimeDesc+'</span></div>'
          		        +'<div style="line-height: .2rem;">取件时间：<span>'+this.pickupTimeDesc+'</span></div>'
          		        +'<div class="near_phonenumber" style="line-height: .2rem;">电话：'+contactTel+'</div>'
          		        +'</div>'
          		        +'</div>'
                });
               $(".locationcontent").hide();
               $(".near_expresscontent").show();
            	 $(".near_expresscontent").html(html);
           }else{
             $(".near_expresscontent").hide();
          	 $(".locationcontent").show();
           	 $(".am-input-autoclear").addClass("am-input-autoclear-empty");
          	 $(".nolocation").html('<p>这个地址附近没有发现快递网点，</p><p style="margin-top: .05rem;">换个地址试试~</p>');
           }


          // error:function(){
        	//   //location.href="system-error.html";
          // }

      });
    },
	  Near:function(obj){
      var xhrurl = jUrl + "/ep/site/near";
      $.axs(xhrurl,obj,function(result){
		  // $.ajax({
      //     type:"POST",
      //     url:jUrl + "/ep/site/near",
      //     data: JSON.stringify(obj),
      //     dataType: 'json',
      //     contentType: 'application/json',
      //     beforeSend:function(){
      //   	  ant.showLoading({
			// 		text: '加载中',
			//   });
      //     },
      //     complete:function(){
      //   	  ant.hideLoading();
      //     },
      //     success:function(result) {
            // f(result.meta.success)  {
        if(result.meta.code == "0000"){
        var html = '';
      	 $.each(result.result, function(i){
        		 var contactTel = '';
						var splitval = this.contactTel.substring(0, this.contactTel.length-1);
	                    tagval=splitval.split(",");
	                    $.each(tagval, function(j){
							if(j>0){
								if(j<2){
									contactTel += '<a href="tel:'+tagval[j]+'" style="color:#108ee9;padding-left:.15rem;">'+tagval[j]+'</a>';
								}else{
									contactTel += '<a href="tel:'+tagval[j]+'" style="color:#108ee9;padding-left:.15rem;display:inline-block;padding-left: .45rem;">'+tagval[j]+'</a>';
								}
							}else if(j==0){
								contactTel += '<a href="tel:'+tagval[j]+'" style="color:#108ee9;">'+tagval[j]+'</a>';
							}
	                    });
                		 html += '<div class="am-list-item">'
                		        +'<div class="am-list-content near_eplist">'
                		        +'<div class="am-list-title" style="font-size: .17rem;line-height:.28rem;padding-bottom:.04rem;">'+this.merchantName+'-'+this.siteName+'</div>'
                		        +'<div style="line-height: .2rem;">地址：<span>'+this.address+'</span></div>'
                		        +'<div style="line-height: .2rem;">营业时间：<span>'+this.serviceTimeDesc+'</span></div>'
                		        +'<div style="line-height: .2rem;">取件时间：<span>'+this.pickupTimeDesc+'</span></div>'
                		        +'<div class="near_phonenumber" style="line-height: .2rem;">电话：'+contactTel+'</div>'
                		        +'</div>'
                		        +'</div>'
                	 })
                	 $(".near_expresscontent").html(html);
                	 $(".locationcontent").hide();
                	 $(".near_expresscontent").show();
                 }else{
                	 $(".locationcontent").show();
					         $(".am-input-autoclear").addClass("am-input-autoclear-empty");
                	 $(".nolocation").html('<p>这个地址附近没有发现快递网点，</p><p style="margin-top: .05rem;">换个地址试试~</p>');
                 }
              //  }else{
            	//       $(".locationcontent").show();
				      //       $(".am-input-autoclear").addClass("am-input-autoclear-empty");
              // 	    $(".nolocation").html('<p>这个地址附近没有发现快递网点，</p><p style="margin-top: .05rem;">换个地址试试~</p>');
              //  };
          // error:function(){
        	//   //location.href="system-error.html";
          // }
        });
	  }
  })
