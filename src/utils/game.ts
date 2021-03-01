export interface Char {
  type: "letter" | "symbol";
  value: string;
  line: number;
  word: number;
  index: number;
  upper: boolean;
  answer: string;
}

function isSymbol(char: string) {
  return !/[a-zA-Z0-9]/.test(char);
}

export function parseCaption(text: string): Char[] {
  let index = 0;

  return text.split("\n").reduce<Char[]>((acc, line, lineId) => {
    line.split(/ +/).forEach((word, wordId) => {
      acc = acc.concat(
        Array.from(word).map(value => ({
          type: isSymbol(value) ? "symbol" : "letter",
          index: index++,
          value: value,
          answer: "",
          upper: value.toUpperCase() === value,
          line: lineId,
          word: wordId,
        })),
      );
    });

    return acc;
  }, []);
}
