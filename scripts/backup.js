const cssStyles = `
  .json_block {
    padding-left: 30px; 
    border-left-width: thin; 
    border-left-style: solid; 
    border-color: #efefef;
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
  }
  .collapsed::before {
    content: "+";
    cursor: pointer;
    margin-right: 5px;
  }
  .json_value {
    margin-left: 15px;
  }
`;

function prettifyJSON() {
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  styleElement.textContent = cssStyles;
  document.head.appendChild(styleElement);

  const preTags = document.getElementsByTagName('pre');
  for (let preTag of preTags) {
    try {
      const json = JSON.parse(preTag.textContent);
      const formattedDiv = document.createElement('pre');
      formattedDiv.className = 'formatted-json';
      preTag.parentNode?.insertBefore(formattedDiv, preTag.nextSibling);
      preTag.style.display = 'none';
      formattedDiv.innerHTML = styledHtml(json);
      document.querySelectorAll('.end_value').forEach(e => {
        e.parentElement.firstElementChild.classList.remove('expanded')
      });
      expandcollapse();
    } catch (e) {
      console.warn('Content is not valid JSON');
    }
  }
}

prettifyJSON();

function expandcollapse() {
  const array = document.querySelectorAll('.json_key');
  array.forEach(element => {
    element.addEventListener('click', (e) => {
      const target = e.currentTarget;
      const parent = target.parentElement;
      const childContainer = parent.querySelector('ul, div');
      if (childContainer) {
        if (childContainer.style.display === 'none') {
          childContainer.style.display = 'block';
          target.classList.add('expanded');
          target.classList.remove('collapsed');
        } else {
          childContainer.style.display = 'none';
          target.classList.add('collapsed');
          target.classList.remove('expanded');
        }
      }
    });
  });
}

function styledHtml(value) {
  if (typeof value === 'object' && value !== null) {
    let child = '';
    const hasNested = Array.isArray(value) ? value.length > 0 : Object.keys(value).length > 0;

    if (Array.isArray(value)) {
      for (const item of value) {
        child += styledHtml(item) + ',<br>';
      }
      child = child.slice(0, -5);
      return `[<div class="json_block">${child}</div>]`;
    } else {
      for (const [key, val] of Object.entries(value)) {
        child += `<li><span class="json_key${hasNested ? ' expanded' : ''}">"${key}":</span> ${styledHtml(val)},</li>`;
      }
      child = child.slice(0, -6);
      return `<span class="${hasNested ? ' expanded' : ''}">{<ul class="json_block">${child}</ul>}</span>`;
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
