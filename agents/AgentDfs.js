const Game = require('../Game/Game');
//En esta clase constuimos el agente para busqueda por profundidad
// nos basamos inicialmente en elmanejo de las  percepciones 
// ademas retringimos la busquedad a max 64 niveles

class AgentDfs extends Game {
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
						this.queue.unshift(sonNode);
					}
				}
			}
		}
//en esta parte se verifican dos salidas por pantalla, si supera los niveles de 
//busquedad o si no existe solucion
		this.solution = {};
		if (exceedsDepth) {
			console.log('possible solution exceeds allowed depth');
		} else {
			console.log('No Solution');
		}
	}
}

module.exports = AgentDfs;
