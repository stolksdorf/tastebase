const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');


global.css.navbar = css`
	nav{
		&>a{
			font-style: italic;
			color: black;
			&:visited{ color: black; }
		}
	}
`;


const Store = require('./recipe.store.js');


const Navbar = comp(function(){
	const [fetching, setFetching] = this.useState(false);
	const [lastUpdate, setLastUpdate] = this.useState(null);


	this.useEffect(()=>{
		return Store.on(()=>{
			setFetching(Store.isFetching());
			setLastUpdate(Store.getLastUpdated());
		})
	}, [])


	const handleUpdate = ()=>{
		alert('woo');
	};


	return x`<nav>
		<a href='#'>Tastebase</a>
		<ul>
			<li><a href='#conversion'>Convert</a></li>
			<li>
				<a href='https://gist.github.com/'>Add Recipe</a>
				<a href='https://github.com/stolksdorf/tastebase/recipe_instructions.md'>❓</a>
			</li>
			${!fetching && x`<li onclick=${handleUpdate}>
				Update Recipes
				<small>Last updated ${lastUpdate} ago</small>
			</li>`}
			${fetching && x`<li>
				Fetching...
			</li>`}
		</ul>
	</nav>`;
});


module.exports = Navbar;