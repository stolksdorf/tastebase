const isDev = process.argv.some(v=>v=='--dev');
const pack = require('./pico-pack');

if(!String.prototype.replaceAll){
	String.prototype.replaceAll = function(str, newStr){
		return this.replace(new RegExp(str, 'g'), newStr);
	};
}

//TODO: Try ssr

module.exports = (pagePath)=>{
	let result, watch;
	if(isDev) watch = (res)=>result=res;

	result = pack(pagePath, {
		callOffset : 1,
		watch,
		global : { head : {}, css : {}}
	});

	return (...args)=>{
		return `<!DOCTYPE html><html>
<head>
	<link href="https://netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" />
	${Object.values(result.global.head).join('\n')}
	<style>${Object.values(result.global.css).join('\n')}</style>
	<script>window.css={};window.head={};</script>
</head>
<body><main></main></body>
<script>${result.bundle.replaceAll('</script>', '&lt;/script&gt;')}</script>
<script>xo.render(document.body.children[0], window.main(${args.map(x=>JSON.stringify(x)).join(', ')}));</script>
</html>`;
	}
};