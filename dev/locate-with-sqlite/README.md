<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Reddit Thread](#reddit-thread)
- [Thx To](#thx-to)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Reddit Thread

[VisibleSignificance](https://www.reddit.com/user/VisibleSignificance/):

> Submission statement: Similar to the recent post about plocate, this is a more simple imitation that uses
> sqlite3's FTS (Full Text Search).
>
> Notably, the behavior does not exactly match, as FTS uses somewhat special tokenizing.
>
> Comparison on the nearest system I had (2M items, SSD):
>
> ```
> cmpit() {
>      arg="$1"
>      echo "grep"
>      time grep -wiF "$arg" .locatedb | wc -l
>      echo
>      echo "fts"
>      time ./.locatedb_query_fts "$arg" | wc -l
> }
>
> $ cmpit sqlite
> grep
> 1051
>
> real    0m0.237s
> user    0m0.187s
> sys     0m0.061s
>
> fts
> 1063
>
> real    0m0.100s
> user    0m0.000s
> sys     0m0.060s
>
>
> $ cmpit sqlite3
> grep
> 332
>
> real    0m0.240s
> user    0m0.186s
> sys     0m0.046s
>
> fts
> 365
>
> real    0m0.096s
> user    0m0.000s
> ```

## Thx To

* https://www.reddit.com/r/commandline/comments/jk64bw/locate_using_sqlite3_full_text_search/
* https://paste.ubuntu.com/p/nktgHzwZdT/

