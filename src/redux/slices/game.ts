import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "redux/store";
import { findTextInRange, Caption } from "utils/caption";
import { parseCaption, Char } from "utils/game";

export interface Sequence extends Caption {
  timeRange: [number, number];
  chars: Char[];
  translation: string;
  currentIndex: number;
  completed: boolean;
}

export interface GameState {
  sequences: Sequence[];
  progress: number;
}

interface InitializePayload {
  originalCaptions: Caption[] | null;
  localCaptions: Caption[] | null;
}

interface AnswerPayload {
  sequenceIndex: number;
  index: number;
  value: string;
}

const initialState: GameState = {
  sequences: [],
  progress: 0,
};

const slice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initializeGame(state, { payload: { originalCaptions, localCaptions } }: PayloadAction<InitializePayload>) {
      if (!originalCaptions) {
        return state;
      }

      state.sequences = originalCaptions.map((caption: Caption, index) => {
        const chars = parseCaption(caption.text);

        let translation = "";
        if (localCaptions) {
          translation = findTextInRange(localCaptions, caption.start, caption.end);
        }

        return {
          ...caption,
          timeRange: [caption.start, caption.end],
          chars,
          translation,
          currentIndex: 0,
          completed: false,
        };
      });
    },
    setTimeRange(state, { payload: { sequenceIndex, value } }) {
      state.sequences[sequenceIndex].timeRange = value;
    },
    setAnswer(state, { payload: { sequenceIndex, index, value } }: PayloadAction<AnswerPayload>) {
      const { sequences } = state;
      const sequence = sequences[sequenceIndex];
      const char = sequence.chars[index];
      char.answer = char.upper ? value.toUpperCase() : value.toLowerCase();
      sequence.completed = sequence.chars.every(curr => (curr.type === "letter" ? curr.value === curr.answer : true));

      const totalCompleted = sequences.reduce((acc, curr) => (curr.completed ? acc + 1 : acc), 0);
      state.progress = (totalCompleted * 100) / sequences.length;
    },
    setCurrentIndex(state, { payload: { sequenceIndex, index } }) {
      const sequence = state.sequences[sequenceIndex];

      if (index >= 0 && index < sequence.chars.length) {
        state.sequences[sequenceIndex].currentIndex = index;
      }
    },
  },
});

export const { initializeGame, setTimeRange, setAnswer, setCurrentIndex } = slice.actions;

export default slice.reducer;

export const fillCurrentLetter = (sequenceIndex: number): AppThunk => async (dispatch, getState) => {
  const {
    game: { sequences },
  } = getState();

  const { currentIndex, chars } = sequences[sequenceIndex];
  const { value } = chars[currentIndex];

  await dispatch(setAnswer({ sequenceIndex, index: currentIndex, value: value }));
  await dispatch(moveNext(sequenceIndex));
};

export const fillCurrentWord = (sequenceIndex: number): AppThunk => (dispatch, getState) => {
  const {
    game: { sequences },
  } = getState();

  const { currentIndex, chars } = sequences[sequenceIndex];
  const { line, word } = chars.find((curr, index) => index === currentIndex) as Char;

  chars.forEach((char: Char, index) => {
    if (char.line === line && char.word === word) {
      dispatch(setAnswer({ sequenceIndex, index, value: char.value }));
      dispatch(moveNext(sequenceIndex));
    }
  });
};

export const fillWholeCaption = (sequenceIndex: number): AppThunk => (dispatch, getState) => {
  const {
    game: { sequences },
  } = getState();

  const { chars } = sequences[sequenceIndex];

  chars.forEach((char: Char, index) => {
    dispatch(setAnswer({ sequenceIndex, index, value: char.value }));
    dispatch(moveNext(sequenceIndex));
  });
};

export const movePrevious = (sequenceIndex: number): AppThunk => (dispatch, getState) => {
  const {
    game: { sequences },
  } = getState();

  const { currentIndex } = sequences[sequenceIndex];

  return dispatch(setCurrentIndex({ sequenceIndex, index: currentIndex - 1 }));
};

export const moveNext = (sequenceIndex: number): AppThunk => (dispatch, getState) => {
  const {
    game: { sequences },
  } = getState();

  const { currentIndex } = sequences[sequenceIndex];

  return dispatch(setCurrentIndex({ sequenceIndex, index: currentIndex + 1 }));
};

export const adjustSequence = (sequenceIndex: number, [start, end]: [number, number]): AppThunk => (
  dispatch,
  getState,
) => {
  const {
    game: { sequences },
  } = getState();

  dispatch(setTimeRange({ sequenceIndex, value: [start, end] }));

  if (sequences[sequenceIndex - 1]) {
    const prev = sequences[sequenceIndex - 1];

    if (prev.timeRange[1] > start) {
      dispatch(
        setTimeRange({
          sequenceIndex: prev.index,
          value: [prev.timeRange[0], start],
        }),
      );
    }
  }

  if (sequences[sequenceIndex + 1]) {
    const next = sequences[sequenceIndex + 1];

    if (next.timeRange[0] < end) {
      dispatch(
        setTimeRange({
          sequenceIndex: next.index,
          value: [end, next.timeRange[1]],
        }),
      );
    }
  }
};
