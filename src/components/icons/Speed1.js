import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const Component = React.memo(
  React.forwardRef((props, ref) => (
    <SvgIcon data-mui-test="Speed1Icon" ref={ref} {...props}>
      <path d="M17.7,16.3h-1.6v-6.2l-1.9,0.6V9.4l3.4-1.2h0.2V16.3z M12.3,11.3l-1-1l-2,2l-2-2l-1,1l2,2l-2,2l1,1l2-2l2,2l1-1l-2-2 L12.3,11.3z" />
    </SvgIcon>
  )),
);

if (process.env.NODE_ENV !== "production") {
  Component.displayName = `Speed1Icon`;
}

Component.muiName = SvgIcon.muiName;

export default Component;
