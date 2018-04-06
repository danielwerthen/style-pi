export const prefixes = Symbol('PREFIX_STORE');
export const suffixes = Symbol('SUFFIX_STORE');

export function getPrefixes(transformer) {
  return transformer[prefixes];
}

export function getSuffixes(transformer) {
  return transformer[suffixes];
}

export function setPrefixes(Class, value) {
  Reflect.defineProperty(Class.prototype, prefixes, {
    value,
    writable: true,
    enumerable: false,
  });
}

export function setSuffixes(Class, value) {
  Reflect.defineProperty(Class.prototype, suffixes, {
    value,
    writable: true,
    enumerable: false,
  });
}

export function definePrefix(Class, name) {
  const store = Class.prototype[prefixes];
  store.push(name);
}

export function defineSuffix(Class, name) {
  const store = Class.prototype[suffixes];
  store.push(name);
}

export default class Transformer {}

setPrefixes(Transformer, []);
setSuffixes(Transformer, []);
