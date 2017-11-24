Zepto(function($) {
    FastClick.attach(document.body);
    ant.call('setTitle', {
        title: '管理寄件人地址',
    });
    // 打开时埋点
    // BizLog.call('info',{
    //     spmId:"a106.b2103",
    //     actionId:'pageMonitor'
    // });
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
        BizLog.call('info',{
            spmId:"a106.b2103.c4597.d7114",
            actionId:'clicked'
        });
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
                if (data.meta.code == "0000"||data.meta.success) {
                    var result = data.result,
                        statusInfo = '',
                        checkInfo = '',
                        sHtml = '';
                    console.log("result "+result);
                    if (result&&result.length > 0) {
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
                                $(".setDefault").eq(index).find("img").attr("src", "https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/selected.png");
                            }
                          var sName = item.name;
              							// if(sName.length>5){
              							// 	 sName=sName.substring(0,5)+"...";
              							// }
                            $(".myTempName").eq(index).html(sName);
                            var street = getAreaNameByCode(item.districtCode).replace(/\s/g, "") + item.address;
                            $(".littleAddress").eq(index).html(street);
                        });
                        // alert($(".realname").text().trim());
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
        //默认地址
        $(".setDefault").click(function(e) {
            var senderAddrID = $(this).attr("senderAddrID");
            var number = $(".setDefault").index(this)+1;
            if($(this).find(".am-list-title").text() == "默认地址"){
                $(this).find(".am-list-title").attr("data-spmv","a106.b2103.c4598_"+ number +".d7339");
                BizLog.call('info',{
                    spmId:"a106.b2103.c4598_"+ number +".d7339",
                    actionId:'clicked',
                    params:{
                        AddrID:senderAddrID
                    }
                });
            }else{
                $(this).find(".am-list-title").attr("data-spmv","a106.b2103.c4598_"+ number +".d7115");
                BizLog.call('info',{
                    spmId:"a106.b2103.c4598_"+ number +".d7115",
                    actionId:'clicked',
                    params:{
                        AddrID:senderAddrID
                    }
                });
            }
            setDefault(senderAddrID,$(this).parents('.oneline').find(".editDefault"));
        });
        //删除
        $(".delSender").click(function(e) {
            var senderAddrID = $(this).attr("senderAddrID");
            var number = $(".delSender").index(this)+1;
            $(this).attr("data-spmv","a106.b2103.c4598_"+ number +".d7117");
            BizLog.call('info',{
                spmId:"a106.b2103.c4598_"+ number +".d7117",
                actionId:'clicked',
                params:{
                    AddrID:senderAddrID
                }
            });
            delSender(senderAddrID,$(this));
        });
        //编辑
        $(".editDefault").click(function(e) {
            var senderAddrID = $(this).attr("senderAddrID");
            var number = $(".editDefault").index(this)+1;
            $(this).attr("data-spmv","a106.b2103.c4598_"+ number +".d7116");
            BizLog.call('info',{
                spmId:"a106.b2103.c4598_"+ number +".d7116",
                actionId:'clicked',
                params:{
                    AddrID:senderAddrID
                }
            });
            var temp = $(this).find("input").val();
            var senderAddrID = $(this).attr("senderAddrID"),
                sendName = temp,
                realSendNumber = $(this).attr("real-sendnumber"),
                // realSendName = $(this).attr("real-sendName")
                realSendName = $(this).find(".realname").text().trim(),

                sendAddress = $(this).find(".detailAddress").text().trim(),
                sendProvinceCode = $(this).attr("provinceNo"),
                sendCityCode = $(this).attr("cityNo"),
                sendAreaCode = $(this).attr("areaNo"),
                street =getAreaNameByCode(sendAreaCode).replace(/\s/g,"");
            ant.setSessionData({
                data: {
                    edit_senderAddrID: senderAddrID,
                    edit_sendName: realSendName,
                    edit_sendNumber: realSendNumber,
                    edit_sendAddress: sendAddress,
                    edit_sendProvinceCode: sendProvinceCode,
                    edit_sendCityCode: sendCityCode,
                    edit_sendAreaCode: sendAreaCode,
                    edit_street: street
                }
            });
            pushWindow("send-address.html?edit=edit",true);
        });

    }
    //设为默认事件的回调函数
    function setDefault(senderAddrID,_this) {
       console.log(_this.html());
         console.log("_this.attr(senderName)"+_this.attr("senderName"));
        var defaultSenderOld = $(".defaultSender");
        var defaultSenderNew = $("#sender_" + senderAddrID);
        if (defaultSenderNew.attr("senderAddrID") == defaultSenderOld.attr("senderAddrID")) {
        //   BizLog.call('info',{
        //       seedId:"a106.b09.c03.d01",
        //       actionId:'clicked'
        //   });
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
                        realSendNumber = _this.attr("real-sendnumber");
                        // realSendName  = _this.attr("real-sendName");
                        realSendName = _this.find(".realname").text().trim(),
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
                        real_sendName:realSendName,
                        real_sendNumber:realSendNumber,
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
                    "color": "#999"
                });
                defaultSenderOld.find(".am-list-title").html("设为默认");
                defaultSenderOld.find("img").attr("src", "https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/unselected.png");
                defaultSenderOld.removeClass("defaultSender");
                var defaultSenderNew = $("#sender_" + senderAddrID);
                defaultSenderNew.find(".am-list-title").css({
                    "color": "#108ee9"
                });
                defaultSenderNew.find(".am-list-title").html("默认地址");
                defaultSenderNew.find("img").attr("src", "https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/selected.png");
                defaultSenderNew.addClass("defaultSender");
            }
        });

    }
    //删除事件的回调函数
    function delSender(senderAddrID,_this) {
        if (confirm('确认删除?')) {
            BizLog.call('info',{
                spmId:"a106.b2103.c4680.d7295",
                actionId:'clicked',
                params:{
                    AddrID:senderAddrID
                }
            });
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
                                real_sendNumber:"",
                                real_sendName:'',
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
            BizLog.call('info',{
                spmId:"a106.b2103.c4680.d7294",
                actionId:'clicked',
                params:{
                    AddrID:senderAddrID
                }
            });
            console.log("取消删除！");
        }
    }
});
