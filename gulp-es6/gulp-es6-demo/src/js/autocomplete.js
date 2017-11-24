Zepto(function ($) {
			FastClick.attach(document.body);
			var autocomplete = {
				init: function () {
					this.getSession();
					this.bindConfirmEvent();
				},
				/**
				 *  从session 中取值,并初始化 地址联想的input事件
				 *  @method
				 *  @return {null}
				 */
				getSession: function () {
					var _this = this;
					ant.getSessionData({
						keys: ['autocomplete_address', 'autocomplete_cityName']
					}, function (result) {
						_this.cityName = result.data.autocomplete_cityName;
						_this.address = result.data.autocomplete_address;
						$(".searchInput-class").val(_this.address).focus();
						_this.initAMap(_this.cityName);
						_this.bindInputEvent();
					})
				},
				/**
				 *  实例化地址联想的 AMap 对象，
				 *  @method
				 *  @param  {String} currentCityName 当前城市名
				 *  @return {null}                 [description]
				 */
				initAMap: function (currentCityName) {
					var _this = this;
					AMap.plugin('AMap.Autocomplete', function () {
						_this.Autocomplete = new AMap.Autocomplete({
							city: currentCityName,
							citylimit: true
						});
					})
				},
				/**
				 *  监听input输入框变化事件
				 *  @method
				 *  @return {null} [description]
				 */
				bindInputEvent: function () {
					var _this = this;
					$(".searchInput-class").unbind().bind("input", function () {
						if ($(this).val().length == 51) {
							var tempval = $(this).val().slice(0, 50);
							$(this).val(tempval);
						}
						var kw = $(this).val();
						var autocompleteContent = "";
						_this.Autocomplete.search(kw, function (status, result) {
							autocompleteContent = ""
							if (status == 'complete') {
								result.tips.forEach(function (item) {
									console.log(item);
									var templateName = item.name;
									var templateAddress = item.address;
									autocompleteContent += '<div class = "am-list-item" style="min-height:.42rem">' +
										'<div class="am-list-thumb" style="margin-right:.06rem">' +
										'<img style="width:.12rem;height:.14rem;" src="https://expressprod.oss-cn-hangzhou.aliyuncs.com/mobile/img/address-icon.png" alt="图标描述" />' +
										'</div>' +
										'<div class="am-list-content">' +
										'<div class="am-list-title" style="padding-top:.105rem;font-size:.16rem;color:#333" >' + templateName + '</div>' +
										'<div class="am-list-brief"  style="padding-bottom:.15rem;font-size:.14rem;line-height:1;color:#999">' + _this.cityName+templateAddress + '</div>' +
										'</div>' +
										'</div>'
								})
								$(".Autocomplete-content").html(autocompleteContent);
								$(".Autocomplete-content .am-list-item").unbind().bind('click', function (event) {
									var chooseAddress = $(this).find('.am-list-title').text();
									$(".searchInput-class").val(chooseAddress);
									 $("body").scrollTop(0);
								})
							} else {
								$(".Autocomplete-content").empty();
							}
						})
					})
				},
				/**
				 *  监听确定按钮的点击事件
				 *  @method
				 *  @return {null} [description]
				 */
				bindConfirmEvent: function () {
					$('#addressConfirm').unbind().bind('click', function () {
						$(".Autocomplete-content").empty();
						var beforeFilterContent = $(".searchInput-class").val();
						// var emoji = emojione.toShort(beforeFilterContent).replace(/\:[a-z0-9_]+\:/g, '');
						ant.setSessionData({
							data: {
								autocomplete_address: beforeFilterContent
							}
						});
						ant.popWindow();
					})
				}
  }
				autocomplete.init();
})
