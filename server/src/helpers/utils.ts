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
  return Buffer.from(text).length;
}

/**
 * Counts an array of subreddit strings
 * @param arrayOfSubreddits
 * @return array containing objects with properties subreddit and count, sorted by count
 */
export function getCountOfSubreddits(arrayOfSubreddits: string[]) {
  const counts: { [key: string]: number } = { };
  arrayOfSubreddits.forEach((element) => {
    if (counts[element]) {
      counts[element] += 1;
    } else {
      counts[element] = 1;
    }
  });
  const result: { subreddit: string; count: number }[] = Object.keys(counts)
    .map((key) => ({
      subreddit: key,
      count: counts[key],
    }));
  result.sort((a, b) => (b.count - a.count));
  return result;
}

/**
 * Reduces a given text to a given byte limit by stripping of characters at the end of
 * the text iteratively until the text does not exceed the limit anymore
 * @param text which should be stripped to a certain limit
 * @param limitInByte limit in Byte which a text should not exceed
 * @param stripPerIteration number of chars which are reduced per iteration (default 1)
 * @returns the text which has been stripped of characters to meet a byte size limit
 */
export function limitByteSizeOfText(text: string, limitInByte: number, stripPerIteration = 1) {
  let limitedText = text;
  while (getByteSize(limitedText) >= limitInByte) {
    limitedText = limitedText.slice(0, -stripPerIteration);
  }
  return limitedText;
}
