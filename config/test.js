const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
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

  extensions.forEach((ext) => {
    require.extensions[ext] = noop;
  });
}

function mockRAF(global) {
  let callbacksQueue = [];

  global.setInterval(() => {
    for (let i = 0; i < callbacksQueue.length; i++) {
      if (callbacksQueue[i] !== false) {
        callbacksQueue[i].call(null);
      }
    }

    callbacksQueue = [];
  }, 1000 / 60);

  global.requestAnimationFrame = callback => callbacksQueue.push(callback) - 1;

  global.cancelAnimationFrame = (id) => {
    callbacksQueue[id] = false;
  };
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js',
};
global.HTMLElement = window.HTMLElement;

copyProps(window, global);
mockRAF(global);

ignoreExtensions(['.scss', '.css']);
ignoreExtensions(['.jpg', '.png', '.svg'], '');
