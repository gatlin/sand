import { over, atL, arrayWhereT } from "./src";
import type { Setter_ } from "./src";
import { compose } from "ts-functional-pipe";

const obj = {
  xs: [
    {
      n: 1,
      squared: false
    },
    {
      n: 2,
      squared: false
    },
    {
      n: 9,
      squared: true
    },
    {
      n: 4,
      squared: false
    }
  ]
};

type Datum = {
  n: number;
  squared: boolean;
};

const xform = compose(
  atL("xs"),
  arrayWhereT<Datum>(({ squared }) => !squared)
) as Setter_<typeof obj, Datum>;

const updated = over(xform)(({ n, squared }) => ({
  n: n * n,
  squared: !squared
}))(obj);

console.log(updated);
