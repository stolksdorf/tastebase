const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');

const hasLocalStorage = typeof localStorage !== 'undefined';

const hasFav = (id)=>{
	if(!hasLocalStorage) return false;
	return window.localStorage.getItem(`fav__${id}`) == 'true';
};

const toggleFav = (id)=>{
	if(!hasLocalStorage) return;
	hasFav(id)
		? window.localStorage.removeItem(`fav__${id}`)
		: window.localStorage.setItem(`fav__${id}`, 'true')
	return hasFav(id);
};

global.css.fav_control = css`
	.FavControl{
		cursor: pointer;
		&.fa-heart{
			color: red;
		}
	}
`;

const FavControl = comp(function(id){
	const [fav, setFav] = this.useState(()=>hasFav(id));

	const handleClick = (evt)=>{
		setFav(toggleFav(id));
		return false;
	};

	return x`<i class=${cx(`FavControl fa`,{
		'fa-heart'   : fav,
		'fa-heart-o' : !fav
	})} onclick=${handleClick}></i>`;
});


module.exports = {
	hasFav,
	toggleFav,
	FavControl
};