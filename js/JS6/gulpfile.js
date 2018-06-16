//引用模块
const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const del = require('del');
const stylish = require('')

//初始目录,开发目录bulid,上线目录dist,源目录src
const src = './src';
const bulid = './bulid';
const dist = './dist';
const rev = './rev';
//目录对象
const path = {
    //源目录
    src: {
        html: src + '/*.html',
        scss: src + '/scss/*.scss',
        img: src + 'img/**/*',
        js: src + 'js/*.js'
    },
    //开发目录
    bulid: {
        html: bulid,
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
    //css文件
    css: function () {
        return gulp.src(path.src.scss)

    },
    //js文件
    js: function () {
        return gulp.src(path.src.js)
            .pipe($.debug())
            .pipe($.sourcemaps.init())
            .pipe($.sass().on('error', sass.logError))
            .pipe($.autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
            })
            .pipe($.sourcemaps.write())
            .pipe(gulp.dest(path.bulid.css));

    },
}

//定义上线目录中要使用的函数
const distFn = {
    js: function () {
        return gulp.src(path.bulid.js + '/*.js')
            .pipe($.uglify()) //压缩js
            .pipe($.concat('all.min.js')) //合并所有的js
            .pipe(path.dist.js);
    }
}