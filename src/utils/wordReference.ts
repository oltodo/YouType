import shuffle from "lodash/shuffle";

interface Translation {
  term: string;
  POS: string;
  sense: string;
}

interface Term {
  term: string;
  POS: string;
  sense: string;
  usage: string;
  note: string;
  translations: Translation[];
}

export interface Word {
  word: string;
  terms: Term[];
}

const keys = [
  "f42d1",
  "d397f",
  "80143",
  "f0e5c",
  "2d1be",
  "80143",
  "76d0e",
  "25684",
  "47a05",
  "51923",
  "96ee3",
  "12bee",
];

export async function fetchTranslation(word: string, from: string, to: string): Promise<Word> {
  const [key] = shuffle(keys);

  const result = await fetch(`https://api.wordreference.com/${key}/json/${from}${to}/${word}`).then(res => res.json());

  let terms: Term[] = [];

  const addTerm = (data: any) => {
    const term = { ...data.OriginalTerm, note: data.Note, translations: [] };

    const match = /replace: (.+)/.exec(data.OriginalTerm.term);
    if (match) {
      term.term = match[1];
    }

    if (data.FirstTranslation) {
      term.translations.push(data.FirstTranslation);
    }
    if (data.SecondTranslation) {
      term.translations.push(data.SecondTranslation);
    }
    if (data.ThirdTranslation) {
      term.translations.push(data.ThirdTranslation);
    }
    if (data.FourthTranslation) {
      term.translations.push(data.FourthTranslation);
    }

    terms.push(term);
  };

  if (result.term0) {
    if (result.term0.PrincipalTranslations) {
      Object.values(result.term0.PrincipalTranslations).forEach(addTerm);
    }
    if (result.term0.AdditionalTranslations) {
      Object.values(result.term0.AdditionalTranslations).forEach(addTerm);
    }
  }
  if (result.original) {
    if (result.original.Compounds) {
      Object.values(result.original.Compounds).forEach(addTerm);
    }
  }

  return {
    word,
    terms,
  };
}
