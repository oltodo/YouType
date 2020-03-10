import React, { useState, useEffect, useCallback } from "react";
// import { getVideoID } from "ytdl-core";
import { makeStyles } from "@material-ui/core/styles";
import get from "lodash/get";
import find from "lodash/find";
import inRange from "lodash/inRange";
import { parse } from "./utils/caption";

import videoDataPath from "./data/video.json.raw";
import captionsDataPath from "./data/en.xml.raw";

const useStyles = makeStyles({
  root: {
    padding: 48,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  video: {
    boxShadow: [[0, 0, 10, "rgba(0, 0, 0, 0.5)"]],
    maxWidth: "100%",
    outline: 0
  }
});

function Playground() {
  const classes = useStyles();

  // const videoUrl = "https://www.youtube.com/watch?v=hLltkC-G5dY";

  const [videoData, setVideoData] = useState(null);
  const [videoCaptions, setVideoCaptions] = useState(null);
  const [currentCaption, setCurrentCaption] = useState(null);

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

  const videoRef = useCallback(
    video => {
      if (!video) {
        return;
      }

      video.ontimeupdate = () => {
        if (currentCaption) {
          if (
            inRange(video.currentTime, currentCaption.start, currentCaption.end)
          ) {
            return;
          }
        }

        const caption = find(videoCaptions, ({ start, end }) =>
          inRange(video.currentTime, start, end)
        );

        setCurrentCaption(caption);
      };
    },
    [videoCaptions, currentCaption]
  );

  if (!videoData) {
    return null;
  }

  const format = find(videoData.formats, ["itag", 22]);

  return (
    <div className={classes.root}>
      <video
        ref={videoRef}
        className={classes.video}
        src={format.url}
        type={format.mimmeType}
        controls
      />

      <div>{currentCaption && currentCaption.text}</div>
    </div>
  );
}

export default Playground;
