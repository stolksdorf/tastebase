
module.exports = (raw)=>{
	let result = {servings : 2, desc:'',type:'food'};
	let content = raw;

	//Title
	content = content.replace(/^#(.+)$/m, (_,header)=>{
		result.title = header.trim();
		return '';
	});

	//Tagged Data
	content = content.replace(/^servings\s*:\s*(\d+)/im, (_,servings)=>{
		result.servings = Number(servings);
		return '';
	});
	content = content.replace(/^type\s*:\s*(.+)/im, (_,type)=>{
		result.type = type.trim().toLowerCase();
		return '';
	});
	content = content.replace(/^img\s*:\s*(.+)/im, (_,img)=>{
		result.img = img.trim();
		return '';
	});
	content = content.replace(/^ref\s*:\s*(.+)/im, (_,ref)=>{
		result.ref = ref.trim();
		return '';
	});

	//Description
	content = content.replace(/(^>(.+?)\n)+/m, (desc)=>{
		result.desc = desc.replace(/>/g, '').trim();
		return '';
	});

	content = content.trim();
	return {...result, content};
}