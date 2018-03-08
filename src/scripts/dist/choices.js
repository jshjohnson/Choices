/*! choices.js v3.0.2 | (c) 2018 Josh Johnson | https://github.com/jshjohnson/Choices#readme */ 
(function webpackUniversalModuleDefinition(root, factory) {
   //CommonJS2
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
   //AMD
	else if(typeof define === 'function' && define.amd)
		define([], factory);
   //CommonJS
	else if(typeof exports === 'object')
		exports["Choices"] = factory();
   //Window
	else
		root["Choices"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/src/scripts/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* eslint-disable */

/**
 * Capitalises the first letter of each word in a string
 * @param  {String} str String to capitalise
 * @return {String}     Capitalised string
 */
var capitalise = exports.capitalise = function capitalise(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Generates a string of random chars
 * @param  {Number} length Length of the string to generate
 * @return {String} String of random chars
 */
var generateChars = exports.generateChars = function generateChars(length) {
  var chars = '';

  for (var i = 0; i < length; i++) {
    var randomChar = getRandomNumber(0, 36);
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
var generateId = exports.generateId = function generateId(element, prefix) {
  var id = element.id || element.name && element.name + '-' + generateChars(2) || generateChars(4);
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
var getType = exports.getType = function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
};

/**
 * Tests the type of an object
 * @param  {String}  type Type to test object against
 * @param  {Object}  obj  Object to be tested
 * @return {Boolean}
 */
var isType = exports.isType = function isType(type, obj) {
  var clas = getType(obj);
  return obj !== undefined && obj !== null && clas === type;
};

/**
 * Tests to see if a passed object is a node
 * @param  {Object}  obj  Object to be tested
 * @return {Boolean}
 */
var isNode = exports.isNode = function isNode(o) {
  return (typeof Node === 'undefined' ? 'undefined' : _typeof(Node)) === 'object' ? o instanceof Node : o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && typeof o.nodeType === 'number' && typeof o.nodeName === 'string';
};

/**
 * Tests to see if a passed object is an element
 * @param  {Object}  obj  Object to be tested
 * @return {Boolean}
 */
var isElement = exports.isElement = function isElement(o) {
  return (typeof HTMLElement === 'undefined' ? 'undefined' : _typeof(HTMLElement)) === 'object' ? o instanceof HTMLElement : // DOM2
  o && (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o !== null && o.nodeType === 1 && typeof o.nodeName === 'string';
};

/**
 * Merges unspecified amount of objects into new object
 * @private
 * @return {Object} Merged object of arguments
 */
var extend = exports.extend = function extend() {
  var extended = {};
  var length = arguments.length;

  /**
   * Merge one object into another
   * @param  {Object} obj  Object to merge into extended object
   */
  var merge = function merge(obj) {
    for (var prop in obj) {
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
  for (var i = 0; i < length; i++) {
    // store argument at position i
    var obj = arguments[i];

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
var whichTransitionEvent = exports.whichTransitionEvent = function whichTransitionEvent() {
  var t = void 0,
      el = document.createElement('fakeelement');

  var transitions = {
    transition: 'transitionend',
    OTransition: 'oTransitionEnd',
    MozTransition: 'transitionend',
    WebkitTransition: 'webkitTransitionEnd'
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
var whichAnimationEvent = exports.whichAnimationEvent = function whichAnimationEvent() {
  var t = void 0,
      el = document.createElement('fakeelement');

  var animations = {
    animation: 'animationend',
    OAnimation: 'oAnimationEnd',
    MozAnimation: 'animationend',
    WebkitAnimation: 'webkitAnimationEnd'
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
var getParentsUntil = exports.getParentsUntil = function getParentsUntil(elem, parent, selector) {
  var parents = [];
  // Get matches
  for (; elem && elem !== document; elem = elem.parentNode) {
    // Check if parent has been reached
    if (parent) {
      var parentType = parent.charAt(0);

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
      var selectorType = selector.charAt(0);

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

var wrap = exports.wrap = function wrap(element, wrapper) {
  wrapper = wrapper || document.createElement('div');
  if (element.nextSibling) {
    element.parentNode.insertBefore(wrapper, element.nextSibling);
  } else {
    element.parentNode.appendChild(wrapper);
  }
  return wrapper.appendChild(element);
};

var getSiblings = exports.getSiblings = function getSiblings(elem) {
  var siblings = [];
  var sibling = elem.parentNode.firstChild;
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
var findAncestor = exports.findAncestor = function findAncestor(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls)) {}
  return el;
};

/**
 * Find ancestor in DOM tree by attribute name
 * @param  {NodeElement} el  Element to start search from
 * @param  {string} attr Attribute name of parent
 * @return {?NodeElement}     Found parent element or null
 */
var findAncestorByAttrName = exports.findAncestorByAttrName = function findAncestorByAttrName(el, attr) {
  var target = el;

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
var debounce = exports.debounce = function debounce(func, wait, immediate) {
  var timeout = void 0;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
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
var getElemDistance = exports.getElemDistance = function getElemDistance(el) {
  var location = 0;
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
var getElementOffset = exports.getElementOffset = function getElementOffset(el, offset) {
  var elOffset = offset;
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
var getAdjacentEl = exports.getAdjacentEl = function getAdjacentEl(startEl, className) {
  var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (!startEl || !className) return;

  var parent = startEl.parentNode.parentNode;
  var children = Array.from(parent.querySelectorAll(className));

  var startPos = children.indexOf(startEl);
  var operatorDirection = direction > 0 ? 1 : -1;

  return children[startPos + operatorDirection];
};

/**
 * Get scroll position based on top/bottom position
 * @private
 * @return {String} Position of scroll
 */
var getScrollPosition = exports.getScrollPosition = function getScrollPosition(position) {
  if (position === 'bottom') {
    // Scroll position from the bottom of the viewport
    return Math.max((window.scrollY || window.pageYOffset) + (window.innerHeight || document.documentElement.clientHeight));
  }
  // Scroll position from the top of the viewport
  return window.scrollY || window.pageYOffset;
};

/**
 * Determine whether an element is within the viewport
 * @param  {HTMLElement}  el Element to test
 * @return {String} Position of scroll
 * @return {Boolean}
 */
var isInView = exports.isInView = function isInView(el, position, offset) {
  // If the user has scrolled further than the distance from the element to the top of its parent
  return this.getScrollPosition(position) > this.getElemDistance(el) + this.getElementOffset(el, offset);
};

/**
 * Determine whether an element is within
 * @param  {HTMLElement} el        Element to test
 * @param  {HTMLElement} parent    Scrolling parent
 * @param  {Number} direction      Whether element is visible from above or below
 * @return {Boolean}
 */
var isScrolledIntoView = exports.isScrolledIntoView = function isScrolledIntoView(el, parent) {
  var direction = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  if (!el) return;

  var isVisible = void 0;

  if (direction > 0) {
    // In view from bottom
    isVisible = parent.scrollTop + parent.offsetHeight >= el.offsetTop + el.offsetHeight;
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
var stripHTML = exports.stripHTML = function stripHTML(html) {
  var el = document.createElement('DIV');
  el.innerHTML = html;
  return el.textContent || el.innerText || '';
};

/**
 * Adds animation to an element and removes it upon animation completion
 * @param  {Element} el        Element to add animation to
 * @param  {String} animation Animation class to add to element
 * @return
 */
var addAnimation = exports.addAnimation = function addAnimation(el, animation) {
  var animationEvent = whichAnimationEvent();

  var removeAnimation = function removeAnimation() {
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
var getRandomNumber = exports.getRandomNumber = function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

/**
 * Turn a string into a node
 * @param  {String} String to convert
 * @return {HTMLElement}   Converted node element
 */
var strToEl = exports.strToEl = function () {
  var tmpEl = document.createElement('div');
  return function (str) {
    var cleanedInput = str.trim();
    var r = void 0;
    tmpEl.innerHTML = cleanedInput;
    r = tmpEl.children[0];

    while (tmpEl.firstChild) {
      tmpEl.removeChild(tmpEl.firstChild);
    }

    return r;
  };
}();

/**
 * Sets the width of a passed input based on its value
 * @return {Number} Width of input
 */
var getWidthOfInput = exports.getWidthOfInput = function getWidthOfInput(input) {
  var value = input.value || input.placeholder;
  var width = input.offsetWidth;

  if (value) {
    var testEl = strToEl('<span>' + value + '</span>');
    testEl.style.position = 'absolute';
    testEl.style.padding = '0';
    testEl.style.top = '-9999px';
    testEl.style.left = '-9999px';
    testEl.style.width = 'auto';
    testEl.style.whiteSpace = 'pre';

    if (document.body.contains(input) && window.getComputedStyle) {
      var inputStyle = window.getComputedStyle(input);

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

  return width + 'px';
};

/**
 * Sorting function for current and previous string
 * @param  {String} a Current value
 * @param  {String} b Next value
 * @return {Number}   -1 for after previous,
 *                    1 for before,
 *                    0 for same location
 */
var sortByAlpha = exports.sortByAlpha = function sortByAlpha(a, b) {
  var labelA = (a.label || a.value).toLowerCase();
  var labelB = (b.label || b.value).toLowerCase();

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
var sortByScore = exports.sortByScore = function sortByScore(a, b) {
  return a.score - b.score;
};

/**
 * Dispatch native event
 * @param  {NodeElement} element Element to trigger event on
 * @param  {String} type         Type of event to trigger
 * @param  {Object} customArgs   Data to pass with event
 * @return {Object}              Triggered event
 */
var dispatchEvent = exports.dispatchEvent = function dispatchEvent(element, type) {
  var customArgs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var event = new CustomEvent(type, {
    detail: customArgs,
    bubbles: true,
    cancelable: true
  });

  return element.dispatchEvent(event);
};

/**
 * Tests value against a regular expression
 * @param  {string} value   Value to test
 * @return {Boolean}        Whether test passed/failed
 * @private
 */
var regexFilter = exports.regexFilter = function regexFilter(value, regex) {
  if (!value || !regex) {
    return false;
  }

  var expression = new RegExp(regex.source, 'i');
  return expression.test(value);
};

var getWindowHeight = exports.getWindowHeight = function getWindowHeight() {
  var body = document.body;
  var html = document.documentElement;
  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
};

var reduceToValues = exports.reduceToValues = function reduceToValues(items) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'value';

  var values = items.reduce(function (prev, current) {
    prev.push(current[key]);
    return prev;
  }, []);

  return values;
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var DEFAULT_CLASSNAMES = exports.DEFAULT_CLASSNAMES = {
  containerOuter: 'choices',
  containerInner: 'choices__inner',
  input: 'choices__input',
  inputCloned: 'choices__input--cloned',
  list: 'choices__list',
  listItems: 'choices__list--multiple',
  listSingle: 'choices__list--single',
  listDropdown: 'choices__list--dropdown',
  item: 'choices__item',
  itemSelectable: 'choices__item--selectable',
  itemDisabled: 'choices__item--disabled',
  itemChoice: 'choices__item--choice',
  placeholder: 'choices__placeholder',
  group: 'choices__group',
  groupHeading: 'choices__heading',
  button: 'choices__button',
  activeState: 'is-active',
  focusState: 'is-focused',
  openState: 'is-open',
  disabledState: 'is-disabled',
  highlightedState: 'is-highlighted',
  hiddenState: 'is-hidden',
  flippedState: 'is-flipped',
  loadingState: 'is-loading',
  noResults: 'has-no-results',
  noChoices: 'has-no-choices'
};

var DEFAULT_CONFIG = exports.DEFAULT_CONFIG = {
  items: [],
  choices: [],
  silent: false,
  renderChoiceLimit: -1,
  maxItemCount: -1,
  addItems: true,
  removeItems: true,
  removeItemButton: false,
  editItems: false,
  duplicateItems: true,
  delimiter: ',',
  paste: true,
  searchEnabled: true,
  searchChoices: true,
  searchFloor: 1,
  searchResultLimit: 4,
  searchFields: ['label', 'value'],
  position: 'auto',
  resetScrollPosition: true,
  regexFilter: null,
  shouldSort: true,
  shouldSortItems: false,
  placeholder: true,
  placeholderValue: null,
  searchPlaceholderValue: null,
  prependValue: null,
  appendValue: null,
  renderSelectedChoices: 'auto',
  loadingText: 'Loading...',
  noResultsText: 'No results found',
  noChoicesText: 'No choices to choose from',
  itemSelectText: 'Press to select',
  uniqueItemText: 'Only unique values can be added.',
  addItemText: function addItemText(value) {
    return 'Press Enter to add <b>"' + value + '"</b>';
  },
  maxItemText: function maxItemText(maxItemCount) {
    return 'Only ' + maxItemCount + ' values can be added.';
  },
  fuseOptions: {
    includeScore: true
  },
  callbackOnInit: null,
  callbackOnCreateTemplates: null
};

var EVENTS = exports.EVENTS = {
  showDropdown: 'showDropdown',
  hideDropdown: 'hideDropdown',
  change: 'change',
  choice: 'choice',
  search: 'search',
  addItem: 'addItem',
  removeItem: 'removeItem',
  highlightItem: 'highlightItem'
};

var ACTION_TYPES = exports.ACTION_TYPES = {
  ADD_CHOICE: 'ADD_CHOICE',
  FILTER_CHOICES: 'FILTER_CHOICES',
  ACTIVATE_CHOICES: 'ACTIVATE_CHOICES',
  CLEAR_CHOICES: 'CLEAR_CHOICES',
  ADD_GROUP: 'ADD_GROUP',
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  HIGHLIGHT_ITEM: 'HIGHLIGHT_ITEM',
  CLEAR_ALL: 'CLEAR_ALL'
};

var KEY_CODES = exports.KEY_CODES = {
  BACK_KEY: 46,
  DELETE_KEY: 8,
  ENTER_KEY: 13,
  A_KEY: 65,
  ESC_KEY: 27,
  UP_KEY: 38,
  DOWN_KEY: 40,
  PAGE_UP_KEY: 33,
  PAGE_DOWN_KEY: 34
};

var SCROLLING_SPEED = exports.SCROLLING_SPEED = 4;

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: ./node_modules/lodash-es/_freeGlobal.js
var _freeGlobal = __webpack_require__(10);

// CONCATENATED MODULE: ./node_modules/lodash-es/_root.js


/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal["a" /* default */] || freeSelf || Function('return this')();

/* harmony default export */ var _root = (root);

// CONCATENATED MODULE: ./node_modules/lodash-es/_Symbol.js


/** Built-in value references. */
var Symbol = _root.Symbol;

/* harmony default export */ var _Symbol = (Symbol);

// CONCATENATED MODULE: ./node_modules/lodash-es/_getRawTag.js


/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var _getRawTag_hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = _getRawTag_hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

/* harmony default export */ var _getRawTag = (getRawTag);

// CONCATENATED MODULE: ./node_modules/lodash-es/_objectToString.js
/** Used for built-in method references. */
var _objectToString_objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var _objectToString_nativeObjectToString = _objectToString_objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return _objectToString_nativeObjectToString.call(value);
}

/* harmony default export */ var _objectToString = (objectToString);

// CONCATENATED MODULE: ./node_modules/lodash-es/_baseGetTag.js




/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var _baseGetTag_symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (_baseGetTag_symToStringTag && _baseGetTag_symToStringTag in Object(value))
    ? _getRawTag(value)
    : _objectToString(value);
}

/* harmony default export */ var _baseGetTag = (baseGetTag);

// CONCATENATED MODULE: ./node_modules/lodash-es/_overArg.js
/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/* harmony default export */ var _overArg = (overArg);

// CONCATENATED MODULE: ./node_modules/lodash-es/_getPrototype.js


/** Built-in value references. */
var getPrototype = _overArg(Object.getPrototypeOf, Object);

/* harmony default export */ var _getPrototype = (getPrototype);

// CONCATENATED MODULE: ./node_modules/lodash-es/isObjectLike.js
/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

/* harmony default export */ var lodash_es_isObjectLike = (isObjectLike);

// CONCATENATED MODULE: ./node_modules/lodash-es/isPlainObject.js




/** `Object#toString` result references. */
var objectTag = '[object Object]';

/** Used for built-in method references. */
var funcProto = Function.prototype,
    isPlainObject_objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var isPlainObject_hasOwnProperty = isPlainObject_objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!lodash_es_isObjectLike(value) || _baseGetTag(value) != objectTag) {
    return false;
  }
  var proto = _getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = isPlainObject_hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return typeof Ctor == 'function' && Ctor instanceof Ctor &&
    funcToString.call(Ctor) == objectCtorString;
}

/* harmony default export */ var lodash_es_isPlainObject = (isPlainObject);

// EXTERNAL MODULE: ./node_modules/symbol-observable/index.js
var symbol_observable = __webpack_require__(11);
var symbol_observable_default = /*#__PURE__*/__webpack_require__.n(symbol_observable);

// CONCATENATED MODULE: ./node_modules/redux/es/createStore.js



/**
 * These are private action types reserved by Redux.
 * For any unknown actions, you must return the current state.
 * If the current state is undefined, you must return the initial state.
 * Do not reference these action types directly in your code.
 */
var ActionTypes = {
  INIT: '@@redux/INIT'

  /**
   * Creates a Redux store that holds the state tree.
   * The only way to change the data in the store is to call `dispatch()` on it.
   *
   * There should only be a single store in your app. To specify how different
   * parts of the state tree respond to actions, you may combine several reducers
   * into a single reducer function by using `combineReducers`.
   *
   * @param {Function} reducer A function that returns the next state tree, given
   * the current state tree and the action to handle.
   *
   * @param {any} [preloadedState] The initial state. You may optionally specify it
   * to hydrate the state from the server in universal apps, or to restore a
   * previously serialized user session.
   * If you use `combineReducers` to produce the root reducer function, this must be
   * an object with the same shape as `combineReducers` keys.
   *
   * @param {Function} [enhancer] The store enhancer. You may optionally specify it
   * to enhance the store with third-party capabilities such as middleware,
   * time travel, persistence, etc. The only store enhancer that ships with Redux
   * is `applyMiddleware()`.
   *
   * @returns {Store} A Redux store that lets you read the state, dispatch actions
   * and subscribe to changes.
   */
};function createStore_createStore(reducer, preloadedState, enhancer) {
  var _ref2;

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState;
    preloadedState = undefined;
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.');
    }

    return enhancer(createStore_createStore)(reducer, preloadedState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.');
  }

  var currentReducer = reducer;
  var currentState = preloadedState;
  var currentListeners = [];
  var nextListeners = currentListeners;
  var isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  /**
   * Reads the state tree managed by the store.
   *
   * @returns {any} The current state tree of your application.
   */
  function getState() {
    return currentState;
  }

  /**
   * Adds a change listener. It will be called any time an action is dispatched,
   * and some part of the state tree may potentially have changed. You may then
   * call `getState()` to read the current state tree inside the callback.
   *
   * You may call `dispatch()` from a change listener, with the following
   * caveats:
   *
   * 1. The subscriptions are snapshotted just before every `dispatch()` call.
   * If you subscribe or unsubscribe while the listeners are being invoked, this
   * will not have any effect on the `dispatch()` that is currently in progress.
   * However, the next `dispatch()` call, whether nested or not, will use a more
   * recent snapshot of the subscription list.
   *
   * 2. The listener should not expect to see all state changes, as the state
   * might have been updated multiple times during a nested `dispatch()` before
   * the listener is called. It is, however, guaranteed that all subscribers
   * registered before the `dispatch()` started will be called with the latest
   * state by the time it exits.
   *
   * @param {Function} listener A callback to be invoked on every dispatch.
   * @returns {Function} A function to remove this change listener.
   */
  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Expected listener to be a function.');
    }

    var isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      var index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
    };
  }

  /**
   * Dispatches an action. It is the only way to trigger a state change.
   *
   * The `reducer` function, used to create the store, will be called with the
   * current state tree and the given `action`. Its return value will
   * be considered the **next** state of the tree, and the change listeners
   * will be notified.
   *
   * The base implementation only supports plain object actions. If you want to
   * dispatch a Promise, an Observable, a thunk, or something else, you need to
   * wrap your store creating function into the corresponding middleware. For
   * example, see the documentation for the `redux-thunk` package. Even the
   * middleware will eventually dispatch plain object actions using this method.
   *
   * @param {Object} action A plain object representing “what changed”. It is
   * a good idea to keep actions serializable so you can record and replay user
   * sessions, or use the time travelling `redux-devtools`. An action must have
   * a `type` property which may not be `undefined`. It is a good idea to use
   * string constants for action types.
   *
   * @returns {Object} For convenience, the same action object you dispatched.
   *
   * Note that, if you use a custom middleware, it may wrap `dispatch()` to
   * return something else (for example, a Promise you can await).
   */
  function dispatch(action) {
    if (!lodash_es_isPlainObject(action)) {
      throw new Error('Actions must be plain objects. ' + 'Use custom middleware for async actions.');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?');
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    var listeners = currentListeners = nextListeners;
    for (var i = 0; i < listeners.length; i++) {
      var listener = listeners[i];
      listener();
    }

    return action;
  }

  /**
   * Replaces the reducer currently used by the store to calculate the state.
   *
   * You might need this if your app implements code splitting and you want to
   * load some of the reducers dynamically. You might also need this if you
   * implement a hot reloading mechanism for Redux.
   *
   * @param {Function} nextReducer The reducer for the store to use instead.
   * @returns {void}
   */
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.');
    }

    currentReducer = nextReducer;
    dispatch({ type: ActionTypes.INIT });
  }

  /**
   * Interoperability point for observable/reactive libraries.
   * @returns {observable} A minimal observable of state changes.
   * For more information, see the observable proposal:
   * https://github.com/tc39/proposal-observable
   */
  function observable() {
    var _ref;

    var outerSubscribe = subscribe;
    return _ref = {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe: function subscribe(observer) {
        if (typeof observer !== 'object') {
          throw new TypeError('Expected the observer to be an object.');
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState());
          }
        }

        observeState();
        var unsubscribe = outerSubscribe(observeState);
        return { unsubscribe: unsubscribe };
      }
    }, _ref[symbol_observable_default.a] = function () {
      return this;
    }, _ref;
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT });

  return _ref2 = {
    dispatch: dispatch,
    subscribe: subscribe,
    getState: getState,
    replaceReducer: replaceReducer
  }, _ref2[symbol_observable_default.a] = observable, _ref2;
}
// CONCATENATED MODULE: ./node_modules/redux/es/utils/warning.js
/**
 * Prints a warning in the console if it exists.
 *
 * @param {String} message The warning message.
 * @returns {void}
 */
function warning_warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message);
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message);
    /* eslint-disable no-empty */
  } catch (e) {}
  /* eslint-enable no-empty */
}
// CONCATENATED MODULE: ./node_modules/redux/es/combineReducers.js




function getUndefinedStateErrorMessage(key, action) {
  var actionType = action && action.type;
  var actionName = actionType && '"' + actionType.toString() + '"' || 'an action';

  return 'Given action ' + actionName + ', reducer "' + key + '" returned undefined. ' + 'To ignore an action, you must explicitly return the previous state. ' + 'If you want this reducer to hold no value, you can return null instead of undefined.';
}

function getUnexpectedStateShapeWarningMessage(inputState, reducers, action, unexpectedKeyCache) {
  var reducerKeys = Object.keys(reducers);
  var argumentName = action && action.type === ActionTypes.INIT ? 'preloadedState argument passed to createStore' : 'previous state received by the reducer';

  if (reducerKeys.length === 0) {
    return 'Store does not have a valid reducer. Make sure the argument passed ' + 'to combineReducers is an object whose values are reducers.';
  }

  if (!lodash_es_isPlainObject(inputState)) {
    return 'The ' + argumentName + ' has unexpected type of "' + {}.toString.call(inputState).match(/\s([a-z|A-Z]+)/)[1] + '". Expected argument to be an object with the following ' + ('keys: "' + reducerKeys.join('", "') + '"');
  }

  var unexpectedKeys = Object.keys(inputState).filter(function (key) {
    return !reducers.hasOwnProperty(key) && !unexpectedKeyCache[key];
  });

  unexpectedKeys.forEach(function (key) {
    unexpectedKeyCache[key] = true;
  });

  if (unexpectedKeys.length > 0) {
    return 'Unexpected ' + (unexpectedKeys.length > 1 ? 'keys' : 'key') + ' ' + ('"' + unexpectedKeys.join('", "') + '" found in ' + argumentName + '. ') + 'Expected to find one of the known reducer keys instead: ' + ('"' + reducerKeys.join('", "') + '". Unexpected keys will be ignored.');
  }
}

function assertReducerShape(reducers) {
  Object.keys(reducers).forEach(function (key) {
    var reducer = reducers[key];
    var initialState = reducer(undefined, { type: ActionTypes.INIT });

    if (typeof initialState === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined during initialization. ' + 'If the state passed to the reducer is undefined, you must ' + 'explicitly return the initial state. The initial state may ' + 'not be undefined. If you don\'t want to set a value for this reducer, ' + 'you can use null instead of undefined.');
    }

    var type = '@@redux/PROBE_UNKNOWN_ACTION_' + Math.random().toString(36).substring(7).split('').join('.');
    if (typeof reducer(undefined, { type: type }) === 'undefined') {
      throw new Error('Reducer "' + key + '" returned undefined when probed with a random type. ' + ('Don\'t try to handle ' + ActionTypes.INIT + ' or other actions in "redux/*" ') + 'namespace. They are considered private. Instead, you must return the ' + 'current state for any unknown actions, unless it is undefined, ' + 'in which case you must return the initial state, regardless of the ' + 'action type. The initial state may not be undefined, but can be null.');
    }
  });
}

/**
 * Turns an object whose values are different reducer functions, into a single
 * reducer function. It will call every child reducer, and gather their results
 * into a single state object, whose keys correspond to the keys of the passed
 * reducer functions.
 *
 * @param {Object} reducers An object whose values correspond to different
 * reducer functions that need to be combined into one. One handy way to obtain
 * it is to use ES6 `import * as reducers` syntax. The reducers may never return
 * undefined for any action. Instead, they should return their initial state
 * if the state passed to them was undefined, and the current state for any
 * unrecognized action.
 *
 * @returns {Function} A reducer function that invokes every reducer inside the
 * passed object, and builds a state object with the same shape.
 */
function combineReducers(reducers) {
  var reducerKeys = Object.keys(reducers);
  var finalReducers = {};
  for (var i = 0; i < reducerKeys.length; i++) {
    var key = reducerKeys[i];

    if (false) {
      if (typeof reducers[key] === 'undefined') {
        warning('No reducer provided for key "' + key + '"');
      }
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  var finalReducerKeys = Object.keys(finalReducers);

  var unexpectedKeyCache = void 0;
  if (false) {
    unexpectedKeyCache = {};
  }

  var shapeAssertionError = void 0;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }

  return function combination() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var action = arguments[1];

    if (shapeAssertionError) {
      throw shapeAssertionError;
    }

    if (false) {
      var warningMessage = getUnexpectedStateShapeWarningMessage(state, finalReducers, action, unexpectedKeyCache);
      if (warningMessage) {
        warning(warningMessage);
      }
    }

    var hasChanged = false;
    var nextState = {};
    for (var _i = 0; _i < finalReducerKeys.length; _i++) {
      var _key = finalReducerKeys[_i];
      var reducer = finalReducers[_key];
      var previousStateForKey = state[_key];
      var nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        var errorMessage = getUndefinedStateErrorMessage(_key, action);
        throw new Error(errorMessage);
      }
      nextState[_key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    return hasChanged ? nextState : state;
  };
}
// CONCATENATED MODULE: ./node_modules/redux/es/bindActionCreators.js
function bindActionCreator(actionCreator, dispatch) {
  return function () {
    return dispatch(actionCreator.apply(undefined, arguments));
  };
}

/**
 * Turns an object whose values are action creators, into an object with the
 * same keys, but with every function wrapped into a `dispatch` call so they
 * may be invoked directly. This is just a convenience method, as you can call
 * `store.dispatch(MyActionCreators.doSomething())` yourself just fine.
 *
 * For convenience, you can also pass a single function as the first argument,
 * and get a function in return.
 *
 * @param {Function|Object} actionCreators An object whose values are action
 * creator functions. One handy way to obtain it is to use ES6 `import * as`
 * syntax. You may also pass a single function.
 *
 * @param {Function} dispatch The `dispatch` function available on your Redux
 * store.
 *
 * @returns {Function|Object} The object mimicking the original object, but with
 * every action creator wrapped into the `dispatch` call. If you passed a
 * function as `actionCreators`, the return value will also be a single
 * function.
 */
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('bindActionCreators expected an object or a function, instead received ' + (actionCreators === null ? 'null' : typeof actionCreators) + '. ' + 'Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');
  }

  var keys = Object.keys(actionCreators);
  var boundActionCreators = {};
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}
// CONCATENATED MODULE: ./node_modules/redux/es/compose.js
/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for
 * the resulting composite function.
 *
 * @param {...Function} funcs The functions to compose.
 * @returns {Function} A function obtained by composing the argument functions
 * from right to left. For example, compose(f, g, h) is identical to doing
 * (...args) => f(g(h(...args))).
 */

function compose() {
  for (var _len = arguments.length, funcs = Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }

  if (funcs.length === 0) {
    return function (arg) {
      return arg;
    };
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(function (a, b) {
    return function () {
      return a(b.apply(undefined, arguments));
    };
  });
}
// CONCATENATED MODULE: ./node_modules/redux/es/applyMiddleware.js
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };



/**
 * Creates a store enhancer that applies middleware to the dispatch method
 * of the Redux store. This is handy for a variety of tasks, such as expressing
 * asynchronous actions in a concise manner, or logging every action payload.
 *
 * See `redux-thunk` package as an example of the Redux middleware.
 *
 * Because middleware is potentially asynchronous, this should be the first
 * store enhancer in the composition chain.
 *
 * Note that each middleware will be given the `dispatch` and `getState` functions
 * as named arguments.
 *
 * @param {...Function} middlewares The middleware chain to be applied.
 * @returns {Function} A store enhancer applying the middleware.
 */
function applyMiddleware() {
  for (var _len = arguments.length, middlewares = Array(_len), _key = 0; _key < _len; _key++) {
    middlewares[_key] = arguments[_key];
  }

  return function (createStore) {
    return function (reducer, preloadedState, enhancer) {
      var store = createStore(reducer, preloadedState, enhancer);
      var _dispatch = store.dispatch;
      var chain = [];

      var middlewareAPI = {
        getState: store.getState,
        dispatch: function dispatch(action) {
          return _dispatch(action);
        }
      };
      chain = middlewares.map(function (middleware) {
        return middleware(middlewareAPI);
      });
      _dispatch = compose.apply(undefined, chain)(store.dispatch);

      return _extends({}, store, {
        dispatch: _dispatch
      });
    };
  };
}
// CONCATENATED MODULE: ./node_modules/redux/es/index.js
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "createStore", function() { return createStore_createStore; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "combineReducers", function() { return combineReducers; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "bindActionCreators", function() { return bindActionCreators; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "applyMiddleware", function() { return applyMiddleware; });
/* concated harmony reexport */__webpack_require__.d(__webpack_exports__, "compose", function() { return compose; });







/*
* This is a dummy function to check if the function name has been altered by minification.
* If the function has been minified and NODE_ENV !== 'production', warn the user.
*/
function isCrushed() {}

if (false) {
  warning('You are currently using minified code outside of NODE_ENV === \'production\'. ' + 'This means that you are running a slower development build of Redux. ' + 'You can use loose-envify (https://github.com/zertosh/loose-envify) for browserify ' + 'or DefinePlugin for webpack (http://stackoverflow.com/questions/30030031) ' + 'to ensure you have the correct code for your production build.');
}



/***/ }),
/* 3 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WrappedElement = function () {
  function WrappedElement(instance, element, classNames) {
    _classCallCheck(this, WrappedElement);

    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
    this.isDisabled = false;
  }

  _createClass(WrappedElement, [{
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.element.value;
    }
  }, {
    key: 'conceal',
    value: function conceal() {
      // Hide passed input
      this.element.classList.add(this.classNames.input, this.classNames.hiddenState);

      // Remove element from tab index
      this.element.tabIndex = '-1';

      // Backup original styles if any
      var origStyle = this.element.getAttribute('style');

      if (origStyle) {
        this.element.setAttribute('data-choice-orig-style', origStyle);
      }

      this.element.setAttribute('style', 'display:none;');
      this.element.setAttribute('aria-hidden', 'true');
      this.element.setAttribute('data-choice', 'active');
    }
  }, {
    key: 'reveal',
    value: function reveal() {
      // Reinstate passed element
      this.element.classList.remove(this.classNames.input, this.classNames.hiddenState);
      this.element.removeAttribute('tabindex');

      // Recover original styles if any
      var origStyle = this.element.getAttribute('data-choice-orig-style');

      if (origStyle) {
        this.element.removeAttribute('data-choice-orig-style');
        this.element.setAttribute('style', origStyle);
      } else {
        this.element.removeAttribute('style');
      }
      this.element.removeAttribute('aria-hidden');
      this.element.removeAttribute('data-choice');

      // Re-assign values - this is weird, I know
      this.element.value = this.element.value;
    }
  }, {
    key: 'enable',
    value: function enable() {
      this.element.removeAttribute('disabled');
      this.element.disabled = false;
      this.isDisabled = false;
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.element.setAttribute('disabled', '');
      this.element.disabled = true;
      this.isDisabled = true;
    }
  }, {
    key: 'triggerEvent',
    value: function triggerEvent(eventType, data) {
      (0, _utils.dispatchEvent)(this.element, eventType, data);
    }
  }]);

  return WrappedElement;
}();

exports.default = WrappedElement;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TEMPLATES = undefined;

var _classnames = __webpack_require__(25);

var _classnames2 = _interopRequireDefault(_classnames);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var TEMPLATES = exports.TEMPLATES = {
  containerOuter: function containerOuter(globalClasses, direction, isSelectElement, isSelectOneElement, searchEnabled, passedElementType) {
    var tabIndex = isSelectOneElement ? 'tabindex="0"' : '';
    var role = isSelectElement ? 'role="listbox"' : '';
    var ariaAutoComplete = '';

    if (isSelectElement && searchEnabled) {
      role = 'role="combobox"';
      ariaAutoComplete = 'aria-autocomplete="list"';
    }

    return (0, _utils.strToEl)('\n      <div\n        class="' + globalClasses.containerOuter + '"\n        data-type="' + passedElementType + '"\n        ' + role + '\n        ' + tabIndex + '\n        ' + ariaAutoComplete + '\n        aria-haspopup="true"\n        aria-expanded="false"\n        dir="' + direction + '"\n        >\n      </div>\n    ');
  },
  containerInner: function containerInner(globalClasses) {
    return (0, _utils.strToEl)('\n      <div class="' + globalClasses.containerInner + '"></div>\n    ');
  },
  itemList: function itemList(globalClasses, isSelectOneElement) {
    var _classNames;

    var localClasses = (0, _classnames2.default)(globalClasses.list, (_classNames = {}, _defineProperty(_classNames, globalClasses.listSingle, isSelectOneElement), _defineProperty(_classNames, globalClasses.listItems, !isSelectOneElement), _classNames));

    return (0, _utils.strToEl)('\n      <div class="' + localClasses + '"></div>\n    ');
  },
  placeholder: function placeholder(globalClasses, value) {
    return (0, _utils.strToEl)('\n      <div class="' + globalClasses.placeholder + '">\n        ' + value + '\n      </div>\n    ');
  },
  item: function item(globalClasses, data, removeItemButton) {
    var _classNames2;

    var ariaSelected = data.active ? 'aria-selected="true"' : '';
    var ariaDisabled = data.disabled ? 'aria-disabled="true"' : '';

    var localClasses = (0, _classnames2.default)(globalClasses.item, (_classNames2 = {}, _defineProperty(_classNames2, globalClasses.highlightedState, data.highlighted), _defineProperty(_classNames2, globalClasses.itemSelectable, !data.highlighted), _defineProperty(_classNames2, globalClasses.placeholder, data.placeholder), _classNames2));

    if (removeItemButton) {
      var _classNames3;

      localClasses = (0, _classnames2.default)(globalClasses.item, (_classNames3 = {}, _defineProperty(_classNames3, globalClasses.highlightedState, data.highlighted), _defineProperty(_classNames3, globalClasses.itemSelectable, !data.disabled), _defineProperty(_classNames3, globalClasses.placeholder, data.placeholder), _classNames3));

      return (0, _utils.strToEl)('\n        <div\n          class="' + localClasses + '"\n          data-item\n          data-id="' + data.id + '"\n          data-value="' + data.value + '"\n          data-deletable\n          ' + ariaSelected + '\n          ' + ariaDisabled + '\n          >\n          ' + data.label + '<!--\n       --><button\n            type="button"\n            class="' + globalClasses.button + '"\n            data-button\n            aria-label="Remove item: \'' + data.value + '\'"\n            >\n            Remove item\n          </button>\n        </div>\n      ');
    }

    return (0, _utils.strToEl)('\n      <div\n        class="' + localClasses + '"\n        data-item\n        data-id="' + data.id + '"\n        data-value="' + data.value + '"\n        ' + ariaSelected + '\n        ' + ariaDisabled + '\n        >\n        ' + data.label + '\n      </div>\n    ');
  },
  choiceList: function choiceList(globalClasses, isSelectOneElement) {
    var ariaMultiSelectable = !isSelectOneElement ? 'aria-multiselectable="true"' : '';

    return (0, _utils.strToEl)('\n      <div\n        class="' + globalClasses.list + '"\n        dir="ltr"\n        role="listbox"\n        ' + ariaMultiSelectable + '\n        >\n      </div>\n    ');
  },
  choiceGroup: function choiceGroup(globalClasses, data) {
    var ariaDisabled = data.disabled ? 'aria-disabled="true"' : '';
    var localClasses = (0, _classnames2.default)(globalClasses.group, _defineProperty({}, globalClasses.itemDisabled, data.disabled));

    return (0, _utils.strToEl)('\n      <div\n        class="' + localClasses + '"\n        data-group\n        data-id="' + data.id + '"\n        data-value="' + data.value + '"\n        role="group"\n        ' + ariaDisabled + '\n        >\n        <div class="' + globalClasses.groupHeading + '">' + data.value + '</div>\n      </div>\n    ');
  },
  choice: function choice(globalClasses, data, itemSelectText) {
    var _classNames5;

    var role = data.groupId > 0 ? 'role="treeitem"' : 'role="option"';
    var localClasses = (0, _classnames2.default)(globalClasses.item, globalClasses.itemChoice, (_classNames5 = {}, _defineProperty(_classNames5, globalClasses.itemDisabled, data.disabled), _defineProperty(_classNames5, globalClasses.itemSelectable, !data.disabled), _defineProperty(_classNames5, globalClasses.placeholder, data.placeholder), _classNames5));

    return (0, _utils.strToEl)('\n      <div\n        class="' + localClasses + '"\n        data-select-text="' + itemSelectText + '"\n        data-choice\n        data-id="' + data.id + '"\n        data-value="' + data.value + '"\n        ' + (data.disabled ? 'data-choice-disabled aria-disabled="true"' : 'data-choice-selectable') + '\n        id="' + data.elementId + '"\n        ' + role + '\n        >\n        ' + data.label + '\n      </div>\n    ');
  },
  input: function input(globalClasses) {
    var localClasses = (0, _classnames2.default)(globalClasses.input, globalClasses.inputCloned);

    return (0, _utils.strToEl)('\n      <input\n        type="text"\n        class="' + localClasses + '"\n        autocomplete="off"\n        autocapitalize="off"\n        spellcheck="false"\n        role="textbox"\n        aria-autocomplete="list"\n        >\n    ');
  },
  dropdown: function dropdown(globalClasses) {
    var localClasses = (0, _classnames2.default)(globalClasses.list, globalClasses.listDropdown);

    return (0, _utils.strToEl)('\n      <div\n        class="' + localClasses + '"\n        aria-expanded="false"\n        >\n      </div>\n    ');
  },
  notice: function notice(globalClasses, label) {
    var _classNames6;

    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

    var localClasses = (0, _classnames2.default)(globalClasses.item, globalClasses.itemChoice, (_classNames6 = {}, _defineProperty(_classNames6, globalClasses.noResults, type === 'no-results'), _defineProperty(_classNames6, globalClasses.noChoices, type === 'no-choices'), _classNames6));

    return (0, _utils.strToEl)('\n      <div class="' + localClasses + '">\n        ' + label + '\n      </div>\n    ');
  },
  option: function option(data) {
    return (0, _utils.strToEl)('\n      <option value="' + data.value + '" ' + (data.selected ? 'selected' : '') + ' ' + (data.disabled ? 'disabled' : '') + '>' + data.label + '</option>\n    ');
  }
};

exports.default = TEMPLATES;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(7);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fuse = __webpack_require__(8);

var _fuse2 = _interopRequireDefault(_fuse);

var _store = __webpack_require__(9);

var _store2 = _interopRequireDefault(_store);

var _dropdown = __webpack_require__(19);

var _dropdown2 = _interopRequireDefault(_dropdown);

var _container = __webpack_require__(20);

var _container2 = _interopRequireDefault(_container);

var _input = __webpack_require__(21);

var _input2 = _interopRequireDefault(_input);

var _list = __webpack_require__(22);

var _list2 = _interopRequireDefault(_list);

var _wrappedInput = __webpack_require__(23);

var _wrappedInput2 = _interopRequireDefault(_wrappedInput);

var _wrappedSelect = __webpack_require__(24);

var _wrappedSelect2 = _interopRequireDefault(_wrappedSelect);

var _constants = __webpack_require__(1);

var _templates = __webpack_require__(5);

var _choices = __webpack_require__(26);

var _items = __webpack_require__(27);

var _groups = __webpack_require__(28);

var _misc = __webpack_require__(29);

var _utils = __webpack_require__(0);

__webpack_require__(30);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Choices
 */
var Choices = function () {
  function Choices() {
    var element = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '[data-choice]';
    var userConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Choices);

    // If there are multiple elements, create a new instance
    // for each element besides the first one (as that already has an instance)
    if ((0, _utils.isType)('String', element)) {
      var elements = document.querySelectorAll(element);
      if (elements.length > 1) {
        for (var i = 1; i < elements.length; i += 1) {
          var el = elements[i];
          /* eslint-disable no-new */
          new Choices(el, userConfig);
        }
      }
    }

    var defaultConfig = _extends({}, _constants.DEFAULT_CONFIG, {
      items: [],
      choices: [],
      classNames: _constants.DEFAULT_CLASSNAMES,
      sortFn: _utils.sortByAlpha
    });

    // Merge options with user options
    this.config = (0, _utils.extend)(defaultConfig, Choices.userDefaults, userConfig);

    if (!['auto', 'always'].includes(this.config.renderSelectedChoices)) {
      this.config.renderSelectedChoices = 'auto';
    }

    // Create data store
    this.store = new _store2.default(this.render);

    // State tracking
    this.initialised = false;
    this.currentState = {};
    this.prevState = {};
    this.currentValue = '';

    // Retrieve triggering element (i.e. element with 'data-choice' trigger)
    var passedElement = (0, _utils.isType)('String', element) ? document.querySelector(element) : element;

    this.isTextElement = passedElement.type === 'text';
    this.isSelectOneElement = passedElement.type === 'select-one';
    this.isSelectMultipleElement = passedElement.type === 'select-multiple';
    this.isSelectElement = this.isSelectOneElement || this.isSelectMultipleElement;
    this.isValidElementType = this.isTextElement || this.isSelectElement;

    if (this.isTextElement) {
      this.passedElement = new _wrappedInput2.default(this, passedElement, this.config.classNames);
    } else if (this.isSelectElement) {
      this.passedElement = new _wrappedSelect2.default(this, passedElement, this.config.classNames);
    }

    if (!this.passedElement) {
      if (!this.config.silent) {
        console.error('Passed element not found');
      }
      return false;
    }

    this.isIe11 = !!(navigator.userAgent.match(/Trident/) && navigator.userAgent.match(/rv[ :]11/));
    this.isScrollingOnIe = false;

    if (this.config.shouldSortItems === true && this.isSelectOneElement) {
      if (!this.config.silent) {
        console.warn('shouldSortElements: Type of passed element is \'select-one\', falling back to false.');
      }
    }

    this.highlightPosition = 0;
    this.canSearch = this.config.searchEnabled;

    this.placeholder = false;
    if (!this.isSelectOneElement) {
      this.placeholder = this.config.placeholder ? this.config.placeholderValue || this.passedElement.element.getAttribute('placeholder') : false;
    }

    // Assign preset choices from passed object
    this.presetChoices = this.config.choices;
    // Assign preset items from passed object first
    this.presetItems = this.config.items;

    // Then add any values passed from attribute
    if (this.passedElement.getValue()) {
      this.presetItems = this.presetItems.concat(this.passedElement.getValue().split(this.config.delimiter));
    }

    // Set unique base Id
    this.baseId = (0, _utils.generateId)(this.passedElement.element, 'choices-');

    this.idNames = {
      itemChoice: 'item-choice'
    };

    // Bind methods
    this.render = this.render.bind(this);

    // Bind event handlers
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onClick = this._onClick.bind(this);
    this._onTouchMove = this._onTouchMove.bind(this);
    this._onTouchEnd = this._onTouchEnd.bind(this);
    this._onMouseDown = this._onMouseDown.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);

    // Monitor touch taps/scrolls
    this.wasTap = true;

    // Cutting the mustard
    var cuttingTheMustard = 'classList' in document.documentElement;
    if (!cuttingTheMustard && !this.config.silent) {
      console.error('Choices: Your browser doesn\'t support Choices');
    }

    var canInit = (0, _utils.isElement)(this.passedElement.element) && this.isValidElementType;

    if (canInit) {
      // If element has already been initialised with Choices
      if (this.passedElement.element.getAttribute('data-choice') === 'active') {
        return false;
      }

      // Let's go
      this.init();
    } else if (!this.config.silent) {
      console.error('Incompatible input passed');
    }
  }

  /* ========================================
  =            Public functions            =
  ======================================== */

  /**
   * Initialise Choices
   * @return
   * @public
   */


  _createClass(Choices, [{
    key: 'init',
    value: function init() {
      if (this.initialised) {
        return;
      }

      // Set initialise flag
      this.initialised = true;
      // Create required elements
      this._createTemplates();
      // Generate input markup
      this._createStructure();
      // Subscribe store to render method
      this.store.subscribe(this.render);
      // Render any items
      this.render();
      // Trigger event listeners
      this._addEventListeners();

      var callback = this.config.callbackOnInit;
      // Run callback if it is a function
      if (callback && (0, _utils.isType)('Function', callback)) {
        callback.call(this);
      }
    }

    /**
     * Destroy Choices and nullify values
     * @return
     * @public
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      if (!this.initialised) {
        return;
      }

      // Remove all event listeners
      this._removeEventListeners();
      this.passedElement.reveal();
      this.containerOuter.unwrap(this.passedElement.element);

      if (this.isSelectElement) {
        this.passedElement.setOptions(this.presetChoices);
      }

      // Clear data store
      this.clearStore();

      // Nullify instance-specific data
      this.config.templates = null;

      // Uninitialise
      this.initialised = false;
    }

    /**
    * Enable interaction with Choices
    * @return {Object} Class instance
    */

  }, {
    key: 'enable',
    value: function enable() {
      if (!this.initialised) {
        return this;
      }

      this.passedElement.enable();

      if (this.containerOuter.isDisabled) {
        this._addEventListeners();
        this.input.enable();
        this.containerOuter.enable();
      }

      return this;
    }

    /**
     * Disable interaction with Choices
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'disable',
    value: function disable() {
      if (!this.initialised) {
        return this;
      }

      this.passedElement.disable();

      if (!this.containerOuter.isDisabled) {
        this._removeEventListeners();
        this.input.disable();
        this.containerOuter.disable();
      }

      return this;
    }

    /**
     * Render group choices into a DOM fragment and append to choice list
     * @param  {Array} groups    Groups to add to list
     * @param  {Array} choices   Choices to add to groups
     * @param  {DocumentFragment} fragment Fragment to add groups and options to (optional)
     * @return {DocumentFragment} Populated options fragment
     * @private
     */

  }, {
    key: 'createGroupsFragment',
    value: function createGroupsFragment(groups, choices, fragment) {
      var _this = this;

      var groupFragment = fragment || document.createDocumentFragment();
      var getGroupChoices = function getGroupChoices(group) {
        return choices.filter(function (choice) {
          if (_this.isSelectOneElement) {
            return choice.groupId === group.id;
          }
          return choice.groupId === group.id && (_this.config.renderSelectedChoices === 'always' || !choice.selected);
        });
      };

      // If sorting is enabled, filter groups
      if (this.config.shouldSort) {
        groups.sort(this.config.sortFn);
      }

      groups.forEach(function (group) {
        var groupChoices = getGroupChoices(group);
        if (groupChoices.length >= 1) {
          var dropdownGroup = _this._getTemplate('choiceGroup', group);
          groupFragment.appendChild(dropdownGroup);
          _this.createChoicesFragment(groupChoices, groupFragment, true);
        }
      });

      return groupFragment;
    }

    /**
     * Render choices into a DOM fragment and append to choice list
     * @param  {Array} choices    Choices to add to list
     * @param  {DocumentFragment} fragment Fragment to add choices to (optional)
     * @return {DocumentFragment} Populated choices fragment
     * @private
     */

  }, {
    key: 'createChoicesFragment',
    value: function createChoicesFragment(choices, fragment) {
      var _this2 = this;

      var withinGroup = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      // Create a fragment to store our list items (so we don't have to update the DOM for each item)
      var choicesFragment = fragment || document.createDocumentFragment();
      var _config = this.config,
          renderSelectedChoices = _config.renderSelectedChoices,
          searchResultLimit = _config.searchResultLimit,
          renderChoiceLimit = _config.renderChoiceLimit;

      var filter = this.isSearching ? _utils.sortByScore : this.config.sortFn;
      var appendChoice = function appendChoice(choice) {
        var shouldRender = renderSelectedChoices === 'auto' ? _this2.isSelectOneElement || !choice.selected : true;
        if (shouldRender) {
          var dropdownItem = _this2._getTemplate('choice', choice, _this2.config.itemSelectText);
          choicesFragment.appendChild(dropdownItem);
        }
      };

      var rendererableChoices = choices;

      if (renderSelectedChoices === 'auto' && !this.isSelectOneElement) {
        rendererableChoices = choices.filter(function (choice) {
          return !choice.selected;
        });
      }

      // Split array into placeholders and "normal" choices

      var _rendererableChoices$ = rendererableChoices.reduce(function (acc, choice) {
        if (choice.placeholder) {
          acc.placeholderChoices.push(choice);
        } else {
          acc.normalChoices.push(choice);
        }
        return acc;
      }, { placeholderChoices: [], normalChoices: [] }),
          placeholderChoices = _rendererableChoices$.placeholderChoices,
          normalChoices = _rendererableChoices$.normalChoices;

      // If sorting is enabled or the user is searching, filter choices


      if (this.config.shouldSort || this.isSearching) {
        normalChoices.sort(filter);
      }

      var choiceLimit = rendererableChoices.length;

      // Prepend placeholeder
      var sortedChoices = [].concat(_toConsumableArray(placeholderChoices), _toConsumableArray(normalChoices));

      if (this.isSearching) {
        choiceLimit = searchResultLimit;
      } else if (renderChoiceLimit > 0 && !withinGroup) {
        choiceLimit = renderChoiceLimit;
      }

      // Add each choice to dropdown within range
      for (var i = 0; i < choiceLimit; i += 1) {
        if (sortedChoices[i]) {
          appendChoice(sortedChoices[i]);
        }
      }

      return choicesFragment;
    }

    /**
     * Render items into a DOM fragment and append to items list
     * @param  {Array} items    Items to add to list
     * @param  {DocumentFragment} [fragment] Fragment to add items to (optional)
     * @return
     * @private
     */

  }, {
    key: 'createItemsFragment',
    value: function createItemsFragment(items) {
      var _this3 = this;

      var fragment = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      // Create fragment to add elements to
      var itemListFragment = fragment || document.createDocumentFragment();

      // If sorting is enabled, filter items
      if (this.config.shouldSortItems && !this.isSelectOneElement) {
        items.sort(this.config.sortFn);
      }

      if (this.isTextElement) {
        // Update the value of the hidden input
        this.passedElement.setValue(items);
      } else {
        // Update the options of the hidden input
        this.passedElement.setOptions(items);
      }

      var addItemToFragment = function addItemToFragment(item) {
        // Create new list element
        var listItem = _this3._getTemplate('item', item, _this3.config.removeItemButton);
        // Append it to list
        itemListFragment.appendChild(listItem);
      };

      // Add each list item to list
      items.forEach(function (item) {
        return addItemToFragment(item);
      });

      return itemListFragment;
    }

    /**
     * Render DOM with values
     * @return
     * @private
     */

  }, {
    key: 'render',
    value: function render() {
      this.currentState = this.store.getState();
      var stateChanged = this.currentState.choices !== this.prevState.choices || this.currentState.groups !== this.prevState.groups || this.currentState.items !== this.prevState.items;

      if (!stateChanged) {
        return;
      }

      /* Choices */

      if (this.isSelectElement) {
        // Get active groups/choices
        var activeGroups = this.store.getGroupsFilteredByActive();
        var activeChoices = this.store.getChoicesFilteredByActive();

        var choiceListFragment = document.createDocumentFragment();

        // Clear choices
        this.choiceList.clear();

        // Scroll back to top of choices list
        if (this.config.resetScrollPosition) {
          this.choiceList.scrollTo(0);
        }

        // If we have grouped options
        if (activeGroups.length >= 1 && !this.isSearching) {
          // If we have a placeholder choice along with groups
          var activePlaceholders = activeChoices.filter(function (activeChoice) {
            return activeChoice.placeholder === true && activeChoice.groupId === -1;
          });
          if (activePlaceholders.length >= 1) {
            choiceListFragment = this.createChoicesFragment(activePlaceholders, choiceListFragment);
          }
          choiceListFragment = this.createGroupsFragment(activeGroups, activeChoices, choiceListFragment);
        } else if (activeChoices.length >= 1) {
          choiceListFragment = this.createChoicesFragment(activeChoices, choiceListFragment);
        }

        // If we have choices to show
        if (choiceListFragment.childNodes && choiceListFragment.childNodes.length > 0) {
          var activeItems = this.store.getItemsFilteredByActive();
          var canAddItem = this._canAddItem(activeItems, this.input.getValue());

          // ...and we can select them
          if (canAddItem.response) {
            // ...append them and highlight the first choice
            this.choiceList.append(choiceListFragment);
            this._highlightChoice();
          } else {
            // ...otherwise show a notice
            this.choiceList.append(this._getTemplate('notice', canAddItem.notice));
          }
        } else {
          // Otherwise show a notice
          var dropdownItem = void 0;
          var notice = void 0;

          if (this.isSearching) {
            notice = (0, _utils.isType)('Function', this.config.noResultsText) ? this.config.noResultsText() : this.config.noResultsText;

            dropdownItem = this._getTemplate('notice', notice, 'no-results');
          } else {
            notice = (0, _utils.isType)('Function', this.config.noChoicesText) ? this.config.noChoicesText() : this.config.noChoicesText;

            dropdownItem = this._getTemplate('notice', notice, 'no-choices');
          }

          this.choiceList.append(dropdownItem);
        }
      }

      /* Items */
      if (this.currentState.items !== this.prevState.items) {
        // Get active items (items that can be selected)
        var _activeItems = this.store.getItemsFilteredByActive() || [];
        // Clear list
        this.itemList.clear();

        if (_activeItems.length) {
          // Create a fragment to store our list items
          // (so we don't have to update the DOM for each item)
          var itemListFragment = this.createItemsFragment(_activeItems);

          // If we have items to add, append them
          if (itemListFragment.childNodes) {
            this.itemList.append(itemListFragment);
          }
        }
      }

      this.prevState = this.currentState;
    }

    /**
     * Select item (a selected item can be deleted)
     * @param  {Element} item Element to select
     * @param  {Boolean} [runEvent=true] Whether to trigger 'highlightItem' event
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'highlightItem',
    value: function highlightItem(item) {
      var runEvent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      if (!item) {
        return this;
      }

      var id = item.id,
          _item$groupId = item.groupId,
          groupId = _item$groupId === undefined ? -1 : _item$groupId,
          _item$value = item.value,
          value = _item$value === undefined ? '' : _item$value,
          _item$label = item.label,
          label = _item$label === undefined ? '' : _item$label;

      var group = groupId >= 0 ? this.store.getGroupById(groupId) : null;

      this.store.dispatch((0, _items.highlightItem)(id, true));

      if (runEvent) {
        this.passedElement.triggerEvent(_constants.EVENTS.highlightItem, {
          id: id,
          value: value,
          label: label,
          groupValue: group && group.value ? group.value : null
        });
      }

      return this;
    }

    /**
     * Deselect item
     * @param  {Element} item Element to de-select
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'unhighlightItem',
    value: function unhighlightItem(item) {
      if (!item) {
        return this;
      }

      var id = item.id,
          _item$groupId2 = item.groupId,
          groupId = _item$groupId2 === undefined ? -1 : _item$groupId2,
          _item$value2 = item.value,
          value = _item$value2 === undefined ? '' : _item$value2,
          _item$label2 = item.label,
          label = _item$label2 === undefined ? '' : _item$label2;

      var group = groupId >= 0 ? this.store.getGroupById(groupId) : null;

      this.store.dispatch((0, _items.highlightItem)(id, false));
      this.passedElement.triggerEvent(_constants.EVENTS.highlightItem, {
        id: id,
        value: value,
        label: label,
        groupValue: group && group.value ? group.value : null
      });

      return this;
    }

    /**
     * Highlight items within store
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'highlightAll',
    value: function highlightAll() {
      var _this4 = this;

      var items = this.store.getItems();
      items.forEach(function (item) {
        return _this4.highlightItem(item);
      });
      return this;
    }

    /**
     * Deselect items within store
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'unhighlightAll',
    value: function unhighlightAll() {
      var _this5 = this;

      var items = this.store.getItems();
      items.forEach(function (item) {
        return _this5.unhighlightItem(item);
      });
      return this;
    }

    /**
     * Remove an item from the store by its value
     * @param  {String} value Value to search for
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'removeActiveItemsByValue',
    value: function removeActiveItemsByValue(value) {
      var _this6 = this;

      if (!value) {
        return this;
      }

      var items = this.store.getItemsFilteredByActive();

      items.forEach(function (item) {
        if (item.value === value) {
          _this6._removeItem(item);
        }
      });

      return this;
    }

    /**
     * Remove all items from store array
     * @note Removed items are soft deleted
     * @param  {Number} excludedId Optionally exclude item by ID
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'removeActiveItems',
    value: function removeActiveItems(excludedId) {
      var _this7 = this;

      var items = this.store.getItemsFilteredByActive();

      items.forEach(function (item) {
        if (excludedId !== item.id) {
          _this7._removeItem(item);
        }
      });

      return this;
    }

    /**
     * Remove all selected items from store
     * @note Removed items are soft deleted
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'removeHighlightedItems',
    value: function removeHighlightedItems() {
      var _this8 = this;

      var runEvent = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var items = this.store.getItemsFilteredByHighlighted();

      items.forEach(function (item) {
        _this8._removeItem(item);
        // If this action was performed by the user
        // trigger the event
        if (runEvent) {
          _this8._triggerChange(item.value);
        }
      });

      return this;
    }

    /**
     * Show dropdown to user by adding active state class
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'showDropdown',
    value: function showDropdown(focusInput) {
      if (this.dropdown.isActive) {
        return this;
      }

      this.dropdown.show();
      this.containerOuter.open(this.dropdown.getVerticalPos());

      if (focusInput && this.canSearch) {
        this.input.focus();
      }

      this.passedElement.triggerEvent(_constants.EVENTS.showDropdown, {});

      return this;
    }

    /**
     * Hide dropdown from user
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'hideDropdown',
    value: function hideDropdown(blurInput) {
      if (!this.dropdown.isActive) {
        return this;
      }

      this.dropdown.hide();
      this.containerOuter.close();

      if (blurInput && this.canSearch) {
        this.input.removeActiveDescendant();
        this.input.blur();
      }

      this.passedElement.triggerEvent(_constants.EVENTS.hideDropdown, {});

      return this;
    }

    /**
     * Determine whether to hide or show dropdown based on its current state
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'toggleDropdown',
    value: function toggleDropdown() {
      if (this.dropdown.isActive) {
        this.hideDropdown();
      } else {
        this.showDropdown(true);
      }

      return this;
    }

    /**
     * Get value(s) of input (i.e. inputted items (text) or selected choices (select))
     * @param {Boolean} valueOnly Get only values of selected items, otherwise return selected items
     * @return {Array/String} selected value (select-one) or
     *                        array of selected items (inputs & select-multiple)
     * @public
     */

  }, {
    key: 'getValue',
    value: function getValue() {
      var valueOnly = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var items = this.store.getItemsFilteredByActive();

      var values = items.reduce(function (selectedItems, item) {
        var itemValue = valueOnly ? item.value : item;
        selectedItems.push(itemValue);
        return selectedItems;
      }, []);

      return this.isSelectOneElement ? values[0] : values;
    }

    /**
     * Set value of input. If the input is a select box, a choice will
     * be created and selected otherwise an item will created directly.
     * @param  {Array}   args  Array of value objects or value strings
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'setValue',
    value: function setValue(args) {
      var _this9 = this;

      if (!this.initialised) {
        return this;
      }

      // Convert args to an iterable array
      var values = [].concat(_toConsumableArray(args));
      values.forEach(function (value) {
        return _this9._setChoiceOrItem(value);
      });

      return this;
    }

    /**
     * Select value of select box via the value of an existing choice
     * @param {Array/String} value An array of strings of a single string
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'setChoiceByValue',
    value: function setChoiceByValue(value) {
      var _this10 = this;

      if (!this.initialised || this.isTextElement) {
        return this;
      }

      // If only one value has been passed, convert to array
      var choiceValue = (0, _utils.isType)('Array', value) ? value : [value];

      // Loop through each value and
      choiceValue.forEach(function (val) {
        return _this10._findAndSelectChoiceByValue(val);
      });

      return this;
    }

    /**
     * Direct populate choices
     * @param  {Array} choices - Choices to insert
     * @param  {String} value - Name of 'value' property
     * @param  {String} label - Name of 'label' property
     * @param  {Boolean} replaceChoices Whether existing choices should be removed
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'setChoices',
    value: function setChoices() {
      var choices = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var value = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      var _this11 = this;

      var label = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var replaceChoices = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

      if (!this.isSelectElement || !choices.length || !value) {
        return this;
      }

      // Clear choices if needed
      if (replaceChoices) {
        this._clearChoices();
      }

      this.containerOuter.removeLoadingState();
      var addGroupsAndChoices = function addGroupsAndChoices(groupOrChoice) {
        if (groupOrChoice.choices) {
          _this11._addGroup(groupOrChoice, groupOrChoice.id || null, value, label);
        } else {
          _this11._addChoice(groupOrChoice[value], groupOrChoice[label], groupOrChoice.selected, groupOrChoice.disabled, undefined, groupOrChoice.customProperties, groupOrChoice.placeholder);
        }
      };

      choices.forEach(addGroupsAndChoices);

      return this;
    }

    /**
     * Clear items,choices and groups
     * @note Hard delete
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'clearStore',
    value: function clearStore() {
      this.store.dispatch((0, _misc.clearAll)());
      return this;
    }

    /**
     * Set value of input to blank
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'clearInput',
    value: function clearInput() {
      var shouldSetInputWidth = !this.isSelectOneElement;
      this.input.clear(shouldSetInputWidth);

      if (!this.isTextElement && this.config.searchEnabled) {
        this.isSearching = false;
        this.store.dispatch((0, _choices.activateChoices)(true));
      }

      return this;
    }

    /**
     * Populate options via ajax callback
     * @param  {Function} fn Function that actually makes an AJAX request
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'ajax',
    value: function ajax(fn) {
      var _this12 = this;

      if (!this.initialised || !this.isSelectElement || !fn) {
        return this;
      }

      requestAnimationFrame(function () {
        return _this12._handleLoadingState(true);
      });
      fn(this._ajaxCallback());

      return this;
    }

    /* =====  End of Public functions  ====== */

    /* =============================================
    =                Private functions            =
    ============================================= */

    /**
     * Call change callback
     * @param  {String} value - last added/deleted/selected value
     * @return
     * @private
     */

  }, {
    key: '_triggerChange',
    value: function _triggerChange(value) {
      if (!value) {
        return;
      }

      this.passedElement.triggerEvent(_constants.EVENTS.change, {
        value: value
      });
    }

    /**
    * Select placeholder choice
    */

  }, {
    key: '_selectPlaceholderChoice',
    value: function _selectPlaceholderChoice() {
      var placeholderChoice = this.store.getPlaceholderChoice();

      if (placeholderChoice) {
        this._addItem(placeholderChoice.value, placeholderChoice.label, placeholderChoice.id, placeholderChoice.groupId, null, placeholderChoice.placeholder);
        this._triggerChange(placeholderChoice.value);
      }
    }

    /**
     * Process enter/click of an item button
     * @param {Array} activeItems The currently active items
     * @param  {Element} element Button being interacted with
     * @return
     * @private
     */

  }, {
    key: '_handleButtonAction',
    value: function _handleButtonAction(activeItems, element) {
      if (!activeItems || !element || !this.config.removeItems || !this.config.removeItemButton) {
        return;
      }

      var itemId = element.parentNode.getAttribute('data-id');
      var itemToRemove = activeItems.find(function (item) {
        return item.id === parseInt(itemId, 10);
      });

      // Remove item associated with button
      this._removeItem(itemToRemove);
      this._triggerChange(itemToRemove.value);

      if (this.isSelectOneElement) {
        this._selectPlaceholderChoice();
      }
    }

    /**
     * Process click of an item
     * @param {Array} activeItems The currently active items
     * @param  {Element} element Item being interacted with
     * @param  {Boolean} hasShiftKey Whether the user has the shift key active
     * @return
     * @private
     */

  }, {
    key: '_handleItemAction',
    value: function _handleItemAction(activeItems, element) {
      var _this13 = this;

      var hasShiftKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      if (!activeItems || !element || !this.config.removeItems || this.isSelectOneElement) {
        return;
      }

      var passedId = element.getAttribute('data-id');

      // We only want to select one item with a click
      // so we deselect any items that aren't the target
      // unless shift is being pressed
      activeItems.forEach(function (item) {
        if (item.id === parseInt(passedId, 10) && !item.highlighted) {
          _this13.highlightItem(item);
        } else if (!hasShiftKey && item.highlighted) {
          _this13.unhighlightItem(item);
        }
      });

      // Focus input as without focus, a user cannot do anything with a
      // highlighted item
      this.input.focus();
    }

    /**
     * Process click of a choice
     * @param {Array} activeItems The currently active items
     * @param  {Element} element Choice being interacted with
     * @return
     */

  }, {
    key: '_handleChoiceAction',
    value: function _handleChoiceAction(activeItems, element) {
      if (!activeItems || !element) {
        return;
      }

      // If we are clicking on an option
      var id = element.getAttribute('data-id');
      var choice = this.store.getChoiceById(id);
      var passedKeyCode = activeItems[0] && activeItems[0].keyCode ? activeItems[0].keyCode : null;
      var hasActiveDropdown = this.dropdown.isActive;

      // Update choice keyCode
      choice.keyCode = passedKeyCode;

      this.passedElement.triggerEvent(_constants.EVENTS.choice, {
        choice: choice
      });

      if (choice && !choice.selected && !choice.disabled) {
        var canAddItem = this._canAddItem(activeItems, choice.value);

        if (canAddItem.response) {
          this._addItem(choice.value, choice.label, choice.id, choice.groupId, choice.customProperties, choice.placeholder, choice.keyCode);
          this._triggerChange(choice.value);
        }
      }

      this.clearInput();

      // We wont to close the dropdown if we are dealing with a single select box
      if (hasActiveDropdown && this.isSelectOneElement) {
        this.hideDropdown();
        this.containerOuter.focus();
      }
    }

    /**
     * Process back space event
     * @param  {Array} activeItems items
     * @return
     * @private
     */

  }, {
    key: '_handleBackspace',
    value: function _handleBackspace(activeItems) {
      if (!this.config.removeItems || !activeItems) {
        return;
      }

      var lastItem = activeItems[activeItems.length - 1];
      var hasHighlightedItems = activeItems.some(function (item) {
        return item.highlighted;
      });

      // If editing the last item is allowed and there are not other selected items,
      // we can edit the item value. Otherwise if we can remove items, remove all selected items
      if (this.config.editItems && !hasHighlightedItems && lastItem) {
        this.input.setValue(lastItem.value);
        this.input.setWidth();
        this._removeItem(lastItem);
        this._triggerChange(lastItem.value);
      } else {
        if (!hasHighlightedItems) {
          // Highlight last item if none already highlighted
          this.highlightItem(lastItem, false);
        }
        this.removeHighlightedItems(true);
      }
    }

    /**
     * Apply or remove a loading state to the component.
     * @param {Boolean} isLoading default value set to 'true'.
     * @return
     * @private
     */

  }, {
    key: '_handleLoadingState',
    value: function _handleLoadingState() {
      var isLoading = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      var placeholderItem = this.itemList.getChild('.' + this.config.classNames.placeholder);
      if (isLoading) {
        this.containerOuter.addLoadingState();
        if (this.isSelectOneElement) {
          if (!placeholderItem) {
            placeholderItem = this._getTemplate('placeholder', this.config.loadingText);
            this.itemList.append(placeholderItem);
          } else {
            placeholderItem.innerHTML = this.config.loadingText;
          }
        } else {
          this.input.setPlaceholder(this.config.loadingText);
        }
      } else {
        this.containerOuter.removeLoadingState();

        if (this.isSelectOneElement) {
          placeholderItem.innerHTML = this.placeholder || '';
        } else {
          this.input.setPlaceholder(this.placeholder || '');
        }
      }
    }

    /**
     * Validates whether an item can be added by a user
     * @param {Array} activeItems The currently active items
     * @param  {String} value     Value of item to add
     * @return {Object}           Response: Whether user can add item
     *                            Notice: Notice show in dropdown
     */

  }, {
    key: '_canAddItem',
    value: function _canAddItem(activeItems, value) {
      var canAddItem = true;
      var notice = (0, _utils.isType)('Function', this.config.addItemText) ? this.config.addItemText(value) : this.config.addItemText;

      if (this.isSelectMultipleElement || this.isTextElement) {
        if (this.config.maxItemCount > 0 && this.config.maxItemCount <= activeItems.length) {
          // If there is a max entry limit and we have reached that limit
          // don't update
          canAddItem = false;
          notice = (0, _utils.isType)('Function', this.config.maxItemText) ? this.config.maxItemText(this.config.maxItemCount) : this.config.maxItemText;
        }
      }

      if (this.config.regexFilter && this.isTextElement && this.config.addItems && canAddItem) {
        // If a user has supplied a regular expression filter
        // determine whether we can update based on whether
        // our regular expression passes
        canAddItem = (0, _utils.regexFilter)(value, this.config.regexFilter);
      }

      // If no duplicates are allowed, and the value already exists
      // in the array
      var isUnique = !activeItems.some(function (item) {
        if ((0, _utils.isType)('String', value)) {
          return item.value === value.trim();
        }

        return item.value === value;
      });

      if (!isUnique && !this.config.duplicateItems && !this.isSelectOneElement && canAddItem) {
        canAddItem = false;
        notice = (0, _utils.isType)('Function', this.config.uniqueItemText) ? this.config.uniqueItemText(value) : this.config.uniqueItemText;
      }

      return {
        response: canAddItem,
        notice: notice
      };
    }

    /**
     * Retrieve the callback used to populate component's choices in an async way.
     * @returns {Function} The callback as a function.
     * @private
     */

  }, {
    key: '_ajaxCallback',
    value: function _ajaxCallback() {
      var _this14 = this;

      return function (results, value, label) {
        if (!results || !value) {
          return;
        }

        var parsedResults = (0, _utils.isType)('Object', results) ? [results] : results;

        if (parsedResults && (0, _utils.isType)('Array', parsedResults) && parsedResults.length) {
          // Remove loading states/text
          _this14._handleLoadingState(false);
          // Add each result as a choice
          parsedResults.forEach(function (result) {
            if (result.choices) {
              var groupId = result.id || null;
              _this14._addGroup(result, groupId, value, label);
            } else {
              _this14._addChoice(result[value], result[label], result.selected, result.disabled, undefined, result.customProperties, result.placeholder);
            }
          });

          if (_this14.isSelectOneElement) {
            _this14._selectPlaceholderChoice();
          }
        } else {
          // No results, remove loading state
          _this14._handleLoadingState(false);
        }
      };
    }

    /**
     * Filter choices based on search value
     * @param  {String} value Value to filter by
     * @return
     * @private
     */

  }, {
    key: '_searchChoices',
    value: function _searchChoices(value) {
      var newValue = (0, _utils.isType)('String', value) ? value.trim() : value;
      var currentValue = (0, _utils.isType)('String', this.currentValue) ? this.currentValue.trim() : this.currentValue;

      if (newValue.length < 1 && newValue === currentValue + ' ') {
        return 0;
      }

      // If new value matches the desired length and is not the same as the current value with a space
      var haystack = this.store.getSearchableChoices();
      var needle = newValue;
      var keys = (0, _utils.isType)('Array', this.config.searchFields) ? this.config.searchFields : [this.config.searchFields];
      var options = Object.assign(this.config.fuseOptions, { keys: keys });
      var fuse = new _fuse2.default(haystack, options);
      var results = fuse.search(needle);

      this.currentValue = newValue;
      this.highlightPosition = 0;
      this.isSearching = true;
      this.store.dispatch((0, _choices.filterChoices)(results));

      return results.length;
    }

    /**
     * Determine the action when a user is searching
     * @param  {String} value Value entered by user
     * @return
     * @private
     */

  }, {
    key: '_handleSearch',
    value: function _handleSearch(value) {
      if (!value || !this.input.isFocussed) {
        return;
      }

      var choices = this.store.getChoices();
      var hasUnactiveChoices = choices.some(function (option) {
        return !option.active;
      });

      // Check that we have a value to search and the input was an alphanumeric character
      if (value && value.length >= this.config.searchFloor) {
        var resultCount = this.config.searchChoices ? this._searchChoices(value) : 0;
        // Trigger search event
        this.passedElement.triggerEvent(_constants.EVENTS.search, {
          value: value,
          resultCount: resultCount
        });
      } else if (hasUnactiveChoices) {
        // Otherwise reset choices to active
        this.isSearching = false;
        this.store.dispatch((0, _choices.activateChoices)(true));
      }
    }

    /**
     * Trigger event listeners
     * @return
     * @private
     */

  }, {
    key: '_addEventListeners',
    value: function _addEventListeners() {
      document.addEventListener('keyup', this._onKeyUp);
      document.addEventListener('keydown', this._onKeyDown);
      document.addEventListener('click', this._onClick);
      document.addEventListener('touchmove', this._onTouchMove);
      document.addEventListener('touchend', this._onTouchEnd);
      document.addEventListener('mousedown', this._onMouseDown);
      document.addEventListener('mouseover', this._onMouseOver);

      if (this.isSelectOneElement) {
        this.containerOuter.element.addEventListener('focus', this._onFocus);
        this.containerOuter.element.addEventListener('blur', this._onBlur);
      }

      this.input.element.addEventListener('focus', this._onFocus);
      this.input.element.addEventListener('blur', this._onBlur);

      this.input.addEventListeners();
    }

    /**
     * Remove event listeners
     * @return
     * @private
     */

  }, {
    key: '_removeEventListeners',
    value: function _removeEventListeners() {
      document.removeEventListener('keyup', this._onKeyUp);
      document.removeEventListener('keydown', this._onKeyDown);
      document.removeEventListener('click', this._onClick);
      document.removeEventListener('touchmove', this._onTouchMove);
      document.removeEventListener('touchend', this._onTouchEnd);
      document.removeEventListener('mousedown', this._onMouseDown);
      document.removeEventListener('mouseover', this._onMouseOver);

      if (this.isSelectOneElement) {
        this.containerOuter.element.removeEventListener('focus', this._onFocus);
        this.containerOuter.element.removeEventListener('blur', this._onBlur);
      }

      this.input.element.removeEventListener('focus', this._onFocus);
      this.input.element.removeEventListener('blur', this._onBlur);

      this.input.removeEventListeners();
    }

    /**
     * Key down event
     * @param  {Object} e Event
     * @return
     */

  }, {
    key: '_onKeyDown',
    value: function _onKeyDown(e) {
      var _this15 = this,
          _keyDownActions;

      if (e.target !== this.input.element && !this.containerOuter.element.contains(e.target)) {
        return;
      }

      var target = e.target;
      var activeItems = this.store.getItemsFilteredByActive();
      var hasFocusedInput = this.input.isFocussed;
      var hasActiveDropdown = this.dropdown.isActive;
      var hasItems = this.itemList.hasChildren;
      var keyString = String.fromCharCode(e.keyCode);
      var backKey = _constants.KEY_CODES.BACK_KEY;
      var deleteKey = _constants.KEY_CODES.DELETE_KEY;
      var enterKey = _constants.KEY_CODES.ENTER_KEY;
      var aKey = _constants.KEY_CODES.A_KEY;
      var escapeKey = _constants.KEY_CODES.ESC_KEY;
      var upKey = _constants.KEY_CODES.UP_KEY;
      var downKey = _constants.KEY_CODES.DOWN_KEY;
      var pageUpKey = _constants.KEY_CODES.PAGE_UP_KEY;
      var pageDownKey = _constants.KEY_CODES.PAGE_DOWN_KEY;
      var ctrlDownKey = e.ctrlKey || e.metaKey;

      // If a user is typing and the dropdown is not active
      if (!this.isTextElement && /[a-zA-Z0-9-_ ]/.test(keyString)) {
        this.showDropdown(true);
      }

      this.canSearch = this.config.searchEnabled;

      var onAKey = function onAKey() {
        // If CTRL + A or CMD + A have been pressed and there are items to select
        if (ctrlDownKey && hasItems) {
          _this15.canSearch = false;
          if (_this15.config.removeItems && !_this15.input.getValue() && _this15.input.element === document.activeElement) {
            // Highlight items
            _this15.highlightAll();
          }
        }
      };

      var onEnterKey = function onEnterKey() {
        // If enter key is pressed and the input has a value
        if (_this15.isTextElement && target.value) {
          var value = _this15.input.getValue();
          var canAddItem = _this15._canAddItem(activeItems, value);

          // All is good, add
          if (canAddItem.response) {
            _this15.hideDropdown();
            _this15._addItem(value);
            _this15._triggerChange(value);
            _this15.clearInput();
          }
        }

        if (target.hasAttribute('data-button')) {
          _this15._handleButtonAction(activeItems, target);
          e.preventDefault();
        }

        if (hasActiveDropdown) {
          e.preventDefault();
          var highlighted = _this15.dropdown.getChild('.' + _this15.config.classNames.highlightedState);

          // If we have a highlighted choice
          if (highlighted) {
            // add enter keyCode value
            if (activeItems[0]) {
              activeItems[0].keyCode = enterKey;
            }
            _this15._handleChoiceAction(activeItems, highlighted);
          }
        } else if (_this15.isSelectOneElement) {
          // Open single select dropdown if it's not active
          _this15.showDropdown(true);
          e.preventDefault();
        }
      };

      var onEscapeKey = function onEscapeKey() {
        if (hasActiveDropdown) {
          _this15.hideDropdown();
          _this15.containerOuter.focus();
        }
      };

      var onDirectionKey = function onDirectionKey() {
        // If up or down key is pressed, traverse through options
        if (hasActiveDropdown || _this15.isSelectOneElement) {
          // Show dropdown if focus
          _this15.showDropdown(true);

          _this15.canSearch = false;

          var directionInt = e.keyCode === downKey || e.keyCode === pageDownKey ? 1 : -1;
          var skipKey = e.metaKey || e.keyCode === pageDownKey || e.keyCode === pageUpKey;

          var nextEl = void 0;
          if (skipKey) {
            if (directionInt > 0) {
              nextEl = Array.from(_this15.dropdown.element.querySelectorAll('[data-choice-selectable]')).pop();
            } else {
              nextEl = _this15.dropdown.element.querySelector('[data-choice-selectable]');
            }
          } else {
            var currentEl = _this15.dropdown.element.querySelector('.' + _this15.config.classNames.highlightedState);
            if (currentEl) {
              nextEl = (0, _utils.getAdjacentEl)(currentEl, '[data-choice-selectable]', directionInt);
            } else {
              nextEl = _this15.dropdown.element.querySelector('[data-choice-selectable]');
            }
          }

          if (nextEl) {
            // We prevent default to stop the cursor moving
            // when pressing the arrow
            if (!(0, _utils.isScrolledIntoView)(nextEl, _this15.choiceList.element, directionInt)) {
              _this15._scrollToChoice(nextEl, directionInt);
            }
            _this15._highlightChoice(nextEl);
          }

          // Prevent default to maintain cursor position whilst
          // traversing dropdown options
          e.preventDefault();
        }
      };

      var onDeleteKey = function onDeleteKey() {
        // If backspace or delete key is pressed and the input has no value
        if (hasFocusedInput && !e.target.value && !_this15.isSelectOneElement) {
          _this15._handleBackspace(activeItems);
          e.preventDefault();
        }
      };

      // Map keys to key actions
      var keyDownActions = (_keyDownActions = {}, _defineProperty(_keyDownActions, aKey, onAKey), _defineProperty(_keyDownActions, enterKey, onEnterKey), _defineProperty(_keyDownActions, escapeKey, onEscapeKey), _defineProperty(_keyDownActions, upKey, onDirectionKey), _defineProperty(_keyDownActions, pageUpKey, onDirectionKey), _defineProperty(_keyDownActions, downKey, onDirectionKey), _defineProperty(_keyDownActions, pageDownKey, onDirectionKey), _defineProperty(_keyDownActions, deleteKey, onDeleteKey), _defineProperty(_keyDownActions, backKey, onDeleteKey), _keyDownActions);

      // If keycode has a function, run it
      if (keyDownActions[e.keyCode]) {
        keyDownActions[e.keyCode]();
      }
    }

    /**
     * Key up event
     * @param  {Object} e Event
     * @return
     * @private
     */

  }, {
    key: '_onKeyUp',
    value: function _onKeyUp(e) {
      if (e.target !== this.input.element) {
        return;
      }

      var value = this.input.getValue();
      var activeItems = this.store.getItemsFilteredByActive();
      var canAddItem = this._canAddItem(activeItems, value);

      // We are typing into a text input and have a value, we want to show a dropdown
      // notice. Otherwise hide the dropdown
      if (this.isTextElement) {
        if (value) {
          if (canAddItem.notice) {
            var dropdownItem = this._getTemplate('notice', canAddItem.notice);
            this.dropdown.element.innerHTML = dropdownItem.outerHTML;
          }

          if (canAddItem.response === true) {
            this.showDropdown();
          } else if (!canAddItem.notice) {
            this.hideDropdown();
          }
        } else {
          this.hideDropdown();
        }
      } else {
        var backKey = _constants.KEY_CODES.BACK_KEY;
        var deleteKey = _constants.KEY_CODES.DELETE_KEY;

        // If user has removed value...
        if ((e.keyCode === backKey || e.keyCode === deleteKey) && !e.target.value) {
          // ...and it is a multiple select input, activate choices (if searching)
          if (!this.isTextElement && this.isSearching) {
            this.isSearching = false;
            this.store.dispatch((0, _choices.activateChoices)(true));
          }
        } else if (this.canSearch && canAddItem.response) {
          this._handleSearch(this.input.getValue());
        }
      }
      // Re-establish canSearch value from changes in _onKeyDown
      this.canSearch = this.config.searchEnabled;
    }

    /**
     * Touch move event
     * @return
     * @private
     */

  }, {
    key: '_onTouchMove',
    value: function _onTouchMove() {
      if (this.wasTap === true) {
        this.wasTap = false;
      }
    }

    /**
     * Touch end event
     * @param  {Object} e Event
     * @return
     * @private
     */

  }, {
    key: '_onTouchEnd',
    value: function _onTouchEnd(e) {
      var target = e.target || e.touches[0].target;

      // If a user tapped within our container...
      if (this.wasTap === true && this.containerOuter.element.contains(target)) {
        // ...and we aren't dealing with a single select box, show dropdown/focus input
        if ((target === this.containerOuter.element || target === this.containerInner.element) && !this.isSelectOneElement) {
          if (this.isTextElement) {
            // If text element, we only want to focus the input
            this.input.focus();
          } else {
            // If a select box, we want to show the dropdown
            this.showDropdown(true);
          }
        }
        // Prevents focus event firing
        e.stopPropagation();
      }

      this.wasTap = true;
    }

    /**
     * Mouse down event
     * @param  {Object} e Event
     * @return
     * @private
     */

  }, {
    key: '_onMouseDown',
    value: function _onMouseDown(e) {
      var target = e.target;

      // If we have our mouse down on the scrollbar and are on IE11...
      if (target === this.choiceList && this.isIe11) {
        this.isScrollingOnIe = true;
      }

      if (this.containerOuter.element.contains(target) && target !== this.input.element) {
        var activeItems = this.store.getItemsFilteredByActive();
        var hasShiftKey = e.shiftKey;

        var buttonTarget = (0, _utils.findAncestorByAttrName)(target, 'data-button');
        var itemTarget = (0, _utils.findAncestorByAttrName)(target, 'data-item');
        var choiceTarget = (0, _utils.findAncestorByAttrName)(target, 'data-choice');

        if (buttonTarget) {
          this._handleButtonAction(activeItems, buttonTarget);
        } else if (itemTarget) {
          this._handleItemAction(activeItems, itemTarget, hasShiftKey);
        } else if (choiceTarget) {
          this._handleChoiceAction(activeItems, choiceTarget);
        }

        e.preventDefault();
      }
    }

    /**
    * Mouse over (hover) event
    * @param  {Object} e Event
    * @return
    * @private
    */

  }, {
    key: '_onMouseOver',
    value: function _onMouseOver(e) {
      // If the dropdown is either the target or one of its children is the target
      var targetWithinDropdown = e.target === this.dropdown || this.dropdown.element.contains(e.target);
      var shouldHighlightChoice = targetWithinDropdown && e.target.hasAttribute('data-choice');

      if (shouldHighlightChoice) {
        this._highlightChoice(e.target);
      }
    }

    /**
     * Click event
     * @param  {Object} e Event
     * @return
     * @private
     */

  }, {
    key: '_onClick',
    value: function _onClick(e) {
      var target = e.target;
      var hasActiveDropdown = this.dropdown.isActive;
      var activeItems = this.store.getItemsFilteredByActive();

      // If target is something that concerns us
      if (this.containerOuter.element.contains(target)) {
        if (!hasActiveDropdown) {
          if (this.isTextElement) {
            if (document.activeElement !== this.input.element) {
              this.input.focus();
            }
          } else if (this.canSearch) {
            this.showDropdown(true);
          } else {
            this.showDropdown();
            // code smell
            this.containerOuter.focus();
          }
        } else if (this.isSelectOneElement && target !== this.input.element && !this.dropdown.element.contains(target)) {
          this.hideDropdown(true);
        }
      } else {
        var hasHighlightedItems = activeItems.some(function (item) {
          return item.highlighted;
        });

        // De-select any highlighted items
        if (hasHighlightedItems) {
          this.unhighlightAll();
        }

        // Remove focus state
        this.containerOuter.removeFocusState();

        // Close all other dropdowns
        this.hideDropdown();
      }
    }

    /**
     * Focus event
     * @param  {Object} e Event
     * @return
     * @private
     */

  }, {
    key: '_onFocus',
    value: function _onFocus(e) {
      var _this16 = this;

      var target = e.target;
      if (!this.containerOuter.element.contains(target)) {
        return;
      }

      var focusActions = {
        text: function text() {
          if (target === _this16.input.element) {
            _this16.containerOuter.addFocusState();
          }
        },
        'select-one': function selectOne() {
          _this16.containerOuter.addFocusState();
          if (target === _this16.input.element) {
            // Show dropdown if it isn't already showing
            _this16.showDropdown();
          }
        },
        'select-multiple': function selectMultiple() {
          if (target === _this16.input.element) {
            // If element is a select box, the focused element is the container and the dropdown
            // isn't already open, focus and show dropdown
            _this16.containerOuter.addFocusState();
            _this16.showDropdown(true);
          }
        }
      };

      focusActions[this.passedElement.element.type]();
    }

    /**
     * Blur event
     * @param  {Object} e Event
     * @return
     * @private
     */

  }, {
    key: '_onBlur',
    value: function _onBlur(e) {
      var _this17 = this;

      var target = e.target;
      // If target is something that concerns us
      if (this.containerOuter.element.contains(target) && !this.isScrollingOnIe) {
        var activeItems = this.store.getItemsFilteredByActive();
        var hasHighlightedItems = activeItems.some(function (item) {
          return item.highlighted;
        });
        var blurActions = {
          text: function text() {
            if (target === _this17.input.element) {
              // Remove the focus state
              _this17.containerOuter.removeFocusState();
              // De-select any highlighted items
              if (hasHighlightedItems) {
                _this17.unhighlightAll();
              }
              _this17.hideDropdown();
            }
          },
          'select-one': function selectOne() {
            _this17.containerOuter.removeFocusState();
            if (target === _this17.input.element || target === _this17.containerOuter.element && !_this17.canSearch) {
              _this17.hideDropdown();
            }
          },
          'select-multiple': function selectMultiple() {
            if (target === _this17.input.element) {
              // Remove the focus state
              _this17.containerOuter.removeFocusState();
              _this17.hideDropdown();
              // De-select any highlighted items
              if (hasHighlightedItems) {
                _this17.unhighlightAll();
              }
            }
          }
        };

        blurActions[this.passedElement.element.type]();
      } else {
        // On IE11, clicking the scollbar blurs our input and thus
        // closes the dropdown. To stop this, we refocus our input
        // if we know we are on IE *and* are scrolling.
        this.isScrollingOnIe = false;
        this.input.element.focus();
      }
    }

    /**
     * Scroll to an option element
     * @param  {HTMLElement} choice  Option to scroll to
     * @param  {Number} direction  Whether option is above or below
     * @return
     * @private
     */

  }, {
    key: '_scrollToChoice',
    value: function _scrollToChoice(choice, direction) {
      var _this18 = this;

      if (!choice) {
        return;
      }

      var dropdownHeight = this.choiceList.element.offsetHeight;
      var choiceHeight = choice.offsetHeight;
      // Distance from bottom of element to top of parent
      var choicePos = choice.offsetTop + choiceHeight;
      // Scroll position of dropdown
      var containerScrollPos = this.choiceList.element.scrollTop + dropdownHeight;
      // Difference between the choice and scroll position
      var endPoint = direction > 0 ? this.choiceList.element.scrollTop + choicePos - containerScrollPos : choice.offsetTop;

      var animateScroll = function animateScroll() {
        var strength = _constants.SCROLLING_SPEED;
        var choiceListScrollTop = _this18.choiceList.element.scrollTop;
        var continueAnimation = false;
        var easing = void 0;
        var distance = void 0;

        if (direction > 0) {
          easing = (endPoint - choiceListScrollTop) / strength;
          distance = easing > 1 ? easing : 1;

          _this18.choiceList.scrollTo(choiceListScrollTop + distance);
          if (choiceListScrollTop < endPoint) {
            continueAnimation = true;
          }
        } else {
          easing = (choiceListScrollTop - endPoint) / strength;
          distance = easing > 1 ? easing : 1;

          _this18.choiceList.scrollTo(choiceListScrollTop - distance);
          if (choiceListScrollTop > endPoint) {
            continueAnimation = true;
          }
        }

        if (continueAnimation) {
          requestAnimationFrame(function (time) {
            animateScroll(time, endPoint, direction);
          });
        }
      };

      requestAnimationFrame(function (time) {
        animateScroll(time, endPoint, direction);
      });
    }

    /**
     * Highlight choice
     * @param  {HTMLElement} [el] Element to highlight
     * @return
     * @private
     */

  }, {
    key: '_highlightChoice',
    value: function _highlightChoice() {
      var _this19 = this;

      var el = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      // Highlight first element in dropdown
      var choices = Array.from(this.dropdown.element.querySelectorAll('[data-choice-selectable]'));

      if (!choices.length) {
        return;
      }

      var passedEl = el;
      var highlightedChoices = Array.from(this.dropdown.element.querySelectorAll('.' + this.config.classNames.highlightedState));
      var hasActiveDropdown = this.dropdown.isActive;

      // Remove any highlighted choices
      highlightedChoices.forEach(function (choice) {
        choice.classList.remove(_this19.config.classNames.highlightedState);
        choice.setAttribute('aria-selected', 'false');
      });

      if (passedEl) {
        this.highlightPosition = choices.indexOf(passedEl);
      } else {
        // Highlight choice based on last known highlight location
        if (choices.length > this.highlightPosition) {
          // If we have an option to highlight
          passedEl = choices[this.highlightPosition];
        } else {
          // Otherwise highlight the option before
          passedEl = choices[choices.length - 1];
        }

        if (!passedEl) {
          passedEl = choices[0];
        }
      }

      // Highlight given option, and set accessiblity attributes
      passedEl.classList.add(this.config.classNames.highlightedState);
      passedEl.setAttribute('aria-selected', 'true');

      if (hasActiveDropdown) {
        // IE11 ignores aria-label and blocks virtual keyboard
        // if aria-activedescendant is set without a dropdown
        this.input.setActiveDescendant(passedEl.id);
        this.containerOuter.setActiveDescendant(passedEl.id);
      }
    }

    /**
     * Add item to store with correct value
     * @param {String} value Value to add to store
     * @param {String} [label] Label to add to store
     * @param {Number} [choiceId=-1] ID of the associated choice that was selected
     * @param {Number} [groupId=-1] ID of group choice is within. Negative number indicates no group
     * @param {Object} [customProperties] Object containing user defined properties
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: '_addItem',
    value: function _addItem(value) {
      var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var choiceId = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -1;
      var groupId = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : -1;
      var customProperties = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;
      var placeholder = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
      var keyCode = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;

      var passedValue = (0, _utils.isType)('String', value) ? value.trim() : value;
      var passedKeyCode = keyCode;
      var items = this.store.getItems();
      var passedLabel = label || passedValue;
      var passedOptionId = parseInt(choiceId, 10) || -1;

      // Get group if group ID passed
      var group = groupId >= 0 ? this.store.getGroupById(groupId) : null;

      // Generate unique id
      var id = items ? items.length + 1 : 1;

      // If a prepended value has been passed, prepend it
      if (this.config.prependValue) {
        passedValue = this.config.prependValue + passedValue.toString();
      }

      // If an appended value has been passed, append it
      if (this.config.appendValue) {
        passedValue += this.config.appendValue.toString();
      }

      this.store.dispatch((0, _items.addItem)(passedValue, passedLabel, id, passedOptionId, groupId, customProperties, placeholder, passedKeyCode));

      if (this.isSelectOneElement) {
        this.removeActiveItems(id);
      }

      // Trigger change event
      if (group && group.value) {
        this.passedElement.triggerEvent(_constants.EVENTS.addItem, {
          id: id,
          value: passedValue,
          label: passedLabel,
          groupValue: group.value,
          keyCode: passedKeyCode
        });
      } else {
        this.passedElement.triggerEvent(_constants.EVENTS.addItem, {
          id: id,
          value: passedValue,
          label: passedLabel,
          keyCode: passedKeyCode
        });
      }

      return this;
    }

    /**
     * Remove item from store
     * @param {Object} item Item to remove
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: '_removeItem',
    value: function _removeItem(item) {
      if (!item || !(0, _utils.isType)('Object', item)) {
        return this;
      }

      var id = item.id,
          value = item.value,
          label = item.label,
          choiceId = item.choiceId,
          groupId = item.groupId;

      var group = groupId >= 0 ? this.store.getGroupById(groupId) : null;

      this.store.dispatch((0, _items.removeItem)(id, choiceId));

      if (group && group.value) {
        this.passedElement.triggerEvent(_constants.EVENTS.removeItem, {
          id: id,
          value: value,
          label: label,
          groupValue: group.value
        });
      } else {
        this.passedElement.triggerEvent(_constants.EVENTS.removeItem, {
          id: id,
          value: value,
          label: label
        });
      }

      return this;
    }

    /**
     * Add choice to dropdown
     * @param {String} value Value of choice
     * @param {String} [label] Label of choice
     * @param {Boolean} [isSelected=false] Whether choice is selected
     * @param {Boolean} [isDisabled=false] Whether choice is disabled
     * @param {Number} [groupId=-1] ID of group choice is within. Negative number indicates no group
     * @param {Object} [customProperties] Object containing user defined properties
     * @return
     * @private
     */

  }, {
    key: '_addChoice',
    value: function _addChoice(value) {
      var label = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var isSelected = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var isDisabled = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
      var groupId = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -1;
      var customProperties = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
      var placeholder = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
      var keyCode = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : null;

      if (typeof value === 'undefined' || value === null) {
        return;
      }

      // Generate unique id
      var choices = this.store.getChoices();
      var choiceLabel = label || value;
      var choiceId = choices ? choices.length + 1 : 1;
      var choiceElementId = this.baseId + '-' + this.idNames.itemChoice + '-' + choiceId;

      this.store.dispatch((0, _choices.addChoice)(value, choiceLabel, choiceId, groupId, isDisabled, choiceElementId, customProperties, placeholder, keyCode));

      if (isSelected) {
        this._addItem(value, choiceLabel, choiceId, undefined, customProperties, placeholder, keyCode);
      }
    }

    /**
     * Clear all choices added to the store.
     * @return
     * @private
     */

  }, {
    key: '_clearChoices',
    value: function _clearChoices() {
      this.store.dispatch((0, _choices.clearChoices)());
    }

    /**
     * Add group to dropdown
     * @param {Object} group Group to add
     * @param {Number} id Group ID
     * @param {String} [valueKey] name of the value property on the object
     * @param {String} [labelKey] name of the label property on the object
     * @return
     * @private
     */

  }, {
    key: '_addGroup',
    value: function _addGroup(group, id) {
      var _this20 = this;

      var valueKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'value';
      var labelKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'label';

      var groupChoices = (0, _utils.isType)('Object', group) ? group.choices : Array.from(group.getElementsByTagName('OPTION'));
      var groupId = id || Math.floor(new Date().valueOf() * Math.random());
      var isDisabled = group.disabled ? group.disabled : false;

      if (groupChoices) {
        this.store.dispatch((0, _groups.addGroup)(group.label, groupId, true, isDisabled));

        var addGroupChoices = function addGroupChoices(choice) {
          var isOptDisabled = choice.disabled || choice.parentNode && choice.parentNode.disabled;
          _this20._addChoice(choice[valueKey], (0, _utils.isType)('Object', choice) ? choice[labelKey] : choice.innerHTML, choice.selected, isOptDisabled, groupId, choice.customProperties, choice.placeholder);
        };

        groupChoices.forEach(addGroupChoices);
      } else {
        this.store.dispatch((0, _groups.addGroup)(group.label, group.id, false, group.disabled));
      }
    }

    /**
     * Get template from name
     * @param  {String}    template Name of template to get
     * @param  {...}       args     Data to pass to template
     * @return {HTMLElement}        Template
     * @private
     */

  }, {
    key: '_getTemplate',
    value: function _getTemplate(template) {
      var _templates$template;

      if (!template) {
        return null;
      }
      var templates = this.config.templates;
      var globalClasses = this.config.classNames;

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      return (_templates$template = templates[template]).call.apply(_templates$template, [this, globalClasses].concat(args));
    }

    /**
     * Create HTML element based on type and arguments
     * @return
     * @private
     */

  }, {
    key: '_createTemplates',
    value: function _createTemplates() {
      // User's custom templates
      var callbackTemplate = this.config.callbackOnCreateTemplates;
      var userTemplates = {};
      if (callbackTemplate && (0, _utils.isType)('Function', callbackTemplate)) {
        userTemplates = callbackTemplate.call(this, _utils.strToEl);
      }

      this.config.templates = (0, _utils.extend)(_templates.TEMPLATES, userTemplates);
    }

    /**
     * Create DOM structure around passed select element
     * @return
     * @private
     */

  }, {
    key: '_createStructure',
    value: function _createStructure() {
      var direction = this.passedElement.element.getAttribute('dir') || 'ltr';
      var containerOuter = this._getTemplate('containerOuter', direction, this.isSelectElement, this.isSelectOneElement, this.config.searchEnabled, this.passedElement.element.type);
      var containerInner = this._getTemplate('containerInner');
      var itemList = this._getTemplate('itemList', this.isSelectOneElement);
      var choiceList = this._getTemplate('choiceList', this.isSelectOneElement);
      var input = this._getTemplate('input');
      var dropdown = this._getTemplate('dropdown');

      this.containerOuter = new _container2.default(this, containerOuter, this.config.classNames);
      this.containerInner = new _container2.default(this, containerInner, this.config.classNames);
      this.input = new _input2.default(this, input, this.config.classNames);
      this.choiceList = new _list2.default(this, choiceList, this.config.classNames);
      this.itemList = new _list2.default(this, itemList, this.config.classNames);
      this.dropdown = new _dropdown2.default(this, dropdown, this.config.classNames);

      this.passedElement.conceal();

      // Wrap input in container preserving DOM ordering
      this.containerInner.wrap(this.passedElement.element);
      // Wrapper inner container with outer container
      this.containerOuter.wrap(this.containerInner.element);

      if (this.isSelectOneElement) {
        this.input.setPlaceholder(this.config.searchPlaceholderValue || '');
      } else if (this.placeholder) {
        this.input.setPlaceholder(this.placeholder);
        this.input.setWidth(true);
      }

      if (!this.config.addItems) {
        this.disable();
      }

      this.containerOuter.element.appendChild(this.containerInner.element);
      this.containerOuter.element.appendChild(this.dropdown.element);
      this.containerInner.element.appendChild(itemList);

      if (!this.isTextElement) {
        dropdown.appendChild(choiceList);
      }

      if (!this.isSelectOneElement) {
        this.containerInner.element.appendChild(this.input.element);
      } else if (this.canSearch) {
        dropdown.insertBefore(input, dropdown.firstChild);
      }

      if (this.isSelectElement) {
        this._addPredefinedChoices();
      } else if (this.isTextElement) {
        this._addPredefinedItems();
      }
    }
  }, {
    key: '_addPredefinedChoices',
    value: function _addPredefinedChoices() {
      var _this21 = this;

      var passedGroups = this.passedElement.getOptionGroups();

      this.highlightPosition = 0;
      this.isSearching = false;

      if (passedGroups && passedGroups.length) {
        // If we have a placeholder option
        var placeholderChoice = this.passedElement.getPlaceholderOption();
        if (placeholderChoice && placeholderChoice.parentNode.tagName === 'SELECT') {
          this._addChoice(placeholderChoice.value, placeholderChoice.innerHTML, placeholderChoice.selected, placeholderChoice.disabled, undefined, undefined,
          /* placeholder */true);
        }

        passedGroups.forEach(function (group) {
          _this21._addGroup(group, group.id || null);
        });
      } else {
        var passedOptions = this.passedElement.getOptions();
        var filter = this.config.sortFn;
        var allChoices = this.presetChoices;

        // Create array of options from option elements
        passedOptions.forEach(function (o) {
          allChoices.push({
            value: o.value,
            label: o.innerHTML,
            selected: o.selected,
            disabled: o.disabled || o.parentNode.disabled,
            placeholder: o.hasAttribute('placeholder')
          });
        });

        // If sorting is enabled or the user is searching, filter choices
        if (this.config.shouldSort) {
          allChoices.sort(filter);
        }

        // Determine whether there is a selected choice
        var hasSelectedChoice = allChoices.some(function (choice) {
          return choice.selected;
        });
        var handleChoice = function handleChoice(choice, index) {
          if (_this21.isSelectElement) {
            // If the choice is actually a group
            if (choice.choices) {
              _this21._addGroup(choice, choice.id || null);
            } else {
              // If there is a selected choice already or the choice is not
              // the first in the array, add each choice normally
              // Otherwise pre-select the first choice in the array if it's a single select
              var shouldPreselect = _this21.isSelectOneElement && !hasSelectedChoice && index === 0;
              var isSelected = shouldPreselect ? true : choice.selected;
              var isDisabled = shouldPreselect ? false : choice.disabled;

              _this21._addChoice(choice.value, choice.label, isSelected, isDisabled, undefined, choice.customProperties, choice.placeholder);
            }
          } else {
            _this21._addChoice(choice.value, choice.label, choice.selected, choice.disabled, undefined, choice.customProperties, choice.placeholder);
          }
        };

        // Add each choice
        allChoices.forEach(function (choice, index) {
          return handleChoice(choice, index);
        });
      }
    }
  }, {
    key: '_addPredefinedItems',
    value: function _addPredefinedItems() {
      var _this22 = this;

      var handlePresetItem = function handlePresetItem(item) {
        var itemType = (0, _utils.getType)(item);
        if (itemType === 'Object') {
          if (!item.value) {
            return;
          }
          _this22._addItem(item.value, item.label, item.id, undefined, item.customProperties, item.placeholder);
        } else if (itemType === 'String') {
          _this22._addItem(item);
        }
      };

      this.presetItems.forEach(function (item) {
        return handlePresetItem(item);
      });
    }
  }, {
    key: '_setChoiceOrItem',
    value: function _setChoiceOrItem(item) {
      var _this23 = this;

      var itemType = (0, _utils.getType)(item).toLowerCase();
      var handleType = {
        object: function object() {
          if (!item.value) {
            return;
          }

          // If we are dealing with a select input, we need to create an option first
          // that is then selected. For text inputs we can just add items normally.
          if (!_this23.isTextElement) {
            _this23._addChoice(item.value, item.label, true, false, -1, item.customProperties, item.placeholder);
          } else {
            _this23._addItem(item.value, item.label, item.id, undefined, item.customProperties, item.placeholder);
          }
        },
        string: function string() {
          if (!_this23.isTextElement) {
            _this23._addChoice(item, item, true, false, -1, null);
          } else {
            _this23._addItem(item);
          }
        }
      };

      handleType[itemType]();
    }
  }, {
    key: '_findAndSelectChoiceByValue',
    value: function _findAndSelectChoiceByValue(val) {
      var choices = this.store.getChoices();
      // Check 'value' property exists and the choice isn't already selected
      var foundChoice = choices.find(function (choice) {
        return choice.value === val;
      });

      if (foundChoice && !foundChoice.selected) {
        this._addItem(foundChoice.value, foundChoice.label, foundChoice.id, foundChoice.groupId, foundChoice.customProperties, foundChoice.placeholder, foundChoice.keyCode);
      }
    }

    /* =====  End of Private functions  ====== */

  }]);

  return Choices;
}();

Choices.userDefaults = {};

// We cannot export default here due to Webpack: https://github.com/webpack/webpack/issues/3929
module.exports = Choices;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*!
 * Fuse.js v3.2.0 - Lightweight fuzzy-search (http://fusejs.io)
 * 
 * Copyright (c) 2012-2017 Kirollos Risk (http://kiro.me)
 * All Rights Reserved. Apache Software License 2.0
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Fuse", [], factory);
	else if(typeof exports === 'object')
		exports["Fuse"] = factory();
	else
		root["Fuse"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (obj) {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var bitapRegexSearch = __webpack_require__(5);
var bitapSearch = __webpack_require__(7);
var patternAlphabet = __webpack_require__(4);

var Bitap = function () {
  function Bitap(pattern, _ref) {
    var _ref$location = _ref.location,
        location = _ref$location === undefined ? 0 : _ref$location,
        _ref$distance = _ref.distance,
        distance = _ref$distance === undefined ? 100 : _ref$distance,
        _ref$threshold = _ref.threshold,
        threshold = _ref$threshold === undefined ? 0.6 : _ref$threshold,
        _ref$maxPatternLength = _ref.maxPatternLength,
        maxPatternLength = _ref$maxPatternLength === undefined ? 32 : _ref$maxPatternLength,
        _ref$isCaseSensitive = _ref.isCaseSensitive,
        isCaseSensitive = _ref$isCaseSensitive === undefined ? false : _ref$isCaseSensitive,
        _ref$tokenSeparator = _ref.tokenSeparator,
        tokenSeparator = _ref$tokenSeparator === undefined ? / +/g : _ref$tokenSeparator,
        _ref$findAllMatches = _ref.findAllMatches,
        findAllMatches = _ref$findAllMatches === undefined ? false : _ref$findAllMatches,
        _ref$minMatchCharLeng = _ref.minMatchCharLength,
        minMatchCharLength = _ref$minMatchCharLeng === undefined ? 1 : _ref$minMatchCharLeng;

    _classCallCheck(this, Bitap);

    this.options = {
      location: location,
      distance: distance,
      threshold: threshold,
      maxPatternLength: maxPatternLength,
      isCaseSensitive: isCaseSensitive,
      tokenSeparator: tokenSeparator,
      findAllMatches: findAllMatches,
      minMatchCharLength: minMatchCharLength
    };

    this.pattern = this.options.isCaseSensitive ? pattern : pattern.toLowerCase();

    if (this.pattern.length <= maxPatternLength) {
      this.patternAlphabet = patternAlphabet(this.pattern);
    }
  }

  _createClass(Bitap, [{
    key: 'search',
    value: function search(text) {
      if (!this.options.isCaseSensitive) {
        text = text.toLowerCase();
      }

      // Exact match
      if (this.pattern === text) {
        return {
          isMatch: true,
          score: 0,
          matchedIndices: [[0, text.length - 1]]
        };
      }

      // When pattern length is greater than the machine word length, just do a a regex comparison
      var _options = this.options,
          maxPatternLength = _options.maxPatternLength,
          tokenSeparator = _options.tokenSeparator;

      if (this.pattern.length > maxPatternLength) {
        return bitapRegexSearch(text, this.pattern, tokenSeparator);
      }

      // Otherwise, use Bitap algorithm
      var _options2 = this.options,
          location = _options2.location,
          distance = _options2.distance,
          threshold = _options2.threshold,
          findAllMatches = _options2.findAllMatches,
          minMatchCharLength = _options2.minMatchCharLength;

      return bitapSearch(text, this.pattern, this.patternAlphabet, {
        location: location,
        distance: distance,
        threshold: threshold,
        findAllMatches: findAllMatches,
        minMatchCharLength: minMatchCharLength
      });
    }
  }]);

  return Bitap;
}();

// let x = new Bitap("od mn war", {})
// let result = x.search("Old Man's War")
// console.log(result)

module.exports = Bitap;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isArray = __webpack_require__(0);

var deepValue = function deepValue(obj, path, list) {
  if (!path) {
    // If there's no path left, we've gotten to the object we care about.
    list.push(obj);
  } else {
    var dotIndex = path.indexOf('.');
    var firstSegment = path;
    var remaining = null;

    if (dotIndex !== -1) {
      firstSegment = path.slice(0, dotIndex);
      remaining = path.slice(dotIndex + 1);
    }

    var value = obj[firstSegment];

    if (value !== null && value !== undefined) {
      if (!remaining && (typeof value === 'string' || typeof value === 'number')) {
        list.push(value.toString());
      } else if (isArray(value)) {
        // Search each item in the array.
        for (var i = 0, len = value.length; i < len; i += 1) {
          deepValue(value[i], remaining, list);
        }
      } else if (remaining) {
        // An object. Recurse further.
        deepValue(value, remaining, list);
      }
    }
  }

  return list;
};

module.exports = function (obj, path) {
  return deepValue(obj, path, []);
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function () {
  var matchmask = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var minMatchCharLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  var matchedIndices = [];
  var start = -1;
  var end = -1;
  var i = 0;

  for (var len = matchmask.length; i < len; i += 1) {
    var match = matchmask[i];
    if (match && start === -1) {
      start = i;
    } else if (!match && start !== -1) {
      end = i - 1;
      if (end - start + 1 >= minMatchCharLength) {
        matchedIndices.push([start, end]);
      }
      start = -1;
    }
  }

  // (i-1 - start) + 1 => i - start
  if (matchmask[i - 1] && i - start >= minMatchCharLength) {
    matchedIndices.push([start, i - 1]);
  }

  return matchedIndices;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (pattern) {
  var mask = {};
  var len = pattern.length;

  for (var i = 0; i < len; i += 1) {
    mask[pattern.charAt(i)] = 0;
  }

  for (var _i = 0; _i < len; _i += 1) {
    mask[pattern.charAt(_i)] |= 1 << len - _i - 1;
  }

  return mask;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var SPECIAL_CHARS_REGEX = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

module.exports = function (text, pattern) {
  var tokenSeparator = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : / +/g;

  var regex = new RegExp(pattern.replace(SPECIAL_CHARS_REGEX, '\\$&').replace(tokenSeparator, '|'));
  var matches = text.match(regex);
  var isMatch = !!matches;
  var matchedIndices = [];

  if (isMatch) {
    for (var i = 0, matchesLen = matches.length; i < matchesLen; i += 1) {
      var match = matches[i];
      matchedIndices.push([text.indexOf(match), match.length - 1]);
    }
  }

  return {
    // TODO: revisit this score
    score: isMatch ? 0.5 : 1,
    isMatch: isMatch,
    matchedIndices: matchedIndices
  };
};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (pattern, _ref) {
  var _ref$errors = _ref.errors,
      errors = _ref$errors === undefined ? 0 : _ref$errors,
      _ref$currentLocation = _ref.currentLocation,
      currentLocation = _ref$currentLocation === undefined ? 0 : _ref$currentLocation,
      _ref$expectedLocation = _ref.expectedLocation,
      expectedLocation = _ref$expectedLocation === undefined ? 0 : _ref$expectedLocation,
      _ref$distance = _ref.distance,
      distance = _ref$distance === undefined ? 100 : _ref$distance;

  var accuracy = errors / pattern.length;
  var proximity = Math.abs(expectedLocation - currentLocation);

  if (!distance) {
    // Dodge divide by zero error.
    return proximity ? 1.0 : accuracy;
  }

  return accuracy + proximity / distance;
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bitapScore = __webpack_require__(6);
var matchedIndices = __webpack_require__(3);

module.exports = function (text, pattern, patternAlphabet, _ref) {
  var _ref$location = _ref.location,
      location = _ref$location === undefined ? 0 : _ref$location,
      _ref$distance = _ref.distance,
      distance = _ref$distance === undefined ? 100 : _ref$distance,
      _ref$threshold = _ref.threshold,
      threshold = _ref$threshold === undefined ? 0.6 : _ref$threshold,
      _ref$findAllMatches = _ref.findAllMatches,
      findAllMatches = _ref$findAllMatches === undefined ? false : _ref$findAllMatches,
      _ref$minMatchCharLeng = _ref.minMatchCharLength,
      minMatchCharLength = _ref$minMatchCharLeng === undefined ? 1 : _ref$minMatchCharLeng;

  var expectedLocation = location;
  // Set starting location at beginning text and initialize the alphabet.
  var textLen = text.length;
  // Highest score beyond which we give up.
  var currentThreshold = threshold;
  // Is there a nearby exact match? (speedup)
  var bestLocation = text.indexOf(pattern, expectedLocation);

  var patternLen = pattern.length;

  // a mask of the matches
  var matchMask = [];
  for (var i = 0; i < textLen; i += 1) {
    matchMask[i] = 0;
  }

  if (bestLocation !== -1) {
    var score = bitapScore(pattern, {
      errors: 0,
      currentLocation: bestLocation,
      expectedLocation: expectedLocation,
      distance: distance
    });
    currentThreshold = Math.min(score, currentThreshold);

    // What about in the other direction? (speed up)
    bestLocation = text.lastIndexOf(pattern, expectedLocation + patternLen);

    if (bestLocation !== -1) {
      var _score = bitapScore(pattern, {
        errors: 0,
        currentLocation: bestLocation,
        expectedLocation: expectedLocation,
        distance: distance
      });
      currentThreshold = Math.min(_score, currentThreshold);
    }
  }

  // Reset the best location
  bestLocation = -1;

  var lastBitArr = [];
  var finalScore = 1;
  var binMax = patternLen + textLen;

  var mask = 1 << patternLen - 1;

  for (var _i = 0; _i < patternLen; _i += 1) {
    // Scan for the best match; each iteration allows for one more error.
    // Run a binary search to determine how far from the match location we can stray
    // at this error level.
    var binMin = 0;
    var binMid = binMax;

    while (binMin < binMid) {
      var _score3 = bitapScore(pattern, {
        errors: _i,
        currentLocation: expectedLocation + binMid,
        expectedLocation: expectedLocation,
        distance: distance
      });

      if (_score3 <= currentThreshold) {
        binMin = binMid;
      } else {
        binMax = binMid;
      }

      binMid = Math.floor((binMax - binMin) / 2 + binMin);
    }

    // Use the result from this iteration as the maximum for the next.
    binMax = binMid;

    var start = Math.max(1, expectedLocation - binMid + 1);
    var finish = findAllMatches ? textLen : Math.min(expectedLocation + binMid, textLen) + patternLen;

    // Initialize the bit array
    var bitArr = Array(finish + 2);

    bitArr[finish + 1] = (1 << _i) - 1;

    for (var j = finish; j >= start; j -= 1) {
      var currentLocation = j - 1;
      var charMatch = patternAlphabet[text.charAt(currentLocation)];

      if (charMatch) {
        matchMask[currentLocation] = 1;
      }

      // First pass: exact match
      bitArr[j] = (bitArr[j + 1] << 1 | 1) & charMatch;

      // Subsequent passes: fuzzy match
      if (_i !== 0) {
        bitArr[j] |= (lastBitArr[j + 1] | lastBitArr[j]) << 1 | 1 | lastBitArr[j + 1];
      }

      if (bitArr[j] & mask) {
        finalScore = bitapScore(pattern, {
          errors: _i,
          currentLocation: currentLocation,
          expectedLocation: expectedLocation,
          distance: distance
        });

        // This match will almost certainly be better than any existing match.
        // But check anyway.
        if (finalScore <= currentThreshold) {
          // Indeed it is
          currentThreshold = finalScore;
          bestLocation = currentLocation;

          // Already passed `loc`, downhill from here on in.
          if (bestLocation <= expectedLocation) {
            break;
          }

          // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
          start = Math.max(1, 2 * expectedLocation - bestLocation);
        }
      }
    }

    // No hope for a (better) match at greater error levels.
    var _score2 = bitapScore(pattern, {
      errors: _i + 1,
      currentLocation: expectedLocation,
      expectedLocation: expectedLocation,
      distance: distance
    });

    if (_score2 > currentThreshold) {
      break;
    }

    lastBitArr = bitArr;
  }

  // Count exact matches (those with a score of 0) to be "almost" exact
  return {
    isMatch: bestLocation >= 0,
    score: finalScore === 0 ? 0.001 : finalScore,
    matchedIndices: matchedIndices(matchMask, minMatchCharLength)
  };
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Bitap = __webpack_require__(1);
var deepValue = __webpack_require__(2);
var isArray = __webpack_require__(0);

var Fuse = function () {
  function Fuse(list, _ref) {
    var _ref$location = _ref.location,
        location = _ref$location === undefined ? 0 : _ref$location,
        _ref$distance = _ref.distance,
        distance = _ref$distance === undefined ? 100 : _ref$distance,
        _ref$threshold = _ref.threshold,
        threshold = _ref$threshold === undefined ? 0.6 : _ref$threshold,
        _ref$maxPatternLength = _ref.maxPatternLength,
        maxPatternLength = _ref$maxPatternLength === undefined ? 32 : _ref$maxPatternLength,
        _ref$caseSensitive = _ref.caseSensitive,
        caseSensitive = _ref$caseSensitive === undefined ? false : _ref$caseSensitive,
        _ref$tokenSeparator = _ref.tokenSeparator,
        tokenSeparator = _ref$tokenSeparator === undefined ? / +/g : _ref$tokenSeparator,
        _ref$findAllMatches = _ref.findAllMatches,
        findAllMatches = _ref$findAllMatches === undefined ? false : _ref$findAllMatches,
        _ref$minMatchCharLeng = _ref.minMatchCharLength,
        minMatchCharLength = _ref$minMatchCharLeng === undefined ? 1 : _ref$minMatchCharLeng,
        _ref$id = _ref.id,
        id = _ref$id === undefined ? null : _ref$id,
        _ref$keys = _ref.keys,
        keys = _ref$keys === undefined ? [] : _ref$keys,
        _ref$shouldSort = _ref.shouldSort,
        shouldSort = _ref$shouldSort === undefined ? true : _ref$shouldSort,
        _ref$getFn = _ref.getFn,
        getFn = _ref$getFn === undefined ? deepValue : _ref$getFn,
        _ref$sortFn = _ref.sortFn,
        sortFn = _ref$sortFn === undefined ? function (a, b) {
      return a.score - b.score;
    } : _ref$sortFn,
        _ref$tokenize = _ref.tokenize,
        tokenize = _ref$tokenize === undefined ? false : _ref$tokenize,
        _ref$matchAllTokens = _ref.matchAllTokens,
        matchAllTokens = _ref$matchAllTokens === undefined ? false : _ref$matchAllTokens,
        _ref$includeMatches = _ref.includeMatches,
        includeMatches = _ref$includeMatches === undefined ? false : _ref$includeMatches,
        _ref$includeScore = _ref.includeScore,
        includeScore = _ref$includeScore === undefined ? false : _ref$includeScore,
        _ref$verbose = _ref.verbose,
        verbose = _ref$verbose === undefined ? false : _ref$verbose;

    _classCallCheck(this, Fuse);

    this.options = {
      location: location,
      distance: distance,
      threshold: threshold,
      maxPatternLength: maxPatternLength,
      isCaseSensitive: caseSensitive,
      tokenSeparator: tokenSeparator,
      findAllMatches: findAllMatches,
      minMatchCharLength: minMatchCharLength,
      id: id,
      keys: keys,
      includeMatches: includeMatches,
      includeScore: includeScore,
      shouldSort: shouldSort,
      getFn: getFn,
      sortFn: sortFn,
      verbose: verbose,
      tokenize: tokenize,
      matchAllTokens: matchAllTokens
    };

    this.setCollection(list);
  }

  _createClass(Fuse, [{
    key: 'setCollection',
    value: function setCollection(list) {
      this.list = list;
      return list;
    }
  }, {
    key: 'search',
    value: function search(pattern) {
      this._log('---------\nSearch pattern: "' + pattern + '"');

      var _prepareSearchers2 = this._prepareSearchers(pattern),
          tokenSearchers = _prepareSearchers2.tokenSearchers,
          fullSearcher = _prepareSearchers2.fullSearcher;

      var _search2 = this._search(tokenSearchers, fullSearcher),
          weights = _search2.weights,
          results = _search2.results;

      this._computeScore(weights, results);

      if (this.options.shouldSort) {
        this._sort(results);
      }

      return this._format(results);
    }
  }, {
    key: '_prepareSearchers',
    value: function _prepareSearchers() {
      var pattern = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      var tokenSearchers = [];

      if (this.options.tokenize) {
        // Tokenize on the separator
        var tokens = pattern.split(this.options.tokenSeparator);
        for (var i = 0, len = tokens.length; i < len; i += 1) {
          tokenSearchers.push(new Bitap(tokens[i], this.options));
        }
      }

      var fullSearcher = new Bitap(pattern, this.options);

      return { tokenSearchers: tokenSearchers, fullSearcher: fullSearcher };
    }
  }, {
    key: '_search',
    value: function _search() {
      var tokenSearchers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var fullSearcher = arguments[1];

      var list = this.list;
      var resultMap = {};
      var results = [];

      // Check the first item in the list, if it's a string, then we assume
      // that every item in the list is also a string, and thus it's a flattened array.
      if (typeof list[0] === 'string') {
        // Iterate over every item
        for (var i = 0, len = list.length; i < len; i += 1) {
          this._analyze({
            key: '',
            value: list[i],
            record: i,
            index: i
          }, {
            resultMap: resultMap,
            results: results,
            tokenSearchers: tokenSearchers,
            fullSearcher: fullSearcher
          });
        }

        return { weights: null, results: results };
      }

      // Otherwise, the first item is an Object (hopefully), and thus the searching
      // is done on the values of the keys of each item.
      var weights = {};
      for (var _i = 0, _len = list.length; _i < _len; _i += 1) {
        var item = list[_i];
        // Iterate over every key
        for (var j = 0, keysLen = this.options.keys.length; j < keysLen; j += 1) {
          var key = this.options.keys[j];
          if (typeof key !== 'string') {
            weights[key.name] = {
              weight: 1 - key.weight || 1
            };
            if (key.weight <= 0 || key.weight > 1) {
              throw new Error('Key weight has to be > 0 and <= 1');
            }
            key = key.name;
          } else {
            weights[key] = {
              weight: 1
            };
          }

          this._analyze({
            key: key,
            value: this.options.getFn(item, key),
            record: item,
            index: _i
          }, {
            resultMap: resultMap,
            results: results,
            tokenSearchers: tokenSearchers,
            fullSearcher: fullSearcher
          });
        }
      }

      return { weights: weights, results: results };
    }
  }, {
    key: '_analyze',
    value: function _analyze(_ref2, _ref3) {
      var key = _ref2.key,
          _ref2$arrayIndex = _ref2.arrayIndex,
          arrayIndex = _ref2$arrayIndex === undefined ? -1 : _ref2$arrayIndex,
          value = _ref2.value,
          record = _ref2.record,
          index = _ref2.index;
      var _ref3$tokenSearchers = _ref3.tokenSearchers,
          tokenSearchers = _ref3$tokenSearchers === undefined ? [] : _ref3$tokenSearchers,
          _ref3$fullSearcher = _ref3.fullSearcher,
          fullSearcher = _ref3$fullSearcher === undefined ? [] : _ref3$fullSearcher,
          _ref3$resultMap = _ref3.resultMap,
          resultMap = _ref3$resultMap === undefined ? {} : _ref3$resultMap,
          _ref3$results = _ref3.results,
          results = _ref3$results === undefined ? [] : _ref3$results;

      // Check if the texvaluet can be searched
      if (value === undefined || value === null) {
        return;
      }

      var exists = false;
      var averageScore = -1;
      var numTextMatches = 0;

      if (typeof value === 'string') {
        this._log('\nKey: ' + (key === '' ? '-' : key));

        var mainSearchResult = fullSearcher.search(value);
        this._log('Full text: "' + value + '", score: ' + mainSearchResult.score);

        if (this.options.tokenize) {
          var words = value.split(this.options.tokenSeparator);
          var scores = [];

          for (var i = 0; i < tokenSearchers.length; i += 1) {
            var tokenSearcher = tokenSearchers[i];

            this._log('\nPattern: "' + tokenSearcher.pattern + '"');

            // let tokenScores = []
            var hasMatchInText = false;

            for (var j = 0; j < words.length; j += 1) {
              var word = words[j];
              var tokenSearchResult = tokenSearcher.search(word);
              var obj = {};
              if (tokenSearchResult.isMatch) {
                obj[word] = tokenSearchResult.score;
                exists = true;
                hasMatchInText = true;
                scores.push(tokenSearchResult.score);
              } else {
                obj[word] = 1;
                if (!this.options.matchAllTokens) {
                  scores.push(1);
                }
              }
              this._log('Token: "' + word + '", score: ' + obj[word]);
              // tokenScores.push(obj)
            }

            if (hasMatchInText) {
              numTextMatches += 1;
            }
          }

          averageScore = scores[0];
          var scoresLen = scores.length;
          for (var _i2 = 1; _i2 < scoresLen; _i2 += 1) {
            averageScore += scores[_i2];
          }
          averageScore = averageScore / scoresLen;

          this._log('Token score average:', averageScore);
        }

        var finalScore = mainSearchResult.score;
        if (averageScore > -1) {
          finalScore = (finalScore + averageScore) / 2;
        }

        this._log('Score average:', finalScore);

        var checkTextMatches = this.options.tokenize && this.options.matchAllTokens ? numTextMatches >= tokenSearchers.length : true;

        this._log('\nCheck Matches: ' + checkTextMatches);

        // If a match is found, add the item to <rawResults>, including its score
        if ((exists || mainSearchResult.isMatch) && checkTextMatches) {
          // Check if the item already exists in our results
          var existingResult = resultMap[index];
          if (existingResult) {
            // Use the lowest score
            // existingResult.score, bitapResult.score
            existingResult.output.push({
              key: key,
              arrayIndex: arrayIndex,
              value: value,
              score: finalScore,
              matchedIndices: mainSearchResult.matchedIndices
            });
          } else {
            // Add it to the raw result list
            resultMap[index] = {
              item: record,
              output: [{
                key: key,
                arrayIndex: arrayIndex,
                value: value,
                score: finalScore,
                matchedIndices: mainSearchResult.matchedIndices
              }]
            };

            results.push(resultMap[index]);
          }
        }
      } else if (isArray(value)) {
        for (var _i3 = 0, len = value.length; _i3 < len; _i3 += 1) {
          this._analyze({
            key: key,
            arrayIndex: _i3,
            value: value[_i3],
            record: record,
            index: index
          }, {
            resultMap: resultMap,
            results: results,
            tokenSearchers: tokenSearchers,
            fullSearcher: fullSearcher
          });
        }
      }
    }
  }, {
    key: '_computeScore',
    value: function _computeScore(weights, results) {
      this._log('\n\nComputing score:\n');

      for (var i = 0, len = results.length; i < len; i += 1) {
        var output = results[i].output;
        var scoreLen = output.length;

        var totalScore = 0;
        var bestScore = 1;

        for (var j = 0; j < scoreLen; j += 1) {
          var weight = weights ? weights[output[j].key].weight : 1;
          var score = weight === 1 ? output[j].score : output[j].score || 0.001;
          var nScore = score * weight;

          if (weight !== 1) {
            bestScore = Math.min(bestScore, nScore);
          } else {
            output[j].nScore = nScore;
            totalScore += nScore;
          }
        }

        results[i].score = bestScore === 1 ? totalScore / scoreLen : bestScore;

        this._log(results[i]);
      }
    }
  }, {
    key: '_sort',
    value: function _sort(results) {
      this._log('\n\nSorting....');
      results.sort(this.options.sortFn);
    }
  }, {
    key: '_format',
    value: function _format(results) {
      var finalOutput = [];

      this._log('\n\nOutput:\n\n', JSON.stringify(results));

      var transformers = [];

      if (this.options.includeMatches) {
        transformers.push(function (result, data) {
          var output = result.output;
          data.matches = [];

          for (var i = 0, len = output.length; i < len; i += 1) {
            var item = output[i];

            if (item.matchedIndices.length === 0) {
              continue;
            }

            var obj = {
              indices: item.matchedIndices,
              value: item.value
            };
            if (item.key) {
              obj.key = item.key;
            }
            if (item.hasOwnProperty('arrayIndex') && item.arrayIndex > -1) {
              obj.arrayIndex = item.arrayIndex;
            }
            data.matches.push(obj);
          }
        });
      }

      if (this.options.includeScore) {
        transformers.push(function (result, data) {
          data.score = result.score;
        });
      }

      for (var i = 0, len = results.length; i < len; i += 1) {
        var result = results[i];

        if (this.options.id) {
          result.item = this.options.getFn(result.item, this.options.id)[0];
        }

        if (!transformers.length) {
          finalOutput.push(result.item);
          continue;
        }

        var data = {
          item: result.item
        };

        for (var j = 0, _len2 = transformers.length; j < _len2; j += 1) {
          transformers[j](result, data);
        }

        finalOutput.push(data);
      }

      return finalOutput;
    }
  }, {
    key: '_log',
    value: function _log() {
      if (this.options.verbose) {
        var _console;

        (_console = console).log.apply(_console, arguments);
      }
    }
  }]);

  return Fuse;
}();

module.exports = Fuse;

/***/ })
/******/ ]);
});
//# sourceMappingURL=fuse.js.map

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _redux = __webpack_require__(2);

var _index = __webpack_require__(15);

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Store = function () {
  function Store() {
    _classCallCheck(this, Store);

    this.store = (0, _redux.createStore)(_index2.default, window.devToolsExtension ? window.devToolsExtension() : undefined);
  }

  /**
   * Subscribe store to function call (wrapped Redux method)
   * @param  {Function} onChange Function to trigger when state changes
   * @return
   */


  _createClass(Store, [{
    key: 'subscribe',
    value: function subscribe(onChange) {
      this.store.subscribe(onChange);
    }

    /**
     * Dispatch event to store (wrapped Redux method)
     * @param  {Function} action Action function to trigger
     * @return
     */

  }, {
    key: 'dispatch',
    value: function dispatch(action) {
      this.store.dispatch(action);
    }

    /**
     * Get store object (wrapping Redux method)
     * @return {Object} State
     */

  }, {
    key: 'getState',
    value: function getState() {
      return this.store.getState();
    }

    /**
     * Get items from store
     * @return {Array} Item objects
     */

  }, {
    key: 'getItems',
    value: function getItems() {
      var state = this.store.getState();
      return state.items;
    }

    /**
     * Get active items from store
     * @return {Array} Item objects
     */

  }, {
    key: 'getItemsFilteredByActive',
    value: function getItemsFilteredByActive() {
      var items = this.getItems();
      var values = items.filter(function (item) {
        return item.active === true;
      });

      return values;
    }

    /**
    * Get highlighted items from store
    * @return {Array} Item objects
    */

  }, {
    key: 'getItemsFilteredByHighlighted',
    value: function getItemsFilteredByHighlighted() {
      var items = this.getItems();
      var values = items.filter(function (item) {
        return item.active && item.highlighted;
      });

      return values;
    }

    /**
     * Get choices from store
     * @return {Array} Option objects
     */

  }, {
    key: 'getChoices',
    value: function getChoices() {
      var state = this.store.getState();
      return state.choices;
    }

    /**
     * Get active choices from store
     * @return {Array} Option objects
     */

  }, {
    key: 'getChoicesFilteredByActive',
    value: function getChoicesFilteredByActive() {
      var choices = this.getChoices();
      var values = choices.filter(function (choice) {
        return choice.active === true;
      });

      return values;
    }

    /**
     * Get selectable choices from store
     * @return {Array} Option objects
     */

  }, {
    key: 'getChoicesFilteredBySelectable',
    value: function getChoicesFilteredBySelectable() {
      var choices = this.getChoices();
      var values = choices.filter(function (choice) {
        return choice.disabled !== true;
      });

      return values;
    }

    /**
     * Get choices that can be searched (excluding placeholders)
     * @return {Array} Option objects
     */

  }, {
    key: 'getSearchableChoices',
    value: function getSearchableChoices() {
      var filtered = this.getChoicesFilteredBySelectable();
      return filtered.filter(function (choice) {
        return choice.placeholder !== true;
      });
    }

    /**
     * Get single choice by it's ID
     * @return {Object} Found choice
     */

  }, {
    key: 'getChoiceById',
    value: function getChoiceById(id) {
      if (id) {
        var choices = this.getChoicesFilteredByActive();
        var foundChoice = choices.find(function (choice) {
          return choice.id === parseInt(id, 10);
        });
        return foundChoice;
      }
      return false;
    }

    /**
     * Get placeholder choice from store
     * @return {Object} Found placeholder
     */

  }, {
    key: 'getPlaceholderChoice',
    value: function getPlaceholderChoice() {
      var choices = this.getChoices();
      var placeholderChoice = [].concat(_toConsumableArray(choices)).reverse().find(function (choice) {
        return choice.placeholder === true;
      });

      return placeholderChoice;
    }

    /**
     * Get groups from store
     * @return {Array} Group objects
     */

  }, {
    key: 'getGroups',
    value: function getGroups() {
      var state = this.store.getState();
      return state.groups;
    }

    /**
     * Get active groups from store
     * @return {Array} Group objects
     */

  }, {
    key: 'getGroupsFilteredByActive',
    value: function getGroupsFilteredByActive() {
      var groups = this.getGroups();
      var choices = this.getChoices();

      var values = groups.filter(function (group) {
        var isActive = group.active === true && group.disabled === false;
        var hasActiveOptions = choices.some(function (choice) {
          return choice.active === true && choice.disabled === false;
        });
        return isActive && hasActiveOptions;
      }, []);

      return values;
    }

    /**
     * Get group by group id
     * @param  {Number} id Group ID
     * @return {Object}    Group data
     */

  }, {
    key: 'getGroupById',
    value: function getGroupById(id) {
      var groups = this.getGroups();
      var foundGroup = groups.find(function (group) {
        return group.id === parseInt(id, 10);
      });

      return foundGroup;
    }
  }]);

  return Store;
}();

exports.default = Store;

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/* harmony default export */ __webpack_exports__["a"] = (freeGlobal);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(3)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(12);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, module) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ponyfill = __webpack_require__(14);

var _ponyfill2 = _interopRequireDefault(_ponyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var root; /* global window */


if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (true) {
  root = module;
} else {
  root = Function('return this')();
}

var result = (0, _ponyfill2['default'])(root);
exports['default'] = result;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(13)(module)))

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports['default'] = symbolObservablePonyfill;
function symbolObservablePonyfill(root) {
	var result;
	var _Symbol = root.Symbol;

	if (typeof _Symbol === 'function') {
		if (_Symbol.observable) {
			result = _Symbol.observable;
		} else {
			result = _Symbol('observable');
			_Symbol.observable = result;
		}
	} else {
		result = '@@observable';
	}

	return result;
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = __webpack_require__(2);

var _items = __webpack_require__(16);

var _items2 = _interopRequireDefault(_items);

var _groups = __webpack_require__(17);

var _groups2 = _interopRequireDefault(_groups);

var _choices = __webpack_require__(18);

var _choices2 = _interopRequireDefault(_choices);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var appReducer = (0, _redux.combineReducers)({
  items: _items2.default,
  groups: _groups2.default,
  choices: _choices2.default
});

var rootReducer = function rootReducer(passedState, action) {
  var state = passedState;
  // If we are clearing all items, groups and options we reassign
  // state and then pass that state to our proper reducer. This isn't
  // mutating our actual state
  // See: http://stackoverflow.com/a/35641992
  if (action.type === 'CLEAR_ALL') {
    state = undefined;
  }

  return appReducer(state, action);
};

exports.default = rootReducer;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = items;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultState = exports.defaultState = [];

function items() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_ITEM':
      {
        // Add object to items array
        var newState = [].concat(_toConsumableArray(state), [{
          id: action.id,
          choiceId: action.choiceId,
          groupId: action.groupId,
          value: action.value,
          label: action.label,
          active: true,
          highlighted: false,
          customProperties: action.customProperties,
          placeholder: action.placeholder || false,
          keyCode: null
        }]);

        return newState.map(function (obj) {
          var item = obj;
          item.highlighted = false;
          return item;
        });
      }

    case 'REMOVE_ITEM':
      {
        // Set item to inactive
        return state.map(function (obj) {
          var item = obj;
          if (item.id === action.id) {
            item.active = false;
          }
          return item;
        });
      }

    case 'HIGHLIGHT_ITEM':
      {
        return state.map(function (obj) {
          var item = obj;
          if (item.id === action.id) {
            item.highlighted = action.highlighted;
          }
          return item;
        });
      }

    default:
      {
        return state;
      }
  }
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = groups;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultState = exports.defaultState = [];

function groups() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_GROUP':
      {
        return [].concat(_toConsumableArray(state), [{
          id: action.id,
          value: action.value,
          active: action.active,
          disabled: action.disabled
        }]);
      }

    case 'CLEAR_CHOICES':
      {
        return [];
      }

    default:
      {
        return state;
      }
  }
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = choices;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var defaultState = exports.defaultState = [];

function choices() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments[1];

  switch (action.type) {
    case 'ADD_CHOICE':
      {
        /*
            A disabled choice appears in the choice dropdown but cannot be selected
            A selected choice has been added to the passed input's value (added as an item)
            An active choice appears within the choice dropdown
         */
        return [].concat(_toConsumableArray(state), [{
          id: action.id,
          elementId: action.elementId,
          groupId: action.groupId,
          value: action.value,
          label: action.label || action.value,
          disabled: action.disabled || false,
          selected: false,
          active: true,
          score: 9999,
          customProperties: action.customProperties,
          placeholder: action.placeholder || false,
          keyCode: null
        }]);
      }

    case 'ADD_ITEM':
      {
        // If all choices need to be activated
        if (action.activateOptions) {
          return state.map(function (obj) {
            var choice = obj;
            choice.active = action.active;
            return choice;
          });
        }

        // When an item is added and it has an associated choice,
        // we want to disable it so it can't be chosen again
        if (action.choiceId > -1) {
          return state.map(function (obj) {
            var choice = obj;
            if (choice.id === parseInt(action.choiceId, 10)) {
              choice.selected = true;
            }
            return choice;
          });
        }

        return state;
      }

    case 'REMOVE_ITEM':
      {
        // When an item is removed and it has an associated choice,
        // we want to re-enable it so it can be chosen again
        if (action.choiceId > -1) {
          return state.map(function (obj) {
            var choice = obj;
            if (choice.id === parseInt(action.choiceId, 10)) {
              choice.selected = false;
            }
            return choice;
          });
        }

        return state;
      }

    case 'FILTER_CHOICES':
      {
        return state.map(function (obj) {
          var choice = obj;
          // Set active state based on whether choice is
          // within filtered results
          choice.active = action.results.some(function (_ref) {
            var item = _ref.item,
                score = _ref.score;

            if (item.id === choice.id) {
              choice.score = score;
              return true;
            }
            return false;
          });

          return choice;
        });
      }

    case 'ACTIVATE_CHOICES':
      {
        return state.map(function (obj) {
          var choice = obj;
          choice.active = action.active;
          return choice;
        });
      }

    case 'CLEAR_CHOICES':
      {
        return defaultState;
      }

    default:
      {
        return state;
      }
  }
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dropdown = function () {
  function Dropdown(instance, element, classNames) {
    _classCallCheck(this, Dropdown);

    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
    this.dimensions = null;
    this.position = null;
    this.isActive = false;
  }

  _createClass(Dropdown, [{
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }

    /**
     * Determine how far the top of our element is from
     * the top of the window
     * @return {Number} Vertical position
     */

  }, {
    key: 'getVerticalPos',
    value: function getVerticalPos() {
      this.dimensions = this.element.getBoundingClientRect();
      this.position = Math.ceil(this.dimensions.top + window.pageYOffset + this.element.offsetHeight);
      return this.position;
    }

    /**
     * Find element that matches passed selector
     * @return {HTMLElement}
     */

  }, {
    key: 'getChild',
    value: function getChild(selector) {
      return this.element.querySelector(selector);
    }

    /**
     * Show dropdown to user by adding active state class
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'show',
    value: function show() {
      this.element.classList.add(this.classNames.activeState);
      this.element.setAttribute('aria-expanded', 'true');
      this.isActive = true;
      return this.parentInstance;
    }

    /**
     * Hide dropdown from user
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'hide',
    value: function hide() {
      this.element.classList.remove(this.classNames.activeState);
      this.element.setAttribute('aria-expanded', 'false');
      this.isActive = false;
      return this.parentInstance;
    }
  }]);

  return Dropdown;
}();

exports.default = Dropdown;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Container = function () {
  function Container(instance, element, classNames) {
    _classCallCheck(this, Container);

    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
    this.config = instance.config;
    this.isOpen = false;
    this.isFlipped = false;
    this.isFocussed = false;
    this.isDisabled = false;
    this.isLoading = false;
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  _createClass(Container, [{
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }

    /**
     * Add event listeners
    */

  }, {
    key: 'addEventListeners',
    value: function addEventListeners() {
      this.element.addEventListener('focus', this.onFocus);
      this.element.addEventListener('blur', this.onBlur);
    }

    /**
     * Remove event listeners
    */

    /** */

  }, {
    key: 'removeEventListeners',
    value: function removeEventListeners() {
      this.element.removeEventListener('focus', this.onFocus);
      this.element.removeEventListener('blur', this.onBlur);
    }

    /**
     * Set focussed state
     */

  }, {
    key: 'onFocus',
    value: function onFocus() {
      this.isFocussed = true;
    }

    /**
     * Remove blurred state
     */

  }, {
    key: 'onBlur',
    value: function onBlur() {
      this.isFocussed = false;
    }

    /**
     * Determine whether container should be flipped
     * based on passed dropdown position
     * @param {Number} dropdownPos
     * @returns
     */

  }, {
    key: 'shouldFlip',
    value: function shouldFlip(dropdownPos) {
      var windowHeight = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (0, _utils.getWindowHeight)();

      if (dropdownPos === undefined) {
        return true;
      }
      // If flip is enabled and the dropdown bottom position is
      // greater than the window height flip the dropdown.
      var shouldFlip = false;
      if (this.config.position === 'auto') {
        shouldFlip = dropdownPos >= windowHeight;
      } else if (this.config.position === 'top') {
        shouldFlip = true;
      }

      return shouldFlip;
    }

    /**
     * Set active descendant attribute
     * @param {Number} activeDescendant ID of active descendant
     */

  }, {
    key: 'setActiveDescendant',
    value: function setActiveDescendant(activeDescendantID) {
      this.element.setAttribute('aria-activedescendant', activeDescendantID);
    }

    /**
     * Remove active descendant attribute
     */

  }, {
    key: 'removeActiveDescendant',
    value: function removeActiveDescendant() {
      this.element.removeAttribute('aria-activedescendant');
    }
  }, {
    key: 'open',
    value: function open(dropdownPos) {
      this.element.classList.add(this.classNames.openState);
      this.element.setAttribute('aria-expanded', 'true');
      this.isOpen = true;

      if (this.shouldFlip(dropdownPos)) {
        this.element.classList.add(this.classNames.flippedState);
        this.isFlipped = true;
      }
    }
  }, {
    key: 'close',
    value: function close() {
      this.element.classList.remove(this.classNames.openState);
      this.element.setAttribute('aria-expanded', 'false');
      this.removeActiveDescendant();
      this.isOpen = false;

      // A dropdown flips if it does not have space within the page
      if (this.isFlipped) {
        this.element.classList.remove(this.classNames.flippedState);
        this.isFlipped = false;
      }
    }
  }, {
    key: 'focus',
    value: function focus() {
      if (!this.isFocussed) {
        this.element.focus();
      }
    }
  }, {
    key: 'addFocusState',
    value: function addFocusState() {
      this.element.classList.add(this.classNames.focusState);
    }
  }, {
    key: 'removeFocusState',
    value: function removeFocusState() {
      this.element.classList.remove(this.classNames.focusState);
    }

    /**
     * Remove disabled state
     */

  }, {
    key: 'enable',
    value: function enable() {
      this.element.classList.remove(this.classNames.disabledState);
      this.element.removeAttribute('aria-disabled');
      if (this.parentInstance.isSelectOneElement) {
        this.element.setAttribute('tabindex', '0');
      }
      this.isDisabled = false;
    }

    /**
     * Set disabled state
     */

  }, {
    key: 'disable',
    value: function disable() {
      this.element.classList.add(this.classNames.disabledState);
      this.element.setAttribute('aria-disabled', 'true');
      if (this.parentInstance.isSelectOneElement) {
        this.element.setAttribute('tabindex', '-1');
      }
      this.isDisabled = true;
    }
  }, {
    key: 'wrap',
    value: function wrap(element) {
      (0, _utils.wrap)(element, this.element);
    }
  }, {
    key: 'unwrap',
    value: function unwrap(element) {
      // Move passed element outside this element
      this.element.parentNode.insertBefore(element, this.element);
      // Remove this element
      this.element.parentNode.removeChild(this.element);
    }

    /**
     * Add loading state to element
     */

  }, {
    key: 'addLoadingState',
    value: function addLoadingState() {
      this.element.classList.add(this.classNames.loadingState);
      this.element.setAttribute('aria-busy', 'true');
      this.isLoading = true;
    }

    /**
     * Remove loading state from element
     */

  }, {
    key: 'removeLoadingState',
    value: function removeLoadingState() {
      this.element.classList.remove(this.classNames.loadingState);
      this.element.removeAttribute('aria-busy');
      this.isLoading = false;
    }
  }]);

  return Container;
}();

exports.default = Container;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Input = function () {
  function Input(instance, element, classNames) {
    _classCallCheck(this, Input);

    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
    this.isFocussed = this.element === document.activeElement;
    this.isDisabled = false;

    // Bind event listeners
    this.onPaste = this.onPaste.bind(this);
    this.onInput = this.onInput.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  _createClass(Input, [{
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }, {
    key: 'addEventListeners',
    value: function addEventListeners() {
      this.element.addEventListener('input', this.onInput);
      this.element.addEventListener('paste', this.onPaste);
      this.element.addEventListener('focus', this.onFocus);
      this.element.addEventListener('blur', this.onBlur);
    }
  }, {
    key: 'removeEventListeners',
    value: function removeEventListeners() {
      this.element.removeEventListener('input', this.onInput);
      this.element.removeEventListener('paste', this.onPaste);
      this.element.removeEventListener('focus', this.onFocus);
      this.element.removeEventListener('blur', this.onBlur);
    }

    /**
     * Input event
     * @return
     * @private
     */

  }, {
    key: 'onInput',
    value: function onInput() {
      if (!this.parentInstance.isSelectOneElement) {
        this.setWidth();
      }
    }

    /**
     * Paste event
     * @param  {Object} e Event
     * @return
     * @private
     */

  }, {
    key: 'onPaste',
    value: function onPaste(e) {
      // Disable pasting into the input if option has been set
      if (e.target === this.element && !this.parentInstance.config.paste) {
        e.preventDefault();
      }
    }

    /**
     * Set focussed state
     */

  }, {
    key: 'onFocus',
    value: function onFocus() {
      this.isFocussed = true;
    }

    /**
     * Remove focussed state
     */

  }, {
    key: 'onBlur',
    value: function onBlur() {
      this.isFocussed = false;
    }
  }, {
    key: 'enable',
    value: function enable() {
      this.element.removeAttribute('disabled');
      this.isDisabled = false;
    }
  }, {
    key: 'disable',
    value: function disable() {
      this.element.setAttribute('disabled', '');
      this.isDisabled = true;
    }
  }, {
    key: 'focus',
    value: function focus() {
      if (!this.isFocussed) {
        this.element.focus();
      }
    }
  }, {
    key: 'blur',
    value: function blur() {
      if (this.isFocussed) {
        this.element.blur();
      }
    }

    /**
     * Set value of input to blank
     * @return {Object} Class instance
     * @public
     */

  }, {
    key: 'clear',
    value: function clear() {
      var setWidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (this.element.value) {
        this.element.value = '';
      }

      if (setWidth) {
        this.setWidth();
      }

      return this.parentInstance;
    }

    /**
     * Set the correct input width based on placeholder
     * value or input value
     * @return
     */

  }, {
    key: 'setWidth',
    value: function setWidth(enforceWidth) {
      if (this.parentInstance.placeholder) {
        // If there is a placeholder, we only want to set the width of the input when it is a greater
        // length than 75% of the placeholder. This stops the input jumping around.
        if (this.element.value && this.element.value.length >= this.parentInstance.placeholder.length / 1.25 || enforceWidth) {
          this.element.style.width = this.getWidth();
        }
      } else {
        // If there is no placeholder, resize input to contents
        this.element.style.width = this.getWidth();
      }
    }
  }, {
    key: 'getWidth',
    value: function getWidth() {
      return (0, _utils.getWidthOfInput)(this.element);
    }
  }, {
    key: 'setPlaceholder',
    value: function setPlaceholder(placeholder) {
      this.element.placeholder = placeholder;
    }
  }, {
    key: 'setValue',
    value: function setValue(value) {
      this.element.value = value;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.element.value;
    }
  }, {
    key: 'setActiveDescendant',
    value: function setActiveDescendant(activeDescendantID) {
      this.element.setAttribute('aria-activedescendant', activeDescendantID);
    }
  }, {
    key: 'removeActiveDescendant',
    value: function removeActiveDescendant() {
      this.element.removeAttribute('aria-activedescendant');
    }
  }]);

  return Input;
}();

exports.default = Input;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var List = function () {
  function List(instance, element, classNames) {
    _classCallCheck(this, List);

    this.parentInstance = instance;
    this.element = element;
    this.classNames = classNames;
    this.scrollPos = this.element.scrollTop;
    this.height = this.element.offsetHeight;
    this.hasChildren = !!this.element.children;
  }

  _createClass(List, [{
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }

    /**
     * Clear List contents
     */

  }, {
    key: 'clear',
    value: function clear() {
      this.element.innerHTML = '';
    }

    /**
     * Scroll to passed position on Y axis
     */

  }, {
    key: 'scrollTo',
    value: function scrollTo() {
      var scrollPos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      this.element.scrollTop = scrollPos;
    }
    /**
     * Append node to element
     */

  }, {
    key: 'append',
    value: function append(node) {
      this.element.appendChild(node);
    }

    /**
     * Find element that matches passed selector
     * @return {HTMLElement}
    */

  }, {
    key: 'getChild',
    value: function getChild(selector) {
      return this.element.querySelector(selector);
    }
  }]);

  return List;
}();

exports.default = List;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _wrappedElement = __webpack_require__(4);

var _wrappedElement2 = _interopRequireDefault(_wrappedElement);

var _utils = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WrappedInput = function (_WrappedElement) {
  _inherits(WrappedInput, _WrappedElement);

  function WrappedInput(instance, element, classNames) {
    _classCallCheck(this, WrappedInput);

    var _this = _possibleConstructorReturn(this, (WrappedInput.__proto__ || Object.getPrototypeOf(WrappedInput)).call(this, instance, element, classNames));

    _this.parentInstance = instance;
    _this.element = element;
    _this.classNames = classNames;
    return _this;
  }

  _createClass(WrappedInput, [{
    key: 'getElement',
    value: function getElement() {
      _get(WrappedInput.prototype.__proto__ || Object.getPrototypeOf(WrappedInput.prototype), 'getElement', this).call(this);
    }
  }, {
    key: 'conceal',
    value: function conceal() {
      _get(WrappedInput.prototype.__proto__ || Object.getPrototypeOf(WrappedInput.prototype), 'conceal', this).call(this);
    }
  }, {
    key: 'reveal',
    value: function reveal() {
      _get(WrappedInput.prototype.__proto__ || Object.getPrototypeOf(WrappedInput.prototype), 'reveal', this).call(this);
    }
  }, {
    key: 'enable',
    value: function enable() {
      _get(WrappedInput.prototype.__proto__ || Object.getPrototypeOf(WrappedInput.prototype), 'enable', this).call(this);
    }
  }, {
    key: 'disable',
    value: function disable() {
      _get(WrappedInput.prototype.__proto__ || Object.getPrototypeOf(WrappedInput.prototype), 'disable', this).call(this);
    }
  }, {
    key: 'setValue',
    value: function setValue(items) {
      var itemsFiltered = (0, _utils.reduceToValues)(items);
      var itemsFilteredString = itemsFiltered.join(this.parentInstance.config.delimiter);

      this.element.setAttribute('value', itemsFilteredString);
      this.element.value = itemsFilteredString;
    }
  }]);

  return WrappedInput;
}(_wrappedElement2.default);

exports.default = WrappedInput;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _wrappedElement = __webpack_require__(4);

var _wrappedElement2 = _interopRequireDefault(_wrappedElement);

var _templates = __webpack_require__(5);

var _templates2 = _interopRequireDefault(_templates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WrappedSelect = function (_WrappedElement) {
  _inherits(WrappedSelect, _WrappedElement);

  function WrappedSelect(instance, element, classNames) {
    _classCallCheck(this, WrappedSelect);

    var _this = _possibleConstructorReturn(this, (WrappedSelect.__proto__ || Object.getPrototypeOf(WrappedSelect)).call(this, instance, element, classNames));

    _this.parentInstance = instance;
    _this.element = element;
    _this.classNames = classNames;
    return _this;
  }

  _createClass(WrappedSelect, [{
    key: 'getElement',
    value: function getElement() {
      _get(WrappedSelect.prototype.__proto__ || Object.getPrototypeOf(WrappedSelect.prototype), 'getElement', this).call(this);
    }
  }, {
    key: 'conceal',
    value: function conceal() {
      _get(WrappedSelect.prototype.__proto__ || Object.getPrototypeOf(WrappedSelect.prototype), 'conceal', this).call(this);
    }
  }, {
    key: 'reveal',
    value: function reveal() {
      _get(WrappedSelect.prototype.__proto__ || Object.getPrototypeOf(WrappedSelect.prototype), 'reveal', this).call(this);
    }
  }, {
    key: 'enable',
    value: function enable() {
      _get(WrappedSelect.prototype.__proto__ || Object.getPrototypeOf(WrappedSelect.prototype), 'enable', this).call(this);
    }
  }, {
    key: 'disable',
    value: function disable() {
      _get(WrappedSelect.prototype.__proto__ || Object.getPrototypeOf(WrappedSelect.prototype), 'disable', this).call(this);
    }
  }, {
    key: 'getPlaceholderOption',
    value: function getPlaceholderOption() {
      return this.element.querySelector('option[placeholder]');
    }
  }, {
    key: 'getOptions',
    value: function getOptions() {
      return Array.from(this.element.options);
    }
  }, {
    key: 'getOptionGroups',
    value: function getOptionGroups() {
      return Array.from(this.element.getElementsByTagName('OPTGROUP'));
    }
  }, {
    key: 'setOptions',
    value: function setOptions(options) {
      var fragment = document.createDocumentFragment();
      var addOptionToFragment = function addOptionToFragment(data) {
        // Create a standard select option
        var template = _templates2.default.option(data);
        // Append it to fragment
        fragment.appendChild(template);
      };

      // Add each list item to list
      options.forEach(function (optionData) {
        return addOptionToFragment(optionData);
      });

      this.appendDocFragment(fragment);
    }
  }, {
    key: 'appendDocFragment',
    value: function appendDocFragment(fragment) {
      this.element.innerHTML = '';
      this.element.appendChild(fragment);
    }
  }]);

  return WrappedSelect;
}(_wrappedElement2.default);

exports.default = WrappedSelect;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (true) {
		// register as 'classnames', consistent with npm package name
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
			return classNames;
		}).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else {
		window.classNames = classNames;
	}
}());


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clearChoices = exports.activateChoices = exports.filterChoices = exports.addChoice = undefined;

var _constants = __webpack_require__(1);

var addChoice = exports.addChoice = function addChoice(value, label, id, groupId, disabled, elementId, customProperties, placeholder, keyCode) {
  return {
    type: _constants.ACTION_TYPES.ADD_CHOICE,
    value: value,
    label: label,
    id: id,
    groupId: groupId,
    disabled: disabled,
    elementId: elementId,
    customProperties: customProperties,
    placeholder: placeholder,
    keyCode: keyCode
  };
};

var filterChoices = exports.filterChoices = function filterChoices(results) {
  return {
    type: _constants.ACTION_TYPES.FILTER_CHOICES,
    results: results
  };
};

var activateChoices = exports.activateChoices = function activateChoices() {
  var active = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
  return {
    type: _constants.ACTION_TYPES.ACTIVATE_CHOICES,
    active: active
  };
};

var clearChoices = exports.clearChoices = function clearChoices() {
  return {
    type: _constants.ACTION_TYPES.CLEAR_CHOICES
  };
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.highlightItem = exports.removeItem = exports.addItem = undefined;

var _constants = __webpack_require__(1);

var addItem = exports.addItem = function addItem(value, label, id, choiceId, groupId, customProperties, placeholder, keyCode) {
  return {
    type: _constants.ACTION_TYPES.ADD_ITEM,
    value: value,
    label: label,
    id: id,
    choiceId: choiceId,
    groupId: groupId,
    customProperties: customProperties,
    placeholder: placeholder,
    keyCode: keyCode
  };
};

var removeItem = exports.removeItem = function removeItem(id, choiceId) {
  return {
    type: _constants.ACTION_TYPES.REMOVE_ITEM,
    id: id,
    choiceId: choiceId
  };
};

var highlightItem = exports.highlightItem = function highlightItem(id, highlighted) {
  return {
    type: _constants.ACTION_TYPES.HIGHLIGHT_ITEM,
    id: id,
    highlighted: highlighted
  };
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addGroup = undefined;

var _constants = __webpack_require__(1);

/* eslint-disable import/prefer-default-export */
var addGroup = exports.addGroup = function addGroup(value, id, active, disabled) {
  return {
    type: _constants.ACTION_TYPES.ADD_GROUP,
    value: value,
    id: id,
    active: active,
    disabled: disabled
  };
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* eslint-disable import/prefer-default-export */
var clearAll = exports.clearAll = function clearAll() {
  return {
    type: 'CLEAR_ALL'
  };
};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/* eslint-disable */
(function () {
  // Production steps of ECMA-262, Edition 6, 22.1.2.1
  // Reference: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-array.from
  if (!Array.from) {
    Array.from = function () {
      var toStr = Object.prototype.toString;

      var isCallable = function isCallable(fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };

      var toInteger = function toInteger(value) {
        var number = Number(value);
        if (isNaN(number)) {
          return 0;
        }
        if (number === 0 || !isFinite(number)) {
          return number;
        }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };

      var maxSafeInteger = Math.pow(2, 53) - 1;

      var toLength = function toLength(value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };

      // The length property of the from method is 1.
      return function from(arrayLike /* , mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;

        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);

        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }

        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T = void 0;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }

          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }

        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);

        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);

        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue = void 0;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    }();
  }

  // Reference: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  if (!Array.prototype.find) {
    Array.prototype.find = function (predicate) {
      'use strict';

      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value = void 0;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }

  function CustomEvent(event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

/***/ })
/******/ ]);
});
//# sourceMappingURL=choices.js.map