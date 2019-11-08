/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

/**
 * @param {number} length
 * @returns {string}
 */
export const generateChars = length =>
  Array.from({ length }, () => getRandomNumber(0, 36).toString(36)).join('');

/**
 * @param {HTMLInputElement | HTMLSelectElement} element
 * @param {string} prefix
 * @returns {string}
 */
export const generateId = (element, prefix) => {
  let id =
    element.id ||
    (element.name && `${element.name}-${generateChars(2)}`) ||
    generateChars(4);
  id = id.replace(/(:|\.|\[|\]|,)/g, '');
  id = `${prefix}-${id}`;

  return id;
};

/**
 * @param {any} obj
 * @returns {string}
 */
export const getType = obj => Object.prototype.toString.call(obj).slice(8, -1);

/**
 * @param {string} type
 * @param {any} obj
 * @returns {boolean}
 */
export const isType = (type, obj) =>
  obj !== undefined && obj !== null && getType(obj) === type;

/**
 * @param {HTMLElement} element
 * @param {HTMLElement} [wrapper={HTMLDivElement}]
 * @returns {HTMLElement}
 */
export const wrap = (element, wrapper = document.createElement('div')) => {
  if (element.nextSibling) {
    element.parentNode.insertBefore(wrapper, element.nextSibling);
  } else {
    element.parentNode.appendChild(wrapper);
  }

  return wrapper.appendChild(element);
};

/**
 * @param {Element} startEl
 * @param {string} selector
 * @param {1 | -1} direction
 * @returns {Element | undefined}
 */
export const getAdjacentEl = (startEl, selector, direction = 1) => {
  if (!(startEl instanceof Element) || typeof selector !== 'string') {
    return undefined;
  }

  const prop = `${direction > 0 ? 'next' : 'previous'}ElementSibling`;

  let sibling = startEl[prop];
  while (sibling) {
    if (sibling.matches(selector)) {
      return sibling;
    }
    sibling = sibling[prop];
  }

  return sibling;
};

/**
 * @param {Element} element
 * @param {Element} parent
 * @param {-1 | 1} direction
 * @returns {boolean}
 */
export const isScrolledIntoView = (element, parent, direction = 1) => {
  if (!element) {
    return false;
  }

  let isVisible;

  if (direction > 0) {
    // In view from bottom
    isVisible =
      parent.scrollTop + parent.offsetHeight >=
      element.offsetTop + element.offsetHeight;
  } else {
    // In view from top
    isVisible = element.offsetTop >= parent.scrollTop;
  }

  return isVisible;
};

/**
 * @param {any} value
 * @returns {any}
 */
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

/**
 * @returns {() => (str: string) => Element}
 */
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

/**
 * @param {{ label?: string, value: string }} a
 * @param {{ label?: string, value: string }} b
 * @returns {number}
 */
export const sortByAlpha = (
  { value, label = value },
  { value: value2, label: label2 = value2 },
) =>
  label.localeCompare(label2, [], {
    sensitivity: 'base',
    ignorePunctuation: true,
    numeric: true,
  });

/**
 * @param {{ score: number }} a
 * @param {{ score: number }} b
 */
export const sortByScore = (a, b) => a.score - b.score;

/**
 * @param {HTMLElement} element
 * @param {string} type
 * @param {object} customArgs
 */
export const dispatchEvent = (element, type, customArgs = null) => {
  const event = new CustomEvent(type, {
    detail: customArgs,
    bubbles: true,
    cancelable: true,
  });

  return element.dispatchEvent(event);
};

/**
 * @param {array} array
 * @param {any} value
 * @param {string} [key="value"]
 * @returns {boolean}
 */
export const existsInArray = (array, value, key = 'value') =>
  array.some(item => {
    if (typeof value === 'string') {
      return item[key] === value.trim();
    }

    return item[key] === value;
  });

/**
 * @param {any} obj
 * @returns {any}
 */
export const cloneObject = obj => JSON.parse(JSON.stringify(obj));

/**
 * Returns an array of keys present on the first but missing on the second object
 * @param {object} a
 * @param {object} b
 * @returns {string[]}
 */
export const diff = (a, b) => {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();

  return aKeys.filter(i => bKeys.indexOf(i) < 0);
};
