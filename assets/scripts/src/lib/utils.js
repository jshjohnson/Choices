/* eslint-disable */

/**
 * Capitalises the first letter of each word in a string
 * @param  {String} str String to capitalise
 * @return {String}     Capitalised string
 */
export const capitalise = function(str) {
  return str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};

/**
 * Generates a string of random chars
 * @param  {Number} length Length of the string to generate
 * @return {String} String of random chars
 */
export const generateChars = function(length) {
  let chars = '';

  for (let i = 0; i < length; i++) {
    const randomChar = getRandomNumber(0, 36);
    chars += randomChar.toString(36);
  }

  return chars;
};

/**
 * Generates a unique id based on an element
 * @param  {HTMLElement} element Element to generate the id from
 * @param  {String} Prefix for the Id
 * @return {String} Unique Id
 */
export const generateId = function(element, prefix) {
  let id = element.id || (element.name && (`${element.name}-${generateChars(2)}`)) || generateChars(4);
  id = id.replace(/(:|\.|\[|\]|,)/g, '');
  id = prefix + id;

  return id;
};


/**
 * Tests the type of an object
 * @param  {String}  type Type to test object against
 * @param  {Object}  obj  Object to be tested
 * @return {Boolean}
 */
export const getType = function(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

/**
 * Tests the type of an object
 * @param  {String}  type Type to test object against
 * @param  {Object}  obj  Object to be tested
 * @return {Boolean}
 */
export const isType = function(type, obj) {
  const clas = getType(obj);
  return obj !== undefined && obj !== null && clas === type;
};

/**
 * Tests to see if a passed object is a node
 * @param  {Object}  obj  Object to be tested
 * @return {Boolean}
 */
export const isNode = o => (
    typeof Node === 'object' ? o instanceof Node :
    o && typeof o === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string'
  );

/**
 * Tests to see if a passed object is an element
 * @param  {Object}  obj  Object to be tested
 * @return {Boolean}
 */
export const isElement = o => (
    typeof HTMLElement === 'object' ? o instanceof HTMLElement : // DOM2
    o && typeof o === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string'
  );

/**
 * Merges unspecified amount of objects into new object
 * @private
 * @return {Object} Merged object of arguments
 */
export const extend = function() {
  const extended = {};
  const length = arguments.length;

  /**
   * Merge one object into another
   * @param  {Object} obj  Object to merge into extended object
   */
  const merge = function(obj) {
    for (const prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        // If deep merge and property is an object, merge properties
         if (isType('Object', obj[prop])) {
          extended[prop] = extend(true, extended[prop], obj[prop]);
        } else {
          extended[prop] = obj[prop];
        }
       }
    }
  };

  // Loop through each passed argument
  for (let i = 0; i < length; i++) {
    // store argument at position i
    const obj = arguments[i];

    // If we are in fact dealing with an object, merge it.
    if (isType('Object', obj)) {
      merge(obj);
    }
  }

  return extended;
};

/**
 * CSS transition end event listener
 * @return
 */
export const whichTransitionEvent = function() {
  let t,
    el = document.createElement('fakeelement');

  const transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd',
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
};

/**
 * CSS animation end event listener
 * @return
 */
export const whichAnimationEvent = function() {
  let t,
    el = document.createElement('fakeelement');

  const animations = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'animationend',
    WebkitAnimation: 'webkitAnimationEnd',
  };

  for (t in animations) {
    if (el.style[t] !== undefined) {
      return animations[t];
    }
  }
};

/**
 *  Get the ancestors of each element in the current set of matched elements,
 *  up to but not including the element matched by the selector
 * @param  {NodeElement} elem     Element to begin search from
 * @param  {NodeElement} parent   Parent to find
 * @param  {String} selector Class to find
 * @return {Array}          Array of parent elements
 */
export const getParentsUntil = function(elem, parent, selector) {
  const parents = [];
  // Get matches
  for (; elem && elem !== document; elem = elem.parentNode) {
    // Check if parent has been reached
    if (parent) {
      const parentType = parent.charAt(0);

      // If parent is a class
      if (parentType === '.') {
        if (elem.classList.contains(parent.substr(1))) {
          break;
        }
      }

      // If parent is an ID
      if (parentType === '#') {
        if (elem.id === parent.substr(1)) {
          break;
        }
      }

      // If parent is a data attribute
      if (parentType === '[') {
        if (elem.hasAttribute(parent.substr(1, parent.length - 1))) {
          break;
        }
      }

      // If parent is a tag
      if (elem.tagName.toLowerCase() === parent) {
        break;
      }
    }
    if (selector) {
      const selectorType = selector.charAt(0);

      // If selector is a class
      if (selectorType === '.') {
        if (elem.classList.contains(selector.substr(1))) {
          parents.push(elem);
        }
      }

      // If selector is an ID
      if (selectorType === '#') {
        if (elem.id === selector.substr(1)) {
          parents.push(elem);
        }
      }

      // If selector is a data attribute
      if (selectorType === '[') {
        if (elem.hasAttribute(selector.substr(1, selector.length - 1))) {
          parents.push(elem);
        }
      }

      // If selector is a tag
      if (elem.tagName.toLowerCase() === selector) {
        parents.push(elem);
      }
    } else {
      parents.push(elem);
    }
  }

  // Return parents if any exist
  if (parents.length === 0) {
    return null;
  }
  return parents;
};

export const wrap = function(element, wrapper) {
  wrapper = wrapper || document.createElement('div');
  if (element.nextSibling) {
    element.parentNode.insertBefore(wrapper, element.nextSibling);
  } else {
    element.parentNode.appendChild(wrapper);
  }
  return wrapper.appendChild(element);
};

export const getSiblings = function(elem) {
  const siblings = [];
  let sibling = elem.parentNode.firstChild;
  for (; sibling; sibling = sibling.nextSibling) {
    if (sibling.nodeType === 1 && sibling !== elem) {
      siblings.push(sibling);
    }
  }
  return siblings;
};

/**
 * Find ancestor in DOM tree
 * @param  {NodeElement} el  Element to start search from
 * @param  {[type]} cls Class of parent
 * @return {NodeElement}     Found parent element
 */
export const findAncestor = function(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
};

/**
 * Find ancestor in DOM tree by attribute name
 * @param  {NodeElement} el  Element to start search from
 * @param  {string} attr Attribute name of parent
 * @return {?NodeElement}     Found parent element or null
 */
export const findAncestorByAttrName = function(el, attr) {
  let target = el;

  while (target) {
    if (target.hasAttribute(attr)) {
      return target;
    }

    target = target.parentElement;
  }

  return null;
};

/**
 * Debounce an event handler.
 * @param  {Function} func      Function to run after wait
 * @param  {Number} wait      The delay before the function is executed
 * @param  {Boolean} immediate  If  passed, trigger the function on the leading edge, instead of the trailing.
 * @return {Function}           A function will be called after it stops being called for a given delay
 */
export const debounce = function(func, wait, immediate) {
  let timeout;
  return function() {
    let context = this,
      args = arguments;
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

/**
 * Get an element's distance from the top of the page
 * @private
 * @param  {NodeElement} el Element to test for
 * @return {Number} Elements Distance from top of page
 */
export const getElemDistance = function(el) {
  let location = 0;
  if (el.offsetParent) {
    do {
      location += el.offsetTop;
      el = el.offsetParent;
    } while (el);
  }
  return location >= 0 ? location : 0;
};

/**
 * Determine element height multiplied by any offsets
 * @private
 * @param  {HTMLElement} el Element to test for
 * @return {Number}    Height of element
 */
export const getElementOffset = function(el, offset) {
  let elOffset = offset;
  if (elOffset > 1) elOffset = 1;
  if (elOffset > 0) elOffset = 0;

  return Math.max(el.offsetHeight * elOffset);
};

/**
 * Get the next or previous element from a given start point
 * @param  {HTMLElement} startEl    Element to start position from
 * @param  {String}      className  The class we will look through
 * @param  {Number}      direction  Positive next element, negative previous element
 * @return {[HTMLElement}           Found element
 */
export const getAdjacentEl = (startEl, className, direction = 1) => {
  if (!startEl || !className) return;

  const parent = startEl.parentNode.parentNode;
  const children = Array.from(parent.querySelectorAll(className));

  const startPos = children.indexOf(startEl);
  const operatorDirection = direction > 0 ? 1 : -1;

  return children[startPos + operatorDirection];
};

/**
 * Get scroll position based on top/bottom position
 * @private
 * @return {String} Position of scroll
 */
export const getScrollPosition = function(position) {
  if (position === 'bottom') {
    // Scroll position from the bottom of the viewport
    return Math.max((window.scrollY || window.pageYOffset) + (window.innerHeight || document.documentElement.clientHeight));
  }
    // Scroll position from the top of the viewport
  return (window.scrollY || window.pageYOffset);
};

/**
 * Determine whether an element is within the viewport
 * @param  {HTMLElement}  el Element to test
 * @return {String} Position of scroll
 * @return {Boolean}
 */
export const isInView = function(el, position, offset) {
  // If the user has scrolled further than the distance from the element to the top of its parent
  return this.getScrollPosition(position) > (this.getElemDistance(el) + this.getElementOffset(el, offset));
};

/**
 * Determine whether an element is within
 * @param  {HTMLElement} el        Element to test
 * @param  {HTMLElement} parent    Scrolling parent
 * @param  {Number} direction      Whether element is visible from above or below
 * @return {Boolean}
 */
export const isScrolledIntoView = (el, parent, direction = 1) => {
  if (!el) return;

  let isVisible;

  if (direction > 0) {
    // In view from bottom
    isVisible = (parent.scrollTop + parent.offsetHeight) >= (el.offsetTop + el.offsetHeight);
  } else {
    // In view from top
    isVisible = el.offsetTop >= parent.scrollTop;
  }

  return isVisible;
};

/**
 * Remove html tags from a string
 * @param  {String}  Initial string/html
 * @return {String}  Sanitised string
 */
export const stripHTML = function(html) {
  const el = document.createElement('DIV');
  el.innerHTML = html;
  return el.textContent || el.innerText || '';
};

/**
 * Adds animation to an element and removes it upon animation completion
 * @param  {Element} el        Element to add animation to
 * @param  {String} animation Animation class to add to element
 * @return
 */
export const addAnimation = (el, animation) => {
  const animationEvent = whichAnimationEvent();

  const removeAnimation = () => {
    el.classList.remove(animation);
    el.removeEventListener(animationEvent, removeAnimation, false);
  };

  el.classList.add(animation);
  el.addEventListener(animationEvent, removeAnimation, false);
};


/**
 * Get a random number between a range
 * @param  {Number} min Minimum range
 * @param  {Number} max Maximum range
 * @return {Number}     Random number
 */
export const getRandomNumber = function(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Turn a string into a node
 * @param  {String} String to convert
 * @return {HTMLElement}   Converted node element
 */
export const strToEl = (function() {
  const tmpEl = document.createElement('div');
  return function(str) {
    const cleanedInput = str.trim();
    let r;
    tmpEl.innerHTML = cleanedInput;
    r = tmpEl.children[0];

    while (tmpEl.firstChild) {
      tmpEl.removeChild(tmpEl.firstChild);
    }

    return r;
  };
}());

/**
 * Sets the width of a passed input based on its value
 * @return {Number} Width of input
 */
export const getWidthOfInput = (input) => {
  const value = input.value || input.placeholder;
  let width = input.offsetWidth;

  if (value) {
    const testEl = strToEl(`<span>${value}</span>`);
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
        testEl.style.padding = inputStyle.padding;
      }
    }

    document.body.appendChild(testEl);

    if (value && testEl.offsetWidth !== input.offsetWidth) {
      width = testEl.offsetWidth + 4;
    }

    document.body.removeChild(testEl);
  }

  return `${width}px`;
};

/**
 * Sorting function for current and previous string
 * @param  {String} a Current value
 * @param  {String} b Next value
 * @return {Number}   -1 for after previous,
 *                    1 for before,
 *                    0 for same location
 */
export const sortByAlpha = (a, b) => {
  const labelA = (a.label || a.value).toLowerCase();
  const labelB = (b.label || b.value).toLowerCase();

  if (labelA < labelB) return -1;
  if (labelA > labelB) return 1;
  return 0;
};

/**
 * Sort by numeric score
 * @param  {Object} a Current value
 * @param  {Object} b Next value
 * @return {Number}   -1 for after previous,
 *                    1 for before,
 *                    0 for same location
 */
export const sortByScore = (a, b) => a.score - b.score;

/**
 * Trigger native event
 * @param  {NodeElement} element Element to trigger event on
 * @param  {String} type         Type of event to trigger
 * @param  {Object} customArgs   Data to pass with event
 * @return {Object}              Triggered event
 */
export const triggerEvent = (element, type, customArgs = null) => {
  const event = new CustomEvent(type, {
    detail: customArgs,
    bubbles: true,
    cancelable: true,
  });

  return element.dispatchEvent(event);
};

/**
 * Tests value against a regular expression
 * @param  {string} value   Value to test
 * @return {Boolean}        Whether test passed/failed
 * @private
 */
export const regexFilter = (value, regex) => {
  if (!value || !regex) {
    return false;
  }

  const expression = new RegExp(regex.source, 'i');
  return expression.test(value);
};
