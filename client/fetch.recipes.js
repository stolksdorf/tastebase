const parseRecipe = require('../utils/parse.recipe.js');

const sequence = async (obj, fn)=>{
	let res = Array.isArray(obj)?[]:{};
	return Object.keys(obj).reduce((p,k)=>p.then(()=>fn(obj[k], k)).then(r=>res[k]=r), Promise.resolve()).then(()=>res);
};

const request = async (url)=>{
	return fetch(url, {
		method : 'GET',
		headers: {'Content-Type':'application/json'},
	}).then(res=>{
		return res.text().then(data=>{
			try{
				return JSON.parse(data);
			}catch(err){}
			throw res;
		});
	});
};

const snakeCase = (text)=>text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s/g, '_');


const fetchRecipeGist = async (gist_id)=>{
	const gist = await request(`https://api.github.com/gists/${gist_id}`);
	return Object.values(gist.files).map(file=>{
		const recipe = parseRecipe(file.content);

		const id = snakeCase(gist.owner.login + ' ' + (recipe.title || file.filename.split('.')[0]));
		return {
			chef : gist.owner.login,
			gist_id,
			id,
			updated : Date.now(),
			...recipe
		}
	})
};


const fetchUserRecipeGistIds = async (username)=>{
	if(typeof window === 'undefined') return [];

	const filter = '[recipe]';
	const gists = await request(`https://api.github.com/users/${username}/gists?per_page=100&page=1`);
	return gists.reduce((acc, gist)=>{
		if(!gist.description.toLowerCase().startsWith(filter)) return acc;
		return acc.concat(gist.id);
	}, []);
};


const fetchAllRecipes = async (users)=>{
	const ids = (await sequence(users, async (user)=>fetchUserRecipeGistIds(user))).flat();
	return (await sequence(ids, async (id)=>fetchRecipeGist(id))).flat();
};

module.exports = {
	fetchRecipeGist,
	//fetchUserRecipeGistIds,
	fetchAllRecipes
}