import Blob from 'cross-blob';

/**
 * Returns random number between 0 and int max
 * @param {int} max indicates the maximum integer range
 * @return {int}
 */
export function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/**
 * Calculates and returns byte size of a string
 * @param {String} string which should be calculated
 * @return {size}
 */
export function getByteSize(string) {
  return new Blob([string]).size;
}

