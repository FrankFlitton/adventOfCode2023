import { readFileSync } from "fs";

const getInput = readFileSync("input.txt", "utf-8").split("\n");

const getInputSample = `0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45`.split("\n");

const getNextSequence = (sequence: number[]): number => {
  if (sequence.every((n) => n === 0)) return 0;

  let diffs = [];
  for (let index = 0; index < sequence.length - 1; index++) {
    const s1 = sequence[index];
    const s2 = sequence[index + 1];

    diffs.push(s2 - s1);
  }

  return sequence[sequence.length - 1] + getNextSequence(diffs)
};

const main = (input: string[], reverse = false) => {
  const oasisHistory = input.map((s) =>
    s
      .split(" ")
      .filter((v) => !!v.trim())
      .map((v) => parseInt(v, 10))
  );

  const predictionOrder = !reverse ? oasisHistory : oasisHistory.map(s => s.reverse())

  return predictionOrder.map(seq => getNextSequence(seq)).reduce((acc, cur) => acc + cur, 0);
};

console.log(main(getInputSample));
console.log(main(getInputSample, true));
console.log(main(getInput));
console.log(main(getInput, true));
