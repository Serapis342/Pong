let score = 0;
let AI = false;
let VK_UP = false;
let VK_DOWN = false;

const width_of_paddle = innerWidth/69;
const height_of_paddle = innerHeight/4;
const distance_paddle_from_edge = innerWidth/69;
const radius_of_ball = innerHeight/50;
const speed_ball = parseInt(document.cookie.split('; ').find(row => row.startsWith('speed=')).split('=')[1]);
const speed_player = speed_ball * 1.5;

window.onload = function () {
    window.canvas = document.getElementById('canvas');
    window.ctx = canvas.getContext("2d");
    document.body.style = "margin: 0; padding: 0; overflow: hidden;";
    
    window.ball = {
        x: innerWidth / 2,
        y: Math.floor(Math.random() * innerHeight),
        velocity_x: speed_ball + Math.floor(Math.random() * speed_ball / 2),
        velocity_y: speed_ball + Math.floor(Math.random() * speed_ball / 2),
        radius: radius_of_ball,
    }

    window.paddle = {
        x: innerWidth - width_of_paddle - distance_paddle_from_edge,
        y: canvas.height / 2,
        width: width_of_paddle,
        height: height_of_paddle,
    }

    window.player = {
        x: distance_paddle_from_edge,
        y: canvas.height / 2,
        width: width_of_paddle,
        height: height_of_paddle,
    }

    draw();
    setInterval(update, 1000/60);
    resizeCanvas();
}

function draw() {
    writeScore();
    drawBall();
    drawPlayer();
    drawPaddle();

    requestAnimationFrame(draw);
}

function update() {
    moveEnemy();
    movePlayer();
    moveBall();
    checkGameOver();
}

function writeScore() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '5em monospace';
    ctx.fillStyle = '#fff';
    let width = ctx.measureText(score).width;
    ctx.fillText(score, canvas.width / 2 - width / 2, canvas.height / 15 + 30);
}

function drawBall() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlayer() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPaddle() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

window.onresize = function () { location.reload(); }

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

document.onkeydown = function (e) {
    if(!AI) {
        if (e.code === "KeyW" || e.code === "ArrowUp")
            VK_UP = true;
        if (e.code === "KeyS" || e.code === "ArrowDown")
            VK_DOWN = true;
    }
}

document.onkeyup = function (e) {
    if(!AI) {
        if (e.code === "KeyW" || e.code === "ArrowUp")
            VK_UP = false;
        if (e.code === "KeyS" || e.code === "ArrowDown")
            VK_DOWN = false;
    }
}

function movePlayer() {
    if(VK_UP)
        move("up")
    else if(VK_DOWN)
        move("down")

    if(player.y + player.height >= canvas.height)
        player.y = canvas.height - player.height;
    else if(player.y <= 0)
        player.y = 0;
}

function moveBall() {
    if (ball.radius + ball.x > innerWidth || ball.x - ball.radius < 0)
        ball.velocity_x *= - 1;

    if (ball.y + ball.radius > innerHeight || ball.y - ball.radius < 0)
        ball.velocity_y *= - 1;

    ball.x += ball.velocity_x;
    ball.y += ball.velocity_y;

    if(ball.x + ball.radius >= player.x && ball.x - ball.radius <= player.x + player.width)
        if(ball.y + ball.radius >= player.y && ball.y - ball.radius <= player.y + player.height) {
            ball.velocity_x *= -1;
            if(!AI) score++;
        }

    if(ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width)
        if(ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height)
            ball.velocity_x *= -1;
}

function checkGameOver() {
    if(ball.x < player.x) {
        gameOver();
        ball.x = innerWidth / 2;
    }
}

document.addEventListener('touchstart', function (e) {
    if(e.touches[0].clientY < player.y + player.height / 2) {
        player.y -= speed_player;
    } else if(e.touches[0].clientY > player.y + player.height / 2) {
        player.y += speed_player;
    }
});

function moveEnemy() {
    paddle.y = ball.y - paddle.height / 2;
    requestAnimationFrame(moveEnemy);
}

function gameOver() {
    ctx.fillStyle = 'white';
    ctx.font = '12vw monospace';
    let width = ctx.measureText('Game Over').width;
    ctx.fillText('Game Over', canvas.width / 2 - width / 2, canvas.height / 2);
    ctx.font = '8vw monospace';
    width = ctx.measureText('High Score: ' + localStorage.getItem('pong_highScore_serapis342')).width;
    ctx.fillText('High Score: ' + localStorage.getItem('pong_highScore_serapis342'), canvas.width / 2 - width / 2, canvas.height / 1.5);
    if(score > localStorage.getItem('pong_highScore_serapis342'))
        localStorage.setItem('pong_highScore_serapis342', score);
    
    AI = true;

    player.y = ball.y - player.height / 2;
    requestAnimationFrame(gameOver);

    document.onkeydown = function (e) {
        if (e.code === "Space" || e.code === "Enter" || e.code === "NumpadEnter" || e.code === "KeyR") {
            location.reload();
        }
    }
}

function move(direction) {
    if(direction === "up")
        player.y -= speed_player;
    else if(direction === "down")
        player.y += speed_player;
}