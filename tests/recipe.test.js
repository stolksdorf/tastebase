const parseRecipe = require('../scripts/parse.recipe.js');

module.exports = {
	basic : (t)=>{
		const res = parseRecipe(`
# Test

This is just a recipe. Here's what the it should look like ![](https://images.unsplash.com/photo-1498837167922-ddd27525d352)

Servings: 3


1. Crack {2 eggs}, and mix in {4tbsp of butter}
1. thorw out {4cups of flour}
2. Heat pan to 100C

/* Maybe make it 120C? */
`);

		console.log(res)
	},

	temperature : {

	},

	//header
	//img
	//desc


	//detect has comments


}