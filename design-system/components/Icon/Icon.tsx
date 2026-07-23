import { forwardRef } from 'react';
import { FontAwesomeIcon, type FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import type { Except } from 'type-fest';

/**
 * Icon — real fleet-web component (src/components/Icon/index.tsx), copied verbatim.
 * Full spec: Icon.doc.json
 *
 * This is a thin, deliberate wrapper: all it does is forward props to FontAwesomeIcon
 * with a typed ref. The actual icon glyphs are Free+Pro FontAwesome, registered once
 * app-wide in src/util-functions/font-initialization.ts via `library.add(...)` — that
 * file is the source of truth for which icon *names* exist to pass into `icon` below.
 *
 * Tokens (tokens/tokens.json):
 * - semantic.icon.sizing — FontAwesome's own size enum; no separate pixel scale exists.
 * - semantic.icon.colour — currentColor by default; reuse semantic.color.text.* or a
 *   categorical hue.<hue>.icon token for an explicit override.
 */
export type IconProps = Except<FontAwesomeIconProps, 'forwardedRef'>;

const Icon = forwardRef<typeof FontAwesomeIcon, IconProps>(function Icon(props, ref) {
  return <FontAwesomeIcon forwardedRef={ref} {...props} />;
});

export default Icon;
