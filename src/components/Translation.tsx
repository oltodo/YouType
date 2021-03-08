import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, Theme, Link, Box } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { fetchTranslation, Word } from "utils/wordReference";
import { OpenInBrowser, OpenInNew } from "@material-ui/icons";

interface Props {
  word: string | null;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    title: {
      marginBottom: theme.spacing(2),
    },
    empty: {
      fontSize: 14,
      fontStyle: "italic",
      color: fade("#fff", 0.6),
    },
    terms: {},
    term: {
      borderBottom: `solid 1px ${fade("#fff", 0.1)}`,
      marginBottom: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      fontSize: 14,
    },
    original: {
      marginBottom: theme.spacing(1),
    },
    originalLine: {},
    originalValue: {
      fontWeight: 600,
    },
    originalPos: {
      color: fade("#fff", 0.6),
      fontStyle: "italic",
      fontSize: "0.8em",
      marginLeft: theme.spacing(0.5),
    },
    originalSense: {
      color: fade("#fff", 0.8),
      fontSize: "0.8em",
      marginLeft: theme.spacing(1),
    },
    originalUsage: {
      color: fade("#fff", 0.8),
      fontSize: "0.8em",
      marginLeft: theme.spacing(1),
      fontStyle: "italic",
    },
    originalNote: {
      fontSize: "0.8em",
      opacity: 0.6,
      border: `solid 1px ${fade("#fff", 0.2)}`,
      background: fade("#fff", 0.1),
      padding: theme.spacing(0.5, 1),
      margin: theme.spacing(1, 0, 0.5, 0),
      fontStyle: "italic",
    },
    trans: {
      paddingLeft: theme.spacing(2),
    },
    transValue: {},
    transPos: {
      color: fade("#fff", 0.6),
      fontStyle: "italic",
      fontSize: "0.8em",
      marginLeft: theme.spacing(0.5),
    },
    transSense: {
      color: fade("#fff", 0.8),
      fontSize: "0.8em",
      marginLeft: theme.spacing(1),
    },
  }),
);

const from = "en";
const to = "fr";

const Translation = ({ word }: Props) => {
  const classes = useStyles();
  const [data, setData] = useState<Word | null>(null);
  const [fetching, setfetching] = useState<boolean>(false);

  useEffect(() => {
    if (!word) {
      setData(null);
      return;
    }

    setfetching(true);

    fetchTranslation(word, from, to).then(result => {
      setfetching(false);
      setData(result);
    });
  }, [word]);

  if (!word) {
    return null;
  }

  const renderLink = (text: string, url: string) => (
    <Box fontSize="0.9em" my={0.5}>
      <Link href={url} target="_blank" rel="noreferrer">
        {text}
      </Link>
    </Box>
  );

  const renderData = () => {
    if (fetching) {
      return <CircularProgress size={24} />;
    }

    if (!data || data.terms.length === 0) {
      return (
        <div className={classes.empty}>
          No translation found
          <br />
          {renderLink(`Search "${word}" on Google`, `https://www.google.com/search?q=Traduction+${word}`)}
        </div>
      );
    }

    return (
      <div>
        <div className={classes.terms}>
          {data.terms.map(({ term, POS, sense, usage, note, translations }, index) => (
            <div key={index} className={classes.term}>
              <div className={classes.original}>
                {term.split(",").map((part, index) => (
                  <div className={classes.originalLine} key={index}>
                    <span className={classes.originalValue}>{part}</span>
                    <span className={classes.originalPos}>{POS}</span>
                    {index === 0 && usage && <span className={classes.originalUsage}>{usage}</span>}
                    {index === 0 && sense && <span className={classes.originalSense}>({sense})</span>}
                  </div>
                ))}
              </div>

              {translations.map((trans, index) => (
                <div key={index} className={classes.trans}>
                  <span>
                    <span className={classes.transValue}>{trans.term}</span>
                    <span className={classes.transPos}>{trans.POS}</span>
                    {trans.sense && <span className={classes.transSense}>({trans.sense})</span>}
                  </span>
                </div>
              ))}

              {note && <div className={classes.originalNote}>Note: {note}</div>}
            </div>
          ))}
        </div>

        <Box mt={2}>
          {renderLink(`Go to WordReference.com`, `https://www.wordreference.com/${from}${to}/${data.word}`)}
          {renderLink(`Search "${word}" on Google`, `https://www.google.com/search?q=Traduction+${word}`)}
        </Box>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.title}>Translation for "{word}"</div>

      {renderData()}
    </div>
  );
};

export default Translation;
