import { readFileSync } from "fs";
import { dirname, join } from "path";

const main = (input: string, part2: boolean) => {};

const path = Bun.argv[2];
const part2arg = (Bun.argv[3] ?? "")?.includes("part2");
const inputFile = readFileSync(join(dirname("./"), path), "utf-8");
console.log(main(inputFile, part2arg));
