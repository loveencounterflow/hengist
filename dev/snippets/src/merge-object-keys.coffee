

'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MERGE-OBJECT-KEYS'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
spawn                     = ( require 'child_process' ).spawn

###

* two objects:
  * a `row` from a DB query
  * a `cfg` object whose keys are existing or new field names
* task:
  * show table (omitted here)
  * with columns...
    * only those in `row`
    * only those in `cfg`
    * both, from `row` first
    * both, from `cfg` first
* solution: provide the four ways numbered `500-1..500-4` below
* next problem: how to configure these choices?
  * IRL what is called `cfg` here is really the `fields` property of the configuration object, call it `x`
  * can set `x.use_fields` to one of `row`, `cfg`, `row,cfg`, `cfg,row`

###

#-----------------------------------------------------------------------------------------------------------
demo = ->
  row = { r1: 11, r2: 12, r3: 13, }
  cfg = { c1: 21, c4: 24, r1: 21, }
  # help '^442-1^', ( Object.keys row ), ( Object.keys cfg )  # [ 'r1', 'r2', 'r3' ] [ 'c1', 'c4', 'r1' ]
  # help '^442-2^', { row..., cfg..., }                       # { r1: 21, r2: 12, r3: 13, c1: 21, c4: 24 }
  # help '^442-4^', ( Object.keys cfg ), ( Object.keys row )  # [ 'c1', 'c4', 'r1' ] [ 'r1', 'r2', 'r3' ]
  # help '^442-5^', { cfg..., row..., }                       # { c1: 21, c4: 24, r1: 11, r2: 12, r3: 13 }
  help '^500-1^', Object.keys row                           # [ 'r1', 'r2', 'r3' ]
  help '^500-2^', Object.keys cfg                           # [ 'c1', 'c4', 'r1' ]
  help '^500-3^', Object.keys { row..., cfg..., }           # [ 'r1', 'r2', 'r3', 'c1', 'c4' ]
  help '^500-4^', Object.keys { cfg..., row..., }           # [ 'c1', 'c4', 'r1', 'r2', 'r3' ]
  return null








############################################################################################################
if module is require.main then do =>
  demo()


