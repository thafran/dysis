import toxicity from '@tensorflow-models/toxicity';

/**
 * Analyses based on Tensorflow
 * @param text
 * @return
 */
export async function tensorflowToxicity(text: string) {
  const threshold: number = 0.9;
  const model = await toxicity.load(threshold, []);
  console.log(`Getting Tensorflow Toxicity for:\n"${text}"`);
  model.classify(text).then((predictions) => {
    for (const prediction of predictions) {
      console.log(prediction.label);
      console.log(prediction.results[0].probabilities);
    }
  });
}
