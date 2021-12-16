const parseRecipe = require('../utils/parse.recipe.js');

module.exports = {
	basic : (t)=>{
		const res = parseRecipe(`
# Test

> This is just a recipe. Here's what the it should look like

Servings: 3

This is just some random text //And a note!

### Main

1. Crack {2 eggs}, and mix in {4tbsp of butter}
2. Heat pan to 100C

### Sauce
Some notes here

1. thorw out {4 cups of flour}
1. Do a dance, since it's so good




/* Maybe make it 120C? */
`);

		console.log(res)
	},
}