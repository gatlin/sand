import type { IdHKT, ConstHKT } from "./focus";
import { Id, Const } from "./focus";
import type { Indexed, ValidIndex } from "./valid-index";
import { at, replace } from "./valid-index";
import type { $, HKT } from "./hkt";

interface Getter<S, A> {
  (f: (a: A) => Const<A, A>): (s: S) => Const<A, S>;
}

function view<S, A>(getter: Getter<S, A>): (s: S) => A {
  return (entity) => getter((v) => new Const(v))(entity).value;
}

interface Setter<S, T, A, B> {
  (f: (a: A) => Id<B>): (s: S) => Id<T>;
}
type Setter_<S, A> = Setter<S, S, A, A>;

function over<S, T, A, B>(
  setter: Setter<S, T, A, B>
): (f: (a: A) => B) => (s: S) => T {
  return (fn) => (entity) => setter((v) => new Id(fn(v)))(entity).value;
}

interface Optic<F extends HKT, S, T, A, B> {
  (f: (a: A) => $<F, B>): (s: S) => $<F, T>;
}

type Lens<S, T, A, B> = Optic<ConstHKT | IdHKT, S, T, A, B>;
type Lens_<S, A> = Lens<S, S, A, A>;

function atL<
  K extends string | number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  S extends Record<string | number, any>,
  T = S
>(
  index: ValidIndex<S, K>
): Lens<S, T, Indexed<S, typeof index>, Indexed<T, typeof index>> {
  return (f) => (entity) =>
    f(at<K, S>(index, entity)).map((v) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      replace<K, S, T>(index, v as any, entity)
    );
}

type Traversal<S, T, A, B> = Optic<IdHKT, S, T, A, B>;
type Traversal_<S, A> = Traversal<S, S, A, A>;

function arrayWhereT<A>(pred: (a: A) => boolean): Traversal_<A[], A> {
  return (fn) => (arr) =>
    arr.reduceRight(
      (acc: Id<A[]>, cur: A) =>
        acc
          .map((arr_) => (x: A) => [x, ...arr_])
          .ap(pred(cur) ? fn(cur) : new Id(cur)),
      new Id([])
    );
}

// Traversal which targets each item in an Array.
function arrayEachT<A, B>(): Traversal<A[], B[], A, B> {
  return (fn) => (arr) => {
    return arr.reduceRight(
      (acc: Id<Array<B>>, cur: A) =>
        acc.map((arr_) => (x: B) => [x, ...arr_]).ap(fn(cur)),
      new Id([])
    );
  };
}

export { Optic, Lens, Lens_, Getter, Setter, Setter_, Traversal, Traversal_ };
export { atL, over, view, arrayEachT, arrayWhereT };
