const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');


const timeAgo = (ts1, ts2=Date.now())=>{
	let delta = ts2 - ts1;

	const min = 60 * 1000;
	const hr = 60 * min;
	const day = 24 * hr;
	const mth = 30 * day;


	if(delta/mth > 1.9) return `${Math.floor(delta/mth)} months`;
	if(delta/mth > 0.9) return `about 1 month`;

	if(delta/day > 1.9) return `${Math.floor(delta/day)} days`;
	if(delta/day > 0.9) return `about 1 day`;


	if(delta/hr > 1.9) return `${Math.floor(delta/hr)} hrs`;
	if(delta/hr > 0.9) return `about 1 hr`;


	if(delta/min > 1.9) return `${Math.floor(delta/min)} min`;
	//if(delta/min > 0.9) return `about 1 minute`;

	return `about 1 min`;
};



const Store = require('./recipe.store.js');



global.css.fetchbutton = css`
	a.FetchButton{
		text-align: center;
		small{
			display: block;
			font-size: 0.6em;
		}
	}
`;

const FetchButton = comp(function(){
	const [fetching, setFetching] = this.useState(false);
	const [lastUpdate, setLastUpdate] = this.useState(null);


	this.useEffect(()=>{
		return Store.on(()=>{
			setFetching(Store.isFetching());
			setLastUpdate(Store.getLastUpdated());
		})
	}, [])

	const handleClick = ()=>{
		if(fetching) return;
		Store.fetchAll();
	};

	return x`<a class='FetchButton' onclick=${handleClick}>
		${fetching && 'Fetching...'}
		${!fetching && `Update Recipes`}
		${!fetching && x`<small>Last updated ${timeAgo(lastUpdate)} ago</small>`}
	</a>`;
})





global.css.navbar = css`
	nav{
		&>a{
			font-style: italic;
			color: black;
			&:visited{ color: black; }
		}

		ul{

		}

	}
`;

const Navbar = ()=>{
	return x`<nav>
		<a href='#'>Tastebase</a>
		<ul>
			<li><a href='#conversion'>Convert</a></li>
			<li>
				<a class='add' href='https://gist.github.com/' target='_blank'>
					Add Recipe
				</a>
			</li>
			<li>
				<a href='https://github.com/stolksdorf/tastebase/recipe_instructions.md' target='_blank'>
					Recipe Help
				</a>
			</li>
			<li>${FetchButton()}</li>
		</ul>
	</nav>`;
}


module.exports = Navbar;