const isDev = process.argv.some(v=>v=='--dev');
const pack = require('../libs/pico-pack');

const Pages = require('../client/index.js');
const {recipes,chefs,types,tags} = require('../recipes');


const bundle = ()=>{
	const html = Pages.main({recipes,chefs,types,tags});

	require('fs').writeFileSync('./index.html', html, 'utf8');
	console.log('Updated!')
}


bundle();

pack.emitter.on('update', (fp)=>bundle());


if(isDev) require('live-server').start();