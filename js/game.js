var game = new Phaser.Game(400, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
     game.load.spritesheet('player', 'assets/fish-sprite.png', 80, 80, 8);
    // game.load.image('badFish', 'assets/bad_fish.png');
    game.load.image('goodFish', 'assets/good_fish.png');

}

var sprite1 = [];
var sprite2;

var leftKey;
var rightKey;

var health = 100;
var text = 0;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';

    sprite1 = game.add.sprite(0,0, 'goodFish');
    sprite2 = game.add.sprite(130, 470, 'player');

     // sprite1.scale.setTo(2, 2);
    sprite2.scale.setTo(1.2,1.2);

    // sprite1.animations.add('run');
    sprite2.animations.add('run');

    // sprite1.animations.play('run', 10, true);
    sprite2.animations.play('run', 10, true);


    text = game.add.text(game.world.centerX, game.world.centerY, 'Health: 100', { font: "64px Arial", fill: "#ffffff", align: "center" });
    text.anchor.setTo(0.5, 0.5);

    game.physics.arcade.enable([ sprite1, sprite2 ], Phaser.Physics.ARCADE);

    // game.add.tween(sprite1.body).to( { y: 700 }, 5000, Phaser.Easing.Linear.None, true);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    game.time.events.loop(Phaser.Timer.SECOND, updateCounter, this);

}

function updateCounter() {

    health--;

    text.setText('Counter: ' + health);

}


function update() {
    if (leftKey.isDown){  
        if(sprite2.x <= 20) {
            sprite2.x = 0
            for (var i = 0; i < sprite1.length; i++) {
                sprite1[i].y = sprite1[i].y + 10;
            }

        }
        else{
            sprite2.x = sprite2.x - 30;
            for (var i = 0; i < sprite1.length; i++) {
                sprite1[i].y = sprite1[i].y + 10;
            }

        }
        sprite1 += game.add.sprite(0,0, 'goodFish');
    }
    else if (rightKey.isDown) {
        if(sprite2.x >= 300){
            sprite2.x = 300
            for (var i = 0; i < sprite1.length; i++) {
                sprite1[i].y = sprite1[i].y + 10;
            }
        }
        else {
            sprite2.x = sprite2.x + 30;
            for (var i = 0; i < sprite1.length; i++) {
                sprite1[i].y = sprite1[i].y + 10;
            }

        }
        sprite1 += game.add.sprite(200,0, 'goodFish'); 
    }
    if(sprite1.y >= 1000) {
        sprite1.kill();
    }
    game.physics.arcade.overlap(sprite1, sprite2, overlapHandler, null, this);

}

function overlapHandler (obj1, obj2) {

     game.stage.backgroundColor = '#992d2d';

    obj2.kill();

}

function render() {

    // game.debug.spriteInfo(sprite1,20,32);
    // game.debug.spriteInfo(sprite2,20,32);

}