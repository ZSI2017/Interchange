function Universe() {
  var instance;

  Universe = function Universe() {
     return instance;
  }
    // 后期处理原型属性。
  Universe.prototype = this;
}
