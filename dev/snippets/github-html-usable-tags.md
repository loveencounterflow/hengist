

# GitHub HTML Usable Tags


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Definition Lists](#definition-lists)
  - [Cryptids of Cornwall](#cryptids-of-cornwall)
  - [How To Format an API Listing](#how-to-format-an-api-listing)
    - [Old](#old)
    - [New (?)](#new-)
    - [Using H6](#using-h6)
        - [`walk: ( sql, P... ) ->`](#walk--sql-p---)
        - [`all_rows: ( sql, P... ) ->`](#all_rows--sql-p---)
        - [`first_row: ( sql, P... ) ->`](#first_row--sql-p---)
        - [`single_row: ( sql, P... ) ->`](#single_row--sql-p---)
        - [`first_values: ( sql, P... ) ->`](#first_values--sql-p---)
        - [`all_first_values: ( sql, P... ) ->`](#all_first_values--sql-p---)
        - [`single_value: ( sql, P... ) ->`](#single_value--sql-p---)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Definition Lists

**Note** also see https://github.com/loveencounterflow/css-in-readme-like-wat

### Cryptids of Cornwall

<dl>
<dt>Beast of Bodmin</dt>
<dd>A large feline inhabiting Bodmin Moor.</dd>

<dt>Morgawr</dt>
<dd>A sea serpent.</dd>

<dt>Owlman</dt>
<dd>A giant owl-like creature.</dd>
</dl>

### How To Format an API Listing

#### Old

* **`db.interpolate( sql, values ): ->`** interpolates values into a template with placeholder formulas.

#### New (?)

<dl> <dt><code>db.interpolate( sql, values ): -></code></dt> <dd>interpolates values into a template with
placeholder formulas.</dd>

<dt><code>walk: ( sql, P... ) -></code></dt>

  <dd>Iterate over rows in the result set. The query must return values.</dd>

<dt><code>all_rows: ( sql, P... ) -></code></dt>

  <dd>Return a list with all rows.</dd>

<dt><code>first_row: ( sql, P... ) -></code></dt>

  <dd>Return first row of the result set. This will call `db.all_rows()`, so may be inefficient when the
  query returns a large number of rows; best used together with `limit 1`. In case the query did not yield
  any rows, `db.first_row()` will return `null`.</dd>

<dt><code>single_row: ( sql, P... ) -></code></dt>

  <dd>Return the only row of the result set. Like `db.first_row()`, but will throw an error if the size of
  the result set is not exactly 1.</dd>

<dt><code>first_values: ( sql, P... ) -></code></dt>

  <dd>Walk over all 'first' value of the rows of the result set, i.e. the field that is mentioned first in a
  `select ... from ...` query.</dd>

<dt><code>all_first_values: ( sql, P... ) -></code></dt>

  <dd>Same as `db.first_values()`, but returns a list of values.</dd>

<dt><code>single_value: ( sql, P... ) -></code></dt>

  <dd>Given a query that returns a single field in a single row, return its value. Throws an error if the
  query didn't return a single row or the row doesn't have a single field.</dd>

</dl>

#### Using H6

###### `walk: ( sql, P... ) ->`
Iterate over rows in the result set. The query must return values.
###### `all_rows: ( sql, P... ) ->`
Return a list with all rows.
###### `first_row: ( sql, P... ) ->`
Return first row of the result set. This will call `db.all_rows()`, so may be inefficient when the query
returns a large number of rows; best used together with `limit 1`. In case the query did not yield any rows,
`db.first_row()` will return `null`.
###### `single_row: ( sql, P... ) ->`
Return the only row of the result set. Like `db.first_row()`, but will throw an error if the size of the
result set is not exactly 1.
###### `first_values: ( sql, P... ) ->`
Walk over all 'first' value of the rows of the result set, i.e. the field that is mentioned first in a
`select ... from ...` query.
###### `all_first_values: ( sql, P... ) ->`
Same as `db.first_values()`, but returns a list of values.
###### `single_value: ( sql, P... ) ->`
Given a query that returns a single field in a single row, return its value. Throws an error if the query
didn't return a single row or the row doesn't have a single field.

