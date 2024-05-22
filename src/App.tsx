import React from "react";
import Flexbox from "./styles/Flexbox";
import stylex from "@stylexjs/stylex";
import { Board } from "./game-ui/Board";

const appStyles = stylex.create({
  center: {
    minWidth: "100vh",
    minHeight: "90vh",
  },
});

export default function App() {
  return (
    <Flexbox styles={appStyles.center} align="center" justify="center">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Board />
      </div>
    </Flexbox>
  );
}
