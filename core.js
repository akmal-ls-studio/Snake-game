const main_board = document.getElementById("main_board");
const main_level = document.getElementById("main_level");
const main_interface = document.getElementsByClassName("interface")[0];
const main_control = document.getElementsByClassName("control")[0];
const main_btn_start = document.getElementById("main_btn_start");

const maxBox = 380;
const ctx = main_board.getContext("2d");
var gameId = "";
var grid = 0;
var count = 0;
var isPlaying = false;
var score = 0;

var level = {
  v:0,
  box:[38, 20, 10, 5],
  speed:[10, 7, 4, 1],
  desc:["Easy", "Medium", "Hard", "Asia"]
};

var ular = {
  x:0,
  y:0,
  dx:grid,
  dy:0,
  body:[],
  maxSize:3
};

var food = {
  x:getRandomInt(0, maxBox / level.box[level.v]) * grid,
  y:getRandomInt(0, maxBox / level.box[level.v]) * grid
};

main_level.addEventListener('input', () => {
  if(main_level.value < 1) {
    main_level.value = 1;
    return;
  }
  
  level.v = main_level.value - 1;
  grid = level.box[level.v];
  ular.dx = grid;
  ular.dy = 0;
  document.getElementsByClassName("main-label")[0].textContent = level.desc[level.v];
});

grid = level.box[level.v];
ular.dx = grid;
main_board.width = maxBox;
main_board.height = maxBox;
setTextToCanvas(["Wellcome . . .", "Snake Game v0.1", "", "©Limitless Studio 2025"], 20);

function frame() {
  gameId = requestAnimationFrame(frame);
  if (++count < level.speed[level.v]) {
    return;
  }
  
  count = 0;
  ctx.clearRect(0, 0, main_board.width, main_board.height);
  ular.x += ular.dx;
  ular.y += ular.dy;
  
  if (ular.x < 0) {
    ular.x = main_board.width - grid;
  } else if (ular.x >= main_board.width) {
    ular.x = 0;
  }
  
  if (ular.y < 0) {
    ular.y = main_board.height - grid;
  } else if (ular.y >= main_board.height) {
    ular.y = 0;
  }
  
  ular.body.unshift({x: ular.x, y: ular.y});
  if (ular.body.length > ular.maxSize) {
    ular.body.pop();
  }
  
  ctx.fillStyle = 'red';
  if(isPlaying) ctx.fillRect(food.x, food.y, grid-1, grid-1);

  ctx.fillStyle = 'skyblue';
  ular.body.forEach(function(cell, index) {
  if(isPlaying) ctx.fillRect(cell.x, cell.y, grid-1, grid-1);
    if (cell.x === food.x && cell.y === food.y) {
      ular.maxSize++;
      score += level.speed.toReversed()[level.v];
      food.x = getRandomInt(0, maxBox / level.box[level.v]) * grid;
      food.y = getRandomInt(0, maxBox / level.box[level.v]) * grid;
    }

    for (var i = index + 1;i < ular.body.length;i++) {
      if (cell.x === ular.body[i].x && cell.y === ular.body[i].y) {
        ctx.clearRect(0, 0, main_board.width, main_board.height);
        resetGame();
        setTextToCanvas(["Game Over!", `Your Score : ${score}`], 34);
      }
    }
  });
  
  document.getElementsByClassName("main-label")[1].textContent = score;
}

function setTextToCanvas(values, size) {
  ctx.fillStyle = 'white';
  ctx.font = `${size}px 'Jersey 10'`;
  ctx.textRendering = "geometricPrecision";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for(let i = 0;i < values.length;i++) {
    ctx.fillText(values[i], main_board.width / 2, (main_board.width / 2) + (i * size));
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

document.getElementById("main_btn_arrow_up").onclick = function () {
  if(ular.dy === 0) {
    ular.dy = -grid;
    ular.dx = 0;
  }
};

document.getElementById("main_btn_arrow_down").onclick = function () {
  if(ular.dy === 0) {
    ular.dy = grid;
    ular.dx = 0;
  }
};

document.getElementById("main_btn_arrow_left").onclick = function() {
  if (ular.dx === 0) {
    ular.dx = -grid;
    ular.dy = 0;
  }
};

document.getElementById("main_btn_arrow_right").onclick = function() {
  if (ular.dx === 0) {
    ular.dx = grid;
    ular.dy = 0;
  }
};

document.getElementById("main_btn_surrender").onclick = function() {
  document.getElementsByClassName("main-alert")[0].style.display = "block";
  cancelAnimationFrame(gameId);
};

document.getElementsByClassName("alert-content")[0].children[0].onclick = function() {
  document.getElementsByClassName("main-alert")[0].style.display = "none";
  requestAnimationFrame(frame);
};

document.getElementsByClassName("alert-content")[0].children[4].onclick = function() {
  document.getElementsByClassName("main-alert")[0].style.display = "none";
  ctx.clearRect(0, 0, main_board.width, main_board.height);
  resetGame();
  setTextToCanvas(["Game Over!", `Your Score : ${score}`], 34);
};

document.getElementById("main_btn_start").onclick = function() {
  food.x = getRandomInt(0, maxBox / level.box[level.v]) * grid;
  food.y = getRandomInt(0, maxBox / level.box[level.v]) * grid;
  ular.x = getRandomInt(0, maxBox / level.box[level.v]) * grid;
  ular.y = getRandomInt(0, maxBox / level.box[level.v]) * grid;
  
  isPlaying = true;
  score = 0;
  main_interface.style.display = "none";
  main_control.style.display = "block";
  requestAnimationFrame(frame);
};

function resetGame() {
  level.v = main_level.value - 1;
  ular.body = [];
  ular.maxSize = 3;
  ular.dy = 0;
  grid = level.box[level.v];
  ular.dx = grid;
  count = 0;
  food.x = 0;
  food.y = 0;
  isPlaying = false;
  cancelAnimationFrame(gameId);
  
  main_control.style.display = "none";
  main_interface.style.display = "block";
}
