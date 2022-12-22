
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'DEMO-COZO'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
# FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
H                         = require '../../../lib/helpers'
FS                        = require 'node:fs'
{ CozoDb }                = require 'cozo-node'



# debug '^32748^', require '/tmp/cozo-demo/node_modules/.pnpm/cozo-node'
debug '^32748^', require 'cozo-node'


#-----------------------------------------------------------------------------------------------------------
@demo = ->
  db = new CozoDb()
  #.........................................................................................................
  show = ( title, query, params ) ->
    try
      data = await db.run query, params
    catch error
      echo error.display ? error.message
      return null
    whisper '^34-1^', rpr data
    table = []
    for row in data.rows
      r = {}
      table.push r
      for value, idx in row
        r[ data.headers[ idx ] ] = value
    H.tabulate title, table
    return null
  #.........................................................................................................
  await show '#1', "?[] <- [['hello', 'world!']]"
  await show '#2', "?[] <- [['hello', 'world', $name]]", {"name": "JavaScript"}
  await show '#3', "?[a] <- [[1, 2]]"
  await show '#4', """
    parent[] <- [
      ['a4', 'a3'],
      ['a3', 'a2'],
      ['a2', 'a1'],
      ['joseph', 'jakob'],
      ['jakob', 'issac'],
      ['issac', 'abraham'] ]
    grandparent[  _grandchild,                    _grandparent                    ] :=
                  parent[ _grandchild, _parent ], parent[ _parent, _grandparent ]
    # ?[grandson, who] := 'abraham', grandparent[who, 'abraham' ]
    # ?[ who ] := grandparent[who, 'issac']
    ?[ who ] := parent[ 'jakob', who ]
    ?[ who ] := grandparent[ 'jakob', who ]
    # ?[who] := grandparent[who, 'a2']
    # ?[who] := grandparent[who, 'a1']
    """
  await show '#5', """?[] <- [ [ 1, 2, 3, ], ['hello', 'world', 'Cozo!']]"""
  await show '#5', """::relations"""
  await db.backup '/tmp/foo.cozo'
  return null


############################################################################################################
if module is require.main then do =>
  @demo()
  return null





