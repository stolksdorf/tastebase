const compareTimestamps = (ts1, ts2=Date.now())=>{
	let delta = ts2 - ts1;

	console.log(delta)
	let units = {};
	units.seconds = 1000;
	units.minutes = 60 * units.seconds;
	units.hours = 60 * units.minutes;
	units.days = 24 * units.hours;
	units.weeks = 7 * units.days;
	units.months = 4 * units.weeks;

	console.log(units)

	return Object.entries(units).reverse().reduce((acc, [unit, val])=>{

		if(delta / val < 1){ return acc; }

		acc[unit] = Math.floor(delta/val);
		delta -= acc[unit] * val;
		return acc;
	}, {});
};


const timeAgo = (ts1, ts2=Date.now())=>{
	let delta = ts2 - ts1;
	let [unit, val] = [
		['month', 2419200000],['week',  604800000],['day',86400000],['hour',  3600000],['minute',60000],['second',1000]
	].reduce((acc, [unit, amt])=>{
		if(acc) return acc;
		if(delta/amt>1) return [unit, Math.floor(delta/amt)]
	},null) || ['second', 0];

	let pural = val > 1 ? 's' : '';

	if(unit=='second' || unit=='minute'){
		if(val == 0) val = 'about a';
		if(val < 4) val = 'a few'
	}
	return val + ' ' + unit + pural;
}



//timeAgo

//1648862809263


const res = timeAgo(1648862809263);

console.log(res)

console.log('foo', timeAgo(Date.now()))