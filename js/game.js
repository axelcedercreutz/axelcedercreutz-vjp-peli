var game = new Phaser.Game(400, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.spritesheet('player', 'assets/fish-sprite.png', 80, 80, 8);
    game.load.spritesheet('goodFish', 'assets/good_fish.png', 35, 32, 5);

}

var enemies;
var sprite2;

var leftKey;
var rightKey;
var pressTime;

var health = 100;
var text;
var score = 0;
var scoreText;
var level = 1;
var levelText;

var timer = Phaser.Timer.SECOND;
var timerRun;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#124184';

    enemies = game.add.group();
    enemies.createMultiple(1, 'goodFish', 0, false);
    sprite2 = game.add.sprite(130, 470, 'player');

    sprite2.scale.setTo(1.2,1.2);
    enemies.scale.set(1.2, 1.2);

    sprite2.animations.add('run');
    sprite2.animations.play('run', 10, true);

    scoreText = game.add.text(game.world.centerX, game.world.centerY + 40, 'Score: 0', { font: "32px Arial", fill: "#ffffff", align: "center" });
    scoreText.anchor.setTo(0.5, 0.5);
    text = game.add.text(game.world.centerX, game.world.centerY, 'Health: 100', { font: "32px Arial", fill: "#ffffff", align: "center" });
    text.anchor.setTo(0.5, 0.5);
    levelText = game.add.text(game.world.centerX, 20, 'Level: 1', { font: "32px Arial", fill: "#ffffff", align: "center" });
    levelText.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable([ enemies, sprite2 ], Phaser.Physics.ARCADE);

    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    timerRun = game.time.events.loop(timer, updateCounter, this);
    timerRun;
}
function resurrect() {

    //  Get a dead item - The Group was seeded with 5 'dead' items,
    //  so those will be re-used first and then it will start
    //  creating new ones using the following arguments:

    var x = Math.floor(Math.random() * 3) * 150;
    var y = 0;
    var key = 'goodFish';
    var frame = game.rnd.between(0, 36);

    enemies.getFirstDead(true, x, y, key, frame);
    game.physics.arcade.enable([ enemies, sprite2 ], Phaser.Physics.ARCADE);

}


function updateCounter() {
    if(health > 0) {
        health --;
    }
    text.setText('Health: ' + health);
    scoreText.setText('Score: ' + score);

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
                if(health <= (100 - level)) {
                    health = health + 2;
                }
                score ++;
                if(score >= 20 && score % 20 === 0) {
                    level ++;
                    if(health <= 90) {
                        health = health + 10
                    }
                    else {
                        health = 101
                    }
                    levelText.setText('Level: ' + level);
                    timer = timer/1.2
                    timerRun = game.time.events.loop(timer, updateCounter, this);
                }
                updateCounter();
            }
        }
        if (leftKey.isDown){
            if(pressTime != leftKey.timeDown) {
                if(sprite2.x <= 150) {
                    sprite2.x = 0;
                    for (var i = 0; i < enemies.children.length; i++) {
                        enemies.children[i].position.y += 100;
                    }
                }
                else{
                    sprite2.x = sprite2.x - 150;
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
                        health = health + 10
                    }
                    else {
                        health = 101
                    }
                    levelText.setText('Level: ' + level);
                    timer = timer/1.2
                    timerRun = game.time.events.loop(timer, updateCounter, this);
                }
                updateCounter();
            }
        }
        else if (rightKey.isDown) {
            if(pressTime != rightKey.timeDown) {
                if(sprite2.x >= 150){
                    sprite2.x = 300
                    for (var i = 0; i < enemies.children.length; i++) {
                        enemies.children[i].position.y += 100;
                     }
                }
                else {
                    sprite2.x = sprite2.x + 150;
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
                if(score >= 20 && score % 20 === 0) {
                    level ++;
                    if(health <= 90) {
                        health = health + 10
                    }
                    else {
                        health = 101
                    }
                    levelText.setText('Level: ' + level);
                    timer = timer/1.2
                    timerRun = game.time.events.loop(timer, updateCounter, this);
                }
                updateCounter();
            }
        }
        for (var i = 0; i < enemies.children.length; i++) {
            if(enemies.children[i].position.y >= 800) {
                enemies.children[i].kill();
            }
            game.physics.arcade.overlap(enemies.children[i], sprite2, overlapHandler, null, this);
        }
    }
}

function overlapHandler (obj1, obj2) {
    console.log(obj1);
    health = 0;
     game.stage.backgroundColor = '#992d2d';
    obj2.kill();

}

function render() {

}