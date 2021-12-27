const emitter = require('./emitter')();
const KEY = 'tb-account';

const login = ()=>{
	let res = prompt('Enter User name');
	window.localStorage.setItem(KEY, res);
	emitter.emit('update', res);
};

const logout = ()=>{
	window.localStorage.setItem(KEY, '');
	emitter.emit('update', '');
};

const get = ()=>{
	try{
		return window.localStorage.getItem(KEY);
	}catch(err){
		return;
	}
};

const useAccount = (scope)=>{
	const [name, setName] = scope.useState(get);
	scope.useEffect(()=>emitter.on('update', setName), []);
	return name;
}

module.exports = {
	login,
	logout,
	get,
	useAccount,

	emitter
};