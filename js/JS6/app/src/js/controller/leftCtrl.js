app.controller('LeftnavController',['$scope','$state',function($scope,$state){
  //定义一个对象，用来处理手风琴效果
  $scope.oneAtATime = true;
  $scope.status = {};
  //跳转到列表页
  $scope.goArticle=function(){
      $state.go('back.ArticleList',{page:1,size:10});
  };
}]);