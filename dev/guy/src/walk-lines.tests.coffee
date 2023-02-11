
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
# TESTS FOR STR
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
    [ [ '../../../assets/a-few-words.txt', null ], [ { lnr: 1, line: "Ångström's", eol: '\n' }, { lnr: 2, line: 'éclair', eol: '\n' }, { lnr: 3, line: "éclair's", eol: '\n' }, { lnr: 4, line: 'éclairs', eol: '\n' }, { lnr: 5, line: 'éclat', eol: '\n' }, { lnr: 6, line: "éclat's", eol: '\n' }, { lnr: 7, line: 'élan', eol: '\n' }, { lnr: 8, line: "élan's", eol: '\n' }, { lnr: 9, line: 'émigré', eol: '\n' }, { lnr: 10, line: "émigré's", eol: '' } ] ]
    [ [ '../../../assets/datamill/empty-file.txt', null ], [ { lnr: 1, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], [ { lnr: 1, line: '', eol: '\n' }, { lnr: 2, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], [ { lnr: 1, line: '1', eol: '\n' }, { lnr: 2, line: '2', eol: '\n' }, { lnr: 3, line: '3', eol: '' } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], [ { lnr: 1, line: '1', eol: '\n' }, { lnr: 2, line: '2', eol: '\n' }, { lnr: 3, line: '3', eol: '\n' }, { lnr: 4, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ], [ { lnr: 1, line: 'this', eol: '\r\n' }, { lnr: 2, line: 'file', eol: '\r\n' }, { lnr: 3, line: 'written', eol: '\r\n' }, { lnr: 4, line: 'on', eol: '\r\n' }, { lnr: 5, line: 'MS Notepad', eol: '' } ] ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ], [ { lnr: 1, line: 'all', eol: '\r' }, { lnr: 2, line: '𠀀bases', eol: '\r' }, { lnr: 3, line: '', eol: '\r' }, { lnr: 4, line: 'are belong', eol: '\r\n' }, { lnr: 5, line: '𠀀to us', eol: '\n' }, { lnr: 6, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], [ { lnr: 1, line: '', eol: '\r' }, { lnr: 2, line: '', eol: '\r\n' }, { lnr: 3, line: '', eol: '\r\n' }, { lnr: 4, line: '', eol: '\n' }, { lnr: 5, line: '', eol: '\n' }, { lnr: 6, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], [ { lnr: 1, line: 'line', eol: '\n' }, { lnr: 2, line: 'with', eol: '\n' }, { lnr: 3, line: 'trailing', eol: '\n' }, { lnr: 4, line: 'whitespace', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: true } ], [ { lnr: 1, line: 'line', eol: '\n' }, { lnr: 2, line: 'with', eol: '\n' }, { lnr: 3, line: 'trailing', eol: '\n' }, { lnr: 4, line: 'whitespace', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: false } ], [ { lnr: 1, line: 'line   ', eol: '\n' }, { lnr: 2, line: 'with   ', eol: '\n' }, { lnr: 3, line: 'trailing\t\t', eol: '\n' }, { lnr: 4, line: 'whitespace　 ', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ], [ { lnr: 1, line: 'line1', eol: '\r' }, { lnr: 2, line: 'line2', eol: '\r' }, { lnr: 3, line: 'line3', eol: '\r' }, { lnr: 4, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], [ { lnr: 1, line: 'line1', eol: '\r\n' }, { lnr: 2, line: 'line2', eol: '\r\n' }, { lnr: 3, line: 'line3', eol: '\r\n' }, { lnr: 4, line: '', eol: '' } ] ]
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


#===========================================================================================================
# TESTS FOR FS
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
    [ [ '../../../assets/a-few-words.txt', null ], [ { lnr: 1, line: "Ångström's", eol: '\n' }, { lnr: 2, line: 'éclair', eol: '\n' }, { lnr: 3, line: "éclair's", eol: '\n' }, { lnr: 4, line: 'éclairs', eol: '\n' }, { lnr: 5, line: 'éclat', eol: '\n' }, { lnr: 6, line: "éclat's", eol: '\n' }, { lnr: 7, line: 'élan', eol: '\n' }, { lnr: 8, line: "élan's", eol: '\n' }, { lnr: 9, line: 'émigré', eol: '\n' }, { lnr: 10, line: "émigré's", eol: '' } ] ]
    [ [ '../../../assets/datamill/empty-file.txt', null ], [ { lnr: 1, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], [ { lnr: 1, line: '', eol: '\n' }, { lnr: 2, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], [ { lnr: 1, line: '1', eol: '\n' }, { lnr: 2, line: '2', eol: '\n' }, { lnr: 3, line: '3', eol: '' } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], [ { lnr: 1, line: '1', eol: '\n' }, { lnr: 2, line: '2', eol: '\n' }, { lnr: 3, line: '3', eol: '\n' }, { lnr: 4, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ], [ { lnr: 1, line: 'this', eol: '\r\n' }, { lnr: 2, line: 'file', eol: '\r\n' }, { lnr: 3, line: 'written', eol: '\r\n' }, { lnr: 4, line: 'on', eol: '\r\n' }, { lnr: 5, line: 'MS Notepad', eol: '' } ] ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ], [ { lnr: 1, line: 'all', eol: '\r' }, { lnr: 2, line: '𠀀bases', eol: '\r' }, { lnr: 3, line: '', eol: '\r' }, { lnr: 4, line: 'are belong', eol: '\r\n' }, { lnr: 5, line: '𠀀to us', eol: '\n' }, { lnr: 6, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], [ { lnr: 1, line: '', eol: '\r' }, { lnr: 2, line: '', eol: '\r\n' }, { lnr: 3, line: '', eol: '\r\n' }, { lnr: 4, line: '', eol: '\n' }, { lnr: 5, line: '', eol: '\n' }, { lnr: 6, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], [ { lnr: 1, line: 'line', eol: '\n' }, { lnr: 2, line: 'with', eol: '\n' }, { lnr: 3, line: 'trailing', eol: '\n' }, { lnr: 4, line: 'whitespace', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: true } ], [ { lnr: 1, line: 'line', eol: '\n' }, { lnr: 2, line: 'with', eol: '\n' }, { lnr: 3, line: 'trailing', eol: '\n' }, { lnr: 4, line: 'whitespace', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: false } ], [ { lnr: 1, line: 'line   ', eol: '\n' }, { lnr: 2, line: 'with   ', eol: '\n' }, { lnr: 3, line: 'trailing\t\t', eol: '\n' }, { lnr: 4, line: 'whitespace　 ', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ], [ { lnr: 1, line: 'line1', eol: '\r' }, { lnr: 2, line: 'line2', eol: '\r' }, { lnr: 3, line: 'line3', eol: '\r' }, { lnr: 4, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], [ { lnr: 1, line: 'line1', eol: '\r\n' }, { lnr: 2, line: 'line2', eol: '\r\n' }, { lnr: 3, line: 'line3', eol: '\r\n' }, { lnr: 4, line: '', eol: '' } ] ]
    ]
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    result    = []
    [ path
      cfg ]   = probe
    path      = PATH.resolve PATH.join __dirname, path
    # text      = FS.readFileSync path, { encoding: 'utf-8', }
    for d from GUY.fs.walk_lines_with_positions path, cfg
      # d.line  = d.line.toString()
      # d.eol   = d.eol.toString()
      result.push d
    T?.eq result, matcher
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_fs_walk_lines_with_positions_no_encoding = ( T, done ) ->
  GUY     = require H.guy_path
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt', null ], [ { lnr: 1, line: "Ångström's", eol: '\n' }, { lnr: 2, line: 'éclair', eol: '\n' }, { lnr: 3, line: "éclair's", eol: '\n' }, { lnr: 4, line: 'éclairs', eol: '\n' }, { lnr: 5, line: 'éclat', eol: '\n' }, { lnr: 6, line: "éclat's", eol: '\n' }, { lnr: 7, line: 'élan', eol: '\n' }, { lnr: 8, line: "élan's", eol: '\n' }, { lnr: 9, line: 'émigré', eol: '\n' }, { lnr: 10, line: "émigré's", eol: '' } ] ]
    [ [ '../../../assets/datamill/empty-file.txt', null ], [ { lnr: 1, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], [ { lnr: 1, line: '', eol: '\n' }, { lnr: 2, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], [ { lnr: 1, line: '1', eol: '\n' }, { lnr: 2, line: '2', eol: '\n' }, { lnr: 3, line: '3', eol: '' } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], [ { lnr: 1, line: '1', eol: '\n' }, { lnr: 2, line: '2', eol: '\n' }, { lnr: 3, line: '3', eol: '\n' }, { lnr: 4, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ], [ { lnr: 1, line: 'this', eol: '\r\n' }, { lnr: 2, line: 'file', eol: '\r\n' }, { lnr: 3, line: 'written', eol: '\r\n' }, { lnr: 4, line: 'on', eol: '\r\n' }, { lnr: 5, line: 'MS Notepad', eol: '' } ] ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ], [ { lnr: 1, line: 'all', eol: '\r' }, { lnr: 2, line: '𠀀bases', eol: '\r' }, { lnr: 3, line: '', eol: '\r' }, { lnr: 4, line: 'are belong', eol: '\r\n' }, { lnr: 5, line: '𠀀to us', eol: '\n' }, { lnr: 6, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], [ { lnr: 1, line: '', eol: '\r' }, { lnr: 2, line: '', eol: '\r\n' }, { lnr: 3, line: '', eol: '\r\n' }, { lnr: 4, line: '', eol: '\n' }, { lnr: 5, line: '', eol: '\n' }, { lnr: 6, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], [ { lnr: 1, line: 'line   ', eol: '\n' }, { lnr: 2, line: 'with   ', eol: '\n' }, { lnr: 3, line: 'trailing\t\t', eol: '\n' }, { lnr: 4, line: 'whitespace　 ', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: true } ], [ { lnr: 1, line: 'line   ', eol: '\n' }, { lnr: 2, line: 'with   ', eol: '\n' }, { lnr: 3, line: 'trailing\t\t', eol: '\n' }, { lnr: 4, line: 'whitespace　 ', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', { trim: false } ], [ { lnr: 1, line: 'line   ', eol: '\n' }, { lnr: 2, line: 'with   ', eol: '\n' }, { lnr: 3, line: 'trailing\t\t', eol: '\n' }, { lnr: 4, line: 'whitespace　 ', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ], [ { lnr: 1, line: 'line1', eol: '\r' }, { lnr: 2, line: 'line2', eol: '\r' }, { lnr: 3, line: 'line3', eol: '\r' }, { lnr: 4, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], [ { lnr: 1, line: 'line1', eol: '\r\n' }, { lnr: 2, line: 'line2', eol: '\r\n' }, { lnr: 3, line: 'line3', eol: '\r\n' }, { lnr: 4, line: '', eol: '' } ] ]
    ]
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    result    = []
    [ path
      cfg ]   = probe
    path      = PATH.resolve PATH.join __dirname, path
    for d from GUY.fs.walk_lines_with_positions path, { cfg..., encoding: null, }
      T?.ok d.eol isnt GUY.fs._C_cr_buffer
      T?.ok d.eol isnt GUY.fs._C_lf_buffer
      d.line  = d.line.toString()
      d.eol   = d.eol.toString()
      result.push d
    T?.eq result, matcher
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_fs__walk_lines_with_positions = ( T, done ) ->
  GUY     = require H.guy_path
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt', null ], [ { lnr: 1, line: "Ångström's", eol: '\n' }, { lnr: 2, line: 'éclair', eol: '\n' }, { lnr: 3, line: "éclair's", eol: '\n' }, { lnr: 4, line: 'éclairs', eol: '\n' }, { lnr: 5, line: 'éclat', eol: '\n' }, { lnr: 6, line: "éclat's", eol: '\n' }, { lnr: 7, line: 'élan', eol: '\n' }, { lnr: 8, line: "élan's", eol: '\n' }, { lnr: 9, line: 'émigré', eol: '\n' }, { lnr: 10, line: "émigré's", eol: '' } ] ]
    [ [ '../../../assets/datamill/empty-file.txt', null ], [ { lnr: 1, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], [ { lnr: 1, line: '', eol: '\n' }, { lnr: 2, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], [ { lnr: 1, line: '1', eol: '\n' }, { lnr: 2, line: '2', eol: '\n' }, { lnr: 3, line: '3', eol: '' } ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], [ { lnr: 1, line: '1', eol: '\n' }, { lnr: 2, line: '2', eol: '\n' }, { lnr: 3, line: '3', eol: '\n' }, { lnr: 4, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ], [ { lnr: 1, line: 'this', eol: '\r\n' }, { lnr: 2, line: 'file', eol: '\r\n' }, { lnr: 3, line: 'written', eol: '\r\n' }, { lnr: 4, line: 'on', eol: '\r\n' }, { lnr: 5, line: 'MS Notepad', eol: '' } ] ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], [ { lnr: 1, line: '', eol: '\r' }, { lnr: 2, line: '', eol: '\r\n' }, { lnr: 3, line: '', eol: '\r\n' }, { lnr: 4, line: '', eol: '\n' }, { lnr: 5, line: '', eol: '\n' }, { lnr: 6, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], [ { lnr: 1, line: 'line   ', eol: '\n' }, { lnr: 2, line: 'with   ', eol: '\n' }, { lnr: 3, line: 'trailing\t\t', eol: '\n' }, { lnr: 4, line: 'whitespace　 ', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], [ { lnr: 1, line: 'line1', eol: '\r\n' }, { lnr: 2, line: 'line2', eol: '\r\n' }, { lnr: 3, line: 'line3', eol: '\r\n' }, { lnr: 4, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ], [ { lnr: 1, line: 'line1', eol: '\r' }, { lnr: 2, line: 'line2', eol: '\r' }, { lnr: 3, line: 'line3', eol: '\r' }, { lnr: 4, line: '', eol: '' } ] ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ], [ { lnr: 1, line: 'all', eol: '\r' }, { lnr: 2, line: '𠀀bases', eol: '\r' }, { lnr: 3, line: '', eol: '\r' }, { lnr: 4, line: 'are belong', eol: '\r\n' }, { lnr: 5, line: '𠀀to us', eol: '\n' }, { lnr: 6, line: '', eol: '' } ] ]
    ]
  #.........................................................................................................
  for [ probe, matcher, ] in probes_and_matchers
    # echo '^2343^', GUY.trm.steel probe[ 0 ]
    # echo '^12-2^', GUY.trm.gold matcher
    for chunk_size in [ 1 .. 200 ]
      result    = []
      [ path
        cfg ]   = probe
      path      = PATH.resolve PATH.join __dirname, path
      text      = FS.readFileSync path, { encoding: 'utf-8', }
      for d from GUY.fs._walk_lines_with_positions path, chunk_size
        T?.eq ( type_of d.line  ), 'buffer'
        T?.eq ( type_of d.eol   ), 'buffer'
        d.line  = d.line.toString()
        d.eol   = d.eol.toString()
        # info '^43-1^', d
        result.push d
      # echo '^12-1^', result, chunk_size
      T?.eq result, matcher
    # echo '^12-2^', GUY.trm.gold matcher
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_fs__walk_lines__walk_advancements = ( T, done ) ->
  GUY     = require H.guy_path
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt', null ], "Ångström's\néclair\néclair's\néclairs\néclat\néclat's\nélan\nélan's\némigré\némigré's", null ]
    [ [ '../../../assets/datamill/empty-file.txt', null ], '', null ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], '\n', null ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], '1\n2\n3', null ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], '1\n2\n3\n', null ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ], 'this\r\nfile\r\nwritten\r\non\r\nMS Notepad', null ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ], 'all\r𠀀bases\r\rare belong\r\n𠀀to us\n', null ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], '\r\r\n\r\n\n\n', null ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], 'line   \nwith   \ntrailing\t\t\nwhitespace　 ', null ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ], 'line1\rline2\rline3\r', null ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], 'line1\r\nline2\r\nline3\r\n', null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      for chunk_size in [ 1 .. 200 ] by +10
        result    = []
        [ path ]  = probe
        path      = PATH.resolve PATH.join __dirname, path
        for buffer from GUY.fs.walk_buffers path, { chunk_size, }
          for { material, eol, } from GUY.fs._walk_lines__walk_advancements buffer
            # info { material, eol, }
            result.push material
            result.push eol
        result = Buffer.concat result
        T?.eq result.length, ( FS.statSync path ).size
      T?.eq ( Buffer.compare ( Buffer.concat [ ( GUY.fs.walk_buffers path )..., ] ), ( FS.readFileSync path ) ), 0
      result = result.toString()
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_fs__walk_lines__advance = ( T, done ) ->
  GUY                 = require H.guy_path
  C_empty_buffer      = Buffer.from []
  C_cr_buffer         = Buffer.from [ 0x0d ]
  C_lf_buffer         = Buffer.from [ 0x0a ]
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt', null ], [ [ "Ångström's", C_lf_buffer ], [ 'éclair', C_lf_buffer ], [ "éclair's", C_lf_buffer ], [ 'éclairs', C_lf_buffer ], [ 'éclat', C_lf_buffer ], [ "éclat's", C_lf_buffer ], [ 'élan', C_lf_buffer ], [ "élan's", C_lf_buffer ], [ 'émigré', C_lf_buffer ], [ "émigré's", C_empty_buffer ] ] ]
    [ [ '../../../assets/datamill/empty-file.txt', null ], [] ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], [ [ '', C_lf_buffer ] ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], [ [ '1', C_lf_buffer ], [ '2', C_lf_buffer ], [ '3', C_empty_buffer ] ] ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], [ [ '1', C_lf_buffer ], [ '2', C_lf_buffer ], [ '3', C_lf_buffer ] ] ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ], [ [ 'this', C_cr_buffer ], [ '', C_lf_buffer ], [ 'file', C_cr_buffer ], [ '', C_lf_buffer ], [ 'written', C_cr_buffer ], [ '', C_lf_buffer ], [ 'on', C_cr_buffer ], [ '', C_lf_buffer ], [ 'MS Notepad', C_empty_buffer ] ] ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ], [ [ 'all', C_cr_buffer ], [ '𠀀bases', C_cr_buffer ], [ '', C_cr_buffer ], [ 'are belong', C_cr_buffer ], [ '', C_lf_buffer ], [ '𠀀to us', C_lf_buffer ] ] ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], [ [ '', C_cr_buffer ], [ '', C_cr_buffer ], [ '', C_lf_buffer ], [ '', C_cr_buffer ], [ '', C_lf_buffer ], [ '', C_lf_buffer ], [ '', C_lf_buffer ] ] ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], [ [ 'line   ', C_lf_buffer ], [ 'with   ', C_lf_buffer ], [ 'trailing\t\t', C_lf_buffer ], [ 'whitespace　 ', C_empty_buffer ] ] ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ], [ [ 'line1', C_cr_buffer ], [ 'line2', C_cr_buffer ], [ 'line3', C_cr_buffer ] ] ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], [ [ 'line1', C_cr_buffer ], [ '', C_lf_buffer ], [ 'line2', C_cr_buffer ], [ '', C_lf_buffer ], [ 'line3', C_cr_buffer ], [ '', C_lf_buffer ] ] ]
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
        d = GUY.fs._walk_lines__advance buffer, first_idx
        result.push [ d.material.toString(), d.eol, ]
        first_idx = d.next_idx
      echo [ probe, result, ]
      T?.eq result, matcher
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_fs_walk_buffers = ( T, done ) ->
  GUY                 = require H.guy_path
  probes_and_matchers = [
    [ [ '../../../assets/a-few-words.txt', null ], "Ångström's\néclair\néclair's\néclairs\néclat\néclat's\nélan\nélan's\némigré\némigré's", null ]
    [ [ '../../../assets/datamill/empty-file.txt', null ], '', null ]
    [ [ '../../../assets/datamill/file-with-single-nl.txt', null ], '\n', null ]
    [ [ '../../../assets/datamill/file-with-3-lines-no-eofnl.txt', null ], '1\n2\n3', null ]
    [ [ '../../../assets/datamill/file-with-3-lines-with-eofnl.txt', null ], '1\n2\n3\n', null ]
    [ [ '../../../assets/datamill/windows-crlf.txt', null ], 'this\r\nfile\r\nwritten\r\non\r\nMS Notepad', null ]
    [ [ '../../../assets/datamill/mixed-usage.txt', null ], 'all\r𠀀bases\r\rare belong\r\n𠀀to us\n', null ]
    [ [ '../../../assets/datamill/all-empty-mixed.txt', null ], '\r\r\n\r\n\n\n', null ]
    [ [ '../../../assets/datamill/lines-with-trailing-spcs.txt', null ], 'line   \nwith   \ntrailing\t\t\nwhitespace　 ', null ]
    [ [ '../../../assets/datamill/lines-with-lf.txt', null ], 'line1\rline2\rline3\r', null ]
    [ [ '../../../assets/datamill/lines-with-crlf.txt', null ], 'line1\r\nline2\r\nline3\r\n', null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      for chunk_size in [ 1 .. 200 ] by +10
        result    = []
        [ path ]  = probe
        path      = PATH.resolve PATH.join __dirname, path
        for buffer from GUY.fs.walk_buffers path, { chunk_size, }
          T?.eq ( type_of buffer ), 'buffer'
          T?.ok buffer.length <= chunk_size
          result.push buffer
        result = Buffer.concat result
        T?.eq result.length, ( FS.statSync path ).size
        result = result.toString()
      T?.eq ( Buffer.compare ( Buffer.concat [ ( GUY.fs.walk_buffers path )..., ] ), ( FS.readFileSync path ) ), 0
      resolve result
  #.........................................................................................................
  done?()
  return null

#-----------------------------------------------------------------------------------------------------------
@GUY_fs_walk_buffers_walk_lines_reject_chunk_size_lt_1 = ( T, done ) ->
  GUY                 = require H.guy_path
  path                = PATH.resolve PATH.join __dirname, '../../../assets/a-few-words.txt'
  exhaust             = ( g ) -> _ for _ from g; return null
  for chunk_size in [ -10000, -1, 0, ]
    T?.throws /not a valid .*chunk_size/, -> exhaust GUY.fs.walk_buffers  path, { chunk_size, }
    T?.throws /not a valid .*chunk_size/, -> exhaust GUY.fs.walk_lines    path, { chunk_size, }
  #.........................................................................................................
  done?()
  return null




############################################################################################################
if require.main is module then do =>
  # @GUY_fs__walk_lines_with_positions()
  # test @GUY_fs__walk_lines_with_positions
  # test @GUY_fs__walk_lines__walk_advancements
  # @GUY_str_walk_lines_with_positions()
  # test @GUY_str_walk_lines_with_positions
  # test @GUY_fs_walk_lines_with_positions
  # test @GUY_fs_walk_lines_with_positions_no_encoding
  test @
  # test @GUY_fs_walk_lines
  # @GUY_str_walk_lines()
  # test @GUY_str_walk_lines
  # @GUY_fs__walk_lines__advance()
  # test @GUY_fs__walk_lines__advance
  # @GUY_fs_walk_buffers()
  # test @GUY_fs_walk_buffers
  # test @GUY_fs_walk_buffers_walk_lines_reject_chunk_size_lt_1




