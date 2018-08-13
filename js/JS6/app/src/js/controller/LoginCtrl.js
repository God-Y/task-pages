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