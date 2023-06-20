import { Input, Control, Controls } from "@rpgjs/types";

export const inputs: Controls = {
  [Control.Up]: {
    repeat: true,
    bind: Input.W,
  },
  [Control.Down]: {
    repeat: true,
    bind: Input.S,
  },
  [Control.Right]: {
    repeat: true,
    bind: Input.D,
  },
  [Control.Left]: {
    repeat: true,
    bind: Input.A,
  },
  [Control.Action]: {
    bind: [Input.Space, Input.Enter],
  },
  [Control.Back]: {
    bind: Input.Escape,
  },
};
