import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const Component = React.memo(
  React.forwardRef((props, ref) => (
    <SvgIcon data-mui-test="Speed07Icon" ref={ref} {...props}>
      <path d="M14.5 13c0 1.1-.2 2-.7 2.6-.5.6-1.1.9-2 .9-.9 0-1.6-.3-2-.9-.6-.6-.8-1.4-.8-2.5v-1.5c0-1.1.2-2 .7-2.6.5-.6 1.2-.9 2-.9.9 0 1.6.3 2 .9.5.6.7 1.4.7 2.5V13zm-1.6-1.7c0-.7-.1-1.2-.3-1.5-.2-.3-.5-.5-.9-.5s-.7.1-.8.4c-.2.3-.3.8-.3 1.4v2c0 .7.1 1.2.3 1.5.2.3.5.5.9.5s.7-.2.9-.5c.2-.3.3-.8.3-1.4v-1.9zm1.7 4.3c0-.3.1-.5.3-.6.2-.2.4-.2.7-.2.3 0 .5.1.7.2.2.2.3.4.3.6 0 .3-.1.5-.3.6-.2.2-.4.2-.7.2-.3 0-.5-.1-.7-.2-.2-.2-.3-.4-.3-.6zm7.5-6.5L19 16.3h-1.7l3.2-6.8h-4V8.2h5.7v.9zM7.9 11.3l-1-1-2 2-2-2-1 1 2 2-2 2 1 1 2-2 2 2 1-1-2-2 2-2z" />
    </SvgIcon>
  ))
);

if (process.env.NODE_ENV !== "production") {
  Component.displayName = `Speed07Icon`;
}

Component.muiName = SvgIcon.muiName;

export default Component;
