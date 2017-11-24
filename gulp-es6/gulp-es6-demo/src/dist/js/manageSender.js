Zepto(function($) {
    FastClick.attach(document.body);
    ant.call('setTitle', {
        title: '管理寄件人地址',
    });
    initSelectSender();
    ant.on('resume', function(event) {

        ant.setSessionData({
            data: {
                edit_senderAddrID: "",
                edit_sendName: "",
                edit_sendNumber: "",
                edit_sendAddress: "",
                edit_sendProvinceCode: "",
                edit_sendCityCode: "",
                edit_sendAreaCode: "",
                edit_street: ""
            }
        });

        initSelectSender();
    });

    $(".btn-sender").click(function() {
        pushWindow("send-address.html",true);
        // ant.pushWindow({
        //     url: "send-address.html?sRid=" + sRid + "&addInfosUid=" + addInfosUid + "&addIndex=1"
        // });
    });
    function initSelectSender() {
        showLoading();
        var info = {};
        var xhrurl = jUrl + '/ep/sender/list';
        $.axs(xhrurl, info, function(data) {
            hideLoading();
            if (data.meta.success) {
                if(result){
                    ant.setSessionData({
                        data: {
                            senderCount:result.length
                        }
                    });
                }
                $(".manage-bottom").show();
                if (data.meta.code == "0000") {
                    var result = data.result,
                        statusInfo = '',
                        checkInfo = '',
                        sHtml = '';

                    if (result.length > 0) {
                      $(".manageInfo-select").show();
                      $(".emptyInfo").hide();
                        var data = {
                            myResult: result
                        };
                        var artTemplate = template('table-template', data);
                        $(".manageInfo-select").html(artTemplate);
                        result.map(function(item, index) {
                            if (item.defaultStatus == "1") {
                                $(".setDefault").eq(index).addClass("defaultSender");
                                $(".setDefault").eq(index).find(".am-list-title").css("color", "#108ee9");
                                $(".setDefault").eq(index).find(".am-list-title").html("默认地址");
                                $(".setDefault").eq(index).find("img").attr("src", "https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png");
                            }
                          var sName = item.name;
              							if(sName.length>5){
              								 sName=sName.substring(0,5)+"...";
              							}
                            $(".myTempName").eq(index).html(sName);
                            var street = getAreaNameByCode(item.districtCode).replace(/\s/g, "") + item.address;
                            $(".littleAddress").eq(index).html(street);
                        });
                        addEvent();
                    } else {
                        $(".manageInfo-select").hide();
                        $(".emptyInfo").show();
                    }
                }
            }
        });
    }

    function addEvent() {
        $(".btn-check-send").click(function() {
            $(".btn-check-send").parent().find("input[name='sendRadio']").attr('checked', false);
            $(this).parent().find("input[name='sendRadio']").attr('checked', true);
        });
        $(".setDefault").click(function(e) {
            var senderAddrID = $(this).attr("senderAddrID");
            setDefault(senderAddrID,$(this).parents('.oneline').find(".editDefault"));
        });

        $(".delSender").click(function(e) {
            var senderAddrID = $(this).attr("senderAddrID");
            delSender(senderAddrID,$(this));
        });

        $(".editDefault").click(function(e) {
            var temp = $(this).find("input").val();
            var senderAddrID = $(this).attr("senderAddrID"),
                sendName = temp,
                sendNumber = $(this).attr("senderNumber"),
                sendAddress = $(this).attr("detailAddress"),
                sendProvinceCode = $(this).attr("provinceNo"),
                sendCityCode = $(this).attr("cityNo"),
                sendAreaCode = $(this).attr("areaNo"),
                street =getAreaNameByCode(sendAreaCode).replace(/\s/g,"");
            ant.setSessionData({
                data: {
                    edit_senderAddrID: senderAddrID,
                    edit_sendName: sendName,
                    edit_sendNumber: sendNumber,
                    edit_sendAddress: sendAddress,
                    edit_sendProvinceCode: sendProvinceCode,
                    edit_sendCityCode: sendCityCode,
                    edit_sendAreaCode: sendAreaCode,
                    edit_street: street
                }
            });
            pushWindow("send-address.html",true);
        });

    }
    //设为默认事件的回调函数
    function setDefault(senderAddrID,_this) {
       console.log(_this.html());
         console.log("_this.attr(senderName)"+_this.attr("senderName"));
        var defaultSenderOld = $(".defaultSender");
        var defaultSenderNew = $("#sender_" + senderAddrID);
        if (defaultSenderNew.attr("senderAddrID") == defaultSenderOld.attr("senderAddrID")) {
            return;
        }
        var info = {
            "senderId": JSON.parse(senderAddrID)
        };
        var xhrurl = jUrl + '/ep/sender/set_default';
        $.axs(xhrurl, info, function(data) {
            if (data.meta.success) {
              // 如果没有选择地址，则展示默认地址
              ant.getSessionData({
                keys: ['senderAddrID']
              }, function (result) {
                  if(result.data.senderAddrID){

                  }else{
                        var temp = _this.find("input").val();
                    var senderAddrID = _this.attr("senderAddrID"),
                        sendName = temp,
                        sendNumber = _this.attr("senderNumber"),
                        sendProvinceCode = _this.attr("provinceNo"),
                        sendCityCode = _this.attr("cityNo"),
                        sendAreaCode = _this.attr("areaNo"),
                        street =getAreaNameByCode(sendAreaCode).replace(/\s/g,"");
                        sendAddress = _this.attr("detailAddress");
                        console.log("_this.attr(senderName)"+_this.attr("senderName"));
                          console.log('_this.attr("street")'+ street);


                    ant.setSessionData({
                      data: {
                        senderAddrID: senderAddrID,
                        sendName:sendName,
                        sendNumber:sendNumber,
                        sendProvinceCode:sendProvinceCode,
                        sendCityCode:sendCityCode,
                        sendAreaCode:sendAreaCode,
                        sendStreet:street,
                        sendAddress:sendAddress
                      }
                    });
                  }
              });

                defaultSenderOld.find(".am-list-title").css({
                    "color": "#000"
                });
                defaultSenderOld.find(".am-list-title").html("设为默认");
                defaultSenderOld.find("img").attr("src", "http://kuaidi-dev.oss-cn-hangzhou.aliyuncs.com/mobile/default-noSelect.png");
                defaultSenderOld.removeClass("defaultSender");
                var defaultSenderNew = $("#sender_" + senderAddrID);
                defaultSenderNew.find(".am-list-title").css({
                    "color": "#108ee9"
                });
                defaultSenderNew.find(".am-list-title").html("默认地址");
                defaultSenderNew.find("img").attr("src", "https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/default-select.png");
                defaultSenderNew.addClass("defaultSender");
            }
        });

    }
    //删除事件的回调函数
    function delSender(senderAddrID,_this) {
        if (confirm('确认删除?')) {
            var info = {
                "senderId": JSON.parse(senderAddrID)
            };
            var xhrurl = jUrl + '/ep/sender/delete';
            $.axs(xhrurl, info, function(data) {
                if (data.meta.success) {
                    if (data.meta.code == "0000") {

                      // 当删除的地址是默认的，就清空Sessions 中的值
                      ant.getSessionData({
                        keys: ['senderAddrID']
                      }, function (result) {
                          if(result.data.senderAddrID == senderAddrID ){
                            ant.setSessionData({
                              data: {
                                senderAddrID: "",
                                sendName:"",
                                sendNumber:"",
                                sendProvinceCode:"",
                                sendCityCode:"",
                                sendAreaCode:"",
                                sendStreet:"",
                                sendAddress:""
                              }
                            });
                          }
                      });
                        toast({
                            text: '删除成功',
                            type: 'success'
                        });
                        initSelectSender();
                    }
                }
            });
        } else {
            console.log("取消删除！");
        }
    }
});
