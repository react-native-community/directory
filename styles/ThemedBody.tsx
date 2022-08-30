import React, { useContext } from 'react';

import { colors, darkColors } from '../common/styleguide';
import CustomAppearanceContext from '../context/CustomAppearanceContext';

const ThemedBody = () => {
  const { isDark } = useContext(CustomAppearanceContext);
  return (
    <style>{`
      html,
      body {
        background-color: ${isDark ? darkColors.background : colors.white};
      }
    `}</style>
  );
};

export default ThemedBody;
