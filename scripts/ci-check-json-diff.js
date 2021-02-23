import fs from 'fs';

const fileExistsSync = file => {
  try {
    const data = fs.readFileSync(file, 'utf8');
    if (data.length) {
      console.log(data);
      console.error('Please reformat the react-native-libraries.json!');
      process.exit(1);
    }
    return true;
  } catch (err) {
    throw err;
    process.exit(1);
  }
};

fileExistsSync('changes.patch');
