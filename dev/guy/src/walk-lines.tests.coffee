
'use strict'


############################################################################################################
PATH                      = require 'path'
FS                        = require 'fs'
#...........................................................................................................
CND                       = require 'cnd'
rpr                       = CND.rpr
badge                     = 'GUY/TESTS/WALK-LINES'
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


#===========================================================================================================
# TESTS
#-----------------------------------------------------------------------------------------------------------
@GUY_fs_walk_lines_yields_from_empty_file = ( T, done ) ->
  GUY     = require H.guy_path
  probes_and_matchers = [
    [ '../../../assets/a-few-words.txt',                            [ "1:Ångström's", "2:éclair", "3:éclair's", "4:éclairs", "5:éclat", "6:éclat's", "7:élan", "8:élan's", "9:émigré", "10:émigré's", ], ]
    [ '../../../assets/datamill/empty-file.txt',                    [ '1:',                                                                                                                           ], ]
    [ '../../../assets/datamill/file-with-single-nl.txt',           [ '1:', '2:',                                                                                                                     ], ]
    [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt',    [ '1:1', '2:2', '3:3',                                                                                                            ], ]
    [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt',  [ '1:1', '2:2', '3:3', '4:',                                                                                                      ], ]
    [ '../../../assets/datamill/windows-crlf.txt',                  [ '1:this', '2:file', '3:written', '4:on', '5:MS Notepad'                                                                         ], ]
    [ '../../../assets/datamill/mixed-usage.txt',                   [ '1:all', '2:bases', '3:', '4:are belong', '5:to us', '6:' ], ]
    ]
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    # for chunk_size in [ 1 .. 200 ] by +10
    for chunk_size in [ 20 ]
      result  = []
      # whisper '^45-1^', '----------------------------------'
      path  = PATH.resolve PATH.join __dirname, probe
      lnr   = 0
      for line from GUY.fs.walk_lines path, { chunk_size, }
        lnr++
        result.push "#{lnr}:#{line}"
      urge '^35-1^', result
      help '^35-2^', matcher
      T?.eq result, matcher
  #.........................................................................................................
  done?()
  return null

# #-----------------------------------------------------------------------------------------------------------
# @GUY_fs_walk_lines_with_custom_newline = ( T, done ) ->
#   GUY     = require H.guy_path
#   GUY.temp.with_file ({ path, }) ->
#     FS.writeFileSync path, "foo𠀀𠀐bar𠀀𠀐baz𠀀𠀐"
#     #.......................................................................................................
#     # for chunk_size in [ 1 .. 5 ] by +1
#     for chunk_size in [ 1 .. 1 ] by +1
#       result  = []
#       lnr     = 0
#       for line from GUY.fs.walk_lines path, { chunk_size, newline: '𠀀𠀐', }
#         lnr++
#         debug '^4323^', "##{lnr}:#{line}"
#         result.push "##{lnr}:#{line}"
#       T?.eq result, [ '#1:foo', '#2:bar', '#3:baz', '#4:', ]
#   #.........................................................................................................
#   done?()
#   return null



############################################################################################################
if require.main is module then do =>
  # test @
  @GUY_fs_walk_lines_yields_from_empty_file()
  # test @GUY_fs_walk_lines_yields_from_empty_file


