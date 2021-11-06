const {x, comp, cx, css} = require('../../crux');

global.headtags.base_fonts = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Marck+Script&display=swap" rel="stylesheet">

<link href="https://fonts.googleapis.com/css2?family=Homemade+Apple&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Crimson+Text&display=swap" rel="stylesheet">
`;

const Regal = 'https://i.imgur.com/tJlmqZD.png';
const Fibers = 'https://i.imgur.com/TtlLBDT.png';

module.exports = css`


	:root{
		--yellow : #f0dfaf;
		--purple : #bfbdd0;
		--black  : #3f3f3f;
		--white  : #f0dfaf;
		--green  : #7f9f7f;
		--grey   : #4f4f4f;
		--orange : #dfaf8f;
		--red    : #cc9393;
		--blue   : #7cb8bb;

		--text-color   : var(--black);
		--bg-color     : var(--white);
		--accent-color : var(--violet);

		--max-page-width  : 65rem;
		--page-gutter     : 30px;
		--nav-height      : 50px;
	}
	html,body{
		font-size   : 16px;
		height      : 100%;
		margin      : 0px;
		font-family: 'Crimson Text', serif;

		background-image: url(${Regal});
	}

	h1,h2,h3,h4,h5{
		font-family: 'Marck Script';
		//font-family: 'Homemade Apple', cursive;
	}

	*{
		box-sizing: border-box;
	}

	a{
		color: var(--blue);
		&:visited { color: var(--purple); }
	}

	main section{
		position: relative;
		padding-right: max(calc((100% - var(--max-page-width))/2), var(--page-gutter));
		padding-left: max(calc((100% - var(--max-page-width))/2), var(--page-gutter));

		background-image: url(${Fibers});
		filter: sepia(20%);
	}

	nav{
		align-items: center;
		display: flex;
		justify-content: space-between;
		font-weight: bold;
		z-index: 1000;

		position: relative;
		padding-right: max(calc((100% - var(--max-page-width))/2), var(--page-gutter));
		padding-left: max(calc((100% - var(--max-page-width))/2), var(--page-gutter));
		height: var(--nav-height);
		background-color: white;
		border-bottom: 1px solid black;

		&>a{
			text-decoration: none;
			vertical-align: middle;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 2em;
			max-height: var(--nav-height);
			color: black;
			&:visited{ color: black; }
			&>img{
				max-height: var(--nav-height);
			}
		}

		&>ul{
			list-style: none;
			padding: 0;
			margin: 0;
			height: var(--nav-height);
			vertical-align: middle;
			display: block;
			&>li{
				display: inline-block;
				margin: 0 0.5rem;
				position: relative;
				text-align: left;
				height: var(--nav-height);
				line-height: var(--nav-height);

				a{
					color: var(--black);
					text-decoration: none;
					display: block;
					height: 100%;
					border-bottom: 0px solid var(--blue);
					&:hover{
						color: var(--blue);
						border-bottom: 4px solid var(--blue);
					}
				}
				button{
					padding: 8px 24px;
				}
			}
		}

		@media only screen and (max-width: 600px){
			align-items: flex-start;
			ul{
				text-align: right;
				visibility: hidden;
				height: fit-content;
			}
			ul li{
				display: block;
				background-color: white;
				padding: 0px 10px;
			}
			ul:hover{
				visibility: visible;
			}
			ul::before{
				content: '☰';
				visibility: visible;
				font-size: 2em;
			}
		}
	}

	button{
		font-family: monospace;
		border: 1px solid var(--green);
		cursor: pointer;
	}

	input[type='text']{
		border        : 1px solid var(--yellow);
		outline       : none;
		padding       : 0.2em 0.3em;
		font-family   : monospace;
		border-radius : 3px;

		&:focus{
			border-color: var(--green);
		}
	}



`;