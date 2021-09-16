const fs = require('fs');

/*La clase game crea el constructor donde hace un llamado al mundo, la pos
del jugador, la pos de las cajas, y se crear unos array para almacenar
la solución, las posicionesmeta, el que indica las visitas a cada casilla y el
array para la cola de los nodos
*/
class Game {
	constructor(game, gameBoxesPos) {
		this.world = game.world;
		this.pos = game.playerPos;
		this.boxes = gameBoxesPos;
		this.solution = [];
		this.goalsPositions = [];
		this.visited = [];
		this.queue = [];
		this.setup();
	}
//En esta parte se pasa a configurar la referencia a las variables indicadas 
	setup() {
		let root = {
			pos: this.pos,
			boxes: this.boxes,
			world: this.getMap(this.world),
			action: null,
			father: null,
			depth: 0,
		};
// Este for se encarga de verificar que donde hay un x es una casilla para poner caja
		for (let i = 0; i < this.world.length; i++) {
			for (let j = 0; j < this.world[0].length; j++) {
				if (this.world[i][j] === 'X') {
					this.goalsPositions.push([i, j]);
				}
			}
		}
// En esta parte, se pasa a verificar si existe una B en el mundo, para saber 
// si existe una caja

		for (let i = 0; i < this.boxes.length; i++) {
			root.world[this.boxes[i].x][this.boxes[i].y] = 'B';
		}

		this.queue.push(root);
	}

	getMap(world) {
		let copy = [];
		for (let i = 0; i < world.length; i++) {
			let aux = [];
			for (var j = 0; j < world[0].length; j++) {
				aux.push(world[i][j]);
			}
			copy.push(aux);
		}

		return copy;
	}
// en esta parte verificamos si el agente se encuentra en una caja 
	isOnBox(x, y, boxes) {
		for (let i = 0; i < boxes.length; i++) {
			if (boxes[i].x === x && boxes[i].y === y) {
				return true;
			}
		}
		return false;
	}
// en esta parte verificamos si la caja esta en la posición indicada y nos retorna
// true si es correcto
	GoalState(node) {
		let boxesInPlace = 0;
		for (var k = 0; k < this.goalsPositions.length; k++) {
			for (var i = 0; i < node.boxes.length; i++) {
				let box = node.boxes[i];
				if (box.x === this.goalsPositions[k][0] && box.y === this.goalsPositions[k][1]) {
					boxesInPlace++;
				}
			}
		}

		if (boxesInPlace === this.goalsPositions.length) {
			return true;
		}
		return false;
	}

	//esta función invierta una cadena y la retorna 
	reverse(string) {
		let length = string.length - 1;
		var ret = '';
		for (let i = 0; i <= length; i++) {
			ret = ret + string.charAt(length - i);
		}
		return ret;
	}

	getSolution(node) {
		let solution = '';
		while (node != null) {
			if (node.action === null) {
				break;
			}
			solution += node.action;
			node = node.father;
		}
		solution = this.reverse(solution);
		return solution;
	}
// esta funcion nos ayuda a saber si ya hemos visitado una posición 
	isVisited(node) {
		let vis = 0;
		for (var i = 0; i < this.visited.length; i++) {
			if (node.pos[0] === this.visited[i].pos[0] && node.pos[1] === this.visited[i].pos[1]) {
				for (var j = 0; j < node.boxes.length; j++) {
					if (
						node.boxes[j].x === this.visited[i].boxes[j].x &&
						node.boxes[j].y === this.visited[i].boxes[j].y
					) {
						vis++;
					}
				}
				if (vis === node.boxes.length) {
					return true;
				}
				vis = 0;
			}
		}
		return false;
	}

	getBoxOver(x, y, boxes) {
		for (let i = 0; i < boxes.length; i++) {
			if (boxes[i].x === x && boxes[i].y === y) {
				return i;
			}
		}
		return -1;
	}
// en esta parte manejamos la percepción del agente, para que este reconozca
//la posición y el espacio en el que esta y al rededor de el y pueda definir 
// la acción adecuada para continuar.
	perception(node) {
		let x = node.pos[0];
		let y = node.pos[1];
		let map = node.world;
		var perceptions = [];

		// UP
		if (x >= 1 && map[x - 1][y] != 'W') {
			if (map[x - 1][y] === 'B' && (map[x - 2][y] === '0' || map[x - 2][y] === 'X')) {
				perceptions.push('U');
			} else if (map[x - 1][y] === '0' || map[x - 1][y] === 'X') {
				perceptions.push('U');
			}
		}
		// DOWN
		if (x < map.length - 1 && map[x + 1][y] != 'W') {
			if (map[x + 1][y] === 'B' && (map[x + 2][y] === '0' || map[x + 2][y] === 'X')) {
				perceptions.push('D');
			} else if (map[x + 1][y] === '0' || map[x + 1][y] === 'X') {
				perceptions.push('D');
			}
		}
		// LEFT
		if (y > 0 && map[x][y - 1] != 'W') {
			if (map[x][y - 1] === 'B' && (map[x][y - 2] === '0' || map[x][y - 2] === 'X')) {
				perceptions.push('L');
			} else if (map[x][y - 1] === '0' || map[x][y - 1] === 'X') {
				perceptions.push('L');
			}
		}
		// RIGHT
		if (y < map[0].length - 1 && map[x][y + 1] != 'W') {
			if (map[x][y + 1] === 'B' && (map[x][y + 2] === '0' || map[x][y + 2] === 'X')) {
				perceptions.push('R');
			} else if (map[x][y + 1] === '0' || map[x][y + 1] === 'X') {
				perceptions.push('R');
			}
		}

		for (let i = 0; i < perceptions.length; i++) {
			if (perceptions[i] === 'U') {
				if (node.action === 'D') {
					perceptions.splice(i, 1);
				}
			} else if (perceptions[i] === 'D') {
				if (node.action === 'U') {
					perceptions.splice(i, 1);
				}
			} else if (perceptions[i] === 'L') {
				if (node.action === 'R') {
					perceptions.splice(i, 1);
				}
			} else if (perceptions[i] === 'R') {
				if (node.action === 'L') {
					perceptions.splice(i, 1);
				}
			}
		}

		return perceptions;
	}

	move(perception, node) {
		let map = this.getMap(node.world);
		let x = node.pos[0];
		let y = node.pos[1];
		let boxes = [];

		for (let i = 0; i < node.boxes.length; i++) {
			boxes.push({
				x: node.boxes[i].x,
				y: node.boxes[i].y,
			});
		}

		if (perception === 'U') {
			x -= 1;
			let sonNode = {
				pos: [x, y],
				boxes: boxes,
				world: map,
				action: 'U',
				father: node,
				depth: node.depth + 1,
			};

			if (this.isOnBox(x, y, boxes)) {
				let index = this.getBoxOver(x, y, boxes);
				if (index != -1) {
					map[boxes[index].x][boxes[index].y] = '0';
					boxes[index].x -= 1;
					map[boxes[index].x][boxes[index].y] = 'B';
					sonNode = {
						pos: [x, y],
						boxes: boxes,
						world: map,
						action: 'U',
						father: node,
						depth: node.depth + 1,
					};
				}
			}
			return sonNode;
		} else if (perception === 'D') {
			x += 1;
			let sonNode = {
				pos: [x, y],
				boxes: boxes,
				world: map,
				action: 'D',
				father: node,
				depth: node.depth + 1,
			};

			if (this.isOnBox(x, y, boxes)) {
				let index = this.getBoxOver(x, y, boxes);
				if (index != -1) {
					map[boxes[index].x][boxes[index].y] = '0';
					boxes[index].x += 1;
					map[boxes[index].x][boxes[index].y] = 'B';
					sonNode = {
						pos: [x, y],
						boxes: boxes,
						world: map,
						action: 'D',
						father: node,
						depth: node.depth + 1,
					};
				}
			}
			return sonNode;
		} else if (perception === 'L') {
			y -= 1;
			let sonNode = {
				pos: [x, y],
				boxes: boxes,
				world: map,
				action: 'L',
				father: node,
				depth: node.depth + 1,
			};

			if (this.isOnBox(x, y, boxes)) {
				let index = this.getBoxOver(x, y, boxes);
				if (index != -1) {
					map[boxes[index].x][boxes[index].y] = '0';
					boxes[index].y -= 1;
					map[boxes[index].x][boxes[index].y] = 'B';
					sonNode = {
						pos: [x, y],
						boxes: boxes,
						world: map,
						action: 'L',
						father: node,
						depth: node.depth + 1,
					};
				}
			}
			return sonNode;
		} else if (perception == 'R') {
			y += 1;
			let sonNode = {
				pos: [x, y],
				boxes: boxes,
				world: map,
				action: 'R',
				father: node,
				depth: node.depth + 1,
			};

			if (this.isOnBox(x, y, boxes)) {
				let index = this.getBoxOver(x, y, boxes);
				if (index != -1) {
					map[boxes[index].x][boxes[index].y] = '0';
					boxes[index].y += 1;
					map[boxes[index].x][boxes[index].y] = 'B';
					sonNode = {
						pos: [x, y],
						boxes: boxes,
						world: map,
						action: 'R',
						father: node,
						depth: node.depth + 1,
					};
				}
			}
			return sonNode;
		} else {
			// if solution was found
			let sonNode = {
				pos: [x, y],
				boxes: boxes,
				world: map,
				action: null,
				father: node,
				depth: node.depth + 1,
			};
			return sonNode;
		}
	}
}

module.exports = Game;
