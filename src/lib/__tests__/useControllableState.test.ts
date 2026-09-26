import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useControllableState } from "../useControllableState";

describe("useControllableState", () => {
  describe("uncontrolled", () => {
    it("starts at defaultValue", () => {
      const { result } = renderHook(() => useControllableState(undefined, 2));
      expect(result.current[0]).toBe(2);
    });

    it("updates its own state", () => {
      const { result } = renderHook(() => useControllableState(undefined, 0));

      act(() => result.current[1](3));
      expect(result.current[0]).toBe(3);
    });

    it("updates own state and notifies when only onChange is passed", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useControllableState<number>(undefined, 0, onChange),
      );

      act(() => result.current[1](1));
      expect(result.current[0]).toBe(1);
      expect(onChange).toHaveBeenCalledWith(1);
    });
  });

  describe("controlled", () => {
    it("uses value over defaultValue", () => {
      const { result } = renderHook(() => useControllableState(5, 0));
      expect(result.current[0]).toBe(5);
    });

    it("ignores setValue until the parent passes a new value", () => {
      const onChange = vi.fn();
      const { result, rerender } = renderHook(
        ({ value }) => useControllableState(value, 0, onChange),
        { initialProps: { value: 1 } },
      );

      act(() => result.current[1](2));
      expect(onChange).toHaveBeenCalledWith(2);
      expect(result.current[0]).toBe(1);

      rerender({ value: 2 });
      expect(result.current[0]).toBe(2);
    });

    it("treats 0 as a controlled value, not missing", () => {
      const { result } = renderHook(() => useControllableState(0, 4));
      expect(result.current[0]).toBe(0);
    });
  });
});
