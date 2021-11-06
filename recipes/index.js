const fs = require('fs'), path = require('path');

const parseRecipe = require('../scripts/parse.recipe.js');

let recipes = {};

const parse = (dir, prefix='')=>{
	fs.readdirSync(dir, {withFileTypes  : true}).map(file=>{
		const ext = path.extname(file.name);
		const name = path.basename(file.name,ext);
		const id = prefix ? prefix+'__'+name : name;

		if(file.isDirectory()){
			return parse(path.join(dir, file.name), id);
		}
		try{
			if(ext !== '.md') return;
			if(file.name == 'readme.md') return;

			recipes[id] = parseRecipe(fs.readFileSync(path.join(dir, file.name), 'utf8'), {
				id,
				github : `https://github.com/stolksdorf/tastebase/recipes/${id.split('__').join('/')}.md`,
				title    : name,
			});
		}catch(err){
			console.error(err)
			console.error(`File Parse Err: ${path.join(dir, file.name)}`)
		}
	});
}
parse('./recipes');

//parse out tags, types, chefs

let chefs = new Set(), types = new Set(), tags = new Set();

Object.values(recipes).map(recipe=>{
	chefs.add(recipe.chef);
	types.add(recipe.type);
	recipe.tags.map(tag=>tags.add(tag))
})

module.exports = {
	recipes,
	chefs : [...chefs],
	types : [...types],
	tags  : [...tags],
};