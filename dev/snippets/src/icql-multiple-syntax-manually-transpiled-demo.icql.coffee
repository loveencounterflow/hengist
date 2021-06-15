
'use strict'
{ Dba }           = require '../../../apps/icql-dba'
dba               = new Dba()
schema            = 'v'
dba._attach { schema, ram: true, }

# which syntax is this?

# %%%.sql

_icql_rows = dba.query """
select 'helo from sql' as greeting;
"""
for _icql_row from _icql_rows
  console.log _icql_row


# %%%.coffee

log = console.log 
log '^1333^', "helo from coffeescript"

# %%%.js
```
log( `helo from JS` );

```
# %%%.coffee




