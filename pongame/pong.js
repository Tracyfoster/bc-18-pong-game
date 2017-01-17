var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var x = canvas.width/2;
var y = canvas.height-30;
var posX = 2;
var posY = 2;
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddlePos = (canvas.width - paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddlePos, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}
function moveBall(){
	ctx.clearRect(0, 0, canvas.width, canvas.height); 
	drawBall();
	drawPaddle();
	if(x + posX > canvas.width-ballRadius || x + posX < ballRadius) {
    	posX = -posX;
	}
	if(y + posY > canvas.height-ballRadius || y + posY < ballRadius) {
    	posY = -posY;
	}

    if(rightPressed && paddlePos < canvas.width-paddleWidth) {
    	paddlePos += 8;
	}
	else if(leftPressed && paddlePos > 0) {
	    paddlePos -= 8;
	}
	x += posX;
    y += posY;
}

setInterval(moveBall, 10);
