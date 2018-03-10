const Style = require('./style');

describe('Style', () => {
  describe('Basic class', () => {
    class MyStyle extends Style {
      methodMissing(name) {
        return input => {
          if (typeof input !== 'object') {
            return { [name]: input };
          }
          const { value, ...rest } = input;
          return {
            [name]: value,
            ...rest,
          };
        };
      }
    }

    function media(media, value) {
      if (typeof value !== 'object') {
        return {
          media,
          value,
        };
      }
      return {
        media,
        ...value,
      };
    }

    function size(size, value) {
      if (typeof value !== 'object') {
        return {
          size,
          value,
        };
      }
      return {
        size,
        ...value,
      };
    }

    Style.applyAffixes(MyStyle, {
      small_: media,
      medium_: media,
      large_: media,
      _Maximum: size,
      _MinimumSize: size,
    });

    it('should handle straight call', () => {
      const myStyle = new MyStyle();
      expect(myStyle.fontSize('14px')).toEqual({ fontSize: '14px' });
    });

    it('should handle prefix modifications', () => {
      const myStyle = new MyStyle();
      expect(myStyle.smallFontSize('14px')).toEqual({
        fontSize: '14px',
        media: 'small',
      });
    });
    it('should handle suffix modifications', () => {
      const myStyle = new MyStyle();
      expect(myStyle.fontSizeMinimumSize('14px')).toEqual({
        fontSize: '14px',
        size: 'minimumSize',
      });
    });
    it('should handle prefix and suffix modifications', () => {
      const myStyle = new MyStyle();
      expect(myStyle.mediumFontSizeMinimumSize('14px')).toEqual({
        fontSize: '14px',
        media: 'medium',
        size: 'minimumSize',
      });
    });
  });
});
