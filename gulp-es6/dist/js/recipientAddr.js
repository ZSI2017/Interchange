"use strict";Zepto(function(e){FastClick.attach(document.body),console.log("edit"==getUrlParam("edit"));var t=getUrlParam("edit"),a="",i="",r="",c="",d="",o="",n="",s="",l="";"edit"==t?("a106.b2128",a="a106.b2128.c4693.d7326",i="a106.b2128.c4693.d7327",r="a106.b2128.c4693.d7328",c="a106.b2128.c4693.d7329",d="a106.b2128.c4693.d7330",s="a106.b2128.c4692.d7325",e("body").attr("data-aspm","b2128"),e(".sender_name").attr("data-spmv",a),e(".get_location").attr("data-spmv",i),e(".sender_phone").attr("data-spmv",r),e(".sender_address").attr("data-spmv",c),e(".sender_dizhi").attr("data-spmv",d),e(".am-button").attr("data-spmv",s),ant.getSessionData({keys:["edit_reciptiensAddrID"]},function(e){l=e.data.edit_reciptiensAddrID}),ant.call("setTitle",{title:"编辑收件人地址"})):"write"==t?("a106.b2126",a="a106.b2126.c4687.d7311",i="a106.b2126.c4687.d7312",r="a106.b2126.c4687.d7313",c="a106.b2126.c4687.d7314",d="a106.b2126.c4687.d7315",o="a106.b2126.c4687.d7316",s="a106.b2126.c4688.d7317",e("body").attr("data-aspm","b2126"),e(".sender_name").attr("data-spmv",a),e(".get_location").attr("data-spmv",i),e(".sender_phone").attr("data-spmv",r),e(".sender_address").attr("data-spmv",c),e(".sender_dizhi").attr("data-spmv",d),e("#defaultClick").attr("data-spmv",o),e(".am-button").attr("data-spmv",s),ant.call("setTitle",{title:"填写收件人地址"}),e(".defaultSelect").show()):("a106.b2123",a="a106.b2123.c4683.d7303",i="a106.b2123.c4683.d7304",r="a106.b2123.c4683.d7305",c="a106.b2123.c4683.d7306",d="a106.b2123.c4683.d7307",s="a106.b2123.c4684.d7308",e("body").attr("data-aspm","b2123"),e(".sender_name").attr("data-spmv",a),e(".get_location").attr("data-spmv",i),e(".sender_phone").attr("data-spmv",r),e(".sender_address").attr("data-spmv",c),e(".sender_dizhi").attr("data-spmv",d),e(".am-button").attr("data-spmv",s),ant.call("setTitle",{title:"添加收件人地址"})),ant.on("resume",function(t){ant.getSessionData({keys:["autocomplete_address"]},function(t){var a=t.data.autocomplete_address;if(""!==a){var i=emojione.toShort(a);e(".recipient_dizhi").val(i.replace(/\:[a-z0-9_]+\:/g,"")),e("textarea[autoHeight]").autoHeight()}})}),ant.setSessionData({data:{autocomplete_address:"",autocomplete_cityName:""}}),e.fn.autoHeight=function(){function t(e){e.style.height="auto",e.scrollTop=0,e.style.height=e.scrollHeight+"px"}this.each(function(){t(this),e(this).on("input",function(){t(this)})})},ant.getSessionData({keys:["edit_reciptiensAddrID","edit_recName","edit_recNumber","edit_recProvinceCode","edit_recCityCode","edit_recAreaCode","edit_recStreet","edit_recAddress","receiverCount","reciptiensAddrID"]},function(a){h=a.data.reciptiensAddrID;var r=a.data.edit_reciptiensAddrID||"";p=a.data.edit_recName||"",m=a.data.edit_recNumber||"",u=a.data.edit_recAddress||"";var c=a.data.edit_recProvinceCode||"",d=a.data.edit_recCityCode||"";if(v=a.data.edit_recAreaCode||"",a.data.edit_recStreet,f=a.data.receiverCount,r&&("edit"==t||"write"==t)){for(e("#reciptiens_id").val(r),e(".recipient_name").val(p),e(".mobile_numbers").val(m),e(".sender_dizhi").val(u),e("textarea[autoHeight]").autoHeight(),C=0;C<iosProvinces.length;C++)c==iosProvinces[C].id&&(e("#contact_province_code_re").val(iosProvinces[C].id),e("#contact_province_code_re").attr("data-province-name-re",iosProvinces[C].value));for(C=0;C<iosCitys.length;C++)d==iosCitys[C].id&&(e("#contact_city_code_re").val(iosCitys[C].id),e("#contact_city_code_re").attr("data-city-name-re",iosCitys[C].value));for(var C=0;C<iosCountys.length;C++)v==iosCountys[C].id&&(e("#contact_district_code_re").val(iosCountys[C].id),e("#contact_district_code_re").attr("data-district-name-re",iosCountys[C].value));var y=e("#contact_province_code_re").attr("data-province-name-re"),I=e("#contact_city_code_re").attr("data-city-name-re");n=I;var k=e("#contact_district_code_re").attr("data-district-name-re");_=subAreaString(y,I,k,"true"),e(".recipient_address").val(_),e(".recipient_address").attr("data-province-code-re",e("#contact_province_code_re").val()),e(".recipient_address").attr("data-city-code-re",e("#contact_city_code_re").val()),e(".recipient_address").attr("data-district-code-re",e("#contact_district_code_re").val())}e("textarea[autoHeight]").autoHeight(),function(){e("#getLocation").on("click",function(){"edit"==t?BizLog.call("info",{spmId:i,actionId:"clicked",params:{AddrID:l}}):BizLog.call("info",{spmId:i,actionId:"clicked"}),ant.call("contact",function(t){if(t.errorCode&&10==t.errorCode)toast({text:"无通讯录访问权限\n请设置允许app访问通讯录"});else{e(".recipient_name").val(JSON.parse(JSON.stringify(t.name)));var a=JSON.parse(JSON.stringify(t.mobile)).replace(/[^0-9]/gi,"");0==a.indexOf("86")&&(a=a.slice(2,a.length));var i=a.length-15;i>0&&(a=a.substring(i)),/^\d{1,15}$/.test(a),e(".mobile_numbers").val(a)}})});var a=e("#select_contact_re"),r=e("#show_contact_re"),c=e("#contact_province_code_re"),d=e("#contact_city_code_re"),o=e("#contact_district_code_re");e(".choise_addressstitle").click(function(){if(!b){e(".recipient_name").blur(),e(".mobile_numbers").blur(),e(".recipient_dizhi").blur(),a.find("input").focusin(function(){this.blur()}),e("body").on("touchmove",function(e){e.preventDefault()},!1),r.attr("data-city-code-re"),r.attr("data-city-name-re");var t=r.attr("data-province-code-re"),i=r.attr("data-city-code-re"),s=r.attr("data-district-code-re");new IosSelect(3,[iosProvinces,iosCitys,iosCountys],{title:"",itemHeight:35,headerHeight:42,cssUnit:"px",relation:[1,1,0,0],oneLevelId:t,twoLevelId:i,threeLevelId:s,callback:function(e,t,a){c.val(e.id),c.attr("data-province-name-re",e.value),o.val(a.id),o.attr("data-district-name-re",a.value),d.val(t.id),d.attr("data-city-name-re",t.value),r.attr("data-province-code-re",e.id),r.attr("data-city-code-re",t.id),r.attr("data-district-code-re",a.id);var i=e.value,s=t.value;n=s;var l=a.value,p=subAreaString(i,s,l,"true");r.val(p)}})}})}(),function(){e(".input_tab").on("input propertychange",function(){});var t=!1;e(".recipient_name").bind("compositionstart",function(){t=!0}),e(".recipient_name").bind("compositionend",function(){t=!1}),e(".recipient_name").bind("input",function(){if(!t){var a=emojione.toShort(e(this).val());if(/\:[a-z0-9_]+\:/g.test(a)&&(a=a.replace(/\:[a-z0-9_]+\:/g,""),e(this).val(a)),e(this).val().length>=21){var i=e(this).val().slice(0,20);e(this).val(i)}}}),e(".mobile_numbers").bind("input",function(){var t=e(this).val();t=processPhoneNum(t),e(this).val(t)}),e(".recipient_dizhi").bind("click",function(){if(""!==n){var t=e(".recipient_dizhi").val();ant.setSessionData({data:{autocomplete_address:t,autocomplete_cityName:n}}),pushWindow("autocomplete.html",!1)}else toast({text:"请先选择地区"})})}(),e(".am-button-Rec").click(function(){if("edit"==t?BizLog.call("info",{spmId:s,actionId:"clicked",params:{AddrID:l}}):BizLog.call("info",{spmId:s,actionId:"clicked"}),!g&&function(){if(""==e(".recipient_name").val()||0===e(".recipient_name").val().trim().length||e(".sender_name").val().length>=21)return toast({text:"姓名不能为空"}),!1;if(""==e(".mobile_numbers").val()||!isCorrectPhoneNum(e(".mobile_numbers").val()))return toast({text:"请输入正确的手机号或座机号"}),!1;{if(""!=e(".recipient_address").val()&&" "!=e(".recipient_address").val())return!(""==e(".recipient_dizhi").val()||0===e(".recipient_dizhi").val().trim().length||e(".recipient_dizhi").val().length>=51)||(toast({text:"详细地址不能为空"}),!1);toast({text:"请选择地区"})}}()){g=!0,e(".am-button-Rec").html('<i class="icon" aria-hidden="true"></i>正在保存...'),setTimeout(function(){g=!1,e(".am-button-Rec").html("完成")},8e3);var a,i,r=e("#reciptiens_id").val(),c=emojione.toShort(e(".recipient_name").val()).replace(/\:[a-z0-9_]+\:/g,""),d=e(".mobile_numbers").val(),o=e("#contact_province_code_re").val(),n=e("#contact_city_code_re").val(),_=e("#contact_district_code_re").val(),b=emojione.toShort(e(".recipient_dizhi").val()).replace(/\:[a-z0-9_]+\:/g,"");if("write"==t){var C=cellPhoneHide(d);if(ant.setSessionData({data:{recName:nameHide(c),recNumber:C,real_recNumber:d,real_recName:c,recProvinceCode:o,recCityCode:n,recAreaCode:_,recStreet:getAreaNameByCode(_).replace(/\s/g,""),recAddress:b}}),!e("#defaultCheckBox").hasClass("defaultSelect"))return c==p&&d==m&&b==u&&parseFloat(v)==parseFloat(_)||ant.setSessionData({data:{reciptiensAddrID:-1}}),void ant.popWindow();if("-1"!=r&&c==p&&d==m&&b==u&&parseFloat(v)==parseFloat(_))return ant.popWindow(),void console.log("write  data not change");r=!1}r?(a={id:r,name:c,mobile:d,provinceCode:o,cityCode:n,districtCode:_,street:"",address:b},i=jUrl+"/ep/receiver/edit"):(a={name:c,mobile:d,provinceCode:o,cityCode:n,districtCode:_,street:"",address:b},i=jUrl+"/ep/receiver/add"),e.axs(i,a,function(e){if(e.meta.success){if(ant.setSessionData({data:{edit_reciptiensAddrID:"",edit_recName:"",edit_recNumber:"",edit_recProvinceCode:"",edit_recCityCode:"",edit_recAreaCode:"",edit_recStreet:"",edit_recAddress:""}}),(0==f&&!r||"write"==t)&&(f++,ant.setSessionData({data:{receiverCount:f}}),1!=f||r||-1!=h)){var a=cellPhoneHide(e.result.mobile),i=nameHide(e.result.name),c=getAreaNameByCode(e.result.districtCode).replace(/\s/g,"");ant.setSessionData({data:{reciptiensAddrID:e.result.id,recName:i,recNumber:a,real_recNumber:e.result.mobile,real_recName:e.result.name,recProvinceCode:e.result.provinceCode,recCityCode:e.result.cityCode,recAreaCode:e.result.districtCode,recStreet:c,recAddress:e.result.address}})}ant.popWindow()}})}}),"write"==t&&(e("#defaultCheckBox").find("span").css({"background-image":"url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png)"}),e("#defaultClick").click(function(){BizLog.call("info",{spmId:o,actionId:"clicked"});var t=e("#defaultCheckBox");t.hasClass("defaultSelect")?(t.toggleClass("defaultSelect"),t.find("span").css({"background-image":"url(https://kuaidi-dev.oss-cn-hangzhou.aliyuncs.com/mobile/default-noSelect.png)"})):(t.toggleClass("defaultSelect"),t.find("span").css({"background-image":"url(https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png)"}))}))});var p,m,_,u,v,h,f=0,b=!1;e(".sender_name").on("click",function(){"edit"==t?BizLog.call("info",{spmId:a,actionId:"clicked",params:{AddrID:l}}):BizLog.call("info",{spmId:a,actionId:"clicked"})}),e(".sender_phone").on("click",function(){"edit"==t?BizLog.call("info",{spmId:r,actionId:"clicked",params:{AddrID:l}}):BizLog.call("info",{spmId:r,actionId:"clicked"})}),e(".recipient_address").on("click",function(){"edit"==t?BizLog.call("info",{spmId:c,actionId:"clicked",params:{AddrID:l}}):BizLog.call("info",{spmId:c,actionId:"clicked"})}),e(".recipient_dizhi").on("click",function(){"edit"==t?BizLog.call("info",{spmId:d,actionId:"clicked",params:{AddrID:l}}):BizLog.call("info",{spmId:d,actionId:"clicked"})});var g=!1});