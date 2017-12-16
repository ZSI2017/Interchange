
  *在开发中基本不会将所有的业务逻辑代码放在一个JS文件中，特别是在使用前端框架，进行组件化开发中时，会复用相应的组件。这时，就会用到模块导入/导出的方法了。*

## npm 模块导出 ##

  - 平时我们接触最多的模块导入的例子，就是使用`npm`安装各种开源模块，然后在项目中使用例如import,require的方法引入，或者更加直白的直接使用script标签引入入node_module中对应模块打包过后的源文件。

为什么可以直接引入这些npm模块呢？一般在每个模块的源文件里面，都会找到modules.exports方法。用来导出变量。比如下面我们在使用`gulp`打包压缩时，经常使用到的`gulp-rename`这个插件通过npm安装后，在node_modules中的gulp-rename/index.js:

```
'use strict';

var Stream = require('stream');
var Path = require('path');

function gulpRename(obj) {

  var stream = new Stream.Transform({objectMode: true});
     ...  

  return stream;
}

module.exports = gulpRename;
```
  **看到的基本思路就是，定义了gulpRename 方法，然后把它抛出去**


## es6导出方法 ##
   es6中也同样提出了比较好用的模块导出的方法，包括两种。
     - **命名导出**
       如果在一个文件中想要导出多个不同的变量，可以分别对不同的变量命名，然后分别导出，避免相互污染。

         a.js/

         export const myModules = {c:1 }
         export const myModules2 = {d:2 }




     - **默认导出**
       如果只在一个文件中提供了一个导出的口，就可以使用默认导出
        //demo1.js    
                export  const str = "hello world"
                export function f(a) {
                    return a+1;  
              }






 [参考链接][1]


  [1]: https://github.com/ShowJoy-com/showjoy-blog/issues/39
