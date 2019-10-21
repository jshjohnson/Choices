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

export const isElement = element => element instanceof Element;

export const wrap = (element, wrapper = document.createElement('div')) => {
  if (element.nextSibling) {
    element.parentNode.insertBefore(wrapper, element.nextSibling);
  } else {
    element.parentNode.appendChild(wrapper);
  }
  return wrapper.appendChild(element);
};

export const findAncestorByAttrName = (el, attr) => {
  let target = el;

  while (target) {
    if (target.hasAttribute(attr)) {
      return target;
    }

    target = target.parentElement;
  }

  return null;
};

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
  if (!isType('String', value)) {
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

/**
 * Determines the width of a passed input based on its value and passes
 * it to the supplied callback function.
 */
export const calcWidthOfInput = (input, callback) => {
  const value = input.value || input.placeholder;
  let width = input.offsetWidth;

  if (value) {
    const testEl = strToEl(`<span>${sanitise(value)}</span>`);
    testEl.style.position = 'absolute';
    testEl.style.padding = '0';
    testEl.style.top = '-9999px';
    testEl.style.left = '-9999px';
    testEl.style.width = 'auto';
    testEl.style.whiteSpace = 'pre';

    if (document.body.contains(input) && window.getComputedStyle) {
      const inputStyle = window.getComputedStyle(input);

      if (inputStyle) {
        testEl.style.fontSize = inputStyle.fontSize;
        testEl.style.fontFamily = inputStyle.fontFamily;
        testEl.style.fontWeight = inputStyle.fontWeight;
        testEl.style.fontStyle = inputStyle.fontStyle;
        testEl.style.letterSpacing = inputStyle.letterSpacing;
        testEl.style.textTransform = inputStyle.textTransform;
        testEl.style.paddingLeft = inputStyle.paddingLeft;
        testEl.style.paddingRight = inputStyle.paddingRight;
      }
    }

    document.body.appendChild(testEl);

    requestAnimationFrame(() => {
      if (value && testEl.offsetWidth !== input.offsetWidth) {
        width = testEl.offsetWidth + 4;
      }

      document.body.removeChild(testEl);

      callback.call(this, `${width}px`);
    });
  } else {
    callback.call(this, `${width}px`);
  }
};

export const sortByAlpha = (a, b) => {
  const labelA = `${a.label || a.value}`.toLowerCase();
  const labelB = `${b.label || b.value}`.toLowerCase();

  if (labelA < labelB) {
    return -1;
  }

  if (labelA > labelB) {
    return 1;
  }

  return 0;
};

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

export const fetchFromObject = (object, path) => {
  const index = path.indexOf('.');

  if (index > -1) {
    return fetchFromObject(
      object[path.substring(0, index)],
      path.substr(index + 1),
    );
  }

  return object[path];
};

export const isIE11 = () =>
  !!(
    navigator.userAgent.match(/Trident/) &&
    navigator.userAgent.match(/rv[ :]11/)
  );

export const existsInArray = (array, value, key = 'value') =>
  array.some(item => {
    if (isType('String', value)) {
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
