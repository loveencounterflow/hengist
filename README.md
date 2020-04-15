
# Hengist


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Multi-App Dev (M.A.D.)](#multi-app-dev-mad)
- [App Layout](#app-layout)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->



## Multi-App Dev (M.A.D.)

## App Layout



<pre>
┌─────────────────────────────────────────────────────┐
│ my-hengist/                                         │
│   package.json                                      │
│   README.md                                         │
│   ┌─────────────────────────────────────────────────────┐
│   │ .git/...                                            │
│   ┌─────────────────────────────────────────────────────┐
│   │ node_modules/...                                    │
│   ┌─────────────────────────────────────────────────────┐
│   │ apps/                                               │
│   │   -> ../path/to/my-project/                         │
│   │   -> ../other-path/to/that-other-project/           │
│   ┌─────────────────────────────────────────────────────┐
│   │ my-project/                                         │
│   │   package.json                                      │
│   │   ┌─────────────────────────────────────────────────────┐
│   │   │ node_modules/...                                    │
│   │   ┌─────────────────────────────────────────────────────┐
│   │   │ src/                                                │
│   │   │   main.coffee                                       │
│   │   │   ┌─────────────────────────────────────────────────────┐
│   │   │   │ benchmarks/                                         │
│   │   │   │   main.coffee                                       │
│   │   │   │   foobar.benchmark.coffee                           │
│   │   │   ┌─────────────────────────────────────────────────────┐
│   │   │   │ tests/                                              │
│   │   │   │   main.coffee                                       │
│   │   │   │   arithmetic.test.coffee                            │
│   │   │   ┌─────────────────────────────────────────────────────┐
│   │   │   │ lib/                                                │
│   │   │   │   main.js                                           │
│   │   │   │   main.js.map                                       │
│   │   │   │   ...                                               │
│   ┌─────────────────────────────────────────────────────┐
│   │ that-other-project/                                 │
│   │   package.json                                      │
│   │   ┌─────────────────────────────────────────────────────┐
│   │   │ node_modules/...                                    │
│   │   ┌─────────────────────────────────────────────────────┐
│   │   │ src/                                                │
│   │   │   main.coffee                                       │
│   │   ┌─────────────────────────────────────────────────────┐
│   │   │ lib/                                                │
│   │   │   main.js                                           │
│   │   │   main.js.map                                       │
</pre>


