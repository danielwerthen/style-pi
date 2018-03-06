const BaseStyle = require('../style');

module.exports = class StyletronStyle extends BaseStyle {
  methodMissing(property) {
    return function(value) {
      return {
        property,
        value,
      };
    };
  }
};
