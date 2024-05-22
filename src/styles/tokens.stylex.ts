import * as stylex from "@stylexjs/stylex";

export const lightColors = stylex.defineVars<{ [key in Color]: string }>({
  red: "#F44336",
  green: "#4CAF50",
  blue: "#03A9F4",
});

export const layout = stylex.defineVars({
  divider: "#aaa",
  dividerActive: "#000000",
  red: "#F44336",
  callToAction: "#FFEB3B",
  textPrimary: "#000",
  textPrimaryOverDark: "#fff",
  textSecondary: "#aaa",
  shade: "#ddd",
});

export enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue",
}
