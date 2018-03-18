'use strict';

var _require = require('meta-prototype'),
    MetaObject = _require.MetaObject;

var _require2 = require('meta-prototype/src/utils'),
    addPrefixMethods = _require2.addPrefixMethods;

function isStyle() {
  return true;
}
function isNotStyle() {
  return false;
}

function StylePredicator() {}

StylePredicator.prototype = Object.create(MetaObject.prototype, {
  className: {
    value: isNotStyle,
    writable: true,
    enumerable: true
  },
  children: {
    value: isNotStyle,
    writable: true,
    enumerable: true
  },
  methodMissing: {
    value: function value() {
      return isStyle;
    },
    writable: true,
    enumerable: true
  }
});

StylePredicator.prototype.constructor = StylePredicator;

addPrefixMethods(StylePredicator, ['on'], isNotStyle);

module.exports = StylePredicator;