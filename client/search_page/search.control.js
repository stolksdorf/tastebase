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

		.searchBox{

			margin: auto;
			border: 1px solid var(--grey);
			border-radius: 1em;
			padding: 0em 1em;
			background-color: white;
			width : 70%;
			font-size: 1.5em;
			input{
				border: none;
				font-family: 'IM Fell English', serif;
				font-style: italic;
				font-size: 1.3em;
				width : 100%;
			}
		}

		.typeSelector{
			width : 300px;
			.type{
				cursor: pointer;
				font-size: 1.1em;
				display: inline-block;
				opacity : 0.4;

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
`;

const Icons = require('../assets/icons');
const Types = Object.keys(Icons);

const SearchControl = comp(function(onUpdate){
	let [filterTypes, setFilterTypes] = useLocalState(this, 'search-types', []);
	let [search, setSearch] = useLocalState(this, 'search-query', '');


	const update = ()=>{
		onUpdate({
			terms : search.toLowerCase().split(' ').filter(x=>!!x),
			types : [...filterTypes],
			//onlyFav : false,
			//chef : 'All'
		})
	}

	const handleText = (newSearch)=>{
		clearTimeout(this.refs.searchTimer);
		search = newSearch;
		setSearch(newSearch);
		this.refs.searchTimer = setTimeout(update, 200);
	};


	const toggle = (type)=>{
		if(filterTypes.includes(type)){
			filterTypes = filterTypes.filter(x=>x!==type);
		}else{
			filterTypes = filterTypes.concat(type);
		}
		setFilterTypes(filterTypes);
		update();
	};

	this.useEffect(()=>update(), []);


	return x`<div class='SearchControl'>

		<div class='searchBox'>
			<input
				placeholder='Search...'
				type='text'
				oninput=${(evt)=>handleText(evt.target.value)}
				value=${search}></input>
		</div>


		<div class='typeSelector'>
			${Types.map(type=>{
				return x`<div
					onclick=${()=>toggle(type)}
					class=${cx('type', {selected : filterTypes.includes(type)})}>

					<img src=${Icons[type]}></img>
					${type}
				</div>`;
			})}
		</div>

	</div>`;
});


module.exports = SearchControl;