const React = require('react');
const ReactDOMServer = require('react-dom/server');
const createComponent = require('./create-component');
const Style = require('./style');
const Provider = require('./provider');
const Styletron = require('styletron-engine-atomic').Server;

describe('CreateComponent', () => {
  describe('Simple scenario', () => {
    class MyStyle extends Style {}

    it('should work', () => {
      const Component = createComponent({
        Style: MyStyle,
      })('div');
      const styletron = new Styletron();
      const result = ReactDOMServer.renderToString(
        React.createElement(Provider, {
          value: styletron,
          children: React.createElement(Component, {
            children: 'Daniel',
            fontSize: '14px',
            fontFamily: 'Comic Sans',
          }),
        }),
      );

      expect(result).toMatchSnapshot();
      expect(styletron.getCss()).toMatchSnapshot();
    });
  });
});
