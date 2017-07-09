# Native Directory

Native Directory is a website where you can see all of the libraries that are compatible with React Native.

Visit https://www.native.directory/ to check it out.

You are at the right place if:

- You made a repository on GitHub and you want the world to know it works with React Native.
- You want to submit a pull request to improve Native Directory.
- You want to report a bug or make a suggestion.

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
* You can deploy your own.

```sh
git push heroku master
```
