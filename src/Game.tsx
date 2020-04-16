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
  deleteAnswer,
  setCurrentIndex,
  fillCurrentLetter,
  fillCurrentWord,
  fillWholeCaption,
  giveClue,
} from "redux/slices/game";
import { Caption } from "utils/caption";
import WordPuzzle from "components/WordPuzzle";
import Toolbar from "components/Toolbar";
import GameDetails from "components/GameDetails";

const TOOLBAR_HEIGHT = 56;
const PUZZLE_HEIGHT = 156;
const MARGINS = 40;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    leftPanel: {
      boxSizing: "border-box",
      padding: MARGINS,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100vh",
      maxHeight: "100vh",
      margin: "0 auto",
    },
    rightPanel: {
      borderLeft: "solid 1px rgba(255,255,255,0.1)",
      width: 480,
      padding: theme.spacing(5, 4),
    },
    videoWrapper: {
      marginBottom: MARGINS,
    },
    video: {
      maxHeight: `calc(100vh - ${TOOLBAR_HEIGHT + PUZZLE_HEIGHT + MARGINS * 4}px)`,
      maxWidth: "100%",
      outline: 0,
    },
    toolbarWrapper: {
      marginBottom: theme.spacing(4),
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

  const [currentCaption, setCurrentCaption] = useState<Caption | null>(null);

  const isFirstSequence = () => {
    if (!captions || captions.length === 0 || videoRef.current === null) {
      return true;
    }

    const start = captions[0].start;

    return videoRef.current.currentTime < start;
  };

  const isLastSequence = () => {
    if (!captions || captions.length === 0 || videoRef.current === null) {
      return true;
    }

    const start = captions[captions.length - 1].start;

    return videoRef.current.currentTime >= start;
  };

  const handlePlay = () => {
    videoRef.current.play();
  };

  const handlePreviousCaption = () => {
    videoRef.current.pause();

    if (!currentCaption) {
      const nextCaption = captions[0];
      videoRef.current.currentTime = nextCaption.start + 0.01;
      return;
    }

    if (currentCaption.index === 0) {
      return;
    }

    const nextCaption = captions[currentCaption.index - 1];
    videoRef.current.currentTime = nextCaption.start + 0.01;
  };

  const handleNextCaption = () => {
    videoRef.current.pause();

    if (!currentCaption) {
      const nextCaption = captions[0];
      videoRef.current.currentTime = nextCaption.start + 0.01;
      return;
    }

    if (currentCaption.index === captions.length - 1) {
      return;
    }

    const nextCaption = captions[currentCaption.index + 1];
    videoRef.current.currentTime = nextCaption.start + 0.01;
  };

  const handleFillCurrentLetter = () => {
    if (currentCaption) {
      dispatch(fillCurrentLetter(currentCaption.index));
    }
  };

  const handleFillCurrentWord = () => {
    if (currentCaption) {
      dispatch(fillCurrentWord(currentCaption.index));
    }
  };

  const handleFillCurrentCaption = () => {
    if (currentCaption) {
      dispatch(fillWholeCaption(currentCaption.index));
    }
  };

  const handleReplayCurrentCaption = (speed: number) => {
    if (!currentCaption) {
      return;
    }

    previousTimeRef.current = currentCaption.start;
    videoRef.current.currentTime = currentCaption.start + 0.01;
    videoRef.current.playbackRate = speed;
    handlePlay();
  };

  const handlePlayerFocus = () => {
    videoRef.current.blur();
  };

  const handleGiveClue = () => {
    if (currentCaption) {
      dispatch(giveClue(currentCaption.index));
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

      if (currentCaption) {
        if (inRange(currentTime, currentCaption.start, currentCaption.end - 0.01)) {
          return;
        }

        if (!videoElt.paused && previousTime < currentCaption.end && currentTime >= currentCaption.end) {
          videoElt.pause();
          videoElt.currentTime = currentCaption.end - 0.01;
          videoElt.playbackRate = 1;
          previousTimeRef.current = currentTime;
          return;
        }
      }

      const caption = find(captions, ({ start, end }) => inRange(currentTime, start, end)) as Caption;

      setCurrentCaption(caption);
    };

    videoElt.oncanplay = () => {
      // video.currentTime = 202;
      // handlePlay()
    };
    videoElt.ontimeupdate = () => handleTimeUpdate();
  }, [currentCaption, captions]);

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
    if (!currentCaption) {
      return null;
    }

    const sequence = find(sequences, ["index", currentCaption.index]);

    if (!sequence) {
      return null;
    }

    return (
      <WordPuzzle
        key={currentCaption.start}
        sequence={sequence}
        onMoved={index => {
          dispatch(setCurrentIndex({ sequenceIndex: sequence.index, index }));
        }}
        onTyped={(index, value) => {
          dispatch(setAnswer({ sequenceIndex: sequence.index, index, value }));
          dispatch(setCurrentIndex({ sequenceIndex: sequence.index, index: index + 1 }));
        }}
        onRemoved={index => {
          dispatch(deleteAnswer({ sequenceIndex: sequence.index, index }));
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
            disableActions={!currentCaption}
            disablePrevious={isFirstSequence()}
            disableNext={isLastSequence()}
            onPreviousClicked={handlePreviousCaption}
            onNextClicked={handleNextCaption}
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
        <GameDetails />
      </div>
    </div>
  );
};

export default Game;
