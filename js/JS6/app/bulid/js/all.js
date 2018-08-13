let app=angular.module('app',['ui.router','ui.bootstrap','ngAnimate','ngMessages','ui.router.state.events','angularTrix']);
//路由配置
app.config(['$stateProvider','$urlRouterProvider','$locationProvider',function($stateProvider,$urlRouterProvider,$locationProvider){
    //设置！为空
    $locationProvider.hashPrefix('');
    //设置默认路由
    $urlRouterProvider.otherwise('login');
    //配置路由
    $stateProvider
        .state('login',{
            url:'/login',
            templateUrl:'view/login.html',
            controller:'LoginController'
        })
        .state('back',{
            url:'/back',
            views:{
                "":{
                    templateUrl:'view/back.html'
                },
                'header@back':{
                    templateUrl:'view/header.html',
                    controller:'HeaderController',
                    controllerAs:'$ctrl'
                },
                'leftNav@back':{
                    templateUrl:'view/left-nav.html',
                    controller:'LeftnavController'
                },
                "content@back":{
                    template:'<h1>欢迎来到后台页</h1>'
                }
            }
        })
        .state('back.ArticleList',{
            url:"/ArticleList/:page/:size",
            params:{
                status:undefined,
                endAt:undefined,
                startAt:undefined,
                type:undefined
            },
            views:{
                "content":{
                    templateUrl:'view/ArticleList.html',    
                    controller:'ArtListController',
                    controllerAs:"CtrlArtList"
                }
            }
        })
        .state('back.ArticleDetial',{
            url:"/ArticleDetial/:id",
            views:{
                'content':{
                    templateUrl:'view/ArticleDetial.html',
                    controller:'DetialController',
                }
            }
        });
}]);



app.run(['$state', '$rootScope', function ($state, $rootScope) {
    // console.log($rootScope)
    $rootScope.$on('$stateChangeSuccess', function(event, transition) {
        //判断是不是当前页面
        if(transition.name =='login'){
            return ;
        }
        //提取存储在本地的数据
        var showMsg=JSON.parse(localStorage.getItem('UserMsg'));
        //判断是不是第一进入不是login网页
        if(!showMsg){
            showMsg={
                isLogin:false
            };
            localStorage.setItem('UserMsg',JSON.stringify(showMsg));
            //跳回login页面
            $state.go('login');
        }else{
            //如果退出页面后不登录就无法进去
            if(showMsg.isLogin ==false){
                $state.go('login');
            }
        }   
      });

}]);
app.controller('ArtListController', ['$scope', '$stateParams', '$state', 'httpServer', 'Modal', 'detialData', function ($scope, $stateParams, $state, httpServer, Modal, detialData) {
    //绑定this
    var $ctrl = this;
    //根据路由参数获取数据
    httpServer.getList($stateParams)
        .then(function (res) {
            //渲染列表
            $scope.initialList = res.data.data.articleList;
            //页面总数
            $scope.pageNum=Math.ceil(res.data.data.total / res.data.data.size);            
            return res.data.data;
        }, function (res) {
            //跳转失败执行如下代码
        });
    //初始化数据，通过ng-options来渲染数据
     $scope.select = detialData;

    //日期控件相关设置
    //设置datepicker相关的设置，online不需要设置
    $scope.dateOptions = {
        modify: {
            showWeeks: false,
            maxDate: new Date()
        },
        online: {
            showWeeks: false
        }
    };
    //关于打开日期控件的选项
    $scope.open = {
        online: false,
        modify: false,
        changeOnline: function () {
            $scope.open.online = true;
        },
        changeModify: function () {
            $scope.open.modify = true;
        }
    };
    //修改时间和上线时间,如果存在值 就绑定到scope上
    $scope.Date = {};
    $scope.Date.modifyTime = $stateParams.endAt ? new Date($stateParams.endAt) : null;
    $scope.Date.createTime = $stateParams.startAt ? new Date($stateParams.startAt) : null;
    //$watch观察修改时间有值的话
    $scope.$watch('Date.modifyTime',function(newValue){
        //判断修改时间，给上线时间一个最大日期
        //同时给查询时间endAt赋值，并且加上86400000的毫秒数
        if(newValue){
            $scope.dateOptions.online.maxDate = newValue;
            $scope.searchParams.endAt = newValue.valueOf() + 86400000 - 1;
        }else if (newValue ==null){
            //如果没有该值的话，让编辑时间的限制的最大日期等于当前天数
            //同时搜索参数设置undefined
            $scope.dateOptions.online.maxDate = new Date();
            $scope.searchParams.endAt = undefined;
        }
    });
    $scope.$watch('Date.createTime',function(newvalue){
        //判断新值有没有值
        //如果创建时间有值的话
        if (newvalue) {
            //判断创建时间，给修改时间一个最小日期
            //同时给查询时间startAt赋值，
            $scope.dateOptions.modify.minDate = newvalue;
            $scope.searchParams.startAt = newvalue.valueOf();
            //重置参数
        } else if (newvalue == null) {
            $scope.dateOptions.modify.minDate = undefined;
            $scope.searchParams.startAt = undefined;
        }
    });


    //用于搜索的数据
    $scope.searchParams = {
        status: $stateParams.status,
        type: $stateParams.type,
        endAt: $scope.motifyTime,
        startAt: $scope.createTime
    };
    // 
    $scope.search = function () {
        //判断是不是点击按钮，不是的话判断有没有跳转到一个页面，
        //没有的跳转到当前页啊
        $scope.searchParams.page =$stateParams.page ;
        //一页请求几个数据
        $scope.searchParams.size = $stateParams.size ;
        //跳转页面
        $state.go($state.current, $scope.searchParams, {
            reload: true
        });
    };

    //清除所有数据
    $scope.clearAll = function () {
        // 清除所有的请求参数
        var searchParams = {
            status: undefined,
            type: undefined,
            endAt: undefined,
            startAt: undefined,
            page: 1,
            size: 10
        };
        $state.go($state.current, searchParams, {
            reload: true
        });
    };
    //去编辑article页
    $scope.editArticle = function (id) {
        $state.go('back.ArticleDetial', {
            id: id
        });
    };

    //引入Moadl服务，来实现弹窗效果
    //定义上线下线事件
    $ctrl.open = Modal.open;
    //再次定义一个弹窗，用来提示上下线是否成功
    $ctrl.open2 = Modal.open2;
    //定义删除效果的弹窗
    $ctrl.deleteItem = Modal.deleteItem;
}]);
app.controller('DetialController',['$scope','detialData','$state','httpServer',function($scope,detialData,$state,httpServer){
    //设置
    //判断是编辑页还是新增页
    if($state.params.id){
        $scope.pageTitle='编辑Article';
        httpServer.editArticle($state.params.id).then(function(res){
            var list=res.data.data.article;
            $scope.addParams={
                title:list.title,
                type:list.type,
                img:list.img,
                url:list.url,
                content:list.content
            };
            //赋值行业参数
            if(list.type==3){
                $scope.addParams.industry=list.industry;
            }
        });
    }else{
        //新增页面
        $scope.pageTitle='新增Article';
        $scope.addParams={

        };
    }
    $scope.selectData=detialData;
    //设一个回调函数
    var gopage=function(){
        $state.go('back.ArticleList',{
            page:1,
            size:10,
            status:undefined,
            endAt:undefined,
            startAt:undefined,
            type:undefined
        });
    };
    //取消返回页面
    $scope.cancel=gopage;
    //列表上线
    $scope.go=function(id){
        //设置上线参数
        $scope.addParams.status=id;
        if($state.params.id){
            //修改单个列表
            $scope.addParams.createAt =(new Date()).valueOf();
            httpServer.putArticle(id,$scope.addParams).then(function(res){
                if(res.data.code ==0){
                    gopage();
                }else{
                    alert('参数错误');
                }
            });
        }else{
            //新增列表
            httpServer.addList($scope.addParams).then(function(){
                //跳转回列表页
                gopage();
            });
        }
    };
}]);    
app.controller('HeaderController', ['$scope', 'Modal', function ($scope,Modal) {
    //取出保存的数据
    var showMsg = JSON.parse(localStorage.getItem('UserMsg'));
    //取出用户名和管理员的名字
    if (showMsg) {
        $scope.userName = showMsg.data.manager.name;
        $scope.managerName = showMsg.data.role.name;
    }
    //定义一个弹出框
    var $ctrl = this;
    //定义open函数,调用弹窗的数据
    $ctrl.logout = Modal.logout;
}]);
app.controller('LeftnavController',['$scope','$state',function($scope,$state){
  //定义一个对象，用来处理手风琴效果
  $scope.oneAtATime = true;
  $scope.status = {};
  //跳转到列表页
  $scope.goArticle=function(){
      $state.go('back.ArticleList',{page:1,size:10});
  };
}]);
app.controller('LoginController', ['$scope','httpServer','$state', function ($scope,httpServer,$state) {
    //定义输入的对象
    $scope.user = {};




    $scope.login=function(){
        //定义输出的错误信息初始化为null
        $scope.errorMsg=null;
        //定义输出错误信息
        $scope.showError=true;
        httpServer.login($scope.user).then(function(res){
            var ueseMsg=null;
            if(res.data.code==0){
                //登陆成功不在显示数据
                ueseMsg=res.data;
                ueseMsg.isLogin=true;
                localStorage.setItem('UserMsg',JSON.stringify(ueseMsg));
                $state.go('back');
            }else{
                $scope.errorMsg=res.data.message;
            }
        },function(res){
            console.log(res);
        });
    };
}]);

app.controller('PageController',['$scope','$state',function($scope,$state){
    var $ctrl=this;
    var page=~~$state.params.page;
    $ctrl.pageArr=[];
    //观察指令传过来的pageNum 生成数组。
    $scope.$watch('pagenum',function(newValue){
        var i;
        if(newValue){
            var pagenum=newValue;
            //页面总数小于4
            if(pagenum<=4){
                for(i=1;i<=pagenum;i++){
                    $ctrl.pageArr.push(i);
                }
            }else{
                //当前页
                if(page < pagenum-4){
                   for( i=0;i<5;i++){
                       $ctrl.pageArr.push(page+i); 
                   }
                }else{
                    for( i=0;i<5;i++){
                        $ctrl.pageArr.unshift(pagenum-i); 
                    }
                }
            }
        }
    });
   
}]);
app.directive('pagination', ['$state', function ($state) {
    return {
        restrict: 'AE',
        scope: {
            pagenum: '='
        },
        templateUrl: 'view/Pagination.html',
        link: function (scope){
            //一个是跳转页面的查询参数。
            scope.goPageParams = $state.params;
            scope.initialId=~~$state.params.page;
            //使用$watch检测一页显示数目，保证只能输入数字和忽略前导0
            scope.$watch('goPageParams.size', function (newVlaue) {
               
                //只能输入数字
                scope.goPageParams.size = newVlaue.replace(/\D/, '');
                //忽略前导0
                scope.goPageParams.size = scope.goPageParams.size.replace(/^(0+)/, '');
                //一页最多显示99条
                if (~~newVlaue > 99) {
                    console.log(newVlaue);
                    scope.goPageParams.size = '99';
                }
            });
            //保证跳转页不会超过最大页面数
            scope.$watch('skipPage', function (newValue) {
                if (newValue) {
                    scope.skipPage = newValue.replace(/\D/, '');
                    scope.skipPage = scope.skipPage.replace(/0+/g, '');
                    //保证页面不会超过最大页面数
                    if (~~scope.skipPage > scope.pagenum) {
                        scope.skipPage = scope.pagenum;
                    }
                }
            });
            scope.goPage=function(id){
                //如果有传入的id跳转到该页面
                //如果有跳转页，那就跳转到该页面
                //如果是改变size，每页显示个数，则调换到第一页
                scope.goPageParams.page=id||scope.skipPage||1;
                //保证页面可以正常显示列表
                scope.goPageParams.size=scope.goPageParams.size||10;
                $state.go('back.ArticleList',scope.goPageParams,{reload:true});
            };
            //判断按钮是否在激活状态
            scope.isActive=function(index){
                return index==scope.initialId;
            };
        },
        controller: 'PageController',
        controllerAs: 'CtrlPage'
    };
}]);
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
app.filter('statusFilter',function(){
    //过滤状态
    return function(input){
        if(input ==1){
            return '草稿';
        }else if(input ==2){
            return '上线';

        }
    };
    //过滤job
}).filter('jobStyle',function(){
    return function(input){
        switch(input){
            case 0:
            return "首页";
            case 1:
            return "找职位banner";
            case 2:
            return "找精英banner";
            case 3:
            return "行业大图";
        }
    };
    //转化文件大小
}).filter('toMb',function(){
    return function(input){
        if(input){
            if(input/1024 <100){
                //小于100kb使用kb显示文件大小
                return (input/1024).toFixed(1)+'K';
            }else{
                //大于100Kb使用Mb显示
                return (input/(1024*1024)).toFixed(2)+'M';
            }
        }
    };
    //判断上线下线。
}).filter('decideStatus',function(){
    return function(input){
        if(input ==1){
            return '上线';
        }else if(input ==2){
            return '下线';
        }
    };
    
});
app.constant('detialData',{
    //种类常量
    type:[
        {id:undefined,name:'请选择'},
        {id:0,name:'首页banner'},
        {id:1,name:'找职位banner'},
        {id:2,name:'找精英banner'},
        {id:3,name:'行业大图'}
    ],
    //行业常量
    industry:[
        {id:undefined,name:"请选择"},
        {id:0,name:"移动互联网"},
        {id:1,name:'电子商务'},
        {id:2,name:'企业服务'},
        {id:3,name:'O2O'},
        {id:4,name:'教育'},
        {id:5,name:'金融'},
        {id:5,name:'游戏'}
    ],
    //状态常量
    status:[
        {name:'全部',id:undefined},
        {name:'草稿',id:1},
        {name:'上线',id:2}
    ]
});
app.factory('getData',['$http',function($http){
    return {
        //返回一个对象，里面有一个get方法
        //传三个参数，分别是
        get:function(url,data){
            var requestUrl='/carrots-admin-ajax/a/'+url;
            return $http({
                url:requestUrl,
                method:'GET',
                params:data
            });
        },
        post:function(url,data,contentType){
            var requestUrl='/carrots-admin-ajax/a/'+url;
            var ContentType=contentType?contentType:'application/x-www-form-encoded';
            return $http({
                url:requestUrl,
                params:data,
                method:'POST',
                headers:{
                    "Content-Type":ContentType
                }
            });
        },
        //上传图片
        postImg:function(data){
            return $http({
                url:'/carrots-admin-ajax/a/u/img/task',
                data:data,
                method:'POST',
                headers:{
                    "Content-Type":undefined
                },
                eventHandlers: {
                    readystatechange: function(event) {
                                    if(event.currentTarget.readyState === 4) {
                                        console.log("readyState=4: Server has finished extra work!");
                                    }
                                }
                },
                uploadEventHandlers: {
                    //进度事件
                    progress: function(e) {
                         if (e.lengthComputable) {
                            progress = Math.round(e.loaded * 100 / e.total);
                            console.log("当前进度: " + progress + "%");
                            if (e.loaded == e.total) {
                              console.log("文件上传完毕！！!");
                              console.log("服务器将将返回消息...");
                            }
                            
                        }
                    }
                }
            });
        },
        //put请求，用于上下线
        put:function(url,data){
            return $http({
                method:'PUT',
                url:'/carrots-admin-ajax/a/'+url,
                params:data,
                headers:{
                    "Content-Type":'application/x-www-form-urlencoded'
                }
            });
        },
        //put请求用于上线单个列表
        singleList:function(id,data){
            return $http({
                method:'PUT',
                url:'/carrots-admin-ajax/a/u/article/'+id,
                data:data,
                headers:{
                    "Content-Type":'application/x-www-form-urlencoded'
                }
            });
        },
        //delete请求
        delete:function(id){
            return $http({
                url:'/carrots-admin-ajax/a/u/article/'+id,
                method:'DELETE'
            });
        }
    };
    //对http服务的进一步封装
}]).factory('httpServer',['getData',function(getData){
    return {
        //登陆
        login:function(data){
            return getData.post('login',data,'application/json');
        },
        //登出
        logout:function(){
            return getData.post('logout');
        },
        //获得列表
        getList:function(data){
            return getData.get('article/search',data);
        },
        //上传图片
        uploadImg:function(data){
            return getData.postImg(data);
        },
        //新增article
        addList:function(data){
            return getData.post('u/article',data);
        },
        //编辑article
        editArticle:function(id){
            return getData.get('article/'+id);
        },
        //上线下线
        changeStatus:function(data){
            return getData.put('u/article/status',data);
        },
        //删除
        deleteItem:function(id){
            return getData.delete(id);
        },
        //编辑上线新的单个article
        putArticle:function(id,data){
            return getData.put('u/article/'+id,data);
        },
        singleList:function(id,data){
            return getData.singleList(id,data);
        }

    };  
}]);
app.factory('Modal',['$uibModal','$log','$state',function( $uibModal,$log,$state){
    return {
        //删除项目
        deleteItem:function(id,params){
            var modalInstance = $uibModal.open({
                templateUrl: 'view/modal/deleteItem.html',
                controller: 'DeleteItemController',
                controllerAs: 'CtrldeleteItem',
                resolve:{
                    id:id
                }
            });
            modalInstance.result.then(function () {
                //当点击确定时，发送新的http请求，刷新本页面
                $state.go($state.current, params, {
                    reload: true
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        },
        //改变状态首次弹窗,
        //要传状态，id,搜索参数，以及controllerAs值
        open:function (status,id,params,$ctrl) {
            var modalInstance = $uibModal.open({
                templateUrl: 'view/modal/changeState.html',
                controller: 'ChangeStateController',
                controllerAs: 'CtrlchangeState',
                //传递必要的参数，以便于发送http请求
                resolve:{
                    changeParams:{
                        status:status,
                        id:id
                    }
                }
            });
            modalInstance.result.then(function () {
                //当点击确定时，发送新的http请求，刷新本页面
                $state.go($state.current, params, {
                    reload: true
                });
                //成功的提示弹窗
                $ctrl.open2(status);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
           
        },
        //这里就是打开第二个页面
        open2:function (status) {
            var modalInstance = $uibModal.open({
                templateUrl: 'view/Modal/trueState.html',
                controller: 'TrueStateController',
                controllerAs: 'CtrlTrueState',
                //传入一个状态数据
                resolve:{
                    status:status
                }
            });
            //只有一个确认按钮
            modalInstance.result.then(function () {
            });
        },
        //确定是否退出登陆
        logout:function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'view/Modal/alert.html',
                controller: 'AlertController',
                controllerAs: '$ctrl',
                resolve: {
                    items: function () {}
                }
            });
            modalInstance.result.then(function () {
                $log.info('退出登陆');
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }
    };
}]);
app.controller('AlertController',['$uibModalInstance','$state','httpServer',function ($uibModalInstance,$state,httpServer) {
    var $ctrl = this;
    //获取数据
    var showMsg=JSON.parse(localStorage.getItem('UserMsg'));
    //选择确定退出登陆
    $ctrl.ok = function () {
        //发送http请求
        httpServer.logout().then(function(res){
            if(res.data.code ==0){
                showMsg.isLogin=false;
                localStorage.setItem('UserMsg',JSON.stringify(showMsg));
                $state.go('login');
            }
        },function(res){
            console.log(res);
        });
        $uibModalInstance.close();
    };
    //取消
    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }]);   
  
app.controller('ChangeStateController',['$scope','changeParams','httpServer','$uibModalInstance',function($scope,changeParams,httpServer,$uibModalInstance){
    var $ctrl = this;
    $scope.status=changeParams.status;
    $ctrl.ok = function () {
        //改变状态必须发送相反的状态
        if(changeParams.status ==1){
            changeParams.status =2;
        }else{
            changeParams.status =1;
        }
        httpServer.changeStatus(changeParams).then(function(res){
            if(res.data.code ==0){
                console.log('改变状态操作成功');
                $uibModalInstance.close();
            }else{
                $uibModalInstance.dismiss('cancel');
            }
        },function(res){
            
        });
    };
    //取消操作
    $ctrl.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
}]);
app.controller('TrueStateController',['$scope','status','$uibModalInstance',function($scope,status,$uibModalInstance){
    var $ctrl = this;
    $ctrl.status=status;
    $ctrl.ok = function () {
        console.log('转化状态成功');
        $uibModalInstance.close();
    };
    //取消操作
    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);

//删除列表项的控制器
app.controller('DeleteItemController',['$uibModalInstance','httpServer','id',function($uibModalInstance,httpServer,id){
    var $ctrl = this;
    $ctrl.status=status;
    $ctrl.ok = function () {
        console.log('转化状态成功');
        httpServer.deleteItem(id).then(function(res){
            if(res.data.code ==0){
                console.log('删除成功');
                $uibModalInstance.close();
            }else {
                console.log('删除出错',res.data.message);
                $uibModalInstance.dismiss('cancel');
            }
        });
    };
    //取消操作
    $ctrl.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);