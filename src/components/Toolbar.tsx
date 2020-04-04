import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { makeStyles, createStyles, Theme } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import debounce from "lodash/debounce";

import ChevronRightIcon from "components/icons/ChevronRight";
import ChevronLeftIcon from "components/icons/ChevronLeft";
import CasinoIcon from "components/icons/Casino";
import EyeBulbIcon from "components/icons/EyeBulb";
import RefreshIcon from "components/icons/Refresh";
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
    separator: {
      width: 1,
      height: 16,
      margin: theme.spacing(0, 1),
      background: "rgba(255,255,255,0.3)",
    },
    refreshGroup: {
      position: "relative",
      width: 48,
      height: 48,
    },
    refreshGroupInner: {
      position: "absolute",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
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

  const [refreshGroupOpened, setRefreshGroupOpened] = useState(false);

  const refreshGroupProps = useSpring({
    right: refreshGroupOpened ? -88 : -24,
    left: refreshGroupOpened ? -88 : -24,
  });
  const hideProps = useSpring({
    opacity: refreshGroupOpened ? 0 : 1,
    transform: refreshGroupOpened ? "scale(0.8)" : "scale(1)",
  });

  const handleMouseMove = debounce(() => {
    if (disableActions) {
      return;
    }

    setRefreshGroupOpened(true);
  }, 100);

  const handleMouseLeave = () => {
    if (disableActions) {
      return;
    }

    if (handleMouseMove.cancel) {
      handleMouseMove.cancel();
    }

    setRefreshGroupOpened(false);
  };

  const renderButton = (
    Icon: React.MemoExoticComponent<any>,
    tooltip: string,
    cb: () => void,
    disabled: boolean = false,
  ) => {
    return (
      <Tooltip title={tooltip} placement="top">
        <span>
          <IconButton className={classes.button} onClick={cb} disabled={disabled} disableFocusRipple>
            <Icon />
          </IconButton>
        </span>
      </Tooltip>
    );
  };

  return (
    <div className={classes.root}>
      {renderButton(ChevronLeftIcon, "Go to previous sequence", onPreviousClicked)}

      <animated.div style={hideProps}>{renderButton(EyeBulbIcon, "Coming soon", onReplay1Clicked, true)}</animated.div>
      <animated.span className={classes.separator} style={hideProps}></animated.span>

      <div className={classes.refreshGroup}>
        <animated.div
          className={classes.refreshGroupInner}
          style={{ ...refreshGroupProps, zIndex: refreshGroupOpened ? 1 : 0 }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {renderButton(Refresh05Icon, "Replay sequence 50% slower", onReplay05Clicked, disableActions)}
          <span className={classes.separator}></span>
          {renderButton(RefreshIcon, "Replay sequence", onReplay1Clicked, disableActions)}
          <span className={classes.separator}></span>
          {renderButton(Refresh07Icon, "Replay sequence 30% slower", onReplay07Clicked, disableActions)}
        </animated.div>
      </div>

      <animated.span className={classes.separator} style={hideProps}></animated.span>
      <animated.div style={hideProps}>
        {renderButton(CasinoIcon, "Jackpot", onJackpotClicked, disableActions)}
      </animated.div>

      {renderButton(ChevronRightIcon, "Go to next sequence", onNextClicked)}
    </div>
  );
};

export default Toolbar;
