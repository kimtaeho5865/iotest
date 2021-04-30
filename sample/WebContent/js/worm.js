// 게임 매니저
var wormGame = function(width, height) {
	this.myMap = new wormMap(width, height);
	this.myWorm = new worm(width, height);
	this.myFood = new food(width, height);
	this.myOb = new obstacle(width, height);
	this.gameOver = null;
	this.score = document.getElementById("worm_score");
	this.cnt = document.getElementById("worm_cnt");
}
// 게임 초기화면
wormGame.prototype.init = function() {
	var _this = this;
	
	_this.myMap.mapMain();
	_this.myOb.obsMain();
}
// 게임 시작
wormGame.prototype.startGame = function() {
	var _this = this;
	// 인터벌 15fps
	_this.gameOver = setInterval(function() {
		_this.myMap.mapMain();
		_this.myOb.obsMain();
		_this.myWorm.wormMain();
		_this.myWorm.move();
		_this.myFood.foodMain();
		_this.collision();
	}, 1000/15);
	//keyDown 이벤트
	window.addEventListener("keydown", function(e){_this.myWorm.keyPush(e)});
}
// 충돌 이벤트
wormGame.prototype.collision = function() {
	var _this = this;
	var wormX = _this.myWorm.positionX;
	var wormY = _this.myWorm.positionY;
	var foodX = _this.myFood.foodX;
	var foodY = _this.myFood.foodY;
	var obsX = _this.myOb.obstacleX ;
	var obsY = _this.myOb.obstacleY;
	var wormArr = _this.myWorm.wormArr;
	// 지렁이가 먹이를 먹었을때
	if(wormX == foodX && wormY == foodY) {
		console.log("충돌");
		_this.myWorm.wormLength++;
		_this.myFood.totalCnt++;
		_this.myFood.foodX = Math.floor(Math.random() * _this.myFood.gridSize);
		_this.myFood.foodY = Math.floor(Math.random() * _this.myFood.gridSize);
		
		_this.cnt.innerHTML = _this.myFood.totalCnt;
		_this.score.innerHTML = _this.myFood.totalCnt * 500;
	}
	//지렁이 > 장애물 충돌
	if(wormX == obsX && wormY == obsY) {
		setTimeout(function() {_this.gameEnd();}, 1000/12);
		return false;
	}
	// 지렁이 > 벽 충돌
	if (wormX < 0) {
		setTimeout(function() {_this.gameEnd();}, 1000/12);
		return false;
	}
	if (wormX > _this.myWorm.gridSize - 1) {
		setTimeout(function() {_this.gameEnd();}, 1000/12);
		return false;
	}
	if (wormY < 0) {
		setTimeout(function() {_this.gameEnd();}, 1000/12);
		return false;
	}
	if (wormY > _this.myWorm.gridSize - 1) {
		setTimeout(function() {_this.gameEnd();}, 1000/12);
		return false;
	}
	// 지렁이가 이동중 반대로 움직였을 때
	if(wormArr.length > 1) {
		if(wormArr[1].dir == "L" && wormArr[0].dir == "R") {
			setTimeout(function() {_this.gameEnd();}, 1000/12);
			return false;
		}
		if(wormArr[1].dir == "R" && wormArr[0].dir == "L") {
			setTimeout(function() {_this.gameEnd();}, 1000/12);
			return false;
		}
		if(wormArr[1].dir == "D" && wormArr[0].dir == "U") {
			setTimeout(function() {_this.gameEnd();}, 1000/12);
			return false;
		}
		if(wormArr[1].dir == "U" && wormArr[0].dir == "D") {
			setTimeout(function() {_this.gameEnd();}, 1000/12);
			return false;
		}
	}
}
// GAMEOVER
wormGame.prototype.gameEnd = function() {
	var _this = this;
	clearInterval(_this.gameOver);
	window.removeEventListener("keydown", function(e){_this.myWorm.keyPush(e)});
	alert("GAMEOVER");
	location.reload();
	/*_this.cnt.innerHTML = 0;
	_this.score.innerHTML = 0;
	_this.myMap.mapMain();
	_this.myWorm.wormArr = [];
	_this.myWorm.positionX = 0;
	_this.myWorm.positionY = 0;*/
}
// 지렁이 속성
var wormProp = function(width, height) {
	this.canvas = document.getElementById("worm_canvas");
	this.ctx = worm_canvas.getContext("2d");
	this.width = width;
	this.height = height;
	//지렁이 배열
	this.wormArr = [];
	//맵 그리드 사이즈(맵크기의 제곱근
	this.gridSize = Math.floor(Math.sqrt(width));
}
// 맵
var wormMap = function wormMap(width, height) {
	wormProp.apply( this, arguments );
}

wormMap.prototype = Object.create( wormProp.prototype );
wormMap.prototype.constructor = wormMap;

// 맵 draw
wormMap.prototype.mapMain = function() {
	this.canvas.width = this.width;
	this.canvas.height = this.height;
	this.ctx.fillStyle = "#000000";
	this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
}
// 지렁이
var worm = function worm(width, height){
	wormProp.apply( this, arguments );
	//좌표
	  this.positionX = 0;
	  this.positionY = 0;
	//키입력시 방향변경
	  this.dx = 0;
	  this.dy = 0;
	//지렁이 방향
	  this.dir = null;
	  /*this.wormArr = [{
		  x : this.positionX
		, y : this.positionY
	  }];*/
	  this.wormLength = 1;
	}
	worm.prototype = Object.create( wormProp.prototype );
	worm.prototype.constructor = worm;

// 지렁이 draw
worm.prototype.wormMain = function() { 
	
	//지렁이 사이즈
	var wormWidth = this.gridSize;
	var wormHeight = this.gridSize;
	
		this.ctx.fillStyle = "#FAECC5";
		// 지렁이 배열 크기만큼 그림
		for(var i = 0; i < this.wormArr.length; i++) {
			this.ctx.fillRect(this.wormArr[i].x * wormWidth, this.wormArr[i].y * wormHeight, wormWidth, wormHeight);
		}
		// 지렁이 좌표,방향
		this.wormArr.push({
			  x : this.positionX
			, y : this.positionY
			, dir : this.dir
		});
		// 지렁이 크기보다 커지면 삭제
		if(this.wormArr.length > this.wormLength) {
			this.wormArr.shift();
		}
}
// 지렁이 자동이동
worm.prototype.move = function() {
	this.positionX += this.dx;
	this.positionY += this.dy;
}

worm.prototype.keyPush = function(e) {
	 if (e.keyCode == 37){ // left
		 this.dx = -1;
		 this.dy = 0;
		 this.dir = "L";
    }
    else if (e.keyCode == 38){ // up
   	 	 this.dx = 0;
		 this.dy = -1;
		 this.dir = "U";
    }
    else if (e.keyCode == 39){ // right
   	 	 this.dx = 1;
		 this.dy = 0;
		 this.dir = "R";
    }
    else if (e.keyCode == 40){ // down
    	 this.dx = 0;
		 this.dy = 1;
		 this.dir = "D";
    }
}
// 먹이
var food = function food(width, height){
	wormProp.apply( this, arguments );
	  this.foodX =  Math.floor(Math.random() * this.gridSize);
	  this.foodY =  Math.floor(Math.random() * this.gridSize);
	  this.totalCnt = 0;
	}
	food.prototype = Object.create( wormProp.prototype );
	food.prototype.constructor = food;
// 먹이 draw	
food.prototype.foodMain = function() {	
	var foodWidth = this.gridSize;
	var foodHeight = this.gridSize;
	this.ctx.fillStyle = "#FF0000";
	this.ctx.fillRect(this.foodX * foodWidth, this.foodY * foodHeight , foodWidth, foodHeight);
}
// 장애물
var obstacle = function obstacle(width, height){
	wormProp.apply( this, arguments );
	  this.obstacleX =  Math.floor(Math.random() * this.gridSize);
	  this.obstacleY =  Math.floor(Math.random() * this.gridSize);
	}
	obstacle.prototype = Object.create( wormProp.prototype );
	obstacle.prototype.constructor = obstacle;
// 장애물 draw	
obstacle.prototype.obsMain = function() {	
	var obWidth = this.gridSize;
	var obHeight = this.gridSize;
	this.ctx.fillStyle = "#1DDB16";
	this.ctx.fillRect(this.obstacleX * obWidth, this.obstacleY * obHeight, obWidth, obHeight);
}
