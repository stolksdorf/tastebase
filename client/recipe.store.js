const {fetchRecipeGist, fetchAllRecipes} = require('./fetch.recipes.js');

const storageSet = (key, val)=>{
	if(typeof window === 'undefined') return;
	window.localStorage.setItem(key, JSON.stringify(val));
};

const storageGet = (key, fallback=null)=>{
	if(typeof window === 'undefined') return fallback;
	try{
		return JSON.parse(window.localStorage.getItem(key));
	}catch(err){
		return fallback;
	}
};

const isTooOld = (ts)=>{
	const min = 60 * 1000;
	const hr = 60 * min;
	const day = 24 * hr;

	return (Date.now() - ts) > 5 * day;
};


const Emitter = {
	cache : [],
	on : (fn)=>{
		Emitter.cache.push(fn);
		return ()=>Emitter.cache = Emitter.cache.filter(func=>func!==fn);
	},
	emit : ()=>Emitter.cache.map(fn=>fn()),
};



let Recipes = null;
let LastUpdated = null;
let Chefs = [];
let fetching = false;

const init = (chefs)=>{
	Chefs = chefs;
	Recipes = storageGet('recipes');
	LastUpdated = storageGet('lastUpdated');

	const noRecipes = !Recipes || !Object.keys(Recipes).length;
	const outDated = !LastUpdated || isTooOld(LastUpdated);

	if(noRecipes || outDated){
		return fetchAll();
	}
	Emitter.emit();

};

const save = ()=>{
	storageSet('recipes', Recipes);
	storageSet('lastUpdated', LastUpdated);
	storageSet('chefs', Chefs);
};


const fetchRecipe = async (id)=>{
	fetching = true;
	Emitter.emit();

	const recipes = await fetchRecipeGist(Recipes[id].gist_id);
	recipes.map(recipe=>{
		Recipes[recipe.id] = recipe;
	});
	fetching = false;
	Emitter.emit();
	save();
};

const fetchAll = async ()=>{
	fetching = true;
	Emitter.emit();

	const recipes = await fetchAllRecipes(Chefs);
	Recipes = {};
	recipes.map(recipe=>{Recipes[recipe.id] = recipe;});

	LastUpdated = Date.now();
	fetching = false;

	Emitter.emit();
	save();
};


const getRecipe = (id)=>{
	if(!Recipes[id]) return false;
	if(isTooOld(Recipes[id].lastUpdate)) fetchRecipe(id);

	return Recipes[id];
};

const searchRecipes = ({chef, types, query})=>{
	let recipes = Object.values(Recipes);

	if(chef) recipes = recipes.filter(recipe=>recipe.chef.toLowerCase() === chef);
	if(types && types.length) recipes = recipes.filter(recipe=>types.includes(recipe.type));
	if(query){
		recipes = recipes.filter(recipe=>{
			return query.toLowerCase().split(' ').every(term=>{
				if(recipe.title.toLowerCase().includes(term)) return true;
				if(recipe.desc.toLowerCase().includes(term)) return true;
				return recipe.ingredients.some(({raw})=>raw.includes(term));
			});
		});
	}
	return recipes;
};



module.exports = {
	init,
	fetchAll,

	getAllRecipes : ()=>Object.values(Recipes),


	searchRecipes,
	getChefs : ()=>Chefs,
	getLastUpdated : ()=>LastUpdated,

	getRecipe,


	on : Emitter.on,
	isFetching : ()=>fetching,
};