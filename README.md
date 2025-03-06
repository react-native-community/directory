<dd align="center"><img alt="React Native Directory Logo" height="64" src="./assets/logo.png" /></dd>
<h1 align="center">React Native Directory</h1>
<h3 align="center">
  <a href="https://reactnative.directory/">
    https://reactnative.directory
  </a>
</h3>
<p align="center">React Native Directory is a website where you can see all the libraries that are compatible with React Native.</p>
<p align="center">
  <a href="https://vercel.com/?utm_source=rndir&utm_campaign=oss">
    <img src="https://www.datocms-assets.com/31049/1618983297-powered-by-vercel.svg" alt="Powered by Vercel" />
  </a>
</p>

## How do I know I'm at the right place?

- You made a repository on GitHub and you want the world to know it works with React Native.
- You want to submit a pull request to improve React Native Directory or libraries dataset.
- You want to report a bug or make a suggestion.

## How do I update the data for a library?

- Find the entry for the library in [`react-native-libraries.json`](https://github.com/react-native-community/directory/blob/main/react-native-libraries.json) file. (Not there? [Add it to the directory](#how-do-i-add-a-library).)
- Update the entry with the new data. Use the [library fields description](#library-fields-description) as a guide.
- Submit a PR.

## How do I add a library?

- Add it **at the end** of [`react-native-libraries.json`](https://github.com/react-native-community/directory/blob/main/react-native-libraries.json) file (we use the order in that file for "Recently added" sort option).
- Use the [template](#new-library-entry-template) as a guide.
- Submit a PR.

### New library entry template

> [!IMPORTANT]
> Please follow format, fields order and indentation as seen below, skip any of the `false` values and do not fill optional fields, unless it's necessary.
> You can find the detailed descriptions of the fields below the entry template.

```json
{
  "githubUrl": "<GITHUB REPOSITORY URL>",
  "npmPkg": "<OPTIONAL NPM PACKAGE NAME>",
  "examples": [
    "<THE URL TO REPO>",
    "<THE URL TO A SNACK>"
  ],
  "images": ["<PUBLIC URL TO RELATED IMAGE>"],
  "ios": false,
  "android": false,
  "web": false,
  "windows": false,
  "macos": false,
  "tvos": false,
  "visionos": false,
  "expoGo": false,
  "fireos": false,
  "unmaintained": false,
  "dev": false,
  "template": false,
  "newArchitecture": false
}
```

> [!NOTE]
> If your package is within a monorepo on GitHub, eg: https://github.com/expo/expo/tree/main/packages/expo-web-browser,
> then the name, description, homepage, and topics (keywords) will be extracted from `package.json` in the package subdirectory.
> However, GitHub stats will be based on the monorepo, because there isn't really another option.


### Library fields description

#### ⚙️ General

- #### ❗ `githubUrl` **(required)**

  **(string)** - URL to the package GitHub repository (currently other Git hosts are not supported).
> [!WARNING]
> Package also needs to be published to the NPM registry, because it is a source of crucial data for the directory.

- #### `npmPkg`

  **(string)** - npm package name, by default GitHub repository name will be used. Example: `"@expo/react-native-action-sheet"`.

> [!TIP]
> Fill `npmPkg` only when the GitHub repository name is different from the name of package published to npm, or the package is a part of monorepo.

- #### `examples`
  **(array of strings)** - URLs to example projects or Snacks which demonstrates the library.
- #### `images`

  **(array of strings)** - URLs to static images or GIFs that shows the library functionality.

> [!TIP]
> Please do not add logotypes or other branding materials to the `images` array, and please avoid linking multiple assets which shows the same feature.

#### 📱 Platforms

- #### `android`
  **(boolean)** - works on Android device.
- #### `ios`
  **(boolean)** - works on iOS device.
- #### `web`
  **(boolean)** - can be used with [`react-native-web`](https://github.com/necolas/react-native-web).

#### 🖥️ Out-of-tree Platforms

> [!IMPORTANT]
> Adding out-of-tree platforms support requires an example or link to the app which uses the library on the given platform.

- #### `windows`
  **(boolean)** - can be used with [`react-native-windows`](https://github.com/microsoft/react-native-windows).
- #### `macos`
  **(boolean)** - can be used with [`react-native-macos`](https://github.com/microsoft/react-native-macos).
- #### `tvos`
  **(boolean)** - can be used with [`react-native-tvos`](https://github.com/react-native-tvos/react-native-tvos).
- #### `visionos`
  **(boolean)** - can be used with [`react-native-visionos`](https://github.com/callstack/react-native-visionos).

#### ✅ Compatibility

- #### `expoGo`
  **(boolean)** - works with [Expo Go](https://docs.expo.dev/get-started/expo-go/) — an open-source sandbox app, without using [dev clients](https://docs.expo.dev/develop/development-builds/introduction/) or [prebuild](https://docs.expo.dev/workflow/continuous-native-generation/).
- #### `fireos`
  **(boolean)** - works on Amazon Fire OS.

> [!TIP]
> **Any** library can be used with Expo, if you use dev clients or prebuild.

#### 🏷️ Tags

- #### `unmaintained`
  **(boolean)** - signify that a library is no longer maintained. You can provide alternative or replacement libraries with the `alternatives` field, if needed.
- #### `dev`
  **(boolean)** - signify that a library is a development tool or is only a part of development process.
- #### `template`
  **(boolean)** - signify that a library is a new project template.
- #### `newArchitecture`
  **(boolean)** - signify that a library supports, or not, the New Architecture. Skipping the field will result in "untested" status, unless automatic support detection returned a result. You can provide additional context with the `newArchitectureNote` field, if needed.

> [!TIP]
> Set `newArchitecture` field only when automatic architecture detection fails for your package, despite it supports the New Architecture.

### 📝 Additional context for tags

- #### `newArchitectureNote`
  **(string)** - provide a note for the New Architecture support status, if a boolean `"true"` or `"false"` is not sufficient to describe the state of New Architecture support.

- #### `alternatives`
  **(array of strings)** - provide a list of alternatives to the library. eg: `["expo-camera", "react-native-vision-camera"]`. This is used to provide a list of alternatives to a library if it is unmaintained or does not support the New Architecture.

## How do I run my own version locally?

#### Prerequisites

- Node LTS

#### Commands

```sh
yarn && yarn start
```

You should be able to visit `localhost:3000` in your browser.

## How do I run `yarn data:update` with keys?

- Visit https://github.com/settings/developers to get your keys (don't worry about the callback URL, put whatever you want).
- Load the `GITHUB_TOKEN` environment variable into your shell.

This command creates site data in `./assets/data.json`

```sh
GITHUB_TOKEN=<*> yarn data:update
```

## How do I deploy to production?

Get a commit on `main` and it will be automatically deployed.

## I don't like your website, can I hit an API instead and build my own better stuff?

Sure, go for it!

```
https://reactnative.directory/api/libraries
```

- Returns a list of all libraries in `JSON` format.

<details>
  <summary><b>More details on API queries</b></summary>
  <br/>

  ```
  https://reactnative.directory/api/libraries?search=webgl
  ```
  
  - Returns a list of all libraries in `JSON` format that have the keyword `webgl`.
  
  ```
  https://reactnative.directory/api/libraries?search=webgl&expoGo=true
  ```
  
  - Returns a list of all libraries in `JSON` format that have the keyword `webgl` and work with Expo Go app.
  
  ```
  https://reactnative.directory/api/libraries?search=webgl&expoGo=true&android=true
  ```
  
  - Returns a list of all libraries in `JSON` format that have the keyword `webgl`, work with Expo Go app and Android.
  
  ```
  https://reactnative.directory/api/libraries?search=webgl&expoGo=true&android=true&isPopular=true
  ```
  
  - Returns a list of all libraries in `JSON` format that have the keyword `webgl`, work with Expo Go app, Android and are popular based on the scoring criterion.
  
  All the possible query parameters represents [`Query` type](https://github.com/react-native-community/directory/blob/main/types/index.ts#L14-L36).
</details>

## I don't like how you calculate scores.

- Submit a PR with changes to `scripts/calculate-score.js`.
- You have all the power! Tell us what you want.

## How do I deploy my own version of this?

- Site is hosted on Vercel, and this is the easiest way to do it.
- You can deploy your own with your own Vercel account
- You will need to provide `GITHUB_TOKEN` environment variable in your Vercel configuration.

```sh
# once environment variables are configured, install Vercel and deploy
npm i -g vercel
vercel
```
