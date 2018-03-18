const React = require('react');
const ReactDOMServer = require('react-dom/server');
const createComponent = require('./create-component');
const Style = require('../style');
const StyletronAdapter = require('../adapters/styletron-adapter');
const Provider = require('./provider');
const Styletron = require('styletron-engine-atomic').Server;

describe('create component', () => {
  const styletron = new Styletron();
  const adapter = new StyletronAdapter(styletron);

  class CustomStyle extends Style {}

  const MyComponent = createComponent({ Style: CustomStyle })('div');
  const result = ReactDOMServer.renderToString(
    React.createElement(Provider, {
      value: adapter,
      children: React.createElement(MyComponent, {
        fontSize: '12px',
        className: 'not-styletron',
        onClick: function() {},
        children: 'This is an element',
      }),
    }),
  );

  it('should render ok', () => {
    expect(result).toMatchSnapshot();
  });

  it('should produce valid css', () => {
    expect(styletron.getCss()).toMatchSnapshot();
  });
});
