//checks if going to the left
var left = false;
//checks if going to the right
var right = false;
//checks if game has already been over
var countGameOver = 0;
//create an object player that has a function for updating the sprite
var player = {
		x: 400,
		y: 300,
		w: 20,
		h: 20,
		speed: 10,
		direction: "right",
		life: 100,
		updateFrame: function updateFrame(ctx){
		 	//Updating the frame index 
		 	curFrame = ++curFrame % frameCount; 
		 
		 	//Calculating the x coordinate for spritesheet 
			srcX = curFrame * spriteWidthOneGood; 

			if(right && player.x>0){
	 			//calculate srcY 
	 			srcY = spriteHeightOneGood; 
	 		}
	 		else {
	 			srcY = 0;
	 		}
			//Clearing the drawn frame 
	 		ctx.clearRect(player.x,player.y,spriteWidthOneGood,spriteHeightOneGood); 
		}
};
//sprite width
var spriteWidthGood = 188;
//sprite height
var spriteHeightGood = 74;
//sprite row
var rows = 2;
//sprite column 
var cols = 5;

//To get the width of a single sprite we divided the width of sprite with the number of cols
//because all the sprites are of equal width and height 
var spriteWidthOneGood = spriteWidthGood/cols; 

//Same for the height we divided the height with number of rows 
var spriteHeightOneGood = spriteHeightGood/rows;  

//Each row contains 5 frame and at start we will display the first frame (assuming the index from 0)
var curFrame = 0; 

//The total frame is 5 
var frameCount = 5;

//x and y coordinates to render the sprite 
var spriteX = player.x;
var spriteY = player.y; 

//x and y coordinates of the canvas to get the single frame 
var srcX = 0; 
var srcY = 0; 


function drawPlayer(context) {
	//Creating an Image object for our character 
 	var playerCharacter = new Image(); 
	var x = player.x - (player.w / 2);
	var y = player.y - (player.h / 2);
	// Load sprite sheet
	playerCharacter.src = "assets/good_fish.png";
	context.drawImage(playerCharacter,srcX,srcY,spriteWidthOneGood,spriteHeightOneGood,x,y,spriteWidthOneGood,spriteHeightOneGood);
}

//draws a player
function drawPlayerMove(context) {
	//Creating an Image object for our character 
 	var playerCharacter = new Image(); 

	var x = player.x - (player.w / 2);
	var y = player.y - (player.h / 2);
	// Load sprite sheet
	playerCharacter.src = "assets/good_fish.png";
	context.drawImage(playerCharacter,srcX,srcY,spriteWidthOneGood,spriteHeightOneGood,x,y,spriteWidthOneGood,spriteHeightOneGood);
}

//moves player & checks that it doesnt go out of bounds
function movePlayer(direction) {
	switch (direction) {
		case "left":
			player.direction = "left";
			player.x -= player.speed;
			if(player.x <= 10) {
				player.x = 10;
			}
			break;
		case "right":
			player.direction = "right";
			player.x += player.speed;
			if(player.x >= 770) {
				player.x = 770;
			}
			break;
		case "up":
			player.direction = "up";
			player.y -= player.speed
			if(player.y <= 80) {
				player.y = 80;
			}
			break;
		case "down":
			player.direction = "down";
			player.y += player.speed
			if(player.y >= 580) {
				player.y = 580;
			}
			break;
	}
}
//changes the speed of the player
function changeSpeed(amount) {
	switch(amount) {
		case "add":
			if(player.speed >= 20) {
				break;
			}
			else {
				player.speed += 2;
			}
			break;
		case "less":
			if(player.speed <= 5) {
				break;
			} 
			else {
				player.speed -= 2;
			}
			break;
	}
}
//resets the player stats (position, speed, life). turns gameOver to false, clears the enemies and creates 4 new ones.
//Changes countGameOver so that the prompt for adding your score pops up when you die the next time.
function reset(context) {
	player.x = 400;
	player.y = 275;
	player.speed = 10;
	player.life = 100;
	gameOver = false;
	enemies = [];
	create(4);
	countGameOver = 0;
}