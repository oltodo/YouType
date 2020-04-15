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
}

export interface GameState {
  sequences: Sequence[];
}

interface AnswerPayload {
  sequenceIndex: number;
  index: number;
  value: string;
}

const initialState: GameState = {
  sequences: [],
};

const slice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initializeGame(state, { payload }: PayloadAction<Caption[]>) {
      state.sequences = payload.map((caption: Caption) => {
        const chars = parseCaption(caption.text);
        const answers = getDefaultAnswers(chars);

        return { ...caption, chars, answers, currentIndex: 0 };
      });
    },
    setAnswer(state, { payload: { sequenceIndex, index, value } }: PayloadAction<AnswerPayload>) {
      const sequence = state.sequences[sequenceIndex];
      const answer = sequence.answers[index];
      answer.value = answer.upper ? value.toUpperCase() : value.toLowerCase();
    },
    deleteAnswer(state, { payload: { sequenceIndex, index } }) {
      const sequence = state.sequences[sequenceIndex];
      sequence.answers[index].value = "";
    },
    setCurrentIndex(state, { payload: { sequenceIndex, index } }) {
      const sequence = state.sequences[sequenceIndex];

      if (index >= 0 && index < sequence.answers.length) {
        state.sequences[sequenceIndex].currentIndex = index;
      }
    },
  },
});

export const { initializeGame, setAnswer, deleteAnswer, setCurrentIndex } = slice.actions;

export default slice.reducer;

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
    dispatch(
      setAnswer({
        sequenceIndex,
        index,
        value: answers[index].solution,
      }),
    );
  });
};