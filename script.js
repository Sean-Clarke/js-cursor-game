var cWidth = $(window).width() - 50;
var cHeight = $(window).height() - 50;

var posX = 0;
var posY = 0;

var circle;

var gameEnd = false;
var gameStart = false;

var count = 0;
var score = 0;

function start() {
    if (typeof circle === 'undefined') {
        circle = new component(50, "Blue", cWidth / 2, cHeight / 2, 1, 1);
    } else {
        circle.dx = 1;
        circle.dy = 1;
        circle.x = cWidth / 2;
        circle.y = cHeight / 2;
        count = 0;
        score = 0;
    }

    myGameArea.start();
    circle.update();
}
var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = cWidth;
        this.canvas.height = cHeight;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('mousemove', function(e) {
            myGameArea.posX = e.clientX;
            myGameArea.posY = e.clientY;
        });
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}



function component(radius, color, x, y, dx, dy) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.update = function() {
        ctx = myGameArea.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#003300';
        ctx.stroke();
        count++;
        score++;
        $('.score').text("score = " + score);
        console.log(count);
    }
    this.move = function() {
        checkBoundary();
        this.x += this.dx;
        this.y += this.dy;
    }
    this.reset = function() {
        this.dx = 1;
        this.dy = 1;
        this.x = cWidth / 2;
        this.y = cHeight / 2;
        count = 0;
        score = 0;
    }
}

function checkBoundary() {
    var bufferVal = 1;
    if ((circle.x + circle.radius > cWidth - bufferVal) || (circle.x - circle.radius < bufferVal)) {
        circle.dx *= -1;
    }
    if ((circle.y + circle.radius > cHeight - bufferVal) || (circle.y - circle.radius < bufferVal)) {
        circle.dy *= -1;
    }
}

function checkCursor() {
    if (((myGameArea.posX > circle.x - circle.radius) && (myGameArea.posX < circle.x + circle.radius)) && ((myGameArea.posY > circle.y - circle.radius) && (myGameArea.posY < circle.y + circle.radius))) {
        gameStart = true;
    } else {
        if (gameStart) {
            gameEnd = true;
        }
    }
}

function checkCount() {
    if (count > 150) {
        if (circle.dx > 0) {
            circle.dx += 1;
        } else if (circle.dx <= 0) {
            circle.dx -= 1;
        }
        if (Math.abs(circle.dx) >= 9) {
            circle.dx = 3;
        }
        count -= 150;
    }
}

function updateGameArea() {
    if (!gameStart) {
        checkCursor();
    }
    if (gameStart && !gameEnd) {
        $('.gameNotification').css('display', 'none');
        myGameArea.clear();
        checkCount();
        // console.log('X = ' + myGameArea.posX + ' Y = ' + myGameArea.posY);
        circle.move();
        checkCursor();
        circle.update();
    }
    console.log(gameEnd);
    if (gameEnd) {
        $('.gameNotification').css('display', 'block').text('press Enter to reset circle');
        $(window).keyup(function(e) {
            console.log(e.which);
            if (e.keyCode == 13) {
                console.log('enter');
                gameStart = false;
                gameEnd = false;
                circle.reset();
                myGameArea.clear();
                circle.update();
            }
        });
    }
}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
