
export interface ToxicityStategyI {
  analyze(text: string): Promise<ToxicityI>;
}

export interface ToxicityI {
  toxicity?: number,
  severeToxicity?: number,
  identityAttack?: number,
  insult?: number,
  obscene?: number,
  sexualExplicit?: number,
  threat?: number,
  profanity?: number,
}