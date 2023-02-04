
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
@GUY_fs_walk_lines = ( T, done ) ->
  GUY     = require H.guy_path
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt',                           null,              ], [ "1:Ångström's", "2:éclair", "3:éclair's", "4:éclairs", "5:éclat", "6:éclat's", "7:élan", "8:élan's", "9:émigré", "10:émigré's", ], ]
    [ [ '../../../assets/datamill/empty-file.txt',                   null,              ], [ '1:',                                                                                                                           ], ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt',          null,              ], [ '1:', '2:',                                                                                                                     ], ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt',   null,              ], [ '1:1', '2:2', '3:3',                                                                                                            ], ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null,              ], [ '1:1', '2:2', '3:3', '4:',                                                                                                      ], ]
    [ [ '../../../assets/datamill/windows-crlf.txt',                 null,              ], [ '1:this', '2:file', '3:written', '4:on', '5:MS Notepad'                                                                         ], ]
    [ [ '../../../assets/datamill/mixed-usage.txt',                  null,              ], [ '1:all', '2:bases', '3:', '4:are belong', '5:to us', '6:' ], ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt',              null,              ], [ '1:', '2:', '3:', '4:', '5:', '6:', ], ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt',     null,              ], [ '1:line', '2:with', '3:trailing', '4:whitespace', ], ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt',     { trim: true, },   ], [ '1:line', '2:with', '3:trailing', '4:whitespace', ], ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt',     { trim: false, },  ], [ '1:line   ', '2:with   ', '3:trailing\t\t', '4:whitespace\u3000 ', ], ]
    ]
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    for chunk_size in [ 1 .. 200 ] by +10
    # for chunk_size in [ 200 ]
      result    = []
      result_2  = []
      # whisper '^45-1^', '----------------------------------'
      [ path
        cfg ]   = probe
      path      = PATH.resolve PATH.join __dirname, path
      text      = FS.readFileSync path, { encoding: 'utf-8', }
      matcher_2 = text.split /\r\n|\r|\n/u
      matcher_2 = ( line.trimEnd() for line in matcher_2 ) if ( cfg?.trim ? true )
      lnr       = 0
      for line from GUY.fs.walk_lines path, { chunk_size, cfg..., }
        lnr++
        result.push "#{lnr}:#{line}"
        result_2.push line
      # urge '^35-1^', result
      # help '^35-2^', matcher
      T?.eq result, matcher
      T?.eq result_2, matcher_2
  #.........................................................................................................
  # debug '^45-1^', '\r\r\n\r\n\n\n'.split /\r\n|\r|\n/
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_str_walk_lines = ( T, done ) ->
  GUY     = require H.guy_path
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt',                           null,              ], [ "1:Ångström's", "2:éclair", "3:éclair's", "4:éclairs", "5:éclat", "6:éclat's", "7:élan", "8:élan's", "9:émigré", "10:émigré's", ], ]
    [ [ '../../../assets/datamill/empty-file.txt',                   null,              ], [ '1:',                                                                                                                           ], ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt',          null,              ], [ '1:', '2:',                                                                                                                     ], ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt',   null,              ], [ '1:1', '2:2', '3:3',                                                                                                            ], ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null,              ], [ '1:1', '2:2', '3:3', '4:',                                                                                                      ], ]
    [ [ '../../../assets/datamill/windows-crlf.txt',                 null,              ], [ '1:this', '2:file', '3:written', '4:on', '5:MS Notepad'                                                                         ], ]
    [ [ '../../../assets/datamill/mixed-usage.txt',                  null,              ], [ '1:all', '2:bases', '3:', '4:are belong', '5:to us', '6:' ], ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt',              null,              ], [ '1:', '2:', '3:', '4:', '5:', '6:', ], ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt',     null,              ], [ '1:line', '2:with', '3:trailing', '4:whitespace', ], ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt',     { trim: true, },   ], [ '1:line', '2:with', '3:trailing', '4:whitespace', ], ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt',     { trim: false, },  ], [ '1:line   ', '2:with   ', '3:trailing\t\t', '4:whitespace\u3000 ', ], ]
    ]
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    result    = []
    result_2  = []
    [ path
      cfg ]   = probe
    path      = PATH.resolve PATH.join __dirname, path
    text      = FS.readFileSync path, { encoding: 'utf-8', }
    matcher_2 = text.split /\r\n|\r|\n/u
    matcher_2 = ( line.trimEnd() for line in matcher_2 ) if ( cfg?.trim ? true )
    lnr       = 0
    for line from GUY.str.walk_lines text, cfg
      lnr++
      result.push "#{lnr}:#{line}"
      result_2.push line
    # whisper '^35-1^', rpr text
    # urge '^35-1^', result
    # help '^35-2^', matcher
    T?.eq result, matcher
    T?.eq result_2, matcher_2
  #.........................................................................................................
  # debug '^45-1^', '\r\r\n\r\n\n\n'.split /\r\n|\r|\n/
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
  test @
  # test @GUY_fs_walk_lines

