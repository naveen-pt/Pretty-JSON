function prettifyJSON() {
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
   <div class="result-container">
      <div class="search-result"></div>
    </div>
  </div>`;

  const querypage = document.createElement('div');
  querypage.innerHTML = navbar;
  document.body.appendChild(querypage);
  const searchButton = document.querySelector('.search-button');
  const searchInput = document.querySelector('.search-input');
  const performSearch = () => {
    const preTagss = Array.from(document.getElementsByTagName('pre'));
    const JSON_data = JSON.parse(preTagss[0].textContent);
    const search_data = document.querySelector('.search-input').value;
    try {
      const result = jmespath.search(JSON_data, search_data);
      document.querySelector('.search-result').innerHTML = styledHtml(result);
      document.querySelectorAll('.end_value').forEach(e => {
        e.parentElement.firstElementChild.classList.remove('expanded')
      });
      expandcollapse();
    } catch (error) {
      document.querySelector('.search-result').textContent = `Error: Please check your query`;
    }
  };
  searchButton.addEventListener('click', () => {
    performSearch();
  });
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      performSearch();
    }
  });
}


function show_json_query() {
  const sideBox = document.querySelector(".side-container");
  sideBox.classList.add("open-side");
}

function hide_json_query() {
  const sideBox = document.querySelector(".side-container");
  sideBox.classList.remove("open-side");

}

