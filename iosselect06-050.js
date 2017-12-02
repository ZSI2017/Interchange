(function () {
	function r(a, h) {
		if (!(this instanceof r)) return new r(a, h);
		this.html = a;
		this.opts = h;
		a = document.createElement("div");
		a.className = "olay";
		h = document.createElement("div");
		h.className = "layer";
		this.el = a;
		this.layer_el = h;
		this.init()
	}

	function t(a, h, b) {
		iosSelectUtil.isArray(h) && 0 !== h.length && (this.data = h, this.level = a || 1, this.options = b, this.typeBox = "one-level-box", 1 === this.level ? this.typeBox = "one-level-box" : 2 === this.level ? this.typeBox = "two-level-box" : 3 === this.level ? this.typeBox = "three-level-box" : 4 ===
			this.level ? this.typeBox = "four-level-box" : 5 === this.level && (this.typeBox = "five-level-box"), this.callback = b.callback, this.title = b.title || "", this.options.itemHeight = b.itemHeight || 35, this.options.itemShowCount = -1 !== [3, 5, 7, 9].indexOf(b.itemShowCount) ? b.itemShowCount : 7, this.options.coverArea1Top = Math.floor(this.options.itemShowCount / 2), this.options.coverArea2Top = Math.ceil(this.options.itemShowCount / 2), this.options.headerHeight = b.headerHeight || 44, this.options.relation = iosSelectUtil.isArray(this.options.relation) ?
			this.options.relation : [], this.options.oneTwoRelation = this.options.relation[0], this.options.twoThreeRelation = this.options.relation[1], this.options.threeFourRelation = this.options.relation[2], this.options.fourFiveRelation = this.options.relation[3], "px" !== this.options.cssUnit && "rem" !== this.options.cssUnit && (this.options.cssUnit = "px"), this.setBase(), this.init())
	}
	var q = function (a, h, b) {
		function d(c, b) {
			this.wrapper = "string" == typeof c ? h.querySelector(c) : c;
			this.scroller = this.wrapper.children[0];
			this.scrollerStyle =
				this.scroller.style;
			this.options = {
				resizeScrollbars: !0,
				mouseWheelSpeed: 20,
				snapThreshold: .334,
				disablePointer: !0,
				disableTouch: !e.hasTouch,
				disableMouse: e.hasTouch,
				startX: 0,
				startY: 0,
				scrollY: !0,
				directionLockThreshold: 5,
				momentum: !0,
				bounce: !0,
				bounceTime: 600,
				bounceEasing: "",
				preventDefault: !0,
				preventDefaultException: {
					tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/
				},
				HWCompositing: !0,
				useTransition: !0,
				useTransform: !0,
				bindToWrapper: "undefined" === typeof a.onmousedown
			};
			for (var k in b) this.options[k] = b[k];
			this.translateZ =
				this.options.HWCompositing && e.hasPerspective ? " translateZ(0)" : "";
			this.options.useTransition = e.hasTransition && this.options.useTransition;
			this.options.useTransform = e.hasTransform && this.options.useTransform;
			this.options.eventPassthrough = !0 === this.options.eventPassthrough ? "vertical" : this.options.eventPassthrough;
			this.options.preventDefault = !this.options.eventPassthrough && this.options.preventDefault;
			this.options.scrollY = "vertical" == this.options.eventPassthrough ? !1 : this.options.scrollY;
			this.options.scrollX =
				"horizontal" == this.options.eventPassthrough ? !1 : this.options.scrollX;
			this.options.freeScroll = this.options.freeScroll && !this.options.eventPassthrough;
			this.options.directionLockThreshold = this.options.eventPassthrough ? 0 : this.options.directionLockThreshold;
			this.options.bounceEasing = "string" == typeof this.options.bounceEasing ? e.ease[this.options.bounceEasing] || e.ease.circular : this.options.bounceEasing;
			this.options.resizePolling = void 0 === this.options.resizePolling ? 60 : this.options.resizePolling;
			!0 === this.options.tap &&
				(this.options.tap = "tap");
			this.options.useTransition || this.options.useTransform || /relative|absolute/i.test(this.scrollerStyle.position) || (this.scrollerStyle.position = "relative");
			"scale" == this.options.shrinkScrollbars && (this.options.useTransition = !1);
			this.options.invertWheelDirection = this.options.invertWheelDirection ? -1 : 1;
			3 == this.options.probeType && (this.options.useTransition = !1);
			this.directionY = this.directionX = this.y = this.x = 0;
			this._events = {};
			this._init();
			this.refresh();
			this.scrollTo(this.options.startX,
				this.options.startY);
			this.enable()
		}

		function g(a, b, d) {
			var c = h.createElement("div"),
				k = h.createElement("div");
			!0 === d && (c.style.cssText = "position:absolute;z-index:9999", k.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);border-radius:3px");
			k.className = "iScrollIndicator";
			"h" == a ? (!0 === d && (c.style.cssText += ";height:7px;left:2px;right:2px;bottom:0", k.style.height = "100%"), c.className =
				"iScrollHorizontalScrollbar") : (!0 === d && (c.style.cssText += ";width:7px;bottom:2px;top:2px;right:1px", k.style.width = "100%"), c.className = "iScrollVerticalScrollbar");
			c.style.cssText += ";overflow:hidden";
			b || (c.style.pointerEvents = "none");
			c.appendChild(k);
			return c
		}

		function f(c, b) {
			this.wrapper = "string" == typeof b.el ? h.querySelector(b.el) : b.el;
			this.wrapperStyle = this.wrapper.style;
			this.indicator = this.wrapper.children[0];
			this.indicatorStyle = this.indicator.style;
			this.scroller = c;
			this.options = {
				listenX: !0,
				listenY: !0,
				interactive: !1,
				resize: !0,
				defaultScrollbars: !1,
				shrink: !1,
				fade: !1,
				speedRatioX: 0,
				speedRatioY: 0
			};
			for (var k in b) this.options[k] = b[k];
			this.sizeRatioY = this.sizeRatioX = 1;
			this.maxPosY = this.maxPosX = 0;
			this.options.interactive && (this.options.disableTouch || (e.addEvent(this.indicator, "touchstart", this), e.addEvent(a, "touchend", this)), this.options.disablePointer || (e.addEvent(this.indicator, e.prefixPointerEvent("pointerdown"), this), e.addEvent(a, e.prefixPointerEvent("pointerup"), this)), this.options.disableMouse ||
				(e.addEvent(this.indicator, "mousedown", this), e.addEvent(a, "mouseup", this)));
			if (this.options.fade) {
				this.wrapperStyle[e.style.transform] = this.scroller.translateZ;
				var d = e.style.transitionDuration;
				if (d) {
					this.wrapperStyle[d] = e.isBadAndroid ? "0.0001ms" : "0ms";
					var f = this;
					e.isBadAndroid && l(function () {
						"0.0001ms" === f.wrapperStyle[d] && (f.wrapperStyle[d] = "0s")
					});
					this.wrapperStyle.opacity = "0"
				}
			}
		}
		var l = a.requestAnimationFrame || a.webkitRequestAnimationFrame || a.mozRequestAnimationFrame || a.oRequestAnimationFrame || a.msRequestAnimationFrame ||
			function (c) {
				a.setTimeout(c, 1E3 / 60)
			},
			e = function () {
				function c(a) {
					return !1 === e ? !1 : "" === e ? a : e + a.charAt(0).toUpperCase() + a.substr(1)
				}
				var k = {},
					d = h.createElement("div").style,
					e = function () {
						for (var a = ["t", "webkitT", "MozT", "msT", "OT"], c, b = 0, k = a.length; b < k; b++)
							if (c = a[b] + "ransform", c in d) return a[b].substr(0, a[b].length - 1);
						return !1
					}();
				k.getTime = Date.now || function () {
					return (new Date).getTime()
				};
				k.extend = function (a, c) {
					for (var b in c) a[b] = c[b]
				};
				k.addEvent = function (a, c, b, k) {
					a.addEventListener(c, b, !!k)
				};
				k.removeEvent =
					function (a, c, b, k) {
						a.removeEventListener(c, b, !!k)
					};
				k.prefixPointerEvent = function (c) {
					return a.MSPointerEvent ? "MSPointer" + c.charAt(7).toUpperCase() + c.substr(8) : c
				};
				k.momentum = function (a, c, k, d, e, p) {
					c = a - c;
					k = b.abs(c) / k;
					var f;
					p = void 0 === p ? 6E-4 : p;
					f = a + k * k / (2 * p) * (0 > c ? -1 : 1);
					p = k / p;
					f < d ? (f = e ? d - e / 2.5 * (k / 8) : d, c = b.abs(f - a), p = c / k) : 0 < f && (f = e ? e / 2.5 * (k / 8) : 0, c = b.abs(a) + f, p = c / k);
					return {
						destination: b.round(f),
						duration: p
					}
				};
				var f = c("transform");
				k.extend(k, {
					hasTransform: !1 !== f,
					hasPerspective: c("perspective") in d,
					hasTouch: "ontouchstart" in
						a,
					hasPointer: !(!a.PointerEvent && !a.MSPointerEvent),
					hasTransition: c("transition") in d
				});
				k.isBadAndroid = function () {
					var c = a.navigator.appVersion;
					return /Android/.test(c) && !/Chrome\/\d/.test(c) ? (c = c.match(/Safari\/(\d+.\d)/)) && "object" === typeof c && 2 <= c.length ? 535.19 > parseFloat(c[1]) : !0 : !1
				}();
				k.extend(k.style = {}, {
					transform: f,
					transitionTimingFunction: c("transitionTimingFunction"),
					transitionDuration: c("transitionDuration"),
					transitionDelay: c("transitionDelay"),
					transformOrigin: c("transformOrigin")
				});
				k.hasClass =
					function (c, a) {
						return (new RegExp("(^|\\s)" + a + "(\\s|$)")).test(c.className)
					};
				k.addClass = function (c, a) {
					if (!k.hasClass(c, a)) {
						var b = c.className.split(" ");
						b.push(a);
						c.className = b.join(" ")
					}
				};
				k.removeClass = function (c, a) {
					k.hasClass(c, a) && (c.className = c.className.replace(new RegExp("(^|\\s)" + a + "(\\s|$)", "g"), " "))
				};
				k.offset = function (c) {
					for (var a = -c.offsetLeft, b = -c.offsetTop; c = c.offsetParent;) a -= c.offsetLeft, b -= c.offsetTop;
					return {
						left: a,
						top: b
					}
				};
				k.preventDefaultException = function (c, a) {
					for (var b in a)
						if (a[b].test(c[b])) return !0;
					return !1
				};
				k.extend(k.eventType = {}, {
					touchstart: 1,
					touchmove: 1,
					touchend: 1,
					mousedown: 2,
					mousemove: 2,
					mouseup: 2,
					pointerdown: 3,
					pointermove: 3,
					pointerup: 3,
					MSPointerDown: 3,
					MSPointerMove: 3,
					MSPointerUp: 3
				});
				k.extend(k.ease = {}, {
					quadratic: {
						style: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
						fn: function (c) {
							return c * (2 - c)
						}
					},
					circular: {
						style: "cubic-bezier(0.1, 0.57, 0.1, 1)",
						fn: function (c) {
							return b.sqrt(1 - --c * c)
						}
					},
					back: {
						style: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
						fn: function (c) {
							return --c * c * (5 * c + 4) + 1
						}
					},
					bounce: {
						style: "",
						fn: function (c) {
							return (c /= 1) < 1 / 2.75 ? 7.5625 * c * c : c < 2 / 2.75 ? 7.5625 * (c -= 1.5 / 2.75) * c + .75 : c < 2.5 / 2.75 ? 7.5625 * (c -= 2.25 / 2.75) * c + .9375 : 7.5625 * (c -= 2.625 / 2.75) * c + .984375
						}
					},
					elastic: {
						style: "",
						fn: function (c) {
							return 0 === c ? 0 : 1 == c ? 1 : .4 * b.pow(2, -10 * c) * b.sin(2 * (c - .055) * b.PI / .22) + 1
						}
					}
				});
				k.tap = function (c, a) {
					var b = h.createEvent("Event");
					b.initEvent(a, !0, !0);
					b.pageX = c.pageX;
					b.pageY = c.pageY;
					c.target.dispatchEvent(b)
				};
				k.click = function (c) {
					var b = c.target,
						k;
					/(SELECT|INPUT|TEXTAREA)/i.test(b.tagName) || (k = h.createEvent(a.MouseEvent ?
						"MouseEvents" : "Event"), k.initEvent("click", !0, !0), k.view = c.view || a, k.detail = 1, k.screenX = b.screenX || 0, k.screenY = b.screenY || 0, k.clientX = b.clientX || 0, k.clientY = b.clientY || 0, k.ctrlKey = !!c.ctrlKey, k.altKey = !!c.altKey, k.shiftKey = !!c.shiftKey, k.metaKey = !!c.metaKey, k.button = 0, k.relatedTarget = null, k._constructed = !0, b.dispatchEvent(k))
				};
				return k
			}();
		d.prototype = {
			version: "5.2.0",
			_init: function () {
				this._initEvents();
				(this.options.scrollbars || this.options.indicators) && this._initIndicators();
				this.options.mouseWheel &&
					this._initWheel();
				this.options.snap && this._initSnap();
				this.options.keyBindings && this._initKeys()
			},
			destroy: function () {
				this._initEvents(!0);
				clearTimeout(this.resizeTimeout);
				this.resizeTimeout = null;
				this._execEvent("destroy")
			},
			_transitionEnd: function (c) {
				c.target == this.scroller && this.isInTransition && (this._transitionTime(), this.resetPosition(this.options.bounceTime) || (this.isInTransition = !1, this._execEvent("scrollEnd")))
			},
			_start: function (c) {
				if (!(1 != e.eventType[c.type] && 0 !== (c.which ? c.button : 2 > c.button ?
						0 : 4 == c.button ? 1 : 2) || !this.enabled || this.initiated && e.eventType[c.type] !== this.initiated)) {
					!this.options.preventDefault || e.isBadAndroid || e.preventDefaultException(c.target, this.options.preventDefaultException) || c.preventDefault();
					var a = c.touches ? c.touches[0] : c;
					this.initiated = e.eventType[c.type];
					this.moved = !1;
					this.directionLocked = this.directionY = this.directionX = this.distY = this.distX = 0;
					this.startTime = e.getTime();
					this.options.useTransition && this.isInTransition ? (this._transitionTime(), this.isInTransition = !1, c = this.getComputedPosition(), this._translate(b.round(c.x), b.round(c.y)), this._execEvent("scrollEnd")) : !this.options.useTransition && this.isAnimating && (this.isAnimating = !1, this._execEvent("scrollEnd"));
					this.startX = this.x;
					this.startY = this.y;
					this.absStartX = this.x;
					this.absStartY = this.y;
					this.pointX = a.pageX;
					this.pointY = a.pageY;
					this._execEvent("beforeScrollStart")
				}
			},
			_move: function (c) {
				if (this.enabled && e.eventType[c.type] === this.initiated) {
					this.options.preventDefault && c.preventDefault();
					var a = c.touches ?
						c.touches[0] : c,
						d = a.pageX - this.pointX,
						f = a.pageY - this.pointY,
						g = e.getTime(),
						h;
					this.pointX = a.pageX;
					this.pointY = a.pageY;
					this.distX += d;
					this.distY += f;
					a = b.abs(this.distX);
					h = b.abs(this.distY);
					if (!(300 < g - this.endTime && 10 > a && 10 > h)) {
						this.directionLocked || this.options.freeScroll || (this.directionLocked = a > h + this.options.directionLockThreshold ? "h" : h >= a + this.options.directionLockThreshold ? "v" : "n");
						if ("h" == this.directionLocked) {
							if ("vertical" == this.options.eventPassthrough) c.preventDefault();
							else if ("horizontal" == this.options.eventPassthrough) {
								this.initiated = !1;
								return
							}
							f = 0
						} else if ("v" == this.directionLocked) {
							if ("horizontal" == this.options.eventPassthrough) c.preventDefault();
							else if ("vertical" == this.options.eventPassthrough) {
								this.initiated = !1;
								return
							}
							d = 0
						}
						d = this.hasHorizontalScroll ? d : 0;
						f = this.hasVerticalScroll ? f : 0;
						c = this.x + d;
						a = this.y + f;
						if (0 < c || c < this.maxScrollX) c = this.options.bounce ? this.x + d / 3 : 0 < c ? 0 : this.maxScrollX;
						if (0 < a || a < this.maxScrollY) a = this.options.bounce ? this.y + f / 3 : 0 < a ? 0 : this.maxScrollY;
						this.directionX = 0 < d ? -1 : 0 > d ? 1 : 0;
						this.directionY = 0 < f ? -1 : 0 > f ? 1 : 0;
						this.moved || this._execEvent("scrollStart");
						this.moved = !0;
						this._translate(c, a);
						300 < g - this.startTime && (this.startTime = g, this.startX = this.x, this.startY = this.y, 1 == this.options.probeType && this._execEvent("scroll"));
						1 < this.options.probeType && this._execEvent("scroll")
					}
				}
			},
			_end: function (c) {
				if (this.enabled && e.eventType[c.type] === this.initiated) {
					this.options.preventDefault && !e.preventDefaultException(c.target, this.options.preventDefaultException) && c.preventDefault();
					var a, d;
					d = e.getTime() - this.startTime;
					var f =
						b.round(this.x),
						g = b.round(this.y),
						h = b.abs(f - this.startX),
						l = b.abs(g - this.startY);
					a = 0;
					var m = "";
					this.initiated = this.isInTransition = 0;
					this.endTime = e.getTime();
					if (!this.resetPosition(this.options.bounceTime))
						if (this.scrollTo(f, g), this.moved)
							if (this._events.flick && 200 > d && 100 > h && 100 > l) this._execEvent("flick");
							else if (this.options.momentum && 300 > d && (a = this.hasHorizontalScroll ? e.momentum(this.x, this.startX, d, this.maxScrollX, this.options.bounce ? this.wrapperWidth : 0, this.options.deceleration) : {
								destination: f,
								duration: 0
							},
							d = this.hasVerticalScroll ? e.momentum(this.y, this.startY, d, this.maxScrollY, this.options.bounce ? this.wrapperHeight : 0, this.options.deceleration) : {
								destination: g,
								duration: 0
							}, f = a.destination, g = d.destination, a = b.max(a.duration, d.duration), this.isInTransition = 1), this.options.snap && (this.currentPage = m = this._nearestSnap(f, g), a = this.options.snapSpeed || b.max(b.max(b.min(b.abs(f - m.x), 1E3), b.min(b.abs(g - m.y), 1E3)), 300), f = m.x, g = m.y, this.directionY = this.directionX = 0, m = this.options.bounceEasing), f != this.x || g != this.y) {
						if (0 <
							f || f < this.maxScrollX || 0 < g || g < this.maxScrollY) m = e.ease.quadratic;
						this.scrollTo(f, g, a, m)
					} else this._execEvent("scrollEnd");
					else this.options.tap && e.tap(c, this.options.tap), this.options.click && e.click(c), this._execEvent("scrollCancel")
				}
			},
			_resize: function () {
				var c = this;
				clearTimeout(this.resizeTimeout);
				this.resizeTimeout = setTimeout(function () {
					c.refresh()
				}, this.options.resizePolling)
			},
			resetPosition: function (c) {
				var a = this.x,
					b = this.y;
				!this.hasHorizontalScroll || 0 < this.x ? a = 0 : this.x < this.maxScrollX && (a = this.maxScrollX);
				!this.hasVerticalScroll || 0 < this.y ? b = 0 : this.y < this.maxScrollY && (b = this.maxScrollY);
				if (a == this.x && b == this.y) return !1;
				this.scrollTo(a, b, c || 0, this.options.bounceEasing);
				return !0
			},
			disable: function () {
				this.enabled = !1
			},
			enable: function () {
				this.enabled = !0
			},
			refresh: function () {
				this.wrapperWidth = this.wrapper.clientWidth;
				this.wrapperHeight = this.wrapper.clientHeight;
				this.scrollerWidth = this.scroller.offsetWidth;
				this.scrollerHeight = this.scroller.offsetHeight;
				this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
				this.maxScrollY =
					this.wrapperHeight - this.scrollerHeight;
				this.hasHorizontalScroll = this.options.scrollX && 0 > this.maxScrollX;
				this.hasVerticalScroll = this.options.scrollY && 0 > this.maxScrollY;
				this.hasHorizontalScroll || (this.maxScrollX = 0, this.scrollerWidth = this.wrapperWidth);
				this.hasVerticalScroll || (this.maxScrollY = 0, this.scrollerHeight = this.wrapperHeight);
				this.directionY = this.directionX = this.endTime = 0;
				this.wrapperOffset = e.offset(this.wrapper);
				this._execEvent("refresh");
				this.resetPosition()
			},
			on: function (c, a) {
				this._events[c] ||
					(this._events[c] = []);
				this._events[c].push(a)
			},
			off: function (c, a) {
				this._events[c] && (a = this._events[c].indexOf(a), -1 < a && this._events[c].splice(a, 1))
			},
			_execEvent: function (c) {
				if (this._events[c]) {
					var a = 0,
						b = this._events[c].length;
					if (b)
						for (; a < b; a++) this._events[c][a].apply(this, [].slice.call(arguments, 1))
				}
			},
			scrollBy: function (c, a, b, d) {
				c = this.x + c;
				a = this.y + a;
				this.scrollTo(c, a, b || 0, d)
			},
			scrollTo: function (c, a, b, d) {
				d = d || e.ease.circular;
				this.isInTransition = this.options.useTransition && 0 < b;
				var k = this.options.useTransition &&
					d.style;
				!b || k ? (k && (this._transitionTimingFunction(d.style), this._transitionTime(b)), this._translate(c, a)) : this._animate(c, a, b, d.fn)
			},
			scrollToElement: function (a, k, d, f, g) {
				if (a = a.nodeType ? a : this.scroller.querySelector(a)) {
					var c = e.offset(a);
					c.left -= this.wrapperOffset.left;
					c.top -= this.wrapperOffset.top;
					!0 === d && (d = b.round(a.offsetWidth / 2 - this.wrapper.offsetWidth / 2));
					!0 === f && (f = b.round(a.offsetHeight / 2 - this.wrapper.offsetHeight / 2));
					c.left -= d || 0;
					c.top -= f || 0;
					c.left = 0 < c.left ? 0 : c.left < this.maxScrollX ? this.maxScrollX :
						c.left;
					c.top = 0 < c.top ? 0 : c.top < this.maxScrollY ? this.maxScrollY : c.top;
					k = void 0 === k || null === k || "auto" === k ? b.max(b.abs(this.x - c.left), b.abs(this.y - c.top)) : k;
					this.scrollTo(c.left, c.top, k, g)
				}
			},
			_transitionTime: function (c) {
				if (this.options.useTransition) {
					c = c || 0;
					var a = e.style.transitionDuration;
					if (a) {
						this.scrollerStyle[a] = c + "ms";
						if (!c && e.isBadAndroid) {
							this.scrollerStyle[a] = "0.0001ms";
							var b = this;
							l(function () {
								"0.0001ms" === b.scrollerStyle[a] && (b.scrollerStyle[a] = "0s")
							})
						}
						if (this.indicators)
							for (var d = this.indicators.length; d--;) this.indicators[d].transitionTime(c)
					}
				}
			},
			_transitionTimingFunction: function (a) {
				this.scrollerStyle[e.style.transitionTimingFunction] = a;
				if (this.indicators)
					for (var c = this.indicators.length; c--;) this.indicators[c].transitionTimingFunction(a)
			},
			_translate: function (a, k) {
				this.options.useTransform ? this.scrollerStyle[e.style.transform] = "translate(" + a + "px," + k + "px)" + this.translateZ : (a = b.round(a), k = b.round(k), this.scrollerStyle.left = a + "px", this.scrollerStyle.top = k + "px");
				this.x = a;
				this.y = k;
				if (this.indicators)
					for (a = this.indicators.length; a--;) this.indicators[a].updatePosition()
			},
			_initEvents: function (c) {
				c = c ? e.removeEvent : e.addEvent;
				var b = this.options.bindToWrapper ? this.wrapper : a;
				c(a, "orientationchange", this);
				c(a, "resize", this);
				this.options.click && c(this.wrapper, "click", this, !0);
				this.options.disableMouse || (c(this.wrapper, "mousedown", this), c(b, "mousemove", this), c(b, "mousecancel", this), c(b, "mouseup", this));
				e.hasPointer && !this.options.disablePointer && (c(this.wrapper, e.prefixPointerEvent("pointerdown"), this), c(b, e.prefixPointerEvent("pointermove"), this), c(b, e.prefixPointerEvent("pointercancel"),
					this), c(b, e.prefixPointerEvent("pointerup"), this));
				e.hasTouch && !this.options.disableTouch && (c(this.wrapper, "touchstart", this), c(b, "touchmove", this), c(b, "touchcancel", this), c(b, "touchend", this));
				c(this.scroller, "transitionend", this);
				c(this.scroller, "webkitTransitionEnd", this);
				c(this.scroller, "oTransitionEnd", this);
				c(this.scroller, "MSTransitionEnd", this)
			},
			getComputedPosition: function () {
				var c = a.getComputedStyle(this.scroller, null),
					b;
				this.options.useTransform ? (c = c[e.style.transform].split(")")[0].split(", "),
					b = +(c[12] || c[4]), c = +(c[13] || c[5])) : (b = +c.left.replace(/[^-\d.]/g, ""), c = +c.top.replace(/[^-\d.]/g, ""));
				return {
					x: b,
					y: c
				}
			},
			_initIndicators: function () {
				function a(a) {
					if (l.indicators)
						for (var c = l.indicators.length; c--;) a.call(l.indicators[c])
				}
				var b = this.options.interactiveScrollbars,
					d = "string" != typeof this.options.scrollbars,
					e = [],
					h, l = this;
				this.indicators = [];
				this.options.scrollbars && (this.options.scrollY && (h = {
					el: g("v", b, this.options.scrollbars),
					interactive: b,
					defaultScrollbars: !0,
					customStyle: d,
					resize: this.options.resizeScrollbars,
					shrink: this.options.shrinkScrollbars,
					fade: this.options.fadeScrollbars,
					listenX: !1
				}, this.wrapper.appendChild(h.el), e.push(h)), this.options.scrollX && (h = {
					el: g("h", b, this.options.scrollbars),
					interactive: b,
					defaultScrollbars: !0,
					customStyle: d,
					resize: this.options.resizeScrollbars,
					shrink: this.options.shrinkScrollbars,
					fade: this.options.fadeScrollbars,
					listenY: !1
				}, this.wrapper.appendChild(h.el), e.push(h)));
				this.options.indicators && (e = e.concat(this.options.indicators));
				for (b = e.length; b--;) this.indicators.push(new f(this,
					e[b]));
				this.options.fadeScrollbars && (this.on("scrollEnd", function () {
					a(function () {
						this.fade()
					})
				}), this.on("scrollCancel", function () {
					a(function () {
						this.fade()
					})
				}), this.on("scrollStart", function () {
					a(function () {
						this.fade(1)
					})
				}), this.on("beforeScrollStart", function () {
					a(function () {
						this.fade(1, !0)
					})
				}));
				this.on("refresh", function () {
					a(function () {
						this.refresh()
					})
				});
				this.on("destroy", function () {
					a(function () {
						this.destroy()
					});
					delete this.indicators
				})
			},
			_initWheel: function () {
				e.addEvent(this.wrapper, "wheel", this);
				e.addEvent(this.wrapper, "mousewheel", this);
				e.addEvent(this.wrapper, "DOMMouseScroll", this);
				this.on("destroy", function () {
					clearTimeout(this.wheelTimeout);
					this.wheelTimeout = null;
					e.removeEvent(this.wrapper, "wheel", this);
					e.removeEvent(this.wrapper, "mousewheel", this);
					e.removeEvent(this.wrapper, "DOMMouseScroll", this)
				})
			},
			_wheel: function (a) {
				if (this.enabled) {
					a.preventDefault();
					var c, d, e, f = this;
					void 0 === this.wheelTimeout && f._execEvent("scrollStart");
					clearTimeout(this.wheelTimeout);
					this.wheelTimeout = setTimeout(function () {
						f.options.snap ||
							f._execEvent("scrollEnd");
						f.wheelTimeout = void 0
					}, 400);
					if ("deltaX" in a) 1 === a.deltaMode ? (c = -a.deltaX * this.options.mouseWheelSpeed, a = -a.deltaY * this.options.mouseWheelSpeed) : (c = -a.deltaX, a = -a.deltaY);
					else if ("wheelDeltaX" in a) c = a.wheelDeltaX / 120 * this.options.mouseWheelSpeed, a = a.wheelDeltaY / 120 * this.options.mouseWheelSpeed;
					else if ("wheelDelta" in a) c = a = a.wheelDelta / 120 * this.options.mouseWheelSpeed;
					else if ("detail" in a) c = a = -a.detail / 3 * this.options.mouseWheelSpeed;
					else return;
					c *= this.options.invertWheelDirection;
					a *= this.options.invertWheelDirection;
					this.hasVerticalScroll || (c = a, a = 0);
					this.options.snap ? (d = this.currentPage.pageX, e = this.currentPage.pageY, 0 < c ? d-- : 0 > c && d++, 0 < a ? e-- : 0 > a && e++, this.goToPage(d, e)) : (d = this.x + b.round(this.hasHorizontalScroll ? c : 0), e = this.y + b.round(this.hasVerticalScroll ? a : 0), this.directionX = 0 < c ? -1 : 0 > c ? 1 : 0, this.directionY = 0 < a ? -1 : 0 > a ? 1 : 0, 0 < d ? d = 0 : d < this.maxScrollX && (d = this.maxScrollX), 0 < e ? e = 0 : e < this.maxScrollY && (e = this.maxScrollY), this.scrollTo(d, e, 0), 1 < this.options.probeType && this._execEvent("scroll"))
				}
			},
			_initSnap: function () {
				this.currentPage = {};
				"string" == typeof this.options.snap && (this.options.snap = this.scroller.querySelectorAll(this.options.snap));
				this.on("refresh", function () {
					var a = 0,
						d, e = 0,
						f, g, h, l = 0,
						m;
					f = this.options.snapStepX || this.wrapperWidth;
					var n = this.options.snapStepY || this.wrapperHeight;
					this.pages = [];
					if (this.wrapperWidth && this.wrapperHeight && this.scrollerWidth && this.scrollerHeight) {
						if (!0 === this.options.snap)
							for (g = b.round(f / 2), h = b.round(n / 2); l > -this.scrollerWidth;) {
								this.pages[a] = [];
								for (m = d =
									0; m > -this.scrollerHeight;) this.pages[a][d] = {
									x: b.max(l, this.maxScrollX),
									y: b.max(m, this.maxScrollY),
									width: f,
									height: n,
									cx: l - g,
									cy: m - h
								}, m -= n, d++;
								l -= f;
								a++
							} else
								for (n = this.options.snap, d = n.length, f = -1; a < d; a++) {
									if (0 === a || n[a].offsetLeft <= n[a - 1].offsetLeft) e = 0, f++;
									this.pages[e] || (this.pages[e] = []);
									l = b.max(-n[a].offsetLeft, this.maxScrollX);
									m = b.max(-n[a].offsetTop, this.maxScrollY);
									g = l - b.round(n[a].offsetWidth / 2);
									h = m - b.round(n[a].offsetHeight / 2);
									this.pages[e][f] = {
										x: l,
										y: m,
										width: n[a].offsetWidth,
										height: n[a].offsetHeight,
										cx: g,
										cy: h
									};
									l > this.maxScrollX && e++
								}
						this.goToPage(this.currentPage.pageX || 0, this.currentPage.pageY || 0, 0);
						0 === this.options.snapThreshold % 1 ? this.snapThresholdY = this.snapThresholdX = this.options.snapThreshold : (this.snapThresholdX = b.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].width * this.options.snapThreshold), this.snapThresholdY = b.round(this.pages[this.currentPage.pageX][this.currentPage.pageY].height * this.options.snapThreshold))
					}
				});
				this.on("flick", function () {
					var a = this.options.snapSpeed ||
						b.max(b.max(b.min(b.abs(this.x - this.startX), 1E3), b.min(b.abs(this.y - this.startY), 1E3)), 300);
					this.goToPage(this.currentPage.pageX + this.directionX, this.currentPage.pageY + this.directionY, a)
				})
			},
			_nearestSnap: function (a, d) {
				if (!this.pages.length) return {
					x: 0,
					y: 0,
					pageX: 0,
					pageY: 0
				};
				var c = 0,
					k = this.pages.length,
					e = 0;
				if (b.abs(a - this.absStartX) < this.snapThresholdX && b.abs(d - this.absStartY) < this.snapThresholdY) return this.currentPage;
				0 < a ? a = 0 : a < this.maxScrollX && (a = this.maxScrollX);
				0 < d ? d = 0 : d < this.maxScrollY && (d = this.maxScrollY);
				for (; c < k; c++)
					if (a >= this.pages[c][0].cx) {
						a = this.pages[c][0].x;
						break
					}
				for (k = this.pages[c].length; e < k; e++)
					if (d >= this.pages[0][e].cy) {
						d = this.pages[0][e].y;
						break
					}
				c == this.currentPage.pageX && (c += this.directionX, 0 > c ? c = 0 : c >= this.pages.length && (c = this.pages.length - 1), a = this.pages[c][0].x);
				e == this.currentPage.pageY && (e += this.directionY, 0 > e ? e = 0 : e >= this.pages[0].length && (e = this.pages[0].length - 1), d = this.pages[0][e].y);
				return {
					x: a,
					y: d,
					pageX: c,
					pageY: e
				}
			},
			goToPage: function (a, d, e, f) {
				f = f || this.options.bounceEasing;
				a >=
					this.pages.length ? a = this.pages.length - 1 : 0 > a && (a = 0);
				d >= this.pages[a].length ? d = this.pages[a].length - 1 : 0 > d && (d = 0);
				var c = this.pages[a][d].x,
					k = this.pages[a][d].y;
				e = void 0 === e ? this.options.snapSpeed || b.max(b.max(b.min(b.abs(c - this.x), 1E3), b.min(b.abs(k - this.y), 1E3)), 300) : e;
				this.currentPage = {
					x: c,
					y: k,
					pageX: a,
					pageY: d
				};
				this.scrollTo(c, k, e, f)
			},
			next: function (a, b) {
				var c = this.currentPage.pageX,
					d = this.currentPage.pageY;
				c++;
				c >= this.pages.length && this.hasVerticalScroll && (c = 0, d++);
				this.goToPage(c, d, a, b)
			},
			prev: function (a,
				b) {
				var c = this.currentPage.pageX,
					d = this.currentPage.pageY;
				c--;
				0 > c && this.hasVerticalScroll && (c = 0, d--);
				this.goToPage(c, d, a, b)
			},
			_initKeys: function (c) {
				c = {
					pageUp: 33,
					pageDown: 34,
					end: 35,
					home: 36,
					left: 37,
					up: 38,
					right: 39,
					down: 40
				};
				var b;
				if ("object" == typeof this.options.keyBindings)
					for (b in this.options.keyBindings) "string" == typeof this.options.keyBindings[b] && (this.options.keyBindings[b] = this.options.keyBindings[b].toUpperCase().charCodeAt(0));
				else this.options.keyBindings = {};
				for (b in c) this.options.keyBindings[b] =
					this.options.keyBindings[b] || c[b];
				e.addEvent(a, "keydown", this);
				this.on("destroy", function () {
					e.removeEvent(a, "keydown", this)
				})
			},
			_key: function (a) {
				if (this.enabled) {
					var c = this.options.snap,
						d = c ? this.currentPage.pageX : this.x,
						f = c ? this.currentPage.pageY : this.y,
						g = e.getTime(),
						h = this.keyTime || 0,
						l;
					this.options.useTransition && this.isInTransition && (l = this.getComputedPosition(), this._translate(b.round(l.x), b.round(l.y)), this.isInTransition = !1);
					this.keyAcceleration = 200 > g - h ? b.min(this.keyAcceleration + .25, 50) : 0;
					switch (a.keyCode) {
					case this.options.keyBindings.pageUp:
						this.hasHorizontalScroll &&
							!this.hasVerticalScroll ? d += c ? 1 : this.wrapperWidth : f += c ? 1 : this.wrapperHeight;
						break;
					case this.options.keyBindings.pageDown:
						this.hasHorizontalScroll && !this.hasVerticalScroll ? d -= c ? 1 : this.wrapperWidth : f -= c ? 1 : this.wrapperHeight;
						break;
					case this.options.keyBindings.end:
						d = c ? this.pages.length - 1 : this.maxScrollX;
						f = c ? this.pages[0].length - 1 : this.maxScrollY;
						break;
					case this.options.keyBindings.home:
						f = d = 0;
						break;
					case this.options.keyBindings.left:
						d += c ? -1 : 5 + this.keyAcceleration >> 0;
						break;
					case this.options.keyBindings.up:
						f +=
							c ? 1 : 5 + this.keyAcceleration >> 0;
						break;
					case this.options.keyBindings.right:
						d -= c ? -1 : 5 + this.keyAcceleration >> 0;
						break;
					case this.options.keyBindings.down:
						f -= c ? 1 : 5 + this.keyAcceleration >> 0;
						break;
					default:
						return
					}
					c ? this.goToPage(d, f) : (0 < d ? this.keyAcceleration = d = 0 : d < this.maxScrollX && (d = this.maxScrollX, this.keyAcceleration = 0), 0 < f ? this.keyAcceleration = f = 0 : f < this.maxScrollY && (f = this.maxScrollY, this.keyAcceleration = 0), this.scrollTo(d, f, 0), this.keyTime = g)
				}
			},
			_animate: function (a, b, d, f) {
				function c() {
					var m = e.getTime(),
						n;
					m >= q ? (k.isAnimating = !1, k._translate(a, b), k.resetPosition(k.options.bounceTime) || k._execEvent("scrollEnd")) : (m = (m - p) / d, n = f(m), m = (a - g) * n + g, k._translate(m, (b - h) * n + h), k.isAnimating && l(c), 3 == k.options.probeType && k._execEvent("scroll"))
				}
				var k = this,
					g = this.x,
					h = this.y,
					p = e.getTime(),
					q = p + d;
				this.isAnimating = !0;
				c()
			},
			handleEvent: function (a) {
				switch (a.type) {
				case "touchstart":
				case "pointerdown":
				case "MSPointerDown":
				case "mousedown":
					this._start(a);
					break;
				case "touchmove":
				case "pointermove":
				case "MSPointerMove":
				case "mousemove":
					this._move(a);
					break;
				case "touchend":
				case "pointerup":
				case "MSPointerUp":
				case "mouseup":
				case "touchcancel":
				case "pointercancel":
				case "MSPointerCancel":
				case "mousecancel":
					this._end(a);
					break;
				case "orientationchange":
				case "resize":
					this._resize();
					break;
				case "transitionend":
				case "webkitTransitionEnd":
				case "oTransitionEnd":
				case "MSTransitionEnd":
					this._transitionEnd(a);
					break;
				case "wheel":
				case "DOMMouseScroll":
				case "mousewheel":
					this._wheel(a);
					break;
				case "keydown":
					this._key(a);
					break;
				case "click":
					this.enabled && !a._constructed &&
						(a.preventDefault(), a.stopPropagation())
				}
			}
		};
		f.prototype = {
			handleEvent: function (a) {
				switch (a.type) {
				case "touchstart":
				case "pointerdown":
				case "MSPointerDown":
				case "mousedown":
					this._start(a);
					break;
				case "touchmove":
				case "pointermove":
				case "MSPointerMove":
				case "mousemove":
					this._move(a);
					break;
				case "touchend":
				case "pointerup":
				case "MSPointerUp":
				case "mouseup":
				case "touchcancel":
				case "pointercancel":
				case "MSPointerCancel":
				case "mousecancel":
					this._end(a)
				}
			},
			destroy: function () {
				this.options.fadeScrollbars && (clearTimeout(this.fadeTimeout),
					this.fadeTimeout = null);
				this.options.interactive && (e.removeEvent(this.indicator, "touchstart", this), e.removeEvent(this.indicator, e.prefixPointerEvent("pointerdown"), this), e.removeEvent(this.indicator, "mousedown", this), e.removeEvent(a, "touchmove", this), e.removeEvent(a, e.prefixPointerEvent("pointermove"), this), e.removeEvent(a, "mousemove", this), e.removeEvent(a, "touchend", this), e.removeEvent(a, e.prefixPointerEvent("pointerup"), this), e.removeEvent(a, "mouseup", this));
				this.options.defaultScrollbars && this.wrapper.parentNode.removeChild(this.wrapper)
			},
			_start: function (c) {
				var b = c.touches ? c.touches[0] : c;
				c.preventDefault();
				c.stopPropagation();
				this.transitionTime();
				this.initiated = !0;
				this.moved = !1;
				this.lastPointX = b.pageX;
				this.lastPointY = b.pageY;
				this.startTime = e.getTime();
				this.options.disableTouch || e.addEvent(a, "touchmove", this);
				this.options.disablePointer || e.addEvent(a, e.prefixPointerEvent("pointermove"), this);
				this.options.disableMouse || e.addEvent(a, "mousemove", this);
				this.scroller._execEvent("beforeScrollStart")
			},
			_move: function (a) {
				var b = a.touches ? a.touches[0] :
					a,
					c, d, f = e.getTime();
				this.moved || this.scroller._execEvent("scrollStart");
				this.moved = !0;
				c = b.pageX - this.lastPointX;
				this.lastPointX = b.pageX;
				d = b.pageY - this.lastPointY;
				this.lastPointY = b.pageY;
				this._pos(this.x + c, this.y + d);
				1 == this.scroller.options.probeType && 300 < f - this.startTime ? (this.startTime = f, this.scroller._execEvent("scroll")) : 1 < this.scroller.options.probeType && this.scroller._execEvent("scroll");
				a.preventDefault();
				a.stopPropagation()
			},
			_end: function (c) {
				if (this.initiated) {
					this.initiated = !1;
					c.preventDefault();
					c.stopPropagation();
					e.removeEvent(a, "touchmove", this);
					e.removeEvent(a, e.prefixPointerEvent("pointermove"), this);
					e.removeEvent(a, "mousemove", this);
					if (this.scroller.options.snap) {
						c = this.scroller._nearestSnap(this.scroller.x, this.scroller.y);
						var d = this.options.snapSpeed || b.max(b.max(b.min(b.abs(this.scroller.x - c.x), 1E3), b.min(b.abs(this.scroller.y - c.y), 1E3)), 300);
						if (this.scroller.x != c.x || this.scroller.y != c.y) this.scroller.directionX = 0, this.scroller.directionY = 0, this.scroller.currentPage = c, this.scroller.scrollTo(c.x,
							c.y, d, this.scroller.options.bounceEasing)
					}
					this.moved && this.scroller._execEvent("scrollEnd")
				}
			},
			transitionTime: function (a) {
				a = a || 0;
				var b = e.style.transitionDuration;
				if (b && (this.indicatorStyle[b] = a + "ms", !a && e.isBadAndroid)) {
					this.indicatorStyle[b] = "0.0001ms";
					var c = this;
					l(function () {
						"0.0001ms" === c.indicatorStyle[b] && (c.indicatorStyle[b] = "0s")
					})
				}
			},
			transitionTimingFunction: function (a) {
				this.indicatorStyle[e.style.transitionTimingFunction] = a
			},
			refresh: function () {
				this.transitionTime();
				this.indicatorStyle.display =
					this.options.listenX && !this.options.listenY ? this.scroller.hasHorizontalScroll ? "block" : "none" : this.options.listenY && !this.options.listenX ? this.scroller.hasVerticalScroll ? "block" : "none" : this.scroller.hasHorizontalScroll || this.scroller.hasVerticalScroll ? "block" : "none";
				this.scroller.hasHorizontalScroll && this.scroller.hasVerticalScroll ? (e.addClass(this.wrapper, "iScrollBothScrollbars"), e.removeClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ?
					this.wrapper.style.right = "8px" : this.wrapper.style.bottom = "8px")) : (e.removeClass(this.wrapper, "iScrollBothScrollbars"), e.addClass(this.wrapper, "iScrollLoneScrollbar"), this.options.defaultScrollbars && this.options.customStyle && (this.options.listenX ? this.wrapper.style.right = "2px" : this.wrapper.style.bottom = "2px"));
				this.options.listenX && (this.wrapperWidth = this.wrapper.clientWidth, this.options.resize ? (this.indicatorWidth = b.max(b.round(this.wrapperWidth * this.wrapperWidth / (this.scroller.scrollerWidth || this.wrapperWidth ||
					1)), 8), this.indicatorStyle.width = this.indicatorWidth + "px") : this.indicatorWidth = this.indicator.clientWidth, this.maxPosX = this.wrapperWidth - this.indicatorWidth, "clip" == this.options.shrink ? (this.minBoundaryX = -this.indicatorWidth + 8, this.maxBoundaryX = this.wrapperWidth - 8) : (this.minBoundaryX = 0, this.maxBoundaryX = this.maxPosX), this.sizeRatioX = this.options.speedRatioX || this.scroller.maxScrollX && this.maxPosX / this.scroller.maxScrollX);
				this.options.listenY && (this.wrapperHeight = this.wrapper.clientHeight, this.options.resize ?
					(this.indicatorHeight = b.max(b.round(this.wrapperHeight * this.wrapperHeight / (this.scroller.scrollerHeight || this.wrapperHeight || 1)), 8), this.indicatorStyle.height = this.indicatorHeight + "px") : this.indicatorHeight = this.indicator.clientHeight, this.maxPosY = this.wrapperHeight - this.indicatorHeight, "clip" == this.options.shrink ? (this.minBoundaryY = -this.indicatorHeight + 8, this.maxBoundaryY = this.wrapperHeight - 8) : (this.minBoundaryY = 0, this.maxBoundaryY = this.maxPosY), this.maxPosY = this.wrapperHeight - this.indicatorHeight,
					this.sizeRatioY = this.options.speedRatioY || this.scroller.maxScrollY && this.maxPosY / this.scroller.maxScrollY);
				this.updatePosition()
			},
			updatePosition: function () {
				var a = this.options.listenX && b.round(this.sizeRatioX * this.scroller.x) || 0,
					d = this.options.listenY && b.round(this.sizeRatioY * this.scroller.y) || 0;
				this.options.ignoreBoundaries || (a < this.minBoundaryX ? ("scale" == this.options.shrink && (this.width = b.max(this.indicatorWidth + a, 8), this.indicatorStyle.width = this.width + "px"), a = this.minBoundaryX) : a > this.maxBoundaryX ?
					"scale" == this.options.shrink ? (this.width = b.max(this.indicatorWidth - (a - this.maxPosX), 8), this.indicatorStyle.width = this.width + "px", a = this.maxPosX + this.indicatorWidth - this.width) : a = this.maxBoundaryX : "scale" == this.options.shrink && this.width != this.indicatorWidth && (this.width = this.indicatorWidth, this.indicatorStyle.width = this.width + "px"), d < this.minBoundaryY ? ("scale" == this.options.shrink && (this.height = b.max(this.indicatorHeight + 3 * d, 8), this.indicatorStyle.height = this.height + "px"), d = this.minBoundaryY) : d > this.maxBoundaryY ?
					"scale" == this.options.shrink ? (this.height = b.max(this.indicatorHeight - 3 * (d - this.maxPosY), 8), this.indicatorStyle.height = this.height + "px", d = this.maxPosY + this.indicatorHeight - this.height) : d = this.maxBoundaryY : "scale" == this.options.shrink && this.height != this.indicatorHeight && (this.height = this.indicatorHeight, this.indicatorStyle.height = this.height + "px"));
				this.x = a;
				this.y = d;
				this.scroller.options.useTransform ? this.indicatorStyle[e.style.transform] = "translate(" + a + "px," + d + "px)" + this.scroller.translateZ : (this.indicatorStyle.left =
					a + "px", this.indicatorStyle.top = d + "px")
			},
			_pos: function (a, d) {
				0 > a ? a = 0 : a > this.maxPosX && (a = this.maxPosX);
				0 > d ? d = 0 : d > this.maxPosY && (d = this.maxPosY);
				a = this.options.listenX ? b.round(a / this.sizeRatioX) : this.scroller.x;
				d = this.options.listenY ? b.round(d / this.sizeRatioY) : this.scroller.y;
				this.scroller.scrollTo(a, d)
			},
			fade: function (a, b) {
				if (!b || this.visible) clearTimeout(this.fadeTimeout), this.fadeTimeout = null, b = a ? 0 : 300, this.wrapperStyle[e.style.transitionDuration] = (a ? 250 : 500) + "ms", this.fadeTimeout = setTimeout(function (a) {
					this.wrapperStyle.opacity =
						a;
					this.visible = +a
				}.bind(this, a ? "1" : "0"), b)
			}
		};
		d.utils = e;
		return d
	}(window, document, Math);
	iosSelectUtil = {
		isArray: function (a) {
			return "[object Array]" === Object.prototype.toString.call(a)
		},
		isFunction: function (a) {
			return "function" === typeof a
		},
		attrToData: function (a, h) {
			var b = {},
				d;
			for (d in a.dataset) b[d] = a.dataset[d];
			b.dom = a;
			b.atindex = h;
			return b
		},
		attrToHtml: function (a) {
			var h = "",
				b;
			for (b in a) h += "data-" + b + '="' + a[b] + '"';
			return h
		}
	};
	r.prototype = {
		init: function () {
			this.layer_el.innerHTML = this.html;
			this.opts.container &&
				document.querySelector(this.opts.container) ? document.querySelector(this.opts.container).appendChild(this.el) : document.body.appendChild(this.el);
			this.el.appendChild(this.layer_el);
			this.el.style.height = Math.max(document.documentElement.getBoundingClientRect().height, window.innerHeight);
			this.opts.className && (this.el.className += " " + this.opts.className);
			this.bindEvent()
		},
		bindEvent: function () {
			for (var a = this.el.querySelectorAll(".sure"), h = this.el.querySelectorAll(".close"), b = this, d = 0, g = a.length; d < g; d++) a[d].addEventListener("click",
				function (a) {
					$("body").off("touchmove");
					b.close()
				});
			d = 0;
			for (g = h.length; d < g; d++) h[d].addEventListener("click", function (a) {
				$("body").off("touchmove");
				b.close()
			})
		},
		close: function () {
			this.el && (this.el.parentNode.removeChild(this.el), this.el = null)
		}
	};
	t.prototype = {
		init: function () {
			this.initLayer();
			this.selectOneObj = {};
			this.selectTwoObj = {};
			this.selectThreeObj = {};
			this.selectFourObj = {};
			this.selectFiveObj = {};
			this.setOneLevel(this.options.oneLevelId, this.options.twoLevelId, this.options.threeLevelId, this.options.fourLevelId,
				this.options.fiveLevelId)
		},
		initLayer: function () {
			var a = this,
				h = ['<header style="height: ' + this.options.headerHeight + this.options.cssUnit + "; line-height: " + this.options.headerHeight + this.options.cssUnit + '" class="iosselect-header">', '<h2 id="iosSelectTitle"></h2>', '<a style="height: ' + this.options.headerHeight + this.options.cssUnit + "; line-height: " + this.options.headerHeight + this.options.cssUnit + '" href="javascript:void(0)" class="close">\u53d6\u6d88</a>', '<a style="height: ' + this.options.headerHeight +
this.options.cssUnit + "; line-height: " + this.options.headerHeight + this.options.cssUnit + '" href="javascript:void(0)" class="sure">\u5b8c\u6210</a>', '</header>\r\n<section class="iosselect-box">\r\n<div class="one-level-contain" id="oneLevelContain">\r\n<ul class="select-one-level">\r\n</ul>\r\n</div>\r\n<div class="two-level-contain" id="twoLevelContain">\r\n<ul class="select-two-level">\r\n</ul>\r\n</div>\r\n<div class="three-level-contain" id="threeLevelContain">\r\n<ul class="select-three-level">\r\n</ul>\r\n</div>\r\n<div class="four-level-contain" id="fourLevelContain">\r\n<ul class="select-four-level">\r\n</ul>\r\n</div>\r\n<div class="five-level-contain" id="fiveLevelContain">\r\n<ul class="select-five-level">\r\n</ul>\r\n</div>\r\n</section>\r\n<hr class="cover-area1"/>\r\n<hr class="cover-area2"/>\r\n<div class="ios-select-loading-box" id="iosSelectLoadingBox">\r\n<div class="ios-select-loading"></div>\r\n</div>'].join("\r\n");
			this.iosSelectLayer = new r(h, {
				className: "ios-select-widget-box " + this.typeBox + (this.options.addClassName ? " " + this.options.addClassName : ""),
				container: this.options.container || ""
			});
			this.iosSelectTitleDom = this.iosSelectLayer.el.querySelector("#iosSelectTitle");
			this.iosSelectLoadingBoxDom = this.iosSelectLayer.el.querySelector("#iosSelectLoadingBox");
			this.options.title && (this.iosSelectTitleDom.innerHTML = this.options.title);
			this.options.headerHeight && this.options.itemHeight && (this.coverArea1Dom = this.iosSelectLayer.el.querySelector(".cover-area1"),
				this.coverArea1Dom.style.top = this.options.headerHeight + this.options.itemHeight * this.options.coverArea1Top + this.options.cssUnit, this.coverArea2Dom = this.iosSelectLayer.el.querySelector(".cover-area2"), this.coverArea2Dom.style.top = this.options.headerHeight + this.options.itemHeight * this.options.coverArea2Top + this.options.cssUnit);
			this.oneLevelContainDom = this.iosSelectLayer.el.querySelector("#oneLevelContain");
			this.twoLevelContainDom = this.iosSelectLayer.el.querySelector("#twoLevelContain");
			this.threeLevelContainDom =
				this.iosSelectLayer.el.querySelector("#threeLevelContain");
			this.fourLevelContainDom = this.iosSelectLayer.el.querySelector("#fourLevelContain");
			this.fiveLevelContainDom = this.iosSelectLayer.el.querySelector("#fiveLevelContain");
			this.oneLevelUlContainDom = this.iosSelectLayer.el.querySelector(".select-one-level");
			this.twoLevelUlContainDom = this.iosSelectLayer.el.querySelector(".select-two-level");
			this.threeLevelUlContainDom = this.iosSelectLayer.el.querySelector(".select-three-level");
			this.fourLevelUlContainDom =
				this.iosSelectLayer.el.querySelector(".select-four-level");
			this.fiveLevelUlContainDom = this.iosSelectLayer.el.querySelector(".select-five-level");
			this.iosSelectLayer.el.querySelector(".layer").style.height = "258" + this.options.cssUnit;
			this.oneLevelContainDom.style.height = this.options.itemHeight * this.options.itemShowCount + this.options.cssUnit;
			this.offsetTop = document.body.scrollTop;
			document.body.classList.add("ios-select-body-class");
			window.scrollTo(0, 0);
			this.scrollOne = new q("#oneLevelContain", {
				probeType: 3,
				bounce: !1,
        click:true
			});
			this.scrollOne.on("scrollStart", function () {
				Array.prototype.slice.call(a.oneLevelContainDom.querySelectorAll("li")).forEach(function (a, d, g) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				})
			});
			this.scrollOne.on("scroll", function () {
				var b = 1,
					b = Math.round(Math.abs(this.y / a.baseSize) / a.options.itemHeight) + 1;
				Array.prototype.slice.call(a.oneLevelContainDom.querySelectorAll("li")).forEach(function (a,
					b, f) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				});
				a.changeClassName(a.oneLevelContainDom, b)
			});
			this.scrollOne.on("scrollEnd", function () {
				var b = Math.abs(this.y / a.baseSize) / a.options.itemHeight,
					d = 1,
					g = 0;
				Math.ceil(b) === Math.round(b) ? (g = Math.ceil(b) * a.options.itemHeight * a.baseSize, d = Math.ceil(b) + 1) : (g = Math.floor(b) * a.options.itemHeight * a.baseSize, d = Math.floor(b) + 1);
				a.scrollOne.scrollTo(0, -g, 0);
				Array.prototype.slice.call(a.oneLevelContainDom.querySelectorAll("li")).forEach(function (a, b, d) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				});
				b = a.changeClassName(a.oneLevelContainDom, d);
				a.selectOneObj = iosSelectUtil.attrToData(b, d);
				1 < a.level && 1 === a.options.oneTwoRelation && a.setTwoLevel(a.selectOneObj.id, a.selectTwoObj.id, a.selectThreeObj.id, a.selectFourObj.id, a.selectFiveObj.id)
			});
			this.scrollOne.on("scrollCancel", function () {
				var b = Math.abs(this.y / a.baseSize) / a.options.itemHeight,
					d = 1,
					g = 0;
				Math.ceil(b) === Math.round(b) ? (g = Math.ceil(b) * a.options.itemHeight * a.baseSize, d = Math.ceil(b) + 1) : (g = Math.floor(b) * a.options.itemHeight * a.baseSize, d = Math.floor(b) + 1);
				a.scrollOne.scrollTo(0, -g, 0);
				Array.prototype.slice.call(a.oneLevelContainDom.querySelectorAll("li")).forEach(function (a, b, d) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") :
						a.classList.contains("side2") && a.classList.remove("side2")
				});
				b = a.changeClassName(a.oneLevelContainDom, d);
				a.selectOneObj = iosSelectUtil.attrToData(b, d);
				1 < a.level && 1 === a.options.oneTwoRelation && a.setTwoLevel(a.selectOneObj.id, a.selectTwoObj.id, a.selectThreeObj.id, a.selectFourObj.id, a.selectFiveObj.id)
			});
			2 <= this.level && (this.twoLevelContainDom.style.height = this.options.itemHeight * this.options.itemShowCount + this.options.cssUnit, this.scrollTwo = new q("#twoLevelContain", {
				probeType: 3,
				bounce: !1,
        click:true
			}), this.scrollTwo.on("scrollStart",
				function () {
					Array.prototype.slice.call(a.twoLevelContainDom.querySelectorAll("li")).forEach(function (a, d, g) {
						a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
					})
				}), this.scrollTwo.on("scroll", function () {
				var b = 0,
					b = Math.round(Math.abs(this.y / a.baseSize) / a.options.itemHeight) + 1;
				Array.prototype.slice.call(a.twoLevelContainDom.querySelectorAll("li")).forEach(function (a, b, f) {
					a.classList.contains("at") ?
						a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				});
				a.changeClassName(a.twoLevelContainDom, b)
			}), this.scrollTwo.on("scrollEnd", function () {
				var b = Math.abs(this.y / a.baseSize) / a.options.itemHeight,
					d = 1,
					g = 0;
				Math.ceil(b) === Math.round(b) ? (g = Math.ceil(b) * a.options.itemHeight * a.baseSize, d = Math.ceil(b) + 1) : (g = Math.floor(b) * a.options.itemHeight * a.baseSize, d = Math.floor(b) + 1);
				a.scrollTwo.scrollTo(0, -g, 0);
				Array.prototype.slice.call(a.twoLevelContainDom.querySelectorAll("li")).forEach(function (a,
					b, d) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				});
				b = a.changeClassName(a.twoLevelContainDom, d);
				a.selectTwoObj = iosSelectUtil.attrToData(b, d);
				2 < a.level && 1 === a.options.twoThreeRelation && a.setThreeLevel(a.selectOneObj.id, a.selectTwoObj.id, a.selectThreeObj.id, a.selectFourObj.id, a.selectFiveObj.id)
			}), this.scrollTwo.on("scrollCancel", function () {
				var b = Math.abs(this.y / a.baseSize) / a.options.itemHeight,
					d = 1,
					g = 0;
				Math.ceil(b) === Math.round(b) ? (g = Math.ceil(b) * a.options.itemHeight * a.baseSize, d = Math.ceil(b) + 1) : (g = Math.floor(b) * a.options.itemHeight * a.baseSize, d = Math.floor(b) + 1);
				a.scrollTwo.scrollTo(0, -g, 0);
				Array.prototype.slice.call(a.twoLevelContainDom.querySelectorAll("li")).forEach(function (a, b, d) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				});
				b = a.changeClassName(a.twoLevelContainDom,
					d);
				a.selectTwoObj = iosSelectUtil.attrToData(b, d);
				2 < a.level && 1 === a.options.twoThreeRelation && a.setThreeLevel(a.selectOneObj.id, a.selectTwoObj.id, a.selectThreeObj.id, a.selectFourObj.id, a.selectFiveObj.id)
			}));
			3 <= this.level && (this.threeLevelContainDom.style.height = this.options.itemHeight * this.options.itemShowCount + this.options.cssUnit, this.scrollThree = new q("#threeLevelContain", {
				probeType: 3,
				bounce: !1,
        click:true
			}), this.scrollThree.on("scrollStart", function () {
				Array.prototype.slice.call(a.threeLevelContainDom.querySelectorAll("li")).forEach(function (a,
					d, g) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				})
			}), this.scrollThree.on("scroll", function () {
				var b = 0,
					b = Math.round(Math.abs(this.y / a.baseSize) / a.options.itemHeight) + 1;
				Array.prototype.slice.call(a.threeLevelContainDom.querySelectorAll("li")).forEach(function (a, b, f) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") &&
						a.classList.remove("side2")
				});
				a.changeClassName(a.threeLevelContainDom, b)
			}), this.scrollThree.on("scrollEnd", function () {
				var b = Math.abs(this.y / a.baseSize) / a.options.itemHeight,
					d = 1,
					g = 0;
				Math.ceil(b) === Math.round(b) ? (g = Math.ceil(b) * a.options.itemHeight * a.baseSize, d = Math.ceil(b) + 1) : (g = Math.floor(b) * a.options.itemHeight * a.baseSize, d = Math.floor(b) + 1);
				a.scrollThree.scrollTo(0, -g, 0);
				Array.prototype.slice.call(a.threeLevelContainDom.querySelectorAll("li")).forEach(function (a, b, d) {
					a.classList.contains("at") ?
						a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				});
				b = a.changeClassName(a.threeLevelContainDom, d);
				a.selectThreeObj = iosSelectUtil.attrToData(b, d);
				4 <= a.level && 1 === a.options.threeFourRelation && a.setFourLevel(a.selectOneObj.id, a.selectTwoObj.id, a.selectThreeObj.id, a.selectFourObj.id, a.selectFiveObj.id)
			}), this.scrollThree.on("scrollCancel", function () {
				var b = Math.abs(this.y / a.baseSize) / a.options.itemHeight,
					d = 1,
					g =
					0;
				Math.ceil(b) === Math.round(b) ? (g = Math.ceil(b) * a.options.itemHeight * a.baseSize, d = Math.ceil(b) + 1) : (g = Math.floor(b) * a.options.itemHeight * a.baseSize, d = Math.floor(b) + 1);
				a.scrollThree.scrollTo(0, -g, 0);
				Array.prototype.slice.call(a.threeLevelContainDom.querySelectorAll("li")).forEach(function (a, b, d) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				});
				b = a.changeClassName(a.threeLevelContainDom,
					d);
				a.selectThreeObj = iosSelectUtil.attrToData(b, d);
				4 <= a.level && 1 === a.options.threeFourRelation && a.setFourLevel(a.selectOneObj.id, a.selectTwoObj.id, a.selectThreeObj.id, a.selectFourObj.id, a.selectFiveObj.id)
			}));
			4 <= this.level && (this.fourLevelContainDom.style.height = this.options.itemHeight * this.options.itemShowCount + this.options.cssUnit, this.scrollFour = new q("#fourLevelContain", {
				probeType: 3,
				bounce: !1,
        click:true
			}), this.scrollFour.on("scrollStart", function () {
				Array.prototype.slice.call(a.fourLevelContainDom.querySelectorAll("li")).forEach(function (a,
					d, g) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				})
			}), this.scrollFour.on("scroll", function () {
				var b = 0,
					b = Math.round(Math.abs(this.y / a.baseSize) / a.options.itemHeight) + 1;
				Array.prototype.slice.call(a.fourLevelContainDom.querySelectorAll("li")).forEach(function (a, b, f) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") &&
						a.classList.remove("side2")
				});
				a.changeClassName(a.fourLevelContainDom, b)
			}), this.scrollFour.on("scrollEnd", function () {
				var b = Math.abs(this.y / a.baseSize) / a.options.itemHeight,
					d = 1,
					g = 0;
				Math.ceil(b) === Math.round(b) ? (g = Math.ceil(b) * a.options.itemHeight * a.baseSize, d = Math.ceil(b) + 1) : (g = Math.floor(b) * a.options.itemHeight * a.baseSize, d = Math.floor(b) + 1);
				a.scrollFour.scrollTo(0, -g, 0);
				Array.prototype.slice.call(a.fourLevelContainDom.querySelectorAll("li")).forEach(function (a, b, d) {
					a.classList.contains("at") ? a.classList.remove("at") :
						a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				});
				b = a.changeClassName(a.fourLevelContainDom, d);
				a.selectFourObj = iosSelectUtil.attrToData(b, d);
				5 <= a.level && 1 === a.options.fourFiveRelation && a.setFiveLevel(a.selectOneObj.id, a.selectTwoObj.id, a.selectThreeObj.id, a.selectFourObj.id, a.selectFiveObj.id)
			}), this.scrollFour.on("scrollCancel", function () {
				var b = Math.abs(this.y / a.baseSize) / a.options.itemHeight,
					d = 1,
					g = 0;
				Math.ceil(b) === Math.round(b) ?
					(g = Math.ceil(b) * a.options.itemHeight * a.baseSize, d = Math.ceil(b) + 1) : (g = Math.floor(b) * a.options.itemHeight * a.baseSize, d = Math.floor(b) + 1);
				a.scrollFour.scrollTo(0, -g, 0);
				Array.prototype.slice.call(a.fourLevelContainDom.querySelectorAll("li")).forEach(function (a, b, d) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				});
				b = a.changeClassName(a.fourLevelContainDom, d);
				a.selectFourObj = iosSelectUtil.attrToData(b,
					d);
				5 <= a.level && 1 === a.options.fourFiveRelation && a.setFiveLevel(a.selectOneObj.id, a.selectTwoObj.id, a.selectThreeObj.id, a.selectFourObj.id, a.selectFiveObj.id)
			}));
			5 <= this.level && (this.fiveLevelContainDom.style.height = this.options.itemHeight * this.options.itemShowCount + this.options.cssUnit, this.scrollFive = new q("#fiveLevelContain", {
				probeType: 3,
				bounce: !1,
        click:true
			}), this.scrollFive.on("scrollStart", function () {
				Array.prototype.slice.call(a.fiveLevelContainDom.querySelectorAll("li")).forEach(function (a, d, g) {
					a.classList.contains("at") ?
						a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				})
			}), this.scrollFive.on("scroll", function () {
				var b = 0,
					b = Math.round(Math.abs(this.y / a.baseSize) / a.options.itemHeight) + 1;
				Array.prototype.slice.call(a.fiveLevelContainDom.querySelectorAll("li")).forEach(function (a, b, f) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				});
				a.changeClassName(a.fiveLevelContainDom, b)
			}), this.scrollFive.on("scrollEnd", function () {
				var b = Math.abs(this.y / a.baseSize) / a.options.itemHeight,
					d = 1,
					g = 0;
				Math.ceil(b) === Math.round(b) ? (g = Math.ceil(b) * a.options.itemHeight * a.baseSize, d = Math.ceil(b) + 1) : (g = Math.floor(b) * a.options.itemHeight * a.baseSize, d = Math.floor(b) + 1);
				a.scrollFive.scrollTo(0, -g, 0);
				Array.prototype.slice.call(a.fiveLevelContainDom.querySelectorAll("li")).forEach(function (a, b, d) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ?
						a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				});
				b = a.changeClassName(a.fiveLevelContainDom, d);
				a.selectFiveObj = iosSelectUtil.attrToData(b, d)
			}), this.scrollFive.on("scrollCancel", function () {
				var b = Math.abs(this.y / a.baseSize) / a.options.itemHeight,
					d = 1,
					g = 0;
				Math.ceil(b) === Math.round(b) ? (g = Math.ceil(b) * a.options.itemHeight * a.baseSize, d = Math.ceil(b) + 1) : (g = Math.floor(b) * a.options.itemHeight * a.baseSize, d = Math.floor(b) + 1);
				a.scrollFive.scrollTo(0, -g, 0);
				Array.prototype.slice.call(a.fiveLevelContainDom.querySelectorAll("li")).forEach(function (a,
					b, d) {
					a.classList.contains("at") ? a.classList.remove("at") : a.classList.contains("side1") ? a.classList.remove("side1") : a.classList.contains("side2") && a.classList.remove("side2")
				});
				b = a.changeClassName(a.fiveLevelContainDom, d);
				a.selectFiveObj = iosSelectUtil.attrToData(b, d)
			}));
			this.closeBtnDom = this.iosSelectLayer.el.querySelector(".close");
			this.closeBtnDom.addEventListener("click", function (b) {
				document.body.classList.contains("ios-select-body-class") && document.body.classList.remove("ios-select-body-class");
				window.scrollTo(0, a.offsetTop)
			});
			this.selectBtnDom = this.iosSelectLayer.el.querySelector(".sure");
			this.selectBtnDom.addEventListener("click", function (b) {
				document.body.classList.contains("ios-select-body-class") && document.body.classList.remove("ios-select-body-class");
				window.scrollTo(0, a.offsetTop);
				a.callback && a.callback(a.selectOneObj, a.selectTwoObj, a.selectThreeObj, a.selectFourObj, a.selectFiveObj)
			})
		},
		loadingShow: function () {
			this.options.showLoading && (this.iosSelectLoadingBoxDom.style.display = "block")
		},
		loadingHide: function () {
			this.iosSelectLoadingBoxDom.style.display = "none"
		},
		getOneLevel: function () {
			return this.data[0]
		},
		setOneLevel: function (a, h, b, d, g) {
			if (iosSelectUtil.isArray(this.data[0])) {
				var f = this.getOneLevel();
				this.renderOneLevel(a, h, b, d, g, f)
			} else if (iosSelectUtil.isFunction(this.data[0])) this.loadingShow(), this.data[0](function (f) {
				this.loadingHide();
				this.renderOneLevel(a, h, b, d, g, f)
			}.bind(this));
			else throw Error("data format error");
		},
		renderOneLevel: function (a, h, b, d, g, f) {
			f.some(function (b, d, e) {
				return b.id ==
					a
			}) || (a = f[0].id);
			var l = "",
				e = 0,
				l = l + this.getWhiteItem();
			f.forEach(function (b, d, f) {
				b.id == a ? (l += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';" ' + iosSelectUtil.attrToHtml(b) + ' class="at">' + b.value + "</li>", e = d + 1) : l += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + iosSelectUtil.attrToHtml(b) + ">" + b.value + "</li>"
			}.bind(this));
			l += this.getWhiteItem();
			this.oneLevelUlContainDom.innerHTML = l;
			this.scrollOne.refresh();
			this.scrollOne.scrollToElement("li:nth-child(" + e + ")", 0);
			2 <= this.level && this.setTwoLevel(a, h, b, d, g);
			h = this.changeClassName(this.oneLevelContainDom, e);
			this.selectOneObj = iosSelectUtil.attrToData(h, this.getAtIndexByPlast(e))
		},
		getTwoLevel: function (a) {
			var h = [];
			1 === this.options.oneTwoRelation ? this.data[1].forEach(function (b, d, g) {
				b.parentId === a && h.push(b)
			}) : h = this.data[1];
			return h
		},
		setTwoLevel: function (a, h, b, d, g) {
			if (iosSelectUtil.isArray(this.data[1])) {
				var f =
					this.getTwoLevel(a);
				this.renderTwoLevel(a, h, b, d, g, f)
			} else if (iosSelectUtil.isFunction(this.data[1])) this.loadingShow(), this.data[1](a, function (f) {
				this.loadingHide();
				this.renderTwoLevel(a, h, b, d, g, f)
			}.bind(this));
			else throw Error("data format error");
		},
		renderTwoLevel: function (a, h, b, d, g, f) {
			var l = 0;
			f.some(function (a, b, d) {
				return a.id == h
			}) || (h = f[0].id);
			var e = "",
				e = e + this.getWhiteItem();
			f.forEach(function (a, b, d) {
				a.id == h ? (e += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " +
					this.options.itemHeight + this.options.cssUnit + ';"' + iosSelectUtil.attrToHtml(a) + ' class="at">' + a.value + "</li>", l = b + 1) : e += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + iosSelectUtil.attrToHtml(a) + ">" + a.value + "</li>"
			}.bind(this));
			e += this.getWhiteItem();
			this.twoLevelUlContainDom.innerHTML = e;
			this.scrollTwo.refresh();
			this.scrollTwo.scrollToElement(":nth-child(" + l + ")", 0);
			3 <= this.level && this.setThreeLevel(a, h, b, d, g);
			a =
				this.changeClassName(this.twoLevelContainDom, l);
			this.selectTwoObj = iosSelectUtil.attrToData(a, this.getAtIndexByPlast(l))
		},
		getThreeLevel: function (a, h) {
			var b = [];
			1 === this.options.twoThreeRelation ? this.data[2].forEach(function (a, g, f) {
				a.parentId === h && b.push(a)
			}) : b = this.data[2];
			return b
		},
		setThreeLevel: function (a, h, b, d, g) {
			if (iosSelectUtil.isArray(this.data[2])) {
				var f = this.getThreeLevel(a, h);
				this.renderThreeLevel(a, h, b, d, g, f)
			} else if (iosSelectUtil.isFunction(this.data[2])) this.loadingShow(), this.data[2](a,
				h,
				function (f) {
					this.loadingHide();
					this.renderThreeLevel(a, h, b, d, g, f)
				}.bind(this));
			else throw Error("data format error");
		},
		renderThreeLevel: function (a, h, b, d, g, f) {
			var l = 0;
			f.some(function (a, d, e) {
				return a.id == b
			}) || (b = f[0].id);
			var e = "",
				e = e + this.getWhiteItem();
			f.forEach(function (a, d, f) {
				a.id == b ? (e += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + iosSelectUtil.attrToHtml(a) + ' class="at">' + a.value + "</li>", l = d + 1) : e += '<li style="height: ' +
					this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + iosSelectUtil.attrToHtml(a) + ">" + a.value + "</li>"
			}.bind(this));
			e += this.getWhiteItem();
			this.threeLevelUlContainDom.innerHTML = e;
			this.scrollThree.refresh();
			this.scrollThree.scrollToElement(":nth-child(" + l + ")", 0);
			4 <= this.level && this.setFourLevel(a, h, b, d, g);
			a = this.changeClassName(this.threeLevelContainDom, l);
			this.selectThreeObj = iosSelectUtil.attrToData(a, this.getAtIndexByPlast(l))
		},
		getFourLevel: function (a,
			h, b) {
			var d = [];
			1 === this.options.threeFourRelation ? this.data[3].forEach(function (a, f, h) {
				a.parentId === b && d.push(a)
			}) : d = this.data[3];
			return d
		},
		setFourLevel: function (a, h, b, d, g) {
			if (iosSelectUtil.isArray(this.data[3])) {
				var f = this.getFourLevel(a, h, b);
				this.renderFourLevel(a, h, b, d, g, f)
			} else if (iosSelectUtil.isFunction(this.data[3])) this.loadingShow(), this.data[3](a, h, b, function (f) {
				this.loadingHide();
				this.renderFourLevel(a, h, b, d, g, f)
			}.bind(this));
			else throw Error("data format error");
		},
		renderFourLevel: function (a,
			h, b, d, g, f) {
			var l = 0;
			f.some(function (a, b, e) {
				return a.id == d
			}) || (d = f[0].id);
			var e = "",
				e = e + this.getWhiteItem();
			f.forEach(function (a, b, f) {
				a.id == d ? (e += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + iosSelectUtil.attrToHtml(a) + ' class="at">' + a.value + "</li>", l = b + 1) : e += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + iosSelectUtil.attrToHtml(a) +
					">" + a.value + "</li>"
			}.bind(this));
			e += this.getWhiteItem();
			this.fourLevelUlContainDom.innerHTML = e;
			this.scrollFour.refresh();
			this.scrollFour.scrollToElement(":nth-child(" + l + ")", 0);
			5 <= this.level && this.setFiveLevel(a, h, b, d, g);
			a = this.changeClassName(this.fourLevelContainDom, l);
			this.selectFourObj = iosSelectUtil.attrToData(a, this.getAtIndexByPlast(l))
		},
		getFiveLevel: function (a, h, b, d) {
			var g = [];
			1 === this.options.fourFiveRelation ? this.data[4].forEach(function (a, b, e) {
				a.parentId === d && g.push(a)
			}) : g = this.data[4];
			return g
		},
		setFiveLevel: function (a, h, b, d, g) {
			if (iosSelectUtil.isArray(this.data[4])) {
				var f = this.getFiveLevel(a, h, b, d);
				this.renderFiveLevel(a, h, b, d, g, f)
			} else if (iosSelectUtil.isFunction(this.data[4])) this.loadingShow(), this.data[4](a, h, b, d, function (f) {
				this.loadingHide();
				this.renderFiveLevel(a, h, b, d, g, f)
			}.bind(this));
			else throw Error("data format error");
		},
		renderFiveLevel: function (a, h, b, d, g, f) {
			var l = 0;
			f.some(function (a, b, d) {
				return a.id == g
			}) || (g = f[0].id);
			var e = "",
				e = e + this.getWhiteItem();
			f.forEach(function (a, b, d) {
				a.id ==
					g ? (e += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + iosSelectUtil.attrToHtml(a) + ' class="at">' + a.value + "</li>", l = b + 1) : e += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + ';"' + iosSelectUtil.attrToHtml(a) + ">" + a.value + "</li>"
			}.bind(this));
			e += this.getWhiteItem();
			this.fiveLevelUlContainDom.innerHTML = e;
			this.scrollFive.refresh();
			this.scrollFive.scrollToElement(":nth-child(" +
				l + ")", 0);
			a = this.changeClassName(this.fiveLevelContainDom, l);
			this.selectFiveObj = iosSelectUtil.attrToData(a, this.getAtIndexByPlast(l))
		},
		getWhiteItem: function () {
			var a;
			a = "" + ('<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + '"></li>');
			3 < this.options.itemShowCount && (a += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + '"></li>');
			5 < this.options.itemShowCount &&
				(a += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + '"></li>');
			7 < this.options.itemShowCount && (a += '<li style="height: ' + this.options.itemHeight + this.options.cssUnit + "; line-height: " + this.options.itemHeight + this.options.cssUnit + '"></li>');
			return a
		},
		changeClassName: function (a, h) {
			var b;
			3 === this.options.itemShowCount ? (b = a.querySelector("li:nth-child(" + (h + 1) + ")"), b.classList.add("at")) : 5 === this.options.itemShowCount ? (b = a.querySelector("li:nth-child(" +
				(h + 2) + ")"), b.classList.add("at"), a.querySelector("li:nth-child(" + (h + 1) + ")").classList.add("side1"), a.querySelector("li:nth-child(" + (h + 3) + ")").classList.add("side1")) : 7 === this.options.itemShowCount ? (b = a.querySelector("li:nth-child(" + (h + 3) + ")"), b.classList.add("at"), a.querySelector("li:nth-child(" + (h + 2) + ")").classList.add("side1"), a.querySelector("li:nth-child(" + (h + 1) + ")").classList.add("side2"), a.querySelector("li:nth-child(" + (h + 4) + ")").classList.add("side1"), a.querySelector("li:nth-child(" + (h + 5) +
				")").classList.add("side2")) : 9 === this.options.itemShowCount && (b = a.querySelector("li:nth-child(" + (h + 4) + ")"), b.classList.add("at"), a.querySelector("li:nth-child(" + (h + 3) + ")").classList.add("side1"), a.querySelector("li:nth-child(" + (h + 2) + ")").classList.add("side2"), a.querySelector("li:nth-child(" + (h + 5) + ")").classList.add("side1"), a.querySelector("li:nth-child(" + (h + 6) + ")").classList.add("side2"));
			return b
		},
		getAtIndexByPlast: function (a) {
			return a + Math.ceil(this.itemShowCount / 2)
		},
		setBase: function () {
			if ("rem" ===
				this.options.cssUnit) {
				var a = window.getComputedStyle(document.documentElement, null).fontSize;
				try {
					this.baseSize = /\d+(?:\.\d+)?/.exec(a)[0]
				} catch (h) {
					this.baseSize = 1
				}
			} else this.baseSize = 1
		}
	};
	"undefined" != typeof module && module.exports ? module.exports = t : "function" == typeof define && define.amd ? define(function () {
		return t
	}) : window.IosSelect = t
})();
