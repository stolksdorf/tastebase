const {x, comp, cx} = require('../../libs/xo.js');
const css = require('../../libs/pico-css.js');


const parseRecipe = require('../../utils/parse.recipe.js');


global.css.recipe_page = css`
	section.Recipe{
		position: relative;
		padding-top: 2em;
		padding-bottom: 8em;

		&.showNotes .chef_note{
			display: block !important;
		}

		.top{
			display: flex;
			justify-content: space-between;
			.meta{
				h1{
					font-size: 3em;
					margin: 0px;
				}
				small{
					font-size: 1em;
					font-weight: 800;
				}

				blockquote{
					margin-left: 0px;
					border-left: 3px solid var(--grey);
					padding-left: 10px;
					line-height : 1.5em;
					font-size: 1.3em;
					//max-width : 70%;
				}

				.types{
						margin-top: 10px;
					.type{
						font-size: 1em;
						display: inline-block;
						user-select: none;

						border-radius: 1em;

						border: 1px solid black;
						padding : 5px 10px;
						//background-color: #f0dfaf7a;

						img{
							height : 1em;
							vertical-align: middle;
							margin-right : 0.25em;
						}

					}
				}
			}

			.controls{
				display: block;
				border: 1px solid var(--grey);
				border-radius: 5px;
				padding : 10px;
				width: 200px;



				a.editRecipe, a.recipeRef, .showChefNotes{
					width: 170px;
					display: inline-block;
					text-decoration: none;
					cursor: pointer;
					user-select: none;
					//font-size: 1.4em;
					border: 1px solid rgba(0,0,0,0.2);
					padding : 5px 10px;

					margin: 3px 0px;

					color: black;

					border-radius: 1em;
					vertical-align: baseline;

					background-color: transparent;

					transition: all 0.25s;

					i{
						vertical-align: middle;
					}

					&:hover{
						background-color: white;
						border-color: black;

					}
				}


				.servings{
					text-align: center;
					margin-top: 10px;
					.control{
						display: inline-flex;
						//height : 100px;
						align-items: center;
						user-select: none;
						font-size:0.6em;

						.amount{
							//height: 100%;
							font-size: 5em;
							vertical-align:middle;
							min-width: 0.6em;
							text-align: center;
						}

						.left, .right{
							//height: 100%;
							cursor: pointer;
							//background-color: red;
							font-size: 3em;
							padding: 0px 10px;
							vertical-align:middle;
							&:hover{
								background-color: rgba(0,0,0,0.1);
							}
						}
					}
				}


			}

			img.recipeImg{
				position: absolute;
				display: none;
				//height : 200px;
			}
		}
	}
`;

global.css.instruction_section = css`

	section.Recipe .instructions{
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

		ul.ingredientList{
			margin-left : 8px;
			padding-left: 30px;
			border-left : 2px solid #cf664063;
			li{
				font-size: 1em;
				margin: 3px;
			}
		}

		.temperature{
			small{
				margin-left: 0.3em;
				font-weight: 800;
				font-size: 0.7em;
			}
		}

		.chef_note{
			font-style: italic;
			border: 2px solid var(--green);
			padding: 10px;
			border-radius: 15px;
		}
	}
`



const IngredientControl = require('./ingredient.control.js');
const ServingsEmitter = require('../servings.emitter.js');


const Icons = require('../assets/icons');
const Types = Object.keys(Icons);


const Store = require('../recipe.store.js');

const RecipePage = comp(function(recipeId){
	const recipe = Store.getRecipe(recipeId);

	if(!recipe) return x`<section class='Recipe'><div class='notFound'>Oops, recipe not found</div></section>`;


	const [servings, setServings] = this.useState(recipe.servings);
	const [showNotes, setShowNotes] = this.useState(false);


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
		ServingsEmitter.emit('servingsChange', servings)
	},[servings]);

	this.useEffect(()=>{
		document.title = `${recipe.title} - Tastebase`;
		window.scrollTo(0, 0);
		createIngredientControls();
		return Store.on(()=>this.forceUpdate());
	}, []);

	//console.log({recipe})

	return x`<section class=${cx('Recipe', {showNotes})}>

		<div class='top'>
			${recipe.img && x`<img class='recipeImg' src=${recipe.img}></img>`}

			<div class='meta'>
				<h1>${recipe.title}</h1>
				<small>By: Chef ${recipe.chef.charAt(0).toUpperCase() + recipe.chef.slice(1)}</small>
				<div class='types'>
					${recipe.type.map(type=>{
						return x`<div class='type'>
							<img src=${Icons[type]}></img>
							${type}
						</div>`;
					})}
				</div>

				${recipe.desc && x`<blockquote>${recipe.desc}</blockquote>`}
			</div>


			<div class='controls'>

				<a
					class='editRecipe'
					href=${`https://gist.github.com/${recipe.chef}/${recipe.gist_id}/edit`}
					target='_blank'
					>
					<i class='fa fa-fw fa-pencil'></i>
					Edit this Recipe
				</a>

				${recipe.ref &&
					x`<a class='recipeRef' href=${recipe.ref} target='_blank'>
						<i class='fa fa-fw fa-external-link'></i> Recipe Reference
					</a>`
				}

				${recipe.hasChefNotes &&
					x`<a class='showChefNotes' onclick=${()=>setShowNotes(!showNotes)}>
						<i class=${cx('fa fa-fw', {
							'fa-check-square-o' : showNotes,
							'fa-square-o' : !showNotes
						})}></i>
						Show Chef Notes
					</a>`
				}

				<div class='servings'>
					<div>Num of Servings:</div>
					<div class='control'>
						<div class='left' onclick=${()=>setServings(servings-1)} ><</div>
						<div class='amount'>${servings}</div>
						<div class='right' onclick=${()=>setServings(servings+1)}>></div>
					</div>
				</div>

			</div>

		</div>


		<hr />

		<div class='instructions'>
			${x(`<div>${recipe.html}</div>`)}
		</div>
		<hr />
	</section>`
});

module.exports = RecipePage;
