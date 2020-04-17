import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import shuffle from "lodash/shuffle";
import range from "lodash/range";
import { AppThunk } from "redux/store";
import { Caption } from "utils/caption";
import { parseCaption, getDefaultAnswers, Letter, Symbol, Answer } from "utils/game";

export interface Sequence extends Caption {
  chars: (Letter | Symbol)[];
  answers: Answer[];
  currentIndex: number;
  completed: boolean;
}

export interface GameState {
  sequences: Sequence[];
  progress: number;
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
    initializeGame(state, { payload }: PayloadAction<Caption[]>) {
      state.sequences = payload.map((caption: Caption) => {
        const chars = parseCaption(caption.text);
        const answers = getDefaultAnswers(chars);

        return {
          ...caption,
          chars,
          answers,
          currentIndex: 0,
          completed: false,
        };
      });
    },
    setAnswer(state, { payload: { sequenceIndex, index, value } }: PayloadAction<AnswerPayload>) {
      const { sequences } = state;
      const sequence = sequences[sequenceIndex];
      const answer = sequence.answers[index];
      answer.value = answer.upper ? value.toUpperCase() : value.toLowerCase();
      sequence.completed = sequence.answers.every(curr => curr.value === curr.solution);

      const totalCompleted = sequences.reduce((acc, curr) => (curr.completed ? acc + 1 : acc), 0);
      state.progress = (totalCompleted * 100) / sequences.length;
    },
    setCurrentIndex(state, { payload: { sequenceIndex, index } }) {
      const sequence = state.sequences[sequenceIndex];

      if (index >= 0 && index < sequence.answers.length) {
        state.sequences[sequenceIndex].currentIndex = index;
      }
    },
  },
});

export const { initializeGame, setAnswer, setCurrentIndex } = slice.actions;

export default slice.reducer;

export const fillCurrentLetter = (sequenceIndex: number): AppThunk => async (dispatch, getState) => {
  const {
    game: { sequences },
  } = getState();

  const { currentIndex, answers } = sequences[sequenceIndex];
  const { solution } = answers[currentIndex];
  console.log(solution);

  await dispatch(setAnswer({ sequenceIndex, index: currentIndex, value: solution }));
  await dispatch(moveNext(sequenceIndex));
};

export const fillCurrentWord = (sequenceIndex: number): AppThunk => (dispatch, getState) => {
  const {
    game: { sequences },
  } = getState();

  const { currentIndex, answers } = sequences[sequenceIndex];
  const { line, word }: Answer = answers.find((curr, index) => index === currentIndex) as Answer;

  answers.forEach((answer: Answer, index) => {
    if (answer.line === line && answer.word === word) {
      dispatch(setAnswer({ sequenceIndex, index, value: answer.solution }));
      dispatch(moveNext(sequenceIndex));
    }
  });
};

export const fillWholeCaption = (sequenceIndex: number): AppThunk => (dispatch, getState) => {
  const {
    game: { sequences },
  } = getState();

  const { answers } = sequences[sequenceIndex];

  answers.forEach((answer: Answer, index) => {
    dispatch(setAnswer({ sequenceIndex, index, value: answer.solution }));
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

export const giveClue = (sequenceIndex: number): AppThunk => async (dispatch, getState) => {
  const {
    game: { sequences },
  } = getState();

  const { answers } = sequences[sequenceIndex];
  const total = Math.ceil((answers.length * 10) / 100);

  let indexes = range(0, answers.length);
  indexes = indexes.filter(index => answers[index].value.length === 0);
  indexes = shuffle(indexes);
  indexes = indexes.slice(0, total);

  indexes.forEach(index => {
    dispatch(setAnswer({ sequenceIndex, index, value: answers[index].solution }));
  });
};
