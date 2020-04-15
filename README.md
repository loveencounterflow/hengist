
# 𐌷𐌴𐌽𐌲𐌹𐍃𐍄

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Multi-App Dev (M.A.D.)](#multi-app-dev-mad)
- [App Layout](#app-layout)
- [Install Taskit](#install-taskit)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Multi-App Dev (M.A.D.)

## App Layout



<pre>
┌─────────────────────────────────────────────────────╖
│ my-hengist                                          ║
│   ● package.json                                    ║
│   ● README.md                                       ║
│   ┌─────────────────────────────────────────────────────╖
│   │ .git                                                ║
│   ┌─────────────────────────────────────────────────────╖
│   │ node_modules                                        ║
│   ┌─────────────────────────────────────────────────────╖
│   │ apps                                                ║
│   │   ▸  ../path/to/my-project                          ║
│   │   ▸  ../other-path/to/that-other-project            ║
│   ┌─────────────────────────────────────────────────────╖
│   │ my-project                                          ║
│   │   ● package.json                                    ║
│   │   ┌─────────────────────────────────────────────────────╖
│   │   │ node_modules                                        ║
│   │   ┌─────────────────────────────────────────────────────╖
│   │   │ src                                                 ║
│   │   │   ● main.coffee                                     ║
│   │   │   ┌─────────────────────────────────────────────────────╖
│   │   │   │ benchmarks                                          ║
│   │   │   │   ● main.coffee                                     ║
│   │   │   │   ● foobar.benchmark.coffee                         ║
│   │   │   ┌─────────────────────────────────────────────────────╖
│   │   │   │ tests                                               ║
│   │   │   │   ● main.coffee                                     ║
│   │   │   │   ● arithmetic.test.coffee                          ║
│   │   │   ┌─────────────────────────────────────────────────────╖
│   │   │   │ lib                                                 ║
│   │   │   │   ● main.js                                         ║
│   │   │   │   ● main.js.map                                     ║
│   │   │   │   ● ...                                             ║
│   ┌─────────────────────────────────────────────────────╖
│   │ that-other-project                                  ║
│   │   ● package.json                                    ║
│   │   ┌─────────────────────────────────────────────────────╖
│   │   │ node_modules                                        ║
│   │   ┌─────────────────────────────────────────────────────╖
│   │   │ src                                                 ║
│   │   │   ● main.coffee                                     ║
│   │   ┌─────────────────────────────────────────────────────╖
│   │   │ lib                                                 ║
│   │   │   ● main.js                                         ║
│   │   │   ● main.js.map                                     ║
</pre>

## Install Taskit

To run the tasks listed in `hengist/Taskfile`, install [Taskit](https://github.com/kjkuan/taskit):

```
curl https://raw.githubusercontent.com/kjkuan/taskit/1.0.0/taskit > /usr/local/bin/taskit && chmod +x /usr/local/bin/taskit
```

or

```
curl https://raw.githubusercontent.com/kjkuan/taskit/1.0.0/taskit > ~/bin/taskit && chmod +x ~/bin/taskit
```

Taskit tasks are just `bash` functions so they shoulkd be reasonably future-proof. Two examples:

```bash
# 🅘🅝🅣🅔🅡🅣🅔🅧🅣
# Runs `src/demo.coffee` to show output of some parsers arranged in tables
Task::intertext-parsers-demo () {
  : @desc "runs InterText Parsing Demo"
  nodexh intertext/lib/demo.js 2>&1 | less -SRN#5 +G; }

# 🅘🅝🅣🅔🅡🅣🅔🅧🅣
# Runs interim tests meant to assist in code refactoring
Task::intertext-interim-tests () {
  : @desc "runs InterText Interim Tests"
  nodexh intertext/lib/interim.tests.js; }
```

* type `taskit $taskname $key=$value` to run task `taskname` with argument `key` set to `value`,
  e.g. `taskit count-from-one to=10`
* type `taskit -t` to list all available tasks;
* type `taskit -h` for help;
* type `taskit -h $taskname` for help on `taskname`;




