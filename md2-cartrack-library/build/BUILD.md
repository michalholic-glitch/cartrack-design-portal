# Build a self-contained, Cartrack-themed MDC stylesheet

Goal: compile **one CSS file** (`mdc.cartrack.css`) that contains the real Material
Components Web styles, recoloured to Cartrack — no CDN or runtime theming needed.

> Requires **Dart Sass** (the `sass` npm package). `node-sass`/`libsass` will **not**
> work — MDC uses the modern `@use`/`@forward` module system.

## Steps (on any machine with Node + internet)

```bash
mkdir cartrack-mdc && cd cartrack-mdc

# 1. install MDC Web (brings all @material/* packages) + Dart Sass
npm init -y
npm install material-components-web@14.0.0 sass

# 2. copy the theme entry next to this build (the file mdc.cartrack.theme.scss)
#    it sets $primary:#F47735 etc. then @use's the full MDC bundle.

# 3. compile — load-path=node_modules lets @material/* and the meta package resolve
npx sass --load-path=node_modules \
  mdc.cartrack.theme.scss mdc.cartrack.css --style=compressed --no-source-map
```

You now have `mdc.cartrack.css` — the genuine MDC components, Cartrack-coloured,
self-contained (works offline).

## Using it in a page

```html
<head>
  <link rel="stylesheet" href="mdc.cartrack.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
<body>
  <!-- real MDC markup, e.g. a button -->
  <button class="mdc-button mdc-button--raised">
    <span class="mdc-button__ripple"></span><span class="mdc-button__label">Save</span>
  </button>

  <!-- behaviours (ripple, text-field float, switch, tabs, data table, dialog…) -->
  <script src="https://unpkg.com/material-components-web@14.0.0/dist/material-components-web.min.js"></script>
  <script> window.mdc && mdc.autoInit && mdc.autoInit(); </script>
</body>
```

(You can also bundle the MDC JS locally from `node_modules/material-components-web/dist/`
the same way, for a fully offline page.)

## Theme tokens you can change

In `mdc.cartrack.theme.scss`, the `@use "@material/theme" with (...)` block controls
the palette: `$primary`, `$secondary`, `$surface`, `$background`, `$error`, and the
matching `$on-*` colours. For white-label clients, recompile with their `$primary`/
`$secondary` — exactly mirroring how `karoo-ui` themes per client today.

## Why this matters

This is the bridge from "guidelines" to "real components": the same compiled CSS can
back the documentation pages **and** be the styling the product ships, so they can't
drift. (MDC Web is Apache-2.0, © Google — keep the licence/attribution.)
