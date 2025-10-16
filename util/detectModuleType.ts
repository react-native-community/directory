import { type RepositoryTreeNode } from '~/types';

export default function detectModuleType(
  rootFiles: { entries: RepositoryTreeNode[] } | null,
  packageJson: any
) {
  if (!rootFiles || !rootFiles.entries.length) {
    return undefined;
  }

  if (
    packageJson?.devDependencies?.['react-native-nitro-modules'] ||
    packageJson?.peerDependencies?.['react-native-nitro-modules'] ||
    packageJson?.devDependencies?.['nitrogen'] ||
    packageJson?.devDependencies?.['nitro-codegen']
  ) {
    return 'nitro';
  }

  if (
    packageJson?.devDependencies?.['expo-modules-core'] ||
    packageJson?.peerDependencies?.['expo-modules-core'] ||
    packageJson?.devDependencies?.['expo-module-scripts']
  ) {
    return 'expo';
  }

  if (packageJson?.codegenConfig?.android || packageJson?.codegenConfig?.ios) {
    return 'turbo';
  }

  for (const node of rootFiles.entries) {
    if (node.name === 'expo-module.config.json') {
      return 'expo';
    }
    if (node.name === 'nitro.json') {
      return 'nitro';
    }
    if (node.name === 'turbo.json') {
      return 'turbo';
    }
  }

  return undefined;
}
