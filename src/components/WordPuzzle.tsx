import React, { useEffect, useState, useRef, createRef, RefObject } from "react";
import { makeStyles } from "@material-ui/core";
import classnames from "classnames";
import groupBy from "lodash/groupBy";
import toLower from "lodash/toLower";
import chunk from "lodash/chunk";
import { Char, findNextLetterIndex, findPreviousIndex, Sequence } from "utils/game";

interface WordPuzzleProps {
  sequence: Sequence;
  onMoved: (index: number) => void;
  onTyped: (index: number, value: string) => void;
}

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
    marginRight: 1,
  },
  symbol: {},
  letter: {
    minWidth: 12,
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
  disabled: {
    color: "rgba(255,255,255,0.7)",
    background: "transparent !important",
    cursor: "default",
  },
});

function findNearerIndex(refs: RefObject<RefObject<any>[]>, currentIndex: number, position: "above" | "below"): number {
  if (refs.current === null) {
    return -1;
  }

  const { current } = refs.current[currentIndex];
  const currentOffset = current.getBoundingClientRect();

  return refs.current.reduce(
    (acc, ref, index) => {
      const offset = ref.current.getBoundingClientRect();

      if (
        (position === "above" && currentOffset.y <= offset.y) ||
        (position === "below" && currentOffset.y >= offset.y)
      ) {
        return acc;
      }

      const distance = Math.abs(
        Math.sqrt(Math.pow(offset.x - currentOffset.x, 2) + Math.pow(offset.y - currentOffset.y, 2)),
      );

      if (distance > acc[1]) {
        return acc;
      }

      return [index, distance];
    },
    [-1, Infinity],
  )[0];
}

function WordPuzzle({ sequence, onTyped, onMoved }: WordPuzzleProps, ref: any) {
  const classes = useStyles();

  const { chars, currentIndex, completed } = sequence;

  const [charsByLineAndWord, setCharsByLineAndWord] = useState<Char[][][]>([]);

  const charRefs: RefObject<RefObject<any>[]> = useRef(chars.map(() => createRef()));

  const lettersCount = chars.reduce<number>((acc, char) => (char.type === "letter" ? acc + 1 : acc), 0);

  const handleClickLetter = (index: number) => {
    onMoved(index);
  };

  useEffect(() => {
    const words = Object.values(groupBy(chars, ({ lineIndex, wordIndex }) => `${lineIndex}-${wordIndex}`));
    const lines = Math.ceil(chars.length / 25);

    setCharsByLineAndWord(chunk(words, Math.ceil(words.length / lines)));
  }, [chars]);

  useEffect(() => {
    if (completed) {
      return () => {};
    }

    const moveLeft = () => {
      onMoved(findPreviousIndex(sequence));
    };
    const moveRight = () => {
      onMoved(findNextLetterIndex(sequence));
    };
    const moveUp = () => {
      const nextIndex = findNearerIndex(charRefs, currentIndex, "above");

      if (nextIndex >= 0) {
        onMoved(nextIndex);
      }
    };
    const moveDown = () => {
      const nextIndex = findNearerIndex(charRefs, currentIndex, "below");

      if (nextIndex >= 0) {
        onMoved(nextIndex);
      }
    };
    const type = (index: number, char: string) => {
      const { value, answer } = sequence.chars[index];

      if (value !== answer) {
        onTyped(index, char);
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (completed || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      if (/^[a-zA-Z0-9]$/.test(event.key)) {
        event.preventDefault();
        type(currentIndex, event.key);
        moveRight();
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        const { answer, value } = sequence.chars[currentIndex];

        if (answer === "" || answer === value) {
          type(Math.max(0, currentIndex - 1), "");
          moveLeft();
        } else {
          type(currentIndex, "");
        }
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
  }, [lettersCount, completed, currentIndex, onMoved, onTyped, chars, sequence.chars]);

  const renderLetter = (letter: Char, charId: string) => {
    const { value, answer } = letter;
    const isError = answer.length > 0 && toLower(answer) !== toLower(value);
    const isSuccess = answer.length > 0 && toLower(answer) === toLower(value);

    return (
      <div
        key={charId}
        ref={charRefs.current![letter.index]}
        className={classnames(classes.char, classes.letter, {
          [classes.disabled]: completed,
          [classes.current]: currentIndex === letter.index,
          [classes.success]: isSuccess,
          [classes.error]: isError,
        })}
        onClick={() => {
          handleClickLetter(letter.index);
        }}
      >
        {answer}
      </div>
    );
  };

  const renderSymbol = (symbol: Char, charId: string) => {
    return (
      <div
        className={classnames(classes.char, classes.symbol, {
          [classes.disabled]: completed,
        })}
        key={charId}
      >
        {symbol.value}
      </div>
    );
  };

  const renderWord = (word: Char[], wordId: string) => {
    return (
      <div className={classes.word} key={wordId}>
        {word.map((char: Char, index) =>
          char.type === "letter" ? renderLetter(char, `${wordId}-${index}`) : renderSymbol(char, `${wordId}-${index}`),
        )}
      </div>
    );
  };

  const renderLine = (line: Char[][], lineId: number) => {
    return (
      <div className={classes.line} key={lineId}>
        {line.map((word: Char[], index) => renderWord(word, `${lineId}-${index}`))}
      </div>
    );
  };

  return <div className={classes.root}>{charsByLineAndWord.map((line, index) => renderLine(line, index))}</div>;
}

export default WordPuzzle;
