const {x, comp, cx} = require('../../libs/xo.js');
const css = require('../../libs/pico-css.js');


const {getCompatibleUnits} = require('../../utils/units.js');
const convert = require('../../utils/convert.units.js');
const {parseIngredient} = require('../../utils/parse.ingredient.js');

global.css.conversion_page = css`
	.ConversionPage{
		min-height: 500px;

		h2{
			margin-top: 0px;
			font-size: 2em;
			text-align: center;
		}

		.content{
			display: flex;

			.results{
				flex-grow:1;
			}

		}

		.searchBox{
			text-align: center;

			textarea{
				text-align: left;
				font-size: 2em;
				border: none;
				font-family: inherit;
				color: #854E3A;
				background-color: transparent;
				border-left: 1px solid #854E3A;
				border-bottom: 1px solid #854E3A;
				height: 200px;
			}
		}

		.results{
			//background-color:blue;
			margin: 0 auto;
			max-width: 500px;
			font-size: 2em;
			display: flex;
			justify-content: space-evenly;
			.result{
				min-width: 130px;
				margin: 0px 10px;
				h4{
					margin-top: 0px;
					margin-bottom: 0px;
				}
				ul{
					margin-top: 10px;
					margin-left: -16px;
					font-size: 0.8em;
				}
			}
		}

	}
`;



const ConversionPage = comp(function(){

	const [query, setQuery] = this.useState('');


	this.useEffect(()=>{
		this.el.querySelector('textarea').focus();
		document.title = `Convert Units - Tastebase`;
		window.scrollTo(0, 0);
	},[]);



	const tryIngredientUnits = (str)=>{
		const ingredient = parseIngredient(str);
		if(!ingredient.unit) return [];
		return getCompatibleUnits(ingredient).map(unit=>{
			return `${convert(ingredient, unit).toLocaleString("en-US")} ${unit}`;
		});
	};

	const tryTemperature = (str)=>{
		const res = (/(\d*\.?\d+)(c|°c| celsius|f|°f| fahrenheit)/img).exec(str);
		if(!res) return;
		let [_,val,unit] = res;
		unit = unit.toLowerCase();


		if(unit.includes('f')) return ((val-32)*5/9).toFixed(1) +'°C';
		if(unit.includes('c')) return (val*9/5 + 32).toFixed(1) +'°F';
	}

	const makeResult = (query)=>{
		query = query.trim();
		if(!query) return;

		const units = tryIngredientUnits(query);
		const temperature = tryTemperature(query);

		let list = [];
		if(temperature){
			list = list.concat(temperature);
		}else{
			list = list.concat(units);
		}

		return x`<div class='result'>
			<h4>${query}</h4>
			<ul>${list.map(item=>x`<li>${item}</li>`)}</ul>
		</div>`
	}


	return x`<section class='ConversionPage'>
		<h2>Ye Olde Conversion Tool</h2>

		<div class='content'>
			<div class='searchBox'>
				<textarea
					value=${query}
					oninput=${(evt)=>setQuery(evt.target.value)}
					placeholder='3 1/4 cups of butter \n45C\n...'
				></textarea>
			</div>


			<div class='results'>
				${query.split('\n').map(line=>makeResult(line))}
			</div>
		</div>

	</section>`
});



module.exports = ConversionPage;