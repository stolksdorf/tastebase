const {x, comp, cx} = require('../libs/xo.js');
const css = require('../libs/pico-css.js');


global.css.tag = css`
	.Tag{
		//background-color: var(--blue);
		color: black;
		&:visited{ color: black; }
		font-size: 1em;
		//border-radius: 0.6em;
		//padding: 0.2em 0.2em;
		margin: 7px 3px;
	}
`;



const Tag = (value, category)=>{
	return x`<a class='Tag' href=${`?search=${category}:${value}`}>
		${value}
	</a>`;
};

module.exports = Tag;