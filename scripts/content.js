const cssStyles = `
  .json_block {
    padding-left: 20px; 
    border-left-width: thin; 
    border-left-style: solid; 
    border-color: 'black';
    margin-left: 0.25rem;
    margin-top: 3px;
    margin-bottom: 3px;
  }
  li {
    list-style-type: none; 
    padding: 0; 
    margin: 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  .expanded::before {
    content: "-";
    cursor: pointer;
    margin-right: 5px;
    opacity: 54%;
  }
  .collapsed::before {
    content: "+";
    cursor: pointer;
    margin-right: 5px;
    opacity: 54%;

  }
  .json_value {
    margin-left: 15px;
  }
  .collapser {
    position: relative;
    left: -0.6rem;
    top: 0.95rem;
  }
`;
const nav_style = `
:root {
  --border-size: 0.125rem;
  --duration: 250ms;
  --ease: cubic-bezier(0.215, 0.61, 0.355, 1);
  --font-family: monospace;
  --color-primary: white;
  --color-secondary: black;
  --color-tertiary: dodgerblue;
  --shadow: rgba(0, 0, 0, 0.1);
  --space: 1rem;
}
.multi-button {
  position: fixed;
  top: 5px;
  right: 0;
  z-index: 1000;
  width: 17rem;
  display: flex;
}
.multi-button button.selected {
  color: white;
  background-color: var(--color-secondary);
  outline: var(--border-size) dashed var(--color-primary);
  outline-offset: calc(var(--border-size) * -3);
}
.multi-button button {
  flex: 1 0 0; /* Equal width for all buttons */
  cursor: pointer;
  position: relative;
  padding: 0.5rem 1rem; /* Adjusted padding */
  border: var(--border-size) solid black;
  color: var(--color-secondary);
  background-color: var(--color-primary);
  font-size: 0.8rem; /* Adjusted font size */
  font-family: var(--font-family);
  text-transform: lowercase;
  text-shadow: var(--shadow) 2px 2px;
  transition: flex-grow var(--duration) var(--ease);
}

.multi-button button + button {
  border-left: var(--border-size) solid black;
  margin-left: calc(var(--border-size) * -1);
}

.multi-button button:hover,
.multi-button button:focus {
  flex-grow: 2;
  color: white;
  outline: none;
  text-shadow: none;
  background-color: var(--color-secondary);
}
.multi-button button:focus {
  outline: var(--border-size) dashed var(--color-primary);
  outline-offset: calc(var(--border-size) * -3);
}

.multi-button:hover button:focus:not(:hover) {
  flex-grow: 1;
  color: var(--color-secondary);
  background-color: var(--color-primary);
  outline-color: var(--color-tertiary);
}

.multi-button button:active {
  transform: translateY(var(--border-size));
}
`;
const querypage_style = `

.showquery {
  display: block;
}
.hidequery {
  display: none;
}
.side-container {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  width: 0;
  background: white;
  transition: width 0.3s ease-in-out;
  border: 1px solid black;
  box-sizing: border-box;
}
.side-container.open-side {
  width: 50rem;
}
.search-container {
  background-color: #ffffff;
  border: 1px solid #000000;
  display: flex;
  align-items: center;
  width: 75%;
  margin-top: 4rem;
  }
.search-input {
  border: none;
  padding: 10px;
  outline: none;
  flex: 1;
  font-size: 16px;
  color: #000000;
  background-color: #ffffff;
  }
.search-button {
  background-color: #000000;
  border: none;
  color: #ffffff;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 16px;
  }
.search-button:hover {
  background-color: #333333;
  }
.top-container {
  width :100%;
  display: flex;
  align-content: center;
  justify-content: center;
  }
`;

function prettifyJSON() {
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.textContent = cssStyles;
  document.head.appendChild(styleElement);
  const preTags = Array.from(document.getElementsByTagName('pre'));
  displayToggleButton();
  for (let preTag of preTags) {
    try {
      const json = JSON.parse(preTag.textContent);
      const formattedDiv = document.createElement('pre');
      formattedDiv.className = 'formatted-json';
      preTag.parentNode?.insertBefore(formattedDiv, preTag.nextSibling);
      preTag.style.display = 'none';
      formattedDiv.innerHTML = styledHtml(json);
      formattedDiv.style.background = '';
      document.querySelectorAll('.end_value').forEach(e => {
        e.parentElement.firstElementChild.classList.remove('expanded')
      });
      expandcollapse();
    } catch (e) {
      preTag.classList.add('not-formatted');
      // console.warn('Content is not valid JSON');
    }
  }
}

const preTags = document.getElementsByTagName('pre');
console.log("Pre tags: ", preTags.length);
if (preTags.length === 1) {
  prettifyJSON();
  json_query();
}

function expandcollapse() {
  const array = document.querySelectorAll('.collapser');
  array.forEach(element => {
    element.addEventListener('click', (e) => {
      const target = e.currentTarget;
      var sibling = target.nextSibling;
      while (sibling) {
        if (sibling.classList && sibling.classList.contains("json_block")) {
          break
        } else if (sibling.hasChildNodes() && sibling.querySelector('.json_block')) {
          sibling = sibling.querySelector('.json_block')
          break
        }
        sibling = sibling.nextSibling
      }
      if (sibling) {
        if (sibling.style.display === 'none') {
          sibling.style.display = 'block';
          target.classList.add('expanded');
          target.classList.remove('collapsed');
        } else {
          sibling.style.display = 'none';
          target.classList.add('collapsed');
          target.classList.remove('expanded');
        }
      }
    });
  });
}
function styledHtml(value, t = 0) {
  if (typeof value === 'object' && value !== null) {
    let child = '';
    const hasNested = Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0;

    if (Array.isArray(value)) {
      for (const item of value) {
        child += styledHtml(item, 1) + ',<br>';
      }
      child = child.slice(0, -5);
      return `[<div class="json_block">${child}</div>]`;
    } else {
      for (const [key, val] of Object.entries(value)) {
        child += `<li><div class="collapser${hasNested ? ' expanded' : ''}"></div><span>"${key}":</span> ${styledHtml(val, 0)},</li>`;
      }
      child = child.slice(0, -6);
      return `${t ? '<div class="collapser expanded"></div>' : ''}<span>{<ul class="json_block">${child}</ul>}</span>`;
    }
  } else {
    switch (typeof value) {
      case 'string':
        return `<span class="end_value" style="color:green">"${value}"</span>`;
      case 'number':
        return `<span class="end_value" style="color:blue">${value}</span>`;
      case 'boolean':
        return `<span class="end_value" style="color:red">${value}</span>`;
      default:
        return `<span class="end_value" style="color:violet">${String(value)}</span>`;
    }
  }
}


function displayToggleButton() {
  const navbar = `
  <div class="multi-button">
    <button id="prettify-btn">Prettify</button>
    <button id="jsonquery-btn">Query</button>
    <button id="raw-btn">Raw</button>
  </div>`;

  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.textContent = nav_style;
  document.head.appendChild(styleElement);

  const navbarContainer = document.createElement('div');
  navbarContainer.innerHTML = navbar;
  document.body.appendChild(navbarContainer);

  const rawButton = document.getElementById('raw-btn');
  const prettify_btn = document.getElementById('prettify-btn');
  const jsonquery_btn = document.getElementById('jsonquery-btn');

  rawButton.addEventListener('click', function () {
    rawButton.classList.add('selected');
    prettify_btn.classList.remove('selected');
    jsonquery_btn.classList.remove('selected');
    const preTags = document.querySelectorAll('pre');
    hide_json_query()
    preTags.forEach(e => {
      e.style.display = 'block';
    })
    const elements = document.querySelectorAll('pre.formatted-json');
    elements.forEach(element => {
      element.style.display = 'none';
    });
  });

  prettify_btn.addEventListener('click', function () {
    prettify_btn.classList.add('selected');
    rawButton.classList.remove('selected');
    jsonquery_btn.classList.remove('selected');
    const preTags = document.querySelectorAll('pre');
    hide_json_query();
    preTags.forEach(e => {
      e.style.display = 'none';
    });

    const dont_touch = document.querySelectorAll('pre.not-formatted');
    dont_touch.forEach(element => {
      element.style.display = 'block';
    });

    const elements = document.querySelectorAll('pre.formatted-json');
    elements.forEach(element => {
      element.style.display = 'block';
    });
  });

  jsonquery_btn.addEventListener('click', function () {
    jsonquery_btn.classList.add('selected');
    rawButton.classList.remove('selected');
    prettify_btn.classList.remove('selected');
    show_json_query();
  });
}
function json_query() {
  const navbar = `
  <div class="side-container">
   <div class="top-container">
   <div class="search-container">
        <input type="text" class="search-input" placeholder="Search...">
        <button class="search-button">Search</button>
   </div>
   </div> 
  </div>`;
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.textContent = querypage_style;
  document.head.appendChild(styleElement);

  const querypage = document.createElement('div');
  querypage.innerHTML = navbar;
  document.body.appendChild(querypage);

}


function show_json_query(){
  const sideBox = document.querySelector(".side-container");
  sideBox.classList.add("open-side");
}

function hide_json_query(){
  const sideBox = document.querySelector(".side-container");
  sideBox.classList.remove("open-side");

}

const preTagss = Array.from(document.getElementsByTagName('pre'));
console.log(jmespath.search(preTagss[0], "response"));