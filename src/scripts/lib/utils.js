export const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min) + min);

export const generateChars = length =>
  Array.from({ length }, () => getRandomNumber(0, 36).toString(36)).join('');

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

export const getAdjacentEl =
  /**
   * @param {Element} startEl
   * @param {string} selector
   * @param {1 | -1} direction
   * @returns {Element | undefined}
   */
  (startEl, selector, direction = 1) => {
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
