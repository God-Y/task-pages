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