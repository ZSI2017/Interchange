  let Promise = require('./myPromise')  // 引入模块
  let p = new Promise(function(resolve, reject){
    resolve('test')
  })

  p.then(function(data){
    console.log('成功', data)
  },function(err){
    console.log('失败', err)
  })
