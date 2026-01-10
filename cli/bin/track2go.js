#!/usr/bin/env node
import { program } from 'commander'
import { initRepo, addFile, add, commitFiles, push, pull, status } from '../commands/command.controller.js'

program
.name('track2go')
.description('Track2Go Version Control System')
.version('1.0.0')

program
.command('init')
.description('Initialize a new track2go repository')
.action(initRepo)

program
.command('add [targets...]')
.description('Add files to staging area')
.action((targets) => { add(targets) })

/*
| Syntax  | Meaning        |
| ------- | -------------- |
| `<msg>` | required value |
| `[msg]` | optional value |

-m               → short flag (optional)
--message        → long flag (canonical)
<msg>            → REQUIRED value

track2go commit -m "hello"
track2go commit --message "hello"
track2go commit --message=hello
 */
program
.command('commit')
.requiredOption('-m, --message <msg>', 'Commit Message')
.description('Add files to staging area')
.action((options) => commitFiles(options))

/* 
program
.command('push <remote> <branch>')
.description('Push commits to a remote branch')
.action((remote = 'origin', branch = 'main') => { push({ remote, branch }) }) 
 */
program
.command('push')
.description('Push commits to a remote branch')
.action(() => push())

program
.command('pull')
.description('Pull commits from remote branch')
.action(pull)

program
.command('status')
.description('Check status of working and staging against commits')
.action(status)

program.parse(process.argv);