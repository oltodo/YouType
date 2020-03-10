import React, { useState, useEffect } from "react";
import { getVideoID, filterFormats } from "ytdl-core";
import find from "lodash/find";

function Playground() {
  const videoUrl = "https://www.youtube.com/watch?v=hLltkC-G5dY";

  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    if (!videoData) {
      const videoId = getVideoID(videoUrl);
      fetch(`http://localhost:8000/v/${videoId}`)
        .then(res => res.json())
        .then(setVideoData);
    }
  }, []);

  if (!videoData) {
    return null;
  }

  const format = find(videoData.formats, ["itag", 247]);
  console.log(format);

  return (
    <div>
      <video src={format.url} type={format.mimmeType} />
    </div>
  );
}

export default Playground;
