var jUrl ="https://sendex.alipay-eco.com/api";
var indexUid = "SD1010",//寄快递首页
addInfoUid = "AR1010",//地址信息
addInfosUid = "AR1020",//填写寄件人地址
addInforUid = "AR1030",//填写收件人地址
rRid="AR1070",//管理收件人地址
sRid="AR1060",//管理寄件人地址
sflag=false,rflag=false
selectSUid="AR1040",//选择寄件人地址
selectRUid="AR1050";//选择收件人地址
yUid = "BM2010",//寄件信息填写
xUid="BM1010",//选择快递
orderUid="BM4010";//订单详情

// 判断是否 苹果  or 安卓
 var u = navigator.userAgent;
 var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
 var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

//实时下单
var timeUrl = "https://h5.m.taobao.com/guoguo/grap2post-alipay/index.html?defaultTab=pick";
//同城直送
var cityUrl = "city-direct.html";
//同城货运
var frUrl = "http://wap.lanxiniu.com/Lahuo/index?fr=alipay";
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
  	ant.showLoading({
  		text: '加载中',
  	});
}

function hideLoading(){
	ant.hideLoading();
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

function pushWindow(url,hideBody){
	if(hideBody){
		$(document.body).hide();
	}
	ant.pushWindow({
		url: url
	});
}

function promotion(cityCode,pageId){
	$(".promotion-txt").hide();
	var info = {
		"pageId" : pageId,
		"cityCode":cityCode
	};
	//var xhrurl = '/api/index/adbanner';
	var xhrurl = jUrl+'/ep/promotion';
	$.axs(xhrurl, info, function(data) {
		if (data.meta.success) {
			var operaPosition = data.result.promos,oHtml='';
			if(operaPosition && operaPosition!=''){
				$(".promotion-txt").show();

				for(var k=0;k<operaPosition.length;k++){
              console.log("url "+k+operaPosition[k].linkUrl);
					if(operaPosition[k].linkUrl!=null){
						var adUrl = operaPosition[k].linkUrl;
					}else{
						var adUrl="javascript:void(0)";
					}
					oHtml+='<a class="swiper-slide" href="'+adUrl+'"><div style="max-height:1rem;" ><img src="'+operaPosition[k].imageUrl+'" style="width:100%;display:block;max-height:1rem;"></div></a>';
				}

        // 图片预加载
        var count =0,images=[];
        for(var m =0;m<operaPosition.length;m++){
              images[m] = new Image();
                images[m].src=operaPosition[m].imageUrl;
                images[m].onload= function(){
                      if(++count>= operaPosition.length){
                        $(".index_list").html(oHtml);
                        if(operaPosition.length>1){
                          var mySwiper = new Swiper('.swiper-container',{
                               pagination:'.swiper-pagination',
                               paginationClickable :true,
                               speed:300,
                               autoplay: 5000,
                               autoplayDisableOnInteraction : false,
                          });
                          $(".promotion-txt").show();
                        }else{
                           var mySwiper = new Swiper('.swiper-container',{
                             paginationClickable :true,
                          });
                        }
                        mySwiper.update(true);
                      //  return operaPosition.length;
                        //  mySwiper.updateSlidesSize();
                        //  mySwiper.updatePagination();
                      }
              };
              images[m].onerror = function(){

              }

        }
			}
		}
	});
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
  *
**/
function notPaidOrder(notPaidOrderNo,notPaidRemindCnt){
     // 测试阶段 这里
        //  return;
         if(notPaidRemindCnt==0||notPaidRemindCnt==''|| !notPaidRemindCnt){
         }else{
             console.log("notPaidOrderNo " +notPaidOrderNo);
             console.log("notPaidRemindCnt "+notPaidRemindCnt);
             var letters = "您有一张订单未完成支付，请前去支付以免影响派送~";
             if(notPaidRemindCnt>=2){
               letters = "您有一张订单未完成支付，请前去支付以免影响您的信用~";
              }
              if(window.confirm(letters)){
                ant.pushWindow({
                 url: "order-details.html?orderNo="+notPaidOrderNo+"&orderUid="+orderUid+"&webview_options=pullRefresh%3DYES"+"&payways3=true",
                 param: {
                      showLoading:true,
                      pullRefresh:true
                    }
               });
            }
         }
}

function processPhoneNum(phoneNum){
	phoneNum = phoneNum.replace(/[^0-9]+/g,"");
	if(phoneNum.indexOf("86") ==0){
		phoneNum = phoneNum.slice(2, phoneNum.length);
	}
	if (phoneNum.length > 11) {
		phoneNum =phoneNum.slice(0, 11);
		toast({
			text: '手机号码不能超过11位'
		});
	}
	return phoneNum;
}
function isCorrectPhoneNum(phoneNum){

	var reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
	if(!(reg.test(phoneNum))&&phoneNum!=""&&phoneNum!=" "){
		return false;
	}
	if(phoneNum.length != 11){
		return false;
	}
	return true;
}

/*
*
*
*/
document.addEventListener('h5NetworkChange', function (e) {
	ant.network.getType(function (result) {

		if(result.networkAvailable == false){
			toast({
				text: '网络不给力',
				type: 'exception'
			});
		}
	});

}, false);
/**
 *   通过code 获取省市区的通用方法；返回
 */
function getAreaNameByCode(code){
 var code=code.toString();
 var result="";
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
							text: Message(d.meta.code) + ": " + d.meta.code,
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
		  console.log(url+":"+JSON.stringify(d));
		  if(d.meta.success){
			successfn(d);
		  }else{
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
		AlipayJSBridge.call("getAuthCode",{
			scopeNicks:['auth_base'] //主动授权：auth_user，静默授权：auth_base
		},function(result){
			auth_code=result.authcode;
			var info = {
				"authCode" : auth_code
			};
			var xhrurl = jUrl+'/ep/user/base_auth';
			$.axs_base(xhrurl,info,false,function (d) {
				if (d.meta.success) {
					doNext();
				} else {
					toast({
						text: "获取用户信息失败",
						type: 'exception'
					})
				}
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
