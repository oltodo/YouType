import React, { useState, useEffect, useRef } from "react";
// import { getVideoID } from "ytdl-core";
import get from "lodash/get";
import find from "lodash/find";
import inRange from "lodash/inRange";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import ArrowLeftIcon from "@material-ui/icons/ArrowLeft";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import KeyIcon from "@material-ui/icons/VpnKey";

import Speed05Icon from "./components/icons/Speed05";
import Speed07Icon from "./components/icons/Speed07";
import Speed1Icon from "./components/icons/Speed1";

import WordPuzzle from "./components/WordPuzzle";
import { parse } from "./utils/caption";

import videoPath from "./data/video.mp4";
import videoDataPath from "./data/video.json.raw";
import captionsDataPath from "./data/en.xml.raw";

type Caption = {
  index: number;
  text: string;
  start: number;
  end: number;
  duration: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 48,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxWidth: 1280,
      margin: "0 auto"
    },
    video: {
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
      marginBottom: 40,
      maxWidth: "100%",
      outline: 0
    },
    toolbar: {
      marginBottom: 32
    }
  })
);

function Playground() {
  const classes = useStyles();
  const videoRef = useRef<HTMLVideoElement>(document.createElement("video"));
  const puzzleRef = useRef<any>(null);
  const previousTimeRef = useRef(0);

  // const videoUrl = "https://www.youtube.com/watch?v=hLltkC-G5dY";

  const [videoData, setVideoData] = useState<any>(null);
  const [videoCaptions, setVideoCaptions] = useState<Caption[]>([]);
  const [currentCaption, setCurrentCaption] = useState<Caption | null>(null);

  const handlePlay = () => {
    videoRef.current.play();
  };

  const handlePreviousCaption = () => {
    videoRef.current.pause();

    if (!currentCaption) {
      const nextCaption = videoCaptions[0];
      videoRef.current.currentTime = nextCaption.start + 0.01;
      return;
    }

    if (currentCaption.index === 0) {
      return;
    }

    const nextCaption = videoCaptions[currentCaption.index - 1];
    videoRef.current.currentTime = nextCaption.start + 0.01;
  };

  const handleNextCaption = () => {
    videoRef.current.pause();

    if (!currentCaption) {
      const nextCaption = videoCaptions[0];
      videoRef.current.currentTime = nextCaption.start + 0.01;
      return;
    }

    if (currentCaption.index === videoCaptions.length - 1) {
      return;
    }

    const nextCaption = videoCaptions[currentCaption.index + 1];
    videoRef.current.currentTime = nextCaption.start + 0.01;
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
    puzzleRef.current.giveClue();
  };

  useEffect(() => {
    if (!videoData) {
      // const videoId = getVideoID(videoUrl);

      // fetch(`http://localhost:8000/v/${videoId}`)
      fetch(videoDataPath)
        .then(res => res.json())
        .then(data => {
          const captionsList = get(
            data,
            "player_response.captions.playerCaptionsTracklistRenderer.captionTracks"
          );
          const captions = find(captionsList, ["languageCode", "en"]);

          if (captions) {
            // return fetch(caption.baseUrl)
            return fetch(captionsDataPath)
              .then(res => res.text())
              .then(text => {
                setVideoCaptions(parse(text));

                return data;
              });
          }

          return data;
        })
        .then(setVideoData);
    }
  }, [videoData]);

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
    const video = videoRef.current;

    video.addEventListener("focus", handlePlayerFocus);

    return () => {
      video.removeEventListener("focus", handlePlayerFocus);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const previousTime = previousTimeRef.current;

      if (currentCaption) {
        if (
          inRange(currentTime, currentCaption.start, currentCaption.end - 0.01)
        ) {
          return;
        }

        if (
          !video.paused &&
          previousTime < currentCaption.end &&
          currentTime >= currentCaption.end
        ) {
          video.pause();
          video.currentTime = currentCaption.end - 0.01;
          video.playbackRate = 1;
          previousTimeRef.current = currentTime;
          return;
        }
      }

      const caption = find(videoCaptions, ({ start, end }) =>
        inRange(currentTime, start, end)
      ) as Caption;

      setCurrentCaption(caption);
    };

    video.oncanplay = () => {
      // video.currentTime = 202;
      // handlePlay()
    };
    video.ontimeupdate = () => handleTimeUpdate();
  }, [currentCaption, videoCaptions]);

  const renderVideo = () => {
    if (videoData === null) {
      return <video ref={videoRef} className={classes.video} />;
    }

    const format = find(videoData.formats, ["itag", 22]);
    format.url = videoPath;

    return (
      <video
        ref={videoRef}
        className={classes.video}
        controls
        controlsList="nodownload nofullscreen noremoteplayback"
      >
        <source src={format.url} type={format.mimmeType} />
      </video>
    );
  };

  return (
    <div className={classes.root}>
      {renderVideo()}
      {/* <div>{currentCaption && currentCaption.text}</div> */}

      <div className={classes.toolbar}>
        <ButtonGroup size="small" aria-label="outlined primary button group">
          <Tooltip title="Previous caption">
            <Button onClick={handlePreviousCaption}>
              <ArrowLeftIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Replay sequence">
            <Button onClick={() => handleReplayCurrentCaption(0.5)}>
              <Speed05Icon />
            </Button>
          </Tooltip>
          <Tooltip title="Replay sequence">
            <Button onClick={() => handleReplayCurrentCaption(0.7)}>
              <Speed07Icon />
            </Button>
          </Tooltip>
          <Tooltip title="Replay sequence">
            <Button onClick={() => handleReplayCurrentCaption(1)}>
              <Speed1Icon />
            </Button>
          </Tooltip>
          <Tooltip title="Give a clue">
            <Button onClick={() => handleGiveClue()}>
              <KeyIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Next caption">
            <Button onClick={handleNextCaption}>
              <ArrowRightIcon />
            </Button>
          </Tooltip>
        </ButtonGroup>
      </div>

      {currentCaption && (
        <WordPuzzle
          ref={puzzleRef}
          key={currentCaption.start}
          text={currentCaption.text}
        ></WordPuzzle>
      )}
    </div>
  );
}

export default Playground;
