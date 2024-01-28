import { IconGithub } from "@arco-design/web-react/icon";
import { useMemoizedFn } from "ahooks";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { DRAG_KEY, EDITOR_EVENT } from "sketching-core";
import type { DeltaLike } from "sketching-delta";
import { cs, TSON } from "sketching-utils";

import { useEditor } from "../../hooks/use-editor";
import { CursorIcon } from "../../static/cursor";
import { GrabIcon } from "../../static/grab";
import { ImageIcon } from "../../static/image";
import { RectIcon } from "../../static/rect";
import { TextIcon } from "../../static/text";
import { IMAGE_INPUT_DOM_ID } from "../../utils/constant";
import { NAV_ENUM } from "./constant";
import styles from "./index.m.scss";

export const Header: FC = () => {
  const { editor } = useEditor();
  const [active, setActive] = useState<string>(NAV_ENUM.DEFAULT);

  const switchIndex = useMemoizedFn((index: string) => {
    if (index === active) return void 0;
    editor.canvas.grab.close();
    editor.canvas.insert.close();
    if (index === NAV_ENUM.GRAB) {
      editor.canvas.grab.start();
    }
    const empty = { x: 0, y: 0, width: 0, height: 0 };
    if (index === NAV_ENUM.RECT) {
      const deltaLike: DeltaLike = { key: NAV_ENUM.RECT, ...empty };
      editor.canvas.insert.start(deltaLike);
    }
    if (index === NAV_ENUM.TEXT) {
      const deltaLike: DeltaLike = { key: NAV_ENUM.TEXT, ...empty };
      editor.canvas.insert.start(deltaLike);
    }
    if (index === NAV_ENUM.IMAGE) {
      const deltaLike: DeltaLike = { key: NAV_ENUM.IMAGE, ...empty };
      let input = document.getElementById(IMAGE_INPUT_DOM_ID) as HTMLInputElement;
      if (!input) {
        input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("id", IMAGE_INPUT_DOM_ID);
        input.setAttribute("accept", "image/png, image/jpeg, image/svg+xml");
        input.style.display = "none";
        document.body.append(input);
      }
      input.value = "";
      input.onchange = e => {
        const target = e.target as HTMLInputElement;
        document.body.removeChild(input);
        const files = target.files;
        if (files && files[0]) {
          const reader = new FileReader();
          reader.onloadend = function () {
            const src = reader.result as string;
            deltaLike.attrs = { src };
            editor.canvas.insert.start(deltaLike);
          };
          reader.readAsDataURL(files[0]);
        }
      };
      input.click();
    }
    setActive(index);
  });

  const onDragRect = (e: React.DragEvent<HTMLDivElement>) => {
    if (active !== NAV_ENUM.DEFAULT) return false;
    const deltaLike: DeltaLike = {
      key: NAV_ENUM.RECT,
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    };
    e.dataTransfer.setData(DRAG_KEY, TSON.encode(deltaLike) || "");
  };

  const onDragText = (e: React.DragEvent<HTMLDivElement>) => {
    if (active !== NAV_ENUM.DEFAULT) return false;
    const deltaLike: DeltaLike = {
      key: NAV_ENUM.TEXT,
      x: 0,
      y: 0,
      width: 100,
      height: 50,
    };
    e.dataTransfer.setData(DRAG_KEY, TSON.encode(deltaLike) || "");
  };

  const onDragEnd = () => {
    switchIndex(NAV_ENUM.DEFAULT);
  };

  useEffect(() => {
    const onInsertState = (data: { done: boolean }) => {
      if (data.done) switchIndex(NAV_ENUM.DEFAULT);
    };
    editor.event.on(EDITOR_EVENT.INSERT_STATE, onInsertState);
    return () => {
      editor.event.off(EDITOR_EVENT.INSERT_STATE, onInsertState);
    };
  }, [editor, switchIndex]);

  return (
    <div className={styles.container}>
      <div className={styles.opGroup}>
        <div
          className={cs(styles.op, active === NAV_ENUM.DEFAULT && styles.active)}
          onClick={() => switchIndex(NAV_ENUM.DEFAULT)}
        >
          {CursorIcon}
        </div>
        <div
          className={cs(styles.op, active === NAV_ENUM.GRAB && styles.active)}
          onClick={() => switchIndex(NAV_ENUM.GRAB)}
        >
          {GrabIcon}
        </div>
        <div
          draggable={active === NAV_ENUM.DEFAULT}
          onDragStart={onDragRect}
          onDragEnd={onDragEnd}
          className={cs(styles.op, active === NAV_ENUM.RECT && styles.active)}
          onClick={() => switchIndex(NAV_ENUM.RECT)}
        >
          {RectIcon}
        </div>
        <div
          className={cs(styles.op, active === NAV_ENUM.IMAGE && styles.active)}
          onClick={() => switchIndex(NAV_ENUM.IMAGE)}
        >
          {ImageIcon}
        </div>
        <div
          draggable={active === NAV_ENUM.DEFAULT}
          onDragStart={onDragText}
          onDragEnd={onDragEnd}
          className={cs(styles.op, active === NAV_ENUM.TEXT && styles.active)}
          onClick={() => switchIndex(NAV_ENUM.TEXT)}
        >
          {TextIcon}
        </div>
      </div>
      <div className={cs(styles.externalGroup)}>
        <a
          className={styles.github}
          target="_blank"
          href={"https://github.com/WindrunnerMax/CanvasEditor"}
        >
          <IconGithub />
        </a>
      </div>
    </div>
  );
};
