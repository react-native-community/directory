import fetch from 'cross-fetch';

import libraries from '../react-native-libraries.json' assert { type: 'json' };

console.log('⬇️ Attempting to fetch examples and images');

libraries.forEach(lib => {
  if (lib.examples) {
    lib.examples.forEach((example, i) => {
      setTimeout(() => {
        fetch(example)
          .then(response => {
            if (response.status !== 200) {
              console.warn(`EXAMPLE: ${example} returned ${response.status}`);
            }
          })
          .catch(e => {
            console.warn(`EXAMPLE: errored! ${e}`);
          });
      }, 150 * i);
    });
  }

  if (lib.images) {
    lib.images.forEach((img, i) => {
      setTimeout(() => {
        fetch(img)
          .then(response => {
            if (response.status !== 200) {
              console.warn(`IMG: ${img} returned ${response.status}`);
            }
          })
          .catch(e => {
            console.warn(`IMG: errored! ${e}`);
          });
      }, 150 * i);
    });
  }
});
