const React = require('react');
const ShallowRenderer = require('react-test-renderer/shallow');
const createComponent = require('./create-component');
const Style = require('../style');

describe('CreateComponent', () => {
  describe('Simple scenario', () => {
    class MyStyle extends Style {
      methodMissing(name) {
        return value => `${name}: ${value}`;
      }
    }

    it('should work', () => {
      const renderer = new ShallowRenderer();
      const Component = createComponent({
        Style: MyStyle,
      })('div');
      renderer.render(
        React.createElement(Component, {
          children: 'Daniel',
          fontSize: '14px',
          fontFamily: 'Comic Sans',
        }),
      );
      const result = renderer.getRenderOutput();

      expect(result).toMatchSnapshot();
    });
  });
});
