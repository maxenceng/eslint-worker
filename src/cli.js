#!/usr/bin/env node

import yargs from 'yargs'
import execute from './execute'

/* eslint-disable no-unused-expressions */
yargs
  .command(
    ['*'],
    'ESLint worker',
    () => {},
    async (argv) => {
      const exitCode = await execute(argv)
      process.exit(exitCode)
    },
  )
  .help().argv
