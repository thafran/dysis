/**
 * Defines how the Perspective Strategies need to return the data (usually wrapped in a Promise).
 */
export interface PerspectiveI {
  toxicity?: number,
  severeToxicity?: number,
  identityAttack?: number,
  insult?: number,
  obscene?: number,
  sexualExplicit?: number,
  threat?: number,
  profanity?: number,
}

/**
 * This interface defines the Perspective Stategies class and is used by the PerspectiveContext.
 * Each PerspectiveStrategy needs an analyze() method which takes a string and return a Promise
 * delivering PerspectiveI data in the above defined form.
 */
export interface PerspectiveStrategyI {
  // eslint-disable-next-line no-unused-vars
  analyze(text: string): Promise<PerspectiveI>;
}
