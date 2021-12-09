const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');


const ServeringsEmitter = require('./emitter.js');
const Units = require('./units.js');


global.css.ingredient_control = css`
	.ingredientControl{
		font-weight: bold;

		select{
			font-family: 'IM Fell English', serif;
			font-size: 0.79em;
			font-weight: bold;
			display: none;
		}

		span.unit{
			margin-top: 20px;
		}

		&:hover{
			select{
				display: inherit;
			}
			span.unit{
				display: none;
			}
		}
	}
`

const IngredientControl = comp(function(ingredient, initServings=1){
	const [unit, setUnit] = this.useState(ingredient.unit);
	const [servings, setServings] = this.useState(initServings);


	if(!this.refs.baseServings) this.refs.baseServings = initServings;
	this.useEffect(()=>{
		return ServeringsEmitter.on('servingsChange', (newServings)=>{
			setServings(newServings)
		})
	},[]);

	let qty = ingredient.qty || '';
	if(qty){
		qty = Units.convert(qty * servings/this.refs.baseServings, ingredient.unit, unit) ;
	}

	return x`<span class='ingredientControl'>
		${qty ? qty : ingredient.amount}
		${unit && x`<span class='unit'>${unit}</span>`}

		${Units.volume[unit] && x`<select value=${unit} onchange=${(evt)=>setUnit(evt.target.value)}>
			${Object.keys(Units.volume).map(key=>x`<option value=${key} selected=${key==unit}>${key}</option>`)}
		</select>`}
		${Units.weight[unit] && x`<select value=${unit} onchange=${(evt)=>setUnit(evt.target.value)}>
			${Object.keys(Units.weight).map(key=>x`<option value=${key} selected=${key==unit}>${key}</option>`)}
		</select>`}
		<label>${ingredient.name}</label>
	</span>`
});


module.exports = IngredientControl