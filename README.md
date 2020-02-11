# React Native Directory

React Native Directory is a website where you can see all of the libraries that are compatible with React Native.

Website: https://www.native.directory/

## How do I know I'm at the right place?

- You made a repository on GitHub and you want the world to know it works with React Native.
- You want to submit a pull request to improve React Native Directory.
- You want to report a bug or make a suggestion.

## I don't like your website, can I hit an API instead and build my own better stuff?

Yeah of course:

`https://native.directory?json=true`
- Returns a list of all libraries in `JSON` format.

`https://native.directory?json=true&search=webgl`
- Returns a list of all libraries in `JSON` format that have the keyword `webgl`.

`https://native.directory?json=true&search=webgl&expo=true`
- Returns a list of all libraries in `JSON` format that have the keyword `webgl` and work with `expo`.

`https://native.directory?json=true&search=webgl&expo=true&android=true`
- Returns a list of all libraries in `JSON` format that have the keyword `webgl` and work with `expo` and `android`.

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
  "expo": false
},
```

* `ios` - works on iOS phones.
* `android` - works on Android phones.
* `web` - can be used in the browser.
* `expo` - can be used without detaching an Expo application.
* `examples` - optional array of URLs (snacks preferred) with demonstrations of the library 

> *Note:* If your package is within a monorepo on GitHub, eg: https://github.com/expo/expo/blob/master/packages/expo-web-browser, then the name, description, homepage, and topics (keywords) will be extracted from package.json for that subrepo. GitHub stats will be based on the monorepo, because there isn't really another option.

## How do I run my own version locally?

Prerequisites

- Node 10.7.0

Commands

##### With npm

```sh
npm install
npm run dev
```

##### With yarn

```sh
yarn add
yarn dev
```

You should be able to visit `localhost:8000` in your browser.

## How do I run `npm run create-data` with keys?

* To update site data you need to provide a couple of keys in a file called `secrets.json`.
* You must create your own `secrets.json` in the root directory of the repo.
* Visit https://github.com/settings/developers to get your keys.

```json
{
  "GITHUB_CLIENT_ID": "YOUR CLIENT ID",
  "GITHUB_CLIENT_SECRET": "YOUR CLIENT SECRET"
}

```

This command creates site data in `./build/data.json`

```
npm run create-data
```

## How do I deploy my own to production?

* Site is hosted on Heroku.
* You can deploy your own with your own heroku account and remote.

```sh
heroku login
heroku git:remote -a next-expo
git push heroku master
```
