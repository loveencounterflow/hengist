


# Discontinuous Ranges

## Data Structure

* `Arange`, a derivative of JS `Array`
* IOW a list
* whose elements are in turn `Segment`s, another derivative of JS `Array`
* segments are pairs `[ lo, hi, ]` where both are finite or infinite numbers, `lo <= hi`

```
[ [ 4, 6 ], [ 7, 7, ], [ 11, 19, ], ]
```

## Coding Principles

* Classes, instances are largely 'passive'
* interesting methods all in stateless library with pure functions
* shallow extensions of standard types (`Array` in this case)
* therefore can always be replaced w/ standard objects
* validation by (implicit) instantiation
* instances are immutable (frozen)
* duties of instances:
	* carriers of a few standard attributes (`d.size` in this case)
	* serve as caching mechanism (instances may hold references to objects that implement functionalities)
	* serve as 'product certification labels'; since instances are frozen we can be sure they are structured
	  correctly when `d instanceof D` is `true`


