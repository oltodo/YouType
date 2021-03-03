import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import classnames from "classnames";

interface Props {
  children: React.ReactElement;
  tooltip?: string;
  disabled?: boolean;
  highlighted?: boolean;
  size?: "medium" | "small";
  onClicked?: (event: React.MouseEvent<HTMLElement>) => void;
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

const IconButtonExtended = ({
  children,
  tooltip,
  disabled = false,
  highlighted = false,
  size = "medium",
  onClicked = () => {},
}: Props) => {
  const classes = useStyles();

  const button = (
    <IconButton
      size={size}
      className={classnames(classes.button, { [classes.highlighted]: highlighted })}
      onClick={onClicked}
      disabled={disabled}
      disableFocusRipple
    >
      {children}
    </IconButton>
  );

  if (tooltip) {
    return (
      <Tooltip title={tooltip} placement="top">
        <span>{button}</span>
      </Tooltip>
    );
  }

  return button;
};

export default IconButtonExtended;
