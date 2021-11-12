//const fs = require('fs'), path = require('path');
const marked = require('marked');
const trnp = require('pico-trnp');



const parseMarkdown = (content, additionalInfo = {})=>{
	let info = {};
	if(content.startsWith('---')){
		const [_, frontMatter, ...rest] = content.split('---');
		info = trnp(frontMatter);
		content = rest.join('---');
	}
	content = marked(content);
	return { ...additionalInfo, ...info, content: marked(content) };
};


const Units = require('../client/units.js');


//TODO: Also loop through and find all temperatures and inject the inverse in a small tag
const parseIngredients = (recipe)=>{
	let ingredients = [];
	let content = recipe.content.replace(/{(.+?)}/g, (_,match)=>{
		let amount = '';
		let qty = 0;
		let unit = '';
		let name = '';

		if(match.indexOf('|') == -1){
			name = match;
		}else{
			let parts = match.split('|');
			name = parts[1].trim();
			amount = parts[0].trim();

			const res = Units.parse(amount);
			qty = res.qty;
			unit = res.unit||'';
		}

		ingredients.push({ name, qty, unit, amount })
		return `<span class='ingredient' x-qty='${qty}' x-unit='${unit}' x-name='${name}' x-amount='${amount}'>${(amount + ' '+ name).trim()}</span>`;
	});
	content = `<div class='instructions'>${content}</div>`;
	return {...recipe, ingredients, content};
};

const parseTemperatures = (recipe)=>{
	let content = recipe.content;

	content = content.replace(/(\d*\.?\d+)(c |c$|°c| celsius|f |f$|°f| fahrenheit)/gim, (_,val, unit)=>{
		if(unit.toLowerCase().indexOf('c') !== -1) return `<span class='temperature'>${val}°C<small>(${(val*9/5 + 32).toFixed(1)}°F)</small></span>`;
		if(unit.toLowerCase().indexOf('f') !== -1) return `<span class='temperature'>${val}°F<small>(${(val*1.8 + 32).toFixed(1)}°C)</small></span>`;
	});

	//Find all temperatures and add a small conversion
	return {...recipe, content};
};

const parseComments = (recipe)=>{
	let content = recipe.content;

	content = content.replace(/\/\*/g, `<span class='note'>`);
	content = content.replace(/\*\//g, `</span>`);

	content = content.replace(/\/\/(.*)$/gm, (_, note)=>`<span class='note'>${note}</span>`)

	return {...recipe, content};
}

//TOOD: this should be exposed
const parseRecipe = (markdown, info={})=>{
	let recipe = {};
	try{
		recipe = parseMarkdown(markdown, {
			...info,
			desc     : '',
			servings : 1,
			tags     : [],
			type     : 'food',
			link     : false,
			chef     : 'Unknown',
			img      : false,
			cook_time: false,
			prep_time: false
		});
		recipe = parseIngredients(recipe);
		recipe = parseTemperatures(recipe);
		recipe = parseComments(recipe);

		if(!recipe.tags) recipe.tags=[];
		if(typeof recipe.tags == 'string') recipe.tags.split(',').map(x=>x.trim());

		return recipe;
	}catch(err){
		console.error(err);
		return {error : err.toString()}
	}
}


module.exports = parseRecipe;

