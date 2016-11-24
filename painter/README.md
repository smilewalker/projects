# painter plugin # painter 中文文档
##简单介绍
  Painter 是一个小型的蒙层画板，类似“刮刮卡”写出文字，底图是自己的图片，可选择画笔的粗细，以及蒙层的颜色，具有撤销清除画板的功能。

<img src="images/result.png">

##方法说明：
setPenWidth(n)	//n为数字，如10，可在后来调节笔触的大小
-var painter = new Painter({
-	layer: 'mask',	//蒙层的id名称
-	cancelButton: 'btn-cancel',	//取消按钮的id名称（必选）
-	clearButton: 'btn-clear',	//清楚画板的按钮名称（必选）
-	lineWidth: 10,				//笔触的宽度（可选），默认为5
-	layerBg: "rgba(0, 0, 0, 0.8)",	//蒙层的颜色（可选），默认为"rgba(255, 255, 255, 0.8)",
-	shadowBlur: 10,	//笔触阴影（可选），默认值0
-	cvaWidth: 800,  //canvas的宽度，默认值600
-	cvaHeight: 500  //canvas的高度，默认值400
-});

##实例说明：

###HTML
```
<canvas id="mask" class="mask" width="700" height="400"></canvas>
<div class="tool-wrap">
	<div id="btn-cancel" class="btn-cancel btn"></div>
	<div id="btn-clear" class="btn-clear btn"></div>
	<ul id="pen-wrap" class="pen-wrap">
        <li id="1" data-lineWidth="10"></li>
        <li data-lineWidth="15"></li>
        <li data-lineWidth="20"></li>
        <li data-lineWidth="25"></li>
        <li data-lineWidth="30"></li>
    </ul>
</div>

<h1>hello painter</h1>
```

###index.js

```
//初始化画板
var painter = new Painter({
	layer: 'mask',	//蒙层的id名称
	cancelButton: 'btn-cancel',	//取消按钮的id名称（必选）
	clearButton: 'btn-clear',	//清楚画板的按钮名称（必选）
	lineWidth: 10,				//笔触的宽度（可选），默认为5
	layerBg: "rgba(0, 0, 0, 0.8)",	//蒙层的颜色（可选），默认为"rgba(255, 255, 255, 0.8)"
	shadowBlur: 10,	//笔触阴影（可选），默认值0
	cvaWidth: 800,  //canvas的宽度，默认值600
	cvaHeight: 500  //canvas的高度，默认值400
});

var penwrap = document.getElementById('pen-wrap');

var removeClass = function(sel) {
	for(var i = 0; i < sel.length; i++) {
		sel[i].className = "";
	}
};

//点击改变笔触大小
penwrap.addEventListener('click', function(e) {
	var sel = e.target;
	if(e.target && sel.nodeName.toUpperCase() == "LI") {
		removeClass(penwrap.getElementsByTagName('li'));
		painter.setPenWidth(sel.dataset.linewidth);
		sel.className += "pen-choose";

	}
});
```