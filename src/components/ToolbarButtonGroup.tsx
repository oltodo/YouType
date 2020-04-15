import React, { useState } from "react";
import { useSpring, animated } from "react-spring";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import debounce from "lodash/debounce";

import { BUTTON_WIDTH } from "./Toolbar";

interface Props {
  disabled?: boolean;
  children: React.ReactElement[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
    },
  }),
);

const ToolbarButtonGroup = ({ disabled = false, children }: Props) => {
  const classes = useStyles();
  const [expand, setExpand] = useState(false);

  const props = useSpring({
    width: !disabled && expand ? BUTTON_WIDTH * children.length : BUTTON_WIDTH,
  });

  const handleMouseMove = debounce(() => {
    setExpand(true);
  }, 100);

  const handleMouseLeave = () => {
    if (handleMouseMove.cancel) {
      handleMouseMove.cancel();
    }

    setExpand(false);
  };

  return (
    <animated.div
      className={classes.root}
      style={{
        ...props,
        // justifyContent: "flex-start",
        zIndex: expand ? 1 : 0,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </animated.div>
  );
};

export default ToolbarButtonGroup;
