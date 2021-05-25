
'use strict'


############################################################################################################
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'SCDA'
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
info                      = CND.get_logger 'info',      badge
urge                      = CND.get_logger 'urge',      badge
help                      = CND.get_logger 'help',      badge
whisper                   = CND.get_logger 'whisper',   badge
echo                      = CND.echo.bind CND
#...........................................................................................................
PATH                      = require 'path'
{ Dba }                   = require '../../../apps/icql-dba'
Readlines                 = require 'n-readlines'
glob                      = require 'glob'
{ freeze
  lets }                  = require 'letsfreezethat'
types                     = require './types'
{ isa
  type_of
  validate }              = types.export()
{ Tokenwalker }           = require './tokenwalker'
{ Scda }                  = require '..'


#-----------------------------------------------------------------------------------------------------------
@demo_scda = ->
  schema              = 'scda'
  prefix              = PATH.resolve PATH.join __dirname, '../../../../icql-dba/src'
  # prefix            = PATH.resolve PATH.join __dirname, '../src'
  ignore_names        = [
    'rpr'
    'get_logger'
    'require'
    'isa'
    'type_of'
    'text'
    'list'
    'nonempty_text'
    'object'
    'cardinal'
    'bind'
    ]
  ignore_short_paths  = [ 'types.coffee', 'common.coffee', 'errors.coffee', ]
  scda                = new Scda { schema, prefix, ignore_names, ignore_short_paths, verbose: false, }
  info '^334^', scda
  #.........................................................................................................
  scda.add_sources()
  console.table [ ( scda.dba.query "select * from scda.paths order by path;" )..., ]
  # help '^3344^', row for row from scda.dba.query """
  #   select * from scda.lines
  #   where true
  #     -- and ( lnr between 111 and 123 )
  #     -- and ( line != '' )
  #   order by short_path, lnr;"""
  # console.table [ ( scda.dba.query "select short_path, lnr, name from scda.defs order by name;" )..., ]
  # console.table [ ( scda.dba.query "select short_path, lnr, type, role, name from scda.occurrences order by name;" )..., ]
  # console.table [ ( scda.dba.query "select * from scda.occurrences order by name;" )..., ]
  console.table [ ( scda.dba.query "select * from scda.occurrences where role = 'call' order by 1, 2, 3, 4;" )..., ]
  console.table [ ( scda.dba.query "select * from scda.occurrences where role = 'def' order by 1, 2, 3, 4;" )..., ]
  #.........................................................................................................
  return null

#-----------------------------------------------------------------------------------------------------------
@demo_tokenwalker = ->
  source = """
    @foo = -> 42
    @foo = f = -> 42
    @foo = => 42
    @foo = () -> 42
    @foo = () => 42
    @foo = ( x ) -> x * x
    @foo = ( x ) => x * x
    @foo = ( x = 42 ) => x * x
    @foo = ( x = f 42 ) => x * x
    @foo = ( x, y ) -> x * y
    @foo = ( x, f = ( a ) -> a ) -> f x
    @foo()
    @foo value
    @foo value, value, value
    @foo value, @bar value
    @foo value, ( @bar value ), value
    @foo value, ( blah.bar value ), value
    foo = -> 42
    foo = f = -> 42
    foo = => 42
    foo = () -> 42
    foo = () => 42
    foo = ( x ) -> x * x
    foo = ( x ) => x * x
    foo = ( x = 42 ) => x * x
    foo = ( x = f 42 ) => x * x
    foo = ( x, y ) -> x * y
    foo = ( x, f = ( a ) -> a ) -> f x
    foo()
    foo value
    foo value, value, value
    foo value, @bar value
    foo value, ( @bar value ), value
    foo value, ( blah.bar value ), value
    @foo = -> 42
    foo value
    foo value, value, value; bar = ->
    some.object.f = -> x
    some.object.f x
    foo: ->
    foo: ( x ) ->
    """
  tokenwalker = new Tokenwalker { lnr: 0, source, verbose: true, }
  # debug '^4433^', tokenwalker
  for d from tokenwalker.walk()
    # whisper '^333443^', tokenwalker
    info    '^333443^', d
  return null


############################################################################################################
if module is require.main then do =>
  @demo_scda()
  # @demo_tokenwalker()



