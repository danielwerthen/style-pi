const Style = require('./style');
const {
  addPrefixedMethod,
  addSuffixedMethod,
} = require('meta-prototype/src/utils');
const Styletron = require('styletron-engine-atomic').Server;
const StyletronAdapter = require('./adapters/styletron-adapter');

describe('Style', () => {
  class Level1 extends Style {}

  const breakpoints = {
    small: '(max-width: 768px)',
    large: '(min-width: 769px)',
  };

  addPrefixedMethod(Level1, ['small', 'large'], function(media, value) {
    this.addModifier('media', breakpoints[media]);
    return value;
  });

  addSuffixedMethod(Level1, ['hover'], function(pseudo, value) {
    this.addModifier('pseudo', ':' + pseudo);
    return value;
  });

  class Level2 extends Level1 {
    foobar() {
      return this.spread({
        fontSize: '12px',
      });
    }
  }

  describe('instance of level2', () => {
    it('should use the base level defaultStyle', () => {
      const styletron = new Styletron();
      const adapter = new StyletronAdapter(styletron);
      const instance = new Level2(adapter);
      expect(instance.foobar()).toMatchSnapshot();
      expect(styletron.getCss()).toMatchSnapshot();
    });
  });

  describe('instance of level1', () => {
    it('should use the media prefixes and pseudo suffixes', () => {
      const styletron = new Styletron();
      const adapter = new StyletronAdapter(styletron);
      const instance = new Level1(adapter);
      expect(instance.smallFontSizeHover('13px')).toMatchSnapshot();
      expect(styletron.getCss()).toMatchSnapshot();
    });
  });
});
