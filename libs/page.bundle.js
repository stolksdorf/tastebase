const isDev = process.argv.some(v=>v=='--dev');
const pack = require('./pico-pack.js');
const xo = require('./xo.js');


if (!String.prototype.replaceAll) String.prototype.replaceAll = function(str, newStr){ return this.replace(new RegExp(str, 'g'), newStr) };




const Base64Transform = (code, fp, global)=>{
	const Types = {'.ico':'image/x-icon','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.wav':'audio/wav','.mp3':'audio/mpeg','.svg':'image/svg+xml','.gif' :'image/gif'};
	const base64 = Buffer.from(require('fs').readFileSync(fp)).toString('base64');
	const type = Types[require('path').extname(fp)] || 'text/plain';
	return `module.exports='data:${type};base64,${base64}';`;
};

module.exports = (pagePath)=>{
	let result, watch;
	if(isDev) watch = (res)=>result=res;

	result = pack(pagePath, {
		callOffset : 1,
		watch,
		global : { head : {}, css : {}},
		transforms:{
			'.png' : Base64Transform,
			'.svg' : Base64Transform
		}
	});
	return (...args)=>{
		return `<!DOCTYPE html><html>
<head>
	${Object.values(result.global.head).join('\n')}
	<style>${Object.values(result.global.css).join('\n')}</style>
	<script>window.css={};window.head={};</script>
</head>
<body>${xo.render(result.export(...args))}</body>
<script>${result.bundle.replaceAll('</script>', '&lt;/script&gt;')}</script>
<script>xo.render(document.body.children[0], window.main(${args.map(x=>JSON.stringify(x)).join(', ')}));</script>
</html>`;
	}
};
