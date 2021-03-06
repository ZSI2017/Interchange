var EVENT_PULL = "pullHook",
	EVENT_DOWN_LOADING = 'downLoading',
	CLASS_ROTATE = 'minirefresh-rotate';

var self = {
	offset: 60,

	events: {
		pullHook: function (downHeight, downOffset) {
			FULL_DEGREE = 360;

			if (downHeight < downOffset) {
				// if (this.isCanPullDown) {
				// 	this.downWrapTips.innerText = options.down.contentdown;
				// 	this.isCanPullDown = false;
				// 	this._changeWrapStatusClass(this.downWrap, CLASS_STATUS_DEFAULT);
				// }
				document.querySelector("#setTitle span").innerHTML = "下拉";
			} else {
				// if (!this.isCanPullDown) {
				// 	this.downWrapTips.innerText = options.down.contentover;
				// 	this.isCanPullDown = true;
				// 	this._changeWrapStatusClass(this.downWrap, CLASS_STATUS_PULL);
				// }
				document.querySelector("#setTitle span").innerHTML = "放手";
			}


			var rate = downHeight / downOffset,
				progress = FULL_DEGREE * rate;
			var downWrapProgress = self.downWrapProgress
			downWrapProgress.style.webkitTransform = 'rotate(' + progress + 'deg)';
			downWrapProgress.style.transform = 'rotate(' + progress + 'deg)';
		},
		downLoading: function () {
			var downWrapProgress = self.downWrapProgress;
			downWrapProgress.classList.add(CLASS_ROTATE);
		}
	},
	_translate: function (y, duration) {
		// if (!this.options.down.isScrollCssTranslate) {
		// 	// 只有允许动画时才会scroll也translate,否则只会改变downHeight
		// 	return;
		// }
		y = y || 0;
		duration = duration || 0;

		var wrap = this.contentWrap;

		wrap.style.webkitTransitionDuration = duration + 'ms';
		wrap.style.transitionDuration = duration + 'ms';
		wrap.style.webkitTransform = 'translate(0px, ' + y + 'px) translateZ(0px)';
		wrap.style.transform = 'translate(0px, ' + y + 'px) translateZ(0px)';

		self._transformDownWrap(-self.offset + y);
	},
	triggerDownLoading: function (cb) {
		// this.downLoading = true;
		this.downHight = 0;
		// this._translate(this.downHight, 300);
		this.downLoading = true;
		this._translate(this.offset, 300);
		document.querySelector("#setTitle span").innerHTML = "正在";
		this.events[EVENT_DOWN_LOADING]();
		setTimeout(function () {
			console.log("begin ajax")
			self.endDownLoading();
			self.downWrapProgress.classList.remove(CLASS_ROTATE);
		}, 1000)
		cb();
	},
	_transformDownWrap: function (offset, duration, isForce) {

		offset = offset || 0;
		duration = duration || 0;
		// 记得动画时 translateZ 否则硬件加速会被覆盖
		this.downWrap.style.webkitTransitionDuration = duration + 'ms';
		this.downWrap.style.transitionDuration = duration + 'ms';
		this.downWrap.style.webkitTransform = 'translateY(' + offset + 'px)  translateZ(0px)';
		this.downWrap.style.transform = 'translateY(' + offset + 'px)  translateZ(0px)';
	},
	endDownLoading: function () {
		var self = this,
			options = this.options,
			bounceTime = 300

		if (this.downLoading) {

			// 必须是loading时才允许结束
			self._translate(0, bounceTime);
			self.downHight = 0;
			this.downLoading = false;
			document.querySelector("#setTitle span").innerHTML = "下拉";
		}
	}
};

function pushDownRefresh(ListentEvent1, ListentEvent2, ListentEvent3, content1, callback) {

	var contentId = document.querySelector('#content');
	var refreshFlag = true;
	var content = document.getElementsByClassName('content')[0];
	var downWrap = document.querySelector("#mesage1")
	var downWrapProgress = document.querySelector("#upwrap-progress")
	var _start = 0,
		_end = 0;
	var timeOut = -50;
	var endLose = true;
	self.contentWrap = content;
	self.downWrap = downWrap;
	self.downWrapProgress = downWrapProgress;
	// if (isAndroid) {
	// 	timeOut = -5;
	// }
	content.addEventListener('touchstart', (event) => {

		touchstartEvent(event)

	}, false);

	content.addEventListener('touchmove', (e) => {
		touchmoveEvent(e);
});
	content.addEventListener('touchend', (e) => {
		touchendEvent(e,callback);
		// endLose = false;
		// if (!refreshFlag) {
		// 	return;
		// }
		// if (_end < timeOut && $(window).scrollTop() <= 0) {
		// 	callback();
		// }
	});
	content.addEventListener('touchcancel', (e) => {
		touchendEvent(e,callback);
		// endLose = false;
		// if (!refreshFlag) {
		// 	return;
		// }
		// if (_end < timeOut && $(window).scrollTop() <= 0) {
		// 	callback();
		// }
	});
}


function touchstartEvent(e) {
	// if (self.isScrollTo) {
	// 	// 如果执行滑动事件,则阻止touch事件,优先执行scrollTo方法
	// 	e.preventDefault();
	// }
	// 记录startTop, 并且只有startTop存在值时才允许move
	self.startTop = content.scrollTop;
	console.log(content.scrollTop);
	// startY用来计算距离
	self.startY = e.touches ? e.touches[0].pageY : e.clientY;
	// X的作用是用来计算方向，如果是横向，则不进行动画处理，避免误操作
	self.startX = e.touches ? e.touches[0].pageX : e.clientX;

	// e.preventDefault();
};


function touchmoveEvent(e) {
	var options = self.options,
		isAllowDownloading = true;

	if (self.downLoading) {
		isAllowDownloading = false;
	}

	// else if (!options.down.isAways && self.upLoading) {
	// 	isAllowDownloading = false;
	// }
	document.querySelector("#minifresh").scrollTop;

	console.log(`content.scrollTop${document.getElementById("minifresh").scrollTop}`);
	if (self.startTop !== undefined && self.startTop <= 0 && document.getElementById("minifresh").scrollTop <= 0 && (isAllowDownloading)) {
		// 列表在顶部且不在加载中，并且没有锁住下拉动画

		// 当前第一个手指距离列表顶部的距离
		var curY = e.touches ? e.touches[0].pageY : e.clientY;
		var curX = e.touches ? e.touches[0].pageX : e.clientX;

		// 手指滑出屏幕触发刷新
		// if (curY > clientHeight) {
		// 	touchendEvent(e);
		//
		// 	return;
		// }

		if (!self.preY) {
			// 设置上次移动的距离，作用是用来计算滑动方向
			self.preY = curY;
		}

		// 和上次比,移动的距离 (大于0向下,小于0向上)
		var diff = curY - self.preY;

		self.preY = curY;

		// 和起点比,移动的距离,大于0向下拉
		var moveY = curY - self.startY;
		var moveX = curX - self.startX;

		// 如果锁定横向滑动并且横向滑动更多，阻止默认事件
		// if (options.isLockX && Math.abs(moveX) > Math.abs(moveY)) {
		// 	e.preventDefault();
		//
		// 	return;
		// }

		// if (self.isBounce && os.ios) {
		// 	// 暂时iOS中去回弹
		// 	// 下一个版本中，分开成两种情况，一种是absolute的固定动画，一种是在scrollWrap内部跟随滚动的动画
		// 	return;
		// }
		// console.log(moveY);
		if (moveY > 0) {
			// 向下拉
			self.isMoveDown = true;

			// 阻止浏览器的默认滚动事件，因为这时候只需要执行动画即可
			e.preventDefault();

			if (!self.downHight) {
				// 下拉区域的高度，用translate动画
				self.downHight = 0;
			}

			var downOffset = self.offset,
				dampRate = 0.7;

			if (self.downHight < downOffset) {
				// 下拉距离  < 指定距离
				dampRate = 0.7
			} else {
				document.querySelector("#setTitle span").innerHTML = "松开";
				// 超出了指定距离，随时可以刷新
				dampRate = 0.06
			}

			if (diff > 0) {
				// 需要加上阻尼系数
				self.downHight += diff * dampRate;
			} else {
				// 向上收回高度,则向上滑多少收多少高度
				self.downHight += diff;
			}

			self.events[EVENT_PULL] && self.events[EVENT_PULL](self.downHight, downOffset);

			// 执行动画
			self._translate(self.downHight);
		} else {
			self.isBounce = true;
			// 向下拉

			// 解决嵌套问题。在嵌套有 IScroll，或类似的组件时，这段代码会生效，可以辅助滚动scrolltop
			// 否则有可能在最开始滚不动
			// if (scrollWrap.scrollTop <= 0) {
			// 	scrollWrap.scrollTop += Math.abs(diff);
			// }
		}
	}
}

var touchendEvent = function (e,cb) {
	// alert("ddd");
	var options = self.options;

	// 需要重置状态
	if (self.isMoveDown) {
		// 如果下拉区域已经执行动画,则需重置回来
		if (self.downHight >= self.offset) {
			// 符合触发刷新的条件
			self.triggerDownLoading(cb);
		} else {
			// 否则默认重置位置
			self._translate(0);
			self.downHight = 0;
			// self.events[EVENT_CANCEL_LOADING] && self.events[EVENT_CANCEL_LOADING]();
			// }
		}
		self.isMoveDown = false;
	}

	self.startY = 0;
	self.startX = 0;
	self.preY = 0;
	self.startTop = undefined;
	// 当前是否正处于回弹中，常用于iOS中判断，如果先上拉再下拉就处于回弹中（只要moveY为负）
	self.isBounce = false;
};
