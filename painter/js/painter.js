var Painter = function(info) {
	this.info = info; 
	this.init();
};

Painter.prototype = {

	initData: function() {
		this.lastX = 0;
		this.lastY = 0;
		this.isPaint = false;
		this.history = [];
		this.count = 0;
	},

	setConfig: function() {
		this.config = {
			lineWidth: this.info.lineWidth || 5,
			lineJoin: this.info.lineJoin || "round",
			shadowBlur: this.info.shadowBlur || 0,
			shadowColor: this.info.shadowColor || 'red',	
			boardW: this.info.cvaWidth || 600,
			boardH: this.info.cvaHeight || 400,
			layerBg: this.info.layerBg || "rgba(255, 255, 255, 0.8)"
		};
	},

	setWH: function() {
		this.cva.setAttribute('width', this.config.boardW);
		this.cva.setAttribute('height', this.config.boardH);
	},

	setLayer: function() {
		this.ctx.fillStyle = this.config.layerBg;
		this.ctx.fillRect(0, 0, this.config.boardW, this.config.boardH);
		this.ctx.globalCompositeOperation = "destination-out";
	},

	setPen: function() {
	    this.ctx.lineJoin = this.config.lineJoin;
	    this.ctx.strokeStyle = this.config.strokeStyle;
	    this.ctx.shadowBlur = this.config.shadowBlur;
	    this.ctx.shadowColor = this.config.shadowColor;
	},

	setPenWidth: function(penwidth) {
		this.ctx.lineWidth = penwidth || this.config.lineWidth;
	},

	historyLog: function() {
		this.history[this.count] = this.ctx.getImageData(0,0,this.config.boardW, this.config.boardH);
		this.count++;
	},

	// 画图事件
	draw: function(x, y) {
	    if(this.isPaint) {
	        this.ctx.beginPath();
	        this.ctx.moveTo(this.lastX, this.lastY);
	        this.ctx.lineTo(x, y);
	        this.ctx.closePath();
	        this.ctx.stroke();
	    }
	    this.lastX = x; 
	    this.lastY = y;
	},

	touchF: function(event) {
		event.preventDefault();
		var point = event.changedTouches[0];
		switch(event.type) {
			case 'touchstart':
				if(this.count == 0) {
					this.historyLog();
				}
				this.draw(point.clientX - this.cva.offsetLeft, point.clientY - this.cva.offsetTop);
				this.ctx.save();
				this.isPaint = true;
				break;
			case 'touchmove':
				if(this.isPaint) {
					this.draw(point.pageX - this.cva.offsetLeft, point.pageY - this.cva.offsetTop);
				}
				break;
			case 'touchend':
				this.ctx.restore();
				if(this.isPaint) {
					this.historyLog();
				}
	    		this.isPaint = false;
	    		break;
	    	default:
	    		this.isPaint = false;
	    		break;
		}
	},

	cancelPaint: function(sel) {
		this.cancelBtn.onclick = this.bind(this, this._cancelPaint);
	},

	_cancelPaint: function() {
		if(this.history.length && this.count > 1) {
			this.count--;
			this.ctx.putImageData(this.history[this.count - 1], 0, 0);
		}
	},

	clearPaint: function(sel) {
		this.clearBtn.onclick = this.bind(this, this._clearPaint);
	},

	_clearPaint: function() {
		if(this.history.length > 0) {
			this.ctx.putImageData(this.history[0], 0, 0);
		}
		this.initData();
	},

	// resetPaint: function() {
	// 	this.ctx.clearRect(0, 0, this.config.boardW, this.config.boardH);
	// },

	bind: function(obj, handler) {
		return function() {
			return handler.apply(obj, arguments);
		};
	},
	
	init: function() {
		this.cva = document.getElementById(this.info.layer);
		this.cancelBtn = document.getElementById(this.info.cancelButton);
		this.clearBtn = document.getElementById(this.info.clearButton);
		this.ctx = this.cva.getContext('2d');

		this.initData();
		this.setConfig();
		this.setWH();
		this.setLayer();
		this.setPen();
		this.setPenWidth();
		this.cancelPaint(this.cancleBtn);
		this.clearPaint(this.clearBtn);

		this.cva.addEventListener('touchstart', this.touchF.bind(this), false);
		this.cva.addEventListener('touchmove', this.touchF.bind(this), false);
		this.cva.addEventListener('touchend', this.touchF.bind(this), false);
	}
};
