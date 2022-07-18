import toxicity from '@tensorflow-models/toxicity';

/**
 * Analyses based on Tensorflow
 * @param {string} text
 * @return {Object}
 */
export async function tensorflowToxicity(text) {
  const threshold = 0.9;
  const model = await toxicity.load(threshold);
  console.log(`Getting Tensorflow Toxicity for:\n"${text}"`);
  model.classify(text).then((predictions) => {
    for (const prediction of predictions) {
      console.log(prediction.label);
      console.log(prediction.results[0].probabilities);
    }
  });
}
