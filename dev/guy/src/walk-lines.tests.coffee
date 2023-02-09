
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
    [ [ '../../../assets/datamill/mixed-usage.txt',                  null,              ], [ '1:all', '2:𠀀bases', '3:', '4:are belong', '5:𠀀to us', '6:' ], ]
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
@GUY_fs_walk_lines_with_positions = ( T, done ) ->
  GUY     = require H.guy_path
  probes_and_matchers = [
    # [ [ '../../../assets/a-few-words.txt', null ], [ { lnr: 1, line: "Ångström's", nl: '\n' }, { lnr: 2, line: 'éclair', nl: '\n' }, { lnr: 3, line: "éclair's", nl: '\n' }, { lnr: 4, line: 'éclairs', nl: '\n' }, { lnr: 5, line: 'éclat', nl: '\n' }, { lnr: 6, line: "éclat's", nl: '\n' }, { lnr: 7, line: 'élan', nl: '\n' }, { lnr: 8, line: "élan's", nl: '\n' }, { lnr: 9, line: 'émigré', nl: '\n' }, { lnr: 10, line: "émigré's", nl: '' } ] ]
    # [ [ '../../../assets/datamill/empty-file.txt', null ], [ { lnr: 1, line: '', nl: '' } ] ]
    # [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], [ { lnr: 1, line: '', nl: '\n' }, { lnr: 2, line: '', nl: '' } ] ]
    # [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], [ { lnr: 1, line: '1', nl: '\n' }, { lnr: 2, line: '2', nl: '\n' }, { lnr: 3, line: '3', nl: '' } ] ]
    # [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], [ { lnr: 1, line: 'line', nl: '\n' }, { lnr: 2, line: 'with', nl: '\n' }, { lnr: 3, line: 'trailing', nl: '\n' }, { lnr: 4, line: 'whitespace', nl: '' } ] ]
    # [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: true } ], [ { lnr: 1, line: 'line', nl: '\n' }, { lnr: 2, line: 'with', nl: '\n' }, { lnr: 3, line: 'trailing', nl: '\n' }, { lnr: 4, line: 'whitespace', nl: '' } ] ]
    # [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: false } ], [ { lnr: 1, line: 'line   ', nl: '\n' }, { lnr: 2, line: 'with   ', nl: '\n' }, { lnr: 3, line: 'trailing\t\t', nl: '\n' }, { lnr: 4, line: 'whitespace　 ', nl: '' } ] ]
    # [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], [ { lnr: 1, line: '1', nl: '\n' }, { lnr: 2, line: '2', nl: '\n' }, { lnr: 3, line: '3', nl: '\n' }, { lnr: 4, line: '', nl: '' } ] ]
    # [ [ '../../../assets/datamill/lines-with-lf.txt', null ], [ { lnr: 1, line: 'line1', nl: '\r' }, { lnr: 2, line: 'line2', nl: '\r' }, { lnr: 3, line: 'line3', nl: '\r' }, { lnr: 4, line: '', nl: '' } ] ]


    # [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], [ { lnr: 1, line: '', nl: '\r' }, { lnr: 2, line: '', nl: '\r\n' }, { lnr: 3, line: '', nl: '\r\n' }, { lnr: 4, line: '', nl: '\n' }, { lnr: 5, line: '', nl: '\n' }, { lnr: 6, line: '', nl: '' } ] ]
    # [ [ '../../../assets/datamill/windows-crlf.txt', null ], [ { lnr: 1, line: 'this', nl: '\r\n' }, { lnr: 2, line: 'file', nl: '\r\n' }, { lnr: 3, line: 'written', nl: '\r\n' }, { lnr: 4, line: 'on', nl: '\r\n' }, { lnr: 5, line: 'MS Notepad', nl: '' } ] ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ], [ { lnr: 1, line: 'all', nl: '\r' }, { lnr: 2, line: '𠀀bases', nl: '\r' }, { lnr: 3, line: '', nl: '\r' }, { lnr: 4, line: 'are belong', nl: '\r\n' }, { lnr: 5, line: '𠀀to us', nl: '\n' }, { lnr: 6, line: '', nl: '' } ] ]
    # [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], [ { lnr: 1, line: 'line1', nl: '\r\n' }, { lnr: 2, line: 'line2', nl: '\r\n' }, { lnr: 3, line: 'line3', nl: '\r\n' }, { lnr: 4, line: '', nl: '' } ] ]
    ]
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    # for chunk_size in [ 1 .. 200 ] by +10
    for chunk_size in [ 200 ]
      result    = []
      [ path
        cfg ]   = probe
      help '^423^', path
      path      = PATH.resolve PATH.join __dirname, path
      lnr       = 0
      for d from GUY.fs.walk_lines_with_positions path, { chunk_size, cfg..., }
        urge '^108-1^', d
        result.push d
      T?.eq result, matcher
  #.........................................................................................................
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
    [ [ '../../../assets/datamill/mixed-usage.txt',                  null,              ], [ '1:all', '2:𠀀bases', '3:', '4:are belong', '5:𠀀to us', '6:' ], ]
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
    # debug '^3458934891^', T, result, matcher
  #.........................................................................................................
  # debug '^45-1^', '\r\r\n\r\n\n\n'.split /\r\n|\r|\n/
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_str_walk_lines_with_positions = ( T, done ) ->
  GUY     = require H.guy_path
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt', null ], [ { lnr: 1, line: "Ångström's", nl: '\n' }, { lnr: 2, line: 'éclair', nl: '\n' }, { lnr: 3, line: "éclair's", nl: '\n' }, { lnr: 4, line: 'éclairs', nl: '\n' }, { lnr: 5, line: 'éclat', nl: '\n' }, { lnr: 6, line: "éclat's", nl: '\n' }, { lnr: 7, line: 'élan', nl: '\n' }, { lnr: 8, line: "élan's", nl: '\n' }, { lnr: 9, line: 'émigré', nl: '\n' }, { lnr: 10, line: "émigré's", nl: '' } ] ]
    [ [ '../../../assets/datamill/empty-file.txt', null ], [ { lnr: 1, line: '', nl: '' } ] ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], [ { lnr: 1, line: '', nl: '\n' }, { lnr: 2, line: '', nl: '' } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], [ { lnr: 1, line: '1', nl: '\n' }, { lnr: 2, line: '2', nl: '\n' }, { lnr: 3, line: '3', nl: '' } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], [ { lnr: 1, line: '1', nl: '\n' }, { lnr: 2, line: '2', nl: '\n' }, { lnr: 3, line: '3', nl: '\n' }, { lnr: 4, line: '', nl: '' } ] ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ], [ { lnr: 1, line: 'this', nl: '\r\n' }, { lnr: 2, line: 'file', nl: '\r\n' }, { lnr: 3, line: 'written', nl: '\r\n' }, { lnr: 4, line: 'on', nl: '\r\n' }, { lnr: 5, line: 'MS Notepad', nl: '' } ] ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ], [ { lnr: 1, line: 'all', nl: '\r' }, { lnr: 2, line: '𠀀bases', nl: '\r' }, { lnr: 3, line: '', nl: '\r' }, { lnr: 4, line: 'are belong', nl: '\r\n' }, { lnr: 5, line: '𠀀to us', nl: '\n' }, { lnr: 6, line: '', nl: '' } ] ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], [ { lnr: 1, line: '', nl: '\r' }, { lnr: 2, line: '', nl: '\r\n' }, { lnr: 3, line: '', nl: '\r\n' }, { lnr: 4, line: '', nl: '\n' }, { lnr: 5, line: '', nl: '\n' }, { lnr: 6, line: '', nl: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], [ { lnr: 1, line: 'line', nl: '\n' }, { lnr: 2, line: 'with', nl: '\n' }, { lnr: 3, line: 'trailing', nl: '\n' }, { lnr: 4, line: 'whitespace', nl: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: true } ], [ { lnr: 1, line: 'line', nl: '\n' }, { lnr: 2, line: 'with', nl: '\n' }, { lnr: 3, line: 'trailing', nl: '\n' }, { lnr: 4, line: 'whitespace', nl: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: false } ], [ { lnr: 1, line: 'line   ', nl: '\n' }, { lnr: 2, line: 'with   ', nl: '\n' }, { lnr: 3, line: 'trailing\t\t', nl: '\n' }, { lnr: 4, line: 'whitespace　 ', nl: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ], [ { lnr: 1, line: 'line1', nl: '\r' }, { lnr: 2, line: 'line2', nl: '\r' }, { lnr: 3, line: 'line3', nl: '\r' }, { lnr: 4, line: '', nl: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], [ { lnr: 1, line: 'line1', nl: '\r\n' }, { lnr: 2, line: 'line2', nl: '\r\n' }, { lnr: 3, line: 'line3', nl: '\r\n' }, { lnr: 4, line: '', nl: '' } ] ]
    ]
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    result    = []
    [ path
      cfg ]   = probe
    path      = PATH.resolve PATH.join __dirname, path
    text      = FS.readFileSync path, { encoding: 'utf-8', }
    for d from GUY.str.walk_lines_with_positions text, cfg
      result.push d
    T?.eq result, matcher
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_fs__walk_lines_get_next_line_part = ( T, done ) ->
  GUY       = require H.guy_path
  buffer_0a = Buffer.from [ 0x0a ]
  buffer_0d = Buffer.from [ 0x0d ]
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt', null ], [ [ "Ångström's", buffer_0a ], [ 'éclair', buffer_0a ], [ "éclair's", buffer_0a ], [ 'éclairs', buffer_0a ], [ 'éclat', buffer_0a ], [ "éclat's", buffer_0a ], [ 'élan', buffer_0a ], [ "élan's", buffer_0a ], [ 'émigré', buffer_0a ], [ "émigré's", null ] ] ]
    [ [ '../../../assets/datamill/empty-file.txt', null ], [] ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], [ [ '', buffer_0a ] ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], [ [ '1', buffer_0a ], [ '2', buffer_0a ], [ '3', null ] ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], [ [ '1', buffer_0a ], [ '2', buffer_0a ], [ '3', buffer_0a ] ] ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ], [ [ 'this', buffer_0d ], [ '', buffer_0a ], [ 'file', buffer_0d ], [ '', buffer_0a ], [ 'written', buffer_0d ], [ '', buffer_0a ], [ 'on', buffer_0d ], [ '', buffer_0a ], [ 'MS Notepad', null ] ] ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ], [ [ 'all', buffer_0d ], [ '𠀀bases', buffer_0d ], [ '', buffer_0d ], [ 'are belong', buffer_0d ], [ '', buffer_0a ], [ '𠀀to us', buffer_0a ] ] ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], [ [ '', buffer_0d ], [ '', buffer_0d ], [ '', buffer_0a ], [ '', buffer_0d ], [ '', buffer_0a ], [ '', buffer_0a ], [ '', buffer_0a ] ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], [ [ 'line   ', buffer_0a ], [ 'with   ', buffer_0a ], [ 'trailing\t\t', buffer_0a ], [ 'whitespace　 ', null ] ] ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ], [ [ 'line1', buffer_0d ], [ 'line2', buffer_0d ], [ 'line3', buffer_0d ] ] ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], [ [ 'line1', buffer_0d ], [ '', buffer_0a ], [ 'line2', buffer_0d ], [ '', buffer_0a ], [ 'line3', buffer_0d ], [ '', buffer_0a ] ] ]
    ]
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    do =>
      result    = []
      [ path ]  = probe
      path      = PATH.resolve PATH.join __dirname, path
      buffer    = FS.readFileSync path
      first_idx = 0
      last_idx  = buffer.length - 1
      loop
        break if first_idx > last_idx
        d = GUY.fs._walk_lines_get_next_line_part buffer, first_idx
        result.push [ d.material.toString(), d.eol, ]
        first_idx = d.next_idx
      echo [ probe, result, ]
      T?.eq result, matcher
  #.........................................................................................................
  done?()
  return null




############################################################################################################
if require.main is module then do =>
  # @GUY_fs_walk_lines_with_positions()
  # test @GUY_fs_walk_lines_with_positions
  # @GUY_str_walk_lines_with_positions()
  # test @GUY_str_walk_lines_with_positions
  # test @
  # test @GUY_fs_walk_lines
  # @GUY_str_walk_lines()
  # test @GUY_str_walk_lines
  # @GUY_fs__walk_lines_get_next_line_part()
  test @GUY_fs__walk_lines_get_next_line_part

