<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Let's Freeze That!](#lets-freeze-that)
- [Notes](#notes)
- [To Do](#to-do)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


# Let's Freeze That!

[LetsFreezeThat](https://github.com/loveencounterflow/letsfreezethat) is an unapologetically minimal library
to make working with immutable objects in JavaScript less of a chore.

# Notes

* LFT does not copy objects on explicit or implicit `freeze()`. That should be fine for most use cases since
  what one usually wants to do is either create or thaw a given value (which implies making a copy),
  manipulate (i.e. mutate) it, and then freeze it prior to passing it on. As long as manipulations are local
  to a not-too-long single function, chances of screwing up are limited, so we can safely forgo the added
  overhead of making an additional copy when either `freeze()` is called or a call to `lets d, ( d ) -> ...`
  has finished.

* with `{ copy: false, }` the `thaw()` method will still make a copy if value is frozen

# To Do

* [ ] preserve symbol attributes when freezing
* [ ] consider to offer an implementation of HAMT
  (https://blog.mattbierner.com/persistent-hash-tries-in-javavascript/, https://github.com/mattbierner/hamt,
  https://github.com/mattbierner/hamt_plus (? https://github.com/mattbierner/hashtrie)) for the frequent use
  case of immutable maps

