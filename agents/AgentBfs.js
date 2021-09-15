const Game = require('../Game/Game');

class AgentBfs extends Game {
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
	expand() {
		let exceedsDepth = false;
		while (this.queue.length != 0) {
			let node = this.queue.splice(0, 1);
			node = node[0];
			if (node.depth >= 64) {
				exceedsDepth = true;
			} else {
				if (this.GoalState(node)) {
					console.log(this.getSolution(node));
					this.solution = node;
					exceedsDepth = false;
					return 0;
				} else if (this.isVisited(node)) {
					continue;
				} else {
					this.visited.push(node);
					let perceptions = this.perception(node);
					for (let i = perceptions.length - 1; i >= 0; i--) {
						let sonNode = this.move(perceptions[i], node);
						this.queue.push(sonNode);
					}
				}
			}
		}

		this.solution = {};
		if (exceedsDepth) {
			console.log('possible solution exceeds allowed depth');
		} else {
			console.log('No Solution');
		}
	}
}

module.exports = AgentBfs;
