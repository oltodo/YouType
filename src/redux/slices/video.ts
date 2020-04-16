import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { videoInfo, videoFormat } from "ytdl-core";
import get from "lodash/get";
import find from "lodash/find";

import { AppThunk } from "redux/store";
import { parse, Caption } from "utils/caption";

import videoDataUrl from "data/video.json.raw";
import videoUrl from "data/video.mp4";
import captionsDataPath from "data/en.xml.raw";

interface VideoAuthor {
  name: string;
  avatar: string;
}

export interface VideoState {
  title: string;
  description: string;
  author: VideoAuthor;
  duration: number;
  formats: videoFormat[];
  captions: Caption[];
  isLoading: boolean;
  error: string | null;
}

interface VideoSuccessPayload {
  video: videoInfo;
  captions: Caption[];
}

const initialState: VideoState = {
  title: "",
  description: "",
  author: {
    name: "",
    avatar: "",
  },
  duration: 0,
  formats: [],
  captions: [],
  isLoading: false,
  error: null,
};

async function getVideo(url: string) {
  // const videoId = getVideoID(url);

  // fetch(`http://localhost:8000/v/${videoId}`)
  return await fetch(videoDataUrl).then(res => res.json());
}

async function getCaptions(video: videoInfo) {
  const captionsList = get(video, "player_response.captions.playerCaptionsTracklistRenderer.captionTracks");
  const captions = find(captionsList, ["languageCode", "en"]);

  if (!captions) {
    return [];
  }

  // return fetch(caption.baseUrl)
  return fetch(captionsDataPath)
    .then(res => res.text())
    .then(data => parse(data));
}

function startLoading(state: VideoState) {
  state.isLoading = true;
}

function loadingFailed(state: VideoState, action: PayloadAction<string>) {
  state.isLoading = false;
  state.error = action.payload;
}

const slice = createSlice({
  name: "video",
  initialState,
  reducers: {
    getVideoSuccess(state, { payload }: PayloadAction<VideoSuccessPayload>) {
      const {
        video: { title, description, author, length_seconds, formats },
        captions,
      } = payload;

      state.title = title;
      state.description = description;
      state.author.name = author.name;
      state.author.avatar = author.avatar;
      state.duration = parseInt(length_seconds, 10);
      state.formats = formats.map(format => ({
        ...format,
        url: videoUrl,
      }));
      state.captions = captions;
      state.isLoading = false;
      state.error = null;
    },
    getVideoStart: startLoading,
    getVideoFailure: loadingFailed,
  },
});

export const { getVideoStart, getVideoSuccess, getVideoFailure } = slice.actions;

export default slice.reducer;

export const fetchVideo = (url: string): AppThunk => async dispatch => {
  try {
    dispatch(getVideoStart());
    const video = await getVideo(url);
    const captions = await getCaptions(video);
    dispatch(getVideoSuccess({ video, captions }));
  } catch (err) {
    dispatch(getVideoFailure(err.toString()));
  }
};
