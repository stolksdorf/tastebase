const volumeUnits = {
	cups   : {
		cups  : 1,
		ml    : 236.6,
		tsp   : 48,
		tbsp  : 16,
		liter : 0.2366
	},
	ml : {
		cups  : 0.004227,
		ml    : 1,
		tsp   : 0.2029,
		tbsp  : 0.06763,
		liter : 0.001,
	},
	tsp   : {
		cups  : 0.02083,
		ml    : 4.929,
		tsp   : 1,
		tbsp  : 0.3333,
		liter : 0.004929,
	},
	tbsp  : {
		cups  : 0.0625,
		ml    : 14.79,
		tsp   : 3,
		tbsp  : 1,
		liter : 0.01479,
	},
	liter : {
		cups  : 4.227,
		ml    : 1000,
		tsp   : 202.9,
		tbsp  : 67.63,
		liter : 1,
	},
};
const weightUnits = {
	grams : {
		grams : 1,
		lb : 0.002205,
		oz : 0.03527,
		sticks: 0.008818
	},
	lb : {
		grams : 453.6,
		lb : 1,
		oz : 16,
		sticks: 4
	},
	oz : {
		grams : 28.35,
		lb : 0.0625,
		oz : 1,
		sticks: 0.25
	},
	sticks : {
		grams : 113.398,
		lb    : 0.25,
		oz    : 4,
		sticks: 1
	}
};


const stapleDensity = { //from g->ml
	milk   : 0.924,
	flour  : 1.98,
	sugar  : 1.17,
	butter : 1.04,
	water  : 1,
	oil    : 1.1,
};

const aliases = {
	teaspoon      : 'tsp',
	teaspoons     : 'tsp',
	tablespoon    : 'tbsp',
	tablespoons   : 'tbsp',
	tblsp         : 'tbsp',
	l             : 'liter',
	liters        : 'liter',
	litre         : 'liter',
	litres        : 'liter',
	millilitre    : 'ml',
	milliliter    : 'ml',
	millilitres   : 'ml',
	milliliters   : 'ml',
	pound         : 'lb',
	pounds        : 'lb',
	g             : 'grams',
	gram          : 'grams',
	ounce         : 'oz',
	ounces        : 'oz',
	cup           : 'cups',
	stick         : 'sticks',
};

const useFraction = {
	cups   : true,
	tsp    : true,
	tbsp   : true,
	oz     : true,
	sticks : true,
};

const getCompatibleUnits = ({staple, unit})=>{
	const volume = Object.keys(volumeUnits), weight = Object.keys(weightUnits);
	if(staple) return volume.concat(weight);
	if(volumeUnits[unit]) return volume;
	if(weightUnits[unit]) return weight;
	return [];
};

module.exports = {
	units : {...weightUnits, ...volumeUnits},
	volumeUnits,
	weightUnits,
	stapleDensity,
	aliases,
	useFraction,
	getCompatibleUnits
}