import React from "react";
import Flexbox from "./styles/Flexbox";
import stylex from "@stylexjs/stylex";
import { Board } from "./game-ui/Board";
import { Toolbar } from "./ui/Toolbar";
import { useStore, useStoreActions } from "./game/store";
import { Button } from "./ui/Button";
import { BsBugFill, BsPauseFill, BsPlayFill } from "react-icons/bs";
import { CheatSheet } from "./game-ui/CheatSheet";

const styles = stylex.create({
  root: {
    display: "flex",
    minHeight: "100dvh",
    "--accent": "#12fff7",
    "--active": "var(--accent)",
  },
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
  const { isSolving, debug } = useStore();
  const { solveNextLines, solveNextLine, pauseSolving, toggleDebug } =
    useStoreActions();

  return (
    <div {...stylex.props(styles.root)}>
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
