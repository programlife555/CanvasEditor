import type { DeltaSet } from "sketching-delta";

import type { LOG_LEVEL } from "../../log";

export type EditorOptions = {
  deltaSet?: DeltaSet;
  logLevel?: typeof LOG_LEVEL[keyof typeof LOG_LEVEL];
};
