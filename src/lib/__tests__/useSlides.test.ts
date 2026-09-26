import { describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useSlides } from "../useSlides";

describe("useSlides", () => {
  function setup(defaultIndex = 0) {
    return renderHook(() => useSlides({ count: 3, defaultIndex }));
  }

  describe("next", () => {
    it("moves forward and sets direction right", () => {
      const { result } = setup();

      act(() => result.current.next());
      expect(result.current.index).toBe(1);
      expect(result.current.direction).toBe("right");
    });

    it("wraps from last to first", () => {
      const { result } = setup(2);

      act(() => result.current.next());
      expect(result.current.index).toBe(0);
    });
  });

  describe("prev", () => {
    it("moves back and sets direction left", () => {
      const { result } = setup(1);

      act(() => result.current.prev());
      expect(result.current.index).toBe(0);
      expect(result.current.direction).toBe("left");
    });

    it("wraps from first to last", () => {
      const { result } = setup(0);

      act(() => result.current.prev());
      expect(result.current.index).toBe(2);
    });
  });

  describe("goTo", () => {
    it("sets direction by comparing to the current index", () => {
      const { result } = setup(1);

      act(() => result.current.goTo(0));
      expect(result.current.index).toBe(0);
      expect(result.current.direction).toBe("left");

      act(() => result.current.goTo(2));
      expect(result.current.index).toBe(2);
      expect(result.current.direction).toBe("right");
    });

    it("does nothing when going to the current index", () => {
      const onChange = vi.fn();
      const { result } = renderHook(() =>
        useSlides({ count: 3, defaultIndex: 1, onChange }),
      );

      act(() => result.current.goTo(1));
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("controlled", () => {
    it("reports moves to the parent and shows the parent's index", () => {
      const onChange = vi.fn();
      const { result, rerender } = renderHook(
        ({ index }) => useSlides({ count: 3, index, onChange }),
        { initialProps: { index: 0 } },
      );

      act(() => result.current.next());
      expect(onChange).toHaveBeenCalledWith(1);
      expect(result.current.index).toBe(0);

      rerender({ index: 1 });
      expect(result.current.index).toBe(1);
    });
  });
});
