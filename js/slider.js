window.onload = function(){
    // 获取DOM
    var js_slider = $("js_slider");
    var slider_main_block = $("slider_main_block");
    var slider_ctrl = $("slider_ctrl");
    var imgs = slider_main_block.children;
    var spans = slider_ctrl.children;
    var ctrl_prev = $('ctrl_prev');
    var ctrl_next = $('ctrl_next');
    var scroll_width = js_slider.clientWidth;
    // 简单的id选择器
    function $(id){return document.getElementById(id);}

    // 初始化
    //
    var key = 0; //记录当前图片索引 初始为第一个
    // 生成小圆点
    creatDots(imgs,'slider-ctrl-dot',slider_ctrl);
    // 设置第一个小圆点为焦点 spans中包含两个左右箭头
    spans[1].classList.add('slider-ctrl-dot-current');
    // 设置除第一个外的图片left值，使其在盒子外面（堆积在右侧）
    for(var i=1;i<imgs.length;i++){
        imgs[i].style.left = scroll_width + "px";
    }
    // 移入显示左右箭头
    js_slider.onmouseenter = function() {
        ctrl_prev.style.display = 'block';
        ctrl_next.style.display = 'block';
    }
    // 移出隐藏左右箭头
    js_slider.onmouseleave = function() {
        ctrl_prev.style.display = 'none';
        ctrl_next.style.display = 'none';
    }
    var autoChange = null;
    var flag = true;//判断移动到下一张的动画是否结束
    ctrlAddEvent();
    autoplay();
    //函数
    //
    //生成小圆点
    function creatDots(imgs,className,parent) {
        for(var i=0; i<imgs.length; i++) {
            var span = document.createElement('span');
            span.className = className;
            span.innerHTML = imgs.length - i -1;
            parent.insertBefore(span,parent.children[1]);
        }
    }
    //小圆点焦点跟随变化
    function changeDotFocus() {
        for(var i=1; i<spans.length-1; i++) {
            spans[i].classList.remove('slider-ctrl-dot-current');
        }
        // spans中包含两个左右箭头，使得key要加1
        spans[key+1].classList.add('slider-ctrl-dot-current');
    }
    // 向左移动
    function moveLeft() {
        var old = key;
        ++key < imgs.length ? key : key = 0;
        imgs[key].style.left = scroll_width + 'px';//将下一张移至右边
        // 当前图片向左移动
        animate(imgs[old],{left: -scroll_width});
        //下一张也向左移动
        animate(imgs[key],{left: 0},function(){flag = true;autoplayAgain();});
        // 改变焦点
        changeDotFocus();
    }
    // 向右移动
    function moveRight() {
        var old = key;
        --key < 0 ? key = imgs.length-1 : key;        
        imgs[key].style.left = -scroll_width + 'px';//将下一张移至左边
        // 当前图片向右移动
        animate(imgs[old],{left: scroll_width});
        // 下一张也向右移动
        animate(imgs[key],{left: 0},function(){flag = true;autoplayAgain();});
        // 改变焦点
        changeDotFocus();
    }
    // 指定移动
    function moveTo(target) {
        var old = key;
        key = parseInt(target);
        if(key > old) {
            imgs[key].style.left = scroll_width + 'px';//将下一张移至右边
            animate(imgs[old],{left: -scroll_width});
        }else if(key < old) {
            imgs[key].style.left = -scroll_width + 'px';
            animate(imgs[old],{left: scroll_width});//将下一张移至左边
        }
        // 下一张移动到显示区
        animate(imgs[key],{left: 0},function(){flag = true;autoplayAgain();});
        // 改变焦点
        changeDotFocus();
    }
    // 自动轮播
    function autoplay() {
        autoChange = setInterval(function(){
            if(flag) {
                flag = false;
                moveLeft();
            }
        },4000);
    }
    // 重新自动轮播
    function autoplayAgain() {
        clearInterval(autoChange);
        autoplay();
    }
    // 控制按钮添加事件
    function ctrlAddEvent() {
        for(var k in spans) {
            spans[k].onclick = function() {
                // 左箭头
                if(isHasClass(this,'slider-ctrl-prev')) {
                    if(flag) {
                        flag = false;
                        // 右移
                        moveRight();
                    }
                }
                // 右箭头
                else if(isHasClass(this,'slider-ctrl-next')) {
                    if(flag) {
                        flag = false;
                        // 左移
                        moveLeft();
                    }
                }
                // 小圆点
                else {
                    var target = this.innerHTML;
                    target = parseInt(target);
                    if(flag) {
                        flag = false;
                        // 指定图片移动
                        moveTo(target);
                    }
                }
            }
            spans[k].onmouseenter = function() {
                clearInterval(autoChange);
            }
            spans[k].onmouseleave = function() {
                autoplayAgain();
            }
        }
    }
    // 轮播效果
    function animate(obj,attrs,callback) {
        obj.timer = setInterval(function(){
            var isAllDone = true;
            for(var attr in attrs) {
                var current_value = 0;
                if(attr == 'opacity') {
                    current_value = parseInt(getStyleValue(obj,attr) * 100);
                }else {
                    current_value = parseInt(getStyleValue(obj,attr));
                }
                var target_value = attrs[attr];
                var step = 0;
                step = (target_value - current_value) / 10;
                step = step > 0 ? Math.ceil(step) : Math.floor(step);
                if(attr == 'opacity') {
                    if('opacity' in obj.style) {
                        obj.style.opacity = (current_value + step) / 100;
                    }else {
                        obj.style.filter = "alpha(opacity = "+(current + step)* 10+")";
                    }
                }else if(attr == 'zIndex') {
                    obj.style.zIndex = target_value;
                }else {
                    obj.style[attr] = current_value + step + 'px';
                }
                if(current_value != target_value) {
                    isAllDone = false;
                }else {
                    isAllDone = true;
                }
            }
            if(isAllDone) {
                clearInterval(obj.timer);
                if(callback) {
                    callback();
                }
            }
        },30);
    }
    // 获取某属性值
    function getStyleValue(obj,attr) {
        if(obj.currentStyle) {
            // ie
            return obj.currentStyle[attr];
        }else {
            // w3c 标准浏览器
            return window.getComputedStyle(obj,null)[attr];
        }
    }
    // 检查是否包含某class
    function isHasClass(obj,className) {
        if(obj.classList.contains(className)) {
            return true;
        }else {
            return false;
        }
    }
}