import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
  cb(0);
  return 0;
});
