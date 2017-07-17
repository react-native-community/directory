# Native Directory

Native Directory is a website where you can see all of the libraries that are compatible with React Native.

Visit https://www.native.directory/ to check it out.

You are at the right place if:

- You made a repository on GitHub and you want the world to know it works with React Native.
- You want to submit a pull request to improve Native Directory.
- You want to report a bug or make a suggestion.

## I don't like how you guys calculate the health score

- Submit a PR with changes to `scripts/calculate-score.js`.
- We want the community to decide this! Please let us know what you want.

## How to add a library

Add it to `react-native-libraries.json`. Send us a PR.

Your JSON object should look something like this.
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

## Setup and run locally

Prerequisites

- Node 7.9.0+

Commands

```sh
npm install
npm run dev
```

You should be able to visit `localhost:8000` in your browser.

## Update site data

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

## Deploy to production

* Site is hosted on Heroku.
* Only @jimmylee (and maybe @brentvatne) can deploy to https://www.native.directory/
* You can deploy your own with your own heroku account and remote.

```sh
heroku login
heroku git:remote -a next-expo
git push heroku master
```
