import { readFileSync } from "fs";

const getInputs = readFileSync("./input.txt", "utf8").split("\n");
const getInputsSample = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`.split("\n");

// destination-source format
type LookupTable = {
  values: {
    destinationRangeStart: number;
    sourceRangeStart: number;
    rangeLength: number;
  }[];
  destinationId: string;
  sourceId: string;
};

type SeedRange = { start: number; range: number };

class Almanac {
  seeds: number[] = [];
  seedRanges: SeedRange[] = [];
  tables: LookupTable[] = [];

  constructor(inputs: string[]) {
    const seedsStr = inputs.shift();
    const seeds = (seedsStr ?? "")
      .split(": ")![1]
      ?.split(" ")
      ?.map((s) => parseInt(s.trim()));

    this.seeds = seeds;

    for (let i = 0; i < seeds.length; i++) {
      const index = i % 2;
      if (index === 0) {
        const rangeData = {
          start: seeds[i],
          range: seeds[i + 1],
        };
        this.seedRanges.push(rangeData);
      }
    }

    for (let index = 0; index < inputs.length; index++) {
      const readline = inputs[index];
      if (!readline) continue;
      if (readline.includes("map:")) {
        const [labels] = readline.split(" ");
        const [source, destination] = labels.split("-to-");

        const table: LookupTable = {
          values: [],
          destinationId: destination,
          sourceId: source,
        };

        this.tables.push(table);
      } else {
        const [destinationRangeStart, sourceRangeStart, rangeLength] = readline
          .split(" ")
          .map((s) => parseInt(s.trim(), 10));

        this.tables[this.tables.length - 1].values.push({
          destinationRangeStart,
          sourceRangeStart,
          rangeLength,
        });
      }
    }
  }

  getSeedToElevation = (seed: number) => {
    let sourceVal = seed;

    for (let index = 0; index < this.tables.length; index++) {
      const table = this.tables[index];

      // lookup value mapping
      const mapping = table.values.find((t) => {
        return (
          sourceVal >= t.sourceRangeStart &&
          sourceVal <= t.sourceRangeStart + t.rangeLength - 1
        );
      });

      if (mapping) {
        const delta = sourceVal - mapping.sourceRangeStart;
        const destinationValue = delta + mapping.destinationRangeStart;

        sourceVal = destinationValue;
      }
    }
    return sourceVal;
  };

  /**
   * Way too slow, input data was causing billions of entries
   * @returns
   */
  makeSeedRanges = () => {
    const seeds: number[] = [];

    for (let i = 0; i < this.seedRanges.length; i++) {
      console.log("loop", i, seeds.length, this.seedRanges.length);
      const seedRange = this.seedRanges[i];

      for (
        let i = seedRange.start;
        i < seedRange.start + seedRange.range;
        i++
      ) {
        seeds.push(i);
      }
    }
    console.log("loop end", seeds.length, this.seedRanges.length);
    return seeds;
  };

  /**
   * This solution is still brute-force but it solves quick enough
   * compared to the top down approach.
   *
   * We start at location 0 and solve upward using the location smallest
   * range as a upper bound (arbitrary). This approach assumes that
   * it will be likely that we will encounter *any* seed number
   * within a range that has a low elevation opposed to random seed
   * numbers looking for equally random low elevations.
   *
   * There's some optimizations that can be done by scanning map chunks
   */
  elevationToSeedNumberInARange = () => {
    let lowestDestinationStart = Infinity;
    let lowestDestinationRangeIndex = -1;

    for (
      let index = 0;
      index < this.tables[(this, this.tables.length - 1)].values.length;
      index++
    ) {
      const values = this.tables[(this, this.tables.length - 1)].values[index];
      if (values.destinationRangeStart < lowestDestinationStart)
        lowestDestinationStart = values.destinationRangeStart;
      lowestDestinationRangeIndex = index;
    }

    let lowestDestinationRange =
      this.tables[(this, this.tables.length - 1)].values[
        lowestDestinationRangeIndex
      ];

    // let sourceTable = this.tables[this.tables.length - 1].values;

    const seedValues: number[] = [];

    for (
      let index = 0;
      index <
      lowestDestinationRange.destinationRangeStart +
        lowestDestinationRange.rangeLength;
      index++
    ) {
      let sourceVal = index;

      for (let index = this.tables.length - 1; index > -1; index--) {
        const table = this.tables[index];

        // lookup value mapping
        const mapping = table.values.find((t) => {
          return (
            sourceVal >= t.destinationRangeStart &&
            sourceVal <= t.destinationRangeStart + t.rangeLength - 1
          );
        });

        if (mapping) {
          const delta = sourceVal - mapping.destinationRangeStart;
          const destinationValue = delta + mapping.sourceRangeStart;

          sourceVal = destinationValue;
        }
      }
      const seedMapping = this.seedRanges.find((s) => {
        return sourceVal >= s.start && sourceVal <= s.start + s.range - 1;
      });

      if (seedMapping) {
        return index;
      }
    }
    return -1;
  };
}

const main = (inputs: string[], seedRanges = false) => {
  if (!inputs.length) return 0;

  const almanac = new Almanac(inputs);

  if (seedRanges) {
    const lowestElevation = almanac.elevationToSeedNumberInARange();
    return lowestElevation;
  }

  const lowestElevation = Math.min(
    ...almanac.seeds.map((s) => almanac.getSeedToElevation(s))
  );
  return lowestElevation;
};


// console.log(main(getInputsSample));
// console.log(main(getInputsSample, true));
console.log(main(getInputs));
// console.log(main(getInputs, true));
