/**
 * AGENTE HEX
 * Integrantes:
 * Juan Camilo Rosero 1746848
 * Maria Fernanda Arroyo 1740443
 *
 */
const Agent = require('ai-agents').Agent;
const getEmptyHex = require('./getEmptyHex');
const minMax = require('./minMax');
const Graph = require('node-dijkstra');

//  Implementamos la clase HexAgente e iniciamos el constructor el cual recibe la variable value.

class Node {
	constructor(nodeFather, world, maximaxingPlay, depth, x, y) {
		this.nodeFather = nodeFather;
		this.world = world;
		this.maximazingPlay = maximaxingPlay;
		this.depth = depth;
		this.posx = x;
		this.posy = y;

		if (!this.maximazingPlay) {
			this.miniMaxVal = Infinity;
		} else {
			this.miniMaxVal = -Infinity;
		}
	}

	getWorld() {
		return this.world;
	}

	getDepth() {
		return this.depth;
	}

	isMaximizing() {
		return this.maximazingPlay;
	}

	getMinimaxVal() {
		return this.miniMaxVal;
	}

	getPos() {
		return [this.posx, this.posy];
	}

	setMinimaxVal(val, r, c) {
		if (!this.maximaxingPlay) {
			this.miniMaxVal = Math.min(val, this.miniMaxVal);
		} else {
			this.miniMaxVal = Math.max(val, this.miniMaxVal);
		}
		if (this.depth != 0) {
			this.informFather();
		} else if (this.miniMaxVal == val) {
			this.pos = [r, c];
		}
	}

	informFather() {
		let row = this.posx;
		let column = this.posy;
		this.nodeFather.setMinimaxVal(this.utility, row, column);
	}

	getheuristic(player) {
		let worldT = this.transpose(this.world);
		let oponentPath;
		let playerPath = this.shortestPath(this.world, player);
		//console.log(worldT);
		if (player === '1') {
			oponentPath = this.shortestPath(worldT, player);
			playerPath = this.shortestPath(this.world, player);
		} else {
			oponentPath = this.shortestPath(this.world, '1');
			playerPath = this.shortestPath(worldT, '1');
		}

		if (playerPath === null) {
			this.miniMaxVal = -101;
		} else if (oponentPath === null) {
			this.miniMaxVal = 101;
		} else {
			let oponentPathlength;
			let playerPathlength;

			if (player === '1') {
				oponentPathlength = this.pathLength(oponentPath, worldT, player);
				playerPathlength = this.pathLength(playerPath, this.world, player);
			} else {
				oponentPathlength = this.pathLength(oponentPath, this.world, '1');
				playerPathlength = this.pathLength(playerPath, worldT, '1');
			}
			if (playerPathlength <= 0) {
				this.miniMaxVal = 100;
			} else if (oponentPathlength <= 0) {
				this.miniMaxVal = -100;
			} else {
				//console.log(`oponent ${oponentPathlength}`);
				//console.log(`player ${playerPathlength}`);
				let val = oponentPathlength - playerPathlength;
				//console.log(`value op ${val}`);
				this.miniMaxVal = val;
			}
		}
	}

	pathLength(arr, world, play) {
		let size = arr.length;
		let worldSize = world.length;
		let count = 0;

		for (let i = 1; i < size - 1; i++) {
			let key = parseInt(arr[i], 10);
			let x = Math.floor(key / worldSize);
			let y = key % worldSize;

			if (world[x][y] != play) {
				count++;
			}
		}

		return count;
	}

	shortestPath(world, player) {
		const graph = new Graph();
		let size = world.length;

		for (let i = 0; i < size; i++) {
			for (let j = 0; j < size; j++) {
				let key = i * size + j;
				let neighbors = this.getNeighborhood(key, world, player);

				if (j === 0) {
					if (world[i][j] === 0) {
						neighbors['L'] = 2;
					} else if (world[i][j] === player) {
						neighbors['L'] = 1;
					}
				}
				if (j === size - 1) {
					if (world[i][j] === 0) {
						neighbors['R'] = 2;
					} else if (world[i][j] === player) {
						neighbors['R'] = 1;
					}
				}

				graph.addNode(key + '', neighbors);
			}
		}

		let neighborsL = {};
		let neighborsR = {};

		for (let i = 0; i < size; i++) {
			if (world[i][0] === 0) {
				neighborsL[i * size + ''] = 2;
			} else if (world[i][0] === player) {
				neighborsL[i * size + ''] = 1;
			}
			if (world[i][size - 1] === 0) {
				neighborsR[i * size + size - 1 + ''] = 2;
			} else if (world[i][size - 1] === player) {
				neighborsR[i * size + size - 1 + ''] = 1;
			}
		}

		graph.addNode('L', neighborsL);
		graph.addNode('R', neighborsR);

		return graph.path('L', 'R');
	}

	getNeighborhood(key, world, player) {
		let size = world.length;
		let row = Math.floor(key / size);
		let col = key % size;
		let result = {};

		if (this.insertNeighbor(row - 1, col)) {
			let name = (row - 1) * size + col;
			if (world[row - 1][col] === 0) {
				result[name + ''] = 2;
			} else if (world[row - 1][col] === player) {
				result[name + ''] = 1;
			}
		}

		if (this.insertNeighbor(row - 1, col + 1)) {
			let name = (row - 1) * size + (col + 1);
			if (world[row - 1][col + 1] === 0) {
				result[name + ''] = 2;
			} else if (world[row - 1][col + 1] === player) {
				result[name + ''] = 1;
			}
		}

		if (this.insertNeighbor(row, col + 1)) {
			let name = row * size + (col + 1);
			if (world[row][col + 1] === 0) {
				result[name + ''] = 2;
			} else if (world[row][col + 1] === player) {
				result[name + ''] = 1;
			}
		}

		if (this.insertNeighbor(row + 1, col)) {
			let name = (row + 1) * size + col;
			if (world[row + 1][col] === 0) {
				result[name + ''] = 2;
			} else if (world[row + 1][col] === player) {
				result[name + ''] = 1;
			}
		}

		if (this.insertNeighbor(row + 1, col - 1)) {
			let name = (row + 1) * size + (col - 1);
			if (world[row + 1][col - 1] === 0) {
				result[name + ''] = 2;
			} else if (world[row + 1][col - 1] === player) {
				result[name + ''] = 1;
			}
		}

		if (this.insertNeighbor(row - 1, col - 1)) {
			let name = (row - 1) * size + (col - 1);
			if (world[row][col - 1] === 0) {
				result[name + ''] = 2;
			} else if (world[row][col - 1] === player) {
				result[name + ''] = 1;
			}
		}

		return result;
	}

	insertNeighbor(row, col) {
		if (row >= 0 && row < this.world.length && col >= 0 && col < this.world.length) {
			return true;
		} else {
			return false;
		}
	}

	transpose(world) {
		let size = world.length;
		let worldT = new Array(size);
		for (let j = 0; j < size; j++) {
			worldT[j] = new Array(size);
			for (let i = 0; i < size; i++) {
				worldT[j][i] = world[i][j];
				if (worldT[j][i] === '1') {
					worldT[j][i] = '2';
				} else if (worldT[j][i] === '2') {
					worldT[j][i] = '1';
				}
			}
		}
		return worldT;
	}
}
module.exports = HexAgent;

class HexAgent extends Agent {
	constructor(value) {
		super(value);
		this.size = 0;
		this.world = [];
		this.check = [];
		this.root;

		this.expandNode = this.expandNode.bind(this);
		this.arraysEqual = this.arraysEqual.bind(this);
		this.isExplored = this.isExplored.bind(this);
		this.minimaxAlgo = this.minimaxAlgo.bind(this);
	}

	arraysEqual(arr1, arr2) {
		for (var i = arr1.length; i--; ) {
			for (var j = arr1.length; j--; ) {
				if (arr1[i][j] !== arr2[i][j]) return false;
			}
		}
		return true;
	}

	isExplored(world) {
		for (let i = 0; i < this.check.length; i++) {
			if (this.arraysEqual(world, this.check[i].getWorld())) {
				return false;
			}
		}
		return true;
	}

	expandNode(type, father) {
		var sonNodes = [];
		for (let i = 0; i < this.size; i++) {
			for (let j = 0; j < this.size; j++) {
				let aux = father.getWorld().map(function (arr) {
					return arr.slice();
				});
				if (aux[i][j] === 0) {
					if (!type) aux[i][j] = this.getID();
					else if (type) {
						if (this.getID() == '1') aux[i][j] = '2';
						else aux[i][j] = '1';
					}
					if (this.isExplored(father.getWorld())) {
						sonNodes.unshift(new Node(father, aux, type, father.getDepth() + 1, i, j));
					}
				}
			}
		}
		return sonNodes;
	}

	minimaxAlgo(player, alfa, beta) {
		let sonNodes = [];
		if (player.getDepth() == 3) {
			player.getheuristic(this.getID());
			player.informFather();
			let Val = player.getMinimaxVal();
			//console.log(`minimaxVal ${miniMaxVal}`);
			return Val;
		}
		//console.log(`player is ${player.isMaximizing() ? 'maximizing' : 'minimizing'}`);

		if (!player.isMaximizing()) {
			sonNodes = this.expandNode(true, player);
		} else {
			sonNodes = this.expandNode(false, player);
		}

		if (player.isMaximizing()) {
			for (let i = 0; i < sonNodes.length; i++) {
				let score = this.minimaxAlgo(sonNodes[i], alfa, beta);
				if (score > alfa) {
					alfa = score;
				}
				if (alfa >= beta) {
					//console.log(`is maximizing \n score ${score} \n alfa ${alfa} \n beta ${beta}`);
					return alfa;
				}
				//console.log(`is maximizing \n score ${score} \n alfa ${alfa} \n beta ${beta}`);
			}
			return alfa;
		} else {
			for (let i = 0; i < sonNodes.length; i++) {
				let score = this.minimaxAlgo(sonNodes[i], alfa, beta);

				if (score < beta) {
					beta = score;
				}
				if (alfa >= beta) {
					//console.log(`is minimizing \n score ${score} \n alfa ${alfa} \n beta ${beta}`);
					return beta;
				}
				//console.log(`is minimizing \n score ${score} \n alfa ${alfa} \n beta ${beta}`);
			}
			return beta;
		}
	}

	send() {
		this.world = this.perception.map(function (arr) {
			return arr.slice();
		});
		this.size = this.world.length;

		this.root = new Node(null, this.world, true, 0);

		//console.log(this.root);

		let num = this.minimaxAlgo(this.root, -100, 100);

		this.check = [];

		let sendPos = this.root.getPos();

		return sendPos;
	}
}
