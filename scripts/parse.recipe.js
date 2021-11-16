const marked = require('marked');
const trnp = require('pico-trnp');

const Units = require('../client/units.js');

const parseMarkdown = (content)=>{
	let info = {};

	content = content.replace(/^#(.+)$/m, (_,header)=>{
		info.title = header.trim();
		return '';
	});

	content = content.replace(/!\[\]\((.+?)\)/m, (_,src)=>{
		info.img = src;
		return '';
	});

	content = content.replace(/^servings\s*:\s*(\d+)/im, (_,servings)=>{
		info.servings = Number(servings);
		return '';
	});

	content = content.replace(/^type\s*:\s*(.+)/im, (_,type)=>{
		info.type = type.trim().toLowerCase();
		return '';
	});

	content = marked(content);

	content = content.replace(/<p>(.+?)<\/p>/m, (_,desc)=>{
		info.desc = desc;
		return '';
	});
	return { ...info, content };
};



const parseIngredients = (recipe)=>{
	let ingredients = [];
	let content = recipe.content.replace(/{(.+?)}/g, (_,match)=>{
		const { name, qty, unit } = Units.parse(match);

		let text = [];
		if(qty) text.push(qty);
		if(unit) text.push(unit);
		text.push(name);

		ingredients.push({ name, qty, unit })
		return `<span class='ingredient' x-qty='${qty||0}' x-unit='${unit||''}' x-name='${name}'>${text.join(' ')}</span>`;
	});
	content = `<div class='instructions'>${content}</div>`;
	return {...recipe, ingredients, content};
};

const parseTemperatures = (recipe)=>{
	let content = recipe.content;

	content = content.replace(/(\d*\.?\d+)(c|°c| celsius|f|°f| fahrenheit)/img, (_,val, unit)=>{
		if(unit.toLowerCase().indexOf('c') !== -1) return `<span class='temperature'><span>${val}°C</span><small>(${(val*9/5 + 32).toFixed(1)}°F)</small></span>`;
		if(unit.toLowerCase().indexOf('f') !== -1) return `<span class='temperature'><span>${val}°F</span><small>(${(val*1.8 + 32).toFixed(1)}°C)</small></span>`;
	});

	return {...recipe, content};
};

const parseComments = (recipe)=>{
	let content = recipe.content;

	content = content.replace(/\/\*/g, `<span class='chef_note'>`);
	content = content.replace(/\*\//g, `</span>`);

	//FIXME: This breaks with URLs, don't know how to fix
	//content = content.replace(/\/\/(.*)$/gm, (_, note)=>`<span class='chef_note'>${note}</span>`)

	return {
		...recipe,
		content,
		hasNotes : content.indexOf(`<span class='chef_note'>`)!==-1};
}

const parseRecipe = (markdown, info={})=>{
	let recipe = {};
	try{
		recipe = parseMarkdown(markdown);
		recipe = parseIngredients(recipe);
		recipe = parseTemperatures(recipe);
		recipe = parseComments(recipe);

		return {
			type     : 'food',
			servings : 2,
			...recipe
		}
	}catch(err){
		console.error(err);
		return {error : err.toString()}
	}
}

module.exports = parseRecipe;
