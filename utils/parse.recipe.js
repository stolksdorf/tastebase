const md = require('../libs/pico-md.js');


const {extractIngredients, toElement} = require('./parse.ingredient.js');
const extractMetadata = require('./metadata.recipe.js');


const convertTemperatures = (text)=>{
	return text.replace(/(-?\d*\.?\d+)(c|°c| celsius|f|°f| fahrenheit)(?=\W|$)/img, (_,val, unit)=>{
		if(unit.toLowerCase().indexOf('c') !== -1) return `<span class='temperature'><span>${val}°C</span><small>(${(val*9/5 + 32).toFixed(1)}°F)</small></span>`;
		if(unit.toLowerCase().indexOf('f') !== -1) return `<span class='temperature'><span>${val}°F</span><small>(${((val-32)*5/9).toFixed(1)}°C)</small></span>`;
	});
};



const extractComments = (text)=>{
	let comments = [];

	text = text.replace(/\/\*(.+)\*\//g, (_, note)=>{
		comments.push(note)
		return '!!!'+(comments.length-1);
	});
	text = text.replace(/\/\/(.*)$/gm, (_, note)=>{
		comments.push(note)
		return '!!!'+(comments.length-1);
	});

	return {comments, text};
};


const splitOnHeaders = (text)=>{
	let [first, ...rest] = text.split(/^#/m);
	return [first].concat(rest.map(x=>'#'+x));
}

const parseRecipe = (raw)=>{

	let {content, ...info} = extractMetadata(raw);
	const {comments, text} = extractComments(content);

	let allIngredients = [];

	let html = splitOnHeaders(text).map((section)=>{
		let result = '';
		let [ingredients, content] = extractIngredients(section);

		allIngredients = allIngredients.concat(ingredients);

		result = convertTemperatures(content);
		result = md(result, {allowHTML:true});

		if(ingredients.length){ //Add INgredient list after header
			let pos = result.search(/<\/h\d>/);
			pos = (pos===-1) ? 0 : pos + 6;
			const ingredientList = `<ul class='ingredientList'>${ingredients.map(i=>`<li>${toElement(i)}</li>`).join('\n')}</ul>\n`;
			result = result.slice(0,pos) + ingredientList + result.slice(pos);
		}
		return result;
	}).join('\n\n');

	//add comments back in
	html = comments.reduce((acc, comment, idx)=>{
		return acc.replace(`!!!${idx}`, `<span class='chef_note' style='display:none'>${comment}</span>`);
	}, html);

	return {
		...info,
		ingredients : allIngredients,
		hasChefNotes : html.indexOf(`<span class='chef_note'`)!==-1,
		html
	}
}

module.exports = parseRecipe;
