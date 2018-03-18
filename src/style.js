const { MetaObject } = require('meta-prototype');
const { modifiers, adapter } = require('./constants');

function Style(styleAdapter) {
  MetaObject.call(this);
  this[adapter] = styleAdapter;
  this[modifiers] = [];
}

Style.prototype = Object.create(MetaObject.prototype, {
  addModifier: {
    value: function addModifier(name, value) {
      this[modifiers].push({ [name]: value });
    },
  },

  spread: {
    value: function spread(style) {
      const mods = this[modifiers].slice(0);
      return Object.keys(style)
        .map(key => {
          this[modifiers] = mods.slice(0);
          return this[key](style[key]);
        })
        .join(' ');
    },
  },

  defaultStyle: {
    value: function defaultStyle(style) {
      return this.spread(style);
    },
  },

  methodMissing: {
    value: function methodMissing(property) {
      return function(value) {
        const styleAdapter = this[adapter];
        this[modifiers].push({ property, value });
        return styleAdapter.injectStyle(
          Object.assign.apply(null, this[modifiers].splice(0)),
        );
      };
    },
  },
});

Style.prototype.constructor = Style;

module.exports = Style;
