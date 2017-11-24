Zepto(function($){
  FastClick.attach(document.body);
  ant.call('setTitle', {
      title: '地址管理'
    });



    $(".tab-content-class").unbind().bind("click",function(event){
        var idx = $(this).index();
        if(!!idx) {
          $('.recipient-content-class').show();
          $('.sender-content-class').hide();
        }else {
          $('.recipient-content-class').hide();
          $('.sender-content-class').show();
        }
          $("body").scrollTop(0);
        $('.tab-text-class').toggleClass('tab-selected-class');
    })

})
