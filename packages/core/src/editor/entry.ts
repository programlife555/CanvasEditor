import type { DeltaLike } from "sketching-delta";
import { Delta, DeltaSet } from "sketching-delta";

export class EntryDelta extends Delta {
  public static KEY = "entry-delta";
  public key = EntryDelta.KEY;
  public invert = () => void 0;
  public drawing = () => void 0;
  public static create = (options: DeltaLike) => new EntryDelta(options);
}

DeltaSet.register(EntryDelta);
