
function commonFun(){
   alert("from out Zepto()");
};
Zepto(function($) {
   	$.axs = function (url, data, successfn,errorfn) { alert("from common.js")}

})
