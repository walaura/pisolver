import { Position } from "./base";
import { State } from "./store";

function serializePositionDirection(positions: Position[]) {
  return positions.map((position) => position.join(",")).join("-");
}
function deserializePositionDirection(position: string): Position[] {
  return position.split("-").map((c) => c.split(",").map(Number));
}

export function serializePositions(state: State) {
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
