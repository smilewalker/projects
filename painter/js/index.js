
var painter = new Painter({
	layer: 'mask',
	cancelButton: 'btn-cancel',
	clearButton: 'btn-clear',
	lineWidth: 10,
	layerBg: "rgba(0, 0, 0, 0.8)",
	shadowBlur: 10,
	cvaWidth: 800,
	cvaHeight: 500
});

var penwrap = document.getElementById('pen-wrap');

var removeClass = function(sel) {
	for(var i = 0; i < sel.length; i++) {
		sel[i].className = "";
	}
};

penwrap.addEventListener('click', function(e) {
	var sel = e.target;
	if(e.target && sel.nodeName.toUpperCase() == "LI") {
		removeClass(penwrap.getElementsByTagName('li'));
		painter.setPenWidth(sel.dataset.linewidth);
		sel.className += "pen-choose";

	}
});
