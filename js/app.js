// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = x;
    this.y = y;
    this.speed = speed;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/racecar.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x = this.x + this.speed * dt;

    // Enemies move back to left side once they reach right side.
    if (this.x >= 1414) {
        this.x = 0;
    }

    // Check for collision with enemies or barrier-walls
    checkCollision(this);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//var Log = function (x, y, speed) {
//    this.x = x;
//    this.y = y;
//    this.speed = speed;
//    this.sprite = 'images/log.png';
//}
//
//Log.prototype.update = function (dt) {
//    this.x = this.x - this.speed * dt;
//    if (this.x <=0) {
//        this.x = 1414;
//    }
//}
//
//// Draw the logs on the screen
//Log.prototype.render = function() {
//    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
//}

// a frog picks up a gem for points
var Gem = function (id, x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/gem_blue.png';
    this.id = id;
}

// draws the gems to the canvas
Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// updates the gems and moves them accross canvas
Gem.prototype.update = function(dt) {
    this.x = this.x - this.speed * dt;
    if (this.x <=0) {
        this.x = 1414;
    }
    
    // determine if player has collected a gem
    if (
        player.y + 131 >= this.y + 90
        && player.x + 25 <= this.x + 88
        && player.y + 73 <= this.y + 135
        && player.x + 76 >= this.x + 11) {
        
        score ++;
        var index = allGems.indexOf(this);
        allGems.splice( index, 1 ); 
        if (allGems.length == 0) {
            var canvas = document.getElementsByTagName('canvas');
            var firstCanvasTag = canvas[0];

            // add player score and level to div element created
            congratsDiv.innerHTML = "Congratulations you got all of the gems on this Level!";
            document.body.insertBefore(congratsDiv, firstCanvasTag[0]);
        }
    }
        
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(x, y, start_x, start_y, speed, lives) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.sprite = 'images/classic_frog.png';
    this.start_x = start_x;
    this.start_y = start_y;
    this.lives = lives;
};

// Draw the player on the screen, required method for game
// Display score
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    displayScoreLevel(score, gameLevel);
    displayLives(this.lives);
};

Player.prototype.handleInput = function(keyPress) {
    if (keyPress == 'left') {
        player.x -= player.speed;
    }
    if (keyPress == 'up') {
        player.y -= player.speed - 20;
    }
    if (keyPress == 'right') {
        player.x += player.speed;
    }
    if (keyPress == 'down') {
        player.y += player.speed - 20;
    }
    console.log('keyPress is: ' + keyPress);
};

// Function to display player's score
var displayScoreLevel = function(aScore, aLevel) {
    var canvas = document.getElementsByTagName('canvas');
    var firstCanvasTag = canvas[0];

    // add player score and level to div element created
    scoreDiv.innerHTML = 'Gems: ' + aScore;
    document.body.insertBefore(scoreDiv, firstCanvasTag[0]);
    
    levelDiv.innerHTML = 'Level: ' + aLevel;
    document.body.insertBefore(levelDiv, firstCanvasTag[0]);
};

// Function to display player's lives
var displayLives = function(aLives) {
    var canvas = document.getElementsByTagName('canvas');
    var firstCanvasTag = canvas[0];

    // add player score and level to div element created
    livesDiv.innerHTML = 'Lives ' + aLives;
    document.body.insertBefore(livesDiv, firstCanvasTag[0]);
};

var checkCollision = function(anEnemy) {
    // check for collision between enemy and player
    if (
        player.y + 131 >= anEnemy.y + 90
        && player.x + 25 <= anEnemy.x + 88
        && player.y + 73 <= anEnemy.y + 135
        && player.x + 76 >= anEnemy.x + 11) {
        console.log('collided');
        player.x = player.start_x;
        player.y = player.start_y;
        player.lives --;
        if (player.lives < 0) {
            alert("GAME OVER!!!    Gems: " + score + " - Level: " + gameLevel);
            resetGame();
        }
    }

    // check for player reaching top of canvas and winning the game
    // if player wins, add 1 to the score and level
    // pass score as an argument to the increaseDifficulty function
    if (player.y + 63 <= 0) {        
        player.x = player.start_x;
        player.y = player.start_y;
        console.log('you made it!');

        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 505, 171);

        gameLevel += 1;
        console.log('current score: ' + score + ', current level: ' + gameLevel);
        increaseDifficulty(gameLevel*2);
        
        for (var i = 0; i<gameLevel+1; i++) {
            var gem = new Gem(0, Math.random() * 1300, Math.random() * 450 + 270, Math.random() * 300);
            allGems.push(gem);
        }
        var body = document.getElementsByTagName('body');
        var congrats = document.getElementById('congrats');
        
//        body.removeChild(congrats);
        congrats.remove();
        
    }

    // check if player runs into left, bottom, or right canvas walls
    // prevent player from moving beyond canvas wall boundaries
    if (player.y > 790 ) {
        player.y = 790;
    }
    if (player.x > 1313) {
        player.x = 1313;
    }
    if (player.x < 0) {
        player.x = 0;
    }
};

// Increase number of enemies on screen based on player's score
var increaseDifficulty = function(numEnemies) {
    // remove all previous enemies on canvas
    allEnemies.length = 0;

    // load new set of enemies
    for (var i = 0; i <= numEnemies; i++) {
        var enemy = new Enemy(0, Math.random() * 420 + 290, Math.random() * 300);
        allEnemies.push(enemy);
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Enemy randomly placed vertically within section of canvas
// Declare new score and gameLevel variables to store score and level
var allEnemies = [];
//var allLogs = [];
var allGems = [];
var player = new Player(605, 790, 605, 790, 103, 3);
var score = 0;
var gameLevel = 1;
var scoreDiv = document.createElement('div');
scoreDiv.id = "score";
var levelDiv = document.createElement('div');
levelDiv.id = "level";
var congratsDiv = document.createElement('div');
congratsDiv.id = "congrats";
var livesDiv = document.createElement('div');
livesDiv.id = "lives";
var enemy = new Enemy(0, Math.random() * 420 + 290, Math.random() * 300);
//var log = new Log(1000, 120, Math.random() * 300);
//var log1 = new Log(1000, 200, Math.random() * 300);
//var log2 = new Log(1000, 280, Math.random() * 300);

// create all of the gems
for (var i = 0; i<gameLevel+2; i++) {
    var gem = new Gem(0, Math.random() * 1300, Math.random() * 450 + 270, Math.random() * 300);
    allGems.push(gem);
}

allEnemies.push(enemy);
//allLogs.push(log, log1, log2);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    console.log(allowedKeys[e.keyCode]);
});

// resets everything back to starting point.
var resetGame = function () {
    allEnemies = []
    score = 0;
    gameLevel = 1;
    player.lives = 3;
    var enemy = new Enemy(0, Math.random() * 420 + 290, Math.random() * 300);
    allEnemies.push(enemy);
}

