import { DeltaSet } from "sketching-delta";
import { ROOT_ZONE } from "sketching-utils";

import { Event } from "../event";
import { LOG_LEVEL, Logger } from "../log";
import { EditorState } from "../state";
import { EDITOR_STATE } from "../state/constant";
import { DEFAULT_DELTA_LIKE, DEFAULT_DELTA_SET_LIKE } from "./constant";
import { EntryDelta } from "./entry";

export type EditorOptions = {
  deltaSet?: DeltaSet;
  logLevel?: typeof LOG_LEVEL[keyof typeof LOG_LEVEL];
};

export class Editor {
  private deltaSet: DeltaSet;
  private container: HTMLDivElement;

  public state: EditorState;
  public event: Event;
  public logger: Logger;

  constructor(options: EditorOptions = {}) {
    const { deltaSet = new DeltaSet(DEFAULT_DELTA_SET_LIKE), logLevel = LOG_LEVEL.ERROR } = options;
    this.deltaSet = deltaSet;
    // Verify DeltaSet Rules
    if (!this.deltaSet.get(ROOT_ZONE)) {
      this.deltaSet.add(new EntryDelta(DEFAULT_DELTA_LIKE));
    }
    this.container = document.createElement("div");
    this.container.setAttribute("data-type", "mock");
    // Modules
    this.state = new EditorState(this, this.deltaSet);
    this.event = new Event(this);
    this.logger = new Logger(logLevel);
  }

  public onMount(container: HTMLDivElement) {
    if (this.state.get(EDITOR_STATE.MOUNTED)) {
      console.warn("Editor has been mounted, please destroy it before mount again.");
    }
    this.container = container;
    this.state.set(EDITOR_STATE.MOUNTED, true);
    this.event.bind();
  }

  public destroy() {
    this.event.unbind();
    this.state.set(EDITOR_STATE.MOUNTED, false);
  }

  public getContainer() {
    return this.container;
  }
}
