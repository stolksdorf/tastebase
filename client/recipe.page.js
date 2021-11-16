const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');



global.css.recipe_page = css`
	section.Recipe{
		position: relative;
		padding-top: 2em;
		padding-bottom: 8em;



		&.showNotes{
			.chef_note{
				display: block !important;
			}
		}


		.controls{
			position: absolute;
			top : 30px;
			right: 10px;

			i.fav{
				font-size: 2em;
				cursor: pointer;
				user-select: none;
			}
		}

		.top{



			h1{
				font-size: 3em;
				margin: 0px;
			}

			blockquote{
				margin-left: 0px;
				border-left: 3px solid var(--grey);
				padding-left: 5px;
				font-size: 1.3em;
			}

			.info{
				label{
					display: inline-block;
					font-weight: bold;
					width : 100px;
				}
			}

			img{
				height : 200px;
			}

		}


		h3{
			font-size: 1.8em;
			margin: 0px;
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

			label.showChefNotes{
				cursor: pointer;
				user-select: none;
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



			.chef_note{
				display: none;
				//border: var(--green) 1px solid;
				//border-radius: 3px;
				font-style: italic;
				//border-left: 2px solid black;
				padding-left: 5px;
				font-size: 0.8em;
				color: var(--grey);

			}
		}

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


const toggleFav = (id)=>{
	hasFav(id)
		? window.localStorage.removeItem(`fav__${id}`)
		: window.localStorage.setItem(`fav__${id}`, true);
	return hasFav(id);
}

const hasFav = (id)=>{
	return !!localStorage.getItem(`fav__${id}`);
}


const RecipePage = comp(function(recipe){
	if(!recipe) return x`<section class='Recipe'>Oops, recipe not found</section>`;

	//console.log(recipe)

	const [servings, setServings] = this.useState(recipe.servings);
	const [showNotes, setShowNotes] = this.useState(false);

	const [isFav, setIsFav] = this.useState(hasFav(recipe.id));

	this.useEffect(()=>{
		[...document.querySelectorAll('.ingredient')].map((el)=>{
			xo.render(el, IngredientControl({
				name  : el.getAttribute('x-name'),
				qty   : Number(el.getAttribute('x-qty')),
				unit  : el.getAttribute('x-unit'),
			}, recipe.servings));
		});
	}, []);

	this.useEffect(()=>{
		ServeringsEmitter.emit('servingsChange', servings)
	},[servings])

	return x`<section class=${cx('Recipe', {showNotes})}>
		<div class='controls'>
			<a href=${recipe.github} target='_blank'>Edit this Recipe <i class='fa fa-pencil'></i></a>
			<i class=${cx('fav fa fa-fw', {'fa-star': isFav, 'fa-star-o': !isFav})} onclick=${()=>setIsFav(toggleFav(recipe.id))}></i>
		</div>

		<div class='top'>
			<h1>${recipe.title}</h1>
			<div class='info'>
				<div><label>Chef:</label> <a href=${`?search=chef:${recipe.chef}`}>${recipe.chef}</a></div>
				<div><label>Recipe Type:</label> <a href=${`?search=type:${recipe.type}`}>${recipe.type}</a></div>
			</div>
			${recipe.desc && x`<blockquote>${recipe.desc}</blockquote>`}
			${recipe.img && x`<img src=${recipe.img}></img>`}
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

				${recipe.hasNotes && x`<label class='showChefNotes'>
					<input type='checkbox' checked=${showNotes} onclick=${()=>setShowNotes(!showNotes)}></input>
					Show Chef Notes
				</label>`}
			</h3>

			${x(recipe.content)}
		</div>
		<hr />
	</section>`
});

module.exports = RecipePage;
