$(function () {
	var scrollHeight =  $(document).height(),
	    scrollWidth =  $(document).width(),
			isMobile = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
	$(".device").css('width',scrollHeight * 0.24)  // 初始化滚动条的width

	if ($(document).width() <= 414) {
		$("#car").attr("src", "/public/images/mobile/car.png")
		$(".marquee-move img").attr("src", "/public/images/mobile/text.png")
	} else if(orientation() === "landscape"){
		$("#car").attr("src", "/public/images/mobile/orientation/car.png");
		$(".device").css('width',Math.min(scrollWidth,scrollHeight) * 0.34)
	}
	$("img").each(function (index, item) {
		$(this).css('visibility', 'visible')
	})

 /**
  * 判断 移动端 初始的 横屏（"landscape"）还是竖屏 （"portrait"）
  */
	function orientation() {
		if(isMobile){
			if (window.orientation === 180 || window.orientation === 0||($(window).height()>$(window).width())) {
				 return "portrait"
			}else if(window.orientation === 90 || window.orientation === -90||($(window).height()<$(window).width())) {
				// 横向
				return "landscape"
			}else {
				return false
			}
		}
		return false;
	}

 /**
  * 监听横屏竖屏切换， 设置对应车的图片 和 滚动条的width;
  * @return {[type]} [description]
  */
	window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
		if(isMobile){
			if (window.orientation === 180 || window.orientation === 0||($(window).height()>$(window).width())) {
				 $("#car").attr("src", "/public/images/mobile/car.png");
				 $(".device").css('width',$(document).height()* 0.24)
			}
			if (window.orientation === 90 || window.orientation === -90||($(window).height()<$(window).width())){
				 $("#car").attr("src", "/public/images/mobile/orientation/car.png");
				 $(".device").css('width',Math.min(scrollWidth,$(document).height()) * 0.34)
			}
		}
	}, false);
})
