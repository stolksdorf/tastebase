const fs=require('fs')
const path=require('path');
const chalk = Object.entries({bright:1,dim:2,red:31,green:32,yellow:33,blue:34,magenta:35,cyan:36,white:37}).reduce((acc, [name, id])=>{return {...acc, [name]:(txt)=>`\x1b[${id}m${txt}\x1b[0m`}});

const isPush = !!process.argv.find(x=>x=='--push');
const isPull = !!process.argv.find(x=>x=='--pull');

const dis = (str, color='white')=>chalk[color](str.replace(`C:\\root\\Programming\\Javascript\\`, ``));

const Libs = {
	'../libs/xo.js'        : '../../xo/xo.js',
	'../libs/pico-pack.js' : '../../pico-pack/pico-pack.js',
	'../libs/pico-css.js'  : '../../pico-css/pico-css.js',
};

Object.entries(Libs).map((files)=>{
	try{
		const local_fp = require.resolve(files[0]);
		const lib_fp = require.resolve(files[1]);

		const local = fs.readFileSync(local_fp, 'utf8');
		const lib = fs.readFileSync(lib_fp, 'utf8');

		if(local == lib) return console.log(chalk.green(`✔ ${dis(local_fp, 'green')}`));

		if(isPull){
			if(lib) fs.writeFileSync(local_fp, lib, 'utf8');
			console.log(`❗ updated local:${dis(local_fp, 'cyan')}`);
		}
		if(isPush){
			if(local) fs.writeFileSync(lib_fp, local, 'utf8');
			console.log(`❗ updated lib:${dis(lib_fp, 'cyan')}`);
		}
		if(!isPush && !isPull){
			console.log(`❌ ${dis(local_fp, 'yellow')} =/= ${dis(lib_fp, 'yellow')}`);
		}
	}catch(err){
		console.log(chalk.red(err.toString()));
	}
});

