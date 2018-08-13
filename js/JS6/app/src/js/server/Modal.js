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