 var log = console.log;
 //获取上一个页面的传过来的数据
 var gameMsgstr = sessionStorage.getItem('allMsg');
 var initialMsg = JSON.parse(gameMsgstr);
 log(initialMsg);    
 let {result,dayNum,players,state} =initialMsg;
log(result,dayNum,players,state);
if(state =='vote'){
    dayNum--;
}
let img=$('#resultImg');
//显示剩余玩家
$('#killerNum').text(`杀 手${initialMsg.killersNum}人`);
$('#popNum').text(`平 民${initialMsg.popsNum}人`);
//判断什么结果
log(result);
log(img)
if(result === 'popWin'){
    img.prop('src','img/popwin.png');
}else if(result === 'killWin'){
    img.prop('src','img/killwin.png');
}else{
    img.prop('src','img/gameover.png');
}
let str='';
for( let i=0; i<dayNum;i++){
       let night=`<p class="game-details ">晚上：</p>`;
        let day =`<p class="game-details ">白天：</p>`;
    for(let j=0;j<players.length;j++){
     
        if(players[j].deadDay ==[i+1] && players[j].deadReason =='killed'){
            night=`
            <p class="game-details ">晚上：${players[j].index+1}号被杀手杀死，${players[j].index+1}号是水民</p>
           `
        }
        if(players[j].deadDay ==[i+1] && players[j].deadReason =='voted'){
            day=`
            <p class="game-details ">白天：${players[j].index+1}号被投死，${players[j].index+1}号是${players[j].id}</p>
           `
        }
    
    }
        str +=`<div class="game-step">
        <div class="date">
            <h4 >第${toChinese(i+1)}天</h4>
            ${night}
            ${day}
        </div>
    </div>`
}
log(str);
$('main').append(str);



$('#again').on('click',function(){
    $(location).attr('href','headerPage.html');
})











 //获取dom节点
//  var killNum = document.getElementById('killerNum'), //剩余杀手数
//      popNum = document.getElementById('popNum'),     //剩余玩家数
//      result =document.getElementById('resultImg'),
//      nightData=document.getElementsByClassName('night-data'),
//      dayData=document.getElementsByClassName('day-data'),
//      main=document.querySelector('main');
//      //渲染页面
//      killNum.innerHTML="杀  手"+aliveKiller+"人";
//      popNum.innerHTML="平  民"+alivepop+"人";
//      //通过判断玩家数目
//      if(aliveKiller ==0){
//          result.src ="img/popwin.png";
//      }else {
//         result.src ="img/killwin.png";
//      }
    
//      var domstr="";
//     //  循环出所有的数据
//      for(let i=0;i<days;i++){
//         var night=gamersMsg.killed[i]?`<p class="game-details ">晚上：${gamersMsg.killed[i]}号被杀死了，真实身份是${gamersMsg.idArr[gamersMsg.killed[i]-1]}</p>`:"";
//         var day  =gamersMsg.voted[i]?`<p class="game-details ">白天：${gamersMsg.voted[i]}号被投死了，真实身份是${gamersMsg.idArr[gamersMsg.voted[i]-1]}</p>`:"";
//         var dayNum=night?`<h4 >第${toChinese(days)}天</h4>`:"";
//         var div=document.createElement('div');
//         div.setAttribute('class','game-step');
//         div.innerHTML=`<div class="date">
//                         ${dayNum}
//                         ${night}
//                         ${day}
//                     </div>`;
//         if(night){
//             main.appendChild(div);
//         }
//      }


     //这个函数是用来通过天数转化为相应的中文
    function toChinese(value) {
        var arr = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", '十'];
        if (value < 10) {
            return arr[value];
        } else if (value === 10) {
            return '十';
        } else if (value < 20 && value > 10) {
            return arr[10] + arr[(value - 10)];
        }///
    }








