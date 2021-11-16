const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');

const utils = require('../libs/utils.js');

require('./style.js');


const SearchPage = require('./search.page.js');
const RecipePage = require('./recipe.page.js');

global.css.main_page = css`
	main{
		nav{
			&>a{
				font-style: italic;
				color: black;
				&:visited{ color: black; }
			}
		}


	}
`;


const Main = comp(function({ recipes, chefs, types }){
	const [{page, val}] = this.useState(()=>{
		if(typeof document !== 'undefined'){
			const params = utils.qs.get(document.location.href);
			if(params.search) return {page: 'search', val: params.search};
			if(params.recipe) return {page: 'recipe', val: params.recipe};
			return {page: 'search', val: ''};
		}
		return {page: 'search', val: ''};
	});


	return x`<main>
		<nav>
			<a href='?'>Tastebase</a>
			<ul>
				<li><a href='?search='>Search</a></li>
				<li><a href='https://github.com/stolksdorf/tastebase/tree/master/recipes'>Add Recipe</a></li>
				<li><a href='https://github.com/stolksdorf/tastebase'>Github</a></li>
			</ul>
		</nav>

		${page == 'search' && SearchPage(recipes, val)}
		${page == 'recipe' && RecipePage(recipes[val])}

		<footer></footer>
	</main>`;
});


module.exports = Main;