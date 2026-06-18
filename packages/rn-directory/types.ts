export type Command = (args: string[]) => Promise<void> | void;

export type PackageJsonRepository = string | { type: string; url: string; directory?: string };

export type LibraryDataEntryType = {
  githubUrl: string;
  ios?: boolean;
  android?: boolean;
  web?: boolean;
  expoGo?: boolean;
  windows?: boolean;
  macos?: boolean;
  fireos?: boolean;
  horizon?: boolean;
  tvos?: boolean;
  visionos?: boolean;
  vegaos?: boolean | string;
  unmaintained?: boolean;
  dev?: boolean;
  template?: boolean;
  newArchitecture?: boolean | 'new-arch-only';
  newArchitectureNote?: string;
  configPlugin?: boolean | string;
  alternatives?: string[];
  npmPkg?: string;
  examples?: string[];
  images?: string[];
};
