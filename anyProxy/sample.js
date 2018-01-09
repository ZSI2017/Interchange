// var index_info = require("./index_info.js");
// var express_com_list_v2 = require("./express_com_list_v2.js");
var ep_index_index = require("./ep_order_index.js");
var fs = require('fs');
var path = require("path");
// var file = path.resolve('C:/Users/bangbangda/Desktop/express/expressTemp/sendex-client/src/index.html');
// var file = path.resolve('./index.html');
// var rs = fs.createReadStream(file);

module.exports = {
  summary: 'a rule to hack response',
  *beforeSendResponse(requestDetail, responseDetail) {
    var newResponseStr = "";
    if(requestDetail.url === 'https://sendex-sit.alipay-eco.com/api/ep/index_info'){
      newResponseStr = JSON.stringify(index_info)
    }else if(requestDetail.url === 'https://sendex-sit.alipay-eco.com/api/ep/express_com/list/v2'){
      newResponseStr = JSON.stringify(express_com_list_v2)
    }else if(requestDetail.url === 'https://sendex-sit.alipay-eco.com/api/ep/order/index'){
      newResponseStr = JSON.stringify(ep_index_index)
    }

    // if(requestDetail.url.indexOf('index.html') === 0){
    //   // console.log("[own log]["+ "]")
    //   // return new Promise((resolve,reject)=>{
    //   //   fs.readFile("C:/Users/bangbangda/Desktop/express/expressTemp/sendex-client/src/index.html",(err,data) =>{
    //   //     // var result=Buffer.concat(dataArr,len).toString();
    //   //          const newResponse = responseDetail.response;
    //   //          newResponse.body = data;
    //   //          resolve({ response: newResponse });
    //   //
    //   //   })
    //   // })
    //   //   rs.on('data',function(chunk){
    //   //     // console.log(Buffer.isBuffer(chunk));
    //   //     dataArr.push(chunk);
    //   //     len+=chunk.length;
    //   //     console.log("data------ "+len)
    //   //    });
    //   //   rs.on('end',() => {
    //   //       var result=Buffer.concat(dataArr,len).toString();
    //   //       const newResponse = responseDetail.response;
    //   //       newResponse.body = newResponseStr;
    //   //       resolve({ response: newResponse });
    //   //   });
    //   // })
    // }else {
      if (newResponseStr !== "") {
        const newResponse = responseDetail.response;
        newResponse.body = newResponseStr;

        return new Promise((resolve, reject) => {
          setTimeout(() => { // delay
            resolve({ response: newResponse });
          }, 1000);
        });
      }
    // }
  }
};
