const volume = {
	cup   : {
		cup   : 1,
		ml    : 236.6,
		tsp   : 48,
		tbsp  : 16,
		floz  : 8,
		pint  : 0.5,
		quart : 0.25,
		liter : 0.2366
	},
	ml : {

	},
	tsp   : {
		cup   : 1,
		ml    : 1,
		tsp   : 1,
		tbsp  : 1,
		floz  : 1,
		pint  : 1,
		quart : 1,
		liter : 1,
	},
	tbsp  : {

	},
	floz    : {

	},
	pint  : {

	},
	quart : {

	},
	liter : {

	},
};
const weight = {
	gram : {
		gram : 1,
		lb : 1,
		oz : 1
	},
	lb : {
		gram : 1,
		lb : 1,
		oz : 1
	},
	oz : {
		gram : 1,
		lb : 1,
		oz : 1
	}
};
const useFractions = {
	cup : true,
	tsp : true,
	tbsp : true,
	oz : true,
	pint : true,
	quart : true,
};
const alias = {
	'fl oz'       : 'floz',
	'fl. oz.'     : 'floz',
	'oz. fl.'     : 'floz',
	'fl.oz.'      : 'floz',
	'oz.fl.'      : 'floz',
	'fluid ounce' : 'floz',
	qt            : 'quart',
	teaspoon      : 'tsp',
	tablespoon    : 'tbsp',
	l             : 'liter',
	litre         : 'liter',
	millilitre    : 'ml',
	milliliter    : 'ml',
	pound         : 'lb',
	g             : 'gram',
	onuce         : 'oz',
};


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



//Take a raw string of quantity and/or unit and returns the normalized unit
// and numerical quantity, even expressed as fraction
const parse = (raw)=>{
	let qty=0, unit;
	raw.split(' ').map(p=>{
		const [num]= p.match(/\d*\.?\d+/) || [];
		const [frac] = p.match(/\d+\/\d+/) || [];
		const [_unit] = p.match(/[a-zA-Z]+/) || [];

		if(frac){
			const [a,b] = frac.split('/');
			qty += Number(a)/Number(b)
		}else if(num){
			qty += Number(num)
		}
		if(_unit){
			const name = _unit.toLowerCase().replace(/s$/, '');
			if(weight[name] || volume[name]){
				unit = name;
			}else{
				unit = alias[_unit.toLowerCase().replace(/s$/, '')] || _unit.toLowerCase();
			}
		}
	})
	return {qty, unit};
};

// Converts a value from one unit to another, including converting to fraction notation
const convert = (val, from_unit, to_unit)=>{
	if(volume[from_unit] && volume[from_unit][to_unit]){
		val = volume[from_unit][to_unit] * val;
	}
	if(weight[from_unit] && weight[from_unit][to_unit]){
		val = weight[from_unit][to_unit] * val;
	}
	if(useFractions[to_unit]) val = toFraction(val);
	if(typeof val == 'number' && val !== Math.floor(val)) val = val.toFixed(1);

	return val;
}

module.exports = {
	parse,
	convert,
	weight,
	volume
}