const fs = require('fs'), path = require('path');

const parseRecipe = require('../scripts/parse.recipe.js');

let recipes = {};

const parse = (dir, chef=null)=>{
	fs.readdirSync(dir, {withFileTypes  : true}).map(file=>{
		const ext = path.extname(file.name);
		const name = path.basename(file.name,ext);
		const id = chef ? chef+'__'+name : name;

		if(file.isDirectory()){
			return parse(path.join(dir, file.name), chef ? chef : name);
		}
		try{
			if(ext !== '.md') return;
			if(file.name == 'readme.md') return;

			recipes[id] = {
				id,
				chef,
				github : `https://github.com/stolksdorf/tastebase/blob/master/${dir.split('\\').join('/')}/${file.name}`,
				...parseRecipe(fs.readFileSync(path.join(dir, file.name), 'utf8'))
			};
		}catch(err){
			console.error(err)
			console.error(`File Parse Err: ${path.join(dir, file.name)}`)
		}
	});
}
parse('./recipes');


let chefs = new Set(), types = new Set();

Object.values(recipes).map(recipe=>{
	chefs.add(recipe.chef);
	types.add(recipe.type);
})

module.exports = {
	recipes,
	chefs : [...chefs],
	types : [...types],
};