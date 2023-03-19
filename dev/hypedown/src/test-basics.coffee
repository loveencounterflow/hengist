
'use strict'


############################################################################################################
GUY                       = require 'guy'
{ alert
  debug
  help
  info
  plain
  praise
  urge
  warn
  whisper }               = GUY.trm.get_loggers 'HYPEDOWN/TESTS/BASICS'
{ rpr
  inspect
  echo
  log     }               = GUY.trm
#...........................................................................................................
test                      = require '../../../apps/guy-test'
types                     = new ( require 'intertype' ).Intertype
{ isa
  equals
  type_of
  validate
  validate_list_of }      = types.export()
H                         = require './helpers'
# after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@parse_md_stars_markup = ( T, done ) ->
  { Hypedown_lexer  } = require '../../../apps/hypedown'
  { $040_stars      } = require '../../../apps/hypedown/lib/_hypedown-parser-xxx-temp'
  probes_and_matchers = [
    [ '*abc*', '<p><i>abc</i>\n', null ]
    [ '*abc*\n*abc*', '<p><i>abc</i>\n<i>abc</i>\n', null ]
    [ '*abc*\n\n*abc*', '<p><i>abc</i>\n\n<p><i>abc</i>\n', null ]
    [ '**def**', '<p><b>def</b>\n', null ]
    [ '**x*def*x**', '<p><b>x<i>def</i>x</b>\n', null ]
    [ '*x**def**x*', '<p><i>x<b>def</b>x</i>\n', null ]
    [ '***abc*def**', '<p><b><i>abc</i>def</b>\n', null ]
    [ '*x***def**', '<p><i>x</i><b>def</b>\n', null ]
    [ '**x***def*', '<p><b>x</b><i>def</i>\n', null ]
    [ '*', '<p><i>\n', null ]
    [ '**', '<p><b>\n', null ]
    [ '***', '<p><b><i>\n', null ]
    [ '***def***', '<p><b><i>def</i></b>\n', null ]
    [ '***abc**def*', '<p><b><i>abc</i></b><i>def</i>\n', null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    # await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
    lexer       = new Hypedown_lexer()
    parser      = new $040_stars()
    for d from lexer.walk probe
      parser.send d
      for token from parser.walk()
        debug '^345^', ( rpr token.value )
    # p           = new Hypedown_parser()
    # p.send probe
    # result      = p.run()
    # result_html = ( d.value for d in result when not d.$stamped ).join ''
    # H.tabulate "#{rpr probe} -> #{rpr result_html}", result
    # H.tabulate "#{rpr probe} -> #{rpr result_html}", ( t for t in result when not t.$stamped )
    #.....................................................................................................
    # resolve result_html
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@parse_codespans_and_single_star = ( T, done ) ->
  { XXX_new_token
    Hypedown_lexer
    Hypedown_parser } = require '../../../apps/hypedown'
  probes_and_matchers = [
    [ "`abc`", "<p><code>abc</code>\n", ]
    [ "*abc*", "<p><i>abc</i>\n", ]
    [ '*foo* `*bar*` baz', '<p><i>foo</i> <code>*bar*</code> baz\n', null ]
    [ '*foo* ``*bar*`` baz', '<p><i>foo</i> <code>*bar*</code> baz\n', null ]
    [ '*foo* ````*bar*```` baz', '<p><i>foo</i> <code>*bar*</code> baz\n', null ]
    [ 'helo `world`!', '<p>helo <code>world</code>!\n', null ]
    [ 'foo\n\nbar\n\nbaz', '<p>foo\n\n<p>bar\n\n<p>baz\n', null ]
    [ '*foo* ``*bar*``` baz', '<p><i>foo</i> \n', null ] ### TAINT preliminary, lack of STOP token ###
    [ '*foo* ```*bar*`` baz', '<p><i>foo</i> \n', null ] ### TAINT preliminary, lack of STOP token ###
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      p           = new Hypedown_parser()
      # H.tabulate ( rpr 'helo'   ), p.lexer.run 'helo'
      # H.tabulate ( rpr '`helo`' ), p.lexer.run '`helo`'
      # H.tabulate ( rpr '*helo*' ), p.lexer.run '*helo*'
      # for mode, entry of p.lexer.registry
      #   # debug '^2325687^', entry
      #   for tid, lexeme of entry.lexemes
      #     urge '^2325687^', "#{lexeme.mode}:#{lexeme.tid}"
      # process.exit 111
      for line from GUY.str.walk_lines probe
        p.send line
      result      = p.run()
      result_txt  = ( d.value for d in result when not d.$stamped ).join ''
      # urge '^08-1^', ( Object.keys d ).sort() for d in result
      # H.tabulate "#{rpr probe} -> #{rpr result_txt} (#{rpr matcher})", result
      H.tabulate "#{rpr probe} -> #{rpr result_txt} (#{rpr matcher})", ( t for t in result when not t.$stamped )
      resolve result_txt
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@parse_codespans_with_whitespace = ( T, done ) ->
  { XXX_new_token
    Hypedown_lexer
    Hypedown_parser } = require '../../../apps/hypedown'
  probes_and_matchers = [
    [ "`` `abc` ``", "<p><code>`abc`</code>\n", ]
    [ "`` `abc\\` ``", "<p><code>`abc`</code>\n", ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      p           = new Hypedown_parser()
      # H.tabulate ( rpr 'helo'   ), p.lexer.run 'helo'
      # H.tabulate ( rpr '`helo`' ), p.lexer.run '`helo`'
      # H.tabulate ( rpr '*helo*' ), p.lexer.run '*helo*'
      # for mode, entry of p.lexer.registry
      #   # debug '^2325687^', entry
      #   for tid, lexeme of entry.lexemes
      #     urge '^2325687^', "#{lexeme.mode}:#{lexeme.tid}"
      # process.exit 111
      for line from GUY.str.walk_lines probe
        p.send line
      result      = p.run()
      result_txt  = ( d.value for d in result when not d.$stamped ).join ''
      # urge '^08-1^', ( Object.keys d ).sort() for d in result
      # H.tabulate "#{rpr probe} -> #{rpr result_txt} (#{rpr matcher})", result
      # H.tabulate "#{rpr probe} -> #{rpr result_txt} (#{rpr matcher})", ( t for t in result when not t.$stamped )
      resolve result_txt
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@parse_headings = ( T, done ) ->
  { XXX_new_token
    Hypedown_lexer
    Hypedown_parser } = require '../../../apps/hypedown'
  probes_and_matchers = [
    [ "# H1", "<h1>H1</h1>\n", ]
    # [ "\n# H1", "\n<h1>H1\n", ]
    # [ "## Section", "<h2>Section\n", ]
    # [ "not a\n# heading", 'not a\n# heading\n', ]
    # [ 'x', 'x\n', null ]
    # [ "\n\nx\n\n\n\n", 'not a\nheading\n', ]
    # [ "paragraph 1\n\n\n\nparagraph 2", 'not a\nheading\n', ]
    # [ '', '', ]
    # [ "\n", 'not a\nheading\n', ]
    # [ "\n\nnot a\nheading", 'not a\nheading\n', ]
    ]
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      p           = new Hypedown_parser()
      for { lnr, line, eol, } from GUY.str.walk_lines_with_positions probe
        debug '^'
        p.send line
      result      = p.run()
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      # urge '^08-1^', ( Object.keys d ).sort() for d in result
      H.tabulate "#{rpr probe} -> #{rpr result_rpr} (#{rpr matcher})", result # unless result_rpr is matcher
      resolve result_rpr
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # test @
  # test @parse_codespans_and_single_star
  # test @parse_codespans_with_whitespace
  @parse_md_stars_markup()
  # test @parse_md_stars_markup
  # @parse_headings()
  # test @parse_headings

