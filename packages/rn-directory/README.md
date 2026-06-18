<h1 align="center">rn-directory</h1>
<p align="center">Propose new entries to <a href="https://reactnative.directory">React Native Directory</a> directly from your terminal.</p>
<dd align="center"><img align="center" width="720" alt="rn-directory" src="https://github.com/user-attachments/assets/9caa648b-b158-4443-a7f9-b6799d1eb443" /></dd>
<br/>

The `rn-directory` CLI gathers the required information manually or automatically, creates a fork, and opens a pull request on behalf of the user currently logged in to the GitHub CLI.

## Prerequisites

- [Bun](https://bun.sh/)
- [GitHub CLI](https://cli.github.com/)

## Usage

```sh
bunx rn-directory submit # manually enter package data
# OR
bunx rn-directory autoSubmit # create entry automatically for the package in current directory
```

## Development

```sh
bun install
bun link
```
