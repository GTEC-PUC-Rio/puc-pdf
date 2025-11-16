import { afterEach, vi } from 'vitest';

afterEach(() => {
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

if (typeof globalThis.DOMMatrix === 'undefined') {
  class DOMMatrixPolyfill {
    multiplySelf() {
      return this;
    }

    invertSelf() {
      return this;
    }
  }

  // @ts-expect-error - jsdom does not provide DOMMatrix in Node.
  globalThis.DOMMatrix = DOMMatrixPolyfill;
}

if (typeof globalThis.Worker === 'undefined') {
  class WorkerPolyfill {
    onmessage: ((event: MessageEvent) => void) | null = null;
    postMessage() {}
    terminate() {}
    addEventListener() {}
    removeEventListener() {}
  }

  // @ts-expect-error - jsdom does not provide Worker.
  globalThis.Worker = WorkerPolyfill;
}

HTMLCanvasElement.prototype.getContext = () =>
  ({
    fillRect: () => {},
    strokeRect: () => {},
    clearRect: () => {},
    drawImage: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    stroke: () => {},
    arc: () => {},
    fill: () => {},
    strokeStyle: '',
    fillStyle: '',
    lineWidth: 1,
    canvas: document.createElement('canvas'),
    getImageData: () => ({ data: [] }),
    putImageData: () => {},
  }) as unknown as CanvasRenderingContext2D;

if (!globalThis.URL.createObjectURL) {
  globalThis.URL.createObjectURL = () => 'blob:mock-url';
}

if (!globalThis.URL.revokeObjectURL) {
  globalThis.URL.revokeObjectURL = () => undefined;
}
