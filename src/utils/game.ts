import { Caption } from "utils/caption";

export interface Sequence extends Caption {
  timeRange: [number, number];
  chars: Char[];
  translation: string;
  currentIndex: number;
  completed: boolean;
}

export interface Char {
  type: "letter" | "symbol";
  value: string;
  index: number;
  lineIndex: number;
  wordIndex: number;
  upper: boolean;
  answer: string;
}

function isSymbol(char: string) {
  return !/[a-zA-Z0-9]/.test(char);
}

export function parseCaption(text: string): Char[] {
  let index = 0;
  let wordIndex = -1;

  return text.split("\n").reduce<Char[]>((acc, line, lineIndex) => {
    line.split(/ +/).forEach(word => {
      wordIndex += 1;

      acc = acc.concat(
        Array.from(word).map(value => ({
          type: isSymbol(value) ? "symbol" : "letter",
          index: index++,
          lineIndex,
          wordIndex,
          value: value,
          answer: "",
          upper: value.toUpperCase() === value,
        })),
      );
    });

    return acc;
  }, []);
}

export function findPreviousIndex(sequence: Sequence): number {
  const { chars, currentIndex } = sequence;

  for (let i = currentIndex - 1; i >= 0; i -= 1) {
    if (chars[i].type === "letter") {
      return i;
    }
  }

  return currentIndex;
}

export function findNextLetterIndex(sequence: Sequence) {
  const { chars, currentIndex } = sequence;

  for (let i = currentIndex + 1; i < chars.length; i += 1) {
    if (chars[i].type === "letter") {
      return i;
    }
  }

  return currentIndex;
}

export function findPreviousLetterIndex(sequence: Sequence): number {
  const { chars, currentIndex } = sequence;

  for (let i = currentIndex - 1; i >= 0; i -= 1) {
    if (chars[i].type === "letter") {
      return i;
    }
  }

  return currentIndex;
}

export function findNextWordLetterIndex(sequence: Sequence) {
  const { chars, currentIndex } = sequence;
  const { wordIndex } = chars[currentIndex];

  for (let i = currentIndex + 1; i < chars.length; i += 1) {
    if (chars[i].wordIndex !== wordIndex) {
      return i;
    }
  }

  return currentIndex;
}
