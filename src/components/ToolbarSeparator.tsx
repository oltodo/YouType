import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

interface Props {
  style?: React.CSSProperties;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 1,
      height: 16,
      margin: theme.spacing(0, 1),
      background: "rgba(255,255,255,0.3)",
    },
  }),
);

const Separator = ({ style = {} }: Props) => {
  const classes = useStyles();

  return <span className={classes.root} style={style} />;
};

export default Separator;
