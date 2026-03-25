import type { BoundKey } from "../types.js";

interface ElementContextBarProps {
  tag: string | null;
  text: string | null;
  binding: BoundKey | null;
  onUnbind: () => void;
}

const NO_ELEMENT_MESSAGE = "Select an element on the canvas to bind a key";
const NO_BINDING_MESSAGE = "No binding";

export function ElementContextBar({ tag, text, binding, onUnbind }: ElementContextBarProps) {
  if (!tag) {
    return <div className="context-bar context-bar--empty">{NO_ELEMENT_MESSAGE}</div>;
  }

  return (
    <div className="context-bar">
      <div className="context-bar__element">
        <span className="context-bar__tag">{tag}</span>
        <span className="context-bar__text">{text}</span>
      </div>
      <div className="context-bar__binding">
        {binding ? (
          <>
            <span className="context-bar__dot context-bar__dot--bound" />
            <span>
              Bound: {binding.key} — {binding.placement}
            </span>
            <button type="button" className="context-bar__unbind" onClick={onUnbind}>
              Unbind
            </button>
          </>
        ) : (
          <>
            <span className="context-bar__dot" />
            <span>{NO_BINDING_MESSAGE}</span>
          </>
        )}
      </div>
    </div>
  );
}
