


|   ram   |    path   |    name    | cfg.ram | cfg.path |       cfg.name      | persistency |              error              |
| ------- | --------- | ---------- | ------- | -------- | ------------------- | ----------- | ------------------------------- |
| `null`  | `null`    | `null`     | `true`  |          | `'_rnd_7714686943'` |             |                                 |
|         |           | `'dbname'` | `true`  |          | `'dbname'`          |             |                                 |
|         | 'db/path' | `null`     | `false` |          | `null`              |             |                                 |
|         |           | `'dbname'` | ./.     | ./.      | ./.                 | ./.         | either `path` or `name` for FDB |
| `false` | `null`    | `null`     | ./.     | ./.      | ./.                 | ./.         | missing argument `path`         |
|         |           | `'dbname'` | ./.     | ./.      | ./.                 | ./.         | missing argument `path`         |
|         | 'db/path' | `null`     | `false` |          |                     |             |                                 |
|         |           | `'dbname'` | ./.     | ./.      | ./.                 | ./.         | either `path` or `name` for FDB |
| `true`  | `null`    | `null`     | `true`  |          | `'_rnd_7714686943'` |             |                                 |
|         |           | `'dbname'` | `true`  |          | `'dbname'`          |             |                                 |
|         | 'db/path' | `null`     | `true`  |          | `'_rnd_7714686943'` |             |                                 |
|         |           | `'dbname'` | `true`  |          | `'dbname'`          |             |                                 |
|         |           |            | `true`  |          |                     |             |                                 |


url: of the form `file:_rnd_7714686943?mode=memory&cache=shared` or `file:dbname?mode=memory&cache=shared`



