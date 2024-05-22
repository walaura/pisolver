import React, { useState } from "react";
import Flexbox from "./styles/Flexbox";
import stylex from "@stylexjs/stylex";
import { CheatSheet } from "./game-ui/CheatSheet";
import { Tile } from "./game-ui/Tile";
import { useStore, useStoreActions } from "./game/store";

const appStyles = stylex.create({
  center: {
    minWidth: "100vh",
    minHeight: "90vh",
  },
});

function Board() {
  const { board, cols, rows } = useStore();
  const { solveRow, solveCol } = useStoreActions();
  const [debug, setDebug] = useState(null);
  return (
    <>
      {debug && <CheatSheet debug={debug} onClose={() => setDebug(null)} />}
      <div style={{ display: "flex", flexDirection: "row", marginLeft: 100 }}>
        {cols.map((col, index) => (
          <div
            onClick={() => {
              setDebug(solveCol(index));
            }}
            key={index}
            style={{ width: 50, height: 100, border: "1px solid tomato" }}
          >
            <>
              {col.map((c) => (
                <>
                  {c}
                  <br />
                </>
              ))}
            </>
          </div>
        ))}
      </div>
      {board.map((row, lineIndex) => (
        <div style={{ display: "flex", flexDirection: "row" }} key={lineIndex}>
          <div
            style={{ width: 100, height: 50, border: "1px solid tomato" }}
            onClick={() => {
              setDebug(solveRow(lineIndex));
            }}
          >
            {rows[lineIndex].join()}
          </div>
          {row.map((item, colIndex) => (
            <div
              key={colIndex}
              style={{ width: 50, height: 50, border: "1px solid #ddd" }}
            >
              <Tile item={item} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
}

export default function App() {
  return (
    <Flexbox styles={appStyles.center} align="center" justify="center">
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Board />
      </div>
    </Flexbox>
  );
}
