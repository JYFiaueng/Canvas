window.onload = function(){
	var canvasWidth = 600,
		canvasHeight = 600,
		canvas = document.getElementById('canvas'),
		ctx = canvas.getContext("2d");
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	var image = new Image();
	var clippingRegion = {x:310,y:270,r:50};
	image.src = "pic.jpg";
	image.onload = function(){
		initCanvas();
	};

	function initCanvas(){
		draw();
	}
	function draw(){
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		ctx.save();
		ctx.lineWidth = 3;
		ctx.strokeStyle = "#39f";
		setClippingRegion();
		ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
		ctx.stroke();
		ctx.restore();
	}
	function setClippingRegion(){
		ctx.beginPath();
		ctx.arc(clippingRegion.x, clippingRegion.y, clippingRegion.r, 0, 2*Math.PI);
		ctx.clip();
	}
	var rr = Math.floor(Math.sqrt(canvasWidth*canvasWidth+canvasHeight*canvasHeight));
	var id = -1, animationstart = true;
	document.getElementById("reset").onclick = function(){
		if(clippingRegion.r != 50) clippingRegion.r = 50;
		if(id !== -1){
			cancelAnimationFrame(id);
			id = -1;
			animationstart = true;
		}
		clippingRegion.x = Math.random()*(canvasWidth-100)+50;
		clippingRegion.y = Math.random()*(canvasHeight-100)+50;
		draw();
	};
	document.getElementById("show").onclick = function(){
		console.log(animationstart);
		var show = function(){
			clippingRegion.r += 3;
			draw();
			id = requestAnimationFrame(show);
			if(clippingRegion.r > rr){
				cancelAnimationFrame(id);
				animationstart = true;
				return;
			}
		};
		if(animationstart === true){
			animationstart = false;
			id = requestAnimationFrame(show);
		}
	};
};