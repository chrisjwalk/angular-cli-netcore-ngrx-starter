import { ApplicationRef } from '@angular/core';
import { waitForElement } from './wait-for-element';

describe('waitForElement', () => {
  let mockAppRef: ApplicationRef;

  beforeEach(() => {
    mockAppRef = { tick: vi.fn() } as unknown as ApplicationRef;
  });

  it('should return the element immediately if it already exists', async () => {
    const el = document.createElement('div');
    const getElement = vi.fn().mockReturnValue(el);

    const result = await waitForElement(getElement, mockAppRef);

    expect(result).toBe(el);
    expect(mockAppRef.tick).toHaveBeenCalled();
  });

  it('should poll until the element appears', async () => {
    const el = document.createElement('div');
    const getElement = vi
      .fn()
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null)
      .mockReturnValue(el);

    const result = await waitForElement(getElement, mockAppRef, 2000, 10);

    expect(result).toBe(el);
    expect(getElement).toHaveBeenCalledTimes(3);
  });

  it('should call tick() on each poll attempt', async () => {
    const el = document.createElement('div');
    const getElement = vi
      .fn()
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null)
      .mockReturnValue(el);

    await waitForElement(getElement, mockAppRef, 2000, 10);

    expect(mockAppRef.tick).toHaveBeenCalledTimes(3);
  });

  it('should throw if the element is not found within the timeout', async () => {
    const getElement = vi.fn().mockReturnValue(null);

    await expect(
      waitForElement(getElement, mockAppRef, 50, 10),
    ).rejects.toThrow('Element not found in time');
  });
});
