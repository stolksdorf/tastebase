const {x, comp, cx, css} = require('../../crux');


const utils = require('../../crux/utils');

const Sneakpeek = require('./sneakpeek.js');


const updateURL = (query)=>{
	if(history.pushState) {
		var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + query
		window.history.pushState({path:newurl},'',newurl);
	}
	//window.location.search = encodeURI(query);
};

const has = (str, key)=>(str||"").toLowerCase().indexOf(key) !== -1;




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



	return x`<section class='Search'>

		<input type='text' value=${query} oninput=${(evt)=>setQuery(evt.target.value)}></input>

		${inProgress}

		${Object.values(recipes).map(Sneakpeek)}
	</section>`
});

module.exports = SearchPage;
