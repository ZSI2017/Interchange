### 编写可维护代码，就需要有一定的代码规范。

## 基本命名规范 ##

- #### 变量名应为名词,eg： car,person

- #### 函数名以动词开始。 getName(), 返回类型是布尔类型，一般以is开头，eg: isEnable();
- #### 变量和函数命名，不要担心长度，合乎逻辑重要。

## 变量命名 -- 类型透明##
- #### 通过初始化指定变量类型
    ```
        var found = false;    // 布尔类型
        var count = -1;       // 数字类型
        var name = “”;        // 字符串
        var person = null;    // 对象
       ```
- #### 匈牙利标记法
  **变量名前面加上一个或者多个字符来表示数据类型。**
  ```
        "o"  =>变量     var oPerson;
        "s" => 字符串   var iCount
        “i”  => 整数    var sName;
        “f” => 浮点数   var fMath;
        “b”  => 布尔值  var bFound;
       ```
##  全局命名空间  ##
- #### 创建唯一的全局的对象，然后再把需要的变量和函数添加到对象上。
- #### 避免与其他功能冲突。
- #### 产生对应的作用域
  ```
      // 声明全局对象
      var Wrox = {};
      // 为Wrox 创建 Professional JavaScript 命名空间
      Wrox.ProJS = {};

      // 分别在添加各种事件
      Wrox.ProJS.EventUtil = {};
      Wrox.ProJS.CookieUtil = {};

     // 在使用的时候
     Wrox.ProJS.EventUtil.adHandler();

    ```
