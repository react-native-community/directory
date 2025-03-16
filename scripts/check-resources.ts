import fetch from 'cross-fetch';

import libraries from '../react-native-libraries.json';
import { sleep } from './helpers';

console.log('⬇️ Attempting to fetch examples and images');

libraries.forEach(lib => {
  if (lib.examples) {
    lib.examples.forEach(async (example: string, index: number) => {
      await sleep(500);
      setTimeout(() => {
        fetch(example)
          .then(response => {
            if (response.status !== 200) {
              console.warn(`EXAMPLE: ${example} returned ${response.status}`);
            }
          })
          .catch(error => {
            console.warn(`EXAMPLE: errored! ${error}`);
          });
      }, 150 * index);
    });
  }

  if (lib.images) {
    lib.images.forEach(async (img: string, index: number) => {
      await sleep(500);
      setTimeout(() => {
        fetch(img)
          .then(response => {
            if (response.status !== 200) {
              console.warn(`IMG: ${img} returned ${response.status}`);
            }
          })
          .catch(error => {
            console.warn(`IMG: errored! ${error}`);
          });
      }, 150 * index);
    });
  }
});
