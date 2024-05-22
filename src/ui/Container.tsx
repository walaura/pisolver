import stylex from "@stylexjs/stylex";
import React from "react";
import Flexbox from "../styles/Flexbox";
import { layout } from "../styles/tokens.stylex";

const styles = stylex.create({
  containerActive: {
    borderColor: layout.dividerActive,
  },
  containerShaded: {
    border: 0,
    backgroundColor: layout.shade,
  },
  titleActive: {
    backgroundColor: layout.dividerActive,
  },
  container: {
    border: "2px solid",
    borderColor: layout.divider,
    gap: 1,
    borderRadius: 8,
    flexGrow: 1,
    overflow: "hidden",
  },
  containerBig: {
    borderRadius: 16,
  },
  title: {
    padding: 16,
    backgroundColor: layout.divider,
    color: "white",
    fontSize: ".8rem",
    fontWeight: 900,
  },
  inner: {
    margin: 1,
    borderRadius: 6,
    flexGrow: 1,
    overflow: "hidden",
  },
  innerBig: {
    borderRadius: 12,
  },
});

const Container = ({
  children,
  isActive = false,
  isShaded = false,
  title,
  size = "regular",
}: {
  children: React.ReactNode;
  title?: string;
  isActive?: boolean;
  isShaded?: boolean;
  size?: "big" | "regular";
}) => {
  return (
    <Flexbox
      grow
      direction="column"
      styles={[
        styles.container,
        isShaded && styles.containerShaded,
        isActive && styles.containerActive,
        size === "big" && styles.containerBig,
      ]}
    >
      {title && (
        <Flexbox styles={[styles.title, isActive && styles.titleActive]}>
          {title}
        </Flexbox>
      )}
      <Flexbox grow styles={[styles.inner, size === "big" && styles.innerBig]}>
        {children}
      </Flexbox>
    </Flexbox>
  );
};

export default Container;
