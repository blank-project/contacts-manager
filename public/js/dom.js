// Polyfill for Element.matches
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
                              Element.prototype.webkitMatchesSelector ||
                              Element.prototype.mozMatchesSelector;
}

// Polyfill for Element.closest
if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
      var el = this;
      var ancestor = this;
      if (!document.documentElement.contains(el)) return null;
      do {
          if (ancestor.matches(s)) return ancestor;
          ancestor = ancestor.parentElement;
      } while (ancestor !== null);
      return null;
  };
}

function closest(node, s, stop) {
    var el = node;
    var ancestor = node;
    if (!document.documentElement.contains(el)) return null;
    do {
        if (ancestor.matches(s)) return ancestor;
        if (typeof stop === 'string' && ancestor.matches(stop)) return null;
        if (stop && ancestor === stop) return null;
        ancestor = ancestor.parentElement;
    } while (ancestor !== null);
    return null;
};

function delegate(node, event, selector, listener) {
  node.addEventListener(event, function(e) {
    var target = e.target, el;
    el = closest(target, selector, node);
    if (!el) {
      return;
    }
    e.actualTarget = el;
    listener(e);
  });
}
