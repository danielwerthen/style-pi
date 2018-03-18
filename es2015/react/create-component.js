'use strict';

var React = require('react');
var PropTypes = require('prop-types');
var DefaultStylePredicator = require('../style-predicator');

module.exports = function createComponent(options) {
  var Style = options.Style,
      _options$StylePredica = options.StylePredicator,
      StylePredicator = _options$StylePredica === undefined ? DefaultStylePredicator : _options$StylePredica,
      _options$BaseComponen = options.BaseComponent,
      BaseComponent = _options$BaseComponen === undefined ? React.PureComponent : _options$BaseComponen;

  var stylePredicator = new StylePredicator();

  return function (Component) {
    function StyledComponent(props, context) {
      BaseComponent.call(this, props, context);
      this.style = new Style(context.adapter);
    }

    StyledComponent.prototype = Object.create(BaseComponent.prototype, {
      mergeProp: {
        value: function value(output, key, _value) {
          if (key === 'className') {
            if (output.className) {
              if (_value) {
                output.className += ' ' + _value;
              }
            } else if (_value) {
              output.className = _value;
            }
          } else {
            output[key] = _value;
          }
        },
        writable: true,
        enumerable: true
      },
      mapProps: {
        value: function value(props) {
          var output = {};
          for (var key in props) {
            if (stylePredicator[key]()) {
              var className = this.style[key](props[key]);
              this.mergeProp(output, 'className', className);
            } else {
              this.mergeProp(output, key, props[key]);
            }
          }
          return output;
        },
        writable: true,
        enumerable: true
      },
      render: {
        value: function value() {
          var props = this.mapProps(this.props);
          return React.createElement(Component, props);
        },
        writable: true,
        enumerable: true
      }
    });

    StyledComponent.prototype.constructor = StyledComponent;

    StyledComponent.contextTypes = {
      adapter: PropTypes.object
    };
    return StyledComponent;
  };
};