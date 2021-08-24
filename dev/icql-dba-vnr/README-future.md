# Future of VNR, Datom, Hollerith, Hollerith-Codec, ICQL-DBA-VNR



<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Packages mentioned](#packages-mentioned)
- [The Plan](#the-plan)
  - [Retire `hollerith`](#retire-hollerith)
  - [Retire `hollerith-codec`](#retire-hollerith-codec)
  - [Init New Major Version of `hollerith`](#init-new-major-version-of-hollerith)
  - [Re-Publish `icql-dba-vnr` as `icql-dba-hollerith`](#re-publish-icql-dba-vnr-as-icql-dba-hollerith)
- [Benchmarks](#benchmarks)
- [Related](#related)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->






## Packages mentioned


* [`hollerith`](https://github.com/loveencounterflow/hollerith), which

  * supports an EAV-like 'single/big table' 'phrase' DB for use with key/value stores like LevelDB; these
    efforts have been scrapped in favor of Relational DBs and SQL. The fundamental idea here was that one
    could order values by encoding them using lists of scalar values; to provide the binary representation
    of such lists,

  * [`hollerith-codec`](https://github.com/loveencounterflow/hollerith-codec) was implemented after , which
    contains the much faster, more restricted [`hollerith-codec/tng`
    version](https://github.com/loveencounterflow/hollerith-codec/blob/master/src/tng.coffee)

* [`datom`](https://github.com/loveencounterflow/datom), which contains

  * [`vnr` submodule](https://github.com/loveencounterflow/datom/blob/master/src/vnr.coffee), which defines

    * `class Vnr`

    * does not use binary encoding for sorting but a JS `cmp a, b` method (which will presently not work in
      SQLite)

* [`icql-dba-vnr`](https://github.com/loveencounterflow/icql-dba-vnr)

  * defines tables and indices to work with VNRs in SQLite

  * VNR methods inherited from `datom/lib/vnr#Vnr`

  * uses `hollerith-codec/tng` for fast indexing BLOBs

## The Plan

### Retire `hollerith`

* Its primary use case (EAV-style DBs) has been given up in favor of relation DBs and SQL
* [+] rename `hollerith` to `hollerith-legacy`
* [+] publish a salutory `hollerith` version (1.2.6) on npm that *includes the new repo URL*,
  https://github.com/loveencounterflow/hollerith-legacy
* address https://github.com/loveencounterflow/hollerith is now free for re-use
* <del>move relevant tests, benchmarks from `hengist/dev/hollerith` to `hengist/dev/hollerith-legacy`</del>
* [+] rename `hengist/dev/hollerith-codec` to `hengist/dev/hollerith`

### Retire `hollerith-codec`

* code to be integrated into new `hollerith`
* [–] rename `hollerith-codec` to `hollerith-codec-legacy`
* [–] publish a salutory `hollerith-codec` version on npm that *includes the new repo URL*,
* [–] move relevant tests, benchmarks from `hengist/dev/hollerith-codec` to `hengist/dev/hollerith-codec-legacy`

### Init New Major Version of `hollerith`

* [–] move code from `datom/src/vnr` to `hollerith`
* [–] publish new major version of `datom` to reflect breaking change
* [–] move code from `hollerith-codec-legacy` to `hollerith`
* [–] rewrite relevant tests, benchmarks, demos in `hengist/dev/hollerith` based on existing code
* [–] publish initial version of `hollerith`

### Re-Publish `icql-dba-vnr` as `icql-dba-hollerith`

* [–] deprecate `icql-dba-vnr`
* [–] copy code, history to `icql-dba-hollerith`
* [–] relocate relevant test, benchmarks, demos in `hengist`
* [–] adapt `icql-dba-hollerith` to replace dependency on `hollerith-codec`, `datom/lib/vnr` with dependency
  on `hollerith`

## Benchmarks


```
hollerith_tng       0.236 s    300,000 items     1,269,827⏶Hz             788⏷nspc
hollerith_bcd       2.567 s    300,000 items       116,873⏶Hz           8,556⏷nspc
hollerith_classic   7.302 s    300,000 items        41,087⏶Hz          24,339⏷nspc
charwise            9.924 s    300,000 items        30,231⏶Hz          33,079⏷nspc
bytewise           15.028 s    300,000 items        19,963⏶Hz          50,092⏷nspc
03:05 HENGIST/BENCHMARKS  ▶  hollerith_tng       1,141,367  Hz ≙ 1 ÷ 1.0    100.0 % │████████████▌│
03:05 HENGIST/BENCHMARKS  ▶  hollerith_bcd         115,952  Hz ≙ 1 ÷ 9.8     10.2 % │█▎           │
03:05 HENGIST/BENCHMARKS  ▶  hollerith_classic      40,913  Hz ≙ 1 ÷ 27.9     3.6 % │▌            │
03:05 HENGIST/BENCHMARKS  ▶  charwise               30,099  Hz ≙ 1 ÷ 37.9     2.6 % │▍            │
03:05 HENGIST/BENCHMARKS  ▶  bytewise               19,642  Hz ≙ 1 ÷ 58.1     1.7 % │▎            │
```

* `hollerith-codec/tng` is much faster than the (more generic) encoding used by `charwise` and `bytewise`
* neither of which have a fixed length and would probably have to be padded or otherwise post-processed to
  be used in SQLite sort entries

## Related

* [`bytewise`](https://github.com/deanlandolt/bytewise), from which ide for the numerical encoding used in
  `hollerith-codec` and `hollerith-codec/tnf` was lifted. This has now been superseded by
  * [`charwise`](https://github.com/dominictarr/charwise) (similar but faster).




