const Units = require('../client/units.js');

module.exports = {
	parse : {
		unknown_units : (t)=>{
			const res = Units.parse(` 2.25  Slices`);
			t.is(res, {unit : 'slices', qty : 2.25});
		},
		pural_units : (t)=>{
			const res = Units.parse(`4cups`);
			t.is(res, {unit : 'cup', qty : 4});
		},
		complex_fractions : (t)=>{
			const res = Units.parse(`3 1/5TSP`);
			t.is(res, {unit : 'tsp', qty : 3.2});
		},
		just_unit : (t)=>{
			const res = Units.parse(`fl. oz.`);
			t.is(res, {unit : 'oz', qty : 0});
		},
		just_qty : (t)=>{
			const res = Units.parse(`20/5`);
			t.is(res, {unit : undefined, qty :4});
		},
	},
	convert : {
		using_frac : (t)=>{
			const res = Units.convert(2.2, 'cup', 'pint');
			t.is(res, '1⅛');
		},
		same_unit : (t)=>{
			const res = Units.convert(4, 'gram', 'gram');
			t.is(res, 4);
		},
	}
}