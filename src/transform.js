import { getPrefixes, getSuffixes, addToStack, getStack } from './transformer';

function capitalize(str) {
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function decapitalize(str) {
  return str.substr(0, 1).toLowerCase() + str.substr(1);
}

function isPrefixed(key, prefixes) {
  const keyLength = key.length;
  for (var id in prefixes) {
    const prefix = prefixes[id];
    if (prefix.length < keyLength && key.startsWith(prefix)) {
      return prefix;
    }
  }
}

function isSuffixed(key, suffixes) {
  const keyLength = key.length;
  for (var id in suffixes) {
    const suffix = suffixes[id];
    if (suffix.length >= keyLength) {
      continue;
    }
    if (key.endsWith(suffix)) {
      return suffix;
    }
  }
}

function define(transformer, key, method) {
  Reflect.defineProperty(Reflect.getPrototypeOf(transformer), key, {
    value: method,
  });
  return method;
}

function extendMethod(method, item) {
  return function(...args) {
    const value = method.apply(this, args);
    const inner = value[item];
    delete value[item];
    return {
      [item]: {
        ...value,
        ...inner,
      },
    };
  };
}

function findMethod(transformer, key, prefixes, suffixes) {
  let prefix, suffix;
  if (Reflect.has(transformer, key)) {
    return transformer[key];
  } else if ((prefix = isPrefixed(key, prefixes))) {
    const innerKey = decapitalize(key.substr(prefix.length));
    const innerMethod = findMethod(transformer, innerKey, prefixes, suffixes);
    const method = extendMethod(innerMethod, prefix);
    return define(transformer, key, method);
  } else if ((suffix = isSuffixed(key, suffixes))) {
    const innerKey = key.substr(0, key.length - suffix.length);
    const innerMethod = findMethod(transformer, innerKey, prefixes, suffixes);
    const method = extendMethod(innerMethod, suffix);
    return define(transformer, key, method);
  } else {
    return define(transformer, key, function(value) {
      return {
        [key]: value,
      };
    });
  }
}

function deepAssign(target = {}, source = {}, isDeep) {
  for (var key in source) {
    if (isDeep(key)) {
      target[key] = deepAssign(target[key], source[key], isDeep);
    } else {
      target[key] = source[key];
    }
  }
  return target;
}

export default function transform(transformer, props) {
  const output = {};
  const prefixes = getPrefixes(transformer);
  const suffixes = getSuffixes(transformer);
  return Object.keys(props)
    .map(key => {
      const method = findMethod(transformer, key, prefixes, suffixes);
      return method.call(transformer, props[key]);
    })
    .reduce(function(target, item) {
      return deepAssign(target, item, key => prefixes.indexOf(key) > -1);
    }, {});
}
