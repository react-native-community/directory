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

## How do I add a library?

- Add it at the end of `react-native-libraries.json` file.
- Submit a PR.

> **Note** Please follow format, fields order and indentation as seen below, skip any of the `false` values and do not fill optional fields, unless it's necessary.

```json
{
  "githubUrl": "<GITHUB REPOSITORY URL>",
  "npmPkg": "<OPTIONAL NPM PACKAGE NAME>",
  "nameOverride": "<OPTIONAL PACKAGE DISPLAY NAME>",
  "examples": [
    "<THE URL TO REPO>",
    "<THE URL TO A SNACK>"
  ],
  "images": ["<PUBLIC URL TO RELATED IMAGE>"],
  "ios": false,
  "android": false,
  "web": false,
  "expo": false,
  "windows": false,
  "macos": false,
  "tvos": false,
  "unmaintained": false,
  "dev": false,
  "template": false,
  "newArchitecture": false
}
```

### Library fields description

#### ⚙️ General

- #### ❗ `githubUrl` **(required)**
  **(string)** - URL to the package GitHub repository (currently other Git hosts are not supported).

  > Package also needs to be published to the NPM registry, because it is a source of crucial data for the directory.
- #### `npmPkg`
  **(string)** - npm package name, by default GitHub repository name will be used. Example: `"@expo/react-native-action-sheet"`.

  > Fill only when the GitHub repository name is different from the name of package published to npm, or the package is a part of monorepo.
- #### `nameOverride`
  **(string)** - display name override.

  > Fill only when it is different from the GitHub repository name and npm package name.
- #### `examples`
  **(array of strings)** - URLs to example projects or Snacks which demonstrates the library.
- #### `images`
  **(array of strings)** - URLs to static images or GIFs that shows the library functionality.

  > Please do not add logotypes or other branding material, and please avoid linking multiple resources which shows the same feature.

#### 📱 Platforms

- #### `android`
  **(boolean)** - works on Android device.
- #### `ios`
  **(boolean)** - works on iOS device.
- #### `web`
  **(boolean)** - can be used with [`react-native-web`](https://github.com/necolas/react-native-web).
- #### `expo`
  **(boolean)** - can be used in managed workflow, without ejecting an [Expo](https://github.com/expo/expo) application (any library can be used if you eject).

#### 🖥️ Out-of-tree Platforms

> **Note** Adding out-of-tree platforms support requires an example or link to the app which uses the library on the given platform.

- #### `windows`
  **(boolean)** - can be used with [`react-native-windows`](https://github.com/microsoft/react-native-windows).
- #### `macos`
  **(boolean)** - can be used with [`react-native-macos`](https://github.com/microsoft/react-native-macos).
- #### `tvos`
  **(boolean)** - can be used with [`react-native-tvos`](https://github.com/react-native-tvos/react-native-tvos).

#### 🏷️ Tags

- #### `unmaintained`
  **(boolean)** - signify that a library is no longer maintained.
- #### `dev`
  **(boolean)** - signify that a library is a development tool or is only a part of development process.
- #### `template`
  **(boolean)** - signify that a library is a new project template.
- #### `newArchitecture`
  **(boolean)** - signify that a library supports the new architecture

---

> **Note** If your package is within a monorepo on GitHub, eg: https://github.com/expo/expo/tree/main/packages/expo-web-browser,
> then the name, description, homepage, and topics (keywords) will be extracted from `package.json` for that subrepo.
> GitHub stats will be based on the monorepo, because there isn't really another option.

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

`https://reactnative.directory/api/libraries`

- Returns a list of all libraries in `JSON` format.

`https://reactnative.directory/api/libraries?search=webgl`

- Returns a list of all libraries in `JSON` format that have the keyword `webgl`.

`https://reactnative.directory/api/libraries?search=webgl&expo=true`

- Returns a list of all libraries in `JSON` format that have the keyword `webgl` and work with Expo managed.

`https://reactnative.directory/api/libraries?search=webgl&expo=true&android=true`

- Returns a list of all libraries in `JSON` format that have the keyword `webgl` and work with Expo managed and Android.

`https://reactnative.directory/api/libraries?search=webgl&expo=true&android=true&isPopular=true`

- Returns a list of all libraries in `JSON` format that have the keyword `webgl`, work with Expo managed and Android and are popular based on the scoring criterion.

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
