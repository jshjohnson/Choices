/* eslint-disable */
(function () {
  // Reference: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/find
  if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
      'use strict';

      if (this == null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      let list = Object(this);
      let length = list.length >>> 0;
      let thisArg = arguments[1];
      let value;

      for (let i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }

  function CustomEvent (event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined,
    };
    let evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}());
