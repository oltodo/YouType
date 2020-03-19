import React, {
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle
} from "react";
import { makeStyles } from "@material-ui/core";
import classnames from "classnames";
import flattenDeep from "lodash/flattenDeep";
import groupBy from "lodash/groupBy";
import toLower from "lodash/toLower";
import range from "lodash/range";
import shuffle from "lodash/shuffle";

const LETTER_WIDTH = 16;

const useStyles = makeStyles({
  line: {
    display: "flex",
    justifyContent: "center"
  },
  word: {
    display: "flex",
    margin: [[0, 8]],
    marginBottom: 8
  },
  char: {
    height: 30,
    fontSize: 18,
    lineHeight: "30px",
    textAlign: "center",
    marginRight: 2
  },
  symbol: {},
  letter: {
    minWidth: LETTER_WIDTH,
    maxWidth: LETTER_WIDTH,
    borderBottom: "solid 1px rgba(255,255,255,0.3)",
    transition: "background .3s",
    cursor: "pointer",

    "&:hover": {
      background: "rgba(255,255,255,0.05)"
    }
  },
  current: {
    background: "rgba(255,255,255,0.1) !important"
  },
  success: {
    borderBottomColor: "green"
  },
  error: {
    borderBottomColor: "red"
  }
});

function parseText(text) {
  let currentId = 0;
  let currentPosition = 0;

  return flattenDeep(
    text.split("\n").map((line, lineId) => {
      currentPosition = -LETTER_WIDTH * 2;

      return line.split(" ").map((word, wordId) => {
        currentPosition += LETTER_WIDTH;

        return Array.from(word).map((char, charId) => {
          currentPosition += LETTER_WIDTH;

          if (!/[a-zA-Z0-9]/.test(char)) {
            return {
              type: "symbol",
              value: char,
              line: lineId,
              word: wordId
            };
          }

          return {
            index: currentId++,
            type: "letter",
            value: char,
            line: lineId,
            word: wordId,
            position: currentPosition
          };
        });
      });
    })
  );
}

function getDefaultAnswers(chars) {
  return chars
    .filter(item => item.type === "letter")
    .map(
      curr => ({
        value: "",
        solution: curr.value,
        upper: curr.value.toUpperCase() === curr.value
      }),
      []
    );
}

function WordPuzzle({ text }, ref) {
  const classes = useStyles();

  const chars = parseText(text);
  const charsByLine = Object.values(groupBy(chars, "line"));
  const charsByLineAndWord = charsByLine.map(line =>
    Object.values(groupBy(line, "word"))
  );

  const [answers, setAnswers] = useState(getDefaultAnswers(chars));
  const [currentChar, setCurrentChar] = useState(0);

  const handleGiveClue = () => {
    const total = Math.ceil((answers.length * 10) / 100);

    let indexes = range(0, answers.length);
    indexes = indexes.filter(index => answers[index].value.length === 0);
    indexes = shuffle(indexes);
    indexes = indexes.slice(0, total);

    indexes.forEach(index => {
      answers[index].value = answers[index].solution;
    });

    setAnswers([...answers]);
  };

  const handleClickLetter = index => {
    setCurrentChar(index);
  };

  useImperativeHandle(ref, () => ({
    giveClue() {
      handleGiveClue();
    }
  }));

  useEffect(() => {
    const moveLeft = () => {
      setCurrentChar(Math.max(0, currentChar - 1));
    };

    const moveRight = () => {
      setCurrentChar(Math.min(answers.length - 1, currentChar + 1));
    };

    const moveUp = () => {
      const currentLine = chars[currentChar].line;

      if (currentLine === 0) return;

      setCurrentChar(charsByLine[currentLine - 1][0].index);
    };

    const moveDown = () => {
      const currentLine = chars[currentChar].line;

      if (currentLine === charsByLine.length - 1) return;

      const nextLine = currentLine + 1;

      setCurrentChar(charsByLine[nextLine][0].index);
    };

    const setChar = char => {
      const { upper } = answers[currentChar];

      answers[currentChar].value = upper
        ? char.toUpperCase()
        : char.toLowerCase();

      setAnswers([...answers]);
    };

    const handleKeyPress = event => {
      if (/^[a-zA-Z0-9]$/.test(event.key)) {
        event.preventDefault();
        setChar(event.key);
        moveRight();
      }

      if (event.key === "Backspace") {
        event.preventDefault();
        answers[currentChar].value = "";
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
  }, [answers, chars, charsByLine, currentChar]);

  const renderChar = (char, charId) => {
    if (char.type === "symbol") {
      return (
        <div className={classnames(classes.char, classes.symbol)} key={charId}>
          {char.value}
        </div>
      );
    }

    const { value, solution } = answers[char.index];
    const isError = value.length && toLower(value) !== toLower(solution);
    const isSuccess = value.length && toLower(value) === toLower(solution);

    return (
      <div
        key={charId}
        className={classnames(classes.char, classes.letter, {
          [classes.current]: currentChar === char.index,
          [classes.success]: isSuccess,
          [classes.error]: isError
        })}
        onClick={() => {
          handleClickLetter(char.index);
        }}
      >
        {value}
      </div>
    );
  };

  const renderWord = (word, wordId) => {
    return (
      <div className={classes.word} key={wordId}>
        {word.map((char, index) => renderChar(char, index))}
      </div>
    );
  };

  const renderLine = (line, lineId) => {
    return (
      <div className={classes.line} key={lineId}>
        {line.map((word, index) => renderWord(word, `${lineId}-${index}`))}
      </div>
    );
  };

  return (
    <div className={classes.root}>
      {charsByLineAndWord.map((line, index) => renderLine(line, index))}
    </div>
  );
}

export default forwardRef(WordPuzzle);
