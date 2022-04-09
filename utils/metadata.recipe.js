const parseVal = (str)=>{
	if(str==='true')  return true;
	if(str==='false') return false;
	if(/^(-?[\d|_]+(\.[\d|_]+)?)\s*$/.test(str)) return Number(str.replace('_',''));
	return str;
};

const Aliases = {
	'serving' : 'servings'
};


module.exports = (raw)=>{
	let metadata = {servings : 2, desc:'', title:'', type:'food'};
	let content = raw;

	//Title
	content = content.replace(/^#(.+)$/m, (_,header)=>{
		metadata.title = header.trim();
		return '';
	});

	//Tagged Data
	content = content.replace(/^([a-zA-Z_]+)\s*:\s*(.+)$/gm, (_,key, val)=>{
		key = key.toLowerCase();
		key = Aliases[key] || key;
		metadata[key] = parseVal(val);
		return '';
	});

	content = content.trim();


	//Description
	const recipeStart = content.search(/(^\d+\.)|(^#{1,5})|\/\*|\/\//m);
	if(recipeStart > 0){
		metadata.desc = content
			.substring(0,recipeStart)
			.replace(/^>\s*/gm, '')
			.trim();

		content = content.substring(recipeStart).trim();
	}

	metadata.type = metadata.type.toLowerCase().split(/\W+/);

	return {...metadata, content};
}