


'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MKTS-PARSER/TYPES'
debug                     = CND.get_logger 'debug',     badge
alert                     = CND.get_logger 'alert',     badge
whisper                   = CND.get_logger 'whisper',   badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
info                      = CND.get_logger 'info',      badge
jr                        = JSON.stringify
Intertype                 = ( require 'intertype' ).Intertype
intertype                 = new Intertype module.exports
Dba                       = null

#-----------------------------------------------------------------------------------------------------------
@declare 'gdb_constructor_cfg',
  tests:
    "@isa.object x":                        ( x ) -> @isa.object x
    "@isa.nonempty_text x.db_path":         ( x ) -> @isa.nonempty_text x.db_path
    "@isa_optional.boolean x.echo":         ( x ) -> @isa_optional.boolean x.echo

#-----------------------------------------------------------------------------------------------------------
@defaults =
  #.........................................................................................................
  gdb_constructor_cfg:
    # _temp_prefix: '_dba_temp_'
    # readonly:     false
    # create:       true
    # overwrite:    false
    # timeout:      5000
    path:       null
    echo:       false

