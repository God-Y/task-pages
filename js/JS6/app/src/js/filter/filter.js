app.filter('statusFilter',function(){
    //过滤状态
    return function(input){
        if(input ==1){
            return '草稿';
        }else if(input ==2){
            return '上线';

        }
    };
    //过滤job
}).filter('jobStyle',function(){
    return function(input){
        switch(input){
            case 0:
            return "首页";
            case 1:
            return "找职位banner";
            case 2:
            return "找精英banner";
            case 3:
            return "行业大图";
        }
    };
    //转化文件大小
}).filter('toMb',function(){
    return function(input){
        if(input){
            if(input/1024 <100){
                //小于100kb使用kb显示文件大小
                return (input/1024).toFixed(1)+'K';
            }else{
                //大于100Kb使用Mb显示
                return (input/(1024*1024)).toFixed(2)+'M';
            }
        }
    };
    //判断上线下线。
}).filter('decideStatus',function(){
    return function(input){
        if(input ==1){
            return '上线';
        }else if(input ==2){
            return '下线';
        }
    };
    
});