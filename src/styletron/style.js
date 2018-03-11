const BaseStyle = require('../style');
const prefixAll = require('inline-style-prefixer/static');

const uppercasePattern = /[A-Z]/g;
const msPattern = /^ms-/;
const cache = {};

function hyphenateStyleName(prop) {
  return prop in cache
    ? cache[prop]
    : (cache[prop] = prop
        .replace(uppercasePattern, '-$&')
        .toLowerCase()
        .replace(msPattern, '-ms-'));
}

function prepareBlock(property, value) {
  const prefixed = prefixAll({ [property]: value });
  return Object.keys(prefixed)
    .map(key => {
      const val = prefixed[key];
      const hyphenated = hyphenateStyleName(key);
      if (Array.isArray(val)) {
        return val.map(item => `${hyphenated}:${item}`).join(';');
      }
      return `${hyphenated}:${val}`;
    })
    .join(';');
}

function injectStyle(styletron, style) {
  const { media = '', pseudo, property, value } = style;
  const cache = styletron.styleCache.getCache(media);

  const key = `${property}${pseudo}:${value}`;

  const cachedId = cache.cache[key];
  if (cachedId !== void 0) {
    return cachedId;
  }
  const block = prepareBlock(property, value);
  return cache.addValue(key, { pseudo, block });
}

const STYLETRON_STORE = Symbol('Styletron store');

module.exports = class StyletronStyle extends BaseStyle {
  constructor(styletron) {
    super();
    this[STYLETRON_STORE] = styletron;
  }

  defaultStyle(arg) {
    return BaseStyle.prototype.defaultStyle.call(this, arg);
  }

  methodMissing(property) {
    return function(value) {
      const styletron = this[STYLETRON_STORE];
      if (typeof value !== 'object') {
        return injectStyle(styletron, {
          property,
          value,
        });
      }
      return injectStyle(
        styletron,
        Object.assign(
          {
            property,
          },
          value,
        ),
      );
    };
  }
};
