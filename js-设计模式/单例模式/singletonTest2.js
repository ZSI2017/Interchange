function Universe() {
    // 只在第一次的时候 缓存赋值
   var instance = this;

   this.start_time = 0;
   this.bang = "big";

    // 后面 new 实例的时候，就可以通过改变构造函数
   Universe = function() {
      return instance;
   };
}

var uni = new Universe();
var uni2 = new Universe();
uni.bang = "123";
console.log(uni === uni2);
console.log(uni2.bang);
