let VK_UP = false;
let VK_DOWN = false;
let VK_W = false;
let VK_S = false;

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

    window.player_left = {
        x: distance_paddle_from_edge,
        y: canvas.height / 2,
        width: width_of_paddle,
        height: height_of_paddle,
        score: 0
    }

    window.player_right = {
        x: innerWidth - width_of_paddle - distance_paddle_from_edge,
        y: canvas.height / 2,
        width: width_of_paddle,
        height: height_of_paddle,
        score: 0
    }

    resizeCanvas();
    draw();
    setInterval(update, 1000/60);
}

window.onresize = function () {
    if(innerHeight < 600 || innerWidth < 850)
        location.replace('../error/error.html');
    else
        location.reload();
}

function resizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}

function draw() {
    writeScore();
    drawBall();
    drawPlayerLeft();
    drawPlayerRight();
    drawPaddle();

    requestAnimationFrame(draw);
}

function update() {
    moveBall();
    checkForWin();
    movePaddles();
    checkCollision();
    checkBallOutOfBounds();
}

function writeScore() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '5em monospace';
    ctx.fillStyle = '#fff';
    let width = ctx.measureText(player_left.score).width;
    ctx.fillText(player_left.score, canvas.width / 2 - width / 2 - 100, canvas.height / 15 + 30);

    width = ctx.measureText(player_right.score).width;
    ctx.fillText(player_right.score, canvas.width / 2 - width / 2 + 100, canvas.height / 15 + 30);
}

function drawBall() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawPlayerLeft() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(player_left.x, player_left.y, player_left.width, player_left.height);
}

function drawPlayerRight() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(player_right.x, player_right.y, player_right.width, player_right.height);
}

function drawPaddle() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(player_right.x, player_right.y, player_right.width, player_right.height);
}

function moveBall() {
    ball.x += ball.velocity_x;
    ball.y += ball.velocity_y;

    if (ball.x > canvas.width - ball.radius) {
        ball.velocity_x = -ball.velocity_x;
        player_left.score++;
    }

    if (ball.x < ball.radius) {
        ball.velocity_x = -ball.velocity_x;
        player_right.score++;
    }

    if (ball.y > canvas.height - ball.radius) {
        ball.velocity_y = -ball.velocity_y;
    }

    if (ball.y < ball.radius) {
        ball.velocity_y = -ball.velocity_y;
    }
}

function movePaddles() {
    if (VK_UP)
        player_right.y -= speed_player;
    if (VK_DOWN)
        player_right.y += speed_player;
    if (player_right.y < 0)
        player_right.y = 0;
    if (player_right.y > canvas.height - player_right.height)
        player_right.y = canvas.height - player_right.height;

    if (VK_W)
        player_left.y -= speed_player;
    if (VK_S)
        player_left.y += speed_player;
    if (player_left.y < 0)
        player_left.y = 0;
    if (player_left.y > canvas.height - player_left.height)
        player_left.y = canvas.height - player_left.height;
}

function checkCollision() {
    if (ball.x + ball.radius > player_left.x && ball.x - ball.radius < player_left.x + player_left.width)
        if (ball.y + ball.radius > player_left.y && ball.y - ball.radius < player_left.y + player_left.height)
            ball.velocity_x = -ball.velocity_x;

    if (ball.x + ball.radius > player_right.x && ball.x - ball.radius < player_right.x + player_right.width)
        if (ball.y + ball.radius > player_right.y && ball.y - ball.radius < player_right.y + player_right.height)
            ball.velocity_x = -ball.velocity_x;
}

function checkBallOutOfBounds() {
    if (ball.x > canvas.width - ball.radius) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }

    if (ball.x < ball.radius) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
    }
}

function checkForWin() {
    if (player_left.score === 10 || player_right.score === 10)
        location.reload();
}

document.onkeydown = function (e) {
    if (e.code === 'ArrowUp')
        VK_UP = true;
    if (e.code === 'ArrowDown')
        VK_DOWN = true;

    if (e.code === 'KeyW')
        VK_W = true;
    if (e.code === 'KeyS')
        VK_S = true;
}

document.onkeyup = function (e) {
    if (e.code === 'ArrowUp')
        VK_UP = false;
    if (e.code === 'ArrowDown')
        VK_DOWN = false;

    if (e.code === 'KeyW')
        VK_W = false;
    if (e.code === 'KeyS')
        VK_S = false;
}
