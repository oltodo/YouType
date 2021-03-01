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
