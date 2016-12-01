/**
 * @author smilewalker
 * @date 2016-11-30
 * @description 图片处理
 * @extends tg.Base
 * @name ImgHandle
 * @requires exif.js
 * @requires binaryajax.js
 * @requires zepto.js
*/

var ImgHandle = function() {};

ImgHandle.prototype = {

	QNURL: location.protocol + '//www.in66.com/promo/commonapi/qiniutoken',
	
	/**
  * 上传base至七牛云存储
  * @pic 须填写base64之后的字符串 需除去MIME和base64以及逗号 
  * @endurl 是返回的responseText的key，不是后台传过来的key，这是个坑
  * @http https 对应不同的七牛云地址 需判断
  * @Content-Type application/octet-stream 通过文件流的方式获取
  * @UpToken 与后面的字符串保留一个空格 后跟上在服务端请求的token的字符串
  */
	putb64: function(token, key, urlTpl, imageBase64) {

	  var pic = imageBase64.replace(/^.*?,/, '');

	  var url = location.protocol == 'http:' 
	          ? "http://up.qiniu.com/putb64/-1/key/" + key 
	          : "https://up.qbox.me/putb64/-1/key/" + key;

	  //创建XMLHttpRequest对象，用于和服务器交换数据
	  var xhr = new XMLHttpRequest();

	 	//onreadystatechange: 存储函数，每当readystate改变，便会调用该函数
	  xhr.onreadystatechange=function(){

	  	//4:代表请求已完成，且响应已就绪，进行后续的操作
	    if (xhr.readyState == 4){

	    	//responseText是字符串形式的响应数据
	    	var response = JSON.parse(xhr.responseText);
	    	var result_url = urlTpl.replace('%QiniuUploadImg%', response.key);
	    	console.log(result_url)
				$('#show').attr('src', result_url)

	    }
	  }

	 // xhr.upload.addEventListener("progress", function (evt) {
	 //      if (evt.lengthComputable) {
	 //          var percentComplete = evt.loaded / evt.total;
	 //          if (evt.loaded===evt.total) { console.log('上传完成'); }
	 //      }
	 //  }, false);

	 //  xhr.onerror = xhr.onabort = function() {
	 //      alert("上传图片失败，请重试！");
	 //  };

	 	//将请求发送到服务器。true代表异步
	  xhr.open("POST", url, true);

	  xhr.setRequestHeader("Content-Type", "application/octet-stream");

	  xhr.setRequestHeader("Authorization", "UpToken " + token);

	  xhr.send(pic);
	},

	/**
	* 矫正旋转的img
	* @image对象的建立  便于读取数据
	* @ios相机因拍摄角度不同导致照片带的orientation不同，为右1,左3,正6,倒8
	*/
	generateImg: function(res, orientation) {

		var imgs = new Image();

		imgs.src = res;

		var iw = $('.style-area').width(),
				ih = $('.style-area').height();

		var cva = document.createElement('canvas');
		document.body.appendChild(cva);
		cva.id = "img-canvas";
		var cva_wrap = document.getElementById('img-canvas');

		//坑货 setAttribute是改变属性,style.width是改变属性
		// cva.style.width = iw + 'px';
		// cva.style.height = ih + 'px';
		cva.setAttribute('width', iw + 'px')
		cva.setAttribute('height', ih + 'px')

		var ctx = cva.getContext('2d');

		alert(orientation)
		switch(orientation) {
			case 3:
				ctx.translate(iw,ih);			
				ctx.rotate(180 * Math.PI / 180)
				$('#pic').addClass('rotate' + orientation)
				break;
			case 6:
				ctx.translate(iw,0);			
				ctx.rotate(90 * Math.PI / 180)
				$('#pic').addClass('rotate' + orientation)
				break;
			case 8:
				ctx.translate(0,ih);			
				ctx.rotate(270 * Math.PI / 180)
				$('#pic').addClass('rotate' + orientation)
				break;
		}

		ctx.drawImage(imgs, 0, 0, iw, ih);

		var _url = cva_wrap.toDataURL("image/png", 1);
		return _url;
	},
	/**
 	*转换二进制数据，方便获取图片的exif信息；（这里引入了 Binary Ajax）
	*如果不转化二进制数据，直接处理base64，可以怎么处理
 	*/
	getExif: function(file, res) {
		console.log(file)


		var base64 = res.result.replace(/^.*?,/,'');

		//解码一个已经被base-64编码过的数据
		var binary = atob(base64); 

		//调用binary文件，实例化对象
		var binaryData = new BinaryFile(binary);	

		//获取exif信息
		var exif = EXIF.readFromBinaryFile(binaryData);
		var orientation = exif?exif.Orientation:1;
		return orientation;
	},


	/**
	* 读取图片文件
	* @fileReader 读取
	* @readAsDataURL() 读取指定File对象中的内容 读取完成 readyState为DONE 可通过onload事件调用
	*/
	readFile: function(event) {
		var file = event.target.files[0];
		if(file) {
			var $this = this;
			var fileReader = new FileReader();

			fileReader.readAsDataURL(file);

			fileReader.onload = function() {
				$pic.className = 'pic';

		   	var orientation = $this.getExif(file, this);
				var _url = $this.generateImg(this.result, orientation);
				$.ajax({ url: $this.QNURL }).done(function (res) {          
		      if (res.succ) {
		      	$this.putb64(res.data.token, res.data.key, res.data.urlTpl, _url)
		      } else {
		      	console.log('error')
		      }
		  	}).fail(function(){
		  		alert('网络错误')
		  	});

		    $pic.style.backgroundImage = 'url(' + this.result + ')';
			};
		}
	}

};


var $uploadFile = document.getElementById('uploadFile');
var $pic = document.getElementById('pic');

$uploadFile.addEventListener('change', function(event) {
	var imghandle = new ImgHandle();
	imghandle.readFile(event);

});
	
