import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const Component = React.memo(
  React.forwardRef((props, ref) => (
    <SvgIcon data-mui-test="Casino" viewBox="0 0 48 48" ref={ref} {...props}>
      <path opacity=".3" d="M5 30h28v11H5zM5 10h28v4H5z" />
      <path d="M18.655.002h.69c6.777.075 12.463 2.378 12.65 6.773L32 7h2.5A1.5 1.5 0 0136 8.5V35h1.5a3 3 0 003-3v-9.229A5.002 5.002 0 0142 13a5 5 0 011.5 9.771V32a6 6 0 01-5.775 5.996L37.5 38H36v4.5a1.5 1.5 0 01-1.356 1.493L34.5 44h-31A1.5 1.5 0 012 42.5v-34A1.5 1.5 0 013.5 7H6C6 2.458 11.763.079 18.655.002zM33 30H5v11h28V30zm-18.5 5a1.5 1.5 0 010 3h-5a1.5 1.5 0 010-3h5zm-2.167-18H5v10h7.334V17zM33 17h-7.333v10H33V17zm-10.333 0h-7.334v10h7.334V17zm-14 3a2 2 0 110 4 2 2 0 010-4zM19 20a2 2 0 110 4 2 2 0 010-4zm10.333 0a2 2 0 110 4 2 2 0 010-4zM42 16a2 2 0 100 4 2 2 0 000-4zm-9-6H4.999v4H33v-4zM19 3c-5.415 0-9.824 1.721-9.995 3.87L9 7h20c0-2.21-4.477-4-10-4z" />
    </SvgIcon>
  )),
);

if (process.env.NODE_ENV !== "production") {
  Component.displayName = `Casino`;
}

Component.muiName = SvgIcon.muiName;

export default Component;
