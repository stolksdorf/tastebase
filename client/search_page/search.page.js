
const {x, comp, cx} = require('../../libs/xo.js');
const css = require('../../libs/pico-css.js');

const RecipeCard = require('./recipe.card.js');



global.css.search_page = css`
	.Search{
		min-height: 100vh;

		hr{
			margin: 20px 0px;
		}

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


const Store = require('../recipe.store.js');



const SearchPage = comp(function(allRecipes){
	const [recipes, setRecipes] = this.useState([]);

	this.useEffect(()=>{
		document.title = `Tastebase - Search`;
		window.scrollTo(0, 0);

		return Store.on(()=>this.forceUpdate());
	},[]);


	const handleSearch = (queryObj)=>{
		setRecipes(Store.searchRecipes(queryObj))
	};


	return x`<section class='Search'>

		<div class='top'>
			${SearchControl(Store.getChefs(), handleSearch)}
		</div>

		<hr />

		<div class='results'>
			${Object.fromEntries(recipes.map(recipe=>[recipe.id, RecipeCard(recipe)]))}
		</div>
	</section>`
});

module.exports = SearchPage;
