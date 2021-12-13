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

const parseIngredient = (raw)=>{
	let qty=0, unit='', parts=[], staple='';
	raw.split(' ').map(p=>{
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
	return {qty, unit, staple, name:parts.join(' '), raw};
};

const extractIngredients = (str)=>{
	let ingredients = [];
	let content = str.replace(/{(.+?)}/g, (_,match)=>{
		const ingredient = parseIngredient(match);
		ingredients.push(ingredient)
		return toElement(ingredient);
	});
	content = content.trim();
	return [ingredients, content];
};

const toElement = ({qty, unit, staple, name, raw})=>{
	return `<span class='ingredient' x-qty='${qty}' x-unit='${unit}' x-name='${name}' x-staple='${staple}'>${raw}</span>`;
};

module.exports = {
	parseIngredient,
	extractIngredients,
	toElement,
}