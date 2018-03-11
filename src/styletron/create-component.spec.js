const React = require('react');
const ReactDOMServer = require('react-dom/server');
const createComponent = require('./create-component');
const Style = require('./style');
const Provider = require('./provider');
const Styletron = require('styletron-engine-atomic').Server;

describe('CreateComponent', () => {
  describe('Simple scenario', () => {
    class MyStyle extends Style {
      defaultStyle(style) {
        return super.defaultStyle({
          ...style,
          border: '1px solid black',
        });
      }
    }

    const breakpoints = {
      small: '(max-width: 800px)',
      large: '(min-width: 801px)',
    };
    function media(media, value) {
      return {
        media: breakpoints[media],
        value,
      };
    }

    Style.applyAffixes(MyStyle, {
      small_: media,
      large_: media,
    });

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
            smallFontSize: '18px',
            fontFamily: 'Comic Sans',
            display: 'flex',
          }),
        }),
      );

      expect(result).toMatchSnapshot();
      expect(styletron.getCss()).toMatchSnapshot();
    });
  });
});
