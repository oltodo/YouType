import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { videoFormat } from "ytdl-core";
import find from "lodash/find";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import { RootState } from "redux/rootReducer";
import { fetchVideo } from "redux/slices/video";
import {
  initializeGame,
  setAnswer,
  setCurrentIndex,
  fillCurrentLetter,
  fillCurrentWord,
  fillWholeCaption,
  giveClue,
  Sequence,
} from "redux/slices/game";
import WordPuzzle from "components/WordPuzzle";
import Toolbar from "components/Toolbar";
import GameDetails from "components/GameDetails";

const TOOLBAR_HEIGHT = 56;
const PUZZLE_HEIGHT = 156;
const VERTICAL_MARGINS = 40;
const HORIZONTAL_MARGINS = 32;
const VIDEO_MARGIN = 24;
const TOOLBAR_MARGIN = 40;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      height: "100vh",
    },
    leftPanel: {
      boxSizing: "border-box",
      padding: `${VERTICAL_MARGINS}px ${HORIZONTAL_MARGINS}px`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100vh",
      maxHeight: "100vh",
      margin: "0 auto",
    },
    rightPanel: {
      borderLeft: "solid 1px rgba(255,255,255,0.1)",
      minWidth: 480,
      maxWidth: 560,
      padding: theme.spacing(5, 4),
      height: "100%",
      overflowY: "auto",
    },
    videoWrapper: {
      marginBottom: VIDEO_MARGIN,
    },
    video: {
      maxHeight: `calc(100vh - ${
        TOOLBAR_HEIGHT + PUZZLE_HEIGHT + VERTICAL_MARGINS * 2 + VIDEO_MARGIN + TOOLBAR_MARGIN
      }px)`,
      maxWidth: "100%",
      outline: 0,
    },
    toolbarWrapper: {
      marginBottom: TOOLBAR_MARGIN,
      width: 440,
      flexShrink: 0,
    },
    puzzleWrapper: {
      width: "100%",
      minHeight: PUZZLE_HEIGHT,
    },
  }),
);

const Game: React.FC = () => {
  const classes = useStyles();
  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));
  const previousTimeRef = useRef(0);

  const dispatch = useDispatch();
  const [video, game] = useSelector((state: RootState) => [state.video, state.game]);
  const { captions } = video;
  const { sequences } = game;

  const [currentSequenceIndex, setCurrentSequenceIndex] = useState<number | null>(null);
  const currentSequence: Sequence | null = currentSequenceIndex !== null ? sequences[currentSequenceIndex] : null;

  const [playTo, setPlayTo] = useState(0);

  const getPreviousSequence = () => {
    if (currentSequenceIndex === null) {
      const index = sequences.findIndex(curr => curr.start >= videoRef.current.currentTime);

      return index > 0 ? sequences[index - 1] : null;
    }

    return sequences[currentSequenceIndex - 1] || null;
  };

  const getNextSequence = () => {
    if (currentSequenceIndex === null) {
      return sequences.find(curr => curr.start >= videoRef.current.currentTime);
    }

    return sequences[currentSequenceIndex + 1] || null;
  };

  const hasPreviousSequence = () => {
    if (sequences.length === 0 || videoRef.current === null) {
      return false;
    }

    return videoRef.current.currentTime > sequences[0].end;
  };

  const hasNextSequence = () => {
    if (sequences.length === 0 || videoRef.current === null) {
      return false;
    }

    if (currentSequence && !currentSequence.completed) {
      return false;
    }

    const start = sequences[sequences.length - 1].start;

    return videoRef.current.currentTime < start;
  };

  const handlePreviousSequence = () => {
    videoRef.current.pause();

    const previousSequence = getPreviousSequence();

    if (previousSequence) {
      videoRef.current.currentTime = previousSequence.start + 0.01;
    }
  };

  const handleNextSequence = () => {
    videoRef.current.pause();

    const nextSequence = getNextSequence();

    if (nextSequence) {
      videoRef.current.currentTime = nextSequence.start + 0.01;
    }
  };

  const handleFillCurrentLetter = () => {
    if (currentSequence) {
      dispatch(fillCurrentLetter(currentSequence.index));
    }
  };

  const handleFillCurrentWord = () => {
    if (currentSequence) {
      dispatch(fillCurrentWord(currentSequence.index));
    }
  };

  const handleFillCurrentCaption = () => {
    if (currentSequence) {
      dispatch(fillWholeCaption(currentSequence.index));
    }
  };

  const handleReplayCurrentSequence = (speed: number) => {
    if (!currentSequence) {
      return;
    }

    previousTimeRef.current = currentSequence.start;
    videoRef.current.currentTime = currentSequence.start + 0.01;
    videoRef.current.playbackRate = speed;
    videoRef.current.play();
  };

  const handlePlayerFocus = () => {
    videoRef.current.blur();
  };

  const handleGiveClue = () => {
    if (currentSequence) {
      dispatch(giveClue(currentSequence.index));
    }
  };

  useEffect(() => {
    dispatch(fetchVideo("https://www.youtube.com/watch?v=hLltkC-G5dY"));
  }, [dispatch]);

  useEffect(() => {
    if (captions) {
      dispatch(initializeGame(captions));
    }
  }, [captions, dispatch]);

  useEffect(() => {
    const videoElt = videoRef.current;
    videoElt.addEventListener("focus", handlePlayerFocus);

    return () => {
      videoElt.removeEventListener("focus", handlePlayerFocus);
    };
  }, []);

  useEffect(() => {
    const nextUncompletedSequence = sequences.find(seq => seq.completed === false);
    setPlayTo(nextUncompletedSequence?.end || Infinity);
  }, [sequences]);

  useEffect(() => {
    const videoElt = videoRef.current;

    const handleContinue = () => {
      if (!videoElt.paused) {
        videoElt.pause();
        return;
      }

      if (videoElt.currentTime < playTo - 0.5) {
        videoElt.play();
        return;
      }
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleContinue();
      }

      if (event.key === " ") {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [playTo]);

  useEffect(() => {
    const videoElt = videoRef.current;

    const handleTimeUpdate = () => {
      const { currentTime } = videoElt;

      if (currentTime >= playTo) {
        videoElt.pause();
        videoElt.currentTime = playTo - 0.01;
        return;
      }

      const index = sequences.findIndex(({ start, end }) => currentTime <= end && currentTime >= start);
      if (index === -1) {
        setCurrentSequenceIndex(null);
      } else if (index >= 0 && currentSequenceIndex !== index) {
        setCurrentSequenceIndex(index);
      }
    };

    videoElt.ontimeupdate = () => handleTimeUpdate();
  }, [currentSequenceIndex, playTo, sequences]);

  const renderVideo = () => {
    const format = find(video.formats, ["itag", 22]) as videoFormat;

    if (!format) {
      return null;
    }

    return (
      <video ref={videoRef} className={classes.video} controls controlsList="nodownload nofullscreen noremoteplayback">
        <source src={format.url} type={format.mimeType} />
      </video>
    );
  };

  const renderPuzzle = () => {
    if (!currentSequence) {
      return null;
    }

    const sequence = find(sequences, ["index", currentSequence.index]);

    if (!sequence) {
      return null;
    }

    return (
      <WordPuzzle
        key={currentSequence.start}
        sequence={sequence}
        onMoved={index => {
          dispatch(setCurrentIndex({ sequenceIndex: sequence.index, index }));
        }}
        onTyped={(index, value) => {
          dispatch(setAnswer({ sequenceIndex: sequence.index, index, value }));
          dispatch(setCurrentIndex({ sequenceIndex: sequence.index, index: index + 1 }));
        }}
        onRemoved={index => {
          dispatch(setAnswer({ sequenceIndex: sequence.index, index, value: "" }));
          dispatch(setCurrentIndex({ sequenceIndex: sequence.index, index: index - 1 }));
        }}
      />
    );
  };

  if (video.error || video.isLoading) {
    return null;
  }

  return (
    <div className={classes.root}>
      <div className={classes.leftPanel}>
        <div className={classes.videoWrapper}>{renderVideo()}</div>
        <div className={classes.toolbarWrapper}>
          <Toolbar
            disableActions={!currentSequence}
            disablePrevious={!hasPreviousSequence()}
            disableNext={!hasNextSequence()}
            onPreviousClicked={handlePreviousSequence}
            onNextClicked={handleNextSequence}
            onFillCurrentLetterClicked={handleFillCurrentLetter}
            onFillCurrentWordClicked={handleFillCurrentWord}
            onFillCurrentCaptionClicked={handleFillCurrentCaption}
            onReplay05Clicked={() => handleReplayCurrentSequence(0.5)}
            onReplay07Clicked={() => handleReplayCurrentSequence(0.7)}
            onReplay1Clicked={() => handleReplayCurrentSequence(1)}
            onJackpotClicked={() => handleGiveClue()}
          />
        </div>
        <div className={classes.puzzleWrapper}>{renderPuzzle()}</div>
      </div>
      <div className={classes.rightPanel}>
        <GameDetails
          video={video}
          sequence={currentSequence}
          totalSequences={sequences.length}
          progress={game.progress}
        />
      </div>
    </div>
  );
};

export default Game;
