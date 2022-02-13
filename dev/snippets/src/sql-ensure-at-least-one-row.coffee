
'use strict'



############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'DBAY/ENSURE-ONE-ROW'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
FS                        = require 'fs'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
GUY                       = require '../../../apps/guy'
# { HDML }                  = require '../../../apps/hdml'
X                         = require '../../../lib/helpers'
{ lets
  freeze }                = GUY.lft
{ to_width }              = require 'to-width'
{ DBay }                  = require '../../../apps/dbay'
{ Sql }                   = require '../../../apps/dbay/lib/sql'
{ SQL }                   = DBay


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
tabulate = ( db, query ) -> X.tabulate query, db query

#-----------------------------------------------------------------------------------------------------------
provide_db_infrastructure = ( db ) ->
  db.create_stdlib()
  db SQL"""
    create table rawfs (
        nid   integer not null primary key,
        upid  integer references rawfs ( nid ),
        upath text    not null,
        name  text    not null );
    insert into rawfs ( nid, upid, upath, name ) values ( 0, null, '', '' );
    """
  return null


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@demo_ensure_one_row = ->
  db = new DBay()
  provide_db_infrastructure db
  #.........................................................................................................
  insert_node = db.prepare SQL"""
    insert into rawfs ( upid, upath, name )
      select
          $upid,
          -- coalesce( upath, '' ) || name || '/',
          upath || case upath when '/' then '' else '/' end || name,
          $name
        from rawfs
        where true
          and nid = $upid
      returning *;"""
  #.........................................................................................................
  { nid: upid, } = insert_node.get  { upid: 0, name: 'lib',   }
  insert_node.get                   { upid, name: 'main.js',  }
  insert_node.get                   { upid, name: 'foo.js',   }
  { nid: upid, } = insert_node.get  { upid, name: 'tests',    }
  insert_node.get                   { upid, name: 'bar.js',   }
  tabulate db, SQL"""select * from rawfs;"""
  # tabulate db, SQL"""select * from fs;"""
  return null


############################################################################################################
if module is require.main then do =>
  @demo_ensure_one_row()



