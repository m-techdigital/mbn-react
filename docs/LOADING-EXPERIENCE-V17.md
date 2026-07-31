# Đang tải experience v17

## Layers

1. Thin route progress starts immediately for internal navigation.
2. Full-screen loader appears after a short delay and remains for a minimum duration to avoid flicker.
3. Context skeletons preserve each page layout while data is loading.
4. Images shimmer in-place and fade in without layout shifts.
5. Mock mode can simulate home loading so UI/UX can be reviewed without a backend.

## Environment

```env
VITE_FULL_SCREEN_LOADING=true
VITE_INITIAL_LOADING_MS=850
VITE_ROUTE_OVERLAY_DELAY_MS=120
VITE_ROUTE_OVERLAY_MIN_MS=420
VITE_HOME_MOCK_LOADING_MS=950
```

Set `VITE_FULL_SCREEN_LOADING=false` to keep only the route progress and contextual skeletons. Set `VITE_HOME_MOCK_LOADING_MS=0` to disable simulated home loading.
