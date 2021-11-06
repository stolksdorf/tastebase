const {recipes,chefs,types,tags} = require('../recipes');

console.log(recipes);

require('../../crux/bundle.js')('../client/main.js', ({html})=>{
	require('fs').writeFileSync('./index.html', html, 'utf8');
}, {
	recipes,chefs,types,tags
});