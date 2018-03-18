const { MetaObject } = require('meta-prototype');
const { addPrefixMethods } = require('meta-prototype/src/utils');

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
    enumerable: true,
  },
  children: {
    value: isNotStyle,
    writable: true,
    enumerable: true,
  },
  methodMissing: {
    value: function() {
      return isStyle;
    },
    writable: true,
    enumerable: true,
  },
});

StylePredicator.prototype.constructor = StylePredicator;

addPrefixMethods(StylePredicator, ['on'], isNotStyle);

module.exports = StylePredicator;
