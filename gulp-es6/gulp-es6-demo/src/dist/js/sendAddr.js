Zepto(function($) {
  FastClick.attach(document.body);
    ant.call('setTitle', {
        title: '编辑寄件人地址'
    });
    var senderCount=0;
    function getLocation() {
        AlipayJSBridge.call('showLoading', {
            text: '正在定位',
        });
        ant.call('getLocation', function(result) {
            setTimeout(function() {
                AlipayJSBridge.call('hideLoading');
            }, 300);
            if (result.error) {
                toast({
                    text: "无法获取定位信息\n请设置允许app获取定位权限"
                });
                return;
            }

            var res = getAreaNameByCode(result.adcode);
            var arr = res.split(" ");

            if(arr.length<=2){
                  toast({
                      text: "无法获取定位信息"
                  });
                  return;
            }
            var provinceName = arr[0];
            var cityName =arr[1];
            var districtName =arr[2];

            var provinceCode = result.adcode.substring(0, 2) + "0000";
            var cityCode =result.adcode.substring(0, 4) + "00";
            var districtCode = result.adcode;
            $(".provincial_city").attr("data-province-code", provinceCode);
            $("#contact_province_code").val(provinceCode);
            $(".provincial_city").attr("data-city-code",cityCode);
            $("#contact_city_code").val(cityCode);
            $(".provincial_city").attr("data-district-code", districtCode);
            $("#contact_district_code").val(districtCode);

            var areaName =subAreaString(provinceName,cityName,districtName);
            $(".provincial_city").val(areaName);
            $("#contact_district_code").attr("data-district-name", districtName);
            $("#contact_city_code").attr("data-city-name", cityName);
            $("#contact_province_code").attr("data-province-name", provinceName);
        });
    }
    // 校验每个input中的值
    function checkInput() {
        if ($(".sender_name").val() == ''||$(".sender_name").val().trim().length === 0 || $(".sender_name").val().length > 21) {
            $(".complete_btn button").addClass("disabled");
            return;
        }
        if ($(".sender_phone").val() == '' || !isCorrectPhoneNum($(".sender_phone").val())) {
            console.info("sender_hone is wrong")
            $(".complete_btn button").addClass("disabled");
            return;
        }
        if ($(".sender_address").val() == ''||$(".sender_address").val() == ' ') {
            $(".complete_btn button").addClass("disabled");
            return;
        }
        if ($(".sender_dizhi").val() == ''||$(".sender_dizhi").val().trim().length === 0 || $(".sender_dizhi").val().length > 51) {
            $(".complete_btn button").addClass("disabled");
            return;
        }
        $(".complete_btn button").removeClass("disabled");
    }
    // 给每个input add 事件监听
    $.fn.autoHeight = function() {
        function autoHeight(elem) {
            elem.style.height = 'auto';
            elem.scrollTop = 0; //防抖动
            elem.style.height = elem.scrollHeight + 'px';

        }
        this.each(function() {
            autoHeight(this);
            $(this).on('input', function() {
                autoHeight(this);
            });

        });
    };
    $('textarea[autoHeight]').autoHeight();
    $(".input_tab").on("input propertychange", function() {
        checkInput();
    });
    // 姓名input
    // bug  当用户当前输入法状态是中文时，在未选择词组到输入框也会触发事件
    var nameLock = false;
    $(".sender_name").bind("compositionstart",function(){
         nameLock=true;
    });
    $(".sender_name").bind("compositionend",function(){
         nameLock=false;
    });
    $(".sender_name").bind("input",function() {
      if(!nameLock){
          // 禁止表情 和 数字
           var  emoji = emojione.toShort($(this).val());
           emoji = emoji.replace(/\:[a-z0-9_]+\:/g,'');
          //  emoji = emoji.replace(/[0-9]/g,'');
           $(this).val(emoji);
          if ($(this).val().length == 21) {
            var tempval = $(this).val().slice(0, 20);
            $(this).val(tempval);
            toast({
                text: '姓名不能超过20个汉字'
            });
        }
      }
    });
    // 失去焦点时判断 不能为空格
    $(".sender_name").bind("blur",function() {
            if ($(this).val().trim().length === 0) {
                // toast({
                //     text: '姓名不能为空'
                // });
             }
        });
    // 手机号码 input
    $(".sender_phone").bind('input', function() {
        var phoneNum = $(this).val();
        phoneNum = processPhoneNum(phoneNum);
        $(this).val(phoneNum);
        checkInput();
    });
     // 失去焦点时判断手机号是否正确
     $(".sender_phone").bind('blur', function() {
         var phoneNum = $(this).val();
         if(phoneNum == ''){
             return;
         }
         if(!isCorrectPhoneNum(phoneNum)){
             $(".complete_btn button").addClass("disabled");
             toast({
                 text:"请输入正确的手机号"
             });
         }
     });
    // 详细地址input
    // bug  当用户当前输入法状态是中文时，在未选择词组到输入框也会触发事件
   var addressLock = false;
   $(".sender_dizhi").bind("compositionstart",function(){
        addressLock=true;
   })
   $(".sender_dizhi").bind("compositionend",function(){
        addressLock=false;
   });
    $(".sender_dizhi").bind('input', function() {
      if(!addressLock){
          var  emoji = emojione.toShort($(this).val());
           $(this).val(emoji.replace(/\:[a-z0-9_]+\:/g,''));

        if ($(this).val().length == 51) {
            var tempval = $(this).val().slice(0, 50);
            $(this).val(tempval);
            toast({
                text: '详细地址不能超过50个汉字'
            });
        }
      }
    });
    // 失去焦点时判断 不能为空格
    $(".sender_dizhi").bind("blur",function() {
            if ($(this).val().trim().length === 0) {
                // toast({
                //     text: '详细地址不能为空'
                // });
             }
        });

    // 获取定位按钮
    $(".get_location").on("touchstart", function() {
        getLocation();
    });
    //区域选择
    (function() {
        var selectContactDom = $('#select_contact');
        var showContactDom = $('#show_contact');
        var contactProvinceCodeDom = $('#contact_province_code');
        var contactCityCodeDom = $('#contact_city_code');
        var contactDistrictCodeDom = $('#contact_district_code');
        selectContactDom.click(function() {
          $("body").on('touchmove', function (event) {
                 event.preventDefault();
         }, false);
            $(".sender_name").blur();
            $(".sender_phone").blur();
            $(".sender_dizhi").blur();
            selectContactDom.find("input").focusin(function() {
                this.blur();
            });
            var sccode = showContactDom.attr('data-city-code');
            var scname = showContactDom.attr('data-city-name');
            var oneLevelId = showContactDom.attr('data-province-code');
            var twoLevelId = showContactDom.attr('data-city-code');
            var threeLevelId = showContactDom.attr('data-district-code');
            var iosSelect = new IosSelect(3, [iosProvinces, iosCitys, iosCountys], {
                //title: '地址选择',
                itemHeight: 35,
                headerHeight: 42,
                cssUnit: 'px',
                relation: [1, 1, 0, 0],
                oneLevelId: oneLevelId,
                twoLevelId: twoLevelId,
                threeLevelId: threeLevelId,
                callback: function(selectOneObj, selectTwoObj, selectThreeObj) {

                    contactProvinceCodeDom.val(selectOneObj.id);
                    contactProvinceCodeDom.attr('data-province-name', selectOneObj.value);
                    contactDistrictCodeDom.val(selectThreeObj.id);
                    contactDistrictCodeDom.attr('data-district-name', selectThreeObj.value);
                    contactCityCodeDom.val(selectTwoObj.id);
                    contactCityCodeDom.attr('data-city-name', selectTwoObj.value);
                    showContactDom.attr('data-province-code', selectOneObj.id);
                    showContactDom.attr('data-city-code', selectTwoObj.id);
                    showContactDom.attr('data-district-code', selectThreeObj.id);
                    var provinceName = selectOneObj.value;
                    var cityName =selectTwoObj.value;
                    var districtName =  selectThreeObj.value;
                    var areaName =subAreaString(provinceName,cityName,districtName);
                    showContactDom.val(areaName);
                    checkInput();
                }
            });

        });
    })();

    //点击提交操作
    var submitFlag = false; //  防止误点多次，
    $(".am-button").click(function() {
        if ($(".complete_btn button").hasClass("disabled") || submitFlag) {
            return;
        } else {
            submitFlag = true;
            var loaging =
                '<a class="am-button blue loading" role="alert" aria-live="assertive">' +
                '<i class="icon" aria-hidden="true"></i>' +
                '正在保存...' +
                '</a>';
            $(".complete_btn").html(loaging);
               var id=  $(".sender_name").attr("data-sendID");
                if (id) {
                    var info = {
                        "id": id,
                        "name": $(".sender_name").val(),
                        "mobile": $(".sender_phone").val(),
                        "provinceCode": $('#show_contact').attr("data-province-code"),
                        "cityCode": $('#show_contact').attr("data-city-code"),
                        "districtCode": $('#show_contact').attr("data-district-code"),
                        "street": '',
                        "address": $(".sender_dizhi").val()
                    };
                    var xhrurl = jUrl + '/ep/sender/edit';
                } else {
                    //add
                    var info = {
                        "name": $(".sender_name").val(),
                        "mobile": $(".sender_phone").val(),
                        "provinceCode": $('#show_contact').attr("data-province-code"),
                        "cityCode": $('#show_contact').attr("data-city-code"),
                        "districtCode": $('#show_contact').attr("data-district-code"),
                        "street": '',
                        "address": $(".sender_dizhi").val()
                    };
                    var xhrurl = jUrl + '/ep/sender/add';

                }
                $.axs(xhrurl, info, function(data) {
                    if (data.meta.success) {
                        //说明是从地址页直接跳转过来，将当前新增地址当做被选中地址，并将senderCount 置为1
                        if(senderCount == 0 && !id){
                            senderCount++;
                            ant.setSessionData({
                                data: {
                                    senderAddrID: data.result.id,
                                    sendName:data.result.name,
                                    sendNumber:data.result.mobile,
                                    sendProvinceCode:data.result.provinceCode,
                                    sendCityCode:data.result.cityCode,
                                    sendAreaCode:data.result.districtCode,
                                    sendStreet:data.result.resultsendStreet,
                                    sendAddress:data.result.address,
                                    senderCount:senderCount
                                }
                            });
                        }
                        ant.popWindow();
                    }
                });
        }
    });
    /**
     * 下面 判断add or edit
     */
    //新增
    ant.getSessionData({
    keys: ['edit_senderAddrID',
        'edit_sendName',
        'edit_sendNumber',
        'edit_sendAddress',
        'edit_sendProvinceCode',
        'edit_sendCityCode',
        'edit_sendAreaCode',
        'senderCount']
    }, function(result) {
    // edit  事件过来
        if(result.data.senderCount){
            senderCount =result.data.senderCount;
        }
    if (result.data.edit_senderAddrID) {
            var senderAddrID = result.data.edit_senderAddrID;
            var sendName = result.data.edit_sendName || '';
            var sendNumber = result.data.edit_sendNumber || '';
            var sendAddress = result.data.edit_sendAddress || '';
            var sendProvinceCode = result.data.edit_sendProvinceCode || '';
            var sendCityCode = result.data.edit_sendCityCode || '';
            var sendAreaCode = result.data.edit_sendAreaCode || '';
            $(".sender_name").attr("data-sendID", senderAddrID);
            $(".sender_name").val(sendName);
            $(".sender_phone").val(sendNumber);
            $(".sender_dizhi").val(sendAddress);

            $('textarea[autoHeight]').autoHeight();
            var sRid = getUrlParam('sRid');
            var selectSUid = getUrlParam('selectSUid');
            for (var i = 0; i < iosProvinces.length; i++) {
                if (sendProvinceCode == iosProvinces[i].id) {
                    $("#contact_province_code").val(iosProvinces[i].id);
                    $("#contact_province_code").attr("data-province-name", iosProvinces[i].value);
                }
            }
            for (var i = 0; i < iosCitys.length; i++) {
                if (sendCityCode == iosCitys[i].id) {
                    $("#contact_city_code").val(iosCitys[i].id);
                    $("#contact_city_code").attr("data-city-name", iosCitys[i].value);
                }
            }
            for (var i = 0; i < iosCountys.length; i++) {
                if (sendAreaCode == iosCountys[i].id) {
                    $("#contact_district_code").val(iosCountys[i].id);
                    $("#contact_district_code").attr("data-district-name", iosCountys[i].value);
                }
            }

            var provinceName = $("#contact_province_code").attr("data-province-name");
            var cityName =$("#contact_city_code").attr("data-city-name");
            var districtName =  $("#contact_district_code").attr("data-district-name");
            var areaName =subAreaString(provinceName,cityName,districtName);
            $(".sender_address").val(areaName);
            $(".sender_address").attr("data-province-code", $("#contact_province_code").val());
            $(".sender_address").attr("data-city-code", $("#contact_city_code").val());
            $(".sender_address").attr("data-district-code", $("#contact_district_code").val());

            $(".complete_btn button").removeClass("disabled");
    } else {
        // 这里表示新增
        getLocation();
        $(".complete_btn button").addClass("disabled");

    }
  });

});
