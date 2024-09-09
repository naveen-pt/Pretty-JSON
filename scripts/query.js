const nav_style=`
.btn-group {
  border-radius: 1rem;
  border: solid;
  border-width: thin;
  box-shadow: -2.3px -2.3px 3.8px rgba(255, 255, 255, 0.2), -6.3px -6.3px 10.6px rgba(255, 255, 255, 0.3), -15.1px -15.1px 25.6px rgba(255, 255, 255, 0.4), -50px -50px 85px rgba(255, 255, 255, 0.07), 2.3px 2.3px 3.8px rgba(0, 0, 0, 0.024), 6.3px 6.3px 10.6px rgba(0, 0, 0, 0.035), 15.1px 15.1px 25.6px rgba(0, 0, 0, 0.046), 50px 50px 85px rgba(0, 0, 0, 0.07);
}
.btn-group__item {
  border: none;
  min-width: 6rem;
  padding: 1rem 2rem;
  background-color: #eee;
  cursor: pointer;
  margin: 0;
  box-shadow: inset 0px 0px 0px -15px rebeccapurple;
  transition: all 300ms ease-out;
	
}
.btn-group__item:last-child {
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
	border-left:solid;
	border-width:thin;
}
.btn-group__item:first-child {
  border-top-left-radius: 1rem;
  border-bottom-left-radius: 1rem;
	border-right:solid;
	border-width:thin;
}
.btn-group__item:hover, .btn-group__item:focus {
  color: rebeccapurple;
	background:#d3d3d3
}
.btn-group__item:focus {
  outline: none;
	
}
`
const navbar=`<div class="btn-group">
<button class="btn-group__item btn-group__item">Prettify</button><button class="btn-group__item">JSONQuery</button><button class="btn-group__item">Raw</button>
</div>`

displayToggleButton(){
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.textContent = nav_style;
  document.head.appendChild(styleElement);
  const body = document.getElementsByTagName('body');
  body.appendChild(navbar);
}