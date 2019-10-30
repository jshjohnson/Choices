/* eslint-disable no-param-reassign */

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM(
  '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>',
  {
    pretendToBeVisual: true,
  },
);
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

function ignoreExtensions(extensions = [], returnValue = {}) {
  function noop() {
    return returnValue;
  }

  extensions.forEach(ext => {
    require.extensions[ext] = noop;
  });
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.CustomEvent = window.CustomEvent;
global.Element = window.Element;
global.HTMLElement = window.HTMLElement;
global.Option = window.Option;
global.HTMLOptionElement = window.HTMLOptionElement;
global.HTMLOptGroupElement = window.HTMLOptGroupElement;
global.HTMLSelectElement = window.HTMLSelectElement;
global.HTMLInputElement = window.HTMLInputElement;
global.DocumentFragment = window.DocumentFragment;
global.requestAnimationFrame = window.requestAnimationFrame;
window.matchMedia = () => true;

copyProps(window, global);

ignoreExtensions(['.scss', '.css']);
ignoreExtensions(['.jpg', '.png', '.svg'], '');
