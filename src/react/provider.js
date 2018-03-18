const React = require('react');
const PropTypes = require('prop-types');

function StyleAdapterProvider(props) {
  React.Component.call(this, props);
  this.adapter = props.value;
}

StyleAdapterProvider.prototype = Object.create(React.Component.prototype, {
  getChildContext: {
    value: function() {
      return { adapter: this.adapter };
    },
  },
  render: {
    value: function render() {
      return this.props.children;
    },
  },
});

StyleAdapterProvider.prototype.constructor = StyleAdapterProvider;

StyleAdapterProvider.propTypes = {
  value: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

StyleAdapterProvider.childContextTypes = {
  adapter: PropTypes.object.isRequired,
};

module.exports = StyleAdapterProvider;
