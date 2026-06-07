// Stub used in tests to resolve counter-remote/Routes without needing a running MFE remote.
// Production code uses the real MFE remote via Module Federation.
// Re-export the lib's routes directly — they already define the CounterContainer component.
export { counterRoutes } from '@myorg/counter';
