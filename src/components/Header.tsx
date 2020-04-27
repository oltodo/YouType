import React from "react";
import { makeStyles, Theme, createStyles, fade } from "@material-ui/core";

interface Props {}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 96,
      padding: theme.spacing(0, 5),
      borderBottom: "solid 1px",
      borderBottomColor: fade("#FFF", 0.1),
      display: "flex",
      alignItems: "center",
    },
    brand: {
      display: "flex",
      alignItems: "center",
      fontSize: 18,
    },
    logo: {
      background: "#00D35A",
      width: 40,
      height: 40,
      borderRadius: 4,
      marginRight: theme.spacing(2),
    },
  }),
);

const Header = (props: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.brand}>
        <div className={classes.logo} />
        YouType
      </div>
    </div>
  );
};

export default Header;
