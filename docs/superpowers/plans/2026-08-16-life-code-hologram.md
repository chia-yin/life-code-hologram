# Life Code Hologram Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive birthday parser that calculates all life-code nodes and presents them through a guided WebGL hologram experience.

**Architecture:** A Vite React application keeps pure birthday calculation and tour state outside the 3D renderer. React Three Fiber renders the node topology, while accessible HTML controls provide birthday entry, interpretation text, navigation, and graceful fallback.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, Three.js, React Three Fiber, Drei, CSS.

## Global Constraints

- Every derived sum is repeatedly reduced to one digit before reuse.
- Tour order is I → L → O → P/Q → R, followed by optional S/T.
- The reference topology comes from `docs/assets/life-code-hologram-reference.png`.
- The primary path is WebGL/3D; unsupported devices receive a readable simplified result.
- A user must complete the tour without orbiting or manipulating the 3D scene.
- Interpretation content remains separate from calculation logic.

---

### Task 1: Application shell and calculation engine

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/lib/hologram.ts`
- Test: `src/lib/hologram.test.ts`

**Interfaces:**
- Produces: `reduceDigit(value: number): number`
- Produces: `parseBirthday(date: string): HologramResult`
- Produces: `HologramNode` and `HologramResult` types.

- [ ] **Step 1: Scaffold Vite React TypeScript and install runtime/test dependencies**

Run:

```bash
npm create vite@latest . -- --template react-ts
npm install three @react-three/fiber @react-three/drei
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @types/three
```

Expected: package install succeeds and Vite scripts are available.

- [ ] **Step 2: Write failing calculation tests**

Cover:

```ts
expect(reduceDigit(18)).toBe(9)
expect(parseBirthday('1984-12-25').nodes).toMatchObject({
  A: 2, B: 5, C: 1, D: 2, E: 1, F: 9, G: 8, H: 4,
  I: 7, J: 3, K: 1, L: 3, M: 1, N: 4, O: 5,
  P: 6, Q: 9, R: 6, X: 8, W: 4, S: 3, V: 5, U: 7, T: 3,
})
expect(() => parseBirthday('1984-13-25')).toThrow('請輸入有效的生日')
```

- [ ] **Step 3: Run tests and verify failure**

Run: `npm test -- --run src/lib/hologram.test.ts`

Expected: FAIL because calculation exports do not exist.

- [ ] **Step 4: Implement the pure parser**

Use a validated local-date parser rather than `new Date(string)`. Zero-pad day/month, split `DDMMYYYY` into A–H, calculate nodes in dependency order, and return `{ birthday, nodes }`.

- [ ] **Step 5: Run unit tests**

Run: `npm test -- --run src/lib/hologram.test.ts`

Expected: PASS.

### Task 2: Guided-tour state and interpretation content

**Files:**
- Create: `src/features/tour/tour.ts`
- Create: `src/features/tour/interpretations.ts`
- Test: `src/features/tour/tour.test.ts`

**Interfaces:**
- Produces: `TOUR_STEPS: TourStep[]`
- Produces: `getTourStep(index: number): TourStep`
- Produces: `getInterpretation(node: NodeKey, digit: number): Interpretation`
- `TourStep` includes `id`, `nodes`, `eyebrow`, `title`, and `description`.

- [ ] **Step 1: Write failing tests for order and boundaries**

Verify core step node groups are `[['I'], ['L'], ['O'], ['P', 'Q'], ['R']]`, optional wing step is `['S', 'T']`, and index access clamps to valid boundaries.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- --run src/features/tour/tour.test.ts`

Expected: FAIL because tour modules do not exist.

- [ ] **Step 3: Implement tour metadata and placeholder interpretations**

Keep copy declarative and keyed by step/node. Include Traditional Chinese labels and neutral placeholder wording that does not assert unsupported numerology claims.

- [ ] **Step 4: Run tour tests**

Run: `npm test -- --run src/features/tour/tour.test.ts`

Expected: PASS.

### Task 3: Hologram scene

**Files:**
- Create: `src/features/hologram/HologramScene.tsx`
- Create: `src/features/hologram/HologramNode.tsx`
- Create: `src/features/hologram/node-layout.ts`
- Create: `src/features/hologram/WebGLBoundary.tsx`
- Test: `src/features/hologram/node-layout.test.ts`

**Interfaces:**
- Consumes: `HologramResult['nodes']`, `NodeKey[] activeNodes`.
- Produces: `<HologramScene nodes activeNodes />`.
- `NODE_LAYOUT` maps every A–T plus U/V/W/X node to a stable `[x, y, z]` coordinate.

- [ ] **Step 1: Write topology tests**

Assert all required keys exist, O is central, R is highest, S/T are lateral, and no coordinate contains non-finite values.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- --run src/features/hologram/node-layout.test.ts`

Expected: FAIL because layout does not exist.

- [ ] **Step 3: Implement the 3D scene**

Build a dark violet scene with emissive purple node rings, green O node, connecting beams, subtle particles, and a translucent stylized 「全」 silhouette. Active nodes brighten and move slightly forward; camera easing centers the active group. Keep manual orbit disabled by default.

- [ ] **Step 4: Add WebGL fallback**

Detect context creation failure through an error boundary and render a readable 2D list of computed node values plus the same tour controls.

- [ ] **Step 5: Run topology tests and production build**

Run: `npm test -- --run src/features/hologram/node-layout.test.ts && npm run build`

Expected: tests pass and build completes without TypeScript errors.

### Task 4: Birthday entry and guided page composition

**Files:**
- Modify: `src/App.tsx`
- Create: `src/features/input/BirthdayForm.tsx`
- Create: `src/features/tour/TourPanel.tsx`
- Create: `src/features/results/ResultSummary.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- `BirthdayForm` calls `onSubmit(date: string)`.
- `TourPanel` consumes `step`, `stepIndex`, `stepCount`, and navigation callbacks.
- `ResultSummary` supplies the WebGL fallback and screen-reader result.

- [ ] **Step 1: Write failing user-flow tests**

Test invalid input error, valid birthday render, I as initial active tour node, next/back controls, P/Q grouped step, replay, optional S/T, and CTA only after R.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- --run src/App.test.tsx`

Expected: FAIL because UI components are incomplete.

- [ ] **Step 3: Implement the page state machine**

States: `idle | touring | complete | wings`. On valid submit calculate once and enter `touring` at index 0. Editing the birthday resets the tour. Core completion reveals CTA and optional wing action.

- [ ] **Step 4: Implement accessible controls**

Use native date input, visible labels, inline `role="alert"` errors, keyboard-operable buttons, `aria-live="polite"` tour text, and a hidden textual node summary.

- [ ] **Step 5: Run UI tests**

Run: `npm test -- --run src/App.test.tsx`

Expected: PASS.

### Task 5: Visual system, responsiveness, and motion

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/app.css`
- Modify: `src/main.tsx`

**Interfaces:**
- Produces reusable CSS tokens for violet, green, cyan, surfaces, typography, spacing, and motion.

- [ ] **Step 1: Implement the responsive composition**

Desktop uses a full-viewport hologram stage with a restrained floating input/tour panel. Mobile stacks the stage and controls; the 3D canvas keeps at least 52vh and buttons remain reachable without canvas gestures.

- [ ] **Step 2: Add motion and reduced-motion behavior**

Use CSS transitions for panel changes and Three.js easing for focus. Under `prefers-reduced-motion`, disable particles drift and use immediate camera transitions.

- [ ] **Step 3: Verify production build**

Run: `npm run build`

Expected: PASS with generated `dist/`.

### Task 6: Full verification and documentation

**Files:**
- Create: `README.md`
- Modify: `package.json`

**Interfaces:**
- Produces documented `npm run dev`, `npm test`, and `npm run build` workflows.

- [ ] **Step 1: Run all automated checks**

Run: `npm test -- --run && npm run build`

Expected: all tests pass and production build succeeds.

- [ ] **Step 2: Browser-check core flows**

Verify desktop and mobile widths: valid/invalid birthday, complete guided path, optional S/T, replay, keyboard controls, reduced motion, and no WebGL console errors.

- [ ] **Step 3: Document usage and content replacement**

README must explain setup, calculation source file, interpretation source file, node layout source file, and current placeholder-copy limitation.

