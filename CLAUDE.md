## How to treat a2zb/ packages

- The user owns all `@a2zb/*` packages (e.g. `@a2zb/react`, `@a2zb/lib`). When a fix or improvement would belong in one of those packages rather than in this repo, suggest that instead of working around it here.

## SVG components: share the layout, not the drawing

- When a part of a diagram should be reusable, share the **layout function**
  (the geometry: positions, sizes, bounding box) in `lib/svg`. The component
  that draws it stays in its diagram's folder and draws its own look (glass,
  rows, ink). Example: `cascadeLayout` lives in `lib/svg/layouts/arrange/` and
  is shared, while `ActionCards` lives in `automation/` and belongs only to
  the automation diagram.
- Don't add content slots or extra props (like `cardContent` or an `ink` box)
  just to make a drawing component generic.
- Don't extract a reusable menu, row or other part until a second caller
  actually needs it. Then pull it out of working code.
- Name the drawing component after what it shows in the diagram
  (`ActionCards`), and give the caller's section the same name
  (`const actionCards = (() => …)()`).

## SVG components: no hardcoded knobs

- This section is about **reusable** parts (shared components and layout
  helpers used by more than one diagram).
- A one-off parent SVG that draws its own stuff (e.g. `ConnectingSystems`)
  is not a reusable part. Base most of its sizes on `unit`
  (`const iconSize = unit * 0.7`) inside the component, and keep its props
  few. Don't turn every size, gap or font size into a `*Units` prop.
- In a reusable part, any number that controls how something looks (size,
  ratio, gap, angle, count, offset, opacity, glow) we might wanna make an
  input passed by the caller. Optional inputs with a neutral default (0, 1,
  "no change") are fine. Before giving an input an arbitrary default (like
  count = 3 or gap = 45) or a constant inside the component, tell me why you
  think that is the better choice.
- Shared SVG components and layout helpers must not assume anything about
  where they're used. If a value depends on the caller (size, aspect ratio,
  viewBox), the caller passes it in. Bad: a layout helper doing
  `height = width * 2/3` because today's only caller draws in a 300×200
  viewBox. Good: the helper takes `height` (or `ratio`) as a required input.
- Don't copy fixed values from one diagram into a shared component.
- Always make a plan when extracting a reusable part of an SVG, and consult with me if any knobs seem to better suit being hardcoded.

## SVG components: layout of the svg

- A fresh SVG component should be divided into clear sections, eg: const leftBox = (() => )() that returns layout, widths, heights and other relevant info for that section. Example:

```ts
const leftBox = (() => {
  const groupWidth = contentWidth - rightBox.groupWidth;
  const groupHeight = contentHeight;

  const translateX = 0; // flush with the content box's left edge
  const { offset: translateY } = alignCenter(contentHeight, groupHeight);

  // shared by the orbit and the centerpiece
  const contentRing = {
    radius: groupWidth / 2,
    // middle of a square box as tall as the content box
    centerX: groupWidth / 2,
    centerY: groupHeight / 2,
  };

  return {
    groupWidth,
    groupHeight,
    translateX,
    translateY,
    contentRing,
  };
})();
```

## SVG components: inline destructuring in the JSX

- When a part of the JSX repeats one section's name a lot (around 5 or more, e.g.
  `icon.cx`, `icon.cy`, `icon.size`) across more than one element, and those elements
  belong to the same visual group, wrap that group in an inline block that destructures
  the section first, so the elements read plain names:

```tsx
{
  /* icon in a circle */
}
{
  (() => {
    const { cx, cy, radius: r, size } = icon;
    return (
      <>
        <circle cx={cx} cy={cy} r={r} />
        <Icon x={cx - size / 2} y={cy - size / 2} size={size} />
      </>
    );
  })();
}
```

- Don't bother for a single element with only a couple of fields
  (`<circle cx={dot.cx} r={dot.radius} />` is fine as it is).
- One block per visible part (icon, text, chevron), with its comment above it.
- If a field's name clashes with a prop or an outer variable, rename it while
  destructuring (`radius: r`).
