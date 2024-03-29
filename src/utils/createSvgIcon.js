import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

export default function createSvgIcon(path, displayName) {
  const Component = React.memo(
    React.forwardRef((props, ref) => (
      <SvgIcon data-mui-test={`${displayName}Icon`} ref={ref} viewBox="0 0 48 48" {...props}>
        {path}
      </SvgIcon>
    )),
  );

  if (process.env.NODE_ENV !== "production") {
    Component.displayName = `${displayName}Icon`;
  }

  Component.muiName = SvgIcon.muiName;

  return Component;
}
