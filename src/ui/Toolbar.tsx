import React from "react";
import Flexbox from "../styles/Flexbox";

export const Toolbar = ({ end }: { end: React.ReactNode }) => {
  return (
    <Flexbox justify="between" align="center" grow>
      <div></div>
      <Flexbox gap={12} align="center">
        {end}
      </Flexbox>
    </Flexbox>
  );
};
