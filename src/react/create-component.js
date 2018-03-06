const React = require('react');
const DefaultStylePredicator = require('./style-predicator');

module.exports = function createComponent(options) {
  const { Style, StylePredicator = DefaultStylePredicator } = options;
  const stylePredicator = new StylePredicator();

  return Component =>
    class StyledComponent extends React.PureComponent {
      constructor(props) {
        super(props);
        this.style = new Style();
      }
      applyStyle(propName, value) {
        return this.style[propName](value);
      }
      mergeProp(output, key, value) {
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
      }
      mapProps(props) {
        const output = {};
        for (var key in props) {
          if (stylePredicator[key]()) {
            const className = this.applyStyle(key, props[key]);
            this.mergeProp(output, 'className', className);
          } else {
            this.mergeProp(output, key, props[key]);
          }
        }
        return output;
      }
      render() {
        const props = this.mapProps(this.props);
        return React.createElement(Component, props);
      }
    };
};
