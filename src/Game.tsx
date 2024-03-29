import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router";
import find from "lodash/find";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import type { videoFormat } from "ytdl-core";
import { useBeforeunload } from "react-beforeunload";

import { RootState } from "redux/rootReducer";
import { fetchVideo } from "redux/slices/video";
import {
  initializeGame,
  completeSequences,
  setAnswer,
  setCurrentIndex,
  fillWord,
  fillCaption,
  adjustSequence,
} from "redux/slices/game";
import { findNextLetterIndex, findNextWordLetterIndex, Sequence } from "utils/game";
import WordPuzzle from "components/WordPuzzle";
import Toolbar from "components/Toolbar";
import GameDetails from "components/GameDetails";

interface QueryParams {
  id: string;
}

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
      minWidth: 940,
    },
    leftPanel: {
      width: "60%",
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
      width: "40%",
      maxWidth: 560,
      flexShrink: 1,
      borderLeft: "solid 1px rgba(255,255,255,0.1)",
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
      maxWidth: 560,
    },
  }),
);

const Game: React.FC = () => {
  const classes = useStyles();
  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));
  const { id } = useParams<QueryParams>();

  const dispatch = useDispatch();
  const video = useSelector((state: RootState) => state.video);
  const game = useSelector((state: RootState) => state.game);
  const { sequences } = game;

  const [sequenceIndex, setSequenceIndex] = useState<number | null>(null);
  const [playTo, setPlayTo] = useState(0);

  const currentSequence: Sequence | null = sequenceIndex !== null ? sequences[sequenceIndex] : null;

  const getPreviousSequence = () => {
    if (sequenceIndex === null) {
      const index = sequences.findIndex(curr => curr.timeRange[0] >= videoRef.current.currentTime);

      return index > 0 ? sequences[index - 1] : null;
    }

    return sequences[sequenceIndex - 1] || null;
  };

  const getNextSequence = () => {
    if (sequenceIndex === null) {
      return sequences.find(curr => curr.timeRange[0] >= videoRef.current.currentTime);
    }

    return sequences[sequenceIndex + 1] || null;
  };

  const findSequenceIndex = (sequences: Sequence[], currentTime: number) => {
    let index = 0;

    for (; index < sequences.length; index += 1) {
      const { timeRange } = sequences[index];

      if (currentTime < timeRange[0]) {
        break;
      }
    }

    return index - 1;
  };

  const handlePlayerFocus = () => {
    videoRef.current.blur();
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

    const start = sequences[sequences.length - 1].timeRange[0];

    return videoRef.current.currentTime < start;
  };

  const handlePreviousSequence = () => {
    videoRef.current.pause();
    const previousSequence = getPreviousSequence();

    if (previousSequence) {
      videoRef.current.currentTime = previousSequence.timeRange[0] + 0.01;
    }
  };

  const handleNextSequence = () => {
    videoRef.current.pause();
    const nextSequence = getNextSequence();

    if (nextSequence) {
      videoRef.current.currentTime = nextSequence.timeRange[0] + 0.01;
    }
  };

  const handleFillCurrentLetter = () => {
    if (sequenceIndex !== null && currentSequence) {
      const { chars, currentIndex } = currentSequence;
      dispatch(setAnswer({ sequenceIndex, index: currentIndex, value: chars[currentIndex].value }));
      dispatch(setCurrentIndex({ sequenceIndex, index: findNextLetterIndex(currentSequence) }));
    }
  };

  const handleFillCurrentWord = () => {
    if (sequenceIndex !== null && currentSequence) {
      const { chars, currentIndex } = currentSequence;
      dispatch(fillWord(sequenceIndex, chars[currentIndex].wordIndex));
      dispatch(setCurrentIndex({ sequenceIndex, index: findNextWordLetterIndex(currentSequence) }));
    }
  };

  const handleFillCurrentCaption = () => {
    if (sequenceIndex !== null) {
      dispatch(fillCaption(sequenceIndex));
    }
  };

  const handleReplayCurrentSequence = (speed: number) => {
    if (!currentSequence) {
      return;
    }

    videoRef.current.currentTime = currentSequence.timeRange[0] + 0.01;
    videoRef.current.playbackRate = speed;
    videoRef.current.play();
  };

  const handleReachSequence = (index: number) => {
    dispatch(completeSequences(index));
    setSequenceIndex(index);
    videoRef.current.currentTime = sequences[index].timeRange[0] + 0.01;
  };

  useBeforeunload(() => "Are you sure you want to leave?");

  useEffect(() => {
    if (id) {
      dispatch(fetchVideo(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (video.isLoaded) {
      dispatch(
        initializeGame({
          originalCaptions: video.originalCaptions,
          localCaptions: video.localCaptions,
        }),
      );
    }
  }, [dispatch, video]);

  useEffect(() => {
    const videoElt = videoRef.current;
    videoElt.addEventListener("focus", handlePlayerFocus);

    return () => {
      videoElt.removeEventListener("focus", handlePlayerFocus);
    };
  }, []);

  useEffect(() => {
    const nextUncompletedSequence = sequences.find(seq => seq.completed === false);

    if (nextUncompletedSequence) {
      setPlayTo(nextUncompletedSequence.timeRange[1]);
    } else {
      setPlayTo(Infinity);
    }
  }, [sequences]);

  useEffect(() => {
    const videoElt = videoRef.current;

    const handleContinue = () => {
      if (!videoElt.paused) {
        videoElt.pause();
        return;
      }

      if (videoElt.currentTime < playTo - 0.5) {
        videoElt.playbackRate = 1;
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

      const index = findSequenceIndex(sequences, currentTime);
      if (index === -1) {
        setSequenceIndex(null);
      } else if (index >= 0 && sequenceIndex !== index) {
        setSequenceIndex(index);
      }
    };

    if (videoElt) {
      videoElt.ontimeupdate = () => handleTimeUpdate();
    }
  }, [sequenceIndex, playTo, sequences]);

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
    if (!currentSequence || sequenceIndex === null) {
      return null;
    }

    return (
      <WordPuzzle
        key={currentSequence.timeRange[0]}
        sequence={currentSequence}
        onMoved={index => {
          dispatch(setCurrentIndex({ sequenceIndex, index }));
        }}
        onTyped={(index, value) => {
          dispatch(setAnswer({ sequenceIndex, index, value }));
        }}
      />
    );
  };

  if (!video.isLoaded || video.error || video.isLoading) {
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
          onRechSequenceSubmited={handleReachSequence}
          onAdjusted={value => {
            if (sequenceIndex) {
              dispatch(adjustSequence(sequenceIndex, value));
            }
          }}
        />
      </div>
    </div>
  );
};

export default Game;
