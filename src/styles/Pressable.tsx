import stylex from "@stylexjs/stylex";
import { StyleXStyles } from "@stylexjs/stylex/lib/StyleXTypes";
import React, { MouseEventHandler } from "react";

const styles = stylex.create({
  pressable: {
    display: "flex",
    cursor: "pointer",
    background: "inherit",
    border: "none",
    padding: 0,
    transition: "all 0.1s",
    ":active": {
      opacity: 0.9,
      transform: "scaleX(0.95) scaleY(0.9)",
    },
  },
});

export default function Pressable({
  styles: externalStyles,
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title?: string;
  styles?: StyleXStyles;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      {...stylex.props(styles.pressable, externalStyles)}
    >
      {children}
    </button>
  );
}
