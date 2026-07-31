# Đang tải and Motion System

## Principles

- Preserve layout while data loads; do not cover the page with a generic spinner.
- Use contextual skeletons for list, table and detail screens.
- Never simulate a successful write action. Submit buttons use their real request loading state.
- Image loading is independent from API loading and uses a lightweight shimmer placeholder.
- Motion is short, low-distance and disabled by `prefers-reduced-motion`.

## Components

- `Đang tảiSkeleton.jsx`: list, table and detail skeletons.
- `AsyncImage.jsx`: image placeholder and fade-in.
- `RouteProgress.jsx`: subtle route-change progress line.
- `GamingNút.jsx`: canonical submit spinner and disabled state.

## Timing

- Page enter: 280ms.
- Hộp thoại enter: 220ms.
- Image fade: 300ms.
- Route progress: 420ms.
- Skeleton shimmer: 1250ms loop.
