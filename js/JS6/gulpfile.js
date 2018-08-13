//引用模块
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const stylish = require('jshint-stylish');
const wiredep = require('wiredep').stream;
const lazypipe=require('lazypipe');

//初始目录,开发目录bulid,上线目录dist,源目录src
const src = 'app/src';
const bulid = 'app/bulid';
const dist = 'app/dist';
const rev = 'app/rev';
//目录对象
const path = {
    //源目录
    src: {
        html: src + '/view/**/*.html',
        scss: src + '/scss/**/*.scss',
        img: src + '/img/**/*',
        js: src + '/js/**/*.js'
    },
    //开发目录
    bulid: {
        html: 'app/bulid/view',
        css: bulid + '/css',
        js: bulid + '/js',
        img: bulid + '/img'
    },
    //上线目录
    dist: {
        html: dist,
        css: dist + '/js',
        js: dist + '/js',
        img: dist + '/img'
    }
};


//gulp的删除的命令
const clean = {
    //删除开发目录
    bulid: function (done) {
        del([bulid]);
        done();
    },
    //删除上线目录
    dist: function (done) {
        del([dist]);
        done();
    },
    //删除md5签名目录
    rev: function (done) {
        del([rev]);
        done();
    },
    //删除所有目录
    all: function (done) {
        del([rev, dist, bulid]);
        done();
    }
};

//定义开发目录里用到的函数
const develop = {
    html:function(){
        return gulp.src(path.src.html)
       
        .pipe(gulp.dest('app/bulid/view'))
      
    },
    //css文件
    css: function () {
        return gulp.src(path.src.scss)
            .pipe($.sourcemaps.init())
            .pipe($.plumber())
            .pipe($.sass().on('error', $.sass.logError))
            .pipe($.autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
            }))
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest(path.bulid.css))
    },  
    //js文件
    js: function () {
        return gulp.src(path.src.js)
            .pipe($.debug())
            .pipe($.plumber())
            .pipe($.jshint())
            .pipe($.jshint.reporter(stylish))
            .pipe($.concat('all.js'))
            .pipe(gulp.dest(path.bulid.js));     
    },
    img:function(){
        return gulp.src(path.src.img)
            .pipe(gulp.dest(path.bulid.img));
    }
}
//定义wiredep任务
var wiredepFn=function(){
    return gulp.src('app/src/index.html')
        .pipe($.debug())
        .pipe(wiredep({
            optional: 'configuration',
            goes: 'here',
            exclude: ['jquery']
        }))
        .pipe(gulp.dest(bulid));
    }
    
    //定义wiredep任务
    gulp.task('wiredep',wiredepFn);

//定义上线目录中要使用的函数
const distFn = {
    index:function(){
        return gulp.src('app/bulid/index.html')
                .pipe($.debug())
                .pipe($.useref({},
                 lazypipe().pipe($.sourcemaps.init, { loadMaps: true })))
               .pipe($.debug())
               .pipe($.if('**/*.js',$.uglify()))
               .pipe($.if('**/*.js',$.rev()))
               .pipe($.if('**/*.css',$.cleanCss()))
               .pipe($.if('**/*.css',$.rev()))
               .pipe($.revReplace())
               .pipe($.sourcemaps.write())
               .pipe(gulp.dest('app/dist'));
    }
};


//定义clean任务
gulp.task('clean-dev',clean.bulid);
gulp.task('clean-dist',clean.dist);
gulp.task('clean-rev',clean.rev);
gulp.task('clean-all',clean.all);


//定义开发任务
gulp.task('dev-html',develop.html); //html
gulp.task('dev-css',develop.css); //css
gulp.task('dev-img',develop.img); //css
gulp.task('dev-js',develop.js); //css

gulp.task('dev-all',gulp.series('clean-dev','wiredep',gulp.parallel('dev-html','dev-css','dev-img','dev-js')));


//定义上线任务：
gulp.task('online',distFn.index);


//定义watch任务。
gulp.task('watch',function(){
    gulp.watch(path.src.html,develop.html);
    gulp.watch(path.src.scss,develop.css);
    gulp.watch(path.src.img,develop.img);
    gulp.watch(path.src.js,develop.js);
    gulp.watch('/app/src/index.html',wiredepFn);
});



