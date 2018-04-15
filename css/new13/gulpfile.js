var gulp = require('gulp');
var gulpLoad=require('gulp-load-plugins');
var $=gulpLoad();

gulp.task('html', function() {
    gulp.src('src/*.html')
        .pipe(gulp.dest('lib'))
        .pipe($.htmlmin())
        .pipe(gulp.dest('dist'))
  });
gulp.task('scss',function(){
    gulp.src('src/scss/*.scss')
        .pipe($.sass().on('error',$.sass.logError))
        .pipe(gulp.dest('lib/css'))
        .pipe($.rename({suffix:".min"}))
        .pipe($.cleanCss())
        .pipe(gulp.dest('dist/css'))
});
gulp.task('uglify',function(){
    gulp.src('src/js/*.js')
        .pipe(gulp.dest('lib/js'))
        .pipe($.uglify())
        .pipe($.rename({suffix:'.min'}))
        .pipe(gulp.dest('dist/js'))
});
gulp.task('imgmin',function(){
    gulp.src('src/img/*')
        .pipe(gulp.dest('lib/img'))
        .pipe($.imagemin())
        .pipe(gulp.dest('dist/img'))

});
gulp.task('default',['html','scss','uglify','imgmin']);
gulp.task('watch',function(){
    gulp.watch('src/*html',['html']);
    gulp.watch('src/js/*.js',['uglify']);
    gulp.watch('src/scss/*.scss',['scss']);
});
