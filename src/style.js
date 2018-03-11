const { MetaObject } = require('meta-prototype');

function prefixPredicate(prefix, str) {
  if (str.startsWith(prefix)) {
    const rest = str.substr(prefix.length);
    return rest.substr(0, 1).toLowerCase() + rest.substr(1);
  }
}
function suffixPredicate(suffix, str) {
  if (str.endsWith(suffix.substr(0, 1).toUpperCase() + suffix.substr(1))) {
    return str.substr(0, str.length - suffix.length);
  }
}

function defaultGetAffixPredicate(str) {
  if (str.endsWith('_')) {
    return [str.substr(0, str.length - 1), prefixPredicate];
  } else if (str.startsWith('_')) {
    return [str.substr(1, 1).toLowerCase() + str.substr(2), suffixPredicate];
  }
  throw new Error('Unknown affix predicate string');
}

module.exports = class Style extends MetaObject {
  spread(style) {
    return Object.keys(style)
      .map(key => this[key](style[key]))
      .join(' ');
  }
  defaultStyle(style) {
    return this.spread(style);
  }
  static wrapMethodMissing(to, fn) {
    const inner = to.prototype.methodMissing;
    to.prototype.methodMissing = function methodMissing(...args) {
      const result = fn(...args);
      if (result === undefined) {
        return inner(...args);
      }
      return result;
    };
  }
  static applyAffixes(to, map, getAffixPredicate = defaultGetAffixPredicate) {
    const keys = Object.keys(map);
    const predicates = keys.map(key => [key, getAffixPredicate(key)]);
    Style.wrapMethodMissing(to, function appliedAffixes(methodName) {
      for (var i = 0; i < predicates.length; i++) {
        const [modKey, [affix, predicate]] = predicates[i];
        const innerName = predicate(affix, methodName);
        if (!innerName) {
          continue;
        }
        const modifier = map[modKey];
        return function method(value) {
          return this[innerName](modifier(affix, value));
        };
      }
      return undefined;
    });
  }
};
