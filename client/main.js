const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');

require('./style.js');


const Navbar = require('./nav.js');

const SearchPage = require('./search_page/search.page.js');
const RecipePage = require('./recipe_page/recipe.page.js');
const ConversionPage = require('./conversion_page/conversion.page.js');

global.css.main_page = css`
	main{

	}
`;

const Store = require('./recipe.store.js');

const Main = comp(function({ chefs }){
	const [page, setPage] = this.useState('');
	const [param, setParam] = this.useState('');

	const updatePage = ()=>{
		const [page, param] = window.location.hash.substr(1).split('=');
		setPage(page || 'search');
		setParam(decodeURIComponent(param || ''));
	}

	this.useEffect(()=>{
		Store.init(chefs);
		updatePage();
		window.onhashchange = updatePage;
	}, []);

	return x`<main>
		${Navbar()}

		${page == 'search' && SearchPage()}
		${page == 'recipe' && RecipePage(param)}
		${page == 'conversion' && ConversionPage()}

		<footer></footer>
	</main>`;
});


module.exports = Main;