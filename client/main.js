const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');

require('./style.js');


const SearchPage = require('./search.page.js');
const RecipePage = require('./recipe.page.js');

const ConversionPage = require('./pages/conversion.page.js');

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
	const [page, setPage] = this.useState('');
	const [param, setParam] = this.useState('');


	const updatePage = ()=>{
		const [page, param] = window.location.hash.substr(1).split('=');
		setPage(page || 'search');
		setParam(decodeURIComponent(param || ''));
	}

	this.useEffect(()=>{
		window.onhashchange = updatePage;
		updatePage();
	}, [])

	return x`<main>
		<nav>
			<a href='#'>Tastebase</a>
			<ul>
				<li><a href='#search='>Search</a></li>
				<li><a href='#conversion'>Convert</a></li>
				<li><a href='https://github.com/stolksdorf/tastebase/tree/master/recipes'>Add Recipe</a></li>
				<li><a href='https://github.com/stolksdorf/tastebase'>Github</a></li>
			</ul>
		</nav>

		${page == 'search' && SearchPage(Object.values(recipes), param)}
		${page == 'recipe' && RecipePage(recipes[param])}
		${page == 'conversion' && ConversionPage()}

		<footer></footer>
	</main>`;
});


module.exports = Main;