const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');


const Tag = require('./tag.js');

global.css.sneakpeek = css`
	.Sneakpeek{
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

	}

`;

const Sneakpeek = (recipe)=>{


	return x`<a href=${`?recipe=${recipe.id}`} class='Sneakpeek'>
		${recipe.img && x`<img src=${recipe.img}></img>`}
		<h3>${recipe.title}</h3>

		<div><label>Chef:</label> ${Tag(recipe.chef, 'chef')}</div>
		<div><label>Type:</label> ${Tag(recipe.type, 'type')}</div>


	</a>`
}


module.exports = Sneakpeek;