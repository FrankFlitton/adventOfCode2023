import { readFileSync } from "fs";

const getInput = readFileSync("input.txt", "utf8").split("\n");
const getInputSample = `32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483`.split("\n");

interface Faces {
  A: 13;
  K: 12;
  Q: 11;
  J: 10;
  T: 9;
  "9": 8;
  "8": 7;
  "7": 6;
  "6": 5;
  "5": 4;
  "4": 3;
  "3": 2;
  "2": 1;
}

type FaceValues = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

const faces: Faces = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  "9": 8,
  "8": 7,
  "7": 6,
  "6": 5,
  "5": 4,
  "4": 3,
  "3": 2,
  "2": 1,
};

const handType = Object.freeze({
  fiveOfAKind: 7,
  fourOfAKind: 6,
  fullHouse: 5,
  threeOfAKind: 4,
  twoPair: 3,
  onePair: 2,
  highCard: 1,
});

type HandScore = {
  handType: number;
  faces: FaceValues[];
};

interface Game {
  handScore?: HandScore;
  bet: number;
  hand: string;
}

const handTypeSolver = (hand: string): HandScore => {
  const [card1] = hand;

  const cards: string[] = hand.split("");

  const countFaces: Record<string, number> = {};

  const foundCardFaceValues: FaceValues[] = [];

  for (let index = 0; index < cards.length; index++) {
    const card = cards[index];
    const face = faces[card as keyof Faces];

    if (!!countFaces[face]) {
      countFaces[face] = countFaces[face] + 1;
    } else {
      countFaces[face] = 1;
    }

    foundCardFaceValues.push(face);
  }

  const foundCardFaceCount = Object.keys(countFaces).map((s) => countFaces[s]);

  // five of a kind
  if (cards.every((c) => c === card1)) {
    return {
      handType: handType.fiveOfAKind,
      faces: foundCardFaceValues,
    };

    // Combos with 2 card types
  } else if (foundCardFaceCount.length === 2) {
    if (foundCardFaceCount.some((v) => v === 4)) {
      return {
        handType: handType.fourOfAKind,
        faces: foundCardFaceValues,
      };
    }
    if (foundCardFaceCount.some((v) => v === 3)) {
      return {
        handType: handType.fullHouse,
        faces: foundCardFaceValues,
      };
    }

    // Combos with 3 card types
  } else if (foundCardFaceCount.length === 3) {
    if (foundCardFaceCount.some((v) => v === 3)) {
      return {
        handType: handType.threeOfAKind,
        faces: foundCardFaceValues,
      };
    }

    if (
      foundCardFaceCount.some((v) => v === 1) &&
      foundCardFaceCount.some((v) => v === 2)
    ) {
      return {
        handType: handType.twoPair,
        faces: foundCardFaceValues,
      };
    }
    // Combos with 4 card types
  } else if (foundCardFaceCount.length === 4) {
    return {
      handType: handType.onePair,
      faces: foundCardFaceValues,
    };
  }

  return {
    handType: handType.highCard,
    faces: foundCardFaceValues,
  };
};

const makeGames = (inputs: string[]) => {
  return inputs.map((input) => {
    const [hand, betStr] = input
      .split(" ")
      .filter((s) => !!s)
      .map((s) => s.trim());

    const game: Game = {
      hand,
      bet: parseInt(betStr, 10),
    };

    return game;
  });
};

const gameRanks = (
  gameHandScores: {
    games: Game;
    handScore: HandScore;
  }[]
) => {
  const sorted = [...gameHandScores];
  sorted.sort((a, b) => {
    if (a.handScore.handType !== b.handScore.handType) {
      return a.handScore.handType > b.handScore.handType ? 1 : -1;
    }
    for (let i = 0; i < a.handScore.faces.length; i++) {
      const ca = a.handScore.faces[i];
      const cb = b.handScore.faces[i];
      if (ca !== cb) return ca > cb ? 1 : -1;
    }
    return 0;
  });

  return sorted;
};

const main = (inputs: string[], _part2 = false) => {
  const games = makeGames(inputs);
  const gameHandScores = games
    .map((game) => handTypeSolver(game.hand))
    .map((h, i) => {
      return { games: games[i], handScore: h };
    });
  const ranked = gameRanks(gameHandScores);
  const product = ranked.reduce((acc, cur, index) => {
    return acc + cur.games.bet * (index + 1);
  }, 0);

  return product;
};

console.log("***");

console.log(main(getInputSample));
console.log(6440);
console.log(main(getInput));
// console.log(main(getInput));
// console.log(32076);
