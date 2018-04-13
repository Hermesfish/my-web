window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
})();

var canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
    keyword = "©1998-2018 happy birthday",
		imageData,
		density =2,
		mouse = {},
		hovered = false,
		colors = ["236, 252, 17", "15, 245, 46", "15, 237,  245", "245, 15, 15", "245, 15, 214"],
		minDist = 30,
		bounceFactor = 5;

var W = window.innerWidth,
		H = window.innerHeight;

canvas.width = W;
canvas.height = H;

document.addEventListener("mousemove", function(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
}, false);

// Particle Object
var Particle = function() {
	this.w = Math.random() * 10.5;
	this.h = Math.random() * 10.5;
	this.x = -W;
	this.y = -H;
	this.free = false;

	this.vy = -5 + parseInt(Math.random() * 10) / 2;
	this.vx = -4 + parseInt(Math.random() * 8);

	// Color
	this.a = Math.random();
	this.color = colors[parseInt(Math.random()*colors.length)];

	this.setPosition = function(x, y) {
		this.x = x;
		this.y = y;
	};

	this.draw = function() {
		ctx.fillStyle = "rgba("+this.color+","+this.a+")";
		ctx.fillRect(this.x, this.y,  this.w,  this.h);
	}
};

var particles = [];

// Draw the text
function drawText() {
	ctx.clearRect(0, 0, W, H);
	ctx.fillStyle = "#8800ff";
	ctx.font = "100px 'Arial', sans-serif";
	ctx.textAlign = "center";
	ctx.fillText(keyword, W/2, H/2);
}

// Clear the canvas
function clear() {
	ctx.clearRect(0, 0, W, H);
}

// Get pixel positions
function positionParticles() {
	// Get the data
	imageData = ctx.getImageData(0, 0, W, W);
	data = imageData.data;

	// Iterate each row and column
	for (var i = 0; i < imageData.height; i += density) {
		for (var j = 0; j < imageData.width; j += density) {

			// Get the color of the pixel
			var color = data[((j * ( imageData.width * 4)) + (i * 4)) - 1];

			// If the color is black, draw pixels
			if (color == 255) {
				particles.push(new Particle());
				particles[particles.length - 1].setPosition(i, j);
			}
		}
	}
}

drawText();
positionParticles();


// Update
function update() {
	clear();

	for(i = 0; i < particles.length; i++) {
		var p = particles[i];

		if(mouse.x > p.x && mouse.x < p.x + p.w && mouse.y > p.y && mouse.y < p.y + p.h)
			hovered = true;

		if(hovered == true) {

			var dist = Math.sqrt((p.x - mouse.x)*(p.x - mouse.x) + (p.y - mouse.y)*(p.y - mouse.y));

			if(dist <= minDist)
				p.free = true;

			if(p.free == true) {
				p.y += p.vy;
				p.vy += 0.15;
				p.x += p.vx;

				// Collision Detection
				if(p.y + p.h > H) {
					p.y = H - p.h;
					p.vy *= -bounceFactor;

					// Friction applied when on the floor
					if(p.vx > 0)
						p.vx -= 0.1;
					else
						p.vx += 0.1;
				}

				if(p.x + p.w > W) {
					p.x = W - p.w;
					p.vx *= -bounceFactor;
				}

				if(p.x < 0) {
					p.x = 0;
					p.vx *= -0.5;
				}
			}
		}

		ctx.globalCompositeOperation = "lighter";
		p.draw();
	}
}


(function animloop(){
	requestAnimFrame(animloop);
	update();
})();

/**
* JavaScript脚本实现回到页面顶部示例
* @param acceleration 速度
* @param stime 时间间隔 (毫秒)
**/
function gotoTop(acceleration,stime) {
   acceleration = acceleration || 0.1;
   stime = stime || 10;
   var x1 = 0;
   var y1 = 0;
   var x2 = 0;
   var y2 = 0;
   var x3 = 0;
   var y3 = 0;
   if (document.documentElement) {
       x1 = document.documentElement.scrollLeft || 0;
       y1 = document.documentElement.scrollTop || 0;
   }
   if (document.body) {
       x2 = document.body.scrollLeft || 0;
       y2 = document.body.scrollTop || 0;
   }
   var x3 = window.scrollX || 0;
   var y3 = window.scrollY || 0;

   // 滚动条到页面顶部的水平距离
   var x = Math.max(x1, Math.max(x2, x3));
   // 滚动条到页面顶部的垂直距离
   var y = Math.max(y1, Math.max(y2, y3));

   // 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小
   var speeding = 1 + acceleration;
   window.scrollTo(Math.floor(x / speeding), Math.floor(y / speeding));

   // 如果距离不为零, 继续调用函数
   if(x > 0 || y > 0) {
       var run = "gotoTop(" + acceleration + ", " + stime + ")";
       window.setTimeout(run, stime);
   }
}
