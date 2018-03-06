const Style = require('../style');

function isStyle() {
  return true;
}

class StylePredicator extends Style {
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
