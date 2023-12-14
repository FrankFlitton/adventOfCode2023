import { readFileSync } from "fs";

const getInput = readFileSync("input.txt", "utf8").split("\n");
const getInputSample = `Time:      7  15   30
Distance:  9  40  200`.split("\n");

type Race = {
  time: number;
  distance: number;
};

const makeRaces = (inputs: string[], bigRace = false) => {
  const timeStr = inputs[0];
  const distanceStr = inputs[1];

  const times = timeStr
    .split(":")[1]
    .split(" ")
    .filter((s) => !!s)
    .map((s) => parseInt(s.trim(), 10));

  const distances = distanceStr
    .split(":")[1]
    .split(" ")
    .filter((s) => !!s)
    .map((s) => parseInt(s.trim(), 10));

  if (!bigRace) {
    const races: Race[] = times.map((_, i) => {
      return {
        time: times[i],
        distance: distances[i],
      };
    });

    return races;
  }

  const races: Race[] = [
    {
      time: parseInt(times.join(""), 10),
      distance: parseInt(distances.join(""), 10),
    },
  ];
  return races;
};

const calculateRaceOptions = (race: Race, optimized = true) => {
  const { time } = race;
  const { distance } = race;

  let options = 0;

  for (let i = 1; i < time; i++) {
    const timeLeft = time - i;
    const distanceTraveled = i * timeLeft;
    if (distanceTraveled > distance) {
      options = options + 1;
    }
  }

  return options;
};

const main = (inputs: string[], bigRace = false) => {
  const races = makeRaces(inputs, bigRace);

  const waysToWin = races.map((r) => calculateRaceOptions(r));
  const product = waysToWin.reduce((acc, cur) => acc * cur, 1);

  return product;
};

console.log(main(getInputSample));
console.log(288);
console.log(main(getInput));
console.log(32076);
console.log(main(getInput, true));
console.log(34278221);
