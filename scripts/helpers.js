export function sleep(ms = 0, msMax = null) {
  return new Promise(r =>
    setTimeout(r, msMax ? Math.floor(Math.random() * (msMax - ms)) + ms : ms)
  );
}

export function fillNpmName(project) {
  if (!project.npmPkg) {
    const parts = project.githubUrl.split('/');
    project.npmPkg = parts[parts.length - 1].toLowerCase();
  }
  return project;
}

export function processTopics(topics) {
  return (topics || [])
    .map(topic =>
      topic
        .replace(/([ _])/g, '-')
        .replace('react-native-', '')
        .toLowerCase()
        .trim()
    )
    .filter(topic => topic?.length);
}
