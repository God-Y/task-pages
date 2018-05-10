var log = console.log;
window.onload = function () {

    var playerStr = localStorage.getItem('randomPlays'),
        back = document.getElementById('backBtn'),
        playerNum = document.getElementById('playerNum'),
        playId = document.getElementById('playId'),
        showImg = document.getElementsByClassName('show-img')[0],
        hideImg = document.getElementsByClassName('hide-img')[0],
        checkBtn = this.document.getElementById('checkBtn'),
        playersArr = playerStr.split(','),
        len = playersArr.length,
        index =1,
        tNum =1;

    playerNum.innerText = index;
    playId.style.innerText = '';
    showImg.style.display = 'none';
    checkBtn.innerHTML = '查看<span>' + index + '</span>号身份';

    log(playersArr);
    checkBtn.addEventListener('click', function () {
           var  newNum = Math.ceil(tNum / 2);
           
        if (newNum === index) {
            playId.innerText = playersArr[index-1];
            showImg.style.display = 'block';
            hideImg.style.display = 'none';
            index += 1;
            tNum += 1;
            if(newNum ===len){
                checkBtn.innerHTML = '法官查看';
            }else{

                checkBtn.innerHTML = '隐藏并传递给<span>' + index + '</span>号';
            }
        } else {
            if(newNum ===len){
                window.location.href='vote.html';
            }
            playerNum.innerText = index;
            hideImg.style.display = 'block';
            showImg.style.display = 'none';
            playId.style.innerText = '';
            tNum +=1;   
            checkBtn.innerHTML = '查看<span>' + index + '</span>号身份';
        }
    }, false);

    //返回上一页
    back.addEventListener('click', function () {
        window.location.href = 'allot.html';
    }, false);




};