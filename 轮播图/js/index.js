var EventBind = {
    addhandler: function(element, type, handler) {
        if (element.addEventListener) { //dom2
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) { //ie
            element.attachEvent('on' + type, handler);
        } else { //dom0
            element['on' + type] = handler;
        }
    },
    hasClass: function(obj, cls) {
        if (!obj.className) {
            return false;
        }
        return obj.className.match(new RegExp('(//s|^)' + cls + '(//s|$)'));
    },
    addClass: function(obj, cls) {
        if (!this.hasClass(obj, cls)) {
            obj.className = obj.className + '' + cls;
        }
    },
    removeClass: function(obj, cls) {
        if (this.hasClass(obj, cls)) {
            var reg = new RegExp('(//s|^)' + cls + '(//s|$)');
            obj.className = obj.className.replace(reg, '');
        }
    }
}

window.onload = function() {
    var picture = document.getElementById('picture');
    var prev = document.getElementById('prev');
    var next = document.getElementById('next');
    var point = document.getElementById('point')
    picnum = document.getElementsByTagName('img');
    oldpic = picnum[0];
    index = 0;
    EventBind.addhandler(prev, 'click', actprev);
    EventBind.addhandler(next, 'click', actnext);
    EventBind.addhandler(point, 'click', actdots);
    play();

}

function animate(index) {
    oldpic.style.opacity = 0;
    /* for (let i = 0; i < picnum.length; i++) {
         oldpic[0].style.opacity = 0;
     }*/
    picnum[index].style.opacity = 1;
    oldpic = picnum[index];

    /*picture.style.left = newLeft + 'px';
    console.log(newLeft);
    if (newLeft < -5120) {
        picture.style.left = -1024 + 'px';
    }
    if (newLeft > -1024) {
        picture.style.left = -5120 + 'px';
    }*/
}



function actprev() {
    index -= 1;
    if (index < 0) {
        index = 4;
    }
    showDot(index + 1);
    animate(index);

}

function actnext() {

    index += 1;
    if (index > 4) {
        index = 0;
    }
    showDot(index + 1);
    animate(index);
}

function showDot(index) {
    var dots = document.getElementById('point').getElementsByTagName('span');
    for (let i = 0; i < dots.length; i++) {
        if (EventBind.hasClass(dots[i], 'on')) {
            EventBind.removeClass(dots[i], 'on');
        }
    }
    //数组从0开始，故index需要-1
    EventBind.addClass(dots[index - 1], 'on');
}

function actdots(event) {
    var el = event.target || event.srcElemt;
    console.log(el);
    if (el.tagName.toLowerCase() === 'span') {
        var clickIndex = parseInt(el.getAttribute('index'));
        index = clickIndex;
        animate(index - 1); //存放鼠标点击后的位置，用于小圆点的正常显示    
        showDot(index);
    }
}

function play() {
    //重复执行的定时器
    timer = setInterval(function() {
        actnext();
    }, 2000)
}