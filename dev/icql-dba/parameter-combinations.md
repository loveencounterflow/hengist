


|  nr |  in.ram |   in.path   |  in.name   | out.ram |   out.path  |       out.name      | out.persistency | out.error | same as  |
| --- | ------- | ----------- | ---------- | ------- | ----------- | ------------------- | --------------- | --------- | -------- |
|   1 | `null`  | `null`      | `null`     | `true`  |             | `'_rnd_7714686943'` | none            | ———       | 1, 9     |
|   2 |         |             | `'dbname'` | `true`  |             | `'dbname'`          | none            | ———       | 2, 10    |
|   3 |         | `'db/path'` | `null`     | `false` | `'db/path'` | `null`              | continuous      | ———       | 3, 7     |
|   4 |         |             | `'dbname'` | ———     | ———         | ———                 | ———             | **E01**   | 4, 8, 12 |
|   5 | `false` | `null`      | `null`     | ———     | ———         | ———                 | ———             | **E02**   | 5, 6     |
|   6 |         |             | `'dbname'` | ———     | ———         | ———                 | ———             | **E02**   | 5, 6     |
|   7 |         | `'db/path'` | `null`     | `false` | `'db/path'` | `null`              | continuous      | ———       | 3, 7     |
|   8 |         |             | `'dbname'` | ———     | ———         | ———                 | ———             | **E01**   | 4, 8, 12 |
|   9 | `true`  | `null`      | `null`     | `true`  |             | `'_rnd_7714686943'` | none            | ———       | 1, 9     |
|  10 |         |             | `'dbname'` | `true`  |             | `'dbname'`          | none            | ———       | 2, 10    |
|  11 |         | `'db/path'` | `null`     | `true`  | `'db/path'` | `'_rnd_7714686943'` | eventual        | ———       | ———      |
|  12 |         |             | `'dbname'` | `true`  |             | `'dbname'`          | none            | **E01**   | 4, 8, 12 |

-----------------------

|  nr |  in.ram |   in.path   |  in.name   | out.ram |   out.path  |       out.name      | out.persistency | out.error | same as  |
| --- | ------- | ----------- | ---------- | ------- | ----------- | ------------------- | --------------- | --------- | -------- |
|   4 |         |             | `'dbname'` | ———     | ———         | ———                 | ———             | **E01**   | 4, 8, 12 |
|   8 |         |             | `'dbname'` | ———     | ———         | ———                 | ———             | **E01**   | 4, 8, 12 |
|  12 |         |             | `'dbname'` | `true`  |             | `'dbname'`          | none            | **E01**   | 4, 8, 12 |


|  nr |  in.ram |   in.path   |  in.name   | out.ram |   out.path  |       out.name      | out.persistency | out.error | same as  |
| --- | ------- | ----------- | ---------- | ------- | ----------- | ------------------- | --------------- | --------- | -------- |
|   5 | `false` | `null`      | `null`     | ———     | ———         | ———                 | ———             | **E02**   | 5, 6     |
|   6 |         |             | `'dbname'` | ———     | ———         | ———                 | ———             | **E02**   | 5, 6     |


|  nr |  in.ram |   in.path   |  in.name   | out.ram |   out.path  |       out.name      | out.persistency | out.error | same as  |
| --- | ------- | ----------- | ---------- | ------- | ----------- | ------------------- | --------------- | --------- | -------- |
|   1 | `null`  | `null`      | `null`     | `true`  |             | `'_rnd_7714686943'` | none            | ———       | 1, 9     |
|   9 | `true`  | `null`      | `null`     | `true`  |             | `'_rnd_7714686943'` | none            | ———       | 1, 9     |
|   2 |         |             | `'dbname'` | `true`  |             | `'dbname'`          | none            | ———       | 2, 10    |
|  10 |         |             | `'dbname'` | `true`  |             | `'dbname'`          | none            | ———       | 2, 10    |
|   3 |         | `'db/path'` | `null`     | `false` | `'db/path'` | `null`              | continuous      | ———       | 3, 7     |
|   7 |         | `'db/path'` | `null`     | `false` | `'db/path'` | `null`              | continuous      | ———       | 3, 7     |
|  11 |         | `'db/path'` | `null`     | `true`  | `'db/path'` | `'_rnd_7714686943'` | eventual        | ———       | ———      |


url: of the form `file:_rnd_7714686943?mode=memory&cache=shared` or `file:dbname?mode=memory&cache=shared`

* **E01**: "either `path` or `name` for FDB"
* **E02**: "missing argument `path`"
