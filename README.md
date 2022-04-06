# eslint-worker - ESLint powered with Jest Workers [![npm version](https://img.shields.io/npm/v/eslint-worker)](https://www.npmjs.com/package/eslint-worker)

ESLint uses Jest Workers to parallelize file linting in order to speed up the process

## Configuration

In order to use eslint-worker, first place an `.eslintworkerrc` file in the root directory your project. The `.eslintworkerrc` file describes which paths to lint and which paths to ignore.
A sample `.eslintworkerrc` file:

```json
{
  "fileTypes": ["js", "ts", "html"],
  "ignoredFolders": ["node_modules", ".git", ".idea", "dist"],
  "ignoredFiles": [".model.js"]
}
```

Options:

|         Name         |       Type        | Description                                                                         |
|:--------------------:|:-----------------:|:------------------------------------------------------------------------------------|
|    **`folders`**     | `{Array<String>}` | Glob-style paths for paths to include when linting (default: ["."])                 |
|   **`fileTypes`**    | `{Array<String>}` | Glob-style paths for file types to include when linting (default: every file types) |
| **`ignoredFolders`** | `{Array<String>}` | Glob-style paths to ignore (default: [])                                            |
|  **`ignoredFiles`**  | `{Array<String>}` | Glob-style files to ignore (default: [])                                            |
| **`enableThreads`**  |    `{Boolean}`    | Choose whether you want to enable jest-worker threads or not (default: true)        |

## Usage

### Default mode

To run eslint-worker, use the following command anywhere in your project:

```
eslint-worker
```

### CLI Options

#### Specify workers

By default, eslint-worker will split up linting duties across all CPUs in your machine. You can manually override this via the cli with the following argument

```
eslint-worker --workers [num_workers]
```

#### Auto fix

To use the ESLint auto fix feature, add `--fix` when starting the server

```
eslint-worker --fix
```

### Verbose

Displays which files each worker lints and when they have finished their job. Use the `--verbose` flag as such

```
eslint-worker --verbose
```
