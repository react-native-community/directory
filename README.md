# React Native Directory

React Native Directory is a website where you can see all of the libraries that are compatible with React Native.

> Note: A transition in progress from https://native.directory to https://reactnative.directory, so the following links may not work for you yet!

Website: https://reactnative.directory/

## How do I know I'm at the right place?

- You made a repository on GitHub and you want the world to know it works with React Native.
- You want to submit a pull request to improve React Native Directory.
- You want to report a bug or make a suggestion.

## I don't like your website, can I hit an API instead and build my own better stuff?

Sure, go for it!

`https://reactnative.directory/api/libraries`

- Returns a list of all libraries in `JSON` format.

`https://reactnative.directory?search=webgl`

- Returns a list of all libraries in `JSON` format that have the keyword `webgl`.

`https://reactnative.directory?search=webgl&expo=true`

- Returns a list of all libraries in `JSON` format that have the keyword `webgl` and work with Expo managed.

`https://reactnative.directory?search=webgl&expo=true&android=true`

- Returns a list of all libraries in `JSON` format that have the keyword `webgl` and work with Expo managed and Android.

## I don't like how you calculate health scores.

- Submit a PR with changes to `scripts/calculate-score.js`.
- You have all the power! Tell us what you want.

## How do I add a library?

- Add it to `react-native-libraries.json`.
- Submit a PR.

Please follow this format and indentation:

```json
{
  "githubUrl": "<THE GITHUB URL>",
  "ios": false,
  "android": false,
  "web": false,
  "expo": false,
  "windows": false,
  "examples": ["<THE URL TO REPO>"],
  "npmPkg": "<NPM PACKAGE NAME>",
  "unmaintained": false,
},
```

- `ios` - works on iOS phones.
- `android` - works on Android phones.
- `web` - can be used in the browser.
- `expo` - can be used in managed workflow, without ejecting an Expo application (any library can be used if you eject).
- `windows` - can be used on Windows.
- `examples` - optional array of URLs (snacks preferred) with demonstrations of the library.
- `npmPkg` - optional string of the package's display name.
- `unmaintained` - optional boolean to signify that a library is or is not maintained.

> _Note:_ If your package is within a monorepo on GitHub, eg: https://github.com/expo/expo/blob/master/packages/expo-web-browser, then the name, description, homepage, and topics (keywords) will be extracted from package.json for that subrepo. GitHub stats will be based on the monorepo, because there isn't really another option.

## How do I run my own version locally?

Prerequisites

- Node LTS

Commands

##### With npm

```sh
npm install
npm start
```

##### With yarn

```sh
yarn
yarn start
```

You should be able to visit `localhost:3000` in your browser.

## How do I run `npm run data:update` with keys?

- To update site data you need to provide a couple of keys in a file called `secrets.json`.
- You must create your own `secrets.json` in the root directory of the repo.
- Visit https://github.com/settings/developers to get your keys (don't worry about the callback URL, put whatever you want).

```json
{
  "GITHUB_CLIENT_ID": "YOUR CLIENT ID",
  "GITHUB_CLIENT_SECRET": "YOUR CLIENT SECRET"
}
```

This command creates site data in `./assets/data.json`

```
npm run data:update
```

## How do I deploy my own version of this?

- Site is hosted on Now, and this is the easiest way to do it.
- You can deploy your own with your own Now account

```sh
npm i -g now
# log in if you need to
now
```

## How do I deploy to production?

Get a commit on master and it will be automatically deployed.
