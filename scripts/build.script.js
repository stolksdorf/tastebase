const isDev = process.argv.some(v=>v=='--dev');
const pack = require('../libs/pico-pack');

const Pages = require('../client/index.js');

const chefs = require('fs').readFileSync('./chefs.txt', 'utf8')
	.split('\n')
	.map(n=>n.trim())
	.filter(n=>!!n);


const bundle = ()=>{
	const html = Pages.main({ chefs });
	require('fs').writeFileSync('./index.html', html, 'utf8');
	console.log('Updated!');
};

bundle();
pack.emitter.on('update', (fp)=>bundle());

if(isDev) require('live-server').start();