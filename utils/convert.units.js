const {units, stapleDensity, volumeUnits, weightUnits, useFraction} = require('./units.js');

const toFraction = (val)=>{
	let scalar = Math.floor(val);
	let [frac] = Object.entries({'zero':0,'⅛':1/8,'¼':1/4,'⅜':3/8,'½':1/2,'⅝':5/8,'¾':3/4,'⅞':7/8,'one':1})
		.reduce((acc, [str, num])=>{
			const delta = Math.pow(val - scalar - num, 2);
			if(delta < acc[1]) return [str, delta];
			return acc;
		}, ['one', 1]);
	if(frac == 'one'){ frac = false; scalar += 1}
	if(frac == 'zero'){ frac = false; }
	return `${scalar || ''}${frac || ''}`.trim();
};

const convert = (ingredient, toUnit, multiplier=1)=>{
	let result = ingredient.qty * multiplier;
	let fromUnit = ingredient.unit;

	if(units[fromUnit] && units[fromUnit][toUnit]){
		result = units[fromUnit][toUnit] * result;
	}else if(ingredient.staple){
		let density = stapleDensity[ingredient.staple];

		if(volumeUnits[fromUnit]){
			//volume -> ml -> g -> weight
			result = volumeUnits[fromUnit]['ml'] * result * 1/density;
			result = weightUnits['grams'][toUnit] * result;
		}
		if(weightUnits[fromUnit]){
			//weight -> g -> ml -> volume
			result = weightUnits[fromUnit]['grams'] * result * density;
			result = volumeUnits['ml'][toUnit] * result;
		}
	}

	if(useFraction[toUnit]) return toFraction(result);

	let places = 1;
	if(result < 10) places = 10;
	if(result < 1) places = 100;
	return Math.round(result * places)/places;
};


module.exports = convert;