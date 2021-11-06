const {x, comp, cx, css} = require('../../crux');
const utils = require('../../crux/utils');
global.css.style = require('./style.js');



const SearchPage = require('./search.page.js');
const RecipePage = require('./recipe.page.js');

global.css.main_page = css`
	main{
		nav{
			&>a{
				font-family: 'Marck Script';
				color: black;
				&:visited{ color: black; }
			}
		}


	}
`;


const Main = comp(function({ recipes, chefs, tags, types }){
	const [{page, val}] = this.useState(()=>{
		if(typeof document !== 'undefined'){
			const params = utils.qs.get(document.location.href);
			if(params.search) return {page: 'search', val: params.search};
			if(params.recipe) return {page: 'recipe', val: params.recipe};
			return {page: 'search', val: ''};
		}
		return {page: 'search', val: ''};
	});

	console.log({chefs, tags, types})



	return x`<main>
		<nav>
			<a href='?'>Tastebase</a>
			<ul>
				<li><a href='?search='>Search</a></li>
				<li><a href='?search='>Add Recipe</a></li>
				<li><a href='?search='>Github</a></li>
				<li><a href='?search='>About</a></li>
			</ul>
		</nav>

		${page == 'search' && SearchPage(recipes, val)}
		${page == 'recipe' && RecipePage(recipes[val])}

		<footer></footer>
	</main>`;
});


module.exports = Main;