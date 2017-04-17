var game = new Phaser.Game(400, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
     game.load.spritesheet('player', 'assets/fish-sprite.png', 80, 80, 8);
    // game.load.image('badFish', 'assets/bad_fish.png');
    game.load.image('goodFish', 'assets/good_fish.png');

}

var enemies;
var sprite2;

var leftKey;
var rightKey;
var pressTime;

var health = 100;
var text = 0;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';

    enemies = game.add.group();
    enemies.createMultiple(1, 'goodFish', 0, false);
    sprite2 = game.add.sprite(130, 470, 'player');

     // sprite1.scale.setTo(2, 2);
    sprite2.scale.setTo(1.2,1.2);
    enemies.scale.set(1.2, 1.2);

    // sprite1.animations.add('run');
    sprite2.animations.add('run');

    // sprite1.animations.play('run', 10, true);
    sprite2.animations.play('run', 10, true);


    text = game.add.text(game.world.centerX, game.world.centerY, 'Health: 100', { font: "64px Arial", fill: "#ffffff", align: "center" });
    text.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable([ enemies, sprite2 ], Phaser.Physics.ARCADE);

    // game.add.tween(sprite1.body).to( { y: 700 }, 5000, Phaser.Easing.Linear.None, true);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

}
function resurrect() {

    //  Get a dead item - The Group was seeded with 5 'dead' items,
    //  so those will be re-used first and then it will start
    //  creating new ones using the following arguments:

    var x = game.world.randomX;
    console.log(x);
    var y = 0;
    var key = 'goodFish';
    var frame = game.rnd.between(0, 36);

    enemies.getFirstDead(true, x, y, key, frame);

}


function updateCounter() {

    health--;

    text.setText('Counter: ' + health);

}


function update() {
    if (leftKey.isDown){
        if(pressTime != leftKey.timeDown) {
            pressTime = leftKey.timeDown;
            if(sprite2.x <= 150) {
                sprite2.x = 0;
                for (var i = 0; i < enemies.children.length; i++) {
                    enemies.children[i].position.y += 20;
                }
            }
            else{
                sprite2.x = sprite2.x - 150;
                for (var i = 0; i < enemies.children.length; i++) {
                    enemies.children[i].position.y += 20;
                }

            }
            resurrect();
        }
    }
    else if (rightKey.isDown) {
        if(pressTime != rightKey.timeDown) {
            pressTime = rightKey.timeDown;
            resurrect();
            if(sprite2.x >= 150){
                sprite2.x = 300
                for (var i = 0; i < enemies.children.length; i++) {
                    enemies.children[i].position.y += 20;
                 }
            }
            else {
                sprite2.x = sprite2.x + 150;
                for (var i = 0; i < enemies.children.length; i++) {
                    enemies.children[i].position.y += 20;
                }
            }
        }
    }
    game.physics.arcade.overlap(enemies, sprite2, overlapHandler, null, this);

}

function overlapHandler (obj1, obj2) {

     game.stage.backgroundColor = '#992d2d';

    obj2.kill();

}

function render() {

    // game.debug.spriteInfo(sprite1,20,32);
    // game.debug.spriteInfo(sprite2,20,32);

}