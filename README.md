sand
===

an unfinished library for optics in typescript.

- [X] basic lenses that compose like functions
- [ ] better lenses that overcome the subtle type issues I need to document
- [ ] traversals
- [ ] prisms
- [ ] isos

IOU a better intro.

synopsis
===

cf [demo.ts](demo.ts)

```typescript
import type { Lens_ } from "./src";
import { atL, over, view } from "./src";
import { compose } from "ts-functional-pipe";
import { strict as assert } from "assert";

// some DTO classes
class ADto {
  public readonly a: BDto;
}

class BDto {
  public readonly b: CDto[];
}

class CDto {
  public readonly c: number;
}

// an `ADto`
const value = {
  a: {
    b: [{
      c: 4
    }, {
      c: -17
    }]
  }
};

// a Lens to grab one of the `CDto` values
const cL = (n: number): Lens_<ADto,CDto> => compose(
  atL("a"),
  atL(`b.${n}`)
);

// a modified copy of `value`, which was not touched.
const updatedValue: ADto =
  over(
    compose(cL(0), atL("c"))
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
  return (f) => (n) => f(n).map((u) => {
    if (u < 0) {
      throw new Error(`absolute values cannot be negative`);
    }
    return Math.sign(n) * u;
  });
}

// we can square the absolute value "inside" a negative number, and get a
// negative result
assert.deepEqual(
  over(
    compose(
      atL("someFinancialStat"),
      absL()
    )
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
      )
    )
    ((n: number) => n * n)
    (value)
  )
;
assert.equal(negative_289, -289);
```

questions / comments / scathing criticism
===

<gatlin+sand@niltag.net> or GitHub issues.
