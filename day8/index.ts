import { readFileSync } from "fs";

const getInput = readFileSync("input.txt", "utf8").split("\n");
const getInputSample = `LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)`.split("\n");

const parseInputs = (inputs: string[]) => {
  const directionsStr = inputs.shift();
  const directions = (directionsStr || "").trim();
  inputs.shift();

  const nodeTable: Record<string, [string, string]> = {};

  for (let i = 0; i < inputs.length; i++) {
    const readline = inputs[i];

    const [nodeId, valuesStr] = readline.split(" = ");
    const valuesStrNoBrace = valuesStr.substring(1, valuesStr.length - 1);
    const [left, right] = valuesStrNoBrace.split(", ");

    nodeTable[nodeId] = [left, right];
  }

  return { directions, nodeTable };
};

const AAAtoZZZ = (
  directions: string,
  nodeTable: Record<string, [string, string]>
) => {
  let count = 0;
  let currentNode = "AAA";
  const endNode = "ZZZ";

  while (currentNode !== endNode) {
    const nextStepIndex = count % directions.length;
    const nextStep = directions[nextStepIndex] === "L" ? 0 : 1;
    currentNode = nodeTable[currentNode][nextStep];

    count++;
  }

  return count;
};

const main = (inputs: string[]) => {
  const { directions, nodeTable } = parseInputs(inputs);
  console.log(nodeTable)
  return AAAtoZZZ(directions, nodeTable)
};

console.log(main(getInputSample));
console.log(6);
console.log(main(getInput));
