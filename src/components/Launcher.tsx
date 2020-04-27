import React, { useState } from "react";
import { makeStyles, Theme, createStyles, fade, ButtonBase } from "@material-ui/core";
import classnames from "classnames";

interface Props {
  validate?: (value: string) => boolean;
  onSubmitted?: (value: string) => void;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: 80,
      width: 1000,
      background: fade("#000", 0.2),
      borderRadius: 8,
      margin: "0 auto",
      display: "flex",
    },
    input: {
      background: "transparent",
      width: "100%",
      height: "100%",
      border: 0,
      outline: 0,
      padding: theme.spacing(0, 5),
      color: fade("#fff", 0.6),
      fontSize: 28,

      "&::placeholder": {
        fontStyle: "italic",
        color: fade("#fff", 0.2),
      },
    },
    button: {
      width: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      "& svg": {
        display: "block",
        width: 40,
        height: 40,
        fill: "#00D25E",
        transition: "fill .2s",
      },
    },
    buttonDisabled: {
      "& svg": {
        fill: fade("#fff", 0.1),
      },
    },
  }),
);

const Icon = React.memo(() => (
  <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 0c13.255 0 24 10.745 24 24S37.255 48 24 48 0 37.255 0 24 10.745 0 24 0zm4.343 15.586a2 2 0 00-2.945 2.701l.117.127 3.656 3.657H14a2 2 0 00-.15 3.995l.15.005h15.17l-3.655 3.657a2 2 0 002.7 2.945l.128-.117 7.071-7.07.103-.111.075-.093.09-.127.052-.086c.076-.133.138-.276.183-.426l.05-.21.023-.16.007-.09.003-.112-.006-.157-.011-.105-.027-.157a1.99 1.99 0 00-.148-.436l-.082-.157-.07-.111-.07-.095-.078-.095-.094-.101-7.07-7.071z"
      fillRule="evenodd"
    />
  </svg>
));

const Header = ({ validate = () => true, onSubmitted = () => {} }: Props) => {
  const classes = useStyles();
  const [value, setValue] = useState("");

  const disabled = !validate(value);

  return (
    <div className={classes.root}>
      <input
        className={classes.input}
        type="text"
        value={value}
        placeholder="Paste a YouTube video URL…"
        onChange={event => setValue(event.target.value)}
      />

      <ButtonBase
        className={classnames(classes.button, { [classes.buttonDisabled]: disabled })}
        disabled={disabled}
        onClick={() => onSubmitted(value)}
      >
        <Icon />
      </ButtonBase>
    </div>
  );
};

export default Header;
