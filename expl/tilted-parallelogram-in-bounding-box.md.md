# Deriving `lengthA` step by step

A board tilted by `tilt`, with its 4 corners touching the viewBox's 4 edges. `lengthA` (top edge) and `lengthB` (left edge) are the 2 lengths that make it fit. The steps below find `lengthA`; `lengthB` works the same way.

→ [Code example](#code-example)

## What the symbols mean

- `W` = total horizontal width of the board (`viewboxWidth`)
- `H` = total vertical height of the board (`viewboxHeight`)
- `A` = length of the top slanted edge (`lengthA`)
- `B` = length of the side slanted edge (`lengthB`)
- `t` = tilt angle

## Step 1 — Start with the width and height equations

$$
W = A\cos(t) + B\sin(t)
$$

$$
H = A\sin(t) + B\cos(t)
$$

**Why?**

The total width consists of:

- `A cos(t)` = horizontal movement from A
- `B sin(t)` = horizontal movement from B

The total height consists of:

- `A sin(t)` = vertical movement from A
- `B cos(t)` = vertical movement from B

**Goal:** Find A without knowing B.

## Step 2 — Multiply the width equation by cos(t)

Start with:

$$
W = A\cos(t) + B\sin(t)
$$

Multiply every term by $\cos(t)$:

$$
W\cos(t) = A\cos^2(t) + B\sin(t)\cos(t)
$$

We do this because we want to make the B terms in both equations equal.

## Step 3 — Multiply the height equation by sin(t)

Start with:

$$
H = A\sin(t) + B\cos(t)
$$

Multiply every term by $\sin(t)$:

$$
H\sin(t) = A\sin^2(t) + B\cos(t)\sin(t)
$$

Now both B terms are identical:

$$
B\sin(t)\cos(t) = B\cos(t)\sin(t)
$$

This works because multiplication can be done in either order.

## Step 4 — Subtract the equations

We now have:

$$
W\cos(t) = A\cos^2(t) + B\sin(t)\cos(t)
$$

$$
H\sin(t) = A\sin^2(t) + B\cos(t)\sin(t)
$$

Subtract the second equation from the first.

The B terms cancel:

$$
B\sin(t)\cos(t) - B\cos(t)\sin(t) = 0
$$

So we're left with:

$$
W\cos(t) - H\sin(t)
= A\cos^2(t) - A\sin^2(t)
$$

**B has disappeared!**

## Step 5 — Factor out A

Both terms on the right contain A:

$$
A\cos^2(t) - A\sin^2(t)
$$

Put A outside the parentheses:

$$
W\cos(t) - H\sin(t)
= A(\cos^2(t) - \sin^2(t))
$$

## Step 6 — Use the double-angle identity

There's a trigonometric identity:

$$
\cos^2(t) - \sin^2(t) = \cos(2t)
$$

This lets us replace the expression inside the parentheses:

$$
W\cos(t) - H\sin(t) = A\cos(2t)
$$

**Important:** The board isn't tilted twice as much. The double angle comes from the trigonometric identity.

## Step 7 — Isolate A

We have:

$$
W\cos(t) - H\sin(t) = A\cos(2t)
$$

Divide both sides by $\cos(2t)$:

$$
\boxed{A = \frac{W\cos(t) - H\sin(t)}{\cos(2t)}}
$$

**We've found A!**

## The TypeScript code

```ts
const tilt = deg(4);
const cos = Math.cos(tilt);
const sin = Math.sin(tilt);

const lengthA = (viewboxWidth * cos - viewboxHeight * sin) / Math.cos(tilt * 2);
```

## Quick recap

1. Start with the width and height equations.
2. Multiply the width equation by `cos(t)`.
3. Multiply the height equation by `sin(t)`.
4. Subtract the equations so B disappears.
5. Factor out A.
6. Replace `cos²(t) - sin²(t)` with `cos(2t)`.
7. Divide by `cos(2t)` to isolate A.

**Result:** `lengthA` is the full length of the top slanted edge.

## Code example

```ts
const viewboxWidth = 540;
const viewboxHeight = 400;

const board = (() => {
  const tilt = deg(3);
  const cos = Math.cos(tilt);
  const sin = Math.sin(tilt);

  // read recap in notes/
  const lengthA =
    (viewboxWidth * cos - viewboxHeight * sin) / Math.cos(tilt * 2);
  const lengthB =
    (viewboxHeight * cos - viewboxWidth * sin) / Math.cos(tilt * 2);

  const [origin, xEnd, , yEnd] = parallelogramCorners({
    origin: { x: lengthB * sin, y: lengthA * sin },
    lengthA,
    angleA: -tilt,
    lengthB,
    angleB: deg(90) + tilt,
  });
  const { transform, width, height } = parallelogramMatrix({
    origin,
    xEnd,
    yEnd,
  });
  const radius = height * 0.04;

  return { transform, width, height, radius };
})();
```
