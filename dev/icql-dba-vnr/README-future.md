# Future of VNR, Datom, Hollerith, Hollerith-Codec, ICQL-DBA-VNR



<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Packages mentioned](#packages-mentioned)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->






## Packages mentioned

* [`hollerith`](https://github.com/loveencounterflow/hollerith)
* [`hollerith-codec`](https://github.com/loveencounterflow/hollerith-codec), which contains
  the much faster, more restricted [`tng` version](https://github.com/loveencounterflow/hollerith-codec/blob/master/src/tng.coffee)
* [`datom`](https://github.com/loveencounterflow/datom), which contains
  * [`vnr` submodule](https://github.com/loveencounterflow/datom/blob/master/src/vnr.coffee), which defines
    * `class Vnr`
    * does not use binary encoding for sorting but a JS `cmp a, b` method (which will presently not work in
      SQLite)
* [`icql-dba-vnr`](https://github.com/loveencounterflow/icql-dba-vnr)
  * defines tables and indices to work with VNRs in SQLite
  * VNR methods inherited from `datom/lib/vnr#Vnr`
  * uses `hollerith-codec/tng` for fast indexing BLOBs







