const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');

require('./style.js');


const SearchPage = require('./search_page/search.page.js');
const RecipePage = require('./recipe_page/recipe.page.js');
const ConversionPage = require('./conversion_page/conversion.page.js');

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

const Account = require('./account.js');

const accountItem = comp(function(){
	const name = Account.useAccount(this);

	const logout = ()=>{
		if(confirm('Sure, you want to logout?')) Account.logout();
	};

	if(!name) return x`<a onclick=${Account.login}>Login</a>`;
	return x`<a href=${`#search=chef:${name}`}>
		${name}
		<i class='fa fa-times' onclick=${logout}></i>
	</a>`; //TODO: this should link to a search page with only your chef
});

const addRecipeItem = comp(function(){
	const name = Account.useAccount(this);
	if(!name) return x`<a href='https://github.com/stolksdorf/tastebase/tree/master/recipes' target='_blank'>Add Recipe</a>`;
	return x`<a href=${`https://github.com/stolksdorf/tastebase/new/master/recipes/${name}`} target='_blank'>Add Recipe</a>`;
})


const Main = comp(function({ recipes, chefs, types }){
	const [page, setPage] = this.useState('');
	const [param, setParam] = this.useState('');

	const updatePage = ()=>{
		const [page, param] = window.location.hash.substr(1).split('=');
		setPage(page || 'search');
			setParam(decodeURIComponent(param || ''));
	}

	this.useEffect(()=>{
		console.log({recipes})
		window.onhashchange = updatePage;
		updatePage();
	}, []);

	return x`<main>
		<nav>
			<a href='#'>Tastebase</a>
			<ul>
				<li><a href='#search'>Search</a></li>
				<li><a href='#conversion'>Convert</a></li>
				<li>${addRecipeItem()}</li>
				<li><a href='https://github.com/stolksdorf/tastebase'>Github</a></li>
				<li>${accountItem()}</li>
			</ul>
		</nav>

		${page == 'search' && SearchPage(Object.values(recipes), param, types, chefs)}
		${page == 'recipe' && RecipePage(recipes[param])}
		${page == 'conversion' && ConversionPage()}

		<footer></footer>
	</main>`;
});


module.exports = Main;