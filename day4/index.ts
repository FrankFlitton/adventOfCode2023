import { readFileSync } from "fs";

const getInputs = readFileSync("./input.txt", "utf8").split("\n");
const getInputsSample = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`.split("\n");

type ScratchCard = {
  id: number;
  winningNumbers: number[];
  receivedNumbers: number[];
  matches: number;
  score: number;
  scoreModifier: number;
};

/**
 * Raw strings to structured inputs
 * @param inputs
 */
const makeScratchCards = (inputs: string[]) => {
  const scratchCards = inputs.map((rawCardData) => {
    const [cardSection, numbersSection] = rawCardData.split(": ");
    const [, cardId] = cardSection.split(" ");

    const [winningNumbersSection, receivedNumbersSection] =
      numbersSection.split(" | ");

    const winningNumbers = winningNumbersSection
      .split(" ")
      .filter((s) => !!s)
      .map((s) => parseInt(s.trim(), 10));

    const receivedNumbers = receivedNumbersSection
      .split(" ")
      .filter((s) => !!s)
      .map((s) => parseInt(s.trim(), 10));

    const scratchCard: ScratchCard = {
      id: parseInt(cardId, 10),
      winningNumbers,
      receivedNumbers,
      scoreModifier: 1,
      matches: 0,
      score: 0,
    };

    return scratchCard;
  });

  return scratchCards;
};

/**
 * Double after first match, similar to fibonacci sequence
 * @param nMatches
 * @returns
 */
const matchesToPoints = (nMatches: number) => {
  if (!nMatches) return 0;

  let score = 1;
  for (let index = 1; index < nMatches; index++) {
    score *= 2;
  }
  return score;
};

const findCardMatches = (card: ScratchCard) => {
  const { winningNumbers, receivedNumbers } = card;

  let matches = 0;
  for (let index = 0; index < winningNumbers.length; index++) {
    const w = winningNumbers[index];

    if (receivedNumbers.includes(w)) {
      matches++;
    }
  }

  const score = matchesToPoints(matches);

  const updatedCard = {
    ...card,
    matches,
    score,
  };
  return updatedCard;
};

const getAllMatches = (cards: ScratchCard[]) => {
  return cards.map((card) => findCardMatches(card));
};

const sumScore = (cards: ScratchCard[]) => {
  return cards.reduce((prev, value) => {
    return prev + (value?.score ?? 0);
  }, 0);
};

const accumulateScore = (cards: ScratchCard[]) => {
  let score = 0;

  for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
    const card = cards[cardIndex];

    score += card.scoreModifier;

    for (
      let modifierIndex = 1;
      modifierIndex <= card.matches;
      modifierIndex++
    ) {
      if (!cards[modifierIndex + cardIndex]) break; // end of file

      cards[modifierIndex + cardIndex].scoreModifier =
        cards[modifierIndex + cardIndex].scoreModifier + 1 * card.scoreModifier;
    }
  }

  return score;
};

const main = (inputs: string[], accumulateScoreRules = false) => {
  const scratchCards = makeScratchCards(inputs);
  const matches = getAllMatches(scratchCards);

  if (accumulateScoreRules) {
    const score = accumulateScore(matches);
    return score;
  }

  const sum = sumScore(matches);
  return sum;
};

console.log(main(getInputs));
console.log(main(getInputsSample));
console.log(13);
console.log(main(getInputsSample, true));
console.log(30);
console.log(main(getInputs, true));
