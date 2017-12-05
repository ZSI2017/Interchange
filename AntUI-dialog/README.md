
---
```
 .am-dialog .selection .am-dialog-button:first-child::before,

 .am-dialog .selection .am-dialog-button:first-child:before {

  display: none

 }
```
  - 这里的:first-child 伪类选择器，需要同时满足两个条件：
   - .am-dialog-button 元素是它父级的第一个子元素
   - 第一个子元素刚好是E,
  - 所以： 在 .am-dialog-footer,中不能随意添加元素
  ----
      ```
      .am-dialog .am-dialog-footer:before, .am-dialog .selection .am-dialog-button:before {
        content: ' ';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 1px;
        background: -webkit-linear-gradient(to bottom, #ddd, #ddd 33%, transparent 33%) left top no-repeat;
        background: linear-gradient(to bottom, #ddd, #ddd 33%, transparent 33%) left top no-repeat
      }
      ```
  - 1 像素边框的伪类元素实现，背景渐变。
  -  优点：  
      - 兼容安卓，ios。
      - 不对原样式产生影响。
  - 缺点：
      - 只能实现单边
      - 无法实现圆角     
