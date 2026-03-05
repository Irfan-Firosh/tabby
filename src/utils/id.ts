import { nanoid } from 'nanoid';

export const generateId = () => nanoid(12);

/**
 * Returns an order value between two neighbors for fractional indexing.
 * Pass undefined for a, b, or both to position at start/end.
 */
export function orderBetween(a?: number, b?: number): number {
  if (a === undefined && b === undefined) return 1000;
  if (a === undefined) return (b as number) - 1000;
  if (b === undefined) return a + 1000;
  return (a + b) / 2;
}
