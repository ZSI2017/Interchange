"use strict";Zepto(function(e){function t(){showLoading(),ant.getSessionData({keys:["reciptiensAddrID","recName","recNumber","recProvinceCode","recCityCode","recAreaCode","recStreet","recAddress","senderAddrID","sendName","sendNumber","sendProvinceCode","sendCityCode","sendAreaCode","sendStreet","sendAddress","serviceAuthStatus","receiverCount","senderCount","real_sendNumber","real_recNumber","real_sendName","real_recName","addressGoodsOneValue","addressGoodsOneIndex"]},function(e){k=e.data.real_recNumber||"",N=e.data.real_sendNumber||"",f=e.data.real_sendName||"",J=e.data.real_recName||"",G=e.data.addressGoodsOneIndex||"",z=e.data.addressGoodsOneValue||"",g=e.data.senderAddrID||"",h=e.data.sendName||"",v=e.data.sendNumber||"",C=e.data.sendProvinceCode||"",_=e.data.sendCityCode||"",y=e.data.sendAreaCode||"",S=getAreaNameByCode(y).replace(/\s/g,""),w=S,b=e.data.sendAddress||"",A=e.data.reciptiensAddrID||"",I=e.data.recName||"",O=e.data.recNumber||"",D=e.data.recProvinceCode||"",x=e.data.recCityCode||"",W=e.data.recAreaCode||"",T=getAreaNameByCode(W).replace(/\s/g,""),L=T,P=e.data.recAddress||"",B=e.data.receiverCount||0,V=e.data.senderCount||0,a(),o(),hideLoading(),ant.setSessionData({data:{edit_senderAddrID:g,edit_sendName:f,edit_sendNumber:N,edit_sendAddress:b,edit_sendProvinceCode:C,edit_sendCityCode:_,edit_sendAreaCode:y,edit_street:w,edit_reciptiensAddrID:A,edit_recName:J,edit_recNumber:k,edit_recAddress:P,edit_recProvinceCode:D,edit_recCityCode:x,edit_recAreaCode:W,edit_recStreet:L}})}),ant.setSessionData({data:{filterCompanyId:[],productTypeId:"",productTypeName:"",presetWeight:"",presetWeightPrice:"",extraWeightUnit:"",extraWeightPrice:"",goodsOneValue:"",goodsOneIndex:"",goodstypeValue:"",dayValue:"",timeValue:"",timeDate:"",remarkContent:""}})}function d(){ant.getSessionData({keys:["epCompanyId","serviceAuthStatus"]},function(t){U=t.data.epCompanyId||"",serviceAuthStatus=t.data.serviceAuthStatus||"";var d={},i=jUrl+"/ep/address/index";e.axs(i,d,function(t){if(t.meta.success)var d=setInterval(function(){if(iosProvinces){var i=t.result.sender,n=t.result.receiver;m=t.result.date,console.log(m),V=t.result.senderCount,B=t.result.receiverCount,null!=i&&(g=i.id,h=i.name,f=i.realName,v=i.mobile,N=i.realMobile,C=i.provinceCode,_=i.cityCode,y=i.districtCode,S=getAreaNameByCode(y).replace(/\s/g,""),w=S,b=i.address),null!=n&&(A=n.id,I=n.name,J=n.realName,O=n.mobile,k=n.realMobile,D=n.provinceCode,x=n.cityCode,W=n.districtCode,T=getAreaNameByCode(W).replace(/\s/g,""),L=T,P=n.address),ant.setSessionData({data:{filterCompanyId:[],senderAddrID:g,sendName:h,real_sendName:f,sendNumber:v,real_sendNumber:N,sendProvinceCode:C,sendCityCode:_,sendAreaCode:y,sendStreet:w,sendAddress:b,edit_senderAddrID:g,edit_sendName:f,edit_sendNumber:N,edit_sendAddress:b,edit_sendProvinceCode:C,edit_sendCityCode:_,edit_sendAreaCode:y,edit_street:w,reciptiensAddrID:A,recName:I,real_recName:J,recNumber:O,real_recNumber:k,recProvinceCode:D,recCityCode:x,recAreaCode:W,recStreet:L,recAddress:P,receiverCount:B,senderCount:V,edit_reciptiensAddrID:A,edit_recName:J,edit_recNumber:k,edit_recAddress:P,edit_recProvinceCode:D,edit_recCityCode:x,edit_recAreaCode:W,edit_recStreet:L}}),U||(e(".wpWeight").show(),e("#weightTip").addClass("weightTip"),u(m),l(c()),p()),a(),r(serviceAuthStatus),s(),hideLoading(),clearInterval(d)}},600)})})}function a(){h&&""!=h?(e(".send_where").css({display:"none",color:"#888","padding-top":"0","padding-bottom":"0"}),e(".sendTitle").css({display:"block"}),e(".senddesc").css({display:"-webkit-box"}),e(".sender-name").text(h),e(".sender-number").text(v),e(".senddesc").attr("data-id",g),e(".senddesc").attr("data-provinceNo",C),e(".senddesc").attr("data-cityNo",_),e(".senddesc").attr("data-areaNo",y),e(".senddesc").text(w+b)):(e(".send_where").css({display:"block",color:"#888","padding-top":".15rem","padding-bottom":".15rem"}),e(".sendTitle").css({display:"none"}),e(".senddesc").css({display:"none"})),I&&""!=I?(e(".recp_where").css({display:"none",color:"#666;","padding-top":"0","padding-bottom":"0"}),e(".recTitle").css({display:"block"}),e(".recdesc").css({display:"-webkit-box"}),e(".recp-name").text(I),e(".recp-number").text(O),e(".recdesc").attr("data-id",A),e(".recdesc").attr("data-provinceNo",D),e(".recdesc").attr("data-cityNo",x),e(".recdesc").attr("data-areaNo",W),e(".recdesc").text(L+P)):(e(".recp_where").css({display:"block",color:"#888;","padding-top":".15rem","padding-bottom":".15rem"}),e(".recTitle").css({display:"none"}),e(".recdesc").css({display:"none"}))}function s(){e("#btn-address-submit").click(function(){if(BizLog.call("info",{spmId:"a106.b2100.c4588.d7095",actionId:"clicked"}),!y)return void toast({text:"请完善寄件地址"});if(!W)return void toast({text:"请完善收件地址"});if(U){var t={logisMerchId:U,snderDstrCode:y,rcvrDstrCode:W},d=jUrl+"/ep/address/judge_comp_service_area";e.axs(d,t,function(e){if("0000"==e.meta.code){e.result.isServicing?pushWindow("information-fill.html",!0):pushWindow("select-express.html",!0)}})}else pushWindow("select-express.html?isServicing=1",!0)})}function r(t){e(".sendaddressClick").click(function(){if(BizLog.call("info",{spmId:"a106.b2100.c4586.d7092",actionId:"clicked"}),console.log("sendAddress-btn  touchend"),"0"==t)return console.log("serviceAuthStatus "+t),void i(selectSUid,"1");V>0?pushWindow("select-sender.html",!0):pushWindow("send-address.html",!0)}),e(".sendClick").click(function(){if(BizLog.call("info",{spmId:"a106.b2100.c4586.d7091",actionId:"clicked"}),console.log("sendClick  touchend"),"0"==t)return console.log("serviceAuthStatus "+t),void i(selectSUid,"1","1");pushWindow("send-address.html?edit=write")}),e(".recpaddressClick").click(function(){if(BizLog.call("info",{spmId:"a106.b2100.c4587.d7094",actionId:"clicked"}),"0"==t)return void i(selectRUid,"2");B>0?pushWindow("select-recipient.html",!0):pushWindow("recipient-address.html",!0)}),e(".recpClick").click(function(){if(BizLog.call("info",{spmId:"a106.b2100.c4587.d7093",actionId:"clicked"}),console.log("recpClick  touchend"),"0"==t)return console.log("serviceAuthStatus "+t),void i(selectRUid,"2","2");pushWindow("recipient-address.html?edit=write")}),hideLoading()}function i(e,t,d){document.addEventListener("AlipayJSBridgeReady",function(){var a={scopeNicks:["auth_logis_platform"]};"sit"==env&&(a={scopeNicks:["auth_logis_platform"],appId:"2017010904949252"}),AlipayJSBridge.call("getAuthCode",a,function(a){if(a.authcode){console.log("认证成功 "+a.authcode);n(a.authcode,e,t,d)}})})}function n(t,d,a,s){var r={authCode:t,addrType:a},i=jUrl+"/ep/address/service_auth";e.axs(i,r,function(e){e.meta.success&&"0000"==e.meta.code&&(console.log("tempData "+s),"AR1040"==d?"1"==s?pushWindow("send-address.html?edit=write",!0):"0"==e.result?pushWindow("send-address.html",!0):pushWindow("select-sender.html",!0):"AR1050"==d&&("2"==s?pushWindow("recipient-address.html?edit=write",!0):"0"==e.result?pushWindow("recipient-address.html",!0):pushWindow("select-recipient.html",!0)))})}function o(){var t=e(".wpWeight").attr("data-weight_value");console.log("resumeWeightData"),console.log(t+"+++"+G+"++"+z),console.log(z===t),""!==G&&z!==t&&(e(".wpWeight").attr("data-weight_id",G),e(".wpWeight").attr("data-weight_value",z),e("#goodsweight").text(JSON.parse(JSON.stringify(z))))}function c(){ant.setSessionData({data:{addressGoodsOneValue:"0.5公斤及以下",addressGoodsOneIndex:"0"}});for(var t=[],d=0;d<100;d++){var a=.5+.5*d;a+=0==d?" 公斤及以下":99==d?" 公斤及以上":" 公斤",t.push(a)}return e(".wpWeight").attr("data-weight_id","0"),e(".wpWeight").attr("data-weight_value",t[0]),t}function l(t){var d=document.querySelector("#weightId"),a=e(".wpWeight");a.click(function(){for(var s=a.attr("data-weight_id"),r=(a.attr("data-weight_value"),[]),i=0;i<t.length;i++)r.push({id:i.toString(),value:t[i]});var n={title:"",itemHeight:35,headerHeight:42,cssUtil:"px",oneLevelId:s,callback:function(t){d.value=t.id,a.attr("data-weight_id",t.id),a.attr("data-weight_value",t.value),e("#goodsweight").text(JSON.parse(JSON.stringify(t.value)));var s=/^[0-9\.]+/g,r=s.exec(t.value);e(".goodsweightNum").val(r),ant.setSessionData({data:{addressGoodsOneValue:JSON.parse(JSON.stringify(t.value)),addressGoodsOneIndex:JSON.parse(JSON.stringify(t.id))}})}};new IosSelect(1,[r],n)})}function u(t){for(var d in t){var a="TDY"==d?"今天":"TOM"==d?"明天":"后天",s=t[d][0]+"点左右";ant.setSessionData({data:{addressDayValue:JSON.parse(JSON.stringify(a)),addressTimeValue:JSON.parse(JSON.stringify(s)),addressTimeDate:JSON.parse(JSON.stringify(a+s))}}),e("#timeDate").html(JSON.parse(JSON.stringify(a+"<span style='padding-left:.05rem;'></span>"+s))),e(".day1").val(JSON.parse(JSON.stringify(a))),e(".time1").val(JSON.parse(JSON.stringify(s)));break}}function p(){console.log(m);var t=document.querySelector("#dateId"),d=document.querySelector("#timeId"),a=e("#selectTime");a.unbind(),a.click(function(){var s=[],r=0,i=[];for(var n in m){var o="TDY"==n?"今天":"TOM"==n?"明天":"后天";s.push({id:r.toString(),value:o,parentId:"0"});for(var c=m[n],l=0;l<c.length;l++)i.push({id:(l+10).toString(),value:c[l]+"点左右",parentId:r.toString()});r++}var u=a.attr("data-date_id"),p=(a.attr("data-date_value"),a.attr("data-time_id")),g=(a.attr("data-time_value"),{title:"",itemHeight:35,headerHeight:42,cssUtil:"px",relation:[1,1,1,1],oneLevelId:u,twoLevelId:p,callback:function(s,r){t.value=s.id,d.value=r.id,a.attr("data-date_id",s.id),a.attr("data-date_value",s.value),a.attr("data-time_id",r.id),a.attr("data-time_value",r.value);e("#timeDate").html(JSON.parse(JSON.stringify(s.value+"<span style='padding-left:.05rem;'></span>"+r.value))),e(".day1").val(JSON.parse(JSON.stringify(s.value))),e(".time1").val(JSON.parse(JSON.stringify(r.value))),ant.setSessionData({data:{addressDayValue:JSON.parse(JSON.stringify(s.value)),addressTimeValue:JSON.parse(JSON.stringify(r.value)),addressTimeDate:JSON.parse(JSON.stringify(s.value+r.value))}}),checkInf()}}),h=[s,i];new IosSelect(2,h,g)})}FastClick.attach(document.body),ant.call("setTitle",{title:"寄收件地址"});var m,g="",h="",v="",N="",f="",C="",_="",y="",S="",w="",b="",A="",I="",O="",k="",J="",D="",x="",W="",T="",L="",P="",V=0,B=0,U="",G="",z="";ant.on("resume",function(e){t()}),function(){showLoading(),d()}(),isAndroid&&e(".express_address_book").css("border-left","1px solid #ddd")});