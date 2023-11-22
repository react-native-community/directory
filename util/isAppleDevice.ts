/// <reference types="user-agent-data-types" />

export default function isAppleDevice() {
  if (!navigator) return false;

  return /(Mac|iPhone|iPod|iPad)/i.test(
    navigator?.platform ?? navigator?.userAgentData?.platform ?? ''
  );
}
