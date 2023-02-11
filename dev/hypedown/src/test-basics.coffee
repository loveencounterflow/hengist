
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
    [ "`abc`", "<code>abc</code>", ]
    [ "*abc*", "<i>abc</i>", ]
    [ 'helo `world`!', 'helo <code>world</code>!', null ]
    [ '*foo* `*bar*` baz', '<i>foo</i> <code>*bar*</code> baz', null ]
    [ '*foo* ``*bar*`` baz', '<i>foo</i> <code>*bar*</code> baz', null ]
    [ '*foo* ````*bar*```` baz', '<i>foo</i> <code>*bar*</code> baz', null ]
    [ '*foo* ``*bar*``` baz', '<i>foo</i> <code>*bar*``` baz', null ]
    [ '*foo* ```*bar*`` baz', '<i>foo</i> <code>*bar*`` baz', null ]
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
      resolve result_rpr
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@parse_headings = ( T, done ) ->
  { XXX_new_token
    Hypedown_lexer
    Hypedown_parser } = require '../../../apps/hypedown'
  probes_and_matchers = [
    [ "# H1", "<h1>H1</h1>", ]
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
      resolve result_rpr
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # test @
  # test @parse_codespans_and_single_star
  # test @parse_md_stars_markup
  test @parse_headings

