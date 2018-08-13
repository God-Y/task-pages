app.factory('getData',['$http',function($http){
    return {
        //返回一个对象，里面有一个get方法
        //传三个参数，分别是
        get:function(url,data){
            var requestUrl='/carrots-admin-ajax/a/'+url;
            return $http({
                url:requestUrl,
                method:'GET',
                params:data
            });
        },
        post:function(url,data,contentType){
            var requestUrl='/carrots-admin-ajax/a/'+url;
            var ContentType=contentType?contentType:'application/x-www-form-encoded';
            return $http({
                url:requestUrl,
                params:data,
                method:'POST',
                headers:{
                    "Content-Type":ContentType
                }
            });
        },
        //上传图片
        postImg:function(data){
            return $http({
                url:'/carrots-admin-ajax/a/u/img/task',
                data:data,
                method:'POST',
                headers:{
                    "Content-Type":undefined
                },
                eventHandlers: {
                    readystatechange: function(event) {
                                    if(event.currentTarget.readyState === 4) {
                                        console.log("readyState=4: Server has finished extra work!");
                                    }
                                }
                },
                uploadEventHandlers: {
                    //进度事件
                    progress: function(e) {
                         if (e.lengthComputable) {
                            progress = Math.round(e.loaded * 100 / e.total);
                            console.log("当前进度: " + progress + "%");
                            if (e.loaded == e.total) {
                              console.log("文件上传完毕！！!");
                              console.log("服务器将将返回消息...");
                            }
                            
                        }
                    }
                }
            });
        },
        //put请求，用于上下线
        put:function(url,data){
            return $http({
                method:'PUT',
                url:'/carrots-admin-ajax/a/'+url,
                params:data,
                headers:{
                    "Content-Type":'application/x-www-form-urlencoded'
                }
            });
        },
        //put请求用于上线单个列表
        singleList:function(id,data){
            return $http({
                method:'PUT',
                url:'/carrots-admin-ajax/a/u/article/'+id,
                data:data,
                headers:{
                    "Content-Type":'application/x-www-form-urlencoded'
                }
            });
        },
        //delete请求
        delete:function(id){
            return $http({
                url:'/carrots-admin-ajax/a/u/article/'+id,
                method:'DELETE'
            });
        }
    };
    //对http服务的进一步封装
}]).factory('httpServer',['getData',function(getData){
    return {
        //登陆
        login:function(data){
            return getData.post('login',data,'application/json');
        },
        //登出
        logout:function(){
            return getData.post('logout');
        },
        //获得列表
        getList:function(data){
            return getData.get('article/search',data);
        },
        //上传图片
        uploadImg:function(data){
            return getData.postImg(data);
        },
        //新增article
        addList:function(data){
            return getData.post('u/article',data);
        },
        //编辑article
        editArticle:function(id){
            return getData.get('article/'+id);
        },
        //上线下线
        changeStatus:function(data){
            return getData.put('u/article/status',data);
        },
        //删除
        deleteItem:function(id){
            return getData.delete(id);
        },
        //编辑上线新的单个article
        putArticle:function(id,data){
            return getData.put('u/article/'+id,data);
        },
        singleList:function(id,data){
            return getData.singleList(id,data);
        }

    };  
}]);