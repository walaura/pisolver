import { Item } from "../game/base";

export function Tile({ item }: { item: Item }) {
  if (item === null) {
    return "🌫️";
  }
  if (item === "x") {
    return "❎";
  }
  if (item === "o") {
    return "⭕";
  }
  return item;
}
