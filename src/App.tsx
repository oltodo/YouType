import React from "react";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import { Routes, Route } from "react-router-dom";
import Main from "./Main";
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

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/game/:id" element={<Game />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
