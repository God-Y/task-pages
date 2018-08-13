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