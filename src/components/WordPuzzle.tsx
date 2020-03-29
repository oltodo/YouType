import React, { forwardRef, useEffect, useState, useImperativeHandle } from "react";
import { makeStyles } from "@material-ui/core";
import classnames from "classnames";
import flattenDeep from "lodash/flattenDeep";
import groupBy from "lodash/groupBy";
import toLower from "lodash/toLower";
import range from "lodash/range";
import shuffle from "lodash/shuffle";
import find from "lodash/find";
import filter from "lodash/filter";
import minBy from "lodash/minBy";

type AbstractChar = {
  type: string;
  value: string;
  line: number;
  word: number;
  position: number;
};

type Letter = AbstractChar & {
  index: number;
};

type Symbol = AbstractChar & {};

type Answer = {
  value: string;
  solution: string;
  upper: boolean;
};

type WordPuzzleProps = {
  text: string;
};

const LETTER_WIDTH = 16;
const SYMBOL_WIDTH = 4;

const useStyles = makeStyles({
  root: {},
  line: {
    display: "flex",
    justifyContent: "center",
  },
  word: {
    display: "flex",
    margin: "0 8px 8px",
  },
  char: {
    height: 30,
    fontSize: 18,
    lineHeight: "30px",
    textAlign: "center",
    marginRight: 2,
  },
  symbol: {},
  letter: {
    minWidth: LETTER_WIDTH,
    maxWidth: LETTER_WIDTH,
    borderBottom: "solid 1px rgba(255,255,255,0.3)",
    transition: "background .3s",
    cursor: "pointer",

    "&:hover": {
      background: "rgba(255,255,255,0.05)",
    },
  },
  current: {
    background: "rgba(255,255,255,0.1) !important",
  },
  success: {
    borderBottomColor: "green",
  },
  error: {
    borderBottomColor: "red",
  },
});

function parseText(text: string): AbstractChar[] {
  let currentId = 0;
  let currentPosition = 0;
  let maxWidth = 0;

  const lines: AbstractChar[][] = text.split("\n").map((line, lineId) => {
    currentPosition = 0;

    return line.split(" ").reduce((acc: AbstractChar[], word, wordId) => {
      if (wordId) {
        currentPosition += LETTER_WIDTH;
      }

      const words: AbstractChar[] = Array.from(word).map((char) => {
        if (!/[a-zA-Z0-9]/.test(char)) {
          currentPosition += SYMBOL_WIDTH;
          maxWidth = Math.max(currentPosition, maxWidth);

          return {
            type: "symbol",
            value: char,
            line: lineId,
            word: wordId,
            position: currentPosition - SYMBOL_WIDTH,
          };
        }

        currentPosition += LETTER_WIDTH;
        maxWidth = Math.max(currentPosition, maxWidth);

        return {
          index: currentId++,
          type: "letter",
          value: char,
          line: lineId,
          word: wordId,
          position: currentPosition - LETTER_WIDTH,
        };
      });

      return acc.concat(words);
    }, []);
  });

  return flattenDeep(
    lines.map((chars) => {
      const lastChar = chars[chars.length - 1];
      const lineWidth = lastChar.position + (lastChar.type === "symbol" ? SYMBOL_WIDTH : LETTER_WIDTH);
      const delta = (maxWidth - lineWidth) / 2;

      return chars.map((char) => ({
        ...char,
        position: char.position + delta,
      }));
    }),
  );
}

function getDefaultAnswers(chars: AbstractChar[]): Answer[] {
  return chars
    .filter((item) => item.type === "letter")
    .map(
      (curr) => ({
        value: "",
        solution: curr.value,
        upper: curr.value.toUpperCase() === curr.value,
      }),
      [],
    );
}

function WordPuzzle({ text }: WordPuzzleProps, ref: any) {
  const classes = useStyles();

  const [chars, setChars] = useState<AbstractChar[]>([]);
  const [charsByLine, setCharsByLine] = useState<AbstractChar[][]>([]);
  const [charsByLineAndWord, setCharsByLineAndWord] = useState<AbstractChar[][][]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const handleGiveClue = () => {
    const total = Math.ceil((answers.length * 10) / 100);

    let indexes = range(0, answers.length);
    indexes = indexes.filter((index) => answers[index].value.length === 0);
    indexes = shuffle(indexes);
    indexes = indexes.slice(0, total);

    indexes.forEach((index) => {
      answers[index].value = answers[index].solution;
    });

    setAnswers([...answers]);
  };

  const handleClickLetter = (index: number) => {
    setCurrentCharIndex(index);
  };

  useImperativeHandle(ref, () => ({
    giveClue() {
      handleGiveClue();
    },
  }));

  useEffect(() => {
    const chars$ = parseText(text);
    const charsByLine$ = Object.values(groupBy(chars$, "line"));
    const charsByLineAndWord$ = charsByLine$.map((line) => Object.values(groupBy(line, "word")));

    setCharsByLineAndWord(charsByLineAndWord$);
    setCharsByLine(charsByLine$);
    setChars(chars$);
    setAnswers(getDefaultAnswers(chars$));
  }, [text]);

  useEffect(() => {
    const moveLeft = () => {
      setCurrentCharIndex(Math.max(0, currentCharIndex - 1));
    };

    const moveRight = () => {
      setCurrentCharIndex(Math.min(answers.length - 1, currentCharIndex + 1));
    };

    const moveUp = () => {
      const currentLine = find(chars, ["index", currentCharIndex])!.line;

      if (currentLine === 0) return;

      const currentChar: AbstractChar = find(chars, ["index", currentCharIndex])!;
      const nextLine = currentLine - 1;
      const nextLineLetters = filter(chars, {
        type: "letter",
        line: nextLine,
      }) as Letter[];
      const nextChar = minBy(nextLineLetters, (char: AbstractChar) =>
        Math.abs(char.position - currentChar.position),
      ) as Letter;

      setCurrentCharIndex(nextChar.index);
    };

    const moveDown = () => {
      const currentLine = find(chars, ["index", currentCharIndex])!.line;

      if (currentLine === charsByLine.length - 1) return;

      const currentChar: AbstractChar = find(chars, ["index", currentCharIndex])!;
      const nextLine = currentLine + 1;
      const nextLineLetters = filter(chars, {
        type: "letter",
        line: nextLine,
      }) as Letter[];
      const nextChar = minBy(nextLineLetters, (char: AbstractChar) =>
        Math.abs(char.position - currentChar.position),
      ) as Letter;

      setCurrentCharIndex(nextChar.index);
    };

    const setChar = (char: string) => {
      const { upper } = answers[currentCharIndex];

      answers[currentCharIndex].value = upper ? char.toUpperCase() : char.toLowerCase();

      setAnswers([...answers]);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (/^[a-zA-Z0-9]$/.test(event.key)) {
        event.preventDefault();
        setChar(event.key);
        moveRight();
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        answers[currentCharIndex].value = "";
        setAnswers([...answers]);
        moveLeft();
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        moveRight();
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveLeft();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        moveDown();
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        moveUp();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [answers, chars, charsByLine, currentCharIndex]);

  const renderLetter = (letter: Letter, charId: string) => {
    const { value, solution } = answers[letter.index];
    const isError = value.length && toLower(value) !== toLower(solution);
    const isSuccess = value.length && toLower(value) === toLower(solution);

    return (
      <div
        key={charId}
        className={classnames(classes.char, classes.letter, {
          [classes.current]: currentCharIndex === letter.index,
          [classes.success]: isSuccess,
          [classes.error]: isError,
        })}
        onClick={() => {
          handleClickLetter(letter.index);
        }}
      >
        {value}
      </div>
    );
  };

  const renderSymbol = (symbol: Symbol, charId: string) => {
    return (
      <div className={classnames(classes.char, classes.symbol)} key={charId}>
        {symbol.value}
      </div>
    );
  };

  const renderWord = (word: AbstractChar[], wordId: string) => {
    return (
      <div className={classes.word} key={wordId}>
        {word.map((char: AbstractChar, index) =>
          char.type === "letter"
            ? renderLetter(char as Letter, `${wordId}-${index}`)
            : renderSymbol(char, `${wordId}-${index}`),
        )}
      </div>
    );
  };

  const renderLine = (line: AbstractChar[][], lineId: number) => {
    return (
      <div className={classes.line} key={lineId}>
        {line.map((word: AbstractChar[], index) => renderWord(word, `${lineId}-${index}`))}
      </div>
    );
  };

  return <div className={classes.root}>{charsByLineAndWord.map((line, index) => renderLine(line, index))}</div>;
}

export default forwardRef(WordPuzzle);
