import type { BoundKey } from "../types.js";
import { CT_PLACEMENT_STATIC, CT_PLACEMENT_DYNAMIC, CT_PLACEMENT_LAZY } from "@cartrawler/translations-core";

type Placement = BoundKey["placement"];

interface PlacementPickerProps {
  value: Placement;
  onChange: (placement: Placement) => void;
}

const SEGMENTS: { value: Placement; label: string }[] = [
  { value: CT_PLACEMENT_STATIC, label: "Static" },
  { value: CT_PLACEMENT_DYNAMIC, label: "Dynamic" },
  { value: CT_PLACEMENT_LAZY, label: "Lazy" },
];

export function PlacementPicker({ value, onChange }: PlacementPickerProps) {
  return (
    <div className="placement-picker">
      <div className="placement-picker__label">Placement</div>
      <div className="placement-picker__segments" role="group" aria-label="Placement">
        {SEGMENTS.map((seg) => (
          <button
            key={seg.value}
            type="button"
            className={`placement-picker__segment ${value === seg.value ? "placement-picker__segment--active" : ""}`}
            aria-pressed={value === seg.value}
            onClick={() => onChange(seg.value)}
          >
            {seg.label}
          </button>
        ))}
      </div>
    </div>
  );
}
