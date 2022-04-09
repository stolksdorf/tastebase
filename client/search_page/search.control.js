const {x, comp, cx} = require('../../libs/xo.js');
const css = require('../../libs/pico-css.js');



const useLocalState = (scope, key, init)=>{
	const [val, setVal] = scope.useState(()=>{
		try{ return JSON.parse(window.localStorage.getItem(key)) ?? init;
		}catch(err){ return init; }
	});
	return [val, (newVal)=>{
		try{ window.localStorage.setItem(key, JSON.stringify(newVal)); } catch (err){}
		setVal(newVal);
	}];
};


global.css.search_control = css`
	.SearchControl{

		display: flex;
		justify-content: space-between;
		column-gap: 30px;

		.left{
			flex-grow: 1;

			.searchBox{

				border: 1px solid var(--grey);
				border-radius: 1em;
				padding: 0em 1em;
				background-color: white;
				width : 100%;
				font-size: 1.5em;
				input{
					border: none;
					font-family: 'IM Fell English', serif;
					font-style: italic;
					font-size: 1.3em;
					width : 100%;
				}
			}

			select{
				font-family: 'IM Fell English', serif;
				font-size: 1.3em;
				cursor: pointer;
				padding: 8px 15px;
				border-radius: 1em;
				margin-top : 15px;
			}
		}

		.right{
			min-width : 415px;
			flex-grow: 0;

			.typeSelector{

				display:grid;

				grid-auto-flow: row dense;
				grid-template-columns: max-content max-content max-content;
				grid-column-gap: 10px;
				grid-row-gap: 10px;

				.type{
					cursor: pointer;
					font-size: 1.4em;
					display: inline-block;
					opacity : 0.4;
					user-select: none;

					border-radius: 1em;

					border: 1px solid black;
					padding : 5px 10px;

					img{
						height : 1em;
						vertical-align: middle;
						margin-right : 0.25em;
					}

					&.selected{
						background-color: #f0dfaf7a;
						opacity : 1;
					}
				}
			}
		}


	}
`;

const Icons = require('../assets/icons');
const Types = Object.keys(Icons);

const SearchControl = comp(function(chefs, onUpdate){
	let [filterTypes, setFilterTypes] = useLocalState(this, 'search-types', []);
	let [search, setSearch] = useLocalState(this, 'search-query', '');
	let [filterChef, setFilterChef] = useLocalState(this, 'search-chef', '');

	const update = ()=>{
		onUpdate({
			query : search,
			types : [...filterTypes],
			chef : filterChef
		});
	}

	const handleText = (newSearch)=>{
		clearTimeout(this.refs.searchTimer);
		search = newSearch;
		setSearch(newSearch);
		this.refs.searchTimer = setTimeout(update, 200);
	};

	const toggleType = (type)=>{
		if(filterTypes.includes(type)){
			filterTypes = filterTypes.filter(x=>x!==type);
		}else{
			filterTypes = filterTypes.concat(type);
		}
		setFilterTypes(filterTypes);
		update();
	};

	const handleChef = (evt)=>{
		filterChef = evt.target.value;
		setFilterChef(evt.target.value);
		update();
	}

	this.useEffect(()=>update(), []);

	return x`<div class='SearchControl'>
		<div class='left'>

			<div class='searchBox'>
				<input
					placeholder='Search titles or ingredients..'
					type='text'
					oninput=${(evt)=>handleText(evt.target.value)}
					value=${search}></input>
			</div>

			<select onchange=${handleChef}>
				${[
					x`<option selected=${filterChef==''} value=''>All Chefs</option>`,
					...chefs.map(chef=>{

						return x`<option selected=${filterChef==chef} value=${chef}>${chef}</option>`
					})
				]}
			</select>
		</div>

		<div class='right'>
			<div class='typeSelector'>
				${Types.map(type=>{
					return x`<div
						onclick=${()=>toggleType(type)}
						class=${cx('type', {selected : filterTypes.includes(type)})}>

						<img src=${Icons[type]}></img>
						${type}
					</div>`;
				})}
			</div>
		</div>

	</div>`;
});


module.exports = SearchControl;