var chess = document.getElementById('chess');
var ctx = chess.getContext('2d');
var me = true;
var chessBoard = [];//落子记录数组
var wins = [];//赢法数组
var count = 0;//赢法种类的索引
var i = 0, j = 0, k = 0;
var reseau = 0;
var myWin = [];
var computerWin = [];
var over = false;
var resets = document.getElementById('resets');
var B15 = document.getElementById('B15');
var B18 = document.getElementById('B18');
var B21 = document.getElementById('B21');
//初始化
var init = function(){
	me = true;
	over = false;
	for(i = 0; i < reseau; i++){
		chessBoard[i] = [];
		for(j = 0; j < reseau; j++){
			chessBoard[i][j] = 0;
		}
	}

	for(i = 0; i < reseau; i++){
		wins[i] = [];
		for(j = 0; j < reseau; j++){
			wins[i][j] = [];
		}
	}
	//所有横线赢法的统计
	for(i = 0; i < reseau; i++){
		for(j = 0; j < reseau-4; j++){
			for(k = 0; k < 5; k++){
				wins[i][j+k][count] = true;
			}
			count++;
		}
	}
	//所有竖线赢法的统计
	for(i = 0; i < reseau; i++){
		for(j = 0; j < reseau-4; j++){
			for(k = 0; k < 5; k++){
				wins[j+k][i][count] = true;
			}
			count++;
		}
	}
	//所有斜线赢法的统计
	for(i = 0; i < reseau-4; i++){
		for(j = 0; j < reseau-4; j++){
			for(k = 0; k < 5; k++){
				wins[i+k][j+k][count] = true;
			}
			count++;
		}
	}
	//所有反斜线赢法的统计
	for(i = 0; i < reseau-4; i++){
		for(j = reseau-1; j > 3; j--){
			for(k = 0; k < 5; k++){
				wins[i+k][j-k][count] = true;
			}
			count++;
		}
	}
	//初始化赢法数组
	for(i = 0; i < count; i++){
		myWin[i] = 0;
		computerWin[i] = 0;
	}
};
//绘制棋盘
var drawChessBoard = function(){
	ctx.clearRect(0, 0, chess.width, chess.height);
	ctx.strokeStyle = '#333';
	ctx.beginPath();
	for(var i = 0; i < reseau; i++){
		ctx.moveTo(15+i*30, 15);
		ctx.lineTo(15+i*30, chess.width - 15);
		ctx.moveTo(15, 15+i*30);
		ctx.lineTo(chess.height - 15, 15+i*30);
	}
	ctx.closePath();
	ctx.stroke();
};
//走一步
var oneStep = function(i, j, me){
	ctx.beginPath();
	ctx.arc(15+i*30, 15+j*30, 13, 0, Math.PI*2);
	ctx.closePath();
	var gradient = ctx.createRadialGradient(15+i*30+2, 15+j*30-2, 13, 15+i*30+2, 15+j*30-2, 0);
	if(me){
		gradient.addColorStop(0, '#0a0a0a');
		gradient.addColorStop(1, '#636766');
	}else{
		gradient.addColorStop(0, '#d1d1d1');
		gradient.addColorStop(1, '#f9f9f9');
	}
	ctx.fillStyle = gradient;
	ctx.fill();
};
//AI算法
var computerAI = function(){
	var myScore = [];
	var computerScore = [];
	var i = 0, j = 0, k = 0;
	var max = 0;
	var u = 0, v = 0;
	for(i = 0; i < reseau; i++){
		myScore[i] = [];
		computerScore[i] = [];
		for(j = 0; j < reseau; j++){
			myScore[i][j] = 0;
			computerScore[i][j] = 0;
		}
	}
	//寻找最优落子位置
	for(i = 0; i < reseau; i++){
		for(j = 0; j < reseau; j++){
			if(chessBoard[i][j] === 0){
				for(k = 0; k < count; k++){
					if(wins[i][j][k]){
						if(myWin[k] === 1){
							myScore[i][j] += 200;
						}else if(myWin[k] === 2){
							myScore[i][j] += 400;
						}else if(myWin[k] === 3){
							myScore[i][j] += 2000;
						}else if(myWin[k] === 4){
							myScore[i][j] += 10000;
						}

						if(computerWin[k] === 1){
							computerScore[i][j] += 220;
						}else if(computerWin[k] === 2){
							computerScore[i][j] += 420;
						}else if(computerWin[k] === 3){
							computerScore[i][j] += 2100;
						}else if(computerWin[k] === 4){
							computerScore[i][j] += 20000;
						}
					}
				}
				if(myScore[i][j] > max){
					max = myScore[i][j];
					u = i;
					v = j;
				}else if(myScore[i][j] === max){
					if(computerScore[i][j] > computerScore[u][v]){
						u = i;
						v = j;
					}
				}
				if(computerScore[i][j] > max){
					max = computerScore[i][j];
					u = i;
					v = j;
				}else if(computerScore[i][j] === max){
					if(myScore[i][j] > myScore[u][v]){
						u = i;
						v = j;
					}
				}
			}
		}
	}
	oneStep(u, v, false);
	chessBoard[u][v] = 2;
	for(k = 0; k < count; k++){
		if(wins[u][v][k]){
			computerWin[k]++;
			myWin[k] = 6;
			if(computerWin[k] === 5){
				alert('AI胜利');
				over = true;
			}
		}
	}
	if(!over){
		me = !me;
	}
};

chess.onclick = function(e){
	if(over || !me){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = Math.floor(x / 30);
	var j = Math.floor(y / 30);
	if(chessBoard[i][j] === 0){
		oneStep(i, j, me);
		chessBoard[i][j] = 1;
		for(var k = 0; k < count; k++){
			if(wins[i][j][k]){
				myWin[k]++;
				computerWin[k] = 6;
				if(myWin[k] === 5){
					alert('你赢了');
					over = true;
				}
			}
		}
		if(!over){
			me = !me;
			computerAI();
		}
	}
};

resets.onclick = function(){
	init();
	drawChessBoard();
};

var change = function(s){
	chess.width = s*30;
	chess.height = s*30;
	reseau = s;
	resets.onclick();
};

B15.onclick = function(){
	change(15);
};
B18.onclick = function(){
	change(18);
};
B21.onclick = function(){
	change(21);
};
B15.onclick();
init();
drawChessBoard();