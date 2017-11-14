'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MARQUEE 3000 MARQUEE 3000 MARQUEE 3000 MARQUEE 3000 MARQUEE 3000
 * http://github.com/ezekielaquino/marquee3000
 * Marquees for the new millenium v1.0
 * MIT License
 */

;(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if ((typeof exports === 'undefined' ? 'undefined' : _typeof(exports)) === 'object') {
    module.exports = factory();
  } else {
    root.Marquee3k = factory();
  }
})(window, function () {
  'use strict';

  var Marquee3k = function () {
    function Marquee3k(element, options) {
      _classCallCheck(this, Marquee3k);

      this.element = element;
      this.selector = options.selector;
      this.speed = element.dataset.speed || 0.25;
      this.pausable = element.dataset.pausable;
      this.reverse = element.dataset.reverse;
      this.paused = false;
      this.parent = element.parentElement;
      this.parentProps = this.parent.getBoundingClientRect();
      this.content = element.children[0];
      this.innerContent = this.content.innerHTML;
      this.wrapStyles = '';
      this.offset = 0;

      this._setupWrapper();
      this._setupContent();
      this._setupEvents();

      this.wrapper.appendChild(this.content);
      this.element.appendChild(this.wrapper);
    }

    _createClass(Marquee3k, [{
      key: '_setupWrapper',
      value: function _setupWrapper() {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('marquee3k__wrapper');
        this.wrapper.style.whiteSpace = 'nowrap';
      }
    }, {
      key: '_setupContent',
      value: function _setupContent() {
        this.content.classList.add(this.selector + '__copy');
        this.content.style.display = 'inline-block';
        this.contentWidth = this.content.offsetWidth;

        this.requiredReps = this.contentWidth > this.parentProps.width ? 2 : Math.ceil((this.parentProps.width - this.contentWidth) / this.contentWidth) + 1;

        for (var i = 0; i < this.requiredReps; i++) {
          this._createClone();
        }

        if (this.reverse) {
          this.offset = this.contentWidth * -1;
        }

        this.element.classList.add('is-init');
      }
    }, {
      key: '_setupEvents',
      value: function _setupEvents() {
        var _this = this;

        this.element.addEventListener('mouseenter', function () {
          if (_this.pausable) _this.paused = true;
        });

        this.element.addEventListener('mouseleave', function () {
          if (_this.pausable) _this.paused = false;
        });
      }
    }, {
      key: '_createClone',
      value: function _createClone() {
        var clone = this.content.cloneNode(true);
        clone.style.display = 'inline-block';
        clone.classList.add(this.selector + '__copy');
        this.wrapper.appendChild(clone);
      }
    }, {
      key: 'animate',
      value: function animate() {
        if (!this.paused) {
          var isScrolled = this.reverse ? this.offset < 0 : this.offset > this.contentWidth * -1;
          var direction = this.reverse ? -1 : 1;
          var reset = this.reverse ? this.contentWidth * -1 : 0;

          if (isScrolled) this.offset -= this.speed * direction;else this.offset = reset;

          this.wrapper.style.whiteSpace = 'nowrap';
          this.wrapper.style.transform = 'translate(' + this.offset + 'px, 0) translateZ(0)';
        }
      }
    }, {
      key: '_refresh',
      value: function _refresh() {
        this.contentWidth = this.content.offsetWidth;
      }
    }, {
      key: 'repopulate',
      value: function repopulate(difference, isLarger) {
        this.contentWidth = this.content.offsetWidth;

        if (isLarger) {
          var amount = Math.ceil(difference / this.contentWidth) + 1;

          for (var i = 0; i < amount; i++) {
            this._createClone();
          }
        }
      }
    }], [{
      key: 'refresh',
      value: function refresh(index) {
        MARQUEES[index]._refresh();
      }
    }, {
      key: 'refreshAll',
      value: function refreshAll() {
        for (var i = 0; i < MARQUEES.length; i++) {
          MARQUEES[i]._refresh();
        }
      }
    }, {
      key: 'init',
      value: function init() {
        var _this2 = this;

        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { selector: 'marquee3k' };

        window.MARQUEES = [];
        var marquees = Array.from(document.querySelectorAll('.' + options.selector));
        var previousWidth = window.innerWidth;
        var timer = void 0;

        for (var i = 0; i < marquees.length; i++) {
          var marquee = marquees[i];
          var instance = new Marquee3k(marquee, options);
          MARQUEES.push(instance);
        }

        animate();

        function animate() {
          for (var _i = 0; _i < MARQUEES.length; _i++) {
            MARQUEES[_i].animate();
          }
          window.requestAnimationFrame(animate);
        }

        window.addEventListener('resize', function () {
          clearTimeout(timer);

          timer = setTimeout(function () {
            var isLarger = previousWidth < window.innerWidth;
            var difference = window.innerWidth - previousWidth;

            for (var _i2 = 0; _i2 < MARQUEES.length; _i2++) {
              MARQUEES[_i2].repopulate(difference, isLarger);
            }

            previousWidth = _this2.innerWidth;
          });
        }, 250);
      }
    }]);

    return Marquee3k;
  }();

  return Marquee3k;
});
