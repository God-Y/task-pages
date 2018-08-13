app.directive('uploadImg', ['httpServer', '$interval', '$timeout', function (httpServer, $interval,$timeout) {
    return {
        restrict: 'AE',
        scope: {
            imgUrl: '='
        },
        templateUrl: 'view/uploadImg.html',
        link: function (scope, ele, attrs) {
            //定义文件按钮
            var file = ele.find('input');
            //添加一个对象，用来显示文件名和文件
            scope.files = {};
            //添加一个change事件，当添加文件的时候
            file.on('change', function () {
                var file = this.files[0];
                scope.$apply(function () {
                    //用来绑定文件名和文件大小
                    scope.files = file;
                });
            });
            //定义一个变量用来显示进度条
            //因为上传图片很快
            scope.loaded = 0;

            //上传事件
            scope.upload = function () {
                //按钮不能重复点击
                scope.btnUpload = true;
                //取得input tpye=file的按钮
                var imgFile = file[0].files[0];
                //创建formdata对象，用于上传2进制数据
                var formdata = new FormData();
                formdata.append('file', imgFile);
                //使用filereader对象来本地预览图片
                var filereader = new FileReader();
                filereader.readAsDataURL(imgFile);
                //进度条定义一个间隔事件
                var time = $interval(function () {
                    scope.loaded += 10;
                    if (scope.loaded == 100) {
                        //进度条为100时，取消间隔事件
                        $interval.cancel(time);
                        scope.showOk = true;
                        $timeout(function(){
                            scope.imgaddress = filereader.result;
                        },500);
                    }
                }, 30);
                //发送http请求上传图片
                httpServer.uploadImg(formdata).then(function (res) {
                    //保证结果能渲染到页面
                    //删除按钮恢复点击点击
                    scope.btnDelete = true;
                    //获取一个返回的url用于传参       
                    scope.imgUrl = res.data.data.url;
                    //关于进度条的定时器                
                });
            };
            //定义删除事件
            scope.delete = function () {
                var img = ele.find('img');
                //删除后重置数据
                scope.showOk = false;
                scope.btnDelete = false;
                scope.btnUpload = false;
                scope.files = {};
                //返回的数据和自定义的自定数据全部清除
                scope.imgaddress = undefined;
                scope.imgUrl = undefined;
                img.attr('src', null);
            };
        }
    };
}]);