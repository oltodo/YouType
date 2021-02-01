import { NowRequest, NowResponse } from "@vercel/node";
import { getInfo, videoInfo, captionTrack } from "ytdl-core";
import update from "lodash/update";

const mocks = ["hLltkC-G5dY", "8KkKuTCFvzI"];

const video = (req: NowRequest, res: NowResponse) => {
  const {
    query: { id },
  } = req;

  if (!id || Array.isArray(id)) {
    res.status(403);
    res.json({ error: "No id provided" });
    return;
  }

  if (mocks.includes(id)) {
    const data: videoInfo = require(`./data/${id}.json`);

    data.formats = data.formats.map(format => ({ ...format, url: `/mock/${id}/video.mp4` }));

    update(
      data,
      ["player_response", "captions", "playerCaptionsTracklistRenderer", "captionTracks"],
      (captionTracks: captionTrack[]) =>
        captionTracks.map((captionTrack: captionTrack) => ({
          ...captionTrack,
          baseUrl: `/mock/${id}/${captionTrack.languageCode}.xml`,
        })),
    );

    res.json(data);
    return;
  }

  getInfo(`${id}`)
    .catch(() => {
      res.status(404);
      res.json({ error: "Video not found" });
    })
    .then((data: any) => {
      res.json(data);
    });
};

export default video;
