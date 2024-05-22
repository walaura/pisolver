import stylex from "@stylexjs/stylex";

import { Color, lightColors } from "./styles/tokens.stylex";
import React from "react";

const styles = stylex.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  light: (isActive, color: Color) => ({
    border: `2px solid`,
    borderColor: isActive ? "black" : "white",
    boxShadow: "inset 0 0 0 2px white",
    borderRadius: "100%",
    backgroundColor: lightColors[color],
    width: 80,
    height: 80,
  }),
});

export const Lights = ({
  colors,
  cursor,
}: {
  colors: Color[];
  cursor: number;
}) => {
  return (
    <div {...stylex.props(styles.container)}>
      {colors.map((color, index) => {
        return (
          <div
            key={index}
            {...stylex.props(styles.light(cursor === index, color))}
          />
        );
      })}
    </div>
  );
};
