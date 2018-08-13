
app.controller('PageController',['$scope','$state',function($scope,$state){
    var $ctrl=this;
    var page=~~$state.params.page;
    $ctrl.pageArr=[];
    //观察指令传过来的pageNum 生成数组。
    $scope.$watch('pagenum',function(newValue){
        var i;
        if(newValue){
            var pagenum=newValue;
            //页面总数小于4
            if(pagenum<=4){
                for(i=1;i<=pagenum;i++){
                    $ctrl.pageArr.push(i);
                }
            }else{
                //当前页
                if(page < pagenum-4){
                   for( i=0;i<5;i++){
                       $ctrl.pageArr.push(page+i); 
                   }
                }else{
                    for( i=0;i<5;i++){
                        $ctrl.pageArr.unshift(pagenum-i); 
                    }
                }
            }
        }
    });
   
}]);