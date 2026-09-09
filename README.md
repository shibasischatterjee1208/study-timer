# Study Timer

A React single-page application for tracking study time by subject.

**Live:** https://study-timer-sigma-jade.vercel.app/

## Features
- Countdown timer with start, pause, stop and reset
- Configurable session length (defaults to 25 minutes)
- User-managed subject list with add and remove, with a confirmation dialog
- Sessions logged on stop or on natural completion
- Daily record grouping sessions by date with per-day totals
- Bar chart of total time per subject
- Data persists in localStorage

## Running locally
npm install
npm run dev

## Structure
- `App.jsx` holds all state and handlers
- `components/` holds display components that receive props

## React concepts used
- `useState` for timer, subjects, sessions and UI state
- `useEffect` with cleanup for the countdown interval
- Derived values computed at render rather than stored in state
- Lifting state up, since subjects are used by two sibling components
- Conditional rendering, list rendering with keys, controlled inputs

## Known limitations
- `setInterval` drifts slightly, so logged time is approximate
- localStorage is per-browser, so data does not sync across devices
- Sessions for a deleted subject remain in the total but leave the chart