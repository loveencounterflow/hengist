
'use strict'


############################################################################################################
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY/TESTS/FS'
log                       = CND.get_logger 'plain',     badge
info                      = CND.get_logger 'info',      badge
whisper                   = CND.get_logger 'whisper',   badge
alert                     = CND.get_logger 'alert',     badge
debug                     = CND.get_logger 'debug',     badge
warn                      = CND.get_logger 'warn',      badge
help                      = CND.get_logger 'help',      badge
urge                      = CND.get_logger 'urge',      badge
echo                      = CND.echo.bind CND
#...........................................................................................................
test                      = require '../../../apps/guy-test'
PATH                      = require 'path'
FS                        = require 'fs'
H                         = require './helpers'
types                     = new ( require 'intertype' ).Intertype
{ freeze }                = require 'letsfreezethat'
{ isa
  type_of
  validate
  validate_list_of
  equals }                = types.export()

matchers =
  single: [
    "Ångström's"
    "éclair"
    "éclair's"
    "éclairs"
    "éclat"
    "éclat's"
    "élan"
    "élan's"
    "émigré"
    "émigré's" ]
matchers.triple = [ matchers.single..., matchers.single..., matchers.single..., ]
matchers = freeze matchers

#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@[ "guy.fs.walk_circular_lines() iterates once per default" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy     = require H.guy_path
  result  = []
  path    = PATH.resolve PATH.join __dirname, '../../../', 'assets/a-few-words.txt'
  #.........................................................................................................
  for line from guy.fs.walk_circular_lines path
    result.push line
  #.........................................................................................................
  debug '^3434^', result
  T?.eq result, matchers.single
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.fs.walk_circular_lines() can iterate given number of loops" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy     = require H.guy_path
  result  = []
  path    = PATH.resolve PATH.join __dirname, '../../../', 'assets/a-few-words.txt'
  #.........................................................................................................
  for line from guy.fs.walk_circular_lines path, { loop_count: 3, }
    result.push line
  #.........................................................................................................
  T?.eq result, matchers.triple
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.fs.walk_circular_lines() can iterate given number of lines 1" ] = ( T, done ) ->
  # T?.halt_on_error()
  guy     = require H.guy_path
  result  = []
  path    = PATH.resolve PATH.join __dirname, '../../../', 'assets/a-few-words.txt'
  #.........................................................................................................
  for line from guy.fs.walk_circular_lines path, { loop_count: 3, line_count: 12, }
    result.push line
  #.........................................................................................................
  T?.eq result.length, 12
  done?()

#-----------------------------------------------------------------------------------------------------------
@[ "guy.fs.get_file_size" ] = ( T, done ) ->
  guy     = require H.guy_path
  path    = 'short-proposal.mkts.md'
  path    = PATH.resolve PATH.join __dirname, '../../../assets', path
  #.........................................................................................................
  do =>
    T?.eq ( guy.fs.get_file_size path ), 405
  #.........................................................................................................
  do =>
    error = null
    try result  = guy.fs.get_file_size 'no/such/path' catch error
      T?.ok ( error.message.match /no such file or directory/ )?
    T?.ok error?
  #.........................................................................................................
  do =>
    fallback = Symbol 'fallback'
    T?.eq ( guy.fs.get_file_size 'no/such/path',  fallback ), fallback
    T?.eq ( guy.fs.get_file_size path,            fallback ), 405
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@GUY_fs_get_content_hash = ( T, done ) ->
  GUY     = require H.guy_path
  path    = 'short-proposal.mkts.md'
  path    = PATH.resolve PATH.join __dirname, '../../../assets', path
  #.........................................................................................................
  do =>
    matcher = '2c244f1d168c54906'
    result  = GUY.fs.get_content_hash path
    T?.eq result, matcher
  #.........................................................................................................
  do =>
    matcher = '2c24'
    result  = GUY.fs.get_content_hash path, { length: 4, }
    T?.eq result, matcher
  #.........................................................................................................
  do =>
    error = null
    try result  = GUY.fs.get_content_hash path, { length: 400, } catch error
      T?.ok ( error.message.match /unable to generate hash of length 400 using/ )?
    T?.ok error?
  #.........................................................................................................
  do =>
    path = 'NONEXISTANT'
    T?.eq ( FS.existsSync path ), false
    T?.throws /No such file or directory/, -> GUY.fs.get_content_hash path
    foobar = Symbol 'foobar'
    T?.eq ( GUY.fs.get_content_hash path, { fallback: foobar, } ), foobar
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_fs_walk_lines_yields_from_empty_file = ( T, done ) ->
  GUY     = require H.guy_path
  paths   = [
    [ 'ef', '../../../assets/empty-file.txt',                   ]
    [ '3n', '../../../assets/file-with-3-lines-no-eofnl.txt',   ]
    [ '3w', '../../../assets/file-with-3-lines-with-eofnl.txt', ]
    [ '1n', '../../../assets/file-with-single-nl.txt',          ], ]
  #.........................................................................................................
  result  = []
  for [ id, path, ] in paths
    path  = PATH.resolve PATH.join __dirname, path
    lnr   = 0
    for line from GUY.fs.walk_lines path
      lnr++
      result.push "#{id}##{lnr}:#{line}"
  #.........................................................................................................
  T?.eq result, [ 'ef#1:', '3n#1:1', '3n#2:2', '3n#3:3', '3w#1:1', '3w#2:2', '3w#3:3', '1n#1:' ]
  done?()
  return null



############################################################################################################
if require.main is module then do =>
  # @GUY_fs_walk_lines_yields_from_empty_file()
  # test @, { timeout: 5000, }
  # test @[ "guy.fs.walk_circular_lines() can iterate given number of loops" ]
  # test @[ "guy.fs.get_content_hash" ]
  # @[ "guy.fs.get_content_hash" ]()
  # test @[ "guy.props.def(), .hide()" ]
  # @[ "configurator" ]()
  # test @[ "await with async steampipes" ]
  # test @[ "nowait with async steampipes" ]
  # test @[ "use-call" ]
  # @[ "await with async steampipes" ]()
  # @[ "demo" ]()
  # @[ "nowait" ]()
  @GUY_fs_get_content_hash()
  test @GUY_fs_get_content_hash


