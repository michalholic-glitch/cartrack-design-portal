import React from 'react';

// See Badge.tsx/Card.tsx for why this reads primitive.* directly rather than semantic.* (the latter
// are mostly unresolved alias strings — safe only once a build-time token resolver exists).
import tokens from '../../tokens/tokens.json';

export interface ImageListItemData {
  /** Unique key for the tile. */
  id: string;
  /** Image URL. Omit and use a placeholder while loading. */
  src?: string;
  /** Required meaningful alt text — every image needs one per the spec's accessibility notes. */
  alt: string;
  /** Optional caption/title shown in a label overlay on the tile. */
  label?: string;
  /** Marks the tile as still loading (renders a placeholder/skeleton tile). */
  loading?: boolean;
  /** Makes the tile clickable (activation — opens a larger view or detail). */
  onClick?: () => void;
}

export interface ImageListProps {
  /** Tiles to render in the grid. */
  items: ImageListItemData[];
  /**
   * Column count for the standard/uniform grid. Column count adapts to width
   * per the spec's "Responsive columns" behavior; this sets the base count.
   */
  cols?: number;
  /** Max width of the grid container. */
  maxWidth?: number | string;
  /** Optional extra class names to compose with the base `mdc-image-list` class. */
  className?: string;
}

/**
 * ImageList — MD2 (MDC) Cartrack-themed.
 * Full spec: ImageList.doc.json
 * Mirrors the mdc-image-list class contract from
 * md2-cartrack-library/components/image-lists.html (a real, stock MDC Web
 * component — `ImageList`).
 * Tokens (tokens/tokens.json):
 * - spacing: semantic.spacing.xs (4px tile gap, low end of the spec's 4–8px range) — see
 *   semantic.spacing.sm (8px) for the high end, used where tiles need more breathing room.
 * - radius: semantic.radius.default (4px) is the closest fit for the spec's 2–4px tile radius,
 *   though this implementation currently renders 2px (see below) — not exactly either token.
 * - type: semantic.typography.scale.caption (12px) for the overlay label's low end; the spec's
 *   14px high end is semantic.typography.scale.body2.
 * Not yet tokenized: the 80px tile height has no matching dimension token.
 */
export function ImageList({ items, cols = 3, maxWidth = 360, className }: ImageListProps) {
  const tileWidth = `calc(100% / ${cols} - ${tokens.primitive.spacing['1']})`;

  return (
    <ul
      className={['mdc-image-list', className].filter(Boolean).join(' ')}
      style={{ maxWidth }}
    >
      {items.map((item) => {
        const tile = (
          <div className="mdc-image-list__image-aspect-container">
            {item.loading ? (
              <div className="mdc-image-list__image" style={{ width: tileWidth, height: 80 }} aria-hidden="true" />
            ) : (
              <img
                className="mdc-image-list__image"
                src={item.src}
                alt={item.alt}
                style={{ height: 80, borderRadius: 2, objectFit: 'cover' }}
              />
            )}
            {item.label ? (
              <div className="mdc-image-list__supporting">
                <span className="mdc-image-list__label">{item.label}</span>
              </div>
            ) : null}
          </div>
        );

        return (
          <li
            key={item.id}
            className="mdc-image-list__item"
            style={{ width: tileWidth, margin: 2 }}
          >
            {item.onClick ? (
              <button
                type="button"
                onClick={item.onClick}
                aria-label={item.alt}
                style={{ all: 'unset', display: 'block', width: '100%', cursor: 'pointer' }}
              >
                {tile}
              </button>
            ) : (
              tile
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default ImageList;
