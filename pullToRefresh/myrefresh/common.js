function pushDownRefresh(ListentEvent1, ListentEvent2, ListentEvent3, content1, callback) {
	var contentId = document.querySelector('#content');
	var refreshFlag = true;
	var content = document.getElementsByClassName("content")[0];
	var _start = 0,
		_end = 0;
	var timeOut = -50;
	var endLose = true;
	// if (isAndroid) {
	// 	timeOut = -5;
	// }
	content.addEventListener("touchstart", (event) => {
		if (!refreshFlag) {
			return;
		}
		var touchTarget = event.targetTouches[0];
		_start = touchTarget.pageY;
	}, false);
	content.addEventListener("touchmove", (e) => {
		console.log(`scrolll   ${$(window).scrollTop()}`);
		var y = $(window).scrollTop();

		if (!refreshFlag) {
			return;
		}
		var touchTarget = e.targetTouches[0];
		_end = _start - touchTarget.pageY;
		// console.log("end touchmove"+_end);
		if (_end <= timeOut && $(window).scrollTop() <= 0) {
			ListentEvent1(_end);
			contentId.style.webkitTransform = `translate(0px, ${0 - _end}px) translateZ(0px)`;
			contentId.style.transform = `translate(0px, ${0 - _end}px) translateZ(0px)`;
			setTimeout(() => {
				if (endLose) {
					callback();
				}
			}, 2000);
		}
	});
	content.addEventListener("touchend", () => {
		endLose = false;
		if (!refreshFlag) {
			return;
		}
		if (_end < timeOut && $(window).scrollTop() <= 0) {
			callback();
		}
	}, false);
}
