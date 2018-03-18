'use strict';

var StyleAdapter = require('../style-adapter');
var prefixAll = require('inline-style-prefixer/static');

var uppercasePattern = /[A-Z]/g;
var msPattern = /^ms-/;
var cache = {};

function hyphenateStyleName(prop) {
  return prop in cache ? cache[prop] : cache[prop] = prop.replace(uppercasePattern, '-$&').toLowerCase().replace(msPattern, '-ms-');
}

function prepareBlock(property, value) {
  var obj = {};
  obj[property] = value;
  var prefixed = prefixAll(obj);
  return Object.keys(prefixed).map(function (key) {
    var val = prefixed[key];
    var hyphenated = hyphenateStyleName(key);
    if (Array.isArray(val)) {
      return val.map(function (item) {
        return hyphenated + ':' + item;
      }).join(';');
    }
    return hyphenated + ':' + val;
  }).join(';');
}

function injectStyle(styletron, style) {
  var _style$media = style.media,
      media = _style$media === undefined ? '' : _style$media,
      pseudo = style.pseudo,
      property = style.property,
      value = style.value;

  var cache = styletron.styleCache.getCache(media);

  var key = '' + property + pseudo + ':' + value;

  var cachedId = cache.cache[key];
  if (cachedId !== void 0) {
    return cachedId;
  }
  var block = prepareBlock(property, value);
  return cache.addValue(key, { pseudo: pseudo, block: block });
}

function StyletronAdapter(styletron) {
  StyleAdapter.call(this);
  this.styletron = styletron;
}

StyletronAdapter.prototype = Object.create(StyleAdapter.prototype, {
  injectStyle: {
    value: function injectStyleMethod(style) {
      return injectStyle(this.styletron, style);
    }
  }
});

StyletronAdapter.prototype.constructor = StyletronAdapter;

module.exports = StyletronAdapter;