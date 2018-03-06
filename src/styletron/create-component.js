const React = require('react');
const createReactComponent = require('../react/create-component');
const PropTypes = require('prop-types');

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

module.exports = function createComponent(options) {
  return Component => {
    const StyletronComponent = createReactComponent(options)(Component);
    StyletronComponent.contextTypes = {
      ...StyletronComponent.contextTypes,
      styletron: PropTypes.object,
    };
    StyletronComponent.prototype.applyStyle = function applyStyletron(
      propName,
      input,
    ) {
      const { media = '', pseudo, property, value } = this.style[propName](
        input,
      );
      const cache = this.context.styletron.styleCache.getCache(media);

      const key = `${property}${pseudo}:${value}`;

      const cachedId = cache.cache[key];
      if (cachedId !== void 0) {
        return cachedId;
      }
      const block = `${hyphenateStyleName(property)}:${value}`;
      return cache.addValue(key, { pseudo, block });
    };

    return StyletronComponent;
  };
};
