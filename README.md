# Native Directory

This is the repository for the code that runs http://native.directory. Native Directory is a website where you can look up repositories that are compatible with React Native.

You are at the right place if:

- You made a repository on GitHub and you want the world to know it works with React Native.
- You want to submit a pull request to improve Native Directory.
- You want to report a bug or make a suggestion.

## Setup

You'll need the following on your computer to run this site locally

- Node 7.9.0+

To start the website in development mode, run:

```sh
npm install
npm run dev
```

## Update site data

To update data, you'll need to create a json file called `secrets.json` in the same folder as package.json. To get a GitHub client id and secret, you'll have to visit: https://github.com/settings/developers while logged in.

```json
{
  "GITHUB_CLIENT_ID": "YOUR CLIENT ID",
  "GITHUB_CLIENT_SECRET": "YOUR CLIENT SECRET"
}

```

Once you have completed this step, run:

```
npm run create-data
```

A new data set will be available in `build/data.json`.

## Deploy to production

The site is hosted on Heroku, only @jimmylee can run this command at the moment to deploy to native.directory. But if you have your own Heroku server you can deploy this website too.

```
git push heroku master
```
