const calculateScore = repo => {
  repo.score = 0;

  const daysAgo = getDaysAgo(repo.stats.updatedAt);

  if (daysAgo <= 30) {
    repo.score += 15;
  } else if (daysAgo <= 60) {
    repo.score += 10;
  } else if (daysAgo <= 90) {
    repo.score += 5;
  }

  if (repo.stats.hasIssues) {
    repo.score += 10;
  }

  if (repo.stats.hasWiki) {
    repo.score += 10;
  }

  if (repo.stats.hasPages) {
    repo.score += 5;
  }

  if (repo.stats.hasDownloads) {
    repo.score += 10;
  }

  if (repo.stats.hasTopics) {
    repo.score += 10;
  }

  if (repo.stats.watchers > 10) {
    repo.score += 5;
  }

  if (repo.stats.forks > 5) {
    repo.score += 10;
  }

  if (repo.stats.stars >= 2500) {
    repo.score += 20;
  } else if (repo.stats.stars >= 500) {
    repo.score += 15;
  } else if (repo.stats.stars >= 100) {
    repo.score += 10;
  }

  return repo;
};

const getDaysAgo = date => {
  const updateDate = new Date(date).getTime();
  const currentDate = new Date().getTime();

  return (currentDate - updateDate) / 1000 / 60 / 60 / 24;
};

export default calculateScore;
