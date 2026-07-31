# Route transition and scroll behavior

- PUSH/REPLACE navigation starts at the top of the destination page.
- POP navigation restores the previous scroll position, so returning from a detail page returns to the same listing card.
- Detail-to-detail navigation also starts at the top because each route has a new location key.
- Browser-native scroll restoration is disabled while the application is mounted to avoid double restoration.
- Route progress starts as soon as an internal link is clicked and finishes after the destination route commits.
- Page data uses contextual skeletons with a short minimum duration to avoid spinner flashes.
- All motion respects `prefers-reduced-motion`.
