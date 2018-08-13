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