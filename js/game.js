// creates the game
var game = new Phaser.Game(400, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update});
var leaderboard = [];
// defines the preloaded things
function preload() {

    // all sprites for players, buttons, backgrounds and logo
    game.load.spritesheet('player', 'assets/images/fish-sprite.png', 80, 80, 8);
    game.load.spritesheet('rock', 'assets/images/rock-sprite.png', 80, 80);
    game.load.spritesheet('cannon', 'assets/images/cannon.png', 80, 80);
    game.load.spritesheet('playbutton', 'assets/images/playbutton.png', 220, 90, 2);
    game.load.spritesheet('menubutton', 'assets/images/menubutton.png', 220, 90, 2);
    game.load.spritesheet('infobutton', 'assets/images/infobutton.png', 220, 90, 2);
    game.load.spritesheet('startscreen','assets/images/startscreen.jpg',600,400);
    game.load.spritesheet('river','assets/images/river.jpg',600,400);
    game.load.spritesheet('logo', 'assets/images/logo.png', 300, 270);
    
    // all sprites for the health bar
    game.load.spritesheet('health10', 'assets/images/health10.png', 50, 170);
    game.load.spritesheet('health20', 'assets/images/health20.png', 50, 170);
    game.load.spritesheet('health30', 'assets/images/health30.png', 50, 170);
    game.load.spritesheet('health40', 'assets/images/health40.png', 50, 170);
    game.load.spritesheet('health50', 'assets/images/health50.png', 50, 170);
    game.load.spritesheet('health60', 'assets/images/health60.png', 50, 170);
    game.load.spritesheet('health70', 'assets/images/health70.png', 50, 170);
    game.load.spritesheet('health80', 'assets/images/health80.png', 50, 170);
    game.load.spritesheet('health90', 'assets/images/health90.png', 50, 170);
    game.load.spritesheet('health100', 'assets/images/health100.png', 50, 170);
    
    //all audio files
    game.load.audio('killsound', 'assets/audio/killsound.wav');
    game.load.audio('splashsound', 'assets/audio/splashsound.wav');
    game.load.audio('clicksound', 'assets/audio/clicksound.wav');
    game.load.audio('cannonsound', 'assets/audio/cannonsound.wav');
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
// It starts with activating the physics from Phaser.js, gives an id to the canvas,
// then adds the logo and images, creates the enemy group and creates the first enemy,
// creates our player an the group for cannons and the first cannon. Then it sets the size of the player and the enemies and
// starts the animation of the player.
// All music is added and made accessable.
// It writes all the text that is rendered to the screen all the time and sets the position for it.
// It adds the game physics to the enemies, the player and the cannons.
// It adds to the global variables the keys and starts the timer.

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.canvas.id = "game";
    menuImage = game.add.image(0,0,'startscreen');
    logo = game.add.image(70, 40, 'logo')
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
    
    //sounds
    killsound = game.add.audio('killsound');
    killsound.allowMultiple = true;
    clicksound = game.add.audio('clicksound');
    clicksound.allowMultiple = true;
    cannonsound = game.add.audio('cannonsound');
    cannonsound.allowMultiple = true;
    splashsound = game.add.audio('splashsound');
    splashsound.allowMultiple = true;
    
    killsound.addMarker('sound', 0, 1.0);
    clicksound.addMarker('sound', 0, 2.0);
    cannonsound.addMarker('sound', 0, 1.0);
    splashsound.addMarker('sound', 0, 0.5, 0.4);

    scoreText = game.add.text(330, 30, '0', { font: "32px Arial Black", fill: "#ffffff", align: "center" });
    scoreText.anchor.setTo(0.5, 0.5);
    text = game.add.text(game.world.centerX, game.world.centerY, 'Health: 100', { font: "32px Arial Black", fill: "#ffffff", align: "center" });
    text.anchor.setTo(0.5, 0.5);
    levelText = game.add.text(game.world.centerX, 30, 'Level: 1', { font: "32px Arial Black", fill: "#ffffff", align: "center" });
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
    // If there's been two enemies created it adds to the double count
    if(enemyCount === 2) {
        doubleCreated ++;
    }
    //position that the enemy is placed
    var x = Math.floor(Math.random() * 3) * 150;
    var y = 0;
    //the image it takes
    var key = 'rock';

    var frame = game.rnd.between(0, 36);

    // Checking if it has created two on the last round. If it has, this determends where the next rock is placed.
    // After a double row there can only be a single row.
    if(doubleCreated === 1) {
        //checks if the place the single one is placed is in the middle
        if(x === 150) {
            for (var i = 1; i < enemies.children.length; i++) {

                //checks if there's an enemy that is positioned straight underneight the single stone
                if (x === enemies.children[i].position.x &&
                    y + 100 === enemies.children[i].position.y){

                    //checks if the second enemy is to the left or right
                    if (x + 150 === enemies.children[i - 1].position.x &&
                        y + 100 === enemies.children[i - 1].position.y) {
                         x = 0;
                    }
                    else if(x - 150 === enemies.children[i - 1].position.x &&
                            y + 100 === enemies.children[i - 1].position.y) {
                         x = 0;
                    }
                }

                //checks if there's an enemy that is positioned straight underneight the single stone
                else if(x === enemies.children[i - 1].position.x &&
                        y + 100 === enemies.children[i - 1].position.y) {

                    //checks if the second enemy is to the left or right
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

    //checks if the latest one is the same
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

// function that creates a cannon. It checks where the enemies are placed on the row that it's coming in on
// to make sure that it's not placed on top of one. At the end the physics are enabled.

function buildCannon() {
    //position that the enemy is placed
    var x = Math.floor(Math.random() * 3) * 150;
    var y = 0;
    //the image it takes
    var key = 'cannon';

    var frame = game.rnd.between(0, 36);
    //defines the x-position the cannon is placed in.
    if(enemies.children[0].x === x && enemies.children[0].y === y){
        x = x - 150;
    }
    for (var i = 1; i < enemies.children.length; i++) {
        //checks if there's an enemy in the random place
        if (x === enemies.children[i].position.x &&
            y === enemies.children[i].position.y) {
            // checks the possible positions if it starts from 0
            if(x === 0) {
                x = x + 150;
                if(x === enemies.children[i - 1].position.x &&
                   y === enemies.children[i - 1].position.y) {
                    x = 300;
                }
            }
            // checks the possible positions if it starts from 150
            else if(x === 150) {
                x = x + 150;
                if(x === enemies.children[i - 1].position.x &&
                   y === enemies.children[i - 1].position.y) {
                    x = 0;
                }
            }
            // checks the possible positions if it starts from 300
            else {
                x = x - 150;
                if(x === enemies.children[i - 1].position.x &&
                   y === enemies.children[i - 1].position.y) {
                    x = 0;
                }
            }
        }
    }
    // creates the cannon
    cannons.getFirstDead(true, x, y, key, frame);
    // adds the physics to the enemy
    game.physics.arcade.enable(cannons, Phaser.Physics.ARCADE);

}

// function that first plays the sound of the cannon, then kills the cannon that's collided with the player,
// fixes the score for the next level and levels up.

function jumpForward() {
    cannonsound.play('sound');
    for (var i = 0; i < cannons.children.length; i++) {
        if(cannons.children[i].x === player.x && cannons.children[i].y + 70 === player.y) {
            cannons.children[i].kill();
        }
    }
    score = score  + (20 - score % 20);
    levelUp();

}

function levelUp() {
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
}

// This function adds takes away health when timer runs and sets the new text.
// It also does this when a key has been pressed so that the health, score and level
// are correct. Makes sure that the correct healthImage is shown at the right time.

function updateCounter() {
    if(!gameMenu) {
        if(health > 0) {
            health --;
            if(health >= 90) {
            healthImage.kill();
            healthImage = game.add.sprite(20, 18, 'health100');
            }
            else if(health >= 80 && health < 90) {
                healthImage.kill();
                healthImage = game.add.image(20, 18, 'health90');
            }
            else if(health >= 70 && health < 80) {
                healthImage.kill();
                healthImage = game.add.image(20, 18, 'health80');
            }
            else if(health >= 60 && health < 70) {
                healthImage.kill();
                healthImage = game.add.image(20, 18, 'health70');
            }
            else if(health >= 50 && health < 60) {
                healthImage.kill();
                healthImage = game.add.image(20, 18, 'health60');
            }
            else if(health >= 40 && health < 50) {
                healthImage.kill();
                healthImage = game.add.image(20, 18, 'health50');
            }
            else if(health >= 30 && health < 40) {
                healthImage.kill();
                healthImage = game.add.image(20, 18, 'health40');
            }
            else if(health >= 20 && health < 30) {
                healthImage.kill();
                healthImage = game.add.image(20, 18, 'health30');
            }
            else if(health >= 10 && health < 20) {
                healthImage.kill();
                healthImage = game.add.image(20, 18, 'health20');
            }
            else {
                healthImage.kill();
                healthImage = game.add.image(20, 18, 'health10');
            }
            scoreText.kill();
            scoreText = game.add.text(330, 10, score, { font: "32px Arial Black", fill: "#ffffff", align: "center" });
            levelText.setText('Level: ' + level);
            healthImage.scale.setTo(0.6, 0.4);
        }
    }
}

//variables to make sure that certain things are just done once at a time
var justPressed = false;

//The other of the big functions.
// 1) Checks if health is over 0. If not, it runs the gameOver-function (only once though).
// 2) Checks if up-, left- or right-key is down.
// 3) Checks if the button has already been pressed this time, if it has it does nothing


function update() {
    if(!gameMenu) {
        menuText.setText('');
        if(health > 0) {
            if(upKey.isDown){
                // just when the button has been pressed, the sound is played
                if(!justPressed) {
                    splashsound.play('sound');
                };
                justPressed = true;
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
                    // makes it possible to have two stones created on one row
                    if(level >= 5 && doubleCreated === 0) {
                        if(Math.floor(Math.random() * 2) === 1) {
                            enemyCount ++;
                            resurrect();
                        }
                    }
                    // if two has not been created
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
                        levelUp();
                    }
                    // creates the cannon
                    if(score === 25 || score % 40 === 0) {
                        buildCannon();
                    }
                    updateCounter();
                    enemyCount = 0;
                    if(health <= 1) {
                        gameOver();
                        gameMenu = !gameMenu;
                    }
                }
            }
            else if (leftKey.isDown){
                // just when the button has been pressed, the sound is played
                if(!justPressed) {
                    splashsound.play('sound');
                };
                justPressed = true;
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
                    // makes it possible to have two stones created on one row
                    if(level >= 5 && doubleCreated === 0) {
                        if(Math.floor(Math.random() * 2) === 1) {
                            enemyCount ++;
                            resurrect();
                        }
                    }
                    //if two has not been created
                    else {
                        doubleCreated = 0;
                    }
                    if(health <= 99) {
                        health = health + 2;
                    };
                    score ++;

                    // 5) If the score is more than 20 and evenly devided with 20 you level up,
                    // get 10 points more health, changes the timer to a faster pace, empties the timer
                    // and adds the new one

                    if(score >= 20 && score % 20 === 0) {
                        levelUp();
                    };
                    // creates the cannon
                    if(score === 25 || score % 40 === 0) {
                        buildCannon();
                    };
                    updateCounter();
                    enemyCount = 0;
                    if(health <= 1) {
                        gameOver();
                        gameMenu = !gameMenu;
                    }
                };
            }
            else if (rightKey.isDown) {
                // just when the button has been pressed, the sound is played
                if(!justPressed) {
                    splashsound.play('sound');
                };
                justPressed = true;
                // 4) If the statment below is true, the function first moves the player
                // (if it's in the middle to the far right and if it's far left to the middle)
                // and all enemies, changes the pressTime to the time that the button was pressed,
                // creates a new enemy and adds health and score to the player.

                if(pressTime != rightKey.timeDown) {
                    if(player.x >= 150){
                        player.x = 300;
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
                    // makes it possible to have two stones created on one row
                    if(level >= 5 && doubleCreated === 0) {
                        if(Math.floor(Math.random() * 2) === 1) {
                            enemyCount ++;
                            resurrect();
                        };
                    }
                    //if two has not been created
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
                        levelUp();
                    };
                    // builds the cannon at the 25th stone and at every 43rd stone after that
                    if(score === 25 || score % 43 === 0) {
                        buildCannon();
                    };
                    updateCounter();
                    //kills the player if the health is too low
                    if(health <= 0) {
                        gameOver();
                        gameMenu = !gameMenu;
                    }
                    enemyCount = 0;
                };
            } else {
                justPressed = false;
            };
            // checks if the player and the specific enemy overlaps
            for (var i = 0; i < enemies.children.length; i++) {
                game.physics.arcade.overlap(enemies.children[i], player, gameOver, null, this);
                if(cannons.children.length > 0) {
                    game.physics.arcade.overlap(cannons.children[i], player, jumpForward, null, this);
                }
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
    //if gameMenu is true, it either shows the menu or instruction screen
    else {
        if(instructionMenu) {
            gameInstruction();
        };
        if(counterMenu === 0) {
            startGame();
            logo.visible = true;
            counterMenu ++;
        };
    };
};

// First screen. Makes player invisible, sets the background, the texts and buttons.

function startGame() {
    backgroundImage.visible = false;
    player.visible = false;
    if(menuText === undefined) {
        menuText = game.add.text(game.world.centerX, 530, '', { font: "24px Arial", fill: "#000000", align: "center" });
    } else {
        // clicksound.play('sound');
    }
    menuText.setText('');
    menuText.anchor.setTo(0.5, 0.5);
    levelText.setText('');
    scoreText.setText('');
    text.setText('');
    if(button !== undefined) {
        button.kill();
    };
    button = game.add.button(game.world.centerX - 105, 350, 'playbutton', start, this, 1, 0, 1); 
    if(button2 !== undefined) {
        button2.kill();
    };
    button2 = game.add.button(game.world.centerX - 105, 450, 'infobutton', instruction, this, 1, 0, 1);
};

// What is shown in the instructions-screen. First makes the play-button invisible, then sets the background and sets the text.

function gameInstruction() {
    button.inputEnabled = false;
    button.visible = false;
    game.stage.backgroundColor = '#000000';
    logo.visible = false;
    menuText.kill();
    menuText = game.add.text(game.world.centerX - 175, 210, ' How to play the game? \n \n Watch out for the stones! \n Use left, right and up\n arrows to move. \n Fishcannons give you a level-up!', { font: "24px Arial", fill: "#2aa8bf", align: "center" });
    
    if(button2 !== undefined) {
          button2.kill(); 
    };
    button2 = game.add.button(game.world.centerX - 105, 450, 'menubutton', backInstruction, this, 1, 0, 1); 
};

// function that changes the menu counter to 0 and gameMenu to true and then goes to the homepage

function back() {
    counterMenu = 0;
    gameMenu = true;
    startGame();
}

// gameOver screen. First plays the sound,
// sets the health to 0 and updates the Counter.
// Kills the enemies and cannons that are alive and kills the player.
// asks for your name for the highscore board and updates the database and gets the update back.
// adds the restart button. Adds to the deathCount.
function gameOver() {
    killsound.play('sound');
    health = 0;
    updateCounter();
    scoreText.kill();
    scoreText = game.add.text(game.world.centerX - 70, game.world.centerY - 60, 'Score: \n' + score, { font: "40px Arial Black", fill: "#ffffff", align: "center" });
    for (var i = 0; i < enemies.children.length; i++) {
        enemies.children[i].kill();
    }
    for (var i = 0; i < cannons.children.length; i++) {
        cannons.children[i].kill();
    }
    player.kill();
    healthImage.visible = false;

    button = game.add.button(game.world.centerX - 110, 400, 'playbutton', reset, this, 1, 0, 1);
    button2 = game.add.button(game.world.centerX - 110, 500, 'menubutton', back, this, 1, 0, 1);
    gameMenu = !gameMenu;
    oneTime = true;
    var name = prompt("Add your name to your score to the scoreboard! \n Your score was: " + score, "");
    var newChildRef = ref.push();
    newChildRef.set({
        name: name,
        score: score
    });
    getData();
    deathCount ++;
};

// function that starts the game.

function start() {
    reset();
};

// The intruction menu is shown

function instruction() {
    clicksound.play('sound');
    instructionMenu = true;
};

// The back-button in the instruction menu. Resets menucounter, shows the play button and changes the background back.

function backInstruction() {
    clicksound.play('sound');
    counterMenu = 0;
    button.inputEnabled = true;
    button.visible = true;
    instructionMenu = !instructionMenu;
};

// Adds the player to the bottom center, empties the enemy group and creates a new one. Set the scale.
// adds the run animation for the player, sets the score, health and level and updates the counter and sets deathcount.
// Enables the physics for the enemies and player. Sets the background, makes the button invisible and untouchable.
// Empties the timers, sets the time for the timer and creates the new timer.

function reset() {
    clicksound.play('sound');
    backgroundImage.visible = true;
    enemies = game.add.group();
    enemies.createMultiple(1, 'rock', 0, false);

    cannons = game.add.group();
    cannons.createMultiple(1, 'cannon', 0, false);

    player = game.add.sprite(150, 470, 'player');
    healthImage = game.add.sprite(174, 450, 'health100');

    player.scale.setTo(1.2,1.2);
    enemies.scale.setTo(1.05, 1.2);
    cannons.scale.setTo(1.05, 1.2);
    healthImage.scale.setTo(0.3,0.3);
    

    player.animations.add('run');
    player.animations.play('run', 10, true);
    gameMenu = false;
    score = 0;
    health = 101;
    level = 1;
    updateCounter();
    deathCount = 0;
    game.physics.arcade.enable([ enemies, player, cannons ], Phaser.Physics.ARCADE);
    button.kill();
    button2.kill();
    timerRun.timer.events = [];
    timer =  Phaser.Timer.SECOND;
    timerRun = game.time.events.loop(timer, updateCounter, this);
    timerRun;
    oneTime = !oneTime;
};

