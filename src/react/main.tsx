import { createRoot, type Root } from 'react-dom/client';
import { RootRouter } from './Router.tsx';

export type ReactRootHandle = Root | null;

export const mountReactApp = (container: HTMLElement): ReactRootHandle => {
  const root = createRoot(container);
  root.render(<RootRouter />);
  return root;
};
