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