import { MetaObject } from 'meta-prototype';

class Style extends MetaObject {
  constructor({
    breakpoints,
    pseudo = ['hover', 'active', 'focus', 'disabled'],
  }) {}
  methodMissing(name) {
    if (name.startsWith('foobar')) {
      return () => test;
    }
  }
}
