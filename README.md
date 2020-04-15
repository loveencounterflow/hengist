
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
⦿ <strong>my-hengist/</strong>
⦿ <strong>.git/...</strong>
  package.json
  README.md
⦿ <strong>node_modules/...</strong>
  ———————————————————————————————
⦿ <strong>apps/</strong>
    ➡ ../path/to/my-project/
    ➡ ../other-path/to/that-other-project/
  ———————————————————————————————
⦿ <strong>my-project/</strong>
    package.json
    ⦿ <strong>node_modules/...</strong>
    ⦿ <strong>src/</strong>
      ⦿ <strong>benchmarks/</strong>
        main.coffee
        foobar.benchmark.coffee
      ⦿ <strong>tests/</strong>
        main.coffee
        arithmetic.test.coffee
      main.coffee
    ⦿ <strong>lib/</strong>
      main.js
      main.js.map
      ...
  ———————————————————————————————
⦿ <strong>that-other-project/</strong>
    package.json
    ⦿ <strong>node_modules/...</strong>
    ⦿ <strong>src/</strong>
      main.coffee
    ⦿ <strong>lib/</strong>
      main.js
      main.js.map
</pre>

<pre>trying to get <strong>bold</strong> text here</pre>

