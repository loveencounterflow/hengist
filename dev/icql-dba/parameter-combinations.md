


|  nr |  in.ram |   in.path   | in.dbnick  | out.ram |   out.path  |      out.dbnick     | out.persistency | out.error | same as  |
| --- | ------- | ----------- | ---------- | ------- | ----------- | ------------------- | --------------- | --------- | -------- |
|   1 | `null`  | `null`      | `null`     | `true`  | `null`      | `'_rnd_7714686943'` | none            | ———       | 1, 9     |
|   2 |         |             | `'dbnick'` | `true`  | `null`      | `'dbnick'`          | none            | ———       | 2, 10    |
|   3 |         | `'db/path'` | `null`     | `false` | `'db/path'` | `null`              | continuous      | ———       | 3, 7     |
|   4 |         |             | `'dbnick'` | ———     | ———         | ———                 | ———             | **E01**   | 4, 8, 12 |
|   5 | `false` | `null`      | `null`     | ———     | ———         | ———                 | ———             | **E02**   | 5, 6     |
|   6 |         |             | `'dbnick'` | ———     | ———         | ———                 | ———             | **E02**   | 5, 6     |
|   7 |         | `'db/path'` | `null`     | `false` | `'db/path'` | `null`              | continuous      | ———       | 3, 7     |
|   8 |         |             | `'dbnick'` | ———     | ———         | ———                 | ———             | **E01**   | 4, 8, 12 |
|   9 | `true`  | `null`      | `null`     | `true`  | `null`      | `'_rnd_7714686943'` | none            | ———       | 1, 9     |
|  10 |         |             | `'dbnick'` | `true`  | `null`      | `'dbnick'`          | none            | ———       | 2, 10    |
|  11 |         | `'db/path'` | `null`     | `true`  | `'db/path'` | `'_rnd_7714686943'` | eventual        | ———       | ———      |
|  12 |         |             | `'dbnick'` | ———     | ———         | ———                 | none            | **E01**   | 4, 8, 12 |

-----------------------

|  nr |  in.ram |   in.path   | in.dbnick  | out.ram | out.path | out.dbnick | out.persistency | out.error | same as  |
| --- | ------- | ----------- | ---------- | ------- | -------- | ---------- | --------------- | --------- | -------- |
|   4 | `null`  | `'db/path'` | `'dbnick'` | ———     | ———      | ———        | ———             | **E01**   | 4, 8, 12 |
|   8 | `false` | `'db/path'` | `'dbnick'` | ———     | ———      | ———        | ———             | **E01**   | 4, 8, 12 |
|  12 | `true`  | `'db/path'` | `'dbnick'` | ———     | ———      | ———        | ———             | **E01**   | 4, 8, 12 |


|  nr |  in.ram | in.path | in.dbnick  | out.ram | out.path | out.dbnick | out.persistency | out.error | same as |
| --- | ------- | ------- | ---------- | ------- | -------- | ---------- | --------------- | --------- | ------- |
|   5 | `false` | `null`  | `null`     | ———     | ———      | ———        | ———             | **E02**   | 5, 6    |
|   6 | `false` | `null`  | `'dbnick'` | ———     | ———      | ———        | ———             | **E02**   | 5, 6    |


|   nr  |      in.ram     |   in.path   | in.dbnick  | out.ram |   out.path  |      out.dbnick     | out.persistency | out.error | same as |
| ----- | --------------- | ----------- | ---------- | ------- | ----------- | ------------------- | --------------- | --------- | ------- |
| 1, 9  | `null`, `true`  | `null`      | `null`     | `true`  | `null`      | `'_rnd_7714686943'` | none            | ———       | 1, 9    |
| 2, 10 | `null`, `true`  | `null`      | `'dbnick'` | `true`  | `null`      | `'dbnick'`          | none            | ———       | 2, 10   |
| 3, 7  | `null`, `false` | `'db/path'` | `null`     | `false` | `'db/path'` | `null`              | continuous      | ———       | 3, 7    |
| 11    | `true`          | `'db/path'` | `null`     | `true`  | `'db/path'` | `'_rnd_7714686943'` | eventual        | ———       | ———     |


url: of the form `file:_rnd_7714686943?mode=memory&cache=shared` or `file:dbnick?mode=memory&cache=shared`

* **E01**: "either `path` or `dbnick` for FDB"
* **E02**: "missing argument `path`"


