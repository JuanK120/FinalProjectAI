/**
 * AGENTES SOKOBAN
 * Juan Camilo Rosero 1746848
 * MAria Fernanda Arroyo 1740443
 */

const AgentBfs = require('./agents/AgentBfs');
const AgentDfs = require('./agents/AgentDfs');
const AgentDsi = require('./agents/AgentDsi');
const Reader = require('./fileReader/Reader');

/*
Este es el main para inicializar el juego. 
En esta parte se reciben los agentes para cada busqueda respectivamente 
Se inicializa la game para leer el archivo del juego y
*/

const _game = new Reader(process.argv[2]);
var game = _game.readFile();

var bfs = new AgentBfs(game, game.boxesPos);
console.log(`\n`);
bfs.expand();

var dfs = new AgentDfs(game, game.boxesPos);
console.log(`\n`);
dfs.expand();

var dsi = new AgentDsi(game, game.boxesPos);
console.log(`\n`);
dsi.expand();
