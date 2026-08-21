import React from 'react';
import { cn } from '@/lib/utils';

/**
 * @typedef CardItem
 * @property {string | number} id - Unique identifier for the card.
 * @property {string} title - The main title text of the card.
 * @property {string} [subtitle] - The subtitle or category text.
 * @property {string} [description] - Optional card description text.
 * @property {string} [category] - Category name for the badge.
 * @property {string[]} [tags] - Optional tag badges.
 * @property {string} [to] - Target link URL.
 * @property {string} imageUrl - The URL for the card's background or cover image.
 */

/**
 * @typedef HoverRevealCardsProps
 * @property {CardItem[]} items - An array of card item objects to display.
 * @property {string} [className] - Optional additional class names for the container.
 * @property {string} [cardClassName] - Optional additional class names for individual cards.
 */

/**
 * A component that displays a grid of cards with a hover-reveal effect.
 * When a card is hovered or focused, it stands out while others are de-emphasized.
 */
const HoverRevealCards = ({
  items,
  className,
  cardClassName,
}) => {
  return (
    // The `group` class on the container enables styling children on parent hover.
    <div
      role="list"
      className={cn(
        'group grid w-full max-w-7xl grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.id}
          role="listitem"
          aria-label={`${item.title}, ${item.subtitle || ''}`}
          tabIndex={0}
          className={cn(
            'relative h-88 cursor-pointer overflow-hidden rounded-2xl bg-cover bg-center shadow-lg transition-all duration-500 ease-in-out',
            // On parent hover, apply these styles to all children.
            'group-hover:scale-[0.97] group-hover:opacity-60 group-hover:blur-[2px]',
            // On child hover/focus, override parent hover styles to highlight the current item.
            'hover:!scale-105 hover:!opacity-100 hover:!blur-none focus-visible:!scale-105 focus-visible:!opacity-100 focus-visible:!blur-none',
            // Accessibility: Add focus ring using theme variables.
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A82F19] focus-visible:ring-offset-2',
            cardClassName
          )}
          style={{ backgroundImage: `url(${item.imageUrl})` }}
        >
          {/* Gradient overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          {/* Card Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {item.subtitle && (
              <p className="text-xs font-bold uppercase tracking-widest text-[#A82F19] drop-shadow-sm">
                {item.subtitle}
              </p>
            )}
            <h3 className="mt-1 font-display text-xl font-extrabold text-white">
              {item.title}
            </h3>
            {item.description && (
              <p className="mt-2 text-xs line-clamp-2 text-neutral-200 font-normal">
                {item.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default HoverRevealCards;
