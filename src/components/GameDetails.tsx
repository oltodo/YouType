import React, { useState, useEffect } from "react";
import { makeStyles, createStyles, Theme, ButtonBase, Menu, Box } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { fade } from "@material-ui/core/styles/colorManipulator";
import Link from "@material-ui/core/Link";
import isInteger from "lodash/isInteger";
import classnames from "classnames";
import Translation from "components/Translation";
import { VideoState } from "redux/slices/video";
import { Sequence } from "utils/game";
import IconButton from "components/IconButton";
import Increaser from "components/Increaser";
import TuneIcon from "components/icons/Tune";
import TranslateIcon from "components/icons/Translate";
import MenuItemWithTextField from "./MenuItemWithTextField";

interface Props {
  video: VideoState;
  sequence: Sequence | null;
  totalSequences: number;
  progress: number;
  onRechSequenceSubmited: (index: number) => void;
  onAdjusted: (values: [number, number]) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    separator: {
      height: 1,
      background: fade("#fff", 0.1),
      margin: theme.spacing(5, 0),
    },

    progressWrapper: {
      display: "flex",
      alignItems: "center",
      color: fade("#fff", 0.8),
      marginBottom: 24,
    },
    pill: {
      background: "#ffbb00",
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    completed: {
      background: "#00d35a",
    },

    title: {
      fontSize: 24,
      fontWeight: 500,
      marginBottom: theme.spacing(2),
    },

    authorWrapper: {
      display: "flex",
      alignItems: "center",
      color: fade("#fff", 0.8),
      fontSize: 16,
    },
    authorAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: theme.spacing(1),
    },
    authorName: {
      fontWeight: 500,
    },

    descWrapper: {},
    desc: {
      height: "3em",
      overflow: "hidden",
      marginTop: theme.spacing(3),
      color: fade("#fff", 0.8),
      whiteSpace: "break-spaces",
    },
    descExpanded: {
      height: "auto",
    },

    sequenceWrapper: {
      position: "relative",
      marginTop: theme.spacing(-2),
      marginBottom: theme.spacing(4),
    },
    sequenceHeader: {
      display: "flex",
      alignItems: "center",
    },
    sequenceNumber: {
      color: fade("#fff", 0.8),
      fontWeight: 500,
    },
    sequenceActions: {
      marginLeft: "auto",
    },
    sequenceWords: {
      display: "flex",
      flexWrap: "wrap",
      marginTop: theme.spacing(3),
    },
    sequenceWord: {
      display: "block",
      background: fade("#000", 0.2),
      padding: theme.spacing(0, 1),
      height: 32,
      lineHeight: "32px",
      fontSize: 16,
      letterSpacing: 2,
      borderRadius: 4,
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    sequenceTranslation: {
      background: fade("#FFF", 0.02),
      padding: theme.spacing(2),
      marginTop: theme.spacing(2),
      color: fade("#FFF", 0.6),
      fontSize: 16,
      lineHeight: 1.6,
      fontStyle: "italic",
    },

    adjusterWrapper: {
      background: fade("#000", 0.05),
      border: "solid 1px",
      borderColor: fade("#FFF", 0.1),
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(4),
      padding: theme.spacing(3),
      display: "flex",
    },
    adjuster: {
      width: "50%",
    },
    adjusterStart: {
      marginRight: theme.spacing(3),
    },
    adjusterTitle: {
      marginBottom: theme.spacing(1),
      fontSize: 14,
      color: fade("#FFF", 0.6),
    },
  }),
);

const round = (value: number): number => Math.round(value * 10) / 10;

const GameDetails = ({ video, sequence, totalSequences, progress, onRechSequenceSubmited, onAdjusted }: Props) => {
  const classes = useStyles();
  const [descExpanded, setDescExpanded] = useState(false);
  const [adjusterDisplayed, setAdjusterDisplayed] = useState(false);
  const [translationDisplayed, setTranslationDisplayed] = useState(false);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const progressRounded = Math.round(progress);
  const sequenceIndex = sequence?.index || -1;

  const translationShown = sequence
    ? sequence.translation !== "" && (translationDisplayed || sequence.completed)
    : false;

  useEffect(() => {
    setCurrentWord(null);
    setTranslationDisplayed(false);
  }, [sequenceIndex]);

  const renderAdjuster = () => {
    if (!sequence) {
      return;
    }

    const format = (value: number) => `${Math.round(value * 10) / 10}s`;

    return (
      <div className={classes.adjusterWrapper}>
        <div className={classnames(classes.adjuster, classes.adjusterStart)}>
          <div className={classes.adjusterTitle}>Start</div>
          <Increaser
            value={sequence.timeRange[0]}
            min={sequence.start - 1}
            max={sequence.start + 1}
            step={0.1}
            format={format}
            onChange={value => onAdjusted([round(value), sequence.timeRange[1]])}
          />
        </div>
        <div className={classes.adjuster}>
          <div className={classes.adjusterTitle}>End</div>
          <Increaser
            value={sequence.timeRange[1]}
            min={sequence.end - 1}
            max={sequence.end + 1}
            step={0.1}
            format={format}
            onChange={value => onAdjusted([sequence.timeRange[0], round(value)])}
          />
        </div>
      </div>
    );
  };

  const renderTranslation = () => {
    if (!translationShown) {
      return null;
    }

    return <div className={classes.sequenceTranslation}>{sequence?.translation}</div>;
  };

  const renderSequence = () => {
    if (!sequence) {
      return null;
    }

    const words = sequence.chars.reduce<{ value: string; complete: boolean }[]>((acc, curr) => {
      if (curr.type === "symbol") {
        return acc;
      }

      if (acc[curr.wordIndex]) {
        acc[curr.wordIndex].value += curr.value;
      } else {
        acc[curr.wordIndex] = {
          value: curr.value,
          complete: true,
        };
      }

      acc[curr.wordIndex].complete = acc[curr.wordIndex].complete && curr.answer === curr.value;

      return acc;
    }, []);

    return (
      <div className={classes.sequenceWrapper}>
        <div className={classes.sequenceHeader}>
          <div className={classes.sequenceNumber}>Sequence #{sequence.index + 1}</div>

          <div className={classes.sequenceActions}>
            <IconButton
              tooltip="Show translation"
              highlighted={translationShown && !sequence.completed}
              disabled={sequence.completed}
              onClicked={() => setTranslationDisplayed(!translationDisplayed)}
            >
              <TranslateIcon fontSize="small" />
            </IconButton>
            <IconButton
              tooltip="Show adjustment controls"
              highlighted={adjusterDisplayed}
              onClicked={() => setAdjusterDisplayed(!adjusterDisplayed)}
            >
              <TuneIcon fontSize="small" />
            </IconButton>
          </div>
        </div>

        {adjusterDisplayed && renderAdjuster()}

        <div className={classes.sequenceWords}>
          {words.map((word, index) => (
            <ButtonBase
              key={index}
              className={classes.sequenceWord}
              disabled={!word.complete}
              onClick={() => setCurrentWord(word.value)}
            >
              <span style={{ visibility: word.complete ? "visible" : "hidden" }}>{word.value}</span>
            </ButtonBase>
          ))}
        </div>

        {renderTranslation()}
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.progressWrapper}>
        <span className={classnames(classes.pill, { [classes.completed]: progressRounded === 100 })} />
        {progressRounded}% completed / {totalSequences} sequences
        <Box marginLeft="auto">
          <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            size="small"
            onClicked={event => {
              setAnchorEl(event.currentTarget);
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          autoFocus={false}
          onClose={() => {
            setAnchorEl(null);
          }}
        >
          <MenuItemWithTextField
            label="Reach sequence"
            validate={value => {
              if (!isInteger(parseInt(value))) {
                return "Must be an integer";
              }
              if (parseInt(value) > totalSequences) {
                return `Must be lower than ${totalSequences}`;
              }

              return true;
            }}
            onSubmited={value => {
              onRechSequenceSubmited(parseInt(value) - 1);
              setAnchorEl(null);
            }}
          />
        </Menu>
      </div>

      <div className={classes.title}>{video.title}</div>

      <div className={classes.authorWrapper}>
        <img className={classes.authorAvatar} src={video.author.thumbnail?.url} alt="Author's thumbnail" />
        <span className={classes.authorName}>{video.author.name}</span>
      </div>

      <div className={classes.descWrapper}>
        <div className={classnames(classes.desc, { [classes.descExpanded]: descExpanded })}>{video.description}</div>
        <Link component="button" onClick={() => setDescExpanded(!descExpanded)}>
          {descExpanded ? "LESS" : "MORE"}
        </Link>
      </div>

      <div className={classes.separator} />

      {renderSequence()}

      <Translation word={currentWord} />
    </div>
  );
};

export default GameDetails;
