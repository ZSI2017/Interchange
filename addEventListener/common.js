window.onload = function() {
  var msgEmail = document.getElementById('msg-email'),
    msgContent = document.getElementById('msg-content'),
    msgBtn = document.getElementById('msg-btn'),
    mailWrap = document.getElementById('mail-wrap'),
    container = document.getElementById('container');

  //判断输入框是否为空
  var mailNull = false,
    contentNull = false;

  //先判断邮箱格式
  // msgEmail.addEventListener('blur',function() {
  //   //获取当前输入框的值
  //   var mailValue = msgEmail.value;
  //
  //   //创建一个用于显示邮箱格式的容器
  //   //如果不存在这个容器就创建一个
  //   if(!mailWrap.getElementsByTagName('span')[0]) {
  //     var ifPass = document.createElement('span');
  //     mailWrap.appendChild(ifPass);
  //   }
  //
  //   testMail(mailValue);
  // },false);

  //检验是否正确的邮箱格式
  // function testMail(mailStr) {
  //   //检验邮箱的正则表达式
  //   var pat = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  //
  //   if(!pat.test(mailStr)) {
  //     mailWrap.getElementsByTagName('span')[0].innerText = '格式不正确';
  //     mailWrap.getElementsByTagName('span')[0].style.color = 'red';
  //   } else {
  //     mailWrap.getElementsByTagName('span')[0].innerText = '格式正确';
  //     mailWrap.getElementsByTagName('span')[0].style.color = 'green';
  //     mailNull = true;
  //   }
  // }

  //保证留言不为空
  // msgContent.addEventListener('blur',function() {
  //   if(this.value == '' || this.value == null) {
  //     contentNull = false;
  //   } else {
  //     contentNull = true;
  //   }
  // },false);

  //留言按钮
  msgBtn.addEventListener('click',function(){
    //只要有一个标识符为false，按钮就不可用
    // if(mailNull == false || contentNull == false) {
    //   return;
    // }
    // console.log('不为空');
    var msgSuss = msgContent.value;

    //生成留言内容
    showMsg(msgSuss);
  },false);

  function showMsg(msg) {
    //创建一个用于显示所有留言的容器
    //如果不存在这个容器就创建一个
    if(!container.getElementsByTagName('ul')[0]) {
      var msgList = document.createElement('ul');
      container.appendChild(msgList);
      //删除留言
      msgList.addEventListener('click',function(event){
        var e = event || window.event;
        var target = e.target || e.srcElement;
        if(target.nodeName.toLowerCase() == 'a') {
          console.log(target.parentNode);
          msgList.removeChild(target.parentNode);
        }
      },false);
    }

    //每一条留言的容器
    var msgLi = document.createElement('li');
    msgLi.innerHTML =
      '<span>'+ msg +' </span>' +
      '<span> '+ new Date().toLocaleString() +'</span>' +
      '<a href="javascript:;"> 22删除</a>';

      //如果是第一个留言，直接appendChild，否则应当是在最前面添加
      var msgList = container.getElementsByTagName('ul')[0];
      if(msgList.getElementsByTagName('li')[0]) {
        msgList.insertBefore(msgLi,msgList.getElementsByTagName('li')[0]);
      } else {
        msgList.appendChild(msgLi);
      }



//       var delets = msgList.getElementsByTagName('a');
//       for(var i = 0; i < delets.length; i++) {
//         delets[i].onclick = function() {
//           msgList.removeChild(this.parentNode);
//         }
//       }
  }

}
