export const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

export const generateChars = length => {
  let chars = '';

  for (let i = 0; i < length; i++) {
    const randomChar = getRandomNumber(0, 36);
    chars += randomChar.toString(36);
  }

  return chars;
};

export const generateId = (element, prefix) => {
  let id =
    element.id ||
    (element.name && `${element.name}-${generateChars(2)}`) ||
    generateChars(4);
  id = id.replace(/(:|\.|\[|\]|,)/g, '');
  id = `${prefix}-${id}`;

  return id;
};

export const getType = obj => Object.prototype.toString.call(obj).slice(8, -1);

export const isType = (type, obj) =>
  obj !== undefined && obj !== null && getType(obj) === type;

export const wrap = (element, wrapper = document.createElement('div')) => {
  if (element.nextSibling) {
    element.parentNode.insertBefore(wrapper, element.nextSibling);
  } else {
    element.parentNode.appendChild(wrapper);
  }

  return wrapper.appendChild(element);
};

/**
 * @param {HTMLElement} el
 * @param {string} attr
 */
export const findAncestorByAttrName = (el, attr) => el.closest(`[${attr}]`);

export const getAdjacentEl = (startEl, className, direction = 1) => {
  if (!startEl || !className) {
    return;
  }

  const parent = startEl.parentNode.parentNode;
  const children = Array.from(parent.querySelectorAll(className));

  const startPos = children.indexOf(startEl);
  const operatorDirection = direction > 0 ? 1 : -1;

  return children[startPos + operatorDirection];
};

export const isScrolledIntoView = (el, parent, direction = 1) => {
  if (!el) {
    return;
  }

  let isVisible;

  if (direction > 0) {
    // In view from bottom
    isVisible =
      parent.scrollTop + parent.offsetHeight >= el.offsetTop + el.offsetHeight;
  } else {
    // In view from top
    isVisible = el.offsetTop >= parent.scrollTop;
  }

  return isVisible;
};

export const sanitise = value => {
  if (typeof value !== 'string') {
    return value;
  }

  return value
    .replace(/&/g, '&amp;')
    .replace(/>/g, '&rt;')
    .replace(/</g, '&lt;')
    .replace(/"/g, '&quot;');
};

export const strToEl = (() => {
  const tmpEl = document.createElement('div');

  return str => {
    const cleanedInput = str.trim();
    tmpEl.innerHTML = cleanedInput;
    const firldChild = tmpEl.children[0];

    while (tmpEl.firstChild) {
      tmpEl.removeChild(tmpEl.firstChild);
    }

    return firldChild;
  };
})();

export const sortByAlpha =
  /**
   * @param {{ label?: string, value: string }} a
   * @param {{ label?: string, value: string }} b
   * @returns {number}
   */
  ({ value, label = value }, { value: value2, label: label2 = value2 }) =>
    label.localeCompare(label2, [], {
      sensitivity: 'base',
      ignorePunctuation: true,
      numeric: true,
    });

export const sortByScore = (a, b) => a.score - b.score;

export const dispatchEvent = (element, type, customArgs = null) => {
  const event = new CustomEvent(type, {
    detail: customArgs,
    bubbles: true,
    cancelable: true,
  });

  return element.dispatchEvent(event);
};

export const getWindowHeight = () => {
  const { body } = document;
  const html = document.documentElement;

  return Math.max(
    body.scrollHeight,
    body.offsetHeight,
    html.clientHeight,
    html.scrollHeight,
    html.offsetHeight,
  );
};

export const isIE11 = userAgent =>
  !!(userAgent.match(/Trident/) && userAgent.match(/rv[ :]11/));

export const existsInArray = (array, value, key = 'value') =>
  array.some(item => {
    if (typeof value === 'string') {
      return item[key] === value.trim();
    }

    return item[key] === value;
  });

export const cloneObject = obj => JSON.parse(JSON.stringify(obj));

export const diff = (a, b) => {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();

  return aKeys.filter(i => bKeys.indexOf(i) < 0);
};
