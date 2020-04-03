import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const Component = React.memo(
  React.forwardRef((props, ref) => (
    <SvgIcon data-mui-test="Refresh05" viewBox="0 0 48 48" ref={ref} {...props}>
      <path d="M30.5 23a1.5 1.5 0 010-3h11.054C39.734 11.983 32.566 6 24 6 14.059 6 6 14.059 6 24c0 9.606 7.524 17.454 17 17.973V42a1.5 1.5 0 01.144 2.993L23 45v-.023C11.868 44.455 3 35.263 3 24 3 12.402 12.402 3 24 3c7.64 0 14.326 4.08 18 10.178V8.5a1.5 1.5 0 013 0v13a1.5 1.5 0 01-1.356 1.493L43.5 23h-13z" />
      <path
        d="M13.037 19.12c-2.654 5.96-.055 12.929 5.805 15.715l.277.128a1.5 1.5 0 01-1.085 2.793l-.135-.053C10.33 34.333 6.927 25.467 10.297 17.9c3.327-7.472 12.012-10.885 19.516-7.727l.288.125a1.5 1.5 0 01-1.085 2.793l-.135-.053c-6.055-2.695-13.148.028-15.844 6.082z"
        opacity=".3"
      />
      <path d="M42.5 30a1.5 1.5 0 010 3H39v2h1a5 5 0 01.217 9.995L40 45h-2.5a1.5 1.5 0 010-3H40a2 2 0 00.15-3.995L40 38h-2.5a1.5 1.5 0 01-1.5-1.5v-5a1.5 1.5 0 011.5-1.5h5zm-11 12a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
    </SvgIcon>
  )),
);

if (process.env.NODE_ENV !== "production") {
  Component.displayName = `Refresh05`;
}

Component.muiName = SvgIcon.muiName;

export default Component;
