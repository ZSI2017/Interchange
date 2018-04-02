let Promise = require('./myPromise')
let p = new Promise(function(resolve,reject){
  reject('test')
})

p.then(function(data){
  console.log("成功",data)
},function(err){
  console.log("失败",err)
})
