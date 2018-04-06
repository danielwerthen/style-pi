export const prefixes = Symbol('PREFIX_STORE');
export const suffixes = Symbol('SUFFIX_STORE');
export const stack = Symbol('STACK_STORE');

export function getPrefixes(transformer) {
  return transformer[prefixes];
}

export function getSuffixes(transformer) {
  return transformer[suffixes];
}

export function addToStack(transformer, item) {
  return transformer[stack].push(item);
}

export function getStack(transformer) {
  return transformer[stack];
}

export default class Transformer {
  constructor(options = {}) {
    this[prefixes] = options.prefixes || [];
    this[suffixes] = options.suffixes || [];
    this[stack] = [];
  }
}
