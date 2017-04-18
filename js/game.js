//creates the game
var game = new Phaser.Game(400, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

//defines the preloaded things
function preload() {
    game.load.spritesheet('player', 'assets/fish-sprite.png', 80, 80, 8);
    game.load.spritesheet('goodFish', 'assets/good_fish.png', 35, 32, 5);
    game.load.spritesheet('button', 'assets/button_sprite_sheet.png', 193, 71);
}
//global variables for the players
var enemies;
var player;

//global variables for the keys
var leftKey;
var rightKey;
var pressTime;

//global variables for the text that's always on the screen
var health = 100;
var text;
var score = 0;
var scoreText;
var level = 1;
var levelText;

//global variables for the timer
var timer = Phaser.Timer.SECOND;
var timerRun;

//global variable for the button
var button;

//global variable for the update to only run the gameOver-function once
var deathCount = 0;


//This is where the game is initially created.
//It starts with activating the physics from Phaser.js,
//then adds the background color, creates the enemy group and creates the first enemy,
//creates our player. Then it sets the size of the player and the enemies and
//starts the animation of the player.
//It writes all the text that is rendered to the screen all the time and sets the position for it.
//It adds the game physics to the enemies and the player.
//It adds to the global variables the keys and starts the timer.

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#124184';

    enemies = game.add.group();
    enemies.createMultiple(1, 'goodFish', 0, false);
    player = game.add.sprite(150, 470, 'player');

    player.scale.setTo(1.2,1.2);
    enemies.scale.set(1.2, 1.2);

    player.animations.add('run');
    player.animations.play('run', 10, true);

    scoreText = game.add.text(game.world.centerX, game.world.centerY + 40, 'Score: 0', { font: "32px Arial", fill: "#ffffff", align: "center" });
    scoreText.anchor.setTo(0.5, 0.5);
    text = game.add.text(game.world.centerX, game.world.centerY, 'Health: 100', { font: "32px Arial", fill: "#ffffff", align: "center" });
    text.anchor.setTo(0.5, 0.5);
    levelText = game.add.text(game.world.centerX, 20, 'Level: 1', { font: "32px Arial", fill: "#ffffff", align: "center" });
    levelText.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable([ enemies, player ], Phaser.Physics.ARCADE);

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    timerRun = game.time.events.loop(timer, updateCounter, this);
}

//ressurect creates the enemies. It chooses by random which of the three
//x-positions it starts at, adds the image and the frame and then creates the enemy.
//then it adds the physics for the enemy.

function resurrect() {

    var x = Math.floor(Math.random() * 3) * 150;
    var y = 0;
    var key = 'goodFish';
    var frame = game.rnd.between(0, 36);

    enemies.getFirstDead(true, x, y, key, frame);
    game.physics.arcade.enable([ enemies, player ], Phaser.Physics.ARCADE);

}

// This function adds takes away health when timer runs and sets the new text.
// It also does this when a key has been pressed so that the health, score and level
// are correct.

function updateCounter() {
    if(health > 0) {
        health --;
    }
    text.setText('Health: ' + health);
    scoreText.setText('Score: ' + score);
    levelText.setText('Level: ' + level);

}


function update() {
    if(health > 0) {
        if(upKey.isDown){
            if(pressTime != upKey.timeDown) {
                for (var i = 0; i < enemies.children.length; i++) {
                    enemies.children[i].position.y += 100;
                }
                pressTime = upKey.timeDown;
                resurrect();
                if(health <= 99) {
                    health = health + 2;
                }
                score ++;
                if(score >= 20 && score % 20 === 0) {
                    level ++;
                    if(health <= 90) {
                        health = health + 10;
                    }
                    else {
                        health = 101;
                    }
                    timer = timer/1.2;
                    timerRun.timer.events = [];
                    timerRun = game.time.events.loop(timer, updateCounter, this);
                }
                updateCounter();
            }
        }
        if (leftKey.isDown){
            if(pressTime != leftKey.timeDown) {
                if(player.x <= 150) {
                    player.x = 0;
                    for (var i = 0; i < enemies.children.length; i++) {
                        enemies.children[i].position.y += 100;
                    }
                }
                else{
                    player.x = player.x - 150;
                    for (var i = 0; i < enemies.children.length; i++) {
                        enemies.children[i].position.y += 100;
                    }

                }
                pressTime = leftKey.timeDown;
                resurrect();
                if(health <= 99) {
                    health = health + 2;
                }
                score ++;
                if(score >= 20 && score % 20 === 0) {
                    level ++;
                    if(health <= 90) {
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
                updateCounter();
            }
        }
        else if (rightKey.isDown) {
            if(pressTime != rightKey.timeDown) {
                if(player.x >= 150){
                    player.x = 300
                    for (var i = 0; i < enemies.children.length; i++) {
                        enemies.children[i].position.y += 100;
                     }
                }
                else {
                    player.x = player.x + 150;
                    for (var i = 0; i < enemies.children.length; i++) {
                        enemies.children[i].position.y += 100;
                    }
                }
                pressTime = rightKey.timeDown;
                resurrect();
                if(health <= 99) {
                    health = health + 2;
                }
                score ++;
                if(score >= 10 && score % 10 === 0) {
                    level ++;
                    if(health <= 90) {
                        health = health + 10
                    }
                    else {
                        health = 101
                    }
                    levelText.setText('Level: ' + level);
                    if(score % 20 === 0) {
                        timer = timer/1.2;
                        timerRun.timer.events = [];
                        timerRun = game.time.events.loop(timer, updateCounter, this);
                    }
                }
                updateCounter();
            }
        }
        for (var i = 0; i < enemies.children.length; i++) {
            if(enemies.children[i].position.y >= 800) {
                enemies.children[i].kill();
            }
            game.physics.arcade.overlap(enemies.children[i], player, gameOver, null, this);
        }
    }
    else {
        if(deathCount === 0) {
            gameOver()
            deathCount ++;
        }
    }
}

function overlapHandler (obj1, obj2) {
    gameOver();
}
function gameOver() {
    game.stage.backgroundColor = '#992d2d';

    deathCount ++;
    health = 0;
    updateCounter();

    for (var i = 0; i < enemies.children.length; i++) {
        enemies.children[i].kill();
    }

    player.kill();

    button = game.add.button(game.world.centerX - 95, 400, 'button', reset, this, 2, 1, 0);
}
function reset() {
    player = game.add.sprite(150, 470, 'player');
    enemies = game.add.group();
    enemies.createMultiple(1, 'goodFish', 0, false);

    player.scale.setTo(1.2,1.2);
    enemies.scale.set(1.2, 1.2);

    player.animations.add('run');
    player.animations.play('run', 10, true);

    score = 0;
    health = 101;
    level = 1;
    updateCounter();
    game.physics.arcade.enable([ enemies, player ], Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#124184';

    button.inputEnabled = false;
    button.visible = false;
    deathCount = 0;
    timer =  Phaser.Timer.SECOND;
    timerRun.timer.events = [];
    timerRun = game.time.events.loop(timer, updateCounter, this);
    timerRun;
}
function render() {
}