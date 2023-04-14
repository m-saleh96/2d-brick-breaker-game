const level = document.getElementById('level');
const easy = document.getElementById('easy');
const medium = document.getElementById('medium');
const difficult = document.getElementById('difficult');
let life = 3;
let GAME_END = false;
let SCORE = 0;
const SCORE_Count = 10;
const ballRadius = 10;
let ballSpeed;
let row;
let col;
let brick;
let ball;
let bricks = [];
//--------------------------------------------

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const BG_IMG = new Image();
BG_IMG.src = 'images/main1.jpg';

const gameOver_IMG = new Image();
gameOver_IMG.src = 'images/gameover.png';

const winImg = new Image();
winImg.src = 'images/win.png';

// select level and return ballSpeed
easy.addEventListener('click', function () {
  level.style = 'display : none;';

  ballSpeed = 4;

  ball = {
    x: canvas.width / 2,
    y: paddle.y - ballRadius,
    r: ballRadius,
    speed: ballSpeed,
    dx: ballSpeed,
    dy: ballSpeed,
  };

  row = 4;
  col = 5;
  brick = {
    row,
    col,

    width: 90,
    height: 30,
    offsetLeft: 55,
    offsetTop: 23,
    marginTop: 30,
    fillColor: 'aqua',
    strokeColor: '#FFFFFF',
  };
  createBricks();
  loop();
});
medium.addEventListener('click', function () {
  level.style = 'display : none;';
  ballSpeed = 6;

  ball = {
    x: canvas.width / 2,
    y: paddle.y - ballRadius,
    r: ballRadius,
    speed: ballSpeed,
    dx: ballSpeed,
    dy: -3,
  };

  row = 5;
  col = 5;
  brick = {
    row,
    col,

    width: 90,
    height: 30,
    offsetLeft: 55,
    offsetTop: 23,
    marginTop: 30,
    fillColor: 'aqua',
    strokeColor: '#FFFFFF',
  };
  createBricks();
  loop();
});
difficult.addEventListener('click', function () {
  level.style = 'display : none;';
  ballSpeed = 7;

  ball = {
    x: canvas.width / 2,
    y: paddle.y - ballRadius,
    r: ballRadius,
    speed: ballSpeed,
    dx: ballSpeed,
    dy: -3,
  };

  brick = {
    row: 6,
    col: 7,

    width: 90,
    height: 30,
    offsetLeft: 20,
    offsetTop: 24,
    marginTop: 30,
    fillColor: 'aqua',
    strokeColor: '#FFFFFF',
  };
  createBricks();
  loop();
});

//------------------create paddle-----------------------------
let paddleWidth = 120;
let paddleHeight = 25;
ctx.lineWidth = 3;

const paddle = {
  x: canvas.width / 2 - paddleWidth / 2,
  y: canvas.height - paddleHeight - 30,
  width: paddleWidth,
  height: paddleHeight,
  dx: 5,
};

function drawPaddle() {
  ctx.fillStyle = '#CC0033';
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.strokeStyle = '#FFFF00';
  ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

//-----------------controll paddle---------
let leftArrow = false;
let rightArrow = false;

// controll with Arrows
document.addEventListener('keydown', function (e) {
  if (e.code === 'ArrowLeft') {
    leftArrow = true;
  } else if (e.code === 'ArrowRight') {
    rightArrow = true;
  }
});
document.addEventListener('keyup', function (e) {
  if (e.code === 'ArrowLeft') {
    leftArrow = false;
  } else if (e.code === 'ArrowRight') {
    rightArrow = false;
  }
});
// controll with Mouse
document.addEventListener('mousemove', function (e) {
  let relativeX = e.clientX - canvas.offsetLeft; // mouse postion
  if (
    relativeX > paddleWidth / 2 &&
    relativeX + paddleWidth / 2 < canvas.width
  ) {
    paddle.x = relativeX - paddleWidth / 2;
  }
});

function movePaddle() {
  if (rightArrow && paddle.x + paddleWidth < canvas.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

//----------------create a ball-----------------

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fillStyle = '#CC0033';
  ctx.fill();
  ctx.strokeStyle = '#FFFF00';
  ctx.stroke();
  ctx.closePath();
}

//---------------move ball----------------------
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}
//---------------Ball wall Collision----------------
function ballWallCollision() {
  if (ball.x + ball.r > canvas.width || ball.x - ball.r < 0) {
    ball.dx = -ball.dx;
    WALLHIT.play();
  }
  if (ball.y - ball.r < 0) {
    ball.dy = -ball.dy;
    WALLHIT.play();
  }
  if (ball.y + ball.r > canvas.height) {
    life--;
    LIFELOST.play();
    resetball();
  }
}
//---------------resetball function------------
function resetball() {
  ball.x = canvas.width / 2;
  ball.y = paddle.y - ballRadius;
  ball.dx = 4;
  ball.dy = -4;
}
// BALL AND PADDLE COLLISION
function ballPaddleCollision() {
  if (
    ball.x < paddle.x + paddle.width &&
    ball.x > paddle.x &&
    paddle.y < paddle.y + paddle.height &&
    ball.y > paddle.y
  ) {
    PADDLEHIT.play();
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);
    collidePoint = collidePoint / (paddle.width / 2);
    let angle = (collidePoint * Math.PI) / 3;
    ball.dx = ballSpeed * Math.sin(angle);
    ball.dy = -ballSpeed * Math.cos(angle);
  }
}

//--------------------Bricks------------------

// Creating the bricks array function
function createBricks() {
  for (let row = 0; row < brick.row; row++) {
    //bricks in rows
    bricks[row] = [];

    //for loop for every brick in row and columns
    for (let column = 0; column < brick.col; column++) {
      //every brick
      bricks[row][column] = {
        // x axis for every brick on columns
        x: column * (brick.width + brick.offsetLeft) + brick.offsetLeft,
        //y axis for every brick on rows
        y:
          row * (brick.height + brick.offsetTop) +
          brick.offsetTop +
          brick.marginTop,

        //state of the brick
        state: 2,
      };
    }
  }
}



//Drawing the bricks on the screen

function drawBricks() {
  for (let row = 0; row < brick.row; row++) {
    for (let column = 0; column < brick.col; column++) {
      if (bricks[row][column].state === 2) {
        ctx.beginPath();
        ctx.fillStyle = brick.fillColor;
        ctx.fillRect(
          bricks[row][column].x,
          bricks[row][column].y,
          brick.width,
          brick.height
        );
        ctx.closePath();
      }
      if (bricks[row][column].state === 1) {
        ctx.beginPath();
        ctx.fillStyle = '#FFFF00';
        ctx.fillRect(
          bricks[row][column].x,
          bricks[row][column].y,
          brick.width,
          brick.height
        );
        ctx.closePath();
      }
    }
  }
}

//ball brick collision

function brickCollision() {
  for (let row = 0; row < brick.row; row++) {
    for (let column = 0; column < brick.col; column++) {
      if (bricks[row][column].state > 0) {
        if (
          ball.x + ball.r > bricks[row][column].x && //right
          ball.x - ball.r < bricks[row][column].x + brick.width && // left
          ball.y + ball.r > bricks[row][column].y && // bottom
          ball.y - ball.r < bricks[row][column].y + brick.height // top
        ) {
          // console.log(bricks[row][column]);
          //change ball direction on hit
          ball.dy = -ball.dy;
          BRICKHIT.play();

          //decrement state by 1
          bricks[row][column].state--;

          console.log(bricks[row][column].state);
          SCORE += SCORE_Count;
        }
      }
    }
  }
}

function winGame() {
  let win = true;

  for (let row = 0; row < brick.row; row++) {
    for (let col = 0; col < brick.col; col++) {
      win = win && bricks[row][col].state === 0;
    }
  }

  if (win) {
    let winSound = new Audio();
    winSound.src = 'sounds/win.mp3';
    winSound.play();
    ctx.drawImage(winImg, 68, 120);
    if (state ==0  ){
      return false;
    }
  }
}

// show game life
function showGameStats(text, textX, textY, img, imgX, imgY) {
  // draw text
  ctx.fillStyle = '#FFF';
  ctx.font = '25px Germania One';
  ctx.fillText(text, textX, textY);

  // draw image
  ctx.drawImage(img, imgX, imgY, (width = 40), (height = 40)); //size image
}

//----------------draw Function------------------
const LIFE_IMG = new Image();
LIFE_IMG.src = 'images/life.png';

const SCORE_IMG = new Image();
SCORE_IMG.src = 'images/score.png';

function draw() {
  drawPaddle();
  drawBall();
  drawBricks();

  // SHOW LIVES
  showGameStats(life, canvas.width - 25, 30, LIFE_IMG, canvas.width - 70, 5);
  // SHOW SCORE
  showGameStats(SCORE, 65, 35, SCORE_IMG, 10, 5);
}

// game over

function gameOver() {
  if (life <= 0) {
    showYouLose();
    GAME_END = true;
  }
}

const WALLHIT = new Audio();
WALLHIT.src = 'sounds/wall.mp3';

const LIFELOST = new Audio();
LIFELOST.src = 'sounds/life_lost.mp3';

const PADDLEHIT = new Audio();
PADDLEHIT.src = 'sounds/paddle_hit.mp3';

const BRICKHIT = new Audio();
BRICKHIT.src = 'sounds/brick_hit.mp3';

// SELECT SOUND ELEMENT
const soundElement = document.getElementById('sound');

soundElement.addEventListener('click', audioManager);

function audioManager() {
  // CHANGE IMAGE SOUND_ON/OFF

  let imgSrc = soundElement.getAttribute('src');
  let SOUND_IMG =
    imgSrc == 'images/SOUND_ON.png'
      ? 'images/SOUND_OFF.png'
      : 'images/SOUND_ON.png';

  soundElement.setAttribute('src', SOUND_IMG);

  // MUTE AND UNMUTE SOUNDS
  WALLHIT.muted = WALLHIT.muted ? false : true;
  PADDLEHIT.muted = PADDLEHIT.muted ? false : true;
  BRICKHIT.muted = BRICKHIT.muted ? false : true;
  LIFELOST.muted = LIFELOST.muted ? false : true;
}

//----------------update function for logic------------
function update() {
  movePaddle();
  moveBall();
  ballWallCollision();
  ballPaddleCollision();
  brickCollision();
  gameOver();
  winGame();
}

//------------------loop function-----------------
function loop() {
  ctx.drawImage(BG_IMG, 0, 0);
  draw();
  // debugger;
  update();

  if (!GAME_END) {
    requestAnimationFrame(loop);
  } else {
    setTimeout(() => {
      location.reload();
    }, 3000);
    ctx.drawImage(gameOver_IMG, 110, 110);
  }
}
// const gameover = document.getElementById("gameover");
function showYouLose() {
  gameover.style.display = 'block';
  youlose.style.display = 'block';
}
