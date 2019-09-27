window.delegateEvent = (function delegateEvent() {
  let events;
  let addedListenerTypes;
  if (typeof events === 'undefined') {
    events = new Map();
  }
  if (typeof addedListenerTypes === 'undefined') {
    addedListenerTypes = [];
  }

  function _callback(event) {
    const type = events.get(event.type);
    if (!type) return;
    type.forEach(fn => fn(event));
  }

  return {
    add: function add(type, fn) {
      // Cache list of events.
      if (events.has(type)) {
        events.get(type).push(fn);
      } else {
        events.set(type, [fn]);
      }
      // Setup events.
      if (addedListenerTypes.indexOf(type) === -1) {
        document.documentElement.addEventListener(type, _callback, true);
        addedListenerTypes.push(type);
      }
    },
    remove: function remove(type, fn) {
      if (!events.get(type)) return;
      events.set(type, events.get(type).filter(item => item !== fn));
      if (!events.get(type).length) {
        addedListenerTypes.splice(addedListenerTypes.indexOf(type), 1);
      }
    },
  };
})();
