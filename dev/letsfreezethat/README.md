

# Let's Freeze That!

[LetsFreezeThat](https://github.com/loveencounterflow/letsfreezethat) is an unapologetically minimal library
to make working with immutable objects in JavaScript less of a chore.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Notes](#notes)
- [Implementation](#implementation)
- [Benchmarks](#benchmarks)
- [Other Libraries, or: Should I COW?](#other-libraries-or-should-i-cow)
  - [mori](#mori)
- [To Do](#to-do)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Notes

* LFT does not copy objects on explicit or implicit `freeze()`. That should be fine for most use cases since
  what one usually wants to do is either create or thaw a given value (which implies making a copy),
  manipulate (i.e. mutate) it, and then freeze it prior to passing it on. As long as manipulations are local
  to a not-too-long single function, chances of screwing up are limited, so we can safely forgo the added
  overhead of making an additional copy when either `freeze()` is called or a call to `lets d, ( d ) -> ...`
  has finished.

* LFT comes in two configurable flavors: `LFT = ( require 'letsfreezethat' ).new { freeze: true, }` (which
  is the same as `LFT = require 'letsfreezethat'`) and `LFT = ( require 'letsfreezethat' ).new { freeze:
  false, }` which forgoes freezing (but not copying).

* The non-freezing configuration is a tad faster on `thaw()` and ≈5 times faster on `freeze()`.

* The `thaw()` method will always make a copy even when `{ freeze: false, }` is given; otherwise it is
  hardly conceivable how an application could switch from the slower `{ freeze: true, }` configuration to
  the faster `{ freeze: false, }` without breaking.

* In the case a list or an object originates from the outside and other places might still hold references
  to that value or one of its properties, one can use `thaw()` to make sure any mutations will not be
  visible from the outside. In this regard, `thaw()` could have been called `deep_copy()`.

# Implementation

The improvements seen when going from LetsFreezeThat v2 to v3 are almost entirely due to the code used by
the [klona](https://github.com/lukeed/klona) library, specifically its
[JSON](https://github.com/lukeed/klona/blob/master/src/json.js) module. The code is simple, straightforward,
and fast—mostly because it's a well-written piece that does something very specific, name only concerning
itself with (JSON, JS) objects and arrays.

LetsFreezeThat has a similar focus and forgoes freezing RegExps, Dates, Int32Arrays or anything but plain
objects and lists, so that's a perfect fit. I totally just copied the code of the linked module to avoid the
dependency on whatever else it is that klona has in store (it's a lot got check it out).

# Benchmarks

The code that produced the below benchmarks is available in
[𐌷𐌴𐌽𐌲𐌹𐍃𐍄](https://github.com/loveencounterflow/hengist/tree/master/dev/letsfreezethat/src) (which is my
workbench of sorts to develop, test and benchmark my software). In each case, thousands of small-ish JS objects
were frozen, manipulated, and thawed, as the case may be, using a number of approaches and a number of
software packages.

`letsfreezethat_v{2|3}_f{0|1}` is to be read as: '`letsfreezethat` using { legacy v2.2.5 | code for upcoming
v3 in the present state } with freezing turned { off | on }'.

Absolute numbers are cycles per second (Hz) where mulling through the tasks for a single object is counted
as one cycle, and the number and nature of tasks is identical for all libraries tested, as far as possible.
To obtain a baseline for comparison, JavaScript's `Object.freeze()` have been used for freezing and
`Object.assign()` for thawing, but keep in mind that both methods are shallow in the sense that neither
method would affect the nested list in a value like `{ x: [ 1, 2, 3, ], }`. LetsFreezeThat does do deep
freezing and deep thawing, though (and some of the other libraries do so too; others don't), so the
comparison is slightly in favor of JavaScript native methods (because they get as much credit for each cycle
although less gets done).

One would fully expect JS native methods to be always on top of the scores but this is not the case. For one
thing `letsfreezethat.nofreeze.freeze()` does not actually do anything, its literally just the `id()`
function: `nofreeze_lets.freeze = ( me ) -> me`, bam. Deep freezing without the part where you deep-freeze
is indeed faster than shallow freezing, of course. Also, although care has been taken to run garbage
collection explicitly and to perform any computation that is external to each test such that it does not
affect the timings, there's always an observable and, sadly, unavoidable jitter in performance which can add
up to as much as 10 or even 20 per cent of the figures shown. Each test case has been run with hundreds or
thousands of values and a few (3 to 5) repeated runs, some of them in shuffled order, to minimize such
effects. I hope to provide error bars in future editions but for now please understand that `100,00Hz` means
something close to `between 80,000Hz and 120,000Hz` and `50%` is really `maybe something around 40% to 60%`
of the best performing solution.


```
# hengist/dev/letsfreezethat/src/lft-deepfreeze.benchmarks.coffee

  thaw_____shallow_native                          829,171 Hz   100.0 % │████████████▌│
  thaw_____klona                                   347,483 Hz    41.9 % │█████▎       │
█ thaw_____letsfreezethat_v3_f0                    330,089 Hz    39.8 % │█████        │
█ thaw_____letsfreezethat_v3_f1                    242,111 Hz    29.2 % │███▋         │
  thaw_____fast_copy                               176,418 Hz    21.3 % │██▋          │
  thaw_____letsfreezethat_v2                        93,441 Hz    11.3 % │█▍           │
  thaw_____deepfreezer                              50,249 Hz     6.1 % │▊            │
  thaw_____deepcopy                                 31,608 Hz     3.8 % │▌            │
  thaw_____fast_copy_strict                         17,539 Hz     2.1 % │▎            │
———————————————————————————————————————————————————————————————————————————————————————————
█ freeze___letsfreezethat_v3_f0                    745,781 Hz    89.9 % │███████████▎ │
  freeze___shallow_native                          665,340 Hz    80.2 % │██████████   │
█ freeze___letsfreezethat_v3_f1                    201,651 Hz    24.3 % │███          │
  freeze___letsfreezethat_v2                        70,091 Hz     8.5 % │█            │
  freeze___deepfreeze                               59,320 Hz     7.2 % │▉            │
  freeze___deepfreezer                              37,352 Hz     4.5 % │▋            │
```

```
# hengist/dev/letsfreezethat/src/usecase1.benchmarks.coffee

  plainjs_mutable                                    8,268 Hz   100.0 % │████████████▌│
  plainjs_immutable                                  4,933 Hz    59.7 % │███████▌     │
█ letsfreezethat_v3_thaw_freeze_f0                   4,682 Hz    56.6 % │███████▏     │
  letsfreezethat_v2_standard                         4,464 Hz    54.0 % │██████▊      │
█ letsfreezethat_v3_lets_f0                          4,444 Hz    53.8 % │██████▊      │
█ letsfreezethat_v3_lets_f1                          4,213 Hz    51.0 % │██████▍      │
█ letsfreezethat_v3_thaw_freeze_f1                   4,034 Hz    48.8 % │██████▏      │
  letsfreezethat_v2_nofreeze                         2,143 Hz    25.9 % │███▎         │
  immutable                                          1,852 Hz    22.4 % │██▊          │
  mori                                               1,779 Hz    21.5 % │██▊          │
  hamt                                               1,752 Hz    21.2 % │██▋          │
  immer                                              1,352 Hz    16.3 % │██           │
```

```
# hengist/dev/letsfreezethat/src/main.benchmarks.coffee

█ letsfreezethat_v3_f0_freezethaw                  116,513 Hz   100.0 % │████████████▌│
█ letsfreezethat_v3_f1_freezethaw                   97,101 Hz    83.3 % │██████████▍  │
█ letsfreezethat_v3_f0_lets                         93,101 Hz    79.9 % │██████████   │
█ letsfreezethat_v3_f1_lets                         76,045 Hz    65.3 % │████████▏    │
  plainjs_mutable                                   28,035 Hz    24.1 % │███          │
  letsfreezethat_v2_f0_lets                         22,410 Hz    19.2 % │██▍          │
  letsfreezethat_v2_f0_freezethaw                   16,854 Hz    14.5 % │█▊           │
  letsfreezethat_v2_f1_freezethaw                   16,443 Hz    14.1 % │█▊           │
  letsfreezethat_v2_f1_lets                         13,648 Hz    11.7 % │█▌           │
  immutable                                          8,359 Hz     7.2 % │▉            │
  mori                                               7,845 Hz     6.7 % │▉            │
  hamt                                               7,449 Hz     6.4 % │▊            │
  immer                                              4,943 Hz     4.2 % │▌            │
```

# Other Libraries, or: Should I COW?

During the implementation of LetsFreezeThat I realized there's quite a few packages available that do
immutability in JavaScript, e.g.

* [HAMT](https://github.com/mattbierner/hamt)
* [mori](https://swannodette.github.io/mori/)
* [immutable.js](https://immutable-js.github.io/immutable-js/)

and, last but not least,

* [immer](https://immerjs.github.io/immer/docs/introduction).




## mori

* [mori](https://swannodette.github.io/mori/) ([also on GitHub](https://github.com/swannodette/mori))

* API is a bit un-JS but does provide some interesting functionality

* cannot initialize from plain JS object, only from sequence of key/value pairs; when doing so, must
  explicitly take care of nested objects and lists


# To Do

* [ ] preserve symbol attributes when freezing
* [ ] consider to offer an implementation of HAMT
  (https://blog.mattbierner.com/persistent-hash-tries-in-javavascript/, https://github.com/mattbierner/hamt,
  https://github.com/mattbierner/hamt_plus (? https://github.com/mattbierner/hashtrie)) for the frequent use
  case of immutable maps

