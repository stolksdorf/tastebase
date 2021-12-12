const meta = require('../utils/metadata.recipe.js');

const recipe1 = `# Test Recipe

Servings : 3
img: https://images.unsplash.com/photo-1498837167922-ddd27525d352
type:Breakfast
REF: https://www.youtube.com/watch?v=X_qo3lnRS1k

>This is a cool recipe
> you should try it

> or not

1. Step 1
1. Step 2

`;


module.exports = {
	title : (t)=>{
		let res = meta(`# Cool Recipe `);
		t.is(res.title, 'Cool Recipe');
		t.is(res.content, '');

		res = meta(`# Cool Recipe \n stuff`)
		t.is(res.content, 'stuff');
	},
	tagged_data : (t)=>{
		const res = meta(recipe1);
		t.is(res.servings, 3);
		t.is(res.img, `https://images.unsplash.com/photo-1498837167922-ddd27525d352`);
		t.is(res.type, `breakfast`);
		t.is(res.ref, `https://www.youtube.com/watch?v=X_qo3lnRS1k`);
	},
	description : (t)=>{
		const res = meta(recipe1);
		t.is(res.desc, 'This is a cool recipe\n you should try it');
	},
	stripped_content : (t)=>{
		const res = meta(recipe1);
		t.is(res.content, `> or not\n\n1. Step 1\n1. Step 2`)
	}
}