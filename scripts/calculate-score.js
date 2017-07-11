const calculateScore = data => {
  let { github, npm } = data;
  let score = 0;

  const daysAgo = getDaysAgo(github.stats.updatedAt);

  if (daysAgo <= 30) {
    score += 15;
  } else if (daysAgo <= 60) {
    score += 10;
  } else if (daysAgo <= 90) {
    score += 5;
  }

  if (github.stats.hasIssues) {
    score += 5;
  }

  if (github.stats.hasWiki) {
    score += 5;
  }

  if (github.stats.hasPages) {
    score += 5;
  }

  if (npm.downloads >= 2500) {
    score += 25;
  } else if (npm.downloads >= 500) {
    score += 20;
  } else if (npm.downloads >= 100) {
    score += 15;
  }

  if (github.stats.hasTopics) {
    score += 10;
  }

  if (github.stats.watchers > 10) {
    score += 5;
  }

  if (github.stats.forks > 5) {
    score += 10;
  }

  if (github.stats.stars >= 2500) {
    score += 20;
  } else if (github.stats.stars >= 500) {
    score += 15;
  } else if (github.stats.stars >= 100) {
    score += 10;
  }

  data.score = score;
  return data;
};

const getDaysAgo = date => {
  const updateDate = new Date(date).getTime();
  const currentDate = new Date().getTime();

  return (currentDate - updateDate) / 1000 / 60 / 60 / 24;
};

export default calculateScore;
