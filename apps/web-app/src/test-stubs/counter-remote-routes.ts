// Stub used in tests to resolve counter-remote/Routes without needing a running MFE remote.
// Production code uses the real MFE remote via Module Federation.
//
// fastCompile: mode === 'test' in analog() ensures Angular files outside tsconfig.spec.json
// are compiled via the single-pass AOT compiler, and non-Angular TypeScript files are
// stripped safely — so imports here are unrestricted.
import { CounterContainer } from '@myorg/counter';

export const counterRoutes = [
  {
    path: '',
    title: 'Counter',
    component: CounterContainer,
  },
];
