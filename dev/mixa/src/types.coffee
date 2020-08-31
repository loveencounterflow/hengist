
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'MIXA/TYPES'
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
L                         = @

default_settings = freeze {
  meta:
    help:   { alias: 'h', type: Boolean, description: "show help and exit", }
    cd:     { alias: 'd', type: String,  description: "change to directory before running command", }
    trace:  { alias: 't', type: Boolean, description: "trace options parsing (for debugging)", }
  commands:
    cat:      { description: "draw a cat", }
    version:  { description: "show project version and exit", }
  }

#-----------------------------------------------------------------------------------------------------------
@declare 'mixa_settings', tests:
  "x is an object":                         ( x ) -> @isa.object x
  "x.?meta is a mixa_flagdefs":             ( x ) -> ( not x.meta     )? or @isa.mixa_flagdefs x.meta
  "x.?commands is a mixa_flagdefs":         ( x ) -> ( not x.commands )? or @isa.mixa_flagdefs x.commands

#-----------------------------------------------------------------------------------------------------------
@declare 'mixa_flagdefs', tests:
  "x is an object":                         ( x ) -> @isa.object x
  "each attribute of x is a mixa_flagdef":  ( x ) ->
    for k, v of x
      return false unless @isa.mixa_flagdef v
    return true

#-----------------------------------------------------------------------------------------------------------
@declare 'mixa_flagdef', tests:
  "x is an object":                         ( x ) -> @isa.object x
  #.........................................................................................................
  # These options are filled out by `mixa` or used by `command-line-args` in incompatible ways:
  "x.name is not set":                      ( x ) -> not x.name?
  "x.group is not set":                     ( x ) -> not x.group?
  "x.defaultOption is not set":             ( x ) -> not x.defaultOption?
  #.........................................................................................................
  "x.?type is a function":                  ( x ) -> ( not x.type?          ) or @isa.function x.type
  "x.?alias is a text":                     ( x ) -> ( not x.alias?         ) or @isa.text     x.alias
  "x.?multiple is a boolean":               ( x ) -> ( not x.multiple?      ) or @isa.boolean  x.multiple
  "x.?lazyMultiple is a boolean":           ( x ) -> ( not x.lazyMultiple?  ) or @isa.boolean  x.lazyMultiple
  "x.?defaultValue is anything":            ( x ) -> true


