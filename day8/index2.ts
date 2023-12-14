import { readFileSync } from "fs";

const getInput = readFileSync("input.txt", "utf8").split("\n");
const getInputSample = `LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)`.split("\n");

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
  startNode: string,
  directions: string,
  nodeTable: Record<string, [string, string]>
) => {
  let count = 0;
  let currentNode = startNode || "AAA";

  while (!currentNode.endsWith("Z")) {
    const nextStepIndex = count % directions.length;
    const nextStep = directions[nextStepIndex] === "L" ? 0 : 1;
    currentNode = nodeTable[currentNode][nextStep];

    count++;
  }

  return count;
};

const leastCommonMultiple = (a: number, b: number) =>
  (a * b) / greatestCommonDivisor(a, b);

const greatestCommonDivisor = (a: number, b: number): number => {
  const remainder = a % b;
  if (remainder === 0) return b;
  return greatestCommonDivisor(b, remainder);
};

const spawnGhosts = (
  directions: string,
  nodeTable: Record<string, [string, string]>
) => {
  const counts = [];

  let searchNodes = Object.keys(nodeTable).filter((s) => s.endsWith("A"));

  for (let i = 0; i < searchNodes.length; i++) {
    const agentPath = AAAtoZZZ(searchNodes[i], directions, nodeTable);
    counts.push(agentPath);
  }

  const smallestCommonPathCount = counts.reduce(
    (acc, cur) => leastCommonMultiple(acc, cur),
    1
  );

  return smallestCommonPathCount;
};

const main = (inputs: string[]) => {
  const { directions, nodeTable } = parseInputs(inputs);
  return spawnGhosts(directions, nodeTable);
};

console.log(main(getInputSample));
console.log(6);
console.log(main(getInput));
console.log(11283670395017);
