import { readFileSync } from "fs";
import { dirname, join } from "path";

// px{a<2006:qkq,m>2090:A,rfg}
type Part = { x: number; m: number; a: number; s: number };
type PartRange = {
  x: { min: number; max: number };
  m: { min: number; max: number };
  a: { min: number; max: number };
  s: { min: number; max: number };
};
type ComplexValidator = {
  partDimension: keyof Part;
  operation: ">" | "<";
  number: number;
  callback: string; // true, false go to next item
};
type SimpleValidator = string;
type Validator = SimpleValidator | ComplexValidator;
type Rule = {
  id: string;
  validators: Validator[];
};
type RuleSet = Record<string, Rule>;

const resolveRules = (
  ruleId: string,
  part: Part,
  ruleSet: RuleSet
): boolean => {
  if (ruleId === "A") return true;
  if (ruleId === "R") return false;

  for (let i = 0; i < ruleSet[ruleId].validators.length; i++) {
    if (typeof ruleSet[ruleId].validators[i] === "string") {
      return resolveRules(
        ruleSet[ruleId].validators[i] as SimpleValidator,
        part,
        ruleSet
      ); // kick off secondary workflow
    }
    const val = ruleSet[ruleId].validators[i] as ComplexValidator;
    const inputNum = part[val.partDimension];
    const result =
      val.operation === ">" ? inputNum > val.number : inputNum < val.number;
    if (result) {
      return resolveRules(
        (ruleSet[ruleId].validators[i] as ComplexValidator).callback,
        part,
        ruleSet
      ); // kick off secondary workflow
    }
  }

  return true;
};

const main = (input: string, part2: boolean) => {
  const [rulesStr, partsStr] = input.split("\n\n");

  const parts = partsStr.split("\n").map((s) => {
    const st = s.substring(1, s.length - 1);
    return st.split(",").reduce((acc, cur) => {
      const t = cur.split("=");
      const key = t[0] as keyof Part;
      acc[key] = parseInt(t[1], 10);
      return acc;
    }, {} as Part);
  });

  const rulesArr = rulesStr.split("\n").map((val) => {
    const bStart = val.indexOf("{");
    const bEnd = val.indexOf("}");
    const ruleId = val.substring(0, bStart);

    const validatorsStr = val.substring(bStart + 1, bEnd);
    const validators: Validator[] = validatorsStr.split(",").map((s) => {
      const [condStr, callback] = s.split(":");
      if (condStr.includes(">") || condStr.includes("<")) {
        return {
          partDimension: condStr.at(0) as keyof Part,
          operation: condStr.at(1) as ">" | "<",
          number: parseInt(condStr.substring(2) ?? "0"),
          callback,
        };
      } else {
        return condStr;
      }
    });

    const obj = {
      id: ruleId,
      validators,
    };
    return obj;
  }, {} as RuleSet);

  const rules: RuleSet = {};
  for (let i = 0; i < rulesArr.length; i++) {
    const element = rulesArr[i];
    rules[element.id] = element;
  }

  if (!part2) {
    const sum = parts
      .map((p) => {
        return {
          p,
          valid: resolveRules("in", p, rules),
        };
      })
      .filter((o) => o.valid)
      .map((o) => o.p.x + o.p.m + o.p.a + o.p.s)
      .reduce((acc, cur) => acc + cur, 0);
    return sum;
  }

  const resolvePossibleRules = (
    partRanges: PartRange,
    ruleId: string
  ): number => {
    if (ruleId === "R") {
      return 0;
    }
    if (ruleId === "A") {
      console.log("found an A");
      return Object.values(partRanges).reduce((acc, cur) => {
        return acc + (cur.max - cur.min + 1);
      }, 1);
    }

    let total = 0;

    const validatorArr = rules[ruleId].validators;
    const fallback = rules[ruleId].validators[
      rules[ruleId].validators.length - 1
    ] as string;
    let useFallback = true;

    for (let i = 0; i < validatorArr.length - 1; i++) {
      const v = validatorArr[i] as ComplexValidator;

      const { min, max } = partRanges[v.partDimension];
      let T = [0, 0];
      let F = [0, 0];

      if (v.operation === "<") {
        T = [min, v.number - 1];
        F = [v.number, max];
      } else {
        T = [v.number + 1, max];
        F = [min, v.number];
      }

      if (T[0] <= T[1]) {
        const copy = JSON.parse(JSON.stringify(partRanges)) as PartRange;
        copy[v.partDimension] = { min: T[0], max: T[1] };
        total += resolvePossibleRules(copy, v.callback);
      }
      if (F[0] <= F[1]) {
        const copy = JSON.parse(JSON.stringify(partRanges)) as PartRange;
        copy[v.partDimension] = { min: F[0], max: F[1] };
        partRanges = copy;
      } else {
        console.log("break!");
        useFallback = false;
        break;
      }
    }

    if (useFallback) {
      console.log(fallback);
      const copy = JSON.parse(JSON.stringify(partRanges)) as PartRange;
      total = total + resolvePossibleRules(copy, fallback);
    }

    let product = 1;
    for (let i = 0; i < Object.keys(partRanges).length; i++) {
      const key = Object.keys(partRanges)[i] as keyof PartRange;
      const element = partRanges[key];
      product = product * (element.max - element.min + 1);
    }
    return product;
  };

  const partRangeObj: PartRange = {
    x: { min: 1, max: 4000 },
    m: { min: 1, max: 4000 },
    a: { min: 1, max: 4000 },
    s: { min: 1, max: 4000 },
  };

  const result = resolvePossibleRules(partRangeObj, "in");

  return result;
};

// const path = Bun.argv[2];
// console.clear();
// const part2arg = true || (Bun.argv[3] ?? "")?.includes("part2");
// const inputFile = readFileSync(join(dirname("./"), path), "utf-8");
// console.log("sample", main(inputFile, part2arg));
// console.log("target", 167409079868000);

const inputFile = readFileSync(join(dirname("./"), "sample.txt"), "utf-8");
main(inputFile, true);
console.log("hey")