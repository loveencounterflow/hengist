


## Coding Principles

* also see `README.md` of https://github.com/loveencounterflow/interlap


* basic data classes are immutable
* derived from either `Tuple` or `NamedTuple`
* may hold additional data items (cached properties), e.g. `size`
* manipulation 100% through library methods
* use of class initialization (`Segment( ( 12, 14, ) )` ) might be possible, but is discouraged
* immutability also serves to ascertain data type invariants hold (all relevant aspects are guarded by type
  checks and value checks)


## Schema


```

──────────────────────────────────────────────────
0         1         2         3         4
01234567890123456789012345678901234567890123456789
a.lo < b.lo
══════════════════════════════════════════════════
a.hi > b.hi
──────────────────────────────────────────────────
b.lo - a.hi == -1
├─────────┤
		├────┤
┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
├────────┤
══════════════════════════════════════════════════
a.hi <= b.hi
──────────────────────────────────────────────────
b.lo - a.hi == -1
├────┤
		├────┤
┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
├────────┤
──────────────────────────────────────────────────
b.lo - a.hi == 0
├───┤
		├────┤
┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
├────────┤
──────────────────────────────────────────────────
b.lo - a.hi == 1
├──┤
		├────┤
┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
├────────┤
──────────────────────────────────────────────────
b.lo - a.hi > 1
├──┤
		 ├───┤
┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄
├──┤ ├───┤
```


## To Do

* [ ] accept infinity as boundaries
* [ ] do not accept booleans as boundaries
* [ ] make it so that `new_segment( ( 1, 1, ) ) != ( 1, 1, )` (because `Segment` should be its own type and
	not coerce to a tuple; otherwise, consistency assumptions would be shaky)



