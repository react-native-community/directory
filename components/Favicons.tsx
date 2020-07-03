import * as React from 'react';

const Favicons = () => (
  <>
    <link rel="icon" type="image/png" sizes="32x32" href={require('../assets/favicon-32x32.png')} />
    <link rel="icon" type="image/png" sizes="16x16" href={require('../assets/favicon-16x16.png')} />
  </>
);

export default Favicons;
