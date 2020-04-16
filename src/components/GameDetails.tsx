import React from "react";
import { makeStyles, createStyles, Theme, Button, Link, ButtonBase } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";

interface Props {}

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
    duration: {
      marginLeft: "auto",
      color: fade("#fff", 0.6),
    },

    descWrapper: {},
    desc: {
      height: "3em",
      overflow: "hidden",
      marginTop: theme.spacing(3),
      color: fade("#fff", 0.8),
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
      fontSize: 18,
      letterSpacing: 2,
      borderRadius: 4,
      marginRight: theme.spacing(1),
      marginBottom: theme.spacing(2),
    },
  }),
);

const GameDetails = ({}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.progressWrapper}>
        <span className={classes.pill} />
        52% completed / 152 sequences
      </div>
      <div className={classes.title}>The playful wonderland behind great inventions | Steven Johnson</div>
      <div className={classes.authorWrapper}>
        <img
          className={classes.authorAvatar}
          src="https://yt3.ggpht.com/a/AATXAJyC68-XD1Vg565GWaL-PHbsFIrEO3eQk_b2aA=s48-c-k-c0xffffffff-no-rj-mo"
          alt="Author's avatar"
        />
        <span className={classes.authorName}>TED</span>
        <span className={classes.duration}>7:25</span>
      </div>
      <div className={classes.descWrapper}>
        <div className={classes.desc}>
          Necessity is the mother of invention, right? Well, not always. Steven Johnson shows us how some of the most
          transformative ideas and technologies, like the computer, didn't emerge out of necessity at all but instead
          from the strange delight of play. Share this captivating, illustrated exploration of the history of invention.
          Turns out,\n\nTEDTalks is a daily video podcast of the best talks and performances from the TED Conference,
          where the world's leading thinkers and doers give the talk of their lives in 18 minutes (or less). Look for
          talks on Technology, Entertainment and Design -- plus science, business, global issues, the arts and much
          more.\nFind closed captions and translated subtitles in many languages at
          http://www.ted.com/translate\n\nFollow TED news on Twitter: http://www.twitter.com/tednews\nLike TED on
          Facebook: https://www.facebook.com/TED\n\nSubscribe to our channel: http://www.youtube.com/user/TEDtalksD...
        </div>
        <Link component="button">MORE</Link>
      </div>
      <div className={classes.separator} />
      <div className={classes.sequenceWrapper}>
        <div className={classes.sequenceNumber}>Sequence #16</div>

        <div className={classes.sequenceWords}>
          {"a young cave bear died in the rolling hills".split(" ").map((word, index) => (
            <ButtonBase key={index} className={classes.sequenceWord}>
              {word}
            </ButtonBase>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
