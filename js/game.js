// creates the game
var game = new Phaser.Game(400, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update});
var leaderboard = [];
// defines the preloaded things
function preload() {
    game.load.spritesheet('player', 'assets/fish-sprite.png', 80, 80, 8);
    game.load.spritesheet('rock', 'assets/rock-sprite.png', 80, 80);
    game.load.spritesheet('cannon', 'assets/cannon.png', 80, 80);
    game.load.spritesheet('playbutton', 'assets/playbutton.png', 220, 90, 2);
    game.load.spritesheet('menubutton', 'assets/menubutton.png', 220, 90, 2);
    game.load.spritesheet('infobutton', 'assets/infobutton.png', 220, 90, 2);
    game.load.spritesheet('startscreen','assets/startscreen.jpg',600,400);
    game.load.spritesheet('river','assets/river.jpg',600,400);
}
// first menu site variables
var gameMenu = true;
var menuText;
var counterMenu = 0;

// instruction menu
var instructionMenu;

// global variables for the players
var enemies;
var player;

// global variables for the keys
var leftKey;
var rightKey;
var pressTime;

// global variable for count of created enemies per round
var enemyCount = 0;
var oldX;
var doubleCreated = 0;
var doubleCreatedCount = 0;

// global variables for the text that's always on the screen
var health = 100;
var text;
var score = 0;
var scoreText;
var level = 1;
var levelText;

// global variables for the timer
var timer = Phaser.Timer.SECOND;
var timerRun;

// global variable for the button
var button;
var button2;

// global variable for the update to only run the gameOver-function once
var deathCount = 0;

// This is where the game is initially created.
// It starts with activating the physics from Phaser.js,
// then adds the background color, creates the enemy group and creates the first enemy,
// creates our player. Then it sets the size of the player and the enemies and
// starts the animation of the player.
// It writes all the text that is rendered to the screen all the time and sets the position for it.
// It adds the game physics to the enemies and the player.
// It adds to the global variables the keys and starts the timer.

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    menuImage = game.add.image(0,0,'startscreen');
    game.canvas.id = "game";
    backgroundImage = game.add.image(0, 0, 'river');
    enemies = game.add.group();
    enemies.createMultiple(1, 'rock', 0, false);
    cannons = game.add.group();
    cannons.createMultiple(1, 'cannon', 0, false);

    player = game.add.sprite(150, 470, 'player');

    player.scale.setTo(1.2,1.2);
    enemies.scale.setTo(1.05, 1.2);
    cannons.scale.setTo(1.05, 1.2);

    player.animations.add('run');
    player.animations.play('run', 10, true);

    scoreText = game.add.text(game.world.centerX, game.world.centerY + 40, 'Score: 0', { font: "32px Arial", fill: "#ffffff", align: "center" });
    scoreText.anchor.setTo(0.5, 0.5);
    text = game.add.text(game.world.centerX, game.world.centerY, 'Health: 100', { font: "32px Arial", fill: "#ffffff", align: "center" });
    text.anchor.setTo(0.5, 0.5);
    levelText = game.add.text(game.world.centerX, 20, 'Level: 1', { font: "32px Arial", fill: "#ffffff", align: "center" });
    levelText.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable([ enemies, player, cannons ], Phaser.Physics.ARCADE);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    timerRun = game.time.events.loop(timer, updateCounter, this);
}

// Ressurect creates the enemies. It chooses by random which of the three
// x-positions it starts at, adds the image and the frame and then creates the enemy.
// then it adds the physics for the enemy.

function resurrect() {
    //position that the enemy is placed
    var x = Math.floor(Math.random() * 3) * 150;
    var y = 0;
    //the image it takes
    var key = 'rock';

    var frame = game.rnd.between(0, 36);

    // Checking if it has created two on the last round. If it has, this determends where the next rock is placed.
    // After a double row there can only be a single row.
    if(doubleCreated === 1) {
        if(x === 150) {
            for (var i = 1; i < enemies.children.length; i++) {

                if (x === enemies.children[i].position.x &&
                    y + 100 === enemies.children[i].position.y){

                    if (x + 150 === enemies.children[i - 1].position.x &&
                        y + 100 === enemies.children[i - 1].position.y) {
                         x = 0;
                    }

                    else if(x - 150 === enemies.children[i - 1].position.x &&
                            y + 100 === enemies.children[i - 1].position.y) {
                         x = 0;
                    }
                }

                else if(x === enemies.children[i - 1].position.x &&
                        y + 100 === enemies.children[i - 1].position.y) {

                    if (x + 150 === enemies.children[i].position.x &&
                        y + 100 === enemies.children[i].position.y) {
                        x = 300;
                    }

                    else if(x - 150 === enemies.children[i].position.x &&
                            y + 100 === enemies.children[i].position.y) {
                        x = 300;
                    }
                }
            }
        }
    }

    // If there's been two enemies created it adds to the double count

    if(enemyCount === 2) {
        doubleCreated ++;
    }

    // where the next one is placed
    if(enemyCount === 2 && player.x === 300 && (oldX === 300 || oldX === 150) && !doubleCreated) {
        x === 0;
    }
    else if(enemyCount === 2 && player.x === 0 && (oldX == 150 || oldX === 0) && !doubleCreated) {
        x === 300;
    }
    else if(x === oldX) {
        if(x === 0) {
            x = 150;
        }
        else if(x === 150) {
            x = 300;
        }
        else {
            x = 0;
        }
    }
    //replace the last x with the new x
    oldX = x;
    //creates a new enemy
    enemies.getFirstDead(true, x, y, key, frame);
    //adds the physics to the enemy
    game.physics.arcade.enable([ enemies, player ], Phaser.Physics.ARCADE);

}


function buildRocket() {
    //position that the enemy is placed
    var x = Math.floor(Math.random() * 3) * 150;
    var y = 0;
    //the image it takes
    var key = 'cannon';

    var frame = game.rnd.between(0, 36);
    //creates a new cannon
    cannons.getFirstDead(true, x, y, key, frame);
    //adds the physics to the enemy
    game.physics.arcade.enable(cannons, Phaser.Physics.ARCADE);

}
// This function adds takes away health when timer runs and sets the new text.
// It also does this when a key has been pressed so that the health, score and level
// are correct.

function updateCounter() {
    if(!gameMenu) {
        if(health > 0) {
            health --;
        }
        text.setText('Health: ' + health);
        scoreText.setText('Score: ' + score);
        levelText.setText('Level: ' + level);
    }
}

//The other of the big functions.
// 1) Checks if health is over 0. If not, it runs the gameOver-function (only once though).
// 2) Checks if up-, left- or right-key is down.
// 3) Checks if the button has already been pressed this time, if it has it does nothing

function update() {
    if(!gameMenu) {
        menuText.setText('');
        if(health > 0) {
            if(upKey.isDown){

                // 4) If the statment below is true, the function first moves all enemies,
                // changes the pressTime to the time that the button was pressed, creates a new enemy
                // and adds health and score to the player.

                if(pressTime != upKey.timeDown) {

                    for (var i = 0; i < enemies.children.length; i++) {
                        enemies.children[i].position.y += 100;
                    }
                    if(cannons.children.length > 0) {
                        for (var i = 0; i < cannons.children.length; i++) {
                            cannons.children[i].position.y += 100;
                        }
                    }
                    pressTime = upKey.timeDown;
                    enemyCount ++;
                    resurrect();
                    if(level >= 5 && doubleCreated === 0) {
                        if(Math.floor(Math.random() * 2) === 1) {
                            enemyCount ++;
                            resurrect();
                        }
                    }
                    else {
                        doubleCreated = 0;
                    }
                    if(health <= 99) {
                        health = health + 2;
                    }
                    score ++;

                    // 5) If the score is more than 20 and evenly devided with 20 you level up,
                    // get 10 points more health, changes the timer to a faster pace, empties the timer
                    // and adds the new one

                    if(score >= 20 && score % 20 === 0) {
                        level ++;
                        if(health <= 91) {
                            health = health + 10;
                        }
                        else {
                            health = 101;
                        }
                        timer = timer/1.2;
                        timerRun.timer.events = [];
                        timerRun = game.time.events.loop(timer, updateCounter, this);
                    }
                    if(score === 10 || score % 10 === 0) {
                        buildRocket();
                    }
                    updateCounter();
                    enemyCount = 0;
                }
            }
            else if (leftKey.isDown){

                // 4) If the statment below is true, the function first moves the player
                // (if it's in the middle to the far left and if it's far right to the middle)
                // and all enemies, changes the pressTime to the time that the button was pressed,
                // creates a new enemy and adds health and score to the player.

                if(pressTime != leftKey.timeDown) {
                    if(player.x <= 150) {
                        player.x = 0;
                        for (var i = 0; i < enemies.children.length; i++) {
                            enemies.children[i].position.y += 100;
                        }
                        if(cannons.children.length > 0) {
                            for (var i = 0; i < cannons.children.length; i++) {
                                cannons.children[i].position.y += 100;
                            }
                        }
                    }
                    else{
                        player.x = player.x - 150;
                        for (var i = 0; i < enemies.children.length; i++) {
                            enemies.children[i].position.y += 100;
                        }
                        if(cannons.children.length > 0) {
                            for (var i = 0; i < cannons.children.length; i++) {
                                cannons.children[i].position.y += 100;
                            }
                        }

                    }
                    pressTime = leftKey.timeDown;
                    enemyCount ++;
                    resurrect();
                    if(level >= 5 && doubleCreated === 0) {
                        if(Math.floor(Math.random() * 2) === 1) {
                            enemyCount ++;
                            resurrect();
                        }
                    }
                    else {
                        doubleCreated = 0;
                    }
                    if(health <= 99) {
                        health = health + 2;
                    }
                    score ++;

                    // 5) If the score is more than 20 and evenly devided with 20 you level up,
                    // get 10 points more health, changes the timer to a faster pace, empties the timer
                    // and adds the new one

                    if(score >= 20 && score % 20 === 0) {
                        level ++;
                        if(health <= 91) {
                            health = health + 10;
                        }
                        else {
                            health = 101;
                        }
                        levelText.setText('Level: ' + level);
                        timer = timer/1.2;
                        timerRun.timer.events = [];
                        timerRun = game.time.events.loop(timer, updateCounter, this);
                    };
                    if(score === 10 || score % 10 === 0) {
                        buildRocket();
                    }
                    updateCounter();
                    enemyCount = 0;
                };
            }
            else if (rightKey.isDown) {

                // 4) If the statment below is true, the function first moves the player
                // (if it's in the middle to the far right and if it's far left to the middle)
                // and all enemies, changes the pressTime to the time that the button was pressed,
                // creates a new enemy and adds health and score to the player.

                if(pressTime != rightKey.timeDown) {
                    if(player.x >= 150){
                        player.x = 300
                        for (var i = 0; i < enemies.children.length; i++) {
                            enemies.children[i].position.y += 100;
                        };
                        if(cannons.children.length > 0) {
                            for (var i = 0; i < cannons.children.length; i++) {
                                cannons.children[i].position.y += 100;
                            }
                        }
                    }
                    else {
                        player.x = player.x + 150;
                        for (var i = 0; i < enemies.children.length; i++) {
                            enemies.children[i].position.y += 100;
                        };
                        if(cannons.children.length > 0) {
                            for (var i = 0; i < cannons.children.length; i++) {
                                cannons.children[i].position.y += 100;
                            }
                        }
                    };
                    pressTime = rightKey.timeDown;
                    enemyCount ++;
                    resurrect();
                    if(level >= 5 && doubleCreated === 0) {
                        if(Math.floor(Math.random() * 2) === 1) {
                            enemyCount ++;
                            resurrect();
                        };
                    }
                    else {
                        doubleCreated = 0;
                    };
                    if(health <= 99) {
                        health = health + 2;
                    };
                    score ++;

                    // 5) If the score is more than 20 and evenly devided with 20 you level up,
                    // get 10 points more health, changes the timer to a faster pace, empties the timer
                    // and adds the new one

                    if(score >= 20 && score % 20 === 0) {
                        level ++;
                        if(health <= 90) {
                            health = health + 10
                        }
                        else {
                            health = 101
                        };
                        levelText.setText('Level: ' + level);
                        timer = timer/1.2;
                        timerRun.timer.events = [];
                        timerRun = game.time.events.loop(timer, updateCounter, this);
                    };
                    if(score === 10 || score % 10 === 0) {
                        buildRocket();
                    }
                    updateCounter();
                    enemyCount = 0;
                };
            };
            // checks if the player and the specific enemy overlaps
            for (var i = 0; i < enemies.children.length; i++) {
                game.physics.arcade.overlap(enemies.children[i], player, gameOver, null, this);
                game.physics.arcade.overlap(cannons.children[i], player, jumpForward, null, this);
            };
        }
        else {
            //checks if there's been a deathcount, if there has been it starts the gameOver-screen
            if(deathCount === 0) {
                gameOver();
                gameMenu = !gameMenu;
            };
        };
    }
    //if gameMenu is true it either shows the menu or instruction screen
    else {
        if(counterMenu === 0) {
            startGame();
            counterMenu ++;
        };
        if(instructionMenu) {
            gameInstruction();
        };
    };
};

// First screen. Makes player invisible, sets the background, the texts and buttons.

function startGame() {
    backgroundImage.visible = false;
    player.visible = false;
    if(menuText === undefined) {
        menuText = game.add.text(game.world.centerX, 100, 'VesiPomppuPeli', { font: "32px Arial", fill: "#ffffff", align: "center" });
    }
    else {
        menuText.setText('VesiPomppuPeli');
    };
    menuText.anchor.setTo(0.5, 0.5);
    levelText.setText('');
    scoreText.setText('');
    text.setText('');
    if(button !== undefined) {
        button.kill();
    };
    button = game.add.button(game.world.centerX - 95, 250, 'playbutton', start, this, 1, 2, 0); 
    if(button2 !== undefined) {
        button2.kill();
    };
    button2 = game.add.button(game.world.centerX - 95, 350, 'infobutton', instruction, this, 1, 2, 0);
};

// What is shown in the instructions-screen. First makes the play-button invisible, then sets the background and sets the text.

function gameInstruction() {
    button.inputEnabled = false;
    button.visible = false;
    game.stage.backgroundColor = '#000000';
    menuText.setText('How to play the game?\n Watch out for the stones! \n Use the arrows to move');
    if(button2 !== undefined) {
        button2.kill();
        button2 = game.add.button(game.world.centerX - 95, 350, 'menubutton', backInstruction, this, 1, 2, 0);
    };
};

// gameOver screen. First changes the background color to red,
// sets deathcount to 1, health to 0 and updates the Counter.
// Kills the enemies that are alive and kills the player.
// adds the restart button.

function gameOver() {
    game.stage.backgroundColor = '#992d2d';
    deathCount ++;
    health = 0;
    updateCounter();

    for (var i = 0; i < enemies.children.length; i++) {
        enemies.children[i].kill();
    }

    player.kill();

    button = game.add.button(game.world.centerX - 110, 400, 'playbutton', reset, this, 0, 0, 0);
    button2 = game.add.button(game.world.centerX - 110, 500, 'menubutton', startGame, this, 0, 0, 0);
    gameMenu = !gameMenu;
    var name = prompt("Add your name to your score to the scoreboard!", "");
    var newChildRef = ref.push();
    newChildRef.set({
        name: name,
        score: score
    });
    getData();
};

function jumpForward() {
    console.log("something happened");
}

function toObject(names, values) {
        var result = {};
        for (var i = 0; i < names.length; i++) {
             result[names[i]] = values[i];
        }
        console.log(result);
        return result;
};

// function that starts the game.

function start() {
    reset();
};

// The intruction menu is shown

function instruction() {
    instructionMenu = true;
};

// The back-button in the instruction menu. Resets menucounter, shows the play button and changes the background back.

function backInstruction() {
    counterMenu = 0;
    button.inputEnabled = true;
    button.visible = true;
    instructionMenu = false;
    game.stage.backgroundColor = '#00FF00';
};

// Adds the player to the bottom center, empties the enemy group and creates a new one. Set the scale.
// adds the run animation for the player, sets the score, health and level and updates the counter and sets deathcount.
// Enables the physics for the enemies and player. Sets the background, makes the button invisible and untouchable.
// Empties the timers, sets the time for the timer and creates the new timer.

function reset() {
    backgroundImage.visible = true;
    player = game.add.sprite(150, 470, 'player');
    enemies = game.add.group();
    enemies.createMultiple(1, 'rock', 0, false);

    player.scale.setTo(1.2,1.2);
    enemies.scale.setTo(1.05, 1.2);

    player.animations.add('run');
    player.animations.play('run', 10, true);
    gameMenu = false;
    score = 0;
    health = 101;
    level = 1;
    updateCounter();
    deathCount = 0;
    game.physics.arcade.enable([ enemies, player ], Phaser.Physics.ARCADE);
    button.kill();
    button2.kill();
    timerRun.timer.events = [];
    timer =  Phaser.Timer.SECOND;
    timerRun = game.time.events.loop(timer, updateCounter, this);
    timerRun;
};

