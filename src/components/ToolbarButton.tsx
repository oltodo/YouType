import React from "react";
import { makeStyles, createStyles, Theme, SvgIconProps } from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";

interface Props {
  tooltip: string;
  icon: React.FunctionComponent<SvgIconProps>;
  disabled: boolean;
  onClicked: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      fill: "red",
      "&:hover": {
        backgroundColor: "transparent !important",

        "& svg": {
          fill: "#00D35A",
        },
      },
    },
  }),
);

const ToolbarButton = ({ tooltip, icon: Icon, disabled, onClicked }: Props) => {
  const classes = useStyles();

  return (
    <Tooltip title={tooltip} placement="top">
      <span>
        <IconButton className={classes.button} onClick={onClicked} disabled={disabled} disableFocusRipple>
          <Icon />
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default ToolbarButton;
