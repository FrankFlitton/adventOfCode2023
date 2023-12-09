import { readFileSync } from "fs";

const getInputs = readFileSync("./input.txt", "utf8").split("\n");
const getInputsSample = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`.split("\n");

type Cube = {
  red: number;
  green: number;
  blue: number;
};

type Game = {
  id: number;
  throws: Cube[];
  total: Cube;
};

const maxCubes: Cube = Object.freeze({
  red: 12,
  green: 13,
  blue: 14,
});
const cubeKeys = Object.keys(maxCubes).map((k) => k as keyof Cube);

const makeCube = (cubeVals: Partial<Cube>) => {
  const cube: Cube = {
    red: 0,
    green: 0,
    blue: 0,
  };
  const fullCube: Cube = { ...cube, ...cubeVals };
  return fullCube;
};

// Game 11: 18 green, 2 red; 19 green, 14 red, 9 blue; 8 blue, 12 red, 5 green; 4 green, 12 red; 14 red, 7 green, 10 blue
const strToGameParse = (str = "") => {
  if (!str || !str.startsWith("Game")) {
    throw new Error("Invalid input");
  }

  const [gameId, throwsStr] = str.split(":");
  const throws = throwsStr.split(";").map((cubeThrow) => {
    const c: Partial<Cube> = {};
    cubeThrow.split(",").forEach((cubeCount: string) => {
      const [count, color] = cubeCount.trim().split(" ");
      const colorKey = color as "red" | "green" | "blue";
      c[colorKey] = parseInt(count, 10);
    });
    const cube = makeCube(c);
    return cube;
  });

  const game: Game = {
    id: parseInt(gameId.split(" ")[1], 10),
    throws,
    total: makeCube({}),
  };

  return game;
};

const calcTotalGame = (game: Game) => {
  for (let i = 0; game.throws.length > i; i++) {
    const cubeThrow = game.throws[i];
    for (let j = 0; cubeKeys.length > j; j++) {
      const cubeKey = cubeKeys[j];
      game.total[cubeKey] += cubeThrow[cubeKey];
    }
  }
};

const isValidCubes = (game: Game) => {
  for (let i = 0; game.throws.length > i; i++) {
    const cubeThrow = game.throws[i];
    for (let i = 0; cubeKeys.length > i; i++) {
      const cubeKey = cubeKeys[i];
      if (cubeThrow[cubeKey] > maxCubes[cubeKey]) {
        return false;
      }
    }
  }
  return true;
};

const minCubesNeeded = (game: Game) => {
  const min = game.throws.reduce((prev, curr) => {
    for (let i = 0; cubeKeys.length > i; i++) {
      const cubeKey = cubeKeys[i];
      if (curr[cubeKey] > prev[cubeKey]) {
        prev[cubeKey] = curr[cubeKey];
      }
    }
    return prev;
  }, makeCube({}));

  return min;
};

const powerCube = (cube: Cube) => {
  let val = cube[cubeKeys[0]];
  for (let i = 1; cubeKeys.length > i; i++) {
    const cubeKey = cubeKeys[i];
    val = val * (cube[cubeKey] || 1);
  }
  return val;
};

const main = (inputs: string[], part2 = false) => {
  let result = 0;
  for (let i = 0; i < inputs.length; i++) {
    const game = strToGameParse(inputs[i]);

    if (!part2) {
      if (isValidCubes(game)) {
        result += game.id;
      }
    } else {
      const minCubes = minCubesNeeded(game);
      const power = powerCube(minCubes);
      result += power;
    }
  }
  return result;
};

console.log(main(getInputsSample));
console.log(main(getInputs));
console.log(main(getInputsSample, true));
console.log(main(getInputs, true));
