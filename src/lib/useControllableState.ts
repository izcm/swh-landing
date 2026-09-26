import { useState } from "react";

// controlled when `value` is passed (parent owns the state), otherwise
// falls back to internal state seeded from `defaultValue`. `onChange`
// fires in both modes — so a parent can listen without taking control.
export function useControllableState<T>(
  value: T | undefined,
  defaultValue: T,
  onChange?: (next: T) => void,
) {
  const [internal, setInternal] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;

  const setValue = (next: T) => {
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return [current, setValue] as const;
}
