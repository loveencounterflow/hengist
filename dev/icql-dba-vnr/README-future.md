# Future of VNR, Datom, Hollerith, Hollerith-Codec, ICQL-DBA-VNR



<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Packages mentioned](#packages-mentioned)
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


## Related

* [`bytewise`](https://github.com/deanlandolt/bytewise), from which ide for the numerical encoding used in
  `hollerith-codec` and `hollerith-codec/tnf` was lifted. This has now been superseded by
  * [`charwise`](https://github.com/dominictarr/charwise) (similar but faster).




