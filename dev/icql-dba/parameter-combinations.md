


|  ram  |    path   |   name   | cfg.ram | cfg.path | cfg.name | cfg.url | persistency |              error              |
| ----- | --------- | -------- | ------- | -------- | -------- | ------- | ----------- | ------------------------------- |
| null  | null      | null     | true    |          |          |         |             |                                 |
|       |           | 'dbname' | true    |          |          |         |             |                                 |
|       | 'db/path' | null     | false   |          |          |         |             |                                 |
|       |           | 'dbname' | ./.     |          |          |         |             | either `path` or `name` for FDB |
| false | null      | null     | ./.     |          |          |         |             |                                 |
|       |           | 'dbname' | ./.     |          |          |         |             |                                 |
|       | 'db/path' | null     | false   |          |          |         |             |                                 |
|       |           | 'dbname' | ./.     |          |          |         |             | either `path` or `name` for FDB |
| true  | null      | null     | true    |          |          |         |             |                                 |
|       |           | 'dbname' | true    |          |          |         |             |                                 |
|       | 'db/path' | null     | true    |          |          |         |             |                                 |
|       |           | 'dbname' | true    |          |          |         |             |                                 |
|       |           |          | true    |          |          |         |             |                                 |