

String.prototype.trim=function(){return this.replace(/(^\s+)|(\s+$)/g,'')};

function isRomam(str){
       if(isBlank(str)){
               return false;
       }
     else {
          return "I,II,III,IV,V,VI,VII,VIII,IX,X,XI,XII,Ⅰ,Ⅱ,Ⅲ,Ⅳ,Ⅴ,Ⅵ,Ⅶ,Ⅷ,Ⅸ,Ⅹ,Ⅺ,Ⅻ".indexOf(str) != -1;
     }
 }
 // 返回 boolean  类型
 // 传入 string  类型
 function isChinese(name) {
       if (isBlank(name))
           return false;
       else {
           var reg = /[\u4e00-\u9fa5]/;
           console.log("isChinese  "+reg.test(name.trim()));
           return reg.test(name.trim());
       }
   }
   // 返回 boolean  类型
   // 传入 string  类型
function  isBlank(str) {
      var strLen = str.length;
    if (str == null || str.length== 0) {
              console.log("isBlank "+"true");
              return true;
          }
          return false;
         //  for (var i = 0; i < strLen; i++) {
         //      if ((Character.isWhitespace(str.charAt(i)) == false)) {
         //          return false;
         //      }
         //  }
         //  return true;
    }

     /**
     *  @param sensitiveData
     *          原数据
     *  @param frontCharNum
     *           展示前几位
     *  @param tailCharNum
     *         展示后几位
     *   @param hiddenCharNum
     *          展示星号*的个数
     *  @return 部分隐藏的敏感数据字符串
     */
   function customizeHide(sensitiveData,frontCharNum,tailCharNum,hiddenCharNum) {
       if (isBlank(sensitiveData)) {
           return sensitiveData;
       }
       var tmp = sensitiveData.trim();
       var length = tmp.length;
       // 合法性检查，如果参数不合法，返回源数据内容
       if (frontCharNum < 0 || tailCharNum < 0 || hiddenCharNum < 0 || frontCharNum + tailCharNum > length) {
            return tmp;
       }

       var  beginIndex = frontCharNum - 1;
       var  endIndex = length - tailCharNum;

       // 原数据前半部分
       var  result = [];
       if (beginIndex >= 0 && beginIndex < length){
           result.push(tmp.substring(0, frontCharNum));
       }

       // 中间*
       for (var  i = 0; i < hiddenCharNum; i++){
          result.push('*');
       }
       // 原数据后半部分
       if (endIndex >= 0 && endIndex < length){
            result.push(tmp.substring(endIndex));
       }
       console.log("customizeHide result "+result);
       return result.join("");
   }



 function  nameHide(name){
       if (isBlank(name)){
          return name;
       }
       if (name.length== 1){
           return name;
       }
       if (isChinese(name)) {
           var frontCharNum = 0;
           var tailCharNum = 0;
           var hiddenCharNum = 0;
           if (name.length<= 3) {
               //姓名三个字以内隐藏姓
               tailCharNum = name.length- 1;
               hiddenCharNum = 1;
           } else if (name.length > 3 && name.length <= 6) {
               tailCharNum = 2;
               hiddenCharNum = name.length - 2;
           } else {
               frontCharNum = 1;
               tailCharNum = 2;
               hiddenCharNum = 3;
           }
           return customizeHide(name, frontCharNum, tailCharNum, hiddenCharNum);

       } else {
            console.log("name.trim() "+name.trim());
           //多个连续空格替换为一个
           var  sName = name.trim().replace("[' ']+/g", " ");
           var  names = sName.split(" ");
           var  sb = [];
           if (names.length == 1) {
                sb.push(name);
           } else {
               for (var i = 0; i < names.length; i++) {
                   if (i < names.length - 2) {
                       if (names[i].length != 0) {
                           sb.push(names[i].substring(0, 1));
                           sb.push(".");
                           sb.push(" ");
                        }
                   }else {
                       //如果Last name 后带〔Sr. 〕〔Jr. /Jun〕或 罗马数字 则照常显示
            if ("Sr.".toLowerCase() == names[names.length - 1].toLowerCase()|| "Jr.".toLowerCase() == names[names.length - 1].toLowerCase()||"Jun".toLowerCase() == names[names.length - 1].toLowerCase()|| isRomam(names[names.length - 1].toUpperCase())) {
                             sb.push(names[i]);
                             sb.push(" ");
                             sb.push(names[i + 1]);
                           // sb.append(names[i]).append(" ").append(names[i + 1]);
                       } else {
                           if (names[i].length!= 0) {
                             sb.push(names[i].substring(0, 1));
                             sb.push(".");
                             sb.push(" ");
                               // sb.append(names[i].substring(0, 1)).append(".").append(" ");
                           }
                           sb.push(names[i + 1]);
                       }
                       break;
                   }
               }
           }
           if (sb.length> 0) {
               var rStr = sb.join("");
               console.log("rStr "+rStr);
               //若英文脱敏后字符数超过15个字符，则展示为3个*加上最后10位字符
               if (rStr.length > 15) {
                   rStr = "***" + rStr.substring(rStr.length- 10, rStr.length);
               }
               return rStr;
           }
       }
       return name;
   }
