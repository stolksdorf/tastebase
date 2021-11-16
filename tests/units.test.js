const Units = require('../client/units.js');

module.exports = {
	parse : {
		unknown_units : (t)=>{
			const res = Units.parse(` 2.25  Slices`);
			t.is(res, {name : 'Slices', qty : 2.25, unit: undefined});
		},
		pural_units : (t)=>{
			const res = Units.parse(`4cups`);
			t.is(res, {unit : 'cups', qty : 4, name: ''});
		},
		complex_fractions : (t)=>{
			const res = Units.parse(`3 1/5TSP`);
			t.is(res, {unit : 'tsp', qty : 3.2, name: ''});
		},
		just_unit : (t)=>{
			const res = Units.parse(`litre`);
			t.is(res, {unit : 'liter', qty : 0, name : ''});
		},
		just_qty : (t)=>{
			const res = Units.parse(`20/5`);
			t.is(res, {unit : undefined, qty :4, name: ''});
		},
		complex : (t)=>{
			const res = Units.parse("3 1/2cups of white sugar");
			t.is(res, {unit : 'cups', qty : 3.5, name: "of white sugar"});
		},
		get_staple_name : (t)=>{
			const res = Units.parse("8 stick of butter");
			console.log(res)
		}
	},
	convert : {
		using_frac : (t)=>{
			const res = Units.convert(2.4, 'liter', 'cups');
			t.is(res, '2⅜');
		},
		same_unit : (t)=>{
			const res = Units.convert(4, 'gram', 'gram');
			t.is(res, 4);
		},
		density : (t)=>{
			const res = Units.convert(4, 'cup', 'gram', 'flour');
			t.is(res, 4);
		}
	}
}