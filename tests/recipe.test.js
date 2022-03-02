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
		t.is(res.html, `

<h3 id="Main">Main</h3>
<ul class='ingredientList'><li><span class='ingredient' x-qty='2' x-unit='' x-name='eggs' x-staple=''>2 eggs</span></li>
<li><span class='ingredient' x-qty='4' x-unit='tbsp' x-name='of butter' x-staple='butter'>4tbsp of butter</span></li></ul>

<ol>
	<li>
		Crack <span class='ingredient' x-qty='2' x-unit='' x-name='eggs' x-staple=''>2 eggs</span>, and mix in <span class='ingredient' x-qty='4' x-unit='tbsp' x-name='of butter' x-staple='butter'>4tbsp of butter</span>
	</li>
	<li>
		Heat pan to <span class='temperature'><span>100°C</span><small>(212.0°F)</small></span>
	</li>
</ol>


<h3 id="Sauce">Sauce</h3>
<ul class='ingredientList'><li><span class='ingredient' x-qty='4' x-unit='cups' x-name='of flour' x-staple='flour'>4 cups of flour</span></li></ul>

<p>Some notes here</p>

<ol>
	<li>
		thorw out <span class='ingredient' x-qty='4' x-unit='cups' x-name='of flour' x-staple='flour'>4 cups of flour</span>
	</li>
	<li>
		Do a dance, since it's so good
	</li>
</ol>


<p><span class='chef_note'> Maybe make it <span class='temperature'><span>120°C</span><small>(248.0°F)</small></span>? </span></p>`)
	},
	meta: (t)=>{
		const res = parseRecipe(`
# Test Recipe

A brief description

foo : 2
foo_bar : true
test : oh hello there

> and some more description

1. Buy food
`);

		t.is(res.foo, 2)
		t.is(res.foo_bar, true)
		t.is(res.test, 'oh hello there')

		t.is(res.desc, 'A brief description\n\n\n\n\n\nand some more description');
	},
}