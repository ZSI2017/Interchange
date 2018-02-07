$(function () {
	var clientHeight =  $(document).height();
	var clientWidth =  $(document).width();
	var windowWidth = $("body").width();
	calHeight();
	if ($(document).width() <= 414) {
		$("#car").attr("src", "/public/images/mobile/car.png")
		$(".marquee-move img").attr("src", "/public/images/mobile/text.png")
	} else if(!isPc()){
		$("#car").attr("src", "/public/images/mobile/orientation/car.png");
	 var marqueeDevWidth = Math.min(clientWidth,$(document).height()) * 0.34
		$(".device").css('width',marqueeDevWidth)
	}
	$("img").each(function (index, item) {
		$(this).css('visibility', 'visible')
	})

	function calHeight() {
		var clientHeight = $(document).height();
		var marqueeDevWidth = clientHeight * 0.24;
    $(".device").css('width',marqueeDevWidth)
	}

  function isPc() {
		if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
			return false;
		}else {
			return true;
		}
   }

	window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
				if (window.orientation === 180 || window.orientation === 0) {
					 $("#car").attr("src", "/public/images/mobile/car.png");
					 var marqueeDevWidth = Math.max(clientHeight,clientWidth) * 0.24;
			     $(".device").css('width',marqueeDevWidth)
				}
				if (window.orientation === 90 || window.orientation === -90 ){
					 $("#car").attr("src", "/public/images/mobile/orientation/car.png");
			 		var marqueeDevWidth = Math.min(clientWidth,$(document).height()) * 0.34
			     $(".device").css('width',marqueeDevWidth)
				}
		}, false);
})
