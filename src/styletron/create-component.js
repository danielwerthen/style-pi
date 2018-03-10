const React = require('react');
const createReactComponent = require('../react/create-component');
const PropTypes = require('prop-types');

module.exports = function createComponent(options) {
  const Style = options.Style;
  return Component => {
    const StyletronComponent = createReactComponent(options)(Component);
    StyletronComponent.contextTypes = Object.assign(
      {
        styletron: PropTypes.object,
      },
      StyletronComponent.contextTypes,
    );
    StyletronComponent.prototype.initStyle = function initStyle(
      props,
      { styletron },
    ) {
      return new Style(styletron);
    };

    return StyletronComponent;
  };
};
