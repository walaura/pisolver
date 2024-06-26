import stylex from "@stylexjs/stylex";
import React, { ForwardedRef, useEffect } from "react";
import Flexbox from "../styles/Flexbox";
import { Tile } from "../game-ui/Tile";
import { BoardPosition } from "../game-ui/BoardPosition";
import { BoardLayout } from "../game-ui/BoardLayout";
import { Position } from "../solver/base";

const styles = stylex.create({
  center: {
    width: "100%",
    flex: "1 0 0",
    display: "flex",
    alignItems: "center",
  },
});

function BoardNumberEditorImpl(
  {
    number,
    onSetNumber,
    onDeleteNumber,
    isInstant = false,
  }: {
    number: number;
    onSetNumber: (number: number) => void;
    onDeleteNumber: () => void;
    isInstant?: boolean;
  },
  ref: ForwardedRef<HTMLDivElement>
) {
  const [isFocused, setIsFocused] = React.useState(false);
  return (
    <div
      ref={ref}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          if (number === null) {
            onDeleteNumber();
          } else {
            onSetNumber(null);
          }
        }
        const num = Number(e.key);
        if (!isNaN(num)) {
          onSetNumber(isInstant ? num : number * 10 + num);
        }
      }}
      tabIndex={0}
      style={{ background: isFocused ? "yellow" : "blue", padding: 3 }}
    >
      {number}
    </div>
  );
}

const BoardNumberEditor = React.forwardRef(BoardNumberEditorImpl);

const moveFocus = (to: -1 | 1) => {
  const elements = Array.from(document.querySelectorAll("[tabindex]"));
  const index = elements.indexOf(document.activeElement);
  //@ts-expect-error - lol
  elements[index + to]?.focus();
};

function BoardPositionEditor({
  position,
  onUpdatePosition,
}: {
  position: Position;
  onUpdatePosition: (Position) => void;
}) {
  return (
    <div
      style={{ background: "pink", padding: 5 }}
      onBlur={(ev) => {
        console.log(ev);
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          moveFocus(-1);
        }
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          moveFocus(1);
        }
      }}
    >
      <Flexbox gap={8}>
        {position.map((number, index) => (
          <BoardNumberEditor
            key={index}
            number={number}
            onDeleteNumber={() => {
              moveFocus(-1);
              onUpdatePosition([
                ...position.slice(0, index),
                ...position.slice(index + 1),
              ]);
            }}
            onSetNumber={(number) => {
              onUpdatePosition([
                ...position.slice(0, index),
                number,
                ...position.slice(index + 1),
              ]);
            }}
          />
        ))}
        <BoardNumberEditor
          key={"new"}
          onDeleteNumber={() =>
            onUpdatePosition([...position.slice(0, position.length - 1)])
          }
          number={null}
          onSetNumber={(number) => {
            onUpdatePosition([...position, number]);
          }}
        />
      </Flexbox>
    </div>
  );
}

export default function setupRoute() {
  const [horizontalLines, setHorizontalLines] = React.useState([[4, 5]]);
  const [verticalLines, setVerticalLines] = React.useState([[1, 2]]);
  console.log(horizontalLines);
  return (
    <>
      <Flexbox styles={styles.center} align="center" justify="center">
        <BoardLayout
          horizontalLines={horizontalLines.length}
          verticalLines={verticalLines.length}
          drawPosition={(direction, index) => {
            return (
              <>
                <BoardPositionEditor
                  position={horizontalLines[index]}
                  onUpdatePosition={(position) => {
                    console.log(position);
                    setHorizontalLines((lines) =>
                      lines.map((line, i) => (i === index ? position : line))
                    );
                  }}
                />
                <BoardPosition
                  key={index}
                  onClick={() => {}}
                  direction={direction}
                  position={horizontalLines[index]}
                />
              </>
            );
          }}
          drawTile={(vertical, horizontal) => {
            return <Tile key={`${horizontal}-${vertical}`} />;
          }}
        />
      </Flexbox>
    </>
  );
}
