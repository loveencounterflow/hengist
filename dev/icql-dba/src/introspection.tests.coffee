
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'ICQL-DBA/TESTS/FUTURE'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ isa
  type_of
  validate
  validate_list_of }      = types.export()
# { to_width }              = require 'to-width'
on_process_exit           = require 'exit-hook'
sleep                     = ( dts ) -> new Promise ( done ) => setTimeout done, dts * 1000
SQL                       = String.raw
jr                        = JSON.stringify
jp                        = JSON.parse

#-----------------------------------------------------------------------------------------------------------
@[ "DBA: type_of()" ] = ( T, done ) ->
  T?.halt_on_error()
  { Dba }           = require H.icql_dba_path
  { template_path
    work_path }     = await H.procure_db { size: 'small', ref: 'type-of', }
  schema            = 'main'
  #.........................................................................................................
  urge '^344-3^', { template_path, work_path, schema, }
  # dba     = new Dba()
  dba = new Dba()
  dba.open { path: work_path, }
  #.........................................................................................................
  T?.eq ( dba.type_of { schema, name: 'sources'                     } ), 'table'
  T?.eq ( dba.type_of { schema, name: 'dest_changes_backward'       } ), 'view'
  T?.eq ( dba.type_of { schema, name: 'keys'                        } ), 'table'
  T?.eq ( dba.type_of { schema, name: 'sqlite_autoindex_keys_1'     } ), 'index'
  T?.eq ( dba.type_of { schema, name: 'sqlite_autoindex_realms_1'   } ), 'index'
  T?.eq ( dba.type_of { schema, name: 'realms'                      } ), 'table'
  T?.eq ( dba.type_of { schema, name: 'dest_changes_forward'        } ), 'view'
  T?.eq ( dba.type_of { schema, name: 'main'                        } ), 'table'
  T?.eq ( dba.type_of { schema, name: 'sqlite_autoindex_sources_1'  } ), 'index'
  #.........................................................................................................
  done?()






############################################################################################################
if module is require.main then do =>
  test @, { timeout: 10e3, }








