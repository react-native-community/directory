// This is an array of modifier objects. Each modifier has a name, value, and condition.
// The condiction is passed the data and if it returns true, the value is added to the
// libraries score.
//
// The idea is to add to the score for good behaviour and subtract from the score for
// bad behaviour. It is completely reasonable for no modifiers to match a given library
// and it should get a score close to the middle. To help with this, the positive and
// negative modifier scores should be roughly the same magnitude.
const modifiers = [
  {
    name: 'Very popular',
    value: 40,
    condition: data => popularityScore(data) > 10000,
  },
  {
    name: 'Popular',
    value: 10,
    condition: data => popularityScore(data) > 2500,
  },
  {
    name: 'Recommended',
    value: 20,
    condition: data => data.goldstar,
  },
  {
    name: 'Lots of open issues',
    value: -20,
    condition: data => data.github.stats.issues >= 75,
  },
  {
    name: 'No license',
    value: -20,
    condition: data => data.license === null,
  },
  {
    name: 'GPL license',
    value: -20,
    condition: data =>
      data.license &&
      data.license.key &&
      (data.license.key.startsWith('gpl') || data.license.key.startsWith('other')),
  },
  {
    name: 'Recently updated',
    value: 10,
    condition: data => getUpdatedDaysAgo(data) <= 30, // Roughly 1 month
  },
  {
    name: 'Not updated recently',
    value: -20,
    condition: data => getUpdatedDaysAgo(data) >= 180, // Roughly 6 months
  },
];

// Calculate the minimum and maximum possible scores based on the modifiers
const minScore = modifiers.reduce((currentMin, modifier) => {
  return modifier.value < 0 ? currentMin + modifier.value : currentMin;
}, 0);
const maxScore = modifiers.reduce((currentMax, modifier) => {
  return modifier.value > 0 ? currentMax + modifier.value : currentMax;
}, 0);

const calculateScore = data => {
  // Filter the modifiers to the ones which condictions pass with the data
  const matchingModifiers = modifiers.filter(modifier => modifier.condition(data));

  // Reduce the matching modifiers to find the raw score for the data
  const rawScore = matchingModifiers.reduce((currentScore, modifier) => {
    return currentScore + modifier.value;
  }, 0);

  // Scale the raw score as a percentage between the minimum and maximum possible score
  // based on the available modifiers
  const score = Math.round(((rawScore - minScore) / (maxScore - minScore)) * 100);

  // Map the modifiers to the name so we can include that in the data
  const matchingModifierNames = matchingModifiers.map(modifier => modifier.name);

  return {
    ...data,
    score,
    matchingScoreModifiers: matchingModifierNames,
  };
};

const popularityScore = data => {
  let { subscribers, forks, stars } = data.github.stats;
  let { downloads } = data.npm;
  return subscribers * 20 + forks * 10 + stars + downloads / 100;
};

const getUpdatedDaysAgo = data => {
  const { updatedAt } = data.github.stats;
  const updateDate = new Date(updatedAt).getTime();
  const currentDate = new Date().getTime();

  return (currentDate - updateDate) / 1000 / 60 / 60 / 24;
};

export default calculateScore;
