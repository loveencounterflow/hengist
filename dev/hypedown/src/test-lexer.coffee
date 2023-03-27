
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
  whisper }               = GUY.trm.get_loggers 'HYPEDOWN/TESTS/LEXER'
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

#-----------------------------------------------------------------------------------------------------------
@lex_md_stars_markup = ( T, done ) ->
  { Hypedown_lexer  } = require '../../../apps/hypedown'
  probes_and_matchers = [
    [ '*abc*', "plain:star1'*',plain:other'abc',plain:star1'*'", null ]
    [ '*abc*\n*abc*', "plain:star1'*',plain:other'abc',plain:star1'*',plain:star1'*',plain:other'abc',plain:star1'*'", null ]
    [ '*abc*\n\n*abc*', "plain:star1'*',plain:other'abc',plain:star1'*',plain:star1'*',plain:other'abc',plain:star1'*'", null ]
    [ '**def**', "plain:star2'**',plain:other'def',plain:star2'**'", null ]
    [ '**x*def*x**', "plain:star2'**',plain:other'x',plain:star1'*',plain:other'def',plain:star1'*',plain:other'x',plain:star2'**'", null ]
    [ '*x**def**x*', "plain:star1'*',plain:other'x',plain:star2'**',plain:other'def',plain:star2'**',plain:other'x',plain:star1'*'", null ]
    [ '***abc*def**', "plain:star3'***',plain:other'abc',plain:star1'*',plain:other'def',plain:star2'**'", null ]
    [ '*x***def**', "plain:star1'*',plain:other'x',plain:star3'***',plain:other'def',plain:star2'**'", null ]
    [ '**x***def*', "plain:star2'**',plain:other'x',plain:star3'***',plain:other'def',plain:star1'*'", null ]
    [ '*', "plain:star1'*'", null ]
    [ '**', "plain:star2'**'", null ]
    [ '***', "plain:star3'***'", null ]
    [ '***def***', "plain:star3'***',plain:other'def',plain:star3'***'", null ]
    [ '***abc**def*', "plain:star3'***',plain:other'abc',plain:star2'**',plain:other'def',plain:star1'*'", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new Hypedown_lexer()
      tokens      = []
      for d from lexer.walk probe
        tokens.push d
      result = ( "#{t.mk}#{rpr t.value}" for t in tokens when t.mk isnt 'plain:nl' ).join ','
      # H.tabulate "#{rpr probe} -> #{rpr result}", tokens
      # H.tabulate "#{rpr probe} -> #{rpr result}", ( t for t in tokens when not t.$stamped )
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@lex_codespans_and_single_star = ( T, done ) ->
  { Hypedown_lexer  } = require '../../../apps/hypedown'
  probes_and_matchers = [
    [ '`', "c:$border'',c:start'`',c:nl'\\n'", null ]
    [ '``', "c:$border'',c:start'``',c:nl'\\n'", null ]
    [ '``````', "c:$border'',c:start'``````',c:nl'\\n'", null ]
    [ '`abc`', "c:$border'',c:start'`',c:text'abc',c:stop'`',p:$border'',p:nl'\\n'", null ]
    [ '*abc*', "p:other'*abc*',p:nl'\\n'", null ]
    [ '*foo* `*bar*` baz', "p:other'*foo* ',c:$border'',c:start'`',c:text'*bar*',c:stop'`',p:$border'',p:ws' ',p:other'baz',p:nl'\\n'", null ]
    [ '*foo* ``*bar*`` baz', "p:other'*foo* ',c:$border'',c:start'``',c:text'*bar*',c:stop'``',p:$border'',p:ws' ',p:other'baz',p:nl'\\n'", null ]
    [ '*foo* ````*bar*```` baz', "p:other'*foo* ',c:$border'',c:start'````',c:text'*bar*',c:stop'````',p:$border'',p:ws' ',p:other'baz',p:nl'\\n'", null ]
    [ 'helo `world`!', "p:other'helo ',c:$border'',c:start'`',c:text'world',c:stop'`',p:$border'',p:other'!',p:nl'\\n'", null ]
    [ 'foo\n\nbar\n\nbaz', "p:other'foo',p:nl'\\n',p:nl'\\n',p:other'bar',p:nl'\\n',p:nl'\\n',p:other'baz',p:nl'\\n'", null ]
    [ '*foo* ``*bar*``` baz', "p:other'*foo* ',c:$border'',c:start'``',c:text'*bar*',c:text'```',c:text' baz',c:nl'\\n'", null ]
    [ '*foo* ```*bar*`` baz', "p:other'*foo* ',c:$border'',c:start'```',c:text'*bar*',c:text'``',c:text' baz',c:nl'\\n'", null ]
    [ 'abc ``d e f g\nh`` xyz', "p:other'abc ',c:$border'',c:start'``',c:text'd e f g',c:nl'\\n',c:text'h',c:stop'``',p:$border'',p:ws' ',p:other'xyz',p:nl'\\n'", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer         = new Hypedown_lexer()
      tokens        = []
      short_tokens  = []
      for d from lexer.walk probe
        tokens.push d
        switch d.mode
          when 'plain' then short_tokens.push "p:#{d.tid}#{rpr d.value}"
          when 'cspan' then short_tokens.push "c:#{d.tid}#{rpr d.value}"
      result = short_tokens.join ','
      # H.tabulate "#{rpr probe} -> #{rpr result}", tokens
      # H.tabulate "#{rpr probe} -> #{rpr result}", ( t for t in tokens when not t.$stamped )
      resolve result
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then do =>
  # test @
  test @lex_codespans_and_single_star
