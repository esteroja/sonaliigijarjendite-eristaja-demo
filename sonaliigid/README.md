# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Project Structure Conventions

- `src/components/**` contains React UI components (`.jsx`).
- `src/components/input/**` contains text input + analysis controls.
- `src/components/table/**` contains table UI (`NgramTable`, headers, previews, controls).
- `src/components/tree/**` contains tree UI (`PosTree`, nodes, tree controls, tree tooltips).
- `src/components/views/**` contains view-level composition (`OverviewView`, `AtypicalView`, `TreeView`).
- `src/components/shared/**` contains reusable UI used by multiple features.
- `src/hooks/**` contains reusable React hooks (`useAnalysis`, `useRowsByN`, `useNgramRows`, `useExamplesByKey`).
- `src/utils/**` contains pure non-React logic (`.js`) grouped by domain.
- `src/utils/shared/**` contains cross-feature helpers.
- `src/utils/input/**` contains input-specific helpers/constants.
- `src/utils/table/**` contains table/domain formatting + CSV helpers.
- `src/utils/examples/**` contains highlighting helpers for examples/previews.
- `src/utils/tree/**` contains tree-specific pure helpers.

Placement rules:
- Keep feature-only code in its feature folder (`input`, `table`, `tree`).
- Put reusable UI in `src/components/shared/**`.
- Put reusable non-UI logic in `src/utils/shared/**`.
- Prefer explicit imports with file extensions (for example `./file.js`, `./Component.jsx`).
