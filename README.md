
# 𐌷𐌴𐌽𐌲𐌹𐍃𐍄

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

  - [Multi-App Dev (M.A.D.)](#multi-app-dev-mad)
  - [Hengist Layout](#hengist-layout)
- [To Do](#to-do)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# 𐌷𐌴𐌽𐌲𐌹𐍃𐍄

## Multi-App Dev (M.A.D.)

## Hengist Layout

* apps
* assets
* individual project folders (each with `src/` and `lib/`, if you're so inclined and transpile stuff, or any
  other structure deemed suitable)

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
│   │ assets                                              ║
│   │   ▸  ../path/to/some-data.file                      ║
│   │   ●  image.png                                      ║
│   │   ┌─────────────────────────────────────────────────────╖
│   │   │ my-project                                          ║
│   │   │   ●  huge-data.file                                 ║
│   │   ┌─────────────────────────────────────────────────────╖
│   │   │ that-other-project                                  ║
│   │   │   ●  another-huge-data.file                         ║
│   ┌─────────────────────────────────────────────────────╖
│   │ my-project                                          ║
│   │   ● package.json                                    ║
│   │   ┌─────────────────────────────────────────────────────╖
│   │   │ node_modules                                        ║
│   │   ┌─────────────────────────────────────────────────────╖
│   │   │ src                                                 ║
│   │   │   ● main.coffee                                     ║
│   │   │   ● foobar.benchmark.coffee                         ║
│   │   │   ● silly.benchmark.coffee                          ║
│   │   │   ● arithmetic.test.coffee                          ║
│   │   │   ● silly.test.coffee                               ║
│   │   ┌─────────────────────────────────────────────────────╖
│   │   │ lib                                                 ║
│   │   │   ● main.js                                         ║
│   │   │   ● main.js.map                                     ║
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


## Thoughts & Plans



## To Do


* **[–]** Update tree representation: local development under `dev/` (which is included in Hengist git repo);
  external stuff (for which Hengist only provides tests and/or benchmarks and/or demos, experiments) is
  symlinked under `apps/` (and not included in Hengist git repo).
* **[+]** Implement a `prepare-commit-msg` git hook that prepends each commit with the names of the
  sub-projects affected. This works by retrieving the relative paths of all staged files with `git diff
  --cached --name-only` and then looking for the nearest `package.json` file for each part.








