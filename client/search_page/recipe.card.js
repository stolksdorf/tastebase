const {x, comp, cx} = require('../../libs/xo.js');
const css = require('../../libs/pico-css.js');


const Icons = require('../assets/icons');


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

		background-color: #f0dfaf7a;

		//clip-path: polygon(3% 0, 7% 1%, 11% 0%, 16% 2%, 20% 0, 23% 2%, 28% 2%, 32% 1%, 35% 1%, 39% 3%, 41% 1%, 45% 0%, 47% 2%, 50% 2%, 53% 0, 58% 2%, 60% 2%, 63% 1%, 65% 0%, 67% 2%, 69% 2%, 73% 1%, 76% 1%, 79% 0, 82% 1%, 85% 0, 87% 1%, 89% 0, 92% 1%, 96% 0, 98% 3%, 99% 3%, 99% 6%, 100% 11%, 98% 15%, 100% 21%, 99% 28%, 100% 32%, 99% 35%, 99% 40%, 100% 43%, 99% 48%, 100% 53%, 100% 57%, 99% 60%, 100% 64%, 100% 68%, 99% 72%, 100% 75%, 100% 79%, 99% 83%, 100% 86%, 100% 90%, 99% 94%, 99% 98%, 95% 99%, 92% 99%, 89% 100%, 86% 99%, 83% 100%, 77% 99%, 72% 100%, 66% 98%, 62% 100%, 59% 99%, 54% 99%, 49% 100%, 46% 98%, 43% 100%, 40% 98%, 38% 100%, 35% 99%, 31% 100%, 28% 99%, 25% 99%, 22% 100%, 19% 99%, 16% 100%, 13% 99%, 10% 99%, 7% 100%, 4% 99%, 2% 97%, 1% 97%, 0% 94%, 1% 89%, 0% 84%, 1% 81%, 0 76%, 0 71%, 1% 66%, 0% 64%, 0% 61%, 0% 59%, 1% 54%, 0% 49%, 1% 45%, 0% 40%, 1% 37%, 0% 34%, 1% 29%, 0% 23%, 2% 20%, 1% 17%, 1% 13%, 0 10%, 1% 6%, 1% 3%);

		//border: 5px dashed #68401f;
		border: 2px solid #68401f;
		box-shadow: 8px 8px 15px 1px #68401f73;
		//margin-right: -5px;
		//margin-bottom: -5px;



		max-width: 150px;
		padding: 15px;




		h3{
			margin: 0px;
			font-size: 1.5em;
		}
		p{
			margin: 5px 0px;
			max-height : 60px;
			text-overflow: ellipsis;
			overflow-y: hidden;
		}

		img.icon{
			position: absolute;
			top: 31px;
			right: 7px;
			font-size: 1.2em;
			width: 27px;
		}

		// img{
		// 	max-height : 100%;
		// 	max-width : 120px;
		// 	position: absolute;
		// 	top : 0px;
		// 	right: 0px;
		// }

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

		${Icons[recipe.type] && x`<img class='icon' src=${Icons[recipe.type]}></img>`}
		${FavControl(recipe.id)}

		<h3>${recipe.title}</h3>


		${recipe.desc && x`<p>${recipe.desc}</p>`}

	</a>`
}

//${recipe.img && x`<img src=${recipe.img}></img>`}
//${recipe.img && x`<div class='img' style=${`background-image: url("${recipe.img}");`}></div>`}

// <small>${recipe.chef} - ${recipe.type}</small>

module.exports = RecipeCard;