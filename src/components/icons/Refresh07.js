import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const Component = React.memo(
  React.forwardRef((props, ref) => (
    <SvgIcon data-mui-test="Refresh07" viewBox="0 0 48 48" ref={ref} {...props}>
      <path d="M30.5 23a1.5 1.5 0 010-3h11.054C39.734 11.983 32.566 6 24 6 14.059 6 6 14.059 6 24c0 9.606 7.524 17.454 17 17.973V42a1.5 1.5 0 01.144 2.993L23 45v-.023C11.868 44.455 3 35.263 3 24 3 12.402 12.402 3 24 3c7.64 0 14.326 4.08 18 10.178V8.5a1.5 1.5 0 013 0v13a1.5 1.5 0 01-1.356 1.493L43.5 23h-13z" />
      <path
        d="M13.037 19.12c-2.654 5.96-.055 12.929 5.805 15.715l.277.128a1.5 1.5 0 01-1.085 2.793l-.135-.053C10.33 34.333 6.927 25.467 10.297 17.9c3.327-7.472 12.012-10.885 19.516-7.727l.288.125a1.5 1.5 0 01-1.085 2.793l-.135-.053c-6.055-2.695-13.148.028-15.844 6.082z"
        opacity=".3"
      />
      <path d="M31.5 42a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm11.061-12l.17.018.1.019.133.037.137.052.093.045.088.049.138.095.07.058.1.095.082.096.061.082.05.077.057.103.05.111.047.133.027.104.028.17.008.156c0 .053-.003.105-.008.157l-.016.11-.032.142-.04.119-5.103 12.025a1.5 1.5 0 01-2.761-1.173L40.233 33H36.5a1.5 1.5 0 010-3h6.061z" />
    </SvgIcon>
  )),
);

if (process.env.NODE_ENV !== "production") {
  Component.displayName = `Refresh07`;
}

Component.muiName = SvgIcon.muiName;

export default Component;
