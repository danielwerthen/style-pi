import transform from './transform';
import BaseTransformer, { definePrefix } from './transformer';

class Transformer extends BaseTransformer {
  foobar(value) {
    return transform(this, {
      color: 'blue',
      smallFooz: 'foobar',
    });
  }
  fooz(value) {
    return transform(this, {
      color: 'blue',
      smallBaz: 'fooz',
    });
  }
  baz(value) {
    return transform(this, {
      color: 'blue',
      smallBackground: 'baz',
    });
  }
}

definePrefix(Transformer, 'small');

describe('Transformer', () => {
  it('should transform simple', () => {
    const transformer = new Transformer();
    expect(
      transform(transformer, {
        smallColor: 'red',
        foobar: 'blue',
      }),
    ).toEqual({
      color: 'blue',
      small: {
        background: 'baz',
        color: 'blue',
      },
    });
  });
});
