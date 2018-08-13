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