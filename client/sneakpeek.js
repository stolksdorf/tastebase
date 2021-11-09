const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');




global.css.sneakpeek = css`
	.Sneakpeek{
		display: block;
		border-radius: 10px;

		background-color: var(--grey);

	}

`;

const Sneakpeek = (recipe)=>{


	return x`<a href=${`?recipe=${recipe.id}`} class='Sneakpeek'>
		<h3>${recipe.title}</h3>

	</a>`
}


module.exports = Sneakpeek