const {parseIngredient, extractIngredients} = require('../utils/parse.ingredient.js');

const convert = require('../utils/convert.units.js');



module.exports = {
	parse : {
		numbers : (t)=>{
			let res = parseIngredient(`140.56 cups of milk`);
			t.is(res.qty, 140.56);

			res = parseIngredient(`0.2 something something`);
			t.is(res.qty, 0.2);
		},
		fractions : (t)=>{
			let res = parseIngredient(` 2 3/4 cups of milk`);
			t.is(res.qty, 2.75);

			res = parseIngredient(` 1/16 something something`);
			t.is(res.qty, 0.0625);
		},
		staples : (t)=>{
			let res = parseIngredient(`a couple dashes of whole milk`);
			t.is(res.staple, 'milk');
			t.is(res.name, 'a couple dashes of whole milk');

			res = parseIngredient(`3 sticks of Melted Butter`);
			t.is(res.unit, 'sticks');
			t.is(res.staple, 'butter');
			t.is(res.name, 'of Melted Butter')

			res = parseIngredient(`3 cups of nothing`);
			t.is(res.staple, '');
			t.is(res.name, 'of nothing');
		},
		aliases : (t)=>{
			let res = parseIngredient(` 45.6 millilitres of milk`);
			t.is(res.unit, 'ml');

			res = parseIngredient(` 45.6 Pounds of stuff`);
			t.is(res.unit, 'lb');

			res = parseIngredient(`3/4tablespoons of stuff`);
			t.is(res.unit, 'tbsp');
		},
		unitless : (t)=>{
			let res = parseIngredient(`2 dashes of whole milk`);
			t.is(res.unit, '');
			t.is(res.qty, 2);
		},
		just_text : (t)=>{
			let res = parseIngredient(`this is just some text`);
			t.is(res.unit, '');
			t.is(res.qty, 0);
			t.is(res.staple, '');
			t.is(res.name, 'this is just some text');
		},

	},
	extract : (t)=>{
		const res = extractIngredients(`
1. Heat {1 3/4 cups of whole milk} to 105F. Mix in {2 tsp of yeast}.
2. Add some {korean bbq sauce}, and {2 dashes MSG}
`);

		t.is(res.ingredients, [
			{ qty: 1.75, unit: 'cups', staple: 'milk', name: 'of whole milk' },
			{ qty: 2, unit: 'tsp', staple: '', name: 'of yeast' },
			{ qty: 0, unit: '', staple: '', name: 'korean bbq sauce' },
			{ qty: 2, unit: '', staple: '', name: 'dashes MSG' }
		]);
		t.is(res.content, `1. Heat <span class='ingredient' x-qty='1.75' x-unit='cups' x-name='of whole milk' x-staple='milk'>1 3/4 cups of whole milk</span> to 105F. Mix in <span class='ingredient' x-qty='2' x-unit='tsp' x-name='of yeast' x-staple=''>2 tsp of yeast</span>.
2. Add some <span class='ingredient' x-qty='0' x-unit='' x-name='korean bbq sauce' x-staple=''>korean bbq sauce</span>, and <span class='ingredient' x-qty='2' x-unit='' x-name='dashes MSG' x-staple=''>2 dashes MSG</span>`);
	},

	convert : {
		basic : (t)=>{
			t.is(convert(parseIngredient(`3 cups of milk`), 'tbsp'), 48);
			t.is(convert(parseIngredient(`45.3g of almonds`), 'lb'), 0.1);
			t.is(convert(parseIngredient(`45.33456g of almonds`), 'grams'), 45.3);
		},
		fractions : (t)=>{
			t.is(convert(parseIngredient(`0.75 cups of water`), 'cups'), '¾');
			t.is(convert(parseIngredient(`45.3g of almonds`), 'oz'), '1⅝');
		},
		staples : (t)=>{
			t.is(convert(parseIngredient(`3 cups of milk`), 'oz'), '27⅛');
			t.is(convert(parseIngredient(`1/2 stick of butter`), 'tbsp'), '4');
		},
		dynamic_rounding : (t)=>{
			t.is(convert(parseIngredient(`0.33456g of saffron`), 'grams'), 0.335);
			t.is(convert(parseIngredient(`1.2567lb of flour`), 'lb'), 1.26);
			t.is(convert(parseIngredient(`45.33456g of almonds`), 'grams'), 45.3);
			t.is(convert(parseIngredient(`3.0004 grams of milk`), 'grams'), 3);
		}
	}
};