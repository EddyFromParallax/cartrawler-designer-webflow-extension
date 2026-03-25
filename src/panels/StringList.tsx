import { useRef, useEffect } from "react";
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import type { KoiosStringEntry } from "../types.js";

interface StringListProps {
  strings: KoiosStringEntry[];
  boundKey: string | null;
  flashKey: string | null;
  disabled: boolean;
  onSelect: (key: string) => void;
}

export function StringList({ strings, boundKey, flashKey, disabled, onSelect }: StringListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const psRef = useRef<PerfectScrollbar | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    psRef.current = new PerfectScrollbar(containerRef.current);
    return () => {
      psRef.current?.destroy();
      psRef.current = null;
    };
  }, []);

  useEffect(() => {
    psRef.current?.update();
  }, [strings]);

  return (
    <div className={`string-list ${disabled ? "string-list--disabled" : ""}`} ref={containerRef}>
      {strings.map((s) => {
        const isBound = s.key === boundKey;
        const isFlash = s.key === flashKey;
        const className = [
          "string-row",
          isBound ? "string-row--bound" : "",
          isFlash ? "string-row--flash" : "",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            key={s.key}
            type="button"
            className={className}
            disabled={disabled}
            onClick={() => onSelect(s.key)}
          >
            <span className="string-row__value">{s.value}</span>
            <span className="string-row__key">{s.key}</span>
            {isBound && <span className="string-row__badge">bound</span>}
          </button>
        );
      })}
    </div>
  );
}
