var chess = document.getElementById("chess");
var context = chess.getContext('2d');
var me = true;
var over = false;
//0 初始化为0 表示没有落子，1表示罗黑子，2表示白子
var chessBoard = [];
for(var i = 0; i < 15; i++) {
	chessBoard[i] = [];
	for(var j = 0; j < 15; j++) {
		chessBoard[i][j] = 0;
	}
}
//---------------------------------------------------------------------------下面是ai

var wins = [];
//赢法数组
var myWin = [];
var computerWin = [];
for(var i = 0; i < 15; i++) {
	wins[i] = [];
	for(var j = 0; j < 15; j++) {
		wins[i][j] = [];
	}
}
var count = 0;
//横向赢法
for(var i = 0; i < 15; i++) {
	for(var j = 0; j < 11; j++) {
		for(var k = 0; k < 5; k++) {
			wins[i][j + k][count] = true;
		}
		count++;
	}
}
//竖线的赢法
for(var i = 0; i < 15; i++) {
	for(var j = 0; j < 11; j++) {
		for(var k = 0; k < 5; k++) {
			wins[j + k][i][count] = true;
		}
		count++;
	}
}
//斜线的赢法
for(var i = 0; i < 11; i++) {
	for(var j = 0; j < 11; j++) {
		for(var k = 0; k < 5; k++) {
			wins[i + k][j + k][count] = true;
		}
		count++;
	}
}
//反斜线的赢法
for(var i = 0; i < 11; i++) {
	for(var j = 14; j > 3; j--) {
		for(var k = 0; k < 5; k++) {
			wins[i + k][j - k][count] = true
		}
		count++;
	}
}
//console.log(count);
for(var i = 0; i < count; i++) {
	myWin[i] = 0;
	computerWin[i] = 0;
}
//context.strokeStyle="#bfbfbf"
//context.moveTo(0,0);context.lineTo(450,450);
//context.stroke();
var switdh = chess.width / 15;
var sheight = chess.height / 15;
var icon = new Image();
icon.src = "img/001.png";
icon.onload = function() {
	context.drawImage(icon, 0, 0, 450, 450);
	drawChessBoard();

}
var drawChessBoard = function() {
	for(var i = 0; i < 15; i++) {
		context.beginPath();
		context.moveTo(15, 15 + sheight * i);
		context.lineTo(chess.width - 15, 15 + sheight * i);
		context.strokeStyle = "#bfbfbf"
		context.stroke();

	}
	for(var i = 0; i < 15; i++) {
		context.beginPath();
		context.moveTo(15 + switdh * i, 15);
		context.lineTo(15 + switdh * i, chess.height - 15);
		context.stroke();
	}

}
/*i 是行 j是列 me是白棋 还是黑棋子*/
function drawChessman(i, j, me, ctx) {
	ctx.beginPath();
	ctx.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
	var gradient = ctx.createRadialGradient(15 + i * 30 + 2, 15 + j * 30 - 2, 13, 15 + i * 30 + 2, 15 + j * 30 - 2, 0);
	if(me) {
		gradient.addColorStop(0, "#0a0a0a");
		gradient.addColorStop(1, "#326766");
	} else {
		gradient.addColorStop(0, "#d1d1d1");
		gradient.addColorStop(1, "#f9f9f9");
	}
	ctx.fillStyle = gradient;
	ctx.fill();
	ctx.closePath();
}
chess.onclick = function(e) {
	if(over) {
		return;
	}
	if(!me){
		return;
	}
	var x = e.offsetX;
	var y = e.offsetY;
	var i = parseInt(e.offsetX / switdh);
	var j = parseInt(e.offsetY / sheight);
	if(chessBoard[i][j] == 0) {

		drawChessman(i, j, me, context);
		
			chessBoard[i][j] = 1;
		
	
		for(var k = 0; k < count; k++) {
			if(wins[i][j][k]) {
				myWin[k]++;
				computerWin[k] = 6; /*最多5个棋子给6表示计算机不能给有这种赢法了*/
				if(myWin[k] == 5) {
					window.alert("你赢了");
					over = true;
				}
			}
		}
		if(!over){
			me = !me;
			computerAI();
		}
	}

}
var computerAI = function(){
		var myScore=[];
		var computerScore =[];
		var max =0;
		var u =0,v=0;
		for(var i =0;i<15;i++){
			myScore[i]=[];
			computerScore[i]=[];
			for(var j=0;j<15;j++){
				myScore[i][j]=0;
				computerScore[i][j]=0;
			}
		}
		for(var i =0;i<15;i++){
			for(var j =0;j<15;j++)
			{
				if(chessBoard[i][j]==0){
					for(var k=0;k<count;k++){
						if(wins[i][j][k]){//计算机拦截
							if(myWin[k]==1){
								myScore[i][j]+=200;
							}else if(myWin[k]==2){
								myScore[i][j]+=400;
						}else if(myWin[k]==3){
								myScore[i][j]+=2000;
						}
						else if(myWin[k]==4){
								myScore[i][j]+=10000;
						}
							//计算机落子
							if(computerWin[k]==1){
								computerScore[i][j]+=220;
							}else if(myWin[k]==2){
								computerScore[i][j]+=420;
						}else if(computerWin[k]==3){
								computerScore[i][j]+=2100;
						}
						else if(computerWin[k]==4){
								computerScore[i][j]+=20000;
						}
					}
					
				}
					if(myScore[i][j]>max){
						max=myScore[i][j]
						u =i;
						v=j;
					}else if(myScore[i][j]==max){
						if(computerScore[i][j]>computerScore[u][v])
						{
							u=i;
							v=j;
						}
					}
					if(computerScore[i][j]>max){
						max=computerScore[i][j]
						u =i;
						v=j;
					}else if(computerScore[i][j]==max){
						if(myScore[i][j]>myScore[u][v])
						{
							u=i;
							v=j;
						}
					}
			}
		}
			}
		drawChessman(u,v,false,context);
		chessBoard[u][v]=2;
			for(var k = 0; k < count; k++) {
			if(wins[u][v][k]) {
				computerWin[k]++;
				myScore[k] = 6; /*最多5个棋子给6表示计算机不能给有这种赢法了*/
				if(computerWin[k] == 5) {
					window.alert("你输了");
					over = true;
				}
			}
		}
		if(!over){
			me = !me;
//			computerAI();
		}
}
