const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
var named = require('vinyl-named');
var webpack = require('gulp-webpack');
// const rename = require('gulp-rename');
// const cssnano = require('gulp-cssnano');
// const concat = require('gulp-concat');
// const browserify = require('browserify');
// const source = require('vinyl-source-stream');

// 编译并压缩js
gulp.task('convertJS', function(){
   return gulp.src('app/js/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    // .pipe(named())
    // .pipe(webpack({
    //   output: {
    //     filename: '[name].js'
    //   },
    //   module: {
    //     loaders: [{
    //       test: /\.js$/,
    //       loader: 'imports?define=>false',
    //       exclude: './src/libs/*'
    //     }, {
    //       test: /\.string$/,
    //       loader: 'string'
    //     }]
    //   }
    // }))d
    .pipe(uglify().on('error', function(err) {
      console.log('\x07', err.lineNumber, err.message);
      return this.end();
    }))
    // .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
})

// 合并并压缩css
// gulp.task('convertCSS', function(){
//   return gulp.src('app/css/*.css')
//     .pipe(concat('app.css'))
//     .pipe(cssnano())
//     .pipe(rename(function(path){
//       path.basename += '.min';
//     }))
//     .pipe(gulp.dest('dist/css'));
// })
//
// // 监视文件变化，自动执行任务
// gulp.task('watch', function(){
//   gulp.watch('app/css/*.css', ['convertCSS']);
//   gulp.watch('app/js/*.js', ['convertJS', 'browserify']);
// })
//
// // browserify
// gulp.task("browserify", function () {
//     var b = browserify({
//         entries: "dist/js/app.js"
//     });
//
//     return b.bundle()
//         .pipe(source("bundle.js"))
//         .pipe(gulp.dest("dist/js"));
// });
//'convertCSS', 'browserify', 'watch'
gulp.task('start', ['convertJS', ]);
