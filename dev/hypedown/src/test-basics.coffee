
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
H                         = require '../../../lib/helpers'
# after                     = ( dts, f  ) => new Promise ( resolve ) -> setTimeout ( -> resolve f() ), dts * 1000
{ DATOM }                 = require '../../../apps/datom'
{ new_datom
  lets
  stamp     }             = DATOM


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
new_token = ( ref, token, mode, tid, name, value, start, stop, x = null, lexeme = null ) ->
  ### TAINT recreation of `Interlex::new_token()` ###
  jump      = lexeme?.jump ? null
  { start
    stop  } = token
  return new_datom "^#{mode}", { mode, tid, mk: "#{mode}:#{tid}", jump, name, value, start, stop, x, $: ref, }


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@parse_md_stars_markup = ( T, done ) ->
  { XXX_new_token
    Hypedown_lexer
    Hypedown_parser } = require '../../../apps/hypedown'
  probes_and_matchers = [
    [ "*abc*", "<i>abc</i>", ]
    [ "**def**", "<b>def</b>", ]
    [ "***def***", "<b><i>def</i></b>", ]
    [ "**x*def*x**", "<b>x<i>def</i>x</b>", ]
    [ "*x**def**x*", "<i>x<b>def</b>x</i>", ]
    [ "***abc*def**", "<b><i>abc</i>def</b>", ]
    [ "***abc**def*", "<b><i>abc</i></b><i>def</i>", ]
    [ "*x***def**", "<i>x</i><b>def</b>", ]
    [ "**x***def*", "<b>x</b><i>def</i>", ]
    [ "*", "<i>", ]
    [ "**", "<b>", ]
    [ "***", "<b><i>", ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      p           = new Hypedown_parser()
      p.send XXX_new_token '^æ19^', { start: 0, stop: probe.length, }, 'plain', 'p', null, probe
      result      = p.run()
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      # urge '^08-1^', ( Object.keys d ).sort() for d in result
      H.tabulate "#{probe} -> #{result_rpr} (#{matcher})", result # unless result_rpr is matcher
      #.....................................................................................................
      resolve result_rpr
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@parse_codespans_and_single_star = ( T, done ) ->
  { XXX_new_token
    Hypedown_lexer
    Hypedown_parser } = require '../../../apps/hypedown'
  probes_and_matchers = [
    [ "`abc`", "<code>abc</code>\n", ]
    [ "*abc*", "<i>abc</i>\n", ]
    # [ 'helo `world`!', 'helo <code>world</code>!\n', null ]
    # [ '*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz\n', null ]
    # [ '*foo* ``*bar*`` baz', '<i>foo</i> <code>*bar*</code> baz\n', null ]
    # [ '*foo* ````*bar*```` baz', '<i>foo</i> <code>*bar*</code> baz\n', null ]
    # [ '*foo* ``*bar*``` baz', '<i>foo</i> <code>*bar*``` baz\n', null ]
    # [ '*foo* ```*bar*`` baz', '<i>foo</i> <code>*bar*`` baz\n', null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      p           = new Hypedown_parser()
      H.tabulate ( rpr 'helo'   ), p.lexer.run 'helo'
      H.tabulate ( rpr '`helo`' ), p.lexer.run '`helo`'
      H.tabulate ( rpr '*helo*' ), p.lexer.run '*helo*'
      for mode, entry of p.lexer.registry
        # debug '^2325687^', entry
        for tid, lexeme of entry.lexemes
          urge '^2325687^', "#{lexeme.mode}:#{lexeme.tid}"
      process.exit 111
      for line from GUY.str.walk_lines probe
        p.send line
      result      = p.run()
      result_rpr  = ( d.value for d in result when not d.$stamped ).join ''
      # urge '^08-1^', ( Object.keys d ).sort() for d in result
      H.tabulate "#{probe} -> #{result_rpr} (#{matcher})", result # unless result_rpr is matcher
      resolve result_rpr
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@parse_headings = ( T, done ) ->
  { XXX_new_token
    Hypedown_lexer
    Hypedown_parser } = require '../../../apps/hypedown'
  probes_and_matchers = [
    # [ "# H1", "<h1>H1\n", ]
    # [ "\n# H1", "\n<h1>H1\n", ]
    # [ "## Section", "<h2>Section\n", ]
    # [ "not a\n# heading", 'not a\n# heading\n', ]
    # [ 'x', 'x\n', null ]
    # [ "\n\nx\n\n\n\n", 'not a\nheading\n', ]
    [ "paragraph 1\n\n\n\nparagraph 2", 'not a\nheading\n', ]
    # [ '', '', ]
    # [ "\n", 'not a\nheading\n', ]
    # [ "\n\nnot a\nheading", 'not a\nheading\n', ]
    ]
  #.........................................................................................................
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
  test @parse_codespans_and_single_star
  # test @parse_md_stars_markup
  # test @parse_headings

