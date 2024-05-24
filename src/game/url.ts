import { Position } from "./base";
import { SolveStore } from "../store/solve-store";

function serializePositionDirection(positions: Position[]) {
  return positions.map((position) => position.join(",")).join("-");
}
function deserializePositionDirection(position: string): Position[] {
  return position.split("-").map((c) => c.split(",").map(Number));
}

export function serializePositions(state: SolveStore) {
  return [state.horizontalPositions, state.verticalPositions]
    .map(serializePositionDirection)
    .join("/");
}

export function deserializePositions(
  horizontalPositions,
  verticalPositions
): [Position[], Position[]] {
  return [
    deserializePositionDirection(horizontalPositions),
    deserializePositionDirection(verticalPositions),
  ];
}
