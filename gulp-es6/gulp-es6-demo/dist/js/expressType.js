!function(t){function e(r){if(a[r])return a[r].exports;var i=a[r]={exports:{},id:r,loaded:!1};return t[r].call(i.exports,i,i.exports,e),i.loaded=!0,i.exports}var a={};e.m=t,e.c=a,e.p="",e(0)}({0:function(t,e,a){t.exports=a(10)},10:function(t,e){Zepto(function(t){FastClick.attach(document.body),ant.getSessionData({keys:["sendAreaCode","recAreaCode","epCompanyId"]},function(e){var a=e.data.sendAreaCode,r=e.data.recAreaCode,i=e.data.epCompanyId,d={logisMerchId:JSON.parse(i),snderDstrCode:a,rcvrDstrCode:r},s=jUrl+"/ep/common/product_type/list";t.axs(s,d,function(e){if(e.meta.success){var a=e.result,r="",i=a.productTypes,d="",s=[],o=a.tag.substring(0,a.tag.length-1),s=o.split(",");t.each(s,function(t){d+='<span style="padding: 0.5px 5px;border: 0.5px solid #ff8200;margin-right: 10px;border-radius: 0.04rem;font-size: 10px;vertical-align: super;line-height: 20px;">'+s[t]+"</span>"});for(var p=0;p<i.length;p++)r+='<div data-epCompanyNo="'+a.merchantCode+'" data-merchantName="'+a.merchantName+'" data-acceptOrderFrom="'+a.acceptOrderFrom+'" data-acceptOrderTo="'+a.acceptOrderTo+'" data-productTypeId="'+i[p].productTypeId+'" data-productTypeName="'+i[p].productTypeName+'" data-presetWeight="'+i[p].presetWeight+'" data-presetWeightPrice="'+i[p].presetWeightPrice+'" data-extraWeightUnit="'+i[p].extraWeightUnit+'" data-extraWeightPrice="'+i[p].extraWeightPrice+'" class="am-list-item kd-type-item"><div class="am-list-thumb"><img src="'+a.merchantLogo+'" style="border: 0.01rem solid #f5f5f9;border-radius: .05rem;width:0.6rem;height:0.6rem;" /></div><div class="am-list-content"><div class="am-list-title" style="line-height: 1.1em;margin-bottom: 0.5px;">'+i[p].productTypeName+'</div><div class="am-ft-gray am-ft-sm advertisementvals" style="padding-top: 2.5px;padding-bottom: 1px;">'+a.slogan+'</div><div class="am-ft-orange bubble_font" style="height:17.5px;padding-top: 0px;">'+d+'</div></div><div class="am-ft-orange prisetag_right">'+i[p].presetWeightPrice/100+'元起</div><div class="am-list-arrow" aria-hidden="true"><span class="am-icon arrow horizontal"></span></div></div>';t(".express-type-serve").html(r),t(".kd-type-item").click(function(){var e=t(this).attr("data-productTypeId"),a=t(this).attr("data-productTypeName"),r=t(this).attr("data-presetWeight"),i=t(this).attr("data-presetWeightPrice"),d=t(this).attr("data-extraWeightUnit"),s=t(this).attr("data-extraWeightPrice");ant.setSessionData({data:{productTypeId:e,productTypeName:a,presetWeight:r,presetWeightPrice:i,extraWeightUnit:d,extraWeightPrice:s,goodsOneValue:"",goodsOneIndex:"",goodstypeValue:"",dayValue:"",timeValue:"",timeDate:"",remarkContent:""}}),ant.pushWindow({url:"information-fill.html"})})}})})})}});