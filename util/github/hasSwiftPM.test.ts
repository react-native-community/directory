import { describe, expect, test } from 'bun:test';

import hasSwiftPM, { SPM_AUTOGEN_MARKER } from '~/util/github/hasSwiftPM';

const REACT_MANIFEST = `// swift-tools-version: 6.0
import PackageDescription
let package = Package(
  name: "Foo",
  dependencies: [.package(name: "ReactNative", path: "../react-native")],
  targets: [.target(name: "Foo", dependencies: [.product(name: "ReactHeaders", package: "ReactNative")])]
)`;

const PLAIN_MANIFEST = `// swift-tools-version:5.9
// SPM manifest exists ONLY to run tests
import PackageDescription
let package = Package(name: "KalendarCore")`;

const PRODUCT_MANIFEST = `// swift-tools-version:5.9
import PackageDescription
let package = Package(
  name: "ExpoFoo",
  products: [.library(name: "ExpoFoo", targets: ["ExpoFoo"])],
  targets: [.target(name: "ExpoFoo")]
)`;

describe('hasSwiftPM', () => {
  test('detects a React root manifest', () => {
    expect(hasSwiftPM({ packageSwift: REACT_MANIFEST })).toBe(true);
  });

  test('detects a React iOS manifest', () => {
    expect(hasSwiftPM({ iosPackageSwift: REACT_MANIFEST })).toBe(true);
  });

  test('ignores an auto-generated React manifest', () => {
    expect(hasSwiftPM({ packageSwift: SPM_AUTOGEN_MARKER + '\n' + REACT_MANIFEST })).toBe(false);
  });

  test('detects iOS React alongside an auto-generated manifest', () => {
    expect(
      hasSwiftPM({
        packageSwift: SPM_AUTOGEN_MARKER + '\n' + REACT_MANIFEST,
        iosPackageSwift: REACT_MANIFEST,
      })
    ).toBe(true);
  });

  test('detects an auto-scaffolded React manifest', () => {
    expect(
      hasSwiftPM({
        packageSwift:
          '// AUTO-SCAFFOLDED by react-native spm scaffold — safe to edit & commit via patch-package.\n' +
          REACT_MANIFEST,
      })
    ).toBe(true);
  });

  test('detects a package autolinking plugin without manifests', () => {
    expect(hasSwiftPM({ swiftPMConfig: { autolinkingPlugin: './spm-plugin.js' } })).toBe(true);
  });

  test('ignores named config without manifests', () => {
    expect(hasSwiftPM({ swiftPMConfig: { name: 'Foo' } })).toBe(false);
  });

  test('ignores an empty autolinking plugin', () => {
    expect(hasSwiftPM({ swiftPMConfig: { autolinkingPlugin: '' } })).toBe(false);
  });

  test('ignores no inputs', () => {
    expect(hasSwiftPM({})).toBe(false);
  });

  test('ignores an empty manifest', () => {
    expect(hasSwiftPM({ packageSwift: '' })).toBe(false);
  });

  test('ignores a plain manifest', () => {
    expect(hasSwiftPM({ packageSwift: PLAIN_MANIFEST })).toBe(false);
  });

  test('ignores React references in comments', () => {
    expect(
      hasSwiftPM({
        packageSwift:
          PLAIN_MANIFEST +
          '\n// React and ReactNative are injected by the plugin' +
          '\n/* "ReactHeaders" */',
      })
    ).toBe(false);
  });

  test('ignores an Expo module manifest without a library product', () => {
    expect(hasSwiftPM({ packageSwift: PLAIN_MANIFEST, isExpoModule: true })).toBe(false);
  });

  test('detects a plain manifest with named config', () => {
    expect(
      hasSwiftPM({
        packageSwift: PLAIN_MANIFEST,
        swiftPMConfig: { name: 'Foo' },
      })
    ).toBe(true);
  });

  test('ignores a plain manifest with empty config', () => {
    expect(hasSwiftPM({ packageSwift: PLAIN_MANIFEST, swiftPMConfig: {} })).toBe(false);
  });

  test('detects a React Native config autolinking plugin', () => {
    expect(
      hasSwiftPM({
        reactNativeConfig:
          "module.exports = {\n  spm: {\n    autolinkingPlugin: './scripts/spm/plugin.js',\n  },\n};",
      })
    ).toBe(true);
  });

  test('ignores unrelated React Native config', () => {
    expect(
      hasSwiftPM({
        reactNativeConfig: 'module.exports = { dependency: { platforms: { ios: {} } } };',
      })
    ).toBe(false);
  });

  test('ignores React Native config without a plugin', () => {
    expect(hasSwiftPM({ reactNativeConfig: "module.exports = { spm: { name: 'Foo' } };" })).toBe(
      false
    );
  });

  test('ignores an Expo module without manifests', () => {
    expect(hasSwiftPM({ isExpoModule: true })).toBe(false);
  });

  test('ignores an auto-generated Expo manifest', () => {
    expect(
      hasSwiftPM({
        packageSwift: SPM_AUTOGEN_MARKER + '\n' + PLAIN_MANIFEST,
        isExpoModule: true,
      })
    ).toBe(false);
  });

  test('detects an Expo module manifest with a library product', () => {
    expect(hasSwiftPM({ packageSwift: PRODUCT_MANIFEST, isExpoModule: true })).toBe(true);
  });

  test('ignores library products in comments', () => {
    expect(
      hasSwiftPM({
        packageSwift:
          PLAIN_MANIFEST +
          '\n// products: [.library(name: "ExpoFoo", targets: ["ExpoFoo"])]' +
          '\n/* .library(name: "ExpoFoo") */',
        isExpoModule: true,
      })
    ).toBe(false);
  });

  test('ignores a library product without Expo or config', () => {
    expect(hasSwiftPM({ packageSwift: PRODUCT_MANIFEST })).toBe(false);
  });

  test('ignores an auto-generated Expo manifest with a library product', () => {
    expect(
      hasSwiftPM({
        packageSwift: SPM_AUTOGEN_MARKER + '\n' + PRODUCT_MANIFEST,
        isExpoModule: true,
      })
    ).toBe(false);
  });
});
