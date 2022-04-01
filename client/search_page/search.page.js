
const {x, comp, cx} = require('../../libs/xo.js');
const css = require('../../libs/pico-css.js');

const RecipeCard = require('./recipe.card.js');



global.css.search_page = css`
	.Search{
		min-height: 100vh;

		.results{
			display: flex;
			justify-content: space-around;
			flex-wrap: wrap;
			gap : 10px;
			.RecipeCard + .RecipeCard{
				//border-color:red;
			}

			.RecipeCard{
				min-width : 300px;
				width     : 50%;
			}
		}
	}
`

const SearchControl = require('./search.control.js');


const FilterRecipes = (recipes, {terms, types})=>{
	let result = [...recipes];

	if(types.length !== 0){
		result = result.filter(recipe=>{
			return types.includes(recipe.type);
		});
	}

	if(terms.length !== 0){
		result = result.filter(recipe=>{
			return terms.every(term=>{
				if(recipe.title.toLowerCase().indexOf(term) !== -1) return true;
				if(recipe.desc.toLowerCase().indexOf(term) !== -1) return true;

				//TODO: add ingredient level search

				//if(recipe.content.toLowerCase().indexOf(term) !== -1) return true;

				return false;
			})
		});
	}

	return result;
};


function shuffle(arr){
	let res = [], array = [...arr];
	while(array.length !== 0){
		const idx = Math.floor(Math.random()*array.length);
		res.push(array.splice(idx, 1)[0]);
	}
	return res;
};



const Store = require('../recipe.store.js');



const SearchPage = comp(function(allRecipes){
	const [recipes, setRecipes] = this.useState([]);



	this.useEffect(()=>{
		document.title = `Tastebase - Search`;
		window.scrollTo(0, 0);

		setRecipes(Store.getRecipes());


	},[]);


	const handleSearch = (queryObj)=>{
		//setRecipes(FilterRecipes(allRecipes, queryObj))
	};

	// const shuffleRecipes = ()=>{
	// 	setRecipes(shuffle(recipes));
	// }

	console.log({recipes})

	return x`<section class='Search'>

		<div class='top'>
			${SearchControl(handleSearch)}
		</div>

		<div class='results'>
			${Object.fromEntries(recipes.map(recipe=>[recipe.id, RecipeCard(recipe)]))}
		</div>
	</section>`
});

module.exports = SearchPage;
