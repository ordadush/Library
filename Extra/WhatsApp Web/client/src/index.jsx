import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import rtl from "jss-rtl";
import { create } from "jss";
import {
  createMuiTheme,
  jssPreset,
  ThemeProvider,
  StylesProvider,
} from "@material-ui/core";
import { store } from "./app/store";
import { Provider } from "react-redux";

const theme = createMuiTheme({
  direction: "rtl",
  typography: {
    fontFamily: "Rubik",
  },
});

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

ReactDOM.render(
  <StylesProvider jss={jss}>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </StylesProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
