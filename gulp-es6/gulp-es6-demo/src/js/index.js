Zepto(function ($) {
    // let obj1 = "xxxxxxqqqqqq";
    // let obj = `<p>这个<i></i>  写的一个实例，这个实例是为了写做 日期是 ${obj1} <p>`
    $(".am-page-result-button").on("click",()=>{
          console.log(obj);
    })
    //j只在这个for循环有效，如果在循环外调用就会报错
    for(let j=0;j<10;j++){
          console.log(j)
      }
      // console.log('最后的值：'+j)

      console.log("destructuring - destructuring - destructuring- destructuring");
      let destruct = {internalName:"test1",internalSex:"qqq"};
      let {internalName,internalSex} = destruct;
      console.log(internalName +"   "+internalSex);
      console.log("default - default - default - default - default - default - default");
      ((size=3,delimiter = "222delimiter111") => {
         console.log(size+"   "+delimiter);
      })();

      console.log("rest - rest - rest - rest - rest - rest - rest");
      function animals(first,...all){
          console.log(first)
          console.log(all)
          console.log(Object.prototype.toString.call(all))
       }
       animals('第一个', '第二个', '第三个')
       console.log("promise - promise - promise - promise - promise");
       function timeout(ms) {
         return new Promise((resolve,reject)=>{
             setTimeout(resolve,ms,'done');
         })
       }
       timeout(3000).then((value) => {
         console.log(value);
       })
       $.axs();
});
