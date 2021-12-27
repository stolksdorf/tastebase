

const getQueryObj = (query)=>{
	let result = { terms : [], filters : {}}
	query.split(' ').map(part=>{
		let [key, val] = part.split(':');
		if(!val) return result.terms.push(part);
		if(!key) return result.filters[val] = true;
		result.filters[key] = val;
	})
	return result;
};

const scoreRecipes = (recipes, terms=[])=>{
	if(terms.length == 0) return recipes;
	return recipes.map(recipe=>{
		recipe.score = 0;
		terms.map(term=>{
			if(recipe.title.indexOf(term) !== -1) recipe.score +=5;
			if(recipe.desc.indexOf(term) !== -1) recipe.score +=1;
			// recipe.ingredients.map(({name})=>{
			// 	if(name.indexOf(term) !== -1) recipe.score++;
			// });
		})
		return recipe;
	});
};

const filterRecipes = (recipes, filters)=>{
	if(!Object.keys(filters).length) return recipes;
	return recipes.filter(recipe=>{
		return Object.entries(filters).every(([key,val])=>{
			return recipe[key] === val;
		});
	});
};

//Maybe add a sort option if scores are equal
const sortRecipes = (recipes)=>{
	return recipes
		//.filter(({score})=>score>0)
		.sort((a,b)=>b.score - a.score);
};

module.exports = (recipes, query)=>{
	const {terms, filters} = getQueryObj(query);

	let result = recipes;
	result = filterRecipes(result, filters);
	result = scoreRecipes(result, terms);
	result = sortRecipes(result);

	return result;
}