
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