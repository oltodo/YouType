import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";

import ChevronRightIcon from "components/icons/ChevronRight";
import ChevronLeftIcon from "components/icons/ChevronLeft";
import CasinoIcon from "components/icons/Casino";
import Refresh1Icon from "components/icons/Refresh1";
import Refresh07Icon from "components/icons/Refresh07";
import Refresh05Icon from "components/icons/Refresh05";

interface Props {
  disableActions?: boolean;
  onPreviousClicked: () => void;
  onNextClicked: () => void;
  onReplay05Clicked: () => void;
  onReplay07Clicked: () => void;
  onReplay1Clicked: () => void;
  onJackpotClicked: () => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background: theme.palette.background.paper,
      height: 56,
      padding: theme.spacing(0, 2),
      borderRadius: 8,
      boxShadow: theme.shadows[1],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      "& > *:first-child": {
        marginRight: "auto",
      },

      "& > *:last-child": {
        marginLeft: "auto",
      },
    },
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

const Toolbar = ({
  disableActions = true,
  onPreviousClicked,
  onNextClicked,
  onReplay05Clicked,
  onReplay07Clicked,
  onReplay1Clicked,
  onJackpotClicked,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Tooltip title="Go to previous sequence" placement="top">
        <IconButton className={classes.button} onClick={onPreviousClicked} disableFocusRipple>
          <ChevronLeftIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Replay sequence 50% slower" placement="top">
        <IconButton className={classes.button} onClick={onReplay05Clicked} disableFocusRipple disabled={disableActions}>
          <Refresh05Icon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Replay sequence 70% slower" placement="top">
        <IconButton className={classes.button} onClick={onReplay07Clicked} disableFocusRipple disabled={disableActions}>
          <Refresh07Icon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Replay sequence" placement="top">
        <IconButton className={classes.button} onClick={onReplay1Clicked} disableFocusRipple disabled={disableActions}>
          <Refresh1Icon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Jackpot (randomly fill the caption)" placement="top">
        <IconButton className={classes.button} onClick={onJackpotClicked} disableFocusRipple disabled={disableActions}>
          <CasinoIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Go to next sequence" placement="top">
        <IconButton className={classes.button} onClick={onNextClicked} disableFocusRipple>
          <ChevronRightIcon />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default Toolbar;
