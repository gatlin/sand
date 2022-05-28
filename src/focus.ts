import type { HKT, Variable, Type, Apply, Functor } from "./hkt";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
abstract class Focus<A, _B = A> {
  constructor(public readonly value: A) {}
}

interface IdHKT extends HKT {
  [Type]: Id<this[typeof Variable]>;
}

class Id<A> extends Focus<A, A> implements Apply<IdHKT> {
  map<B>(f: (a: A) => B): Id<B> {
    return new Id(f(this.value));
  }

  ap<B, C>(this: Id<(b: B) => C>, other: Id<B>): Id<C> {
    return new Id(this.value(other.value));
  }
}

interface ConstHKT extends HKT {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [Type]: Const<any, this[typeof Variable]>;
}

class Const<A, B = A> extends Focus<A, B> implements Functor<ConstHKT> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  map<C>(_f: (b: B) => C): Const<A, C> {
    return new Const(this.value);
  }
}

// sub-classes of Const will implement Apply while implying different constraints.

export { Id, Const };
export type { Focus, IdHKT, ConstHKT };
