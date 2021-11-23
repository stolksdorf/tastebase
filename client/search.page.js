const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');

const Sneakpeek = require('./sneakpeek.js');


const updateURL = (query)=>{
	if(history.pushState) {
		var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + query
		window.history.pushState({path:newurl},'',newurl);
	}
	//window.location.search = encodeURI(query);
};

const has = (str, key)=>(str||"").toLowerCase().indexOf(key) !== -1;



global.css.search_page = css`
	.Search{
		min-height: 100vh;


		.searchBox{
			margin: auto;
			border: 1px solid var(--grey);
			border-radius: 1em;
			padding: 0em 1em;
			background-color: white;
			width : 70%;
			font-size: 1.5em;
			input{
				border: none;
				font-family: 'IM Fell English', serif;
				font-style: italic;
				font-size: 1.3em;
			}
		}



		.results{
			display: flex;
			justify-content: space-around;
			flex-wrap: wrap;
			&>*{
				margin-bottom: 1em;
			}
		}
	}
`



const filterRecipes = (recipes, query)=>{
	if(!query.trim()) return Object.values(recipes);

	const parts = query.toLowerCase().split(' ').reduce((acc,part)=>{
		if(part.indexOf(':')){
			const [key,val] = part.split(':');
			acc[key] = val;
		}else{
			acc.terms.push(part);
		}
		return acc;
	}, {terms:[]});


	console.log(parts)
	return Object.values(recipes).filter(recipe=>{

		if(parts.type && recipe.type == parts.type) return true;
		if(parts.chef && recipe.chef == parts.chef) return true;


		if(parts.terms.length==0) return false;
		return parts.terms.every(term=>{
			if(has(recipe.title, term)) return true;
			if(has(recipe.desc, term)) return true;

			return false;
		})
	});
}


const SearchPage = comp(function(allRecipes, initQuery){
	const [query, setQuery] = this.useState(initQuery);
	const [inProgress, setInProgress] = this.useState(false);

	const [recipes, setRecipes] = this.useState(()=>filterRecipes(allRecipes, query));


	this.useEffect(()=>{
		setInProgress(true);
		clearTimeout(this.refs.timeout);
		this.refs.timeout = setTimeout(()=>{
			setRecipes(filterRecipes(allRecipes, query));
			setInProgress(false);
			updateURL(query ? `?search=${encodeURI(query)}`: '?');
		}, 150);
	}, [query])

	this.useEffect(()=>{
		this.el.querySelector('input').focus();
		document.title = `Tastebase`;

	},[])

	return x`<section class='Search'>

		<div class='top'>

			<div class='searchBox'>
				<i class='fa fa-search'></i>
				<input type='text' value=${query} oninput=${(evt)=>setQuery(evt.target.value)} placeholder='Search terms here...'></input>
			</div>

			<div class='searchTips'>
				<div class=''>
					Search is broken... Kinda....
				</div>

			</div>

		</div>

		<div class='results'>
			${Object.values(recipes).map(Sneakpeek)}
		</div>
	</section>`
});

module.exports = SearchPage;
