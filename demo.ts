import type { Lens_, Setter_, Traversal_ } from "./src";
import { atL, over, view, Id, arrayWhereT } from "./src";
import { compose } from "ts-functional-pipe";
import { strict as assert } from "assert";

// there's a traversal example after the lens ones!

// Lens case #1: type-safe *first-class* property accessor.
class ADto {
  public readonly a: BDto;
}

class BDto {
  public readonly b: CDto[];
}

class CDto {
  public readonly c: number;
}

const value: ADto = {
  a: {
    b: [{
      c: 4
    }, {
      c: -17
    }]
  }
};

// gets the `CDto` at the specified position in the nested array in `ADto`.
const cL = (n: number): Lens_<ADto,CDto> => compose(
  atL("a"),
  atL(`b.${n}`)
);

// `over` takes a lens and an update function, applies the function at the
// target *focused* by the lens, and produces a (type-safe) copy.
// the original value is treated immutably.
const updatedValue: ADto =
  over(
    compose(cL(0), atL("c")) as
    Setter_<ADto,number> // TODO should be optional
  )(
    (v: number) => v * v
  )(
    value
  );

const four: number    = view(compose(cL(0),atL("c")))(value);
const sixteen: number = view(compose(cL(0),atL("c")))(updatedValue);

assert.equal(four, 4);
assert.equal(sixteen, 16);

// A lens example that isn't Yet Another Property Accessor:
// this one focuses on the absolute value "inside of" a number.
// This is meant to show lenses are just functions, & their intuition.
function absL(): Lens_<number,number> {
  /*
  **
  **     operation which "gets" the absval from the number
  **                          |
  **                      ----+----
  **                     /         \                     */
  return (f) => (n) => f(Math.abs(n)).map((u) => {           // \
    if (u < 0) {                                             // |   operation
      throw new Error(`absolute values cannot be negative`); // +- which "puts"
    }                                                        // |    it back
    return Math.sign(n) * u;                                 // /
  });                                                        //
}

const negative_289: number =
  view(atL("a.b.1.c"))(
    over(
      compose(
        cL(1),
        atL("c"),
        absL()
      ) as Setter_<ADto,number> // TODO should be optional
    )
    ((n: number) => n * n)
    (value)
  );
// nifty, right?
assert.equal(negative_289, -289);

// Traversals! (calloo! callay!)
// A traversal is a lens which can focus on multiple values.
// They can be used with `over` to updated a structure the same as with lenses,
// but they require a different function to read values out.
// *Stay tuned!*
assert.deepEqual(
  over(arrayWhereT(0))(
    (_) => -1
  )(
    [ 0, 2,  0, 5,  0]
  ),
  [-1, 2, -1, 5, -1]
);





