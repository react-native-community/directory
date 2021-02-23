import fs from 'fs';

const fileExistsSync = file => {
  try {
    const data = fs.readFileSync(file, 'utf8');
    if (data.length) {
      console.log(data);
      console.error(
        'Please reformat the react-native-libraries.json using `yarn libraries:cleanup`!'
      );
      process.exit(1);
    }
  } catch (err) {
    throw err;
    process.exit(1);
  }
};

fileExistsSync('changes.patch');
