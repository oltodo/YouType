import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import get from "lodash/get";
import find from "lodash/find";
import type { videoInfo, videoFormat } from "ytdl-core";

import { AppThunk } from "redux/store";
import { parse, Caption } from "utils/caption";

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
  originalCaptions: Caption[] | null;
  localCaptions: Caption[] | null;
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

interface VideoSuccessPayload {
  video: videoInfo;
  originalCaptions: Caption[] | null;
  localCaptions: Caption[] | null;
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
  originalCaptions: null,
  localCaptions: null,
  isLoaded: false,
  isLoading: false,
  error: null,
};

function getVideo(id: string) {
  return fetch(`/api/video?id=${id}`).then(res => res.json());
}

async function getCaptions(video: videoInfo, languageCode: "en" | "fr") {
  const captionsList = get(video, "player_response.captions.playerCaptionsTracklistRenderer.captionTracks");
  const captions = find(captionsList, ["languageCode", languageCode]);

  if (!captions) {
    return null;
  }

  return fetch(captions.baseUrl)
    .then(res => res.text())
    .then(data => parse(data));
}

function startLoading(state: VideoState) {
  state.isLoaded = false;
  state.isLoading = true;
}

function loadingFailed(state: VideoState, action: PayloadAction<string>) {
  state.isLoaded = false;
  state.isLoading = false;
  state.error = action.payload;
}

const slice = createSlice({
  name: "video",
  initialState,
  reducers: {
    getVideoSuccess(state, { payload }: PayloadAction<VideoSuccessPayload>) {
      const {
        video: {
          videoDetails: { title, description, author, lengthSeconds },
          formats,
        },
        originalCaptions,
        localCaptions,
      } = payload;

      state.title = title;
      state.description = description || "";
      state.author.name = author.name;
      state.author.avatar = author.avatar;
      state.duration = parseInt(lengthSeconds, 10);
      state.formats = formats;
      state.originalCaptions = originalCaptions;
      state.localCaptions = localCaptions;
      state.isLoaded = true;
      state.isLoading = false;
      state.error = null;
    },
    getVideoStart: startLoading,
    getVideoFailure: loadingFailed,
  },
});

export const { getVideoStart, getVideoSuccess, getVideoFailure } = slice.actions;

export default slice.reducer;

export const fetchVideo = (id: string): AppThunk => async dispatch => {
  try {
    dispatch(getVideoStart());
    const video = await getVideo(id);
    const originalCaptions = await getCaptions(video, "en");
    const localCaptions = await getCaptions(video, "fr");
    dispatch(getVideoSuccess({ video, originalCaptions, localCaptions }));
  } catch (err) {
    dispatch(getVideoFailure(err.toString()));
  }
};
