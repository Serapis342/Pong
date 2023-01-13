let speed = 20;

window.onload = function () {
    window.canvas = document.getElementById('canvas');
    window.ctx = canvas.getContext("2d");
    document.body.style = 'margin: 0; padding: 0; overflow: hidden;';
    
    window.ball = {
        x: innerWidth / 2,
        y: Math.floor(Math.random() * innerHeight),
        velocity_x: Math.floor(Math.random() * innerWidth / 200 + 5),
        velocity_y: Math.floor(Math.random() * innerHeight / 200 + 5),
        size: canvas.width / 35,
        radius: canvas.width / 30,
    }

    window.paddle = {
        x: innerWidth - canvas.width / 50 - 30,
        y: canvas.height / 2,
        width: canvas.width / 20,
        height: canvas.height / 1.5,
    }

    window.player = {
        x: 30,
        y: canvas.height / 2,
        width: canvas.width / 20,
        height: canvas.height / 1.5,
    }

    window.score = 0;
    window.AI = false;

    resizeCanvas();
    draw();
    update();
    moveEnemy();
}

function draw()
{
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '5em monospace';
    ctx.fillStyle = '#fff';
    let width = ctx.measureText(score).width;
    ctx.fillText(score, canvas.width / 2 - width / 2, canvas.height / 15);

    drawBall();
    drawPlayer();
    drawPaddle();

    requestAnimationFrame(draw);
}

function drawBall()
{
    ctx.beginPath();
    ctx.strokeStyle = 'green';
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
    ctx.stroke();
}

function drawPlayer()
{
    ctx.fillStyle = '#fff';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPaddle()
{
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

window.onresize = function () {
    resizeCanvas();
    location.reload();
}

function resizeCanvas()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

document.onkeydown = function (e) {
    if(!AI) {
        if (e.code === "KeyW" || e.code === "ArrowUp") {
            player.y -= speed;
        }
        if (e.code === "KeyS" || e.code === "ArrowDown") {
            player.y += speed;
        }
    }
}

function update()
{
    if(player.y + player.height >= canvas.height)
    {
        player.y = canvas.height - player.height;
    } else if(player.y <= 0)
    {
        player.y = 0;
    } 

    if (ball.radius + ball.x > innerWidth)
        ball.velocity_x = 0 - ball.velocity_x;

    if (ball.x - ball.radius < 0)
        ball.velocity_x = 0 - ball.velocity_x;

    if (ball.y + ball.radius > innerHeight)
        ball.velocity_y = 0 - ball.velocity_y;

    if (ball.y - ball.radius < 0)
        ball.velocity_y = 0 - ball.velocity_y;

    ball.x += ball.velocity_x;
    ball.y += ball.velocity_y;

    if(ball.x + ball.radius >= player.x && ball.x - ball.radius <= player.x + player.width)
    {
        if(ball.y + ball.radius >= player.y && ball.y - ball.radius <= player.y + player.height)
        {
            ball.velocity_x = 0 - ball.velocity_x;
            if(!AI) score++;
        }
    }

    if(ball.x + ball.radius >= paddle.x && ball.x - ball.radius <= paddle.x + paddle.width)
    {
        if(ball.y + ball.radius >= paddle.y && ball.y - ball.radius <= paddle.y + paddle.height)
        {
            ball.velocity_x = 0 - ball.velocity_x;
        }
    }

    if(ball.x < player.x)
    {
        gameOver();
        ball.x = innerWidth / 2;
    }

    requestAnimationFrame(update);
}

document.addEventListener('touchstart', function (e) {
    if(e.touches[0].clientY < player.y + player.height / 2)
    {
        player.y -= speed;
    } else if(e.touches[0].clientY > player.y + player.height / 2)
    {
        player.y += speed;
    }
});

function moveEnemy()
{
    paddle.y = ball.y - paddle.height / 2;
    requestAnimationFrame(moveEnemy);
}

function gameOver()
{
    ctx.fillStyle = 'white';
    ctx.font = '12vw monospace';
    width = ctx.measureText('Game Over').width;
    ctx.fillText('Game Over', canvas.width / 2 - width / 2, canvas.height / 2);
    ctx.font = '8vw monospace';
    width = ctx.measureText('High Score: ' + localStorage.getItem('pong_highScore_serapis342')).width;
    ctx.fillText('High Score: ' + localStorage.getItem('pong_highScore_serapis342'), canvas.width / 2 - width / 2, canvas.height / 1.5);
    if(score > localStorage.getItem('pong_highScore_serapis342'))
    {
        localStorage.setItem('pong_highScore_serapis342', score);
    }
    
    AI = true;

    player.y = ball.y - player.height / 2;
    requestAnimationFrame(gameOver);

    document.onkeydown = function (e) {
        if (e.code === "Space" || e.code === "Enter" || e.code === "NumpadEnter" || e.code === "KeyR") {
            location.reload();
        }
    }
}