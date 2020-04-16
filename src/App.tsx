import React from "react";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import Game from "./Game";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    background: {
      default: "#282B40",
      paper: "#373A50",
    },
    type: "dark",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Game />
    </ThemeProvider>
  );
}

export default App;
