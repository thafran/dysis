import Blob from 'cross-blob';

/**
 * Returns random number between 0 and int max
 * @param {number} max indicates the maximum integer range
 * @return {number}
 */
export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

/**
 * Calculates and returns byte size of a string
 * @param {string} text which should be calculated
 * @return {size}
 */
export function getByteSize(text: string): number {
  return new Blob([text]).size;
}

/**
 * Counts an array of subreddit strings
 * @param arrayOfSubreddits 
 * @return array containing objects with properties subreddit and count, sorted by count 
 */
export function getCountOfSubreddits(arrayOfSubreddits: string[],) {
  let counts: {[key: string]: number} = {}
  for (const element of arrayOfSubreddits) {
    counts[element] ? counts[element]++ : counts[element] = 1
  }
  const result: {subreddit: string; count: number}[] = Object.keys(counts)
    .map((key) => {
      return {
        subreddit: key,
        count: counts[key],
      }
    }
  )
  result.sort(function (a, b) { return b.count - a.count })
  return result;
}