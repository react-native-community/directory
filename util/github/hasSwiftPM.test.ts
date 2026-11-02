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
  test('1. detects a React root manifest', () => {
    expect(hasSwiftPM({ packageSwift: REACT_MANIFEST })).toBe(true);
  });

  test('2. detects a React iOS manifest', () => {
    expect(hasSwiftPM({ iosPackageSwift: REACT_MANIFEST })).toBe(true);
  });

  test('3. ignores an auto-generated React manifest', () => {
    expect(hasSwiftPM({ packageSwift: SPM_AUTOGEN_MARKER + '\n' + REACT_MANIFEST })).toBe(false);
  });

  test('4. detects iOS React alongside an auto-generated manifest', () => {
    expect(
      hasSwiftPM({
        packageSwift: SPM_AUTOGEN_MARKER + '\n' + REACT_MANIFEST,
        iosPackageSwift: REACT_MANIFEST,
      })
    ).toBe(true);
  });

  test('5. detects an auto-scaffolded React manifest', () => {
    expect(
      hasSwiftPM({
        packageSwift:
          '// AUTO-SCAFFOLDED by react-native spm scaffold — safe to edit & commit via patch-package.\n' +
          REACT_MANIFEST,
      })
    ).toBe(true);
  });

  test('6. detects a package autolinking plugin without manifests', () => {
    expect(
      hasSwiftPM({ packageJson: { swiftpmConfig: { autolinkingPlugin: './spm-plugin.js' } } })
    ).toBe(true);
  });

  test('7. ignores named config without manifests', () => {
    expect(hasSwiftPM({ packageJson: { swiftpmConfig: { name: 'Foo' } } })).toBe(false);
  });

  test('8. ignores an empty autolinking plugin', () => {
    expect(hasSwiftPM({ packageJson: { swiftpmConfig: { autolinkingPlugin: '' } } })).toBe(false);
  });

  test('9. ignores no inputs', () => {
    expect(hasSwiftPM({})).toBe(false);
  });

  test('10. ignores an empty manifest', () => {
    expect(hasSwiftPM({ packageSwift: '' })).toBe(false);
  });

  test('11. ignores a plain manifest', () => {
    expect(hasSwiftPM({ packageSwift: PLAIN_MANIFEST })).toBe(false);
  });

  test('12. ignores React references in comments', () => {
    expect(
      hasSwiftPM({
        packageSwift:
          PLAIN_MANIFEST +
          '\n// React and ReactNative are injected by the plugin' +
          '\n/* "ReactHeaders" */',
      })
    ).toBe(false);
  });

  test('13. ignores an Expo module manifest without a library product', () => {
    expect(hasSwiftPM({ packageSwift: PLAIN_MANIFEST, isExpoModule: true })).toBe(false);
  });

  test('14. detects a plain manifest with named config', () => {
    expect(
      hasSwiftPM({
        packageSwift: PLAIN_MANIFEST,
        packageJson: { swiftpmConfig: { name: 'Foo' } },
      })
    ).toBe(true);
  });

  test('15. ignores a plain manifest with empty config', () => {
    expect(hasSwiftPM({ packageSwift: PLAIN_MANIFEST, packageJson: { swiftpmConfig: {} } })).toBe(
      false
    );
  });

  test('16. detects a React Native config autolinking plugin', () => {
    expect(
      hasSwiftPM({
        reactNativeConfig:
          "module.exports = {\n  spm: {\n    autolinkingPlugin: './scripts/spm/plugin.js',\n  },\n};",
      })
    ).toBe(true);
  });

  test('17. ignores unrelated React Native config', () => {
    expect(
      hasSwiftPM({
        reactNativeConfig: 'module.exports = { dependency: { platforms: { ios: {} } } };',
      })
    ).toBe(false);
  });

  test('18. ignores React Native config without a plugin', () => {
    expect(hasSwiftPM({ reactNativeConfig: "module.exports = { spm: { name: 'Foo' } };" })).toBe(
      false
    );
  });

  test('19. ignores an Expo module without manifests', () => {
    expect(hasSwiftPM({ isExpoModule: true })).toBe(false);
  });

  test('20. ignores an auto-generated Expo manifest', () => {
    expect(
      hasSwiftPM({
        packageSwift: SPM_AUTOGEN_MARKER + '\n' + PLAIN_MANIFEST,
        isExpoModule: true,
      })
    ).toBe(false);
  });

  test('21. detects an Expo module manifest with a library product', () => {
    expect(hasSwiftPM({ packageSwift: PRODUCT_MANIFEST, isExpoModule: true })).toBe(true);
  });

  test('22. ignores library products in comments', () => {
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

  test('23. ignores a library product without Expo or config', () => {
    expect(hasSwiftPM({ packageSwift: PRODUCT_MANIFEST })).toBe(false);
  });

  test('24. ignores an auto-generated Expo manifest with a library product', () => {
    expect(
      hasSwiftPM({
        packageSwift: SPM_AUTOGEN_MARKER + '\n' + PRODUCT_MANIFEST,
        isExpoModule: true,
      })
    ).toBe(false);
  });
});
