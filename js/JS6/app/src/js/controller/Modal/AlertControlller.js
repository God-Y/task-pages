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
  