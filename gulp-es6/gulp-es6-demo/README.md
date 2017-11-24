## 不同环境中使用不同的config.js文件

##  默认使用config.js 文件    命令 ： gulp
##  使用其他config[name].js 文件  命令：  gulp --env name



###需要在命令行中安装的库；
## npm i minimist -D
## npm i gulp-rename -D


下面是gulpfile.js中要改动的地方

##添加的内容:

   //  文件重命名
    var rename = require("gulp-rename");

    //  从命令行中获取参数
    var minimist = require("minimist");
    var knowOptions = {
         string:'env',
         default:{env :process.env.NODE_ENV || ""}
    };
    var options = minimist(process.argv.slice(2),knowOptions);
    console.log("options env "+options.env);


    gulp.task('copy-libs-config',function(){
        gulp.src('./src/libs/config'+options.env+'.js')
            .pipe(rename(function(path){
                path.basename="config";
                path.extname=".js";
            }))
            .pipe(gulp.dest('./dist/libs/'));
    })

--------------------------------

##revise   需要修改的地方 :

gulp.task("copy-libs",function(){
     gulp.src('./src/libs/!(config*.js)')
         .pipe(gulp.dest('./dist/libs'));
})


gulp.task('default', [ 'packjs','copy-index','json','css','copy-images','copy-libs','copy-libs-config'], function() {
  console.log('任务队列执行完毕');
});
