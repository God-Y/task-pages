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