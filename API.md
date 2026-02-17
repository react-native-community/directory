# React Native Directory API

This document describes the server-side JSON API exposed by the React Native Directory.

## Summary of available endpoints

- [`GET /api/libraries`](#get-apilibraries) - list and search libraries (paginated, sorted, filterable)
- [`POST /api/libraries/check`](#post-apilibrariescheck) - return metadata for a list of npm package names
- [`GET /api/libraries/statistic`](#get-apilibrariesstatistic) - aggregated statistics about the directory dataset
- [`GET /api/library`](#get-apilibrary) - lookup one or more libraries by npm package name (optionally `check` existence only)
- [`GET /api/proxy/npm-stat`](#get-apiproxynpm-stat) - proxy to https://npm-stat.com download counts API

## GET /api/libraries

Return a list of libraries from the dataset. Supports sorting, full-text search, pagination and many filters.

- Method: GET
- Path: `/api/libraries`
- Query parameters, all optional. The possible query parameters represents [`Query` type](https://github.com/react-native-community/directory/blob/main/types/index.ts#L22-L59):
  - `order` - sort key (available sorting keys: `updated`, `added`, `quality`, `popularity`, `downloads`, `issues`, `stars`, `relevance`, `size`, `dependencies`, `released`).
  - `direction` - `ascending` or `descending` (default: `descending`).
  - `search` - full-text search string (`relevance` sorting is used automatically when searching).
  - `owner` - filter by owner name.
  - `topic` - filter by topic or tag.
  - Platform support filters (booleans): `ios`, `android`, `web`, `windows`, `macos`, `expoGo`, `fireos`, `horizon`, `tvos`, `visionos`, `vegaos`.
  - Feature filters (booleans): `hasExample`, `hasImage`, `hasTypes`, `hasNativeCode`, `configPlugin`.
  - Quality filters (booleans): `isMaintained`, `isPopular`, `wasRecentlyUpdated`.
  - Architecture filters (booleans): `newArchitecture`, `expoModule`, `nitroModule`, `turboModule`.
  - Skip categories (booleans): `skipLibs`, `skipTools`, `skipTemplates`.
  - Numeric filters: `minPopularity`, `minMonthlyDownloads`.
  - `nightlyProgram` - boolean flag for Nightly Program participation.
  - `bookmarks` - when set, the server reads browser cookie bookmarks and returns only bookmarked libraries (see Notes below).
  - Pagination: `offset` (number, default `0`), `limit` (number, default `20`).

### Notes

- If `search` is provided and `order` is missing or equal to `relevance`, libraries are re-ranked by relevance.
- If `bookmarks` is set, the server uses the cookie stored bookmarks (from `req.headers.cookie`) to filter. Responses with `bookmarks` set are not cached publicly.

### Example

- GET `/api/libraries?search=image&order=downloads&direction=descending&limit=1`

  Response:

  ```json
  {
    "libraries": [
      {
        "githubUrl": "https://github.com/expo/expo/tree/main/packages/expo-image",
        "examples": ["https://docs.expo.dev/versions/latest/sdk/image/#usage"],
        "ios": true,
        "android": true,
        "web": true,
        "tvos": true,
        "expoGo": true,
        "fireos": true,
        "vegaos": "@amazon-devices/expo-image",
        "newArchitecture": true,
        "github": {
          "urls": {
            "repo": "https://github.com/expo/expo",
            "homepage": "https://docs.expo.dev/versions/latest/sdk/image/"
          },
          "stats": {
            "hasIssues": true,
            "hasWiki": true,
            "hasSponsorships": false,
            "hasDiscussions": true,
            "hasProjects": false,
            "hasVulnerabilityAlerts": true,
            "hasTopics": false,
            "updatedAt": "2026-01-27T20:02:58Z",
            "createdAt": "2016-08-15T17:14:25Z",
            "pushedAt": "2026-01-27T20:02:58Z",
            "forks": 10924,
            "issues": 335,
            "subscribers": 351,
            "stars": 47312,
            "dependencies": 1
          },
          "name": "expo-image",
          "fullName": "expo/expo",
          "isPrivate": false,
          "description": "A cross-platform, performant image component for React Native and Expo with Web support",
          "topics": [],
          "license": {
            "name": "MIT License",
            "url": "http://choosealicense.com/licenses/mit/",
            "id": "MDc6TGljZW5zZTEz",
            "key": "mit",
            "spdxId": "MIT"
          },
          "hasTypes": true,
          "newArchitecture": false,
          "isArchived": false,
          "hasReadme": true,
          "hasNativeCode": true,
          "configPlugin": true,
          "moduleType": "expo"
        },
        "npmPkg": "expo-image",
        "npm": {
          "downloads": 5883973,
          "weekDownloads": 1011061,
          "size": 839777,
          "versionsCount": 226,
          "latestRelease": "3.0.11",
          "latestReleaseDate": "2025-12-05T06:50:48.709Z",
          "hasReadme": true
        },
        "score": 90,
        "matchingScoreModifiers": [
          "Very popular",
          "Popular",
          "Known",
          "Recently updated",
          "Has a README file",
          "Has a description",
          "Has vulnerability alerts enabled",
          "Lots of open issues"
        ],
        "popularity": 0.146,
        "topicSearchString": "",
        "matchScore": 425
      }
    ],
    "total": 142
  }
  ```

---

## POST /api/libraries/check

Return compatibility metadata for a list of npm package names. This endpoint accepts a JSON body with an array of package names and responds with metadata for each package.

- Method: POST
- Path: `/api/libraries/check`
- Body parameters:
  - `packages` - array of npm package names (required).

### Notes

- The request body must be a valid JSON object with a `packages` field.
- The response includes metadata for each requested package, such as version, description, and repository URL.

### Example

- POST `/api/libraries/check` with body `{ "packages": ["react-native-reanimated"] }`

  Response:

  ```json
  {
    "react-native-reanimated": {
      "newArchitecture": "supported"
    }
  }
  ```

---

## GET /api/libraries/statistic

Return aggregated statistics about the library dataset, such as total counts of libraries, downloads, and other metrics.

- Method: GET
- Path: `/api/libraries/statistic`

### Example

- GET `/api/libraries/statistic`

  Response:

  ```json
  {
    "total": 2326,
    "newArchitecture": 1570,
    "downloads": 7380762848,
    "weekDownloads": 1391864468,
    "unmaintained": 797,
    "withTypes": 1626,
    "withNativeCode": 1123,
    "withConfigPlugin": 243,
    "ios": 2199,
    "android": 2188,
    "web": 506,
    "expoGo": 972,
    "windows": 67,
    "macos": 44,
    "fireos": 216,
    "horizon": 3,
    "tvos": 100,
    "visionos": 32,
    "vegaos": 55
  }
  ```

---

## GET /api/library

Lookup one or more libraries by npm package name. Endpoint can optionally perform a quick `check` to return existence flag only.

- Method: GET
- Path: `/api/library`
- Query parameters:
  - `name` - npm package name (required).
  - `check` - boolean flag to return existence information only, without full library data.

### Notes

- If `check` is `true`, the response includes only information about existence for the specified package(s).
- If `check` is `false` or not provided, the response includes full library data.

### Example

- GET `/api/library?name=uniwind`

  Response:

  ```json
  {
    "uniwind": {
      "githubUrl": "https://github.com/uni-stack/uniwind/tree/main/packages/uniwind",
      "examples": [
        "https://github.com/uni-stack/uniwind/tree/main/apps/expo-router",
        "https://github.com/uni-stack/uniwind/tree/main/apps/expo-example",
        "https://github.com/uni-stack/uniwind/tree/main/apps/bare"
      ],
      "ios": true,
      "android": true,
      "web": true,
      "expoGo": true,
      "newArchitecture": true,
      "github": {
        "urls": {
          "repo": "https://github.com/uni-stack/uniwind",
          "homepage": "https://uniwind.dev"
        },
        "stats": {
          "hasIssues": true,
          "hasWiki": false,
          "hasSponsorships": false,
          "hasDiscussions": true,
          "hasProjects": true,
          "hasVulnerabilityAlerts": true,
          "hasTopics": true,
          "updatedAt": "2026-02-16T06:41:45Z",
          "createdAt": "2025-07-29T08:10:42Z",
          "pushedAt": "2026-02-16T06:41:45Z",
          "forks": 25,
          "issues": 2,
          "subscribers": 6,
          "stars": 1323,
          "dependencies": 4
        },
        "name": "uniwind",
        "fullName": "uni-stack/uniwind",
        "isPrivate": false,
        "description": "The fastest Tailwind bindings for React Native",
        "topics": ["unistyles", "tailwind", "tailwindcss", "theme", "style"],
        "license": {
          "name": "MIT License",
          "url": "http://choosealicense.com/licenses/mit/",
          "id": "MDc6TGljZW5zZTEz",
          "key": "mit",
          "spdxId": "MIT"
        },
        "hasTypes": false,
        "newArchitecture": false,
        "isArchived": false,
        "hasReadme": true,
        "hasNativeCode": false,
        "configPlugin": false
      },
      "npmPkg": "uniwind",
      "npm": {
        "downloads": 196697,
        "weekDownloads": 28489,
        "size": 635831,
        "versionsCount": 42,
        "latestRelease": "1.3.1",
        "latestReleaseDate": "2026-02-13T10:35:54.904Z",
        "hasReadme": true
      },
      "score": 60,
      "matchingScoreModifiers": [
        "Popular",
        "Known",
        "Recently updated",
        "Has a README file",
        "Has a description",
        "Has vulnerability alerts enabled"
      ],
      "popularity": 0.123,
      "topicSearchString": "unistyles tailwind tailwindcss theme style"
    }
  }
  ```

- GET `/api/library?name=react&check=true`

  Response:

  ```json
  {
    "uniwind": true
  }
  ```

---

## GET /api/proxy/npm-stat

Proxy to npm-stat.com to fetch download counts for the last month. This endpoint is a simple proxy and does not perform any data processing.

- Method: GET
- Path: `/api/proxy/npm-stat`
- Query parameters:
  - `name` - npm package name (required).

### Notes

- It is subject to the same CORS and rate limiting policies as the original npm-stat.com.

### Example

- GET `/api/proxy/npm-stat?name=react`

  Response:

  ```json
  {
    "react-native": {
      "2026-01-18": 319495,
      "2026-01-19": 693157,
      "2026-01-20": 810833,
      "2026-01-21": 837204,
      "2026-01-22": 845437,
      "2026-01-23": 777158,
      "2026-01-24": 378434,
      "2026-01-25": 339869,
      "2026-01-26": 813923,
      "2026-01-27": 888545,
      "2026-01-28": 877008,
      "2026-01-29": 880932,
      "2026-01-30": 855686,
      "2026-01-31": 390039,
      "2026-02-01": 380828,
      "2026-02-02": 853673,
      "2026-02-03": 898431,
      "2026-02-04": 911421,
      "2026-02-05": 935844,
      "2026-02-06": 879993,
      "2026-02-07": 417938,
      "2026-02-08": 403069,
      "2026-02-09": 891276,
      "2026-02-10": 969193,
      "2026-02-11": 942355,
      "2026-02-12": 939358,
      "2026-02-13": 834084,
      "2026-02-14": 390313,
      "2026-02-15": 403198,
      "2026-02-16": 771778
    }
  }
  ```
