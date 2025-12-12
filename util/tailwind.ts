import { create } from 'twrnc';

const tw = create(require(`../tailwind.config.js`).default);

export { useDeviceContext, useAppColorScheme } from 'twrnc';

export default tw;
