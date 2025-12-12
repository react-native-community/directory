import { create } from 'twrnc';

const tw = create(require(`../tailwind.config.js`));

export { useDeviceContext, useAppColorScheme } from 'twrnc';

export default tw;
