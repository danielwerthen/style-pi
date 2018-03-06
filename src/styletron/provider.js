const React = require('react');
const PropTypes = require('prop-types');

class StyletronProvider extends React.Component {
  getChildContext() {
    return { styletron: this.styletron };
  }
  constructor(props) {
    super(props);
    this.styletron = props.value;
  }
  render() {
    return this.props.children;
  }
}

StyletronProvider.propTypes = {
  value: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

StyletronProvider.childContextTypes = {
  styletron: PropTypes.object.isRequired,
};

module.exports = StyletronProvider;
