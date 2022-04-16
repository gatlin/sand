import type { Lens_, Setter_ } from "./src";
import { atL, over, view } from "./src";
import { compose } from "ts-functional-pipe";
import { strict as assert } from "assert";

class ADto {
  public readonly a: BDto;
}

class BDto {
  public readonly b: CDto[];
}

class CDto {
  public readonly c: number;
}

const value = {
  a: {
    b: [{
      c: 4
    }, {
      c: -17
    }]
  }
};

const cL = (n: number): Lens_<ADto,CDto> => compose(
  atL("a"),
  atL(`b.${n}`)
);

const updatedValue: ADto =
  over(
    compose(cL(0), atL("c")) as Setter_<ADto,number>
  )(
    (v: number) => v * v
  )(
    value
  );

const four: number    = view(compose(cL(0),atL("c")))(value);
const sixteen: number = view(compose(cL(0),atL("c")))(updatedValue);

assert.equal(four, 4);
assert.equal(sixteen, 16);

// Lens which focuses on the absolute value "inside of" a number
function absL(): Lens_<number,number> {
  return (f) => (n) => f(Math.abs(n)).map((u) => {
    if (u < 0) {
      throw new Error(`absolute values cannot be negative`);
    }
    return Math.sign(n) * u;
  });
}

assert.deepEqual(
  over(
    compose(
      atL("someFinancialStat"),
      absL()
    ) as Setter_<Record<string|number,any>,number>
  )(
    (n: number) => n * n
  )({
    someFinancialStat: -10
  }), {
    someFinancialStat: -100
});

const negative_289: number =
  view(compose(cL(1),atL("c")))(
    over(
      compose(
        cL(1),
        atL("c"),
        absL()
      ) as Setter_<ADto,number>
    )
    ((n: number) => n * n)
    (value)
  )
;
assert.equal(negative_289, -289);

