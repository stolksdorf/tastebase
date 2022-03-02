const {x, comp, cx} = require('../../libs/xo.js');
const css = require('../../libs/pico-css.js');


const parseRecipe = require('../../utils/parse.recipe.js');


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

	}
`;

global.css.instruction_section = css`

	section.Recipe{
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

			textarea{
				font-family: inherit;
				width : 100%;
				background-color: transparent;
				//border: none;
				resize: none;
				font-size: 1em;
				min-height: 800px;
			}
		}
	}
`



const IngredientControl = require('./ingredient.control.js');
const ServingsEmitter = require('../servings.emitter.js');



//TODO: replace with fav control.js

// global.css.fav_control = css`
// 	i.fav{
// 		font-size: 2em;
// 		cursor: pointer;
// 		user-select: none;
// 		&.fa-heart{
// 			color : red;
// 		}
// 	}
// `;
// const FavControl = comp(function(id){
// 	const hasFav = (id)=>!!localStorage.getItem(`fav__${id}`);
// 	const toggleFav = (id)=>{
// 		hasFav(id)
// 			? window.localStorage.removeItem(`fav__${id}`)
// 			: window.localStorage.setItem(`fav__${id}`, true);
// 		return hasFav(id);
// 	};

// 	const [isFav, setIsFav] = this.useState(hasFav(id));

// 	return x`<i class=${cx('fav fa fa-fw', {'fa-heart': isFav, 'fa-heart-o': !isFav})} onclick=${()=>setIsFav(toggleFav(id))}></i>`;
// });

const FavControl = require('../fav.js').FavControl;



const RecipePage = comp(function(initRecipe){
	if(!initRecipe) return x`<section class='Recipe'><div class='notFound'>Oops, recipe not found</div></section>`;


	const [content, setContent] = this.useState(initRecipe.content);

	const getRecipe = ()=>{
		const {id, github, chef} = initRecipe;
		return {id, github, chef, ...parseRecipe(content)};
	};

	const [recipe, setRecipe] = this.useState(getRecipe);

	const [servings, setServings] = this.useState(recipe.servings);
	const [showNotes, setShowNotes] = this.useState(false);

	const [editMode, setEditMode] = this.useState(false);


	const applyEditChanges = ()=>{
		setRecipe(getRecipe());
		setEditMode(false);
		setTimeout(createIngredientControls, 5);
	};

	const createIngredientControls = ()=>{
		[...document.querySelectorAll('.ingredient')].map((el)=>{
			xo.render(el, IngredientControl({
				name  : el.getAttribute('x-name'),
				qty   : Number(el.getAttribute('x-qty')),
				unit  : el.getAttribute('x-unit'),
				staple  : el.getAttribute('x-staple'),
			}, recipe.servings));
		});
	};



	this.useEffect(()=>{
		console.log('RUNNING')
		ServingsEmitter.emit('servingsChange', servings)
	},[servings]);

	this.useEffect(()=>{
		document.title = `${recipe.title} - Tastebase`;
		window.scrollTo(0, 0);
		window.onbeforeunload = (evt)=>{
			if(initRecipe.content !== content){
				evt.preventDefault();
				evt.returnValue = 'test';

				return confirm("You have made changes to this form. Do you want to continue without saving these changes?");
			}
		};

		createIngredientControls();
	}, []);


	return x`<section class=${cx('Recipe', {showNotes})}>
		<div class='controls'>
			<a href=${recipe.github} target='_blank'>Edit this Recipe <i class='fa fa-pencil'></i></a>
			${FavControl(recipe.id)}

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

		<div class='servings'>
			<label>Number of Servings:</label>
			<span>${servings}</span>
			<button onclick=${()=>setServings(servings+1)}>+</button>
			<button onclick=${()=>setServings(servings-1)}>-</button>
		</div>

		${recipe.hasChefNotes && x`<label class='showChefNotes'>
			<input type='checkbox' checked=${showNotes} onclick=${()=>setShowNotes(!showNotes)}></input>
			Show Chef Notes
		</label>`}

		${!editMode && x`<i class='fa fa-pencil' onclick=${()=>setEditMode(true)}></i>`}
		${editMode && x`<i class='fa fa-times' onclick=${()=>applyEditChanges()}></i>`}




		<hr />

		<div class='instructions'>

			${editMode && x`<textarea value=${content} oninput=${(evt)=>setContent(evt.target.value)}></textarea>`}
			${!editMode && x(`<div>${recipe.html}</div>`)}

		</div>
		<hr />
	</section>`
});

module.exports = RecipePage;
