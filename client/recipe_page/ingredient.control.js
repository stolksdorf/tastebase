const {x, comp, cx} = require('../../libs/xo.js');
const css = require('../../libs/pico-css.js');

const ServeringsEmitter = require('../servings.emitter.js');

const {getCompatibleUnits} = require('../../utils/units.js');
const convert = require('../../utils/convert.units.js');

global.css.ingredient_control = css`
	.ingredientControl{
		font-weight: bold;
		.unit{
			display      : inline-block;
			margin-right : 0.15em;
			position     : relative;

			select{
				font-family : 'IM Fell English', serif;
				font-size   : 1em;
				font-weight : bold;
				display     : none;
				position    : absolute;
				left        : -4px;
				top         : -2px;
			}
		}
		&:hover{
			select{
				display: inherit;
			}
		}
	}
`;

const IngredientControl = comp(function(ingredient, initServings=1){
	const [unit, setUnit] = this.useState(ingredient.unit);
	const [servings, setServings] = this.useState(initServings);

	if(!this.refs.baseServings) this.refs.baseServings = initServings;
	this.useEffect(()=>ServeringsEmitter.on('servingsChange', setServings),[]);

	const qty = convert(ingredient, unit, servings/this.refs.baseServings);
	return x`<span class='ingredientControl'>
		${!!qty && qty.toLocaleString("en-US")}
		${unit && x`<div class='unit'>
			${unit}
			<select value=${unit} onchange=${(evt)=>setUnit(evt.target.value)}>
				${getCompatibleUnits(ingredient).map(key=>x`<option value=${key} selected=${key==unit}>${key}</option>`)}
			</select>
		</div>`}
		<label>${ingredient.name}</label>
	</span>`
});

module.exports = IngredientControl