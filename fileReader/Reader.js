const fs = require('fs');

class Reader {
	constructor(filename) {
		this.filename = filename;
	}

	// Create the game structure
	createGameInfo(data) {
		var numbers = '123456789';
		var positions = [];
		var matrix = '';

		// info structure
		var game = {
			playerPos: [],
			world: [],
			boxesPos: [],
		};

		// Extracting game information
		for (var i = 0; i < data.length; i++) {
			if (numbers.indexOf(data.charAt(i), 0) != -1) {
				positions.push(parseInt(data.charAt(i)));
			}
		}

		for (var i = 0; i < data.length; i++) {
			if (data.charAt(i) != ',') {
				if (numbers.indexOf(data.charAt(i + 1), 0) != -1) {
					break;
				} else {
					matrix += data.charAt(i);
				}
			}
		}
		matrix += '\n';

		var temp = [];

		for (var i = 0; i < matrix.length; i++) {
			if (matrix.charAt(i) === '\n') {
				game.world.push(temp);
				temp = [];
			} else {
				temp.push(matrix.charAt(i));
			}
		}
		// Setting player and box positions
		game.playerPos.push(positions[0], positions[1]);
		for (var i = 2; i < positions.length - 1; i += 2) {
			game.boxesPos.push({
				x: positions[i],
				y: positions[i + 1],
			});
		}

		// Setting map info
		return game;
	}
	// Reads the file information for the game
	readFile() {
		var data = fs.readFileSync(this.filename, {
			encoding: 'utf-8',
		});
		return this.createGameInfo(data);
	}
}

module.exports = Reader;
