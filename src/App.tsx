import React from "react";
import Flexbox from "./styles/Flexbox";
import stylex from "@stylexjs/stylex";
import { Board } from "./game-ui/Board";
import { Toolbar } from "./ui/Toolbar";
import { useSolveStore, useSolveStoreActions } from "./store/solve-store";
import { Button } from "./ui/Button";
import { BsBugFill, BsPauseFill, BsPlayFill } from "react-icons/bs";
import { CheatSheet } from "./game-ui/CheatSheet";

const styles = stylex.create({
  root: (tokens: { accent: string }) => ({
    display: "flex",
    minHeight: "100dvh",
    "--accent": tokens.accent ?? "#12fff7",
    "--active": "var(--accent)",
  }),
  center: {
    width: "100%",
    flex: "1 0 0",
    display: "flex",
    alignItems: "center",
  },
  toolbar: {
    position: "absolute",
    bottom: "2em",
    left: "2em",
    right: "2em",
  },
});

export default function App() {
  const { isSolving, debug } = useSolveStore();
  const { solveNextLines, solveNextLine, pauseSolving, toggleDebug } =
    useSolveStoreActions();

  return (
    <div {...stylex.props(styles.root({ accent: "#12fff7" }))}>
      {debug.shouldDebug ? <CheatSheet /> : null}
      <Flexbox styles={styles.center} align="center" justify="center">
        <Flexbox styles={styles.toolbar}>
          <Toolbar
            end={
              <>
                {debug.shouldDebug ? (
                  <Button onClick={solveNextLine} label="Next" />
                ) : null}
                <Button
                  onClick={toggleDebug}
                  isLabelHidden
                  label="Debug"
                  isActive={debug.shouldDebug}
                  icon={<BsBugFill />}
                />
                {!isSolving ? (
                  <Button
                    onClick={solveNextLines}
                    icon={<BsPlayFill />}
                    isLabelHidden
                    label="Solve"
                    isPrimary
                  />
                ) : (
                  <Button
                    icon={<BsPauseFill />}
                    isLabelHidden
                    onClick={pauseSolving}
                    label="Pause"
                    isPrimary
                  />
                )}
              </>
            }
          />
        </Flexbox>
        <Board />
      </Flexbox>
    </div>
  );
}
