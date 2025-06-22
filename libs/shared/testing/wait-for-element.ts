import { ApplicationRef } from '@angular/core';

/**
 * Waits for an element to appear in the DOM, triggering change detection as needed.
 * @param getElement Function that returns the element to wait for
 * @param applicationRef Angular ApplicationRef for tick()
 * @param timeout Maximum time to wait (ms)
 * @param interval Polling interval (ms)
 * @returns Promise resolving to the found element
 */
export async function waitForElement(
  getElement: () => Element | null,
  applicationRef: ApplicationRef,
  timeout = 2000,
  interval = 50,
): Promise<Element> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    applicationRef.tick();
    const el = getElement();
    if (el) return el;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error('Element not found in time');
}
