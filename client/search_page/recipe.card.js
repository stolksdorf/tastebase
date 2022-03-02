const {x, comp, cx} = require('../../libs/xo.js');
const css = require('../../libs/pico-css.js');


global.css.sneakpeek = css`
	.RecipeCard{
		display: block;
		position: relative;
		text-decoration: none;
		color: black;
		&:visited{
			color: inherit;
		}

		&:hover{
			background-color: #f0dfaf;
		}

		border: 5px dashed #68401f;
		margin-right: -5px;
		margin-bottom: -5px;

		min-width: 300px;
		padding: 15px;




		h3{
			margin: 0px;
			font-size: 2em;
		}
		p{
			margin: 5px 0px;
		}

		img{
			max-height : 100%;
			max-width : 120px;
			position: absolute;
			top : 0px;
			right: 0px;
		}

		.FavControl{
			position: absolute;
			top : 10px;
			right : 10px;
			font-size: 1.2em;
		}

	}
`;


const {FavControl} = require('../fav.js');

const RecipeCard = (recipe)=>{
	const hasFav = (typeof localStorage !== 'undefined') && !!localStorage.getItem(`fav__${recipe.id}`)


	return x`<a href=${`#recipe=${recipe.id}`} class='RecipeCard'>
		${recipe.img && x`<img src=${recipe.img}></img>`}
		<h3>${recipe.title}</h3>
		<small>${recipe.chef} - ${recipe.type}</small>

		${recipe.desc && x`<p>${recipe.desc}</p>`}
		${FavControl(recipe.id)}
	</a>`
}


module.exports = RecipeCard;