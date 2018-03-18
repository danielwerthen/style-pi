const React = require('react');
const PropTypes = require('prop-types');
const DefaultStylePredicator = require('../style-predicator');

module.exports = function createComponent(options) {
  const {
    Style,
    StylePredicator = DefaultStylePredicator,
    BaseComponent = React.PureComponent,
  } = options;
  const stylePredicator = new StylePredicator();

  return function(Component) {
    function StyledComponent(props, context) {
      BaseComponent.call(this, props, context);
      this.style = new Style(context.adapter);
    }

    StyledComponent.prototype = Object.create(BaseComponent.prototype, {
      mergeProp: {
        value: function(output, key, value) {
          if (key === 'className') {
            if (output.className) {
              if (value) {
                output.className += ' ' + value;
              }
            } else if (value) {
              output.className = value;
            }
          } else {
            output[key] = value;
          }
        },
        writable: true,
        enumerable: true,
      },
      mapProps: {
        value: function(props) {
          const output = {};
          for (var key in props) {
            if (stylePredicator[key]()) {
              const className = this.style[key](props[key]);
              this.mergeProp(output, 'className', className);
            } else {
              this.mergeProp(output, key, props[key]);
            }
          }
          return output;
        },
        writable: true,
        enumerable: true,
      },
      render: {
        value: function() {
          const props = this.mapProps(this.props);
          return React.createElement(Component, props);
        },
        writable: true,
        enumerable: true,
      },
    });

    StyledComponent.prototype.constructor = StyledComponent;

    StyledComponent.contextTypes = {
      adapter: PropTypes.object,
    };
    return StyledComponent;
  };
};
