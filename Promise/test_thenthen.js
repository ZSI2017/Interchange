let Promise = require('./myPromise2')

let p = new Promise(function(resolve,reject){
  setTimeout(function(){
    resolve(1000)
  },1000)
})

p.then(function(data){
  console.log("成功",data)
  return "from p1"
},function(err){
  console.log("失败",err)
}).then(function(data){
  console.log("成功1",data)
},function(err){
  console.log("失败1",err)
})
