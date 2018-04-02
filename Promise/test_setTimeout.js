let Promise = require('./myPromise')

let p = new Promise(function(resolve,reject){
  setTimeout(function(){
    resolve(1000)
  },3000)
})

p.then(function(data){
  console.log("成功",data)
},function(err){
  console.log("失败",err)
})
