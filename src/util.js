


let transitionEvent = (function() {
  let t;
  let el = document.createElement('fakeelement');

  let transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd'
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
})();

export function handleEventListeners(element, eventName, trigger, validate) {
  return new Promise( resolve => {
    element.addEventListener(eventName, _handler, true);
    trigger && trigger();

    function _handler($event) {
      if (validate && validate(event)) return done();
      return done($event);
    }

    function done($event) {
      element.removeEventListener(eventName, _handler, true);
      resolve($event);
    }
  });
}
