var game = new Phaser.Game(400, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('badFish', 'assets/bad_fish.png');
    game.load.image('goodFish', 'assets/good_fish.png');

}

var sprite1;
var sprite2;

var leftKey;
var rightKey;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';

    sprite1 = game.add.sprite(0,0, 'badFish');
    sprite2 = game.add.sprite(100, 530, 'goodFish');

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
    else if (rightKey.isDown)
    {
        if(sprite2.x >= 210){
            sprite2.x = 210
            sprite1.y = sprite1.y + 10
        }
        else {
            sprite2.x = sprite2.x + 30;
            sprite1.y = sprite1.y + 10
        }
    }
    game.physics.arcade.overlap(sprite1, sprite2, overlapHandler, null, this);

}

function overlapHandler (obj1, obj2) {

     game.stage.backgroundColor = '#992d2d';

    obj2.kill();

}

function render() {

    game.debug.body(sprite1);
    game.debug.body(sprite2);

}