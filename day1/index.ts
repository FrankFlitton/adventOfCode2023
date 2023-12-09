import { readFileSync } from "fs";

const getInputs = readFileSync("./input.txt", "utf8").split("\n");
const getInputsSample1 = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`.split("\n");
const getInputsSample2 = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`.split("\n");

const CHAR_1 = "1".charCodeAt(0);
const CHAR_9 = "9".charCodeAt(0);

const strIntEnum = Object.freeze({
  one: "o1e",
  two: "t2o",
  three: "th3ee",
  four: "f4ur",
  five: "fi5e",
  six: "s6x",
  seven: "se7en",
  eight: "ei8ht",
  nine: "n9ne",
});

const strIntEntries = Object.entries(strIntEnum);

/**
 * We have a context where we need to check if a string is an integer
 * No need to check for negative numbers
 * Regex may be slower, compare with strict matches
 */
const isCharInt = (char: string) => {
  if (!char.length) return false;
  const charCode = char.charCodeAt(0);
  return CHAR_1 <= charCode && charCode <= CHAR_9;
};

const getFirstLastCombo = (input: string) => {
  let firstNumber = "";
  let lastNumber = "";

  // process the string
  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (isCharInt(char)) {
      if (firstNumber === "") {
        firstNumber = char;
      } else {
        lastNumber = char;
      }
    }
  }

  // last is set
  lastNumber = lastNumber === "" ? firstNumber : lastNumber;

  // add the numbers
  const combo = parseInt(`${firstNumber}${lastNumber}`, 10);
  return combo;
};

/**
 * Add the first and last number found in each string
 * Return the sum of all the numbers
 * Numbers are 1-9
 * @param inputs
 */
export const main = (inputs: string[], isStrEncoded = false) => {
  // Loop through each input
  let sums: number[] = [];

  // one to 1
  let normalizedInputs = inputs.join("\n");

  if (isStrEncoded) {
    for (let i = 0; i < strIntEntries.length; i++) {
      const entry = strIntEntries[i];
      normalizedInputs = normalizedInputs.replaceAll(
        RegExp(entry[0], "gmi"),
        entry[1]
      );
    }
  }

  const cleanInputs = normalizedInputs.split("\n");

  for (let i = 0; i < cleanInputs.length; i++) {
    const input = cleanInputs[i];
    const num = getFirstLastCombo(input);
    sums.push(num);
  }

  const sum = sums.reduce((acc, curr) => acc + curr, 0);

  return sum;
};

console.log("part one", main(getInputs));

console.log("part two", main(getInputs, true));

console.log(main(getInputsSample1));
console.log(main(getInputsSample2, true));
