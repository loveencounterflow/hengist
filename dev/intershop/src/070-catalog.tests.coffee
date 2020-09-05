
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'INTERSHOP/TESTS/070-CATALOG'
debug                     = CND.get_logger 'debug',     badge
debug '^76483-1^'
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require 'guy-test'
PATH                      = require 'path'
FS                        = require 'fs'
# #...........................................................................................................
# types                     = require '../types'
# { isa
#   validate
#   type_of }               = types

#-----------------------------------------------------------------------------------------------------------
resolve_project_path = ( path ) -> PATH.resolve PATH.join __dirname, '../../..', path

#-----------------------------------------------------------------------------------------------------------
@[ "CATALOG.parse_object_identifier" ] = ( T, done ) ->
  db = require 'intershop/lib/db'
  #.........................................................................................................
  probes_and_matchers = [
    [ 'x.foo',      { ucschema: 'X',    name: 'foo',      fqname: 'X.foo', }, ]
    [ 'X.foo',      { ucschema: 'X',    name: 'foo',      fqname: 'X.foo', }, ]
    [ '"X.foo"',    { ucschema: null,   name: '"X.foo"',  fqname: '"X.foo"', }, ]
    [ 'X',          { ucschema: null,   name: 'x',        fqname: 'x', }, ]
    [ 'X."20"',     { ucschema: 'X',    name: '"20"',     fqname: 'X."20"', }, ]
    [ 'all',            null, 'CAT22 reserved word',                  ]
    [ 'select',         null, "CAT22 reserved word: 'select'"         ]
    [ 'select.x',       null, "CAT22 reserved word: 'select'"         ]
    [ 'x.select',       null, "CAT22 reserved word: 'select'"         ]
    [ 'X.with space',   null, 'string is not a valid identifier'      ]
    [ 'X.""',           null, 'string is not a valid identifier'      ]
    [ 'X.SCHEMA.F',     null, "expected a text with at most one dot"  ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      # debug '^766^', { error, }
      ### TAINT why do we have to do explicit error handling here? ###
      try
        result = await db.query_one [ """select * from CATALOG.parse_object_identifier( $1 );""", probe, ]
      catch error
        # warn error.message
        return reject new Error error.message
      resolve result
  done()
  return null



############################################################################################################
if require.main is module then do =>
  test @
  # await @_demo_opentypejs()
  # test @[ "VNR sort 2" ]
  # test @[ "VNR sort 3" ]
  # @[ "VNR sort 3" ]()
  # test @[ "test VNR._first_nonzero_is_negative()" ]
  # @[ "SVGTTF.svg_from_glyphidx()" ]()
  # @[ "SVGTTF.svg_from_harfbuzz_linotype()" ]()
  # @[ "SVGTTF.svg_from_harfbuzz_linotype() (using CJK font)" ]()



