var canvas, context, x, y, ballX, ballY, vBallX, vBallY, pulsUp, pulsDown, puntosJugador, puntosEnemigo;

const playerWidth = 20, playerHeight = 80; 
const ballRadious = 7;
const velPlayer = 3; 

/// Dificultad ///
var scopeEnemy, vEnemy, enemyY;
const probDeFallo = 0.4;
//////////////////
window.onload =function() {
	canvas = document.getElementById("myCanvas");
	$('#myCanvas').mousemove(manejadorPosicion);
	window.addEventListener('keydown',function(e) {
	    e.preventDefault();
	    if (e.keyCode == 38) {
	    	pulsUp = true;
	    }
	    if (e.keyCode == 40) {
	    	pulsDown = true;
	    }
	    if (e.key === 'Escape' || e.keyCode == 32) {
	    	alert('Pausa');
	    }
	    if (e.code === 'F5') {
	    	location.reload(true);
	    }
	},false);

	window.addEventListener('keyup',function(e) {
	    e.preventDefault();
	    if (e.keyCode == 38) {
	    	pulsUp = false;
	    }
	    if (e.keyCode == 40) {
	    	pulsDown = false;
	    }
	},false);

	context = canvas.getContext("2d");

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	gameStart();

	var a = setInterval(motorJuego, 1);
};

function gameStart(){
	ballX = canvas.width/2;
	ballY = canvas.height/2;

	dropBall();

	y = canvas.height/2;

	scopeEnemy = canvas.width/3;
	vEnemy = 2;
	enemyY = canvas.height/2;

	pulsUp = null;
	pulsDown = null;

	puntosJugador = 0;
	puntosEnemigo = 0;

	alert('Juega con las flechas arriba y abajo o con el ratón');
}

function motorJuego(){
	context.clearRect(0, 0, canvas.width, canvas.height);
	draw();
	detectarColisiones();
	nextStep();
	velUpDown();
	enemyIA();
}

function manejadorPosicion(evt){
	evt.preventDefault();
	x = evt.pageX;
	y = evt.pageY;
}

function drawPlayer(){
	context.beginPath();
	context.fillStyle = "red";
	context.fillRect(canvas.width - 50, y - playerHeight/2, playerWidth, playerHeight);
	context.fill();
}

function drawEnemy(){
	if (enemyY - playerHeight/2 >= 0 && enemyY + playerHeight/2 <= canvas.height) {
		context.beginPath();
		context.fillStyle = "black";
		context.fillRect(50, enemyY - playerHeight/2, playerWidth, playerHeight);
		context.fill();
	}
}

function draw(){
	drawPlayer();
	drawBall();
	drawEnemy();
	drawFondo();
	drawScore();
}

function nextStep(){
	ballX += vBallX;
	ballY -= vBallY;
}

function drawBall(){
	context.beginPath();
	context.fillStyle = "cyan";
	context.arc(ballX, ballY, ballRadious, 0, 2 * Math.PI);
	context.fill();
}

function detectarColisiones(){
	colisionesBordes();
	colisionPlayer();
	colisionEnemy();
}

function colisionesBordes(){
	if (0 >= ballY - ballRadious || canvas.height <= ballY + ballRadious) {
		vBallY = -vBallY;
	}
	if (0 >= ballX - ballRadious || canvas.width <= ballX + ballRadious) {
		// Fallo
		if (0 >= ballX - ballRadious) {
			puntosJugador++;
		} else {
			puntosEnemigo++
		}
		ballX = canvas.width/2;
		ballY = canvas.height/2;

		dropBall();
	}
}

function colisionPlayer(){
	if (ballX + ballRadious >= canvas.width - 50 && ballY >= y - playerHeight/2 && ballY <= y + playerHeight/2) {
		vBallX = -vBallX;
	}
	if (ballY + ballRadious <= y - playerHeight/2 && ballY - ballRadious >= y + playerHeight/2) {
		if (ballX > canvas.width - 50 && ballX <= canvas.width - 50 + playerWidth) {
			vBallX = -vBallX;
			vBallY = -vBallY;
		}
	}
}

function colisionEnemy(){
	if (ballX - ballRadious <= 50 + playerWidth && ballY >= enemyY - playerHeight/2 && ballY <= enemyY + playerHeight/2) {
		vBallX = -vBallX;
	}
}

function enemyIA(){
	if (ballX < scopeEnemy) {
		var antVel = vEnemy;
		if (Math.random() > 1 - probDeFallo) {
			vEnemy--;
		}
		if (enemyY > ballY) {
			enemyY -= vEnemy;
		} else {
			enemyY += vEnemy;
		}
		vEnemy = antVel;
	}
}

function drawFondo(){
	context.beginPath();
	context.fillStyle = 'lightgrey';
	context.moveTo(canvas.width/2, 0);
	context.lineTo(canvas.width/2, canvas.height);
	context.stroke();
	context.beginPath();
	context.fillStyle = 'lightgrey';
	context.moveTo(canvas.width/2 - 10, canvas.height/2);
	context.lineTo(canvas.width/2 + 10, canvas.height/2);
	context.stroke();

}

function dropBall(){
	var random = Math.round(Math.random()*3);
	switch (random) {
		case 0:
			vBallX = 2;
			vBallY = 2;
			break;
		case 1:
			vBallX = -2;
			vBallY = 2;
			break;
		case 2:
			vBallX = 2;
			vBallY = -2;
			break;
		case 3:
			vBallX = -2;
			vBallY = -2;
			break;
		default:
			// statements_def
			break;
	}
}

function velUpDown(){
	if (pulsUp != null) {
		if (pulsUp && y - playerHeight/2 > 0) {
			y -= velPlayer;
		}
	}
	if (pulsDown != null) {
		if (pulsDown && y + playerHeight/2 < canvas.height) {
			y += velPlayer;
		}
	}
}

function drawScore(){
	context.beginPath();
	context.font = "100px Arial";
	context.fillStyle = "lightgrey";
	context.textAlign = "center";
	context.fillText(puntosEnemigo,canvas.width/2 - 100, canvas.height/2 + 30);
	context.fillText(puntosJugador,canvas.width/2 + 100, canvas.height/2 + 30);
}