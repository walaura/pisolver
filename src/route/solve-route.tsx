import stylex from "@stylexjs/stylex";
import React from "react";
import { BsBugFill, BsPlayFill, BsPauseFill } from "react-icons/bs";
import { Board } from "../game-ui/Board";
import { CheatSheet } from "../game-ui/CheatSheet";
import {
  SolveStoreProvider,
  useSolveStore,
  useSolveStoreActions,
} from "../store/solve-store";
import Flexbox from "../styles/Flexbox";
import { Button } from "../ui/Button";
import { Toolbar } from "../ui/Toolbar";
import type { SolveRoute } from "../useRouter";

const styles = stylex.create({
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

export default function SolveRoute({ route }: { route: SolveRoute }) {
  return (
    <SolveStoreProvider
      horizontalPositions={route.horizontalPositions}
      verticalPositions={route.verticalPositions}
    >
      <SolveRouteImpl />
    </SolveStoreProvider>
  );
}

function SolveRouteImpl() {
  const { isSolving, debug } = useSolveStore();
  const { solveNextLines, solveNextLine, pauseSolving, toggleDebug } =
    useSolveStoreActions();
  return (
    <>
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
    </>
  );
}
