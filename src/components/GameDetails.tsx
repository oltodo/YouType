import React, { useState } from "react";
import { makeStyles, createStyles, Theme, Link, ButtonBase } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import classnames from "classnames";
import { VideoState } from "redux/slices/video";
import { Sequence } from "redux/slices/game";

interface Props {
  video: VideoState;
  sequence: Sequence | null;
  totalSequences: number;
  progress: number;
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

    sequenceWrapper: {},
    sequenceNumber: {
      color: fade("#fff", 0.8),
      fontWeight: 500,
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
      marginBottom: theme.spacing(2),
    },
  }),
);

const GameDetails = ({ video, sequence, totalSequences, progress }: Props) => {
  const classes = useStyles();
  const [descExpanded, setDescExpanded] = useState(false);
  const progressRounded = Math.round(progress);

  const renderSequence = () => {
    if (sequence === null) {
      return;
    }

    const { text, answers } = sequence;
    const words = text.split(/ |\n/).map(word => word.replace(/^[^\w]+/, "").replace(/[^\w]+$/, ""));

    const completed = answers.reduce((acc, curr) => (acc ? curr.value === curr.solution : acc), true);

    return (
      <div className={classes.sequenceWrapper}>
        <div className={classes.sequenceNumber}>Sequence #{sequence.index + 1}</div>

        <div className={classes.sequenceWords}>
          {words.map((word, index) => (
            <ButtonBase key={index} className={classes.sequenceWord} disabled={!completed}>
              <span style={{ visibility: completed ? "visible" : "hidden" }}>{word}</span>
            </ButtonBase>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.progressWrapper}>
        <span className={classnames(classes.pill, { [classes.completed]: progressRounded === 100 })} />
        {progressRounded}% completed / {totalSequences} sequences
      </div>
      <div className={classes.title}>{video.title}</div>
      <div className={classes.authorWrapper}>
        <img className={classes.authorAvatar} src={video.author.avatar} alt="Author's avatar" />
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
    </div>
  );
};

export default GameDetails;
