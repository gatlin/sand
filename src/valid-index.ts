/* eslint-disable @typescript-eslint/no-explicit-any */
type ToString<T extends number> = `${T}`;
type ParseInt<T> = T extends ToString<infer N> ? N : never;

type Indexed<T, K> = K extends `${infer Root}.${infer Rest}`
  ? Root extends keyof T
    ? Indexed<T[Root], Rest>
    : undefined
  : K extends keyof T
    ? T[K]
    : ParseInt<K> extends keyof T
      ? T[ParseInt<K>]
      : undefined;

type ValidIndex<T, K extends string | number> = Indexed<T, K> extends undefined
  ? never
  : K;

function at<K extends string | number, S>(
  path: ValidIndex<S, K>,
  entity: S
): Indexed<S, typeof path> {
  return "number" === typeof path
    ? (entity as any)[path as number]
    : path.split(".").reduce((acc: any, k) => acc[k], entity);
}

function replace<K extends string | number, S, T = S>(
  path: ValidIndex<S, K>,
  value: Indexed<S, typeof path>,
  entity: S
): T {
  const modified = JSON.parse(JSON.stringify(entity));
  if ("number" === typeof path) {
    modified[path] = value;
  }
  else {
    const pathParts = path.split(".");
    const component = pathParts
      .slice(0, -1)
      .reduce((acc: any, k) => acc[k], modified);
    component[pathParts.slice(-1)[0]] = value;
  }
  return modified as T;
}

export type { ToString, ParseInt, Indexed, ValidIndex };
export { at, replace };
