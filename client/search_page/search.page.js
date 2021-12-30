
const {x, comp, cx} = require('../../libs/xo.js');
const css = require('../../libs/pico-css.js');

const RecipeCard = require('./recipe.card.js');
const FilterRecipes = require('./filter.recipes.js');


// const updateURL = (query)=>{
// 	if(history.pushState) {
// 		var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + query
// 		window.history.pushState({path:newurl},'',newurl);
// 	}
// 	//window.location.search = encodeURI(query);
// };

//const has = (str, key)=>(str||"").toLowerCase().indexOf(key) !== -1;



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


// const getQueryObj = (query)=>{
// 	let result = { terms : [], filters : {}}
// 	query.split(' ').map(part=>{
// 		let [key, val] = part.split(':');
// 		if(!val) return result.terms.push(part);
// 		if(!key) return result.filters[val] = true;
// 		result.filters[key] = val;
// 	})
// 	return result;
// };

// const scoreRecipes = (recipes, terms=[])=>{
// 	if(terms.length == 0) return recipes;
// 	let result = recipes.map(recipe=>{
// 		let score = 0;
// 		terms.map(term=>{
// 			if(recipe.title.indexOf(term) !== -1) score +=5;
// 			if(recipe.desc.indexOf(term) !== -1) score +=1;
// 			// recipe.ingredients.map(({name})=>{
// 			// 	if(name.indexOf(term) !== -1) score++;
// 			// });
// 		})
// 		return [recipe, score];
// 	});


// 	result = result.filter(([recipe, score])=>score>0);
// 	return result.sort((a,b)=>{
// 		return b[1] - a[1];
// 	}).map(([recipe, score])=>recipe);
// };


// const filterRecipes = (recipes, keys)=>{
// 	return recipes.filter(recipe=>{
// 		return Object.entries(keys).every(([key,val])=>{
// 			return recipe[key] === val;
// 		});
// 	});
// };






const SearchPage = comp(function(allRecipes, initQuery){
	const applyQuery = ()=>{
		return FilterRecipes(allRecipes, query);
	}


	const [query, setQuery] = this.useState('');
	const [inProgress, setInProgress] = this.useState(false);

	const [recipes, setRecipes] = this.useState(applyQuery);




	this.useEffect(()=>{
		setInProgress(true);
		clearTimeout(this.refs.timeout);
		this.refs.timeout = setTimeout(()=>{
			setRecipes(applyQuery());
			setInProgress(false);
			//updateURL(query ? `?search=${encodeURI(query)}`: '?');

			window.location.hash = `#search=${encodeURI(query)}`;
		}, 150);
	}, [query])

	this.useEffect(()=>{
		this.el.querySelector('input').focus();
		document.title = `Tastebase - Search`;
		window.scrollTo(0, 0);
	},[]);

	this.useEffect(()=>setQuery(initQuery),[initQuery]);

	return x`<section class='Search'>

		<div class='top'>

			<div class='searchBox'>
				<i class='fa fa-search'></i>
				<input type='text' value=${query} oninput=${(evt)=>setQuery(evt.target.value)} placeholder='Search terms here...'></input>
			</div>

			<div class='controls'>
				<label>
					<input type='checkbox'></input>
					Only yours
				</label>

				<label>
					<input type='checkbox'></input>
					Only Favs
				</label>

			</div>

			<div class='searchTips'>
				<div class=''>
					Search is broken... Kinda....
				</div>

			</div>

		</div>

		<div class='results'>
			${recipes.map(RecipeCard)}
		</div>
	</section>`
});

module.exports = SearchPage;
