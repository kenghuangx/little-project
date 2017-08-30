window.onload = function() {
    var textInput = document.getElementById('write');
    EventBind.addHandler(textInput, 'input', searching);
    EventBind.addHandler(textInput,'focus',showList);
    EventBind.addHandler(window,'click',hideList);
    EventBind.addHandler(window,'keydown',onKeydown);
}
var EventBind = {
    addHandler: function(element, type, handler) {
        if (element.addEventListener) { // DOM2
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) { // IE
            element.attachEvent('on' + type, handler);
        } else { // DOM0
            element['on' + type] = handler;
        }

    },
    hasClass: function (obj, cls) {
        if (!obj.className ) {
            return false;
        }
        return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    },
    addClass: function (obj, cls) {
        if (!this.hasClass(obj, cls)) {
           
              obj.className = (obj.className===" " )?cls :obj.className + " " +cls
        }
    },
    removeClass: function (obj, cls) {
        
        if (this.hasClass(obj, cls)) {
            var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
            obj.className = obj.className.replace(reg, ' ');
        }
    },
    
};

function searching(event) {
    if (event.target.value !== '') {
        var script = document.createElement('script');
        //添加地址
        script.src = 'http://www.baidu.com/su?&wd=' + this.value + '&p=3&cb=kk';
        document.body.appendChild(script);
    } else {
        var oUl = document.getElementById('ulList');
        oUl.innerHTML = '';
    }
}

function kk(data) {
    var ulList = document.getElementsByTagName('ul')[0];
    var newUlist = document.createElement('ul');
    newUlist.dataset.query = data.q;
    newUlist.dataset.listIndex = -1;
    data.s.forEach(function (item) {
        var li = document.createElement('li');
        li.textContent = item;
        newUlist.appendChild(li);

    })
    document.getElementsByTagName('div')[0].replaceChild(newUlist, ulList);
    ulList = null;//gc垃圾回收

    [].forEach.call(newUlist.childNodes,function (item) {
        EventBind.addHandler(item, 'mouseenter', function (event) {
            var target = event.target ||event.srcElement;
            if (target.tagName.toLowerCase() === 'li') {

                resetStyle(target);
            }
        });
        EventBind.addHandler(item, 'mouseout', function (event) {
            var target = event.target ||event.srcElement;
            if (target.tagName.toLowerCase() === 'li') {
                resetStyle(target);
                EventBind.removeClass(item, 'hover');
            }
        });

    });


    EventBind.addHandler(newUlist, 'click', function (event) {//点击跳转页面
        var e = event || window.event;
        var target = e.target || e.srcElement;
        if (target.tagName.toLowerCase() === "li") {
            var wd = target.innerHTML;
            
            window.open('https://www.baidu.com/s?word=' + wd);
        }
    });
    EventBind.addHandler(window, 'keydown', function (event) {//enter跳转页面
        var e = event || window.event;
        var txtInput = document.getElementById('write');
        if (e.keyCode==13) {
            var wd = txtInput.value;
            
            window.open('https://www.baidu.com/s?word=' + wd);
        }
    });

//delete scripts
    var s = document.body.querySelectorAll('script');
    for (var i = 1, len = s.length; i < len; i++) {
        document.body.removeChild(s[i]);
    }

}



function showList() {
    var ulList = document.getElementsByTagName('ul')[0];
    EventBind.removeClass(ulList, 'hide');
    ulList.dataset.listIndex = -1;//设置当前搜索列表的索引，初始化为-1
    console.log(ulList.className);


}


function hideList(e) {
    var target = e.target || e.srcElement;//IE下用e.srcElement,Firefox下用e.target
    var tagname = target.tagName.toLowerCase();
    var ulList = document.getElementsByTagName('ul')[0];
    if (tagname !== 'li' && tagname !== 'input') {
        EventBind.addClass(ulList, 'hide');
    }

}
function resetStyle(target) {
    [].forEach.call(target.parentNode.childNodes, function (item) {
        EventBind.removeClass(item, 'hover');
    });
    EventBind.addClass(target, 'hover');
}

function onKeydown(e) {
    if (e.keyCode != '38' && e.keyCode != '40') {
        return;
    }
    var ulList = document.getElementsByTagName('ul')[0];
    if (!EventBind.hasClass(ulList, 'hide')) {
        switch (e.keyCode) {
            case 38:
                if (ulList.dataset.listIndex == -1) {
                    ulList.dataset.listIndex = parseInt(ulList.childNodes.length - 1);
                }
                else {
                    ulList.dataset.listIndex = parseInt(ulList.dataset.listIndex) - 1;
                }
                break;
            case 40:
                if (ulList.dataset.listIndex == parseInt(ulList.childNodes.length) - 1) {
                    ulList.dataset.listIndex = parseInt(-1);
                }
                else {
                    ulList.dataset.listIndex = parseInt(ulList.dataset.listIndex) + 1;
                }
                break;
        }
         var txtInput = document.getElementById('write');
        txtInput.value = (ulList.dataset.listIndex == -1) ? ulList.dataset.query : ulList.childNodes[ulList.dataset.listIndex].innerHTML;
        //重新设置样式
       resetStyle(ulList.childNodes[ulList.dataset.listIndex]);

    }
}
