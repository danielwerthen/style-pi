'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('meta-prototype'),
    MetaObject = _require.MetaObject;

var _require2 = require('./constants'),
    modifiers = _require2.modifiers,
    adapter = _require2.adapter;

function Style(styleAdapter) {
  MetaObject.call(this);
  this[adapter] = styleAdapter;
  this[modifiers] = [];
}

Style.prototype = Object.create(MetaObject.prototype, {
  addModifier: {
    value: function addModifier(name, value) {
      this[modifiers].push(_defineProperty({}, name, value));
    }
  },

  spread: {
    value: function spread(style) {
      var _this = this;

      var mods = this[modifiers].slice(0);
      return Object.keys(style).map(function (key) {
        _this[modifiers] = mods.slice(0);
        return _this[key](style[key]);
      }).join(' ');
    }
  },

  defaultStyle: {
    value: function defaultStyle(style) {
      return this.spread(style);
    }
  },

  methodMissing: {
    value: function methodMissing(property) {
      return function (value) {
        var styleAdapter = this[adapter];
        this[modifiers].push({ property: property, value: value });
        return styleAdapter.injectStyle(Object.assign.apply(null, this[modifiers].splice(0)));
      };
    }
  }
});

Style.prototype.constructor = Style;

module.exports = Style;