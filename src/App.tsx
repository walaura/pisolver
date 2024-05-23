import React from "react";
import Flexbox from "./styles/Flexbox";
import stylex from "@stylexjs/stylex";
import { Board } from "./game-ui/Board";
import { Toolbar } from "./ui/Toolbar";
import { useStore, useStoreActions } from "./game/store";
import { Button } from "./ui/Button";
import { BsBugFill, BsPauseFill, BsPlayFill } from "react-icons/bs";

const appStyles = stylex.create({
  center: {
    minWidth: "100vh",
    minHeight: "90vh",
  },
  toolbar: {
    position: "absolute",
    bottom: "2em",
    left: "2em",
    right: "2em",
  },
});

export default function App() {
  const { isSolving } = useStore();
  const { solveNextLines, pauseSolving } = useStoreActions();

  return (
    <Flexbox styles={appStyles.center} align="center" justify="center">
      <Flexbox styles={appStyles.toolbar}>
        <Toolbar
          end={
            <>
              <Button
                onClick={() => {}}
                isLabelHidden
                label="Debug"
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
  );
}
