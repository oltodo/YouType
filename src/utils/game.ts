export interface AbstractChar {
  type: string;
  value: string;
  line: number;
  word: number;
}

export interface Letter extends AbstractChar {
  index: number;
}

export interface Symbol extends AbstractChar {}

export interface Answer {
  value: string;
  solution: string;
  upper: boolean;
  line: number;
  word: number;
}

function isSymbol(char: string) {
  return !/[a-zA-Z0-9]/.test(char);
}

export function parseCaption(text: string): AbstractChar[] {
  let currentId = 0;

  const lines: string[] = text.split("\n");

  return lines.reduce((acc: AbstractChar[], line, lineId) => {
    const words: string[] = line.split(" ");

    words.forEach((word, wordId) => {
      const chars: string[] = Array.from(word);

      acc = acc.concat(
        chars.map(char => {
          if (isSymbol(char)) {
            return {
              type: "symbol",
              value: char,
              line: lineId,
              word: wordId,
            } as Symbol;
          }

          return {
            index: currentId++,
            type: "letter",
            value: char,
            line: lineId,
            word: wordId,
          } as Letter;
        }),
      );
    });

    return acc;
  }, []);
}

export function getDefaultAnswers(chars: AbstractChar[]): Answer[] {
  return chars
    .filter(item => item.type === "letter")
    .map(
      ({ value, line, word }) => ({
        value: "",
        solution: value,
        upper: value.toUpperCase() === value,
        line,
        word,
      }),
      [],
    );
}
