$(document).ready( function(){
	//array for highscore names
	// var names = [];
	//array for highscore scores
	// var scores = [];
	//object for names-scores
	// var bothNameScore = {};
	//load from localStorage
    // loadSettings();
    //creating the canvas
	var canvas = document.createElement('canvas');
	//giving the canvas a id
	canvas.setAttribute("id","canvas");
	//giving the context
	var ctx = canvas.getContext("2d");
	//setting canvas width
	canvas.width = 400;
	//setting canvas height
	canvas.height = 800;
	//adding the canvas to the body
	document.body.appendChild(canvas);

	//object for keycodes
	var keysDown = {};
	//the buttons in the navigation bar
	var buttonsNav = [];
	//the restart button
	var buttons = [];

	//eventlistener for keydown. Adds the keycode to keysDown-object
	window.addEventListener('keydown', function(e) {
		e.preventDefault();
		keysDown[e.keyCode] = true;
	});

	//eventlistener for keydup. Deletes the keycode from keysDown-object
	window.addEventListener('keyup', function(e) {
		e.preventDefault();
		delete keysDown[e.keyCode];
	});

	//eventlistener for mousedown. both for deleting enemy and changing the player speed
	$( "#canvas" ).mousedown(function(e) {
		var offset = $("#canvas").offset();
		console.log(offset);
  		var X = e.pageX - offset.left;
  		var Y = e.clientY - 132;
  		deleteEnemy(X,Y);
  		if(gameOver) {
	  		if (isInside(X,Y)) {
	  			frameNo = 0;
	        	reset(ctx);
	    	}
    	}
    	if(isInsideNav(X,Y,buttonsNav) == 0){
    		changeSpeed("add");
    	}
    	else if(isInsideNav(X,Y,buttonsNav) == 1){
    		changeSpeed("less");
    	}
	});

	//when the reset-button is clicked it resets 
	$("#reset").click('click',function(e) {
		reset(ctx);
	});

	//where button 1 is located
	var button1 = {
	    x:300,
	    y:320,
	    w:200,
	    h:50
	};

	//where button 2 is located
	var button2 = {
	    x:600,
	    y:0,
	    w:100,
	    h:50
	};

	//where button 3 is located
	var button3 = {
	    x:700,
	    y:0,
	    w:100,
	    h:50
	};
	//pushing button 1 to the buttons array
	buttons.push(button1);
	//pushing button 2 & 3 to the array for nav buttons
	buttonsNav.push(button2);
	buttonsNav.push(button3);


	//drawing the buttons to the canvas. If reset-button writes reset and so on..
	function drawButtons(array) {
		for (var i = 0; i < array.length; i++) {
			ctx.fillStyle = "#434342";
			ctx.fillRect(
				array[i].x,
				array[i].y,
				array[i].w,
				array[i].h)
			ctx.font = "30px Arial";
			ctx.fillStyle = "#FFFFFF";
			if(array === buttons) {
				ctx.fillText("Restart",350,355);
			}
			else if(i === 0) {
				ctx.fillText("Faster",608,35);
			}
			else if(i === 1) {
				ctx.fillText("Slower",704,35);
			}
		}
	}
	//checks if inside a the reset-button
	function isInside(width,height){
    	return width > button1.x && width < button1.x + button1.w && height < button1.y+button1.h && height > button1.y
	}
	//checks if inside nav-bar and with navbar button its within
	function isInsideNav(width,height,array){
		for (var i = 0; i < array.length; i++) {
			if(width > array[i].x && width < array[i].x + array[i].w && height < array[i].y+array[i].h && height > array[i].y) {
				return i
			}
		}
	}
	//rendering the canvas. Adds the count and every 60th frame it adds a enemy. Draws the player, the enemies and the buttons
	var render = function() {
		frameNo += 1;
		ctx.clearRect(0 , 0 , canvas.width , canvas.height);
		if(frameNo % 60 === 0) {
			create(1);
		}
		drawPlayer(ctx);
		for (var i = 0; i < enemies.length; i++) {
			drawEnemy(enemies[i],ctx);
		} 
		drawButtons(buttonsNav);
		ctx.fillText("Score: " + frameNo,20,30);
		ctx.fillText("Health: " + player.life,20,60);
	};
	//draws the gameover screen
	function drawGameOver() {
		ctx.clearRect(0 , 0 , canvas.width , canvas.height);
		ctx.fillStyle = '#000000';
		ctx.font = "60px Arial";
		ctx.fillText("Game Over!",250,150);
		ctx.font = "30px Arial";
		ctx.fillText("Score: " + frameNo,340,250);
		drawButtons(buttonsNav);
		drawButtons(buttons);
		if(countGameOver === 0) {
			//makes you add your name to the scoreboard
			// var name = prompt("Add your name to your score to the scoreboard!", "");
			// names.push(name);
			// scores.push(frameNo);
			// localStorage.setItem("names", JSON.stringify(names));
			// localStorage.setItem("scores", JSON.stringify(scores));
		}
		//adds to the counter so that the prompt wont be popping up constantly
		countGameOver ++;
		//empties the keysDown-object so that the player wont start moving to a direction
		keysDown = {};
	};
	//loading the names & scores from localStorage, then 
	// function loadSettings () {
	// 	if(localStorage.names !== undefined && localStorage.scores !== undefined) {
	// 		var returnedNames = (JSON.parse(localStorage.names));
	// 		var returnedScores = (JSON.parse(localStorage.scores));
			
	// 		console.log(returnedNames);
	// 		console.log(returnedScores);
	// 		var newSomething = [];
 //        	for (var i = 0; i < returnedNames.length; i++) {
	//     		names.push(returnedNames[i]);
	//     		scores.push(returnedScores[i]);
	//     	}
	//     	var bothNameScore = toObject(names,scores);
	//     	var sortable = [];
	// 		for (var name in bothNameScore) {
	// 		    sortable.push([name, bothNameScore[name]]);
	// 		}
	// 		sortable.sort(function(a, b) {
	// 		    return b[1] - a[1];
	// 		});
	//     	writeTable(sortable);
	//     }
	// }

 //    function toObject(names, values) {
 //    	var result = {};
	//     for (var i = 0; i < names.length; i++) {
	//          result[names[i]] = values[i];
	// 	}
	// 	return result;
	// }

	// function writeTable(array) {
	// 	var count = 0;
	//     // cache <tbody> element:
	//     var tbody = $('#tableBody');
	//     if(array.length >= 10) {
	//     	for (var i = 0; i < 10; i++) {
	// 	        // create an <tr> element, append it to the <tbody> and cache it as a variable:
	// 	        var tr = $('<tr/>').appendTo(tbody);
	//             // append <td> elements to previously created <tr> element:
	//             	tr.append('<td>' + array[i][0] + '</td>');
	//             	tr.append('<td>' + array[i][1] + '</td>');
	//             count++;
	//     	}
	//     }
	//     else {
	//     	for (var i = 0; i < array.length; i++) {
	// 	        // create an <tr> element, append it to the <tbody> and cache it as a variable:
	// 	        var tr = $('<tr/>').appendTo(tbody);
	//             // append <td> elements to previously created <tr> element:
	//             	tr.append('<td>' + array[i][0] + '</td>');
	//             	tr.append('<td>' + array[i][1] + '</td>');
	//             count++;
	//     	}
	//     }
	//     // reset the count:
	//     count = 0;
	// }
	//moves the enemies and checks if the player should move. If it should it checks which direction it's going to and what kind of sprite it should then use
	function update() {
		moveEnemies(ctx);
		if(39 in keysDown) {
			right = true;
			movePlayer("right");
			player.updateFrame(ctx);
			drawPlayerMove(ctx);
			right = false;
		}
		if(37 in keysDown) {
			movePlayer("left");
			player.updateFrame(ctx);
			drawPlayerMove(ctx);
		}
	}
	//function that runs endlessly
	function main() {
		if(!gameOver) {
			update();
			render();
			requestAnimationFrame(main);
		}
		else {
			drawGameOver();
			requestAnimationFrame(main);
		}
	}
	main();
});