import fetch from 'cross-fetch';

import libraries from '../react-native-libraries.json';

libraries.forEach(lib => {
  if (lib.images) {
    lib.images.forEach(img => {
      fetch(img).then(response => {
        if (response.status !== 200) {
          console.warn(`IMG: ${img} returned ${response.status}`);
        }
      });
    });
  }
});
