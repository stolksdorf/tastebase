const marked = require('marked'); //TODO: replace with own lib


const {extractIngredients, toElement} = require('./parse.ingredient.js');
const meta = require('./metadata.recipe.js');


const convertTemperatures = (text)=>{
	return text.replace(/(\d*\.?\d+)(c|°c| celsius|f|°f| fahrenheit)/img, (_,val, unit)=>{
		if(unit.toLowerCase().indexOf('c') !== -1) return `<span class='temperature'><span>${val}°C</span><small>(${(val*9/5 + 32).toFixed(1)}°F)</small></span>`;
		if(unit.toLowerCase().indexOf('f') !== -1) return `<span class='temperature'><span>${val}°F</span><small>(${(val*1.8 + 32).toFixed(1)}°C)</small></span>`;
	});
};

const convertComments = (text)=>{
	text = text.replace(/\/\*/g, `<span class='chef_note'>`);
	text = text.replace(/\*\//g, `</span>`);

	text = text.replace(/\/\/(.*)$/gm, (_, note)=>`<span class='chef_note'>${note}</span>`)
	return text;
};

const toHTML = (text)=>{
	let result = '';
	let [ingredients, content] = extractIngredients(text);

	result = convertTemperatures(content);
	result = convertComments(result);
	result = marked(result);

	if(ingredients.length){
		let pos = result.search(/<\/h\d>/);
		pos = (pos===-1) ? 0 : pos + 6;
		const ingredientList = `<h5>Ingredients</h5>\n<ul>${ingredients.map(i=>`<li>${toElement(i)}</li>`)}</ul>\n`;
		result = result.slice(0,pos) + ingredientList + result.slice(pos);
	}
	return result;
};

const splitOnHeaders = (text)=>{
	let [first, ...rest] = text.split(/^#/m);
	return [first].concat(rest.map(x=>'#'+x));
}

const parseRecipe = (raw)=>{
	let {content, ...info} = meta(raw);
	let html = splitOnHeaders(content).map(toHTML).join('\n\n');

	return {
		...info,
		hasChefNotes : html.indexOf(`<span class='chef_note'>`)!==-1,
		html
	}
}

module.exports = parseRecipe;
