import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const Component = React.memo(
  React.forwardRef((props, ref) => (
    <SvgIcon data-mui-test="ChevronRight" viewBox="0 0 48 48" ref={ref} {...props}>
      <path d="M18.56 10.938L30.58 22.94c.549.547.584 1.414.105 2.003l-.105.115L18.56 37.062a1.5 1.5 0 01-2.006.103l-.115-.104a1.497 1.497 0 01-.104-2.002l.104-.116L27.4 24l-10.96-10.943a1.497 1.497 0 01-.104-2.003l.105-.116a1.5 1.5 0 012.12 0z" />
      <rect opacity=".3" transform="rotate(45 18 21)" x="12" y="19.5" width="12" height="3" rx="1.5" />
    </SvgIcon>
  )),
);

if (process.env.NODE_ENV !== "production") {
  Component.displayName = `ChevronRight`;
}

Component.muiName = SvgIcon.muiName;

export default Component;
