import { Service, BaseOptions } from '../types';

// Copied from: https://github.com/jonschlinkert/is-plain-object
export function isPlainObject(o: any): o is Object {
  if (!hasObjectPrototype(o)) {
    return false;
  }

  // If has modified constructor
  const ctor = o.constructor;
  if (typeof ctor === 'undefined') {
    return true;
  }

  // If has modified prototype
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }

  // If constructor does not have an Object-specific method
  if (!prot.hasOwnProperty('isPrototypeOf')) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

function isFormData(f: any): f is FormData {
  return hasObjectPrototype(f, 'FormData');
}

/**
 * Hashes the value into a stable hash.
 */
export function stableValueHash(value: any): string {
  return JSON.stringify(value, (_, val) => {
    if (isPlainObject(val)) {
      return Object.keys(val)
        .sort()
        .reduce((result, key) => {
          result[key] = val[key];
          return result;
        }, {} as any);
    }
    if (isFormData(val)) {
      return [...val.entries()].toString();
    }
    return val;
  });
}

export function hasObjectPrototype(o: any, type = 'Object'): boolean {
  return Object.prototype.toString.call(o) === `[object ${type}]`;
}

export function hashQueryKey(service: any): string {
  return stableValueHash(service);
}
export function hashQueryKeyByOptions<R, P extends any[]>(
  service: Service<R, P>,
  options?: BaseOptions<R, P>,
): string {
  const hasFn =
    typeof options?.queryKeyHashFn === 'function' ? options?.queryKeyHashFn : hashQueryKey;
  return hasFn(service);
}
