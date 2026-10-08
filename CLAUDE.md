## SVG components: no hardcoded knobs

- Any number that controls how something looks (size, ratio, gap,
  angle, count, offset, opacity, glow) must be a required input,
  passed by the caller. Never a hidden default or a constant inside
  the component.
- Shared SVG components and layout helpers must not assume anything about
  where they're used. If a value depends on the caller (size, aspect ratio,
  viewBox), the caller passes it in. Bad: a layout helper doing
  `height = width * 2/3` because today's only caller draws in a 300×200
  viewBox. Good: the helper takes `height` (or `ratio`) as a required input.
- Don't copy fixed values from one diagram into a shared component.
- Always make a plan when extracting a reusable part of an SVG, and consult with me if any knobs seem to better suit being hardcoded.
