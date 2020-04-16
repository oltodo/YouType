import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core";

import ChevronRightIcon from "components/icons/ChevronRight";
import ChevronLeftIcon from "components/icons/ChevronLeft";
import CasinoIcon from "components/icons/Casino";
import BulbAIcon from "components/icons/BulbA";
import BulbAbIcon from "components/icons/BulbAb";
import BulbAZIcon from "components/icons/BulbAZ";
import ReplayIcon from "components/icons/Replay";
import Replay07Icon from "components/icons/Replay07";
import Replay05Icon from "components/icons/Replay05";

import Button from "./ToolbarButton";
import ButtonGroup from "./ToolbarButtonGroup";
import Separator from "./ToolbarSeparator";

interface Props {
  disablePrevious?: boolean;
  disableNext?: boolean;
  disableActions?: boolean;
  onPreviousClicked: () => void;
  onNextClicked: () => void;
  onFillCurrentLetterClicked: () => void;
  onFillCurrentWordClicked: () => void;
  onFillCurrentCaptionClicked: () => void;
  onReplay05Clicked: () => void;
  onReplay07Clicked: () => void;
  onReplay1Clicked: () => void;
  onJackpotClicked: () => void;
}

export const BUTTON_WIDTH = 48;
export const SEPARATOR_WIDTH = 16;

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
    separator: {
      width: 1,
      height: 16,
      margin: theme.spacing(0, 1),
      background: "rgba(255,255,255,0.3)",
    },
  }),
);

const Toolbar = ({
  disableActions = true,
  disablePrevious = true,
  disableNext = true,
  onPreviousClicked,
  onNextClicked,
  onFillCurrentLetterClicked,
  onFillCurrentWordClicked,
  onFillCurrentCaptionClicked,
  onReplay05Clicked,
  onReplay07Clicked,
  onReplay1Clicked,
  onJackpotClicked,
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Button
        tooltip="Go to previous sequence"
        icon={ChevronLeftIcon}
        onClicked={onPreviousClicked}
        disabled={disablePrevious}
      />

      <ButtonGroup disabled={disableActions}>
        <Button
          tooltip="Fill current word"
          icon={BulbAbIcon}
          disabled={disableActions}
          onClicked={onFillCurrentWordClicked}
        />
        <Button
          tooltip="Fill current letter"
          icon={BulbAIcon}
          disabled={disableActions}
          onClicked={onFillCurrentLetterClicked}
        />
        <Button
          tooltip="Fill whole current caption"
          icon={BulbAZIcon}
          disabled={disableActions}
          onClicked={onFillCurrentCaptionClicked}
        />
      </ButtonGroup>

      <Separator />

      <ButtonGroup disabled={disableActions}>
        <Button
          tooltip="Replay sequence 0.5x slower"
          icon={Replay05Icon}
          disabled={disableActions}
          onClicked={onReplay05Clicked}
        />
        <Button tooltip="Replay sequence" icon={ReplayIcon} disabled={disableActions} onClicked={onReplay1Clicked} />
        <Button
          tooltip="Replay sequence 0.7x slower"
          icon={Replay07Icon}
          disabled={disableActions}
          onClicked={onReplay07Clicked}
        />
      </ButtonGroup>

      <Separator />

      <Button tooltip="Jackpot" icon={CasinoIcon} disabled={disableActions} onClicked={onJackpotClicked} />

      <Button tooltip="Go to next sequence" icon={ChevronRightIcon} onClicked={onNextClicked} disabled={disableNext} />
    </div>
  );
};

export default Toolbar;
