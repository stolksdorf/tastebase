const request = async (method, url, data={}, options={})=>{
	const {headers, ...opts}=options;
	if(method=='GET') url = qs.add(url, data);
	return fetch(url, {
		method, headers: {'Content-Type':'application/json', ...headers},
		body : method!='GET' ? JSON.stringify(data) : undefined,
		...opts,
	}).then(res=>{
		return res.text().then(data=>{
			try{res.data=JSON.parse(data);}catch(err){res.data=data;}
			if(!res.ok) throw res;
			return res;
		})
	});
};
request.get  = request.bind(null, 'GET');
request.post = request.bind(null, 'POST');
request.del  = request.bind(null, 'DELETE');
request.put  = request.bind(null, 'PUT');


const request = require('superagent');




const fetchGists = async (username, descFilter='')=>{

	const raw = await request.get(`https://api.github.com/users/stolksdorf/gists?per_page=100&page=1`);

	console.log(raw.body)



}

fetchGists('stolksdorf');