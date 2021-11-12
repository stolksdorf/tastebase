const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');



global.css.recipe_page = css`
	section.Recipe{
		padding-top: 2em;
		padding-bottom: 8em;

		&.showNotes{
			.note{
				display: block !important;
			}
		}

		h1{
			font-size: 3em;
			margin: 0px;
		}
		h3{
			font-size: 1.8em;
			margin: 0px;
		}

		blockquote{
			margin-left: 0px;
			border-left: 3px solid var(--grey);
			padding-left: 5px;
		}

		.info{
			display: flex;
			justify-content: space-between;
			img{
				width : 200px;
			}
			blockquote{

			}


		}




		.ingredientControl{
			font-weight: bold;

			label{
				margin-left: 0.2em;
			}

			select{
				background-color: transparent;
				font-family: 'IM Fell English', serif;
				font-size: 0.8em;
				border-color: transparent;
				-webkit-appearance: none;

				font-weight: bold;

			}

			&:hover{
				select{
					border-color: var(--grey);
					-webkit-appearance: menulist;
				}
			}
		}

		.note{
			display: none;
			//border: var(--green) 1px solid;
			//border-radius: 3px;
			font-style: italic;
			//border-left: 2px solid black;
			padding-left: 5px;
			font-size: 0.8em;
			color: var(--grey);

		}

		.ingredients{
			font-size: 1.3em;

			h3{
				.servings{
					display: inline-block;
					font-size: 1.1rem;
					float: right;
					span{
						font-size: 1.5em;
					}
				}
			}
		}

		.instructions{
			font-size: 1.3em;

			h3{
				label{
					font-size: 1rem;
					float: right;
				}
			}

			li{
				margin: 0.6em 0em;
			}

			.temperature{
				small{
					display: none;
				}
				&:hover{
					small{
						display: inherit;
					}
				}
			}
		}

	}

	sup{
		font-size: 1em;
		vertical-align: baseline;
		background-color: var(--white);
		padding : 1px 3px;
		margin: 2px 2px;
		border-radius: 5px;
		text-decoration: none;
	}
	a sup{

	}

`;


const Emitter=()=>{
	let cache={};
	return {
		emit : (evt, ...args)=>(cache[evt]||[]).map(fn=>fn(...args)),
		on : (evt, func)=>{
			cache[evt]=(cache[evt]||[]).concat(func);
			return ()=>cache[evt]=cache[evt].filter(x=>x!=func);
		}
	};
};



const Units = require('./units.js');


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

		${Units.volume[unit] && x`<select value=${unit} onchange=${(evt)=>setUnit(evt.target.value)}>
			${Object.keys(Units.volume).map(key=>x`<option value=${key} selected=${key==unit}>${key}</option>`)}
		</select>`}
		${Units.weight[unit] && x`<select value=${unit} onchange=${(evt)=>setUnit(evt.target.value)}>
			${Object.keys(Units.weight).map(key=>x`<option value=${key} selected=${key==unit}>${key}</option>`)}
		</select>`}
		${!Units.volume[unit] && !Units.weight[unit] && qty && x`<span>${unit} </span>`}

		<label>${ingredient.name}</label>
	</span>`
});


const ServeringsEmitter = Emitter();


const Tidbit = (label, val, link)=>{
	if(!val) return;
	if(link){
		return x`<div class='field'>
			<label>${label}:</label>
			<a href=${link}><sup>${val}</sup></a>
		</div>`
	}
	return x`<div class='field'>
		<label>${label}:</label>
		<sup>${val}</sup>
	</div>`
}


const RecipePage = comp(function(recipe){
	if(!recipe) return x`<section class='Recipe'>Oops, recipe not found</section>`;

	const [servings, setServings] = this.useState(recipe.servings);
	const [showNotes, setShowNotes] = this.useState(false);

	this.useEffect(()=>{
		[...document.querySelectorAll('.ingredient')].map((el)=>{
			xo.render(el, IngredientControl({
				name  : el.getAttribute('x-name'),
				qty   : Number(el.getAttribute('x-qty')),
				unit  : el.getAttribute('x-unit'),
				amount  : el.getAttribute('x-amount'),
			}, recipe.servings));
		});
	}, []);

	this.useEffect(()=>{
		ServeringsEmitter.emit('servingsChange', servings)
	},[servings])

	return x`<section class=${cx('Recipe', {showNotes})}>
		<div class='top'>
			<h1>${recipe.title}</h1>
			${recipe.desc && x`<blockquote>${recipe.desc}</blockquote>`}
			<div class='info'>
				<div>
					${Tidbit('Chef', recipe.chef, `?search=chef:${recipe.chef}`)}
					${Tidbit('Type', recipe.type, `?search=type:${recipe.type}`)}
					${recipe.tags && recipe.tags.length && x`<div class='field'>
						<label>Tags:</label>
						${recipe.tags.map((tag)=>x`<a href=${`?search=${tag}`}><sup>${tag}</sup></a>`)}
					</div>`}
				</div>
				<div>
					${Tidbit('Prep Time', recipe.prep_time)}
					${Tidbit('Cook Time', recipe.cook_time)}
					${Tidbit('Edit', 'Link to Github', recipe.github)}


				</div>
				<div>
					${recipe.img && x`<img src=${recipe.img}></img>`}
				</div>
			</div>
		</div>


		<hr />

		<div class='ingredients'>
			<h3>
				Ingredients

				<div class='servings'>
					<label>Number of Servings:</label>
					<span>${servings}</span>
					<button onclick=${()=>setServings(servings+1)}>+</button>
					<button onclick=${()=>setServings(servings-1)}>-</button>
				</div>
			</h3>

			<ul>
				${recipe.ingredients.map((ingredient)=>{
					return x`<li>${IngredientControl(ingredient, servings)}</li>`;
				})}
			</ul>
		</div>

		<hr />

		<div class='instructions'>
			<h3>
				Instructions

				<label>
					<input type='checkbox' checked=${showNotes} onclick=${()=>setShowNotes(!showNotes)}></input>
					Show Chef Notes
				</label>
			</h3>

			${x(recipe.content)}
		</div>


		<hr />
	</section>`
});

module.exports = RecipePage;
