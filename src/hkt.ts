declare const Type: unique symbol;
declare const Variable: unique symbol;
declare const Indirect: unique symbol;

interface HKT {
  [Variable]: unknown;
  [Type]?: unknown;
}

type $<T extends HKT, A> = T extends { [Type]: unknown }
  ? (T & {
    [Variable]: A;
  })[typeof Type]
  : {
    [Indirect]: T; // forces tsc to retain reference to T
    [Variable]: A;
  };

interface Functor<T extends HKT> {
  map<B>(
    f: (a: T[typeof Variable]) => B
  ): $<T,B> ;
}

interface Apply<T extends HKT> extends Functor<T> {
  ap<A,B>(
    this: $<T, (a: A) => B>,
    arg: $<T,A>
  ): $<T,B> ;
}

export type {
  Type,
  Variable,
  HKT,
  $,
  Apply,
  Functor
};

