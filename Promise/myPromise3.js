//  对于 Promise 链式调用的 容错处理
// myPromise
function Promise(executor){ //executor是一个执行器（函数）
    let _this = this // 先缓存this以免后面指针混乱
    _this.status = 'pending'  // 默认状态为等待态
    _this.value = undefined  // 成功时要传递给成功回调的数据，默认undefined
    _this.reason = undefined  // 失败时要传递给失败回调的原因，默认undefined
    _this.onResolvedCallbacks = []; // 存放then成功的回调
    _this.onRejectedCallbacks = []; // 存放then失败的回调

    function resolve(value) { // 内置一个resolve方法，接收成功状态数据
        // 上面说了，只有pending可以转为其他状态，所以这里要判断一下
        if (_this.status === 'pending') {
            _this.status = 'resolved' // 当调用resolve时要将状态改为成功态
            _this.value = value // 保存成功时传进来的数据
            _this.onResolvedCallbacks.forEach(function(fn){
              fn();
            })
        }
    }
    function reject(reason) { // 内置一个reject方法，失败状态时接收原因
        if (_this.status === 'pending') { // 和resolve同理
            _this.status = 'rejected' // 转为失败态
            _this.reason = reason // 保存失败原因
            _this.onRejectedCallbacks.forEach(function(fn){   // 当失败的函数被调用时，之前缓存的回调函数会被一一调用。
              fn();
            })
        }
    }
    try {
      executor(resolve, reject) // 执行执行器函数，并将两个方法传入
    } catch(e) {  // 在执行过程中发生异常，直接调用里面的reject();
      reject(e);
    }
}
// then方法接收两个参数，分别是成功和失败的回调，这里我们命名为onFulfilled和onRjected
Promise.prototype.then = function(onFulfilled, onRjected){
    // 修改 then; 返回一个promise2 新的promise
    onFulfilled = typeof onFulfilled = 'function'?onFulfilled : function(value){
      return value;
    };
    onRjected = typeof onRjected === 'function'?onRjected:function(err) {
      throw err;
    };
    let promise2;
    let _this = this;   // 依然缓存this
    if(_this.status === 'resolved'){  // 判断当前Promise的状态
          // 如果是成功态，当然是要执行用户传递的成功回调，并把数据传进去
        promise2 = new Promise(function(resolve,reject){
          try{
            let x = onFulfilled(_this.value);
            resolvePromise(promise2,x,resolve,reject);
          }catch(e) {
            reject(e)
          }
        })
    }
    if(_this.status === 'rejected'){ // 同理
       promise2 = new Promise(function(resolve,reject){
         try {
           let x = onRejected(_this.reason)
           resolvePromise(promise2,x,resolve,reject)
         }catch(e) {
           reject(e);
         }
       })
    }
    if(_this.status === "pending") {
      // 每一次then 时，如果是等待态，就把回调函数push 进数组中，什么时候改变状态什么时候再执行
      promise2 = new Promise(function(resolve,reject){
        _this.onResolvedCallbacks.push(function(){
          try {
            let x = onFulfilled(_this.value)
            resolvePromise(promise2,x,resolve,reject)
          }catch(e) {
            reject(e)
          }
        })
        _this.onRejectedCallbacks.push(function(){
          try {
            let x = onRejected(_this.reson)
            resolvePromise(promise2,x,resolve,reject)
          } catch(e) {
            reject(e)
          }
        })
      })
    }
    return promise2;
}

function resolvePromise(promise2, x, resolve, reject) {
    // 接受四个参数，新Promise、返回值，成功和失败的回调
    // 有可能这里返回的x是别人的promise
    // 尽可能允许其他乱写
    if (promise2 === x) { //这里应该报一个类型错误，来解决问题4
        return reject(new TypeError('循环引用了'))
    }
    // 看x是不是一个promise,promise应该是一个对象
    let called; // 表示是否调用过成功或者失败，用来解决问题7
    //下面判断上一次then返回的是普通值还是函数，来解决问题1、2
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        // 可能是promise {},看这个对象中是否有then方法，如果有then我就认为他是promise了
        try {
            let then = x.then;// 保存一下x的then方法
            if (typeof then === 'function') {
                // 成功
                //这里的y也是官方规范，如果还是promise，可以当下一次的x使用
                //用call方法修改指针为x，否则this指向window
                then.call(x, function (y) {
                    if (called) return //如果调用过就return掉
                    called = true
                    // y可能还是一个promise，在去解析直到返回的是一个普通值
                    resolvePromise(promise2, y, resolve, reject)//递归调用，解决了问题6
                }, function (err) { //失败
                    if (called) return
                    called = true
                    reject(err);
                })
            } else {
                resolve(x)
            }
        } catch (e) {
            if (called) return
            called = true;
            reject(e);
        }
    } else { // 说明是一个普通值1
        resolve(x); // 表示成功了
    }
}

Promise.deferred = function () {
  let dfd = {};
  dfd.promise = new Promise(function (resolve, reject) {
      dfd.resolve = resolve;
      dfd.reject = reject;
  });
  return dfd
}

module.exports = Promise  // 导出模块，否则别的文件没法使用
