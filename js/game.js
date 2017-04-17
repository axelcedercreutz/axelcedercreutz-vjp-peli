var game = new Phaser.Game(400, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
     game.load.atlasJSONHash('bot', 'assets/running_bot.png', 'assets/running.json');
    // game.load.image('badFish', 'assets/bad_fish.png');
    game.load.image('goodFish', 'assets/good_fish.png');

}

var sprite1;
var sprite2;

var leftKey;
var rightKey;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';

    sprite1 = game.add.sprite(10,0, 'badFish');
    sprite2 = game.add.sprite(100, 530, 'goodFish');

    //  sprite1.anchor.setTo(0.5, 0.5);
    // sprite2.anchor.setTo(0.5,0.5);

    //  sprite1.scale.setTo(2, 2);
    // sprite2.scale.setTo(2,2);

    sprite1.animations.add('run');
    sprite2.animations.add('run');

    sprite1.animations.play('run', 10, true);
    sprite2.animations.play('run', 10, true);

    game.physics.arcade.enable([ sprite1, sprite2 ], Phaser.Physics.ARCADE);

    // game.add.tween(sprite1.body).to( { y: 700 }, 5000, Phaser.Easing.Linear.None, true);
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

}

function update() {
    if (leftKey.isDown)
    {   
        if(sprite2.x <= 30) {
            sprite2.x = 0
            sprite1.y = sprite1.y + 10
        }
        else{
            sprite2.x = sprite2.x - 30;
            sprite1.y = sprite1.y + 10
        }
    }
    else if (rightKey.isDown) {
        if(sprite2.x >= 210){
            sprite2.x = 210
            sprite1.y = sprite1.y + 10
        }
        else {
            sprite2.x = sprite2.x + 30;
            sprite1.y = sprite1.y + 10
        }
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

    game.debug.spriteInfo(sprite1,20,32);
    // game.debug.spriteInfo(sprite2,20,32);

}