import React from "react";
import { makeStyles, createStyles, Theme, fade } from "@material-ui/core";
import ButtonBase from "@material-ui/core/ButtonBase";
import MinusIcon from "components/icons/Minus";
import PlusIcon from "components/icons/Plus";

interface Props {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  format?: (value: number) => string | number;
  onChange?: (value: number) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      height: 32,
      background: fade("#000", 0.1),
      borderRadius: 4,
    },
    button: {
      width: 32,
      height: 32,
      background: fade("#000", 0.1),
      borderRadius: 4,
    },
    value: {
      flexGrow: 1,
      textAlign: "center",
    },
  }),
);

const Increaser = ({
  value = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  format = value => value,
  onChange = () => {},
}: Props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ButtonBase
        className={classes.button}
        disabled={value === min}
        onClick={() => onChange(Math.max(min, value - step))}
      >
        <MinusIcon />
      </ButtonBase>
      <div className={classes.value}>{format(value)}</div>
      <ButtonBase
        className={classes.button}
        disabled={value === max}
        onClick={() => onChange(Math.min(max, value + step))}
      >
        <PlusIcon />
      </ButtonBase>
    </div>
  );
};

export default Increaser;
