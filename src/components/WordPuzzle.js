import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import classnames from "classnames";
import flattenDeep from "lodash/flattenDeep";
import groupBy from "lodash/groupBy";
import toLower from "lodash/toLower";

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
    textAlign: "center",
    marginRight: 2,

    "& > span": {
      fontSize: 18,
      lineHeight: "30px",
      opacity: 0.7
    }
  },
  symbol: {},
  letter: {
    minWidth: LETTER_WIDTH,
    maxWidth: LETTER_WIDTH,
    borderBottom: "solid 1px rgba(255,255,255,0.3)",
    transition: "background .3s",
    cursor: "pointer",

    "&:hover": {
      background: "rgba(255,255,255,0.1)"
    }
  },
  current: {
    background: "rgba(255,255,255,0.1)"
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
            id: currentId++,
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

function WordPuzzle({ text }) {
  const classes = useStyles();

  const chars = parseText(text);
  const charsByLine = Object.values(groupBy(chars, "line"));
  const charsByLineAndWord = charsByLine.map(line =>
    Object.values(groupBy(line, "word"))
  );

  const [answers, setAnswers] = useState(getDefaultAnswers(chars));
  const [currentChar, setCurrentChar] = useState(0);

  const moveLeft = () => {
    setCurrentChar(Math.max(0, currentChar - 1));
  };

  const moveRight = () => {
    setCurrentChar(Math.min(answers.length - 1, currentChar + 1));
  };

  const moveUp = () => {
    const currentLine = chars[currentChar].line;

    if (currentLine === 0) return;

    setCurrentChar(charsByLine[currentLine - 1][0].id);
  };

  const moveDown = () => {
    const currentLine = chars[currentChar].line;

    if (currentLine === charsByLine.length - 1) return;

    const nextLine = currentLine + 1;

    setCurrentChar(charsByLine[nextLine][0].id);
  };

  const setChar = char => {
    const { upper } = answers[currentChar];

    answers[currentChar].value = upper
      ? char.toUpperCase()
      : char.toLowerCase();

    setAnswers([...answers]);
  };

  const handleKeyPress = event => {
    event.preventDefault();

    if (/^[a-zA-Z0-9]$/.test(event.key)) {
      setChar(event.key);
      moveRight();
    }

    if (event.key === "Backspace") {
      answers[currentChar].value = "";
      setAnswers([...answers]);
      moveLeft();
    }

    if (event.key === "ArrowRight") moveRight();
    if (event.key === "ArrowLeft") moveLeft();
    if (event.key === "ArrowDown") moveDown();
    if (event.key === "ArrowUp") moveUp();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [currentChar]);

  const renderChar = char => {
    if (char.type === "symbol") {
      return (
        <div className={classnames(classes.char, classes.symbol)} key={char.id}>
          <span>{char.value}</span>
        </div>
      );
    }

    const { value, solution } = answers[char.id];
    const isError = value.length && toLower(value) !== toLower(solution);
    const isSuccess = value.length && toLower(value) === toLower(solution);

    return (
      <div
        key={char.id}
        className={classnames(classes.char, classes.letter, {
          [classes.current]: currentChar === char.id,
          [classes.success]: isSuccess,
          [classes.error]: isError
        })}
      >
        <span>{value}</span>
      </div>
    );
  };

  const renderWord = (word, wordId) => {
    return (
      <div className={classes.word} key={wordId}>
        {word.map((char, index) => renderChar(char))}
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

export default WordPuzzle;
