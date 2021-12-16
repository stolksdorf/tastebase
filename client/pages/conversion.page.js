const {x, comp, cx} = require('../../libs/xo.js');
const css = require('../../libs/pico-css.js');


const {getCompatibleUnits} = require('../../utils/units.js');
const convert = require('../../utils/convert.units.js');
const {parseIngredient} = require('../../utils/parse.ingredient.js');

global.css.conversion_page = css`
	.ConversionPage{
		min-height: 500px;
		.searchBox{
			text-align: center;

			input{
				text-align: left;
				font-size: 3em;
				border: none;
				font-family: inherit;
				color: #854E3A;
				background-color: transparent;
				border-left: 3px solid #854E3A;
			}
		}

		.results{
			margin: 0 auto;
			max-width: 500px;
			font-size: 2em;
			ul{
				//font-size: 2em;
			}
			.temperature{

			}
		}

	}
`;



const ConversionPage = comp(function(){

	const [query, setQuery] = this.useState('');


	this.useEffect(()=>{
		this.el.querySelector('input').focus();
		document.title = `Convert Units - Tastebase`;
		window.scrollTo(0, 0);
	},[]);



	const tryIngredientUnits = (str)=>{
		const ingredient = parseIngredient(query);
		if(!ingredient.unit) return [];
		return getCompatibleUnits(ingredient).map(unit=>{
			return `${convert(ingredient, unit)} ${unit}`;
		});
	};

	const tryTemperature = (str)=>{
		const res = (/(\d*\.?\d+)(c|°c| celsius|f|°f| fahrenheit)/img).exec(str);
		if(!res) return;
		let [_,val,unit] = res;
		unit = unit.toLowerCase();


		if(unit.includes('f')) return (val*1.8 + 32).toFixed(1) +'°C';
		if(unit.includes('c')) return (val*1.8 + 32).toFixed(1) +'°F';
	}

	const units = tryIngredientUnits(query);

	const temperature = tryTemperature(query);






	return x`<section class='ConversionPage'>
		<h2>Ye Olde Conversion Tool</h2>

		<div class='searchBox'>
			<input type='text'
				value=${query}
				oninput=${(evt)=>setQuery(evt.target.value)}
				placeholder='3 1/4 cups of butter, 45C, ...'></input>
		</div>

		<hr>

		<div class='results'>

			${units.length!==0 && x`<ul>
				${units.map(unit=>x`<li><strong>${unit}<strong></li>`)}
				</ul>`
			}

			${!!temperature && x`<div class='temperature'>${temperature}</div>`}

		</div>

	</section>`
});



module.exports = ConversionPage;