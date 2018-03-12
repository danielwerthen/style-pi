const Style = require('../style');
const { MetaObject } = require('meta-prototype');

function isStyle() {
  return true;
}

class StylePredicator extends MetaObject {
  className() {
    return false;
  }
  children() {
    return false;
  }
  methodMissing() {
    return isStyle;
  }
}

Style.applyAffixes(StylePredicator, {
  on_: () => false,
});

module.exports = StylePredicator;
