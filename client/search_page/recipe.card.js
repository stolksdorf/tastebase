const {x, comp, cx} = require('../../libs/xo.js');
const css = require('../../libs/pico-css.js');


global.css.sneakpeek = css`
	.RecipeCard{
		display: block;
		border-radius: 10px;

		background-color: white;
		text-decoration: none;
		color: black;
		&:visited{ color: inherit; }

		box-shadow: 0 1px 2px rgba(0,0,0,0.15);
		transition: box-shadow 0.3s ease-in-out;

		border: 1px solid var(--grey);
		border-radius: 15px;
		min-width: 300px;
		padding: 15px;

		&:hover{
			box-shadow: 0 5px 15px rgba(0,0,0,0.3);
		}

		h3{
			margin-top: 0px;
		}

		img{
			width : 80px;
			float: right;
		}

		i.fa-heart{
			color: red;
		}

	}

`;

const RecipeCard = (recipe)=>{
	const hasFav = (typeof localStorage !== 'undefined') && !!localStorage.getItem(`fav__${recipe.id}`)


	return x`<a href=${`#recipe=${recipe.id}`} class='RecipeCard'>
		${recipe.img && x`<img src=${recipe.img}></img>`}
		<h3>${recipe.title}</h3>

		<div>
			<label>Chef:</label>
			<span>${recipe.chef}</span>
		</div>
		<div>
			<label>Type:</label>
			<span>${recipe.type}</span>
		</div>

		${hasFav && x`<i class='fa fa-heart'></i>`}
	</a>`
}


module.exports = RecipeCard;