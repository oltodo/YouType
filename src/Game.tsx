import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { videoFormat } from "ytdl-core";
import find from "lodash/find";
import inRange from "lodash/inRange";
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

  const isFirstSequence = () => {
    if (!sequences || sequences.length === 0 || videoRef.current === null) {
      return true;
    }

    const start = sequences[0].start;

    return videoRef.current.currentTime < start;
  };

  const isLastSequence = () => {
    if (!sequences || sequences.length === 0 || videoRef.current === null) {
      return true;
    }

    const start = sequences[sequences.length - 1].start;

    return videoRef.current.currentTime >= start;
  };

  const handlePlay = () => {
    videoRef.current.play();
  };

  const handlePreviousCaption = () => {
    videoRef.current.pause();

    if (!currentSequence) {
      const nextSequence = sequences[0];
      videoRef.current.currentTime = nextSequence.start + 0.01;
      return;
    }

    if (currentSequence.index === 0) {
      return;
    }

    const nextSequence = sequences[currentSequence.index - 1];
    videoRef.current.currentTime = nextSequence.start + 0.01;
  };

  const handleNextSequence = () => {
    videoRef.current.pause();

    if (!currentSequence) {
      const nextSequence = sequences[0];
      videoRef.current.currentTime = nextSequence.start + 0.01;
      return;
    }

    if (currentSequence.index === sequences.length - 1) {
      return;
    }

    const nextSequence = sequences[currentSequence.index + 1];
    videoRef.current.currentTime = nextSequence.start + 0.01;
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

  const handleReplayCurrentCaption = (speed: number) => {
    if (!currentSequence) {
      return;
    }

    previousTimeRef.current = currentSequence.start;
    videoRef.current.currentTime = currentSequence.start + 0.01;
    videoRef.current.playbackRate = speed;
    handlePlay();
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
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handlePlay();
      }

      if (event.key === " ") {
        event.preventDefault();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const videoElt = videoRef.current;

    videoElt.addEventListener("focus", handlePlayerFocus);

    return () => {
      videoElt.removeEventListener("focus", handlePlayerFocus);
    };
  }, []);

  useEffect(() => {
    const videoElt = videoRef.current;

    const handleTimeUpdate = () => {
      const currentTime = videoElt.currentTime;
      const previousTime = previousTimeRef.current;

      if (currentSequence) {
        if (inRange(currentTime, currentSequence.start, currentSequence.end - 0.01)) {
          return;
        }

        if (!videoElt.paused && previousTime < currentSequence.end && currentTime >= currentSequence.end) {
          videoElt.pause();
          videoElt.currentTime = currentSequence.end - 0.01;
          videoElt.playbackRate = 1;
          previousTimeRef.current = currentTime;
          return;
        }
      }

      const index = sequences.findIndex(({ start, end }) => inRange(currentTime, start, end));
      setCurrentSequenceIndex(index);
    };

    videoElt.oncanplay = () => {
      // video.currentTime = 202;
      // handlePlay()
    };
    videoElt.ontimeupdate = () => handleTimeUpdate();
  }, [currentSequence, sequences]);

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
            disablePrevious={isFirstSequence()}
            disableNext={isLastSequence()}
            onPreviousClicked={handlePreviousCaption}
            onNextClicked={handleNextSequence}
            onFillCurrentLetterClicked={handleFillCurrentLetter}
            onFillCurrentWordClicked={handleFillCurrentWord}
            onFillCurrentCaptionClicked={handleFillCurrentCaption}
            onReplay05Clicked={() => handleReplayCurrentCaption(0.5)}
            onReplay07Clicked={() => handleReplayCurrentCaption(0.7)}
            onReplay1Clicked={() => handleReplayCurrentCaption(1)}
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
