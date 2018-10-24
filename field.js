class Room {
	constructor(n_rows, n_cols, vsBot, playFirst) {
		this.gameover = false;
		this.turn = playFirst;
		this.n_rows = n_rows;
		this.n_cols = n_cols;
		this.vsBot = vsBot;
		this.setupCells();
	}

	setupCells() {
		this.col_count = new Array();
		for(let i = 0; i < this.n_cols; i++)
			this.col_count.push(0);
		this.cells = new Array();
		for(let i = 0; i < this.n_rows; i++) {
			let aux = new Array();
			for(let i = 0; i < this.n_cols; i++)
				aux.push('-');
			this.cells.push(aux.slice());
		}
	}
}

var room;

function initField() {

	let y = document.getElementById("row").value;
	let x = document.getElementById("col").value;
    
    if(x > 15 || y > 15) {
        room.vsBot = false;
    }
    
	room = new Room(y,x, document.getElementById("vsBot").checked, document.getElementById("first").checked);

	flipCard('game-card');

	let field = document.getElementById("field");

	let fieldStr = "";
	
	for(let i = 0; i < x; i++) {
		fieldStr += '<div class="column" onclick="play(' + i + ', room)">';
		for(let j = 0; j < y; j++) {
			fieldStr += '<div id="' + i + ',' + (y - 1 -j) + '" class="cell"></div>';
		}
		fieldStr += "</div>";
	}
	
	
	field.innerHTML = fieldStr;
    
    
    if(x > 7) { //518
        for(let i of document.getElementsByClassName("cell")) {
            i.style.height = Number.parseInt(550/x) + "px";
            i.style.width = Number.parseInt(550/x) + "px";
        }
    }

    if(!room.turn && room.vsBot) 
		play(0, room);
}


/**
 * Make the move
 * 
 * @param {number} n Column number
 * @param {Room} game The active room
 */
function play(n, game) {
	if(game.gameover) {
		let endGame = document.getElementById("end-game");
        if(!game.turn)
            endGame.innerHTML = "Player wins!";
        else
            endGame.innerHTML = "Computer wins!";
        flipCard('pop-up-card');

	}
	else {

		if(!game.turn && game.vsBot) {
			let bestMove = bestMoveAB(new Node(game.cells, true, game.col_count, 1, 8, 'O')).move;
			n = bestMove;
		}

		if((x = document.getElementById((n) + "," + (game.col_count[n]))) != null) { 
			if(game.turn) {
				x.style.backgroundColor = "#18BC9C";
				game.cells[game.col_count[n]][n] = 'X';
			}
			else {
				x.style.backgroundColor = "#2C3E50";
				game.cells[game.col_count[n]][n] = 'O';
			}
			game.col_count[n]++;
			game.turn = !game.turn;

			let curr = isTerminal(game.cells);

			game.gameover = curr[0];
			let sequence = curr[1];

			if(game.gameover) {

				let fd = document.getElementsByClassName("cell");

				for (let i of fd) {
					i.style.opacity = 0.2;
				}

				for (let i of sequence) {
					temp = document.getElementById(i);
					temp.style.animationName = "winner"
					temp.style.opacity = 1;
				}
                
//                if(tie)
//                    alert('Draw');
//				if(!game.turn) 
//                    alert("Red wins!");
//				else 
//                    alert("Blue wins!");
			
			}

		}
		else {
			alert("Invalid play");
		}

		if(!game.turn && game.vsBot) {
			let bestMove = bestMoveAB(new Node(game.cells, true, game.col_count, 1, 8, 'O')).move;
			play(bestMove, game);
		}
	}
	
}


var tie = false;


/**
 *
 * @param {number}
 * @return {number}
 */
function isTerminal(cells) {

	let count = 0;

	for(let i = 0; i < cells.length; i++) { 
		for(let j = 0; j < cells[0].length; j++) { 
			if(cells[i][j] != '-') {
				if(j < (cells[0].length - 3)) {
					if(cells[i][j] == cells[i][j + 1] && 
					   cells[i][j] == cells[i][j + 2] && 
					   cells[i][j] == cells[i][j + 3]) {
						return [true, [j+","+i, (j+1)+","+i, (j+2)+","+i, (j+3)+","+i]];
					}
				}
				if(i < cells.length - 3) {
					if(cells[i][j] == cells[i + 1][j] && 
					   cells[i][j] == cells[i + 2][j] && 
					   cells[i][j] == cells[i + 3][j]) {
						return [true, [j+","+(i), (j)+","+(i+1), (j)+","+(i+2), (j)+","+(i+3)]];
					}
				}
				if(i < cells.length - 3 && j < (cells[0].length - 3)) {
					if(cells[i][j] == cells[i + 1][j + 1] && 
					   cells[i][j] == cells[i + 2][j + 2] && 
					   cells[i][j] == cells[i + 3][j + 3]) {
						return [true, [j+","+i, (j+1)+","+(i+1), (j+2)+","+(i+2), (j+3)+","+(i+3)]];
					}

					
				}
			}
			else
				count++;

			if(cells[i][cells[0].length - j - 1] != '-') {
				if(j < (cells[0].length - 3) && i < cells.length - 3)
				if(cells[i][cells[0].length - j - 1] == cells[i + 1][cells[0].length - j - 1 - 1] && 
				   cells[i][cells[0].length - j - 1] == cells[i + 2][cells[0].length - j - 1 - 2] && 
				   cells[i][cells[0].length - j - 1] == cells[i + 3][cells[0].length - j - 1 - 3]) {
					return [true, [(cells[0].length-j-1)+","+i, (cells[0].length-j-1-1)+","+(i+1), (cells[0].length-j-1-2)+","+(i+2), (cells[0].length-j-1-3)+","+(i+3)]];
				}
			}
			else
				count++;
		}
	}
	
	debugger;

	if(count == 0) {
		tie = true;
		return [true, []];
	}
		
	return [false, []];

}

