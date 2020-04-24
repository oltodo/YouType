import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import classnames from "classnames";

interface Props {
  children: React.ReactElement;
  disabled?: boolean;
  highlighted?: boolean;
  onClicked?: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      fill: "red",
      "&:hover, &$highlighted": {
        backgroundColor: "transparent !important",

        "& svg": {
          fill: "#00D35A",
        },
      },
    },
    highlighted: {},
  }),
);

const IconButtonExtended = ({ children, disabled = false, highlighted = false, onClicked = () => {} }: Props) => {
  const classes = useStyles();

  return (
    <IconButton
      className={classnames(classes.button, { [classes.highlighted]: highlighted })}
      onClick={onClicked}
      disabled={disabled}
      disableFocusRipple
    >
      {children}
    </IconButton>
  );
};

export default IconButtonExtended;
