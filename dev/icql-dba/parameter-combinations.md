


|  nr |   ram   |    path   |    name    | cfg.ram | cfg.path |       cfg.name      | persistency |  error  |  rem  |
| --- | ------- | --------- | ---------- | ------- | -------- | ------------------- | ----------- | ------- | ----- |
|   1 | `null`  | `null`    | `null`     | `true`  |          | `'_rnd_7714686943'` | none        | (OK)    | = #9  |
|   2 |         |           | `'dbname'` | `true`  |          | `'dbname'`          | none        | (OK)    | = #10 |
|   3 |         | 'db/path' | `null`     | `false` |          | `null`              | continuous  | (OK)    | = #7  |
|   4 |         |           | `'dbname'` | ./.     | ./.      | ./.                 | ./.         | **E01** |       |
|   5 | `false` | `null`    | `null`     | ./.     | ./.      | ./.                 | ./.         | **E02** |       |
|   6 |         |           | `'dbname'` | ./.     | ./.      | ./.                 | ./.         | **E02** |       |
|   7 |         | 'db/path' | `null`     | `false` |          | `null`              | continuous  | (OK)    | = #3  |
|   8 |         |           | `'dbname'` | ./.     | ./.      | ./.                 | ./.         | **E01** |       |
|   9 | `true`  | `null`    | `null`     | `true`  |          | `'_rnd_7714686943'` | none        | (OK)    | = #1  |
|  10 |         |           | `'dbname'` | `true`  |          | `'dbname'`          | none        | (OK)    | = #2  |
|  11 |         | 'db/path' | `null`     | `true`  |          | `'_rnd_7714686943'` | eventual    | (OK)    |       |
|  12 |         |           | `'dbname'` | `true`  |          | `'dbname'`          |             | (OK)    |       |


url: of the form `file:_rnd_7714686943?mode=memory&cache=shared` or `file:dbname?mode=memory&cache=shared`

* **E01**: "either `path` or `name` for FDB"
* **E02**: "missing argument `path`"
