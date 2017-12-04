var jUrl ="https://sendex.alipay-eco.com/api";

// var url =  require("./config.js");
// alert(url.jUrl);
var indexUid = "SD1010",//寄快递首页
addInfoUid = "AR1010",//地址信息
addInfosUid = "AR1020",//填写寄件人地址
addInforUid = "AR1030",//填写收件人地址
rRid="AR1070",//管理收件人地址
sRid="AR1060",//管理寄件人地址
sflag=false,rflag=false,
selectSUid="AR1040",//选择寄件人地址
selectRUid="AR1050",//选择收件人地址
yUid = "BM2010",//寄件信息填写
xUid="BM1010",//选择快递
orderUid="BM4010",//订单详情
isNetworkAvailable= true,  // 判断网络状态
refreshFlag = true;   // 下拉刷新 标识。


// 判断是否 苹果  or 安卓
 var u = navigator.userAgent;
 var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
 var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

// //实时下单
// var timeUrl = "https://h5.m.taobao.com/guoguo/grap2post-alipay/index.html?defaultTab=pick";
//同城直送
var cityUrl = "city-direct.html";
// //同城货运
// var frUrl = "http://wap.lanxiniu.com/Lahuo/index?fr=alipay";
//附近快递资源
var nearUrl = "near-list.html";
//console.log($.DateToUnix('2014-01-01 20:20:20'));
var query = getQuery();
var depth = (+query.depth) || 0;
//获取url中参数
function getUrlParam(name){
	//构造一个含有目标参数的正则表达式对象
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	//匹配目标参数
	var r = window.location.search.substr(1).match(reg);
	//返回参数值
	if (r!=null) return decodeURI(r[2]);
	return null;
}
function toast(config, callback){
	ant.toast(config, callback);
}

function showLoading(){
	$(document.body).hide();
 document.addEventListener('AlipayJSBridgeReady', function () {
     AlipayJSBridge.call('showLoading', {
       text: '加载中'
     });
   }, false);
}

// 渲染html 模板
function format() {
  if (arguments.length == 0) {
    return "";
  }
  var str = arguments[0];
  for (var i = 1, len = arguments.length; i < len; i++) {
    var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
    str = str.replace(re, arguments[i]);
  }
  return str;
};

// function ready(callback) {
//   // 如果jsbridge已经注入则直接调用
//   if (window.AlipayJSBridge) {
//     callback && callback();
//   } else {
//     // 如果没有注入则监听注入的事件
//     document.addEventListener('AlipayJSBridgeReady', callback, false);
//   }
// }
// ready(function(){
//   AlipayJSBridge.call('getServerTime', function (data) {
//         var tempDate = new Date(data.time)
//         // alert(getFullDate(data.time,10))
//         // alert(data.time)
//   });
// });
//
// function getFullDate(time,count){
//   var tempDate = new Date(time)
//   tempDate.setDate(tempDate.getDate()+count);//获取AddDayCount天后的日期
//     var y = tempDate.getFullYear();
//     var m = tempDate.getMonth()+1;//获取当前月份的日期
//     var d = tempDate.getDate();
//     return y+"-"+m+"-"+d;
// }

function hideLoading(){

  document.addEventListener('AlipayJSBridgeReady', function () {
       AlipayJSBridge.call("hideLoading");
    }, false);
	$(document.body).show();
}

   // 文本 点击态的 统一函数
  function clickStatus(e){
      this.on("touchstart",function(){
           $(this).css("opacity",'0.3');
      });
      this.on("touchend",function(){
           $(this).css("opacity",'1');
      });
   };
 //  toast 提示 被键盘掩盖问题
   function checkBlur(e){
       this.blur();
    }


function pushWindow(url,hideBody){
	if(hideBody){
		$(document.body).hide();
	}
	ant.pushWindow({
		url: url
	});
}

 /**
   *
   *
   **/
function pushDownRefresh(ListentEvent1,ListentEvent2,ListentEvent3,content1,callback){

  var content = document.getElementsByClassName("express_content")[0];
     var _start = 0,_end=0;
     var timeOut = -50;
     var endLose = true;
     if(isAndroid){
        timeOut = -5;
     }
     content.addEventListener("touchstart",function(event){
       if(!refreshFlag){ return;}
       var touchTarget = event.targetTouches[0];
       _start = touchTarget.pageY;
     },false);
     content.addEventListener("touchmove",function(e){
        if(!refreshFlag){ return;}
         var touchTarget = e.targetTouches[0];
         _end= _start -touchTarget.pageY;
         if(_end<=timeOut&&$(window).scrollTop()<=0){
             ListentEvent1(_end);
             setTimeout(function(){
                if(endLose){
                    callback();
                }
             },2000);
         }
     });
     content.addEventListener("touchend",function(){
         endLose = false;
         if(!refreshFlag){ return;}
          if(_end<timeOut&&$(window).scrollTop()<=0){
              callback();
          }
     },false);
}

/**
 *  获取公告内容接口
 *  @method getNotice
 *  @param  {string}  cityCode 当前城市对应cityCode
 *  @param  {string}  pageId   当前页面对应的pageID
 *  @param  {string}  spmId   当前公告对应的spmId
 *  @return {null}             没有返回值
 */
function getNotice(cityCode,pageId,spmId,cacheName){
  var info = {
    "pageId" : pageId,
    "cityCode":cityCode
  };
  var xhrurl = jUrl+'/ep/notice';
  $.axs(xhrurl,info,function(data){
     if(data.meta.success){
           var noticeContent = data.result;
           if(noticeContent){
             $(".express-content-notice").css("margin-top","0");
             $(".header_notification").show();
             window.cancelAnimationFrame(window.stop);
             $(".marquee3k").empty();
             $(".am-notice-content").empty();
             $(".am-notice-content").html(
                                '<div class="marquee3k" data-speed="0.4" data-pausable="bool">\
                                 <h1 style="font-size:.14rem;font-weight:normal">\
                                  <span class="noticeval" >' +
                                    noticeContent +
                                  '</span>\
                                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\
                                 </h1>\
                                 </div>'
                                 )
                           Marquee3k.init()
                           Marquee3k.refreshAll();
             if(spmId){
               BizLog.call('info',{          //公告显示埋点
                   spmId:spmId,
                   actionId:'exposure',
                   params:{
                       title:noticeContent
                   }
               })
             }
           if(cacheName){
              //放入缓存中
              var sessionObj = {};
              sessionObj[cacheName+cityCode] = noticeContent;
              ant.setSessionData({
                    data: sessionObj
              })
            }
           }else {
               $(".header_notification").hide();
           }
     }
  },function(d){
      $(".header_notification").hide();
       console.log(d);
  })
}



function promotion(cityCode,pageId,spmId,cacheName){
	$(".promotion-txt").hide();
	var info = {
		"pageId" : pageId,
		"cityCode":cityCode
	};
	//var xhrurl = '/api/index/adbanner';
	var xhrurl = jUrl+'/ep/promotion';
	$.axs(xhrurl, info, function(data) {
		if (data.meta.success) {
			var operaPosition = data.result.promos;
      if(cacheName){
        // 存入缓存
        var sessionObj = {};
        sessionObj[cacheName+cityCode] = operaPosition;
        ant.setSessionData({
              data: sessionObj
        })
      }
      setPromotionImg(operaPosition,spmId)
		}
	},function(){

  });
}

/**
 *  生成对应的轮播图
 *  @method setPromotionImg
 *  @param  {Array}        operaPosition 保存图片相关信息的数组
 *  @param  {string}        spmId         埋点
 */
function setPromotionImg(operaPosition,spmId){
  var oHtml='';
  if(operaPosition && operaPosition!=''){
    $(".promotion-txt").show();
     var swiperHTML =  '<div class="swiper-container" style="bottom:-1px;">'+
                     '<div class="swiper-wrapper swiper_list index_list"></div>'+
                      '<div class="swiper-pagination" style="display:none"></div>'+
                      '</div>';
     $(".promotion-txt").html(swiperHTML);
    for(var k=0;k<operaPosition.length;k++){
      if(operaPosition[k].linkUrl!=null){
        var adUrl = operaPosition[k].linkUrl;
        var adPromotionId = operaPosition[k].promotionId;
        var adName = operaPosition[k].name;
      }else{
        var adUrl="javascript:void(0)";
      }
        var spmId_K = k+1;
        oHtml+='<a class="swiper-slide" _href="'+adUrl+'" _promotionId="'+adPromotionId+'" _name="'+adName+'" data-spmv="'+ spmId +'.'+ spmId_K +'"><div style="max-height:1rem;" ><img src="'+operaPosition[k].imageUrl+'" style="width:100%;display:block;max-height:1rem;border:0"></div></a>';

      BizLog.call('info',{
        spmId:spmId,
        actionId:'exposure',
        params:{
            CampID:adPromotionId,
            CampName:adName,
        }
      });
     }
     // 图片预加载
     var count =0,images=[];
     for(var m =0;m<operaPosition.length;m++){
           images[m] = new Image();
             images[m].src=operaPosition[m].imageUrl;
             images[m].onload= function(){
                   if(++count>= operaPosition.length){
                     $(".index_list").html(oHtml);
                     $(".index_list a").on("click",function () {
                       var tempUrl = $(this).attr("_href");
                       var tmmpPromotionId = $(this).attr("_promotionId");
                       var tmmpName = $(this).attr("_name");
                       var spmIdNmuber = $(this).attr("data-spmv");
                       BizLog.call('info',{
                            spmId:spmIdNmuber,
                            actionId:'clicked',
                            params:{
                                   CampID:tmmpPromotionId,
                                   CampName:tmmpName,
                                   ToURL:tempUrl
                            }
                        });
                         pushWindow($(this).attr("_href"),true);
                     });

                     if(operaPosition.length>1){
                       $(".swiper-pagination").show();
                       var mySwiper = new Swiper('.swiper-container',{
                            pagination:'.swiper-pagination',
                            paginationClickable :true,
                            speed:300,
                            autoplay: 5000,
                            autoplayDisableOnInteraction:false
                       });
                       $(".promotion-txt").show();

                     }else{
                         // alert("1456");
                         // alert(mySwiper);
                         $(".swiper-pagination").hide();
                        var mySwiper = new Swiper('.swiper-container',{
                             pagination:'',
                             autoplayDisableOnInteraction : true,
                       });
                     }
                     mySwiper.updatePagination();
                     mySwiper.update(true);

                   //  return operaPosition.length;
                     //  mySwiper.updateSlidesSize();
                   }
           };
           images[m].onerror = function(){

           }

     }
  }else {
      $(".promotion-txt").hide();
  }
}


//返回当前queryString的对象： {query: 1}
function getQuery() {
  var match;
  var urlParams = {};
  var pl = /\+/g;  // Regex for replacing addition symbol with a space
  var search = /([^&=]+)=?([^&]*)/g;
  var decode = function (s) {
    return decodeURIComponent(s.replace(pl, ' '));
  };
  var query = decodeURI(window.location.search.substring(1));

  while (match = search.exec(query)) {
    urlParams[decode(match[1])] = decode(match[2]);
  }

  return urlParams;
}

/**
  *  判断限制下单的弹窗
  *+"&webview_options=pullRefresh%3DYES"+"&payways3=true"
**/
function notPaidOrder(notPaidOrderNo,notPaidRemindCnt){
     // 测试阶段 这里
        //  return;
         if(notPaidRemindCnt==0||notPaidRemindCnt==''|| !notPaidRemindCnt){
              return false;
         }else{
             var letters = "您有一个订单未完成支付，请前去支付以免影响派送~";
             if(notPaidRemindCnt >= 1){
               letters = "您有一个订单未完成支付，请前去支付以免影响您的信用~";
              }
              if(window.confirm(letters)){
                ant.pushWindow({
                 url: "order-details.html?orderNo="+notPaidOrderNo+"&orderUid="+orderUid+"&payways3=true",
                 param: {
                      showLoading:true,
                    }
               });
            }
            return true;
         }
}

function processPhoneNum(phoneNum){
	phoneNum = phoneNum.replace(/[^0-9]+/g,"");
	if(phoneNum.indexOf("86") ==0){
		phoneNum = phoneNum.slice(2, phoneNum.length);
	}
	// if (phoneNum.length > 11) {
    // // $(".mobile_numbers").blur();
	// 	phoneNum =phoneNum.slice(0, 11);
	// }
	return phoneNum;
}
function isCorrectPhoneNum(phoneNum){

	// var reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
	var reg = /^\d{7,15}$/;
	if(!(reg.test(phoneNum))&&phoneNum!=""&&phoneNum!=" "){
		return false;
	}
	// if(phoneNum.length != 11){
	// 	return false;
	// }
	return true;
}

// 手机号码脱敏*****
function cellPhoneHide(cellphone) {
   var sensitiveData,frontCharNum,tailCharNum,hiddenCharNum;
   var temp = cellphone.trim();
   if(cellphone.length === 11) {
        sensitiveData = temp;
        frontCharNum = 3;
        tailCharNum = 2;
        hiddenCharNum =6;
        // return customizeHide(temp,3,2,6);
   } else {
     var  noHideNum = temp.length -4;
     sensitiveData = temp;
     frontCharNum = noHideNum/2;
     tailCharNum = noHideNum-noHideNum/2;
     hiddenCharNum =4;
   }

  //  return customizeHide(tmp,noHideNum/2,noHideNum-noHideNum/2,4)
// }

// function customizeHide (sensitiveData,frontCharNum,tailCharNum,hiddenCharNum){
      var tmp = sensitiveData.trim();
      var length = tmp.length;

    if (frontCharNum < 0 || tailCharNum < 0 || hiddenCharNum < 0 || frontCharNum + tailCharNum > length) {
         return tmp;
     }

     var beginIndex = frontCharNum - 1;
     var  endIndex = length - tailCharNum;

     // 原数据前半部分
    //  StringBuilder result = new StringBuilder();
     var result = [];
     if (beginIndex >= 0 && beginIndex < length)
         result.push(tmp.substring(0, frontCharNum));

     // 中间*
     for (var q = 0; q < hiddenCharNum; q++)
         result.push('*');

     // 原数据后半部分
     if (endIndex >= 0 && endIndex < length)
         result.push(tmp.substring(endIndex));

      return result.join("");

}
// 手机号码脱敏*****

  //
  // document.addEventListener('h5ResourceLost',function(e){
  //         alert(e);
  // },false)

/*
*   查看网络情况 是否连接
*/
document.addEventListener('h5NetworkChange', function (e) {
	ant.network.getType(function (result) {

		if(result.networkAvailable == false){
      isNetworkAvailable = false;
			toast({
				text: '网络不给力',
				type: 'exception'
			});
		}else{
      isNetworkAvailable = true;
    }
	});

}, false);
/**
 *   通过code 获取省市区的通用方法；返回
 */
function getAreaNameByCode(code){
    // alert("begin")
 var code=code.toString();
 var result="";
 var specialCodeArr=[{"id":"410881","value":"河南省 济源市"},
                     {"id":"429004","value":"湖北省 仙桃市"},
                     {"id":"429005","value":"湖北省 潜江市"},
                     {"id":"429006","value":"湖北省 天门市"},
                     {"id":"429021","value":"湖北省 神农架林区"},
                     {"id":"441900","value":"广东省 东莞市"},
                     {"id":"442000","value":"广东省 中山市"},
                     {"id":"442101","value":"广东省 东沙群岛"},
                     {"id":"460200","value":"海南省 三亚市"},
                     {"id":"469001","value":"海南省 五指山市"},
                     {"id":"469002","value":"海南省 琼海市"},
                     {"id":"469003","value":"海南省 儋州市"},
                     {"id":"469005","value":"海南省 文昌市"},
                     {"id":"469006","value":"海南省 万宁市"},
                     {"id":"469007","value":"海南省 东方市"},
                     {"id":"469025","value":"海南省 定安县"},
                     {"id":"469026","value":"海南省 屯昌县"},
                     {"id":"469027","value":"海南省 澄迈县"},
                     {"id":"469028","value":"海南省 临高县"},
                     {"id":"469030","value":"海南省 白沙黎族自治县"},
                     {"id":"469031","value":"海南省 昌江黎族自治县"},
                     {"id":"469033","value":"海南省 乐东黎族自治县"},
                     {"id":"469034","value":"海南省 陵水黎族自治县"},
                     {"id":"469035","value":"海南省 保亭黎族苗族自治县"},
                     {"id":"469036","value":"海南省 琼中黎族苗族自治县"},
                     {"id":"469037","value":"海南省 西沙群岛"},
                     {"id":"469038","value":"海南省 南沙群岛"},
                     {"id":"469039","value":"海南省 中沙群岛的岛礁及其海域"},
                     {"id":"620200","value":"甘肃省 嘉峪关市"},
                     {"id":"659001","value":"新疆维吾尔自治区 石河子市"},
                     {"id":"659002","value":"新疆维吾尔自治区 石河子市"},
                     {"id":"659003","value":"新疆维吾尔自治区 石河子市"},
                     {"id":"659004","value":"新疆维吾尔自治区 石河子市"},
                     {"id":"110228","value":"北京市 密云县"},
                     {"id":"110229","value":"北京市 延庆县"},
                     {"id":"110230","value":"北京市 其它区"},
                     {"id":"500222","value":"重庆市 綦江区"},
                     {"id":"500223","value":"重庆市 潼南县"},
                      {"id":"500224","value":"重庆市 铜梁县"},
                      {"id":"500225","value":"重庆市 大足区"},
                      {"id":"500226","value":"重庆市 荣昌县"},
                      {"id":"500227","value":"重庆市 璧山县"},
                      {"id":"500228","value":"重庆市 梁平县"},
                      {"id":"500229","value":"重庆市 城口县"},
                      {"id":"500230","value":"重庆市 丰都县"},
                      {"id":"500231","value":"重庆市 垫江县"},
                      {"id":"500232","value":"重庆市 武隆县"},
                      {"id":"500233","value":"重庆市 忠县"},
                      {"id":"500234","value":"重庆市 开县"},
                      {"id":"500235","value":"重庆市 云阳县"},
                      {"id":"500236","value":"重庆市 奉节县"},
                      {"id":"500237","value":"重庆市 巫山县"},
                      {"id":"500238","value":"重庆市 巫溪县"},
                      {"id":"500240","value":"重庆市 石柱土家族自治县"},
                      {"id":"500241","value":"重庆市 秀山土家族苗族自治县"},
                      {"id":"500242","value":"重庆市 酉阳土家族苗族自治县"},
                      {"id":"500243","value":"重庆市 彭水苗族土家族自治县"}
                   ];
 specialCodeArr.map(function(item, index, array){
               if(item.id == code){
                   result = item.value;
               }
        });

    if(result !=""){  return result; }
 iosProvinces.map(function(item, index, array) {
		 if (item.id.substring(0, 2) == code.substring(0, 2)){
					 // console.log(item.value);
					 result+=item.value
				 if (code.substring(2, 4) == "00") {
						 return;
				 } else {
						 var cityArr = iosCitys.filter(function(item) {
								 return item.id.substring(0, 2) == code.substring(0, 2)
						 })
						 if (cityArr.length > 0) {
								 cityArr.map(function(item){
										 if (code.substring(2, 4) == item.id.substring(2, 4)) {
												 // console.log(item.value);
												 result+=" ";
												 result+=item.value
												 if (code.substring(4, 6) == "00") {
														 // console.log(item.value);
												 } else {
														 var countyArr = iosCountys.filter(function(item) {
																 return item.id.substring(0, 4) == code.substring(0, 4);
														 })
														 if (countyArr.length > 0) {
																 countyArr.map(function(item, index, array) {
																		 if (code.substring(4, 6) == item.id.substring(4, 6)) {
																			 result+=" ";
																			 result+=item.value;
																				 // console.log()
																		 }
																 })
														 } else {
																 console.log("can't find countys!")
														 }

												 }
										 }
								 })
						 } else {
								 console.log("can't find city")
						 }
				 }
		 }
 })
 // alert(arguments[0])
 if(!arguments[1]){
   var lastArr = result.split(" ");
      if(lastArr[1]){
        var indexofArr = lastArr[1].indexOf("市")
        if(indexofArr>=0) {
                 if(lastArr[0] == lastArr[1].substring(0,indexofArr)) {
                   lastArr = lastArr.slice(1);
                 }
           }
      }
      result = lastArr.join(" ");
   }
		 return result;
}

/**
 *
 *   临时方法
 *   通过 区code 或者 市code 获取 市 code
 */
 function getcityCodeBycountyCode(code){
    var code=code.toString();
 		var result = "";
    var specialCountyCode = ["429004","429005", "429006", "429021","441900","442000","442101","469001", "469002","469003", "469005", "469006","469007","469025","469026","469027","469028","469030","469031","469033","469034","469035","469036","469037","469038","469039","620200","659001", "659002","659003","659004"];
 	   if (code.substring(4, 6) == "00") {
 				  return code;
 		 }
    specialCountyCode.map(function(item, index, array) {
       if (code == item){
   				   console.log(code);
   				   result = code;
            }
         });
   		if(result == ""){
   			  result = code.substring(0,4)+"00";
   		}
         return result;
    }

	function subAreaString(provinceName,cityName, districtName,sendFlag){

		if("黑龙江省" ==provinceName){
			provinceName = "黑龙江";
		}else if( "内蒙古自治区" ==provinceName){
			provinceName = "内蒙古";
		}else{
			provinceName = provinceName.substr(0,2);
		}
		var cityAreaName = cityName+districtName;

    var digit =4;
    if(sendFlag == "true"){
      digit=5;
    }
		if(cityAreaName.length >10){
			var prex = cityAreaName.substring(0,digit);
			var suffix = cityAreaName.substring(cityAreaName.length -digit ,cityAreaName.length);
			cityAreaName = prex+"..."+suffix;
		}
		return provinceName + cityAreaName;
	}

	function clearSeesion() {
		ant.setSessionData({
			data: {
        filterCompanyId:'',
				senderAddrID: '',
				sendName:'',
				sendNumber:'',
				sendProvinceCode:'',
				sendCityCode:'',
				sendAreaCode:'',
				sendStreet:'',
				sendAddress:'',
				reciptiensAddrID:'',
				recName: '',
				recNumber:'',
				recProvinceCode:'',
				recCityCode:'',
				recAreaCode:'',
				recStreet:'',
				recAddress:'',
				serviceAuthStatus:'',
				epCompanyId:'',
				epCompanyNo:'',
				epCompanyName:'',
				acceptOrderFrom:'',
				acceptOrderTo:'',
				receiverCount:'',
				sendercount :''
			}
		});

	}

Zepto(function($) {
  alert(isNetworkAvailable)

	/**
	 * 当前时间戳
	 * @return <int>        unix时间戳(秒)
	 */
	$.CurTime = function () {
		return Date.parse(new Date()) / 1000;
	},
		/**
		 * 日期 转换为 Unix时间戳
		 * @param <string> 2014-01-01 20:20:20  日期格式
		 * @return <int>        unix时间戳(秒)
		 */
		$.DateToUnix = function (string) {
			var f = string.split(' ', 2);
			var d = (f[0] ? f[0] : '').split('-', 3);
			var t = (f[1] ? f[1] : '').split(':', 3);
			return (new Date(
					parseInt(d[0], 10) || null,
					(parseInt(d[1], 10) || 1) - 1,
					parseInt(d[2], 10) || null,
					parseInt(t[0], 10) || null,
					parseInt(t[1], 10) || null,
					parseInt(t[2], 10) || null
				)).getTime() / 1000;
		},
		/**
		 * 时间戳转换日期
		 * @param <int> unixTime    待时间戳(秒)
		 * @param <bool> isFull    返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
		 * @param <int>  timeZone   时区
		 */
		$.UnixToDate = function (unixTime, isFull, timeZone) {
			if (typeof (timeZone) == 'number') {
				unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
			}
			var time = new Date(unixTime * 1000);
			var ymdhis = "";
			ymdhis += time.getUTCFullYear() + "-";
			ymdhis += (time.getUTCMonth() + 1) + "-";
			ymdhis += time.getUTCDate();
			if (isFull === true) {
				ymdhis += " " + time.getUTCHours() + ":";
				ymdhis += time.getUTCMinutes() + ":";
				ymdhis += time.getUTCSeconds();
			}
			return ymdhis;
		}
	/**
	 * 验证用户登录权限的ajax封装
	 * url 发送请求的地址
	 * data 发送到服务器的数据
	 * successfn 成功回调函数
	 */

	$.axs = function (url, data, successfn,errorfn) {
		$.axs_base(url,data,true,successfn,
			function (d) {
				//如果返回的是用户登录无效，则重新进行静默授权
				if (d.meta.code == '0013' || d.meta.code == '0014') {
					//进行静默授权，如果授权成功，重新进行接口调用
                    baseAuth(function(){
						$.axs_base(url,data,true,successfn,errorfn);
					});
				} else {
					if(errorfn){
						errorfn(d);
					}else{
						console.info("into toast");
						toast({
							text: Message(d.meta.code),
							type: 'exception'
						})
					}
				}
			});
	}


	/**
	 * ajax不包含业务逻辑处理的封装
	 * url 发送请求的地址
	 * data 发送到服务器的数据
	 * successfn 成功回调函数
	 * errorfn 失败回调函数
	 */
	$.axs_base = function (url, data, async, successfn,errorfn) {
		console.log(url+":"+JSON.stringify(data));
    // alert(url);
    $.ajax({
    	type: "post",
		timeout : 10000,
		url: url,
		dataType: "json",
		async: async,
		crossDomain: true,
		contentType: "application/json; charset=utf-8",
		data: JSON.stringify(data),
		xhrFields: {
		  withCredentials: true
		},
		success: function (d) {
			console.log(url+":"+JSON.stringify(data)+":"+JSON.stringify(d));
		  	if(d.meta&&d.meta.success){
				successfn(d);
		  	}else{
				if(!d.meta){
					d={"meta":{"code":"99999","msg":"系统异常","success":false},"result":null}
				}
				errorfn(d);
			}
		},
		error: function (jqXHR, statusTxt, errorThrown) {
			 hideLoading();
		  	ajaxErr(jqXHR, statusTxt, errorThrown);
		}
  	});
	}

    //仅做接口 重新登录用
	function baseAuth(doNext){
        var authData={
            scopeNicks:['auth_base']//主动授权：auth_user，静默授权：auth_base
        }
        console.log("env is " +env);
	    if(env == "sit"){
            authData ={
                scopeNicks:['auth_base'], //主动授权：auth_user，静默授权：auth_base
                appId:"2017010904949252"
            }
        }

		AlipayJSBridge.call("getAuthCode",authData,function(result){
			auth_code=result.authcode;
			var info = {
				"authCode" : auth_code
			};
			var xhrurl = jUrl+'/ep/user/base_auth';
			$.axs_base(xhrurl,info,false,function (d) {
				if (d.meta.success) {
					doNext();
				}
			},function (d) {
				toast({
						text: "获取用户信息失败",
						type: 'exception'
					})
			});
		});
	}

		   /**
        *   发送成功后，返回的错误码
		   **/
	function Message(mescode){
    switch (mescode) {
    	case ("0912"):
					return "已经成功转为EMS为您服务啦～";
					break;
				case("0512"):
					return "订单已取消";
					break;
        case("9999"):
            return "系统异常";
            break;
        default:
					return "加载出错，请重试";
            }
	}

  /**
 * ajax统一错误处理
 */
function ajaxErr(jqXHR, statusTxt, errorThrown) {
	var text= "";
  	switch (jqXHR.status) {
  		case (500):
	  		text="加载出错，请重试";
			break;
		case (404):
			text="网络不给力";
			break;
		case (408):
			text="网络不给力";
			break;
		case (0):
			text="网络不给力";
			break;
		default:
			text="加载出错，请重试";
	  }
	  toast({
		  text: text,
		  type: 'exception'
	  });
	}
});
