$(function () {
    //获取所有九宫格节点
    var nodes = $('.item');
    //设置数组，获取其中3个节点
    function getRandomArrayElements(arr, count) {
        var shuffled = arr.slice(0),
            length = arr.length,
            min = length - count,
            temp, index;
        while (length-- > min) {
            index = Math.floor((length + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[length];
            shuffled[length] = temp;
        }
        return shuffled.slice(min);
    }
       var interval;
    //获取随机颜色
    function bgcolors() {
       
        // return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
        //新颜色
        return `rgb(${~~(Math.random()*256)},${~~(Math.random()*256)},${~~(Math.random()*256)})`;
    }
    //开始按钮点击触发事件
    $('#startBtn').on('click', function () {
     
        if(interval){
            clearInterval(interval);
        }
        interval = setInterval(function () {
            for(let j=0; j<nodes.length;j++){
                nodes[j].style.background="#FFA500";
            }
            // nodes.css('background', '#FFA500');
            var nodearr = getRandomArrayElements(nodes, 3);

            // for (var i = 0; i < 3; i++) {
            //     nodearr[i].style.background = '#fff';
            // }
            for (var i = 0; i < 3; i++) {
                var bgcolor = bgcolors();
                nodearr[i].style.background = bgcolor;
                console.log(i);
            }
        }, 1000);
    });
    //结束按钮
    $('#endBtn').on('click',function(){
        clearInterval(interval);
        nodes.css('background', '#FFA500');
    })
    // for(var i=0;i<60;i++){
    //     console.log(bgcolors());
    // }
});