const {weightUnits, volumeUnits, aliases, stapleDensity} = require('./units.js');

const getUnit = (str)=>{
	str = str.trim().toLowerCase();
	if(weightUnits[str]) return str;
	if(volumeUnits[str]) return str;
	if(aliases[str]) return aliases[str];
};

const getStaple = (str)=>{
	str = str.trim().toLowerCase();
	return Object.keys(stapleDensity).find(staple=>str.indexOf(staple)!==-1);
};

const parseIngredient = (str)=>{
	let qty=0, unit='', parts=[], staple='';
	str.split(' ').map(p=>{
		const [num]= p.match(/\d*\.?\d+/) || [];
		const [frac] = p.match(/\d+\/\d+/) || [];
		const [text] = p.match(/[a-zA-Z]+/) || [];

		if(frac){
			const [a,b] = frac.split('/');
			qty += Number(a)/Number(b)
		}else if(num){
			qty += Number(num)
		}
		if(text){
			let _unit = getUnit(text);
			if(_unit){
				unit = _unit;
			}else{
				let _staple = getStaple(text);
				if(_staple) staple = _staple;
				parts.push(text);
			}
		}
	})
	return {qty, unit, staple, name:parts.join(' ')};
};

const extractIngredients = (str)=>{
	let ingredients = [];
	let content = str.replace(/{(.+?)}/g, (_,match)=>{
		const ingredient = parseIngredient(match);
		ingredients.push(ingredient)
		return `<span class='ingredient' x-qty='${ingredient.qty}' x-unit='${ingredient.unit}' x-name='${ingredient.name}' x-staple='${ingredient.staple}'>${match}</span>`;
	});
	content = content.trim();
	return {ingredients, content};
};

module.exports = {
	parseIngredient,
	extractIngredients,
}