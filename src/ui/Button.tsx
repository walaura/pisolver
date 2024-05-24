import React from "react";
import stylex from "@stylexjs/stylex";
import Flexbox from "../styles/Flexbox";

const styles = stylex.create({
  button: {
    background: "transparent",
    border: "2px solid rgba(0,0,0, .04)",
    borderRadius: "1.3em",
    color: "#444",
    fontSize: ".6rem",
    paddingVertical: ".5em",
    paddingHorizontal: "1em",
    fontWeight: 600,
    appearance: "none",
    cursor: "pointer",
    transition: "all .2s",
    ":hover": {
      transform: "scale(1.05)",
      borderRadius: "1.4em",
    },
    ":active": {
      transform: "scale(.95)",
    },
  },
  buttonActive: {
    borderColor: "var(--accent)",
    color: "var(--accent)",
  },
  buttonPrimary: {
    border: 0,
    background: "#000",
    color: "#fff",
    paddingVertical: "1em",
    paddingHorizontal: "2em",
  },
});
export const Button = ({
  label,
  icon,
  onClick,
  isPrimary = false,
  isActive = false,
  isLabelHidden = false,
}: {
  label: string;
  isLabelHidden?: boolean;
  icon?: React.ReactNode;
  onClick: () => void;
  isPrimary?: boolean;
  isActive?: boolean;
}) => {
  return (
    <button
      {...stylex.props(
        styles.button,
        isPrimary === true && styles.buttonPrimary,
        isActive === true && styles.buttonActive
      )}
      aria-label={label}
      aria-selected={isActive}
      title={isLabelHidden && label}
      onClick={() => {
        onClick();
      }}
    >
      <Flexbox gap={4} align="center">
        {icon} {!isLabelHidden && label}
      </Flexbox>
    </button>
  );
};
