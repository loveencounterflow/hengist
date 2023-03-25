
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
    [ '*abc*', '<i>abc</i>\n', null ]
    [ '*abc*\n*abc*', '<i>abc</i>\n<i>abc</i>\n', null ]
    [ '*abc*\n\n*abc*', '<i>abc</i>\n\n<i>abc</i>\n', null ]
    [ '**def**', '<b>def</b>\n', null ]
    [ '**x*def*x**', '<b>x<i>def</i>x</b>\n', null ]
    [ '*x**def**x*', '<i>x<b>def</b>x</i>\n', null ]
    [ '***abc*def**', '<b><i>abc</i>def</b>\n', null ]
    [ '*x***def**', '<i>x</i><b>def</b>\n', null ]
    [ '**x***def*', '<b>x</b><i>def</i>\n', null ]
    [ '*', '<i>\n', null ]
    [ '**', '<b>\n', null ]
    [ '***', '<b><i>\n', null ]
    [ '***def***', '<b><i>def</i></b>\n', null ]
    [ '***abc**def*', '<b><i>abc</i></b><i>def</i>\n', null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new Hypedown_lexer()
      parser      = new $040_stars()
      tokens      = []
      for d from lexer.walk probe
        parser.send d
        for token from parser.walk()
          debug '^345^', ( rpr token.value )
          tokens.push token
      # p           = new Hypedown_parser()
      # p.send probe
      # result      = p.run()
      result_html = ( t.value for t in tokens when not t.$stamped ).join ''
      H.tabulate "#{rpr probe} -> #{rpr result_html}", tokens
      H.tabulate "#{rpr probe} -> #{rpr result_html}", ( t for t in tokens when not t.$stamped )
      #.....................................................................................................
      resolve result_html
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


#===========================================================================================================
#
#-----------------------------------------------------------------------------------------------------------
@add_parbreak_markers = ( T, done ) ->
  { Pipeline
    Transformer     } = require '../../../apps/hypedown'
  { Hypedown_lexer      } = require '../../../apps/hypedown'
  XXX_TEMP                = require '../../../apps/hypedown/lib/_hypedown-parser-xxx-temp'
  probes_and_matchers = [
    [ '', '⏎', null ]
    [ 'paragraph', '【paragraph】⏎', null ]
    [ 'par1 lnr 1\npar1 lnr 2', '【par1 lnr 1⏎par1 lnr 2】⏎', null ]
    [ 'par1 lnr 1\n\n\n\npar2 lnr 1', '【par1 lnr 1】⏎⏎⏎⏎【par2 lnr 1】⏎', null ]
    [ 'par1 lnr 1\n\npar2 lnr 1', '【par1 lnr 1】⏎⏎【par2 lnr 1】⏎', null ]
    [ 'par1 lnr 1\n\npar2 lnr 1\n', '【par1 lnr 1】⏎⏎【par2 lnr 1】⏎⏎', null ]
    [ 'par1 lnr 1\n\npar2 lnr 1\n\n', '【par1 lnr 1】⏎⏎【par2 lnr 1】⏎⏎⏎', null ]
    ]
  #.........................................................................................................
  new_parser = ( lexer ) ->
    class Md_parser extends Transformer
      $: [
        XXX_TEMP.$001_prelude
        XXX_TEMP.$002_tokenize_lines
        XXX_TEMP.$010_prepare_paragraphs ]
    return Md_parser.as_pipeline()
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      parser      = new_parser()
      tokens      = []
      result      = []
      #.....................................................................................................
      handle_token = ( token ) ->
        tokens.push token
        return if token.data?.virtual is true
        switch token.mk
          when 'html:par:start' then result.push '【'
          when 'html:par:stop'  then result.push '】'
          when 'plain:nls'      then result.push '⏎'.repeat token.data.count
          when 'plain:other'    then result.push token.value
      #.....................................................................................................
      # for line from GUY.str.walk_lines probe
      parser.send probe
      handle_token token for token from parser.walk_and_stop()
      result_html = result.join ''
      H.tabulate "#{rpr probe} -> #{rpr result_html}", tokens
      H.tabulate "#{rpr probe} -> #{rpr result_html}", ( t for t in tokens when not t.$stamped )
      #.....................................................................................................
      resolve result_html
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@parse_headings = ( T, done ) ->
  { Pipeline
    Transformer         } = require '../../../apps/hypedown'
  { Hypedown_lexer      } = require '../../../apps/hypedown'
  XXX_TEMP                = require '../../../apps/hypedown/lib/_hypedown-parser-xxx-temp'
  probes_and_matchers = [
    [ '# H1', '<h1>H1</h1>\n', null ]
    [ "x # H1", "x # H1\n", ]
    [ "x\n# H1", "x\n# H1\n", ]
    [ "not a\n# heading", 'not a\n# heading\n', ]
    [ 'x', 'x\n', null ]
    [ "x\n\n# H1", "x\n\n<h1>H1</h1>\n", ]
    [ "# Section", "<h1>Section</h1>\n", ]
    [ "## Section", "<h2>Section</h2>\n", ]
    [ "### Section", "<h3>Section</h3>\n", ]
    [ "#### Section", "<h4>Section</h4>\n", ]
    [ "##### Section", "<h5>Section</h5>\n", ]
    [ "###### Section", "<h6>Section</h6>\n", ]
    [ "#### Amazing\nLong\nHeadlines!!!", "<h4>Amazing\nLong\nHeadlines!!!</h4>\n", ]
    [ "paragraph 1\n\n\n\nparagraph 2", 'paragraph 1\n\n\n\nparagraph 2\n', ]
    [ "\n# H1", "\n<h1>H1</h1>\n", ]
    [ "\n\nx\n\n\n\n", 'not a\nheading\n', ]
    [ '', '\n', ]
    ]
  #.........................................................................................................
  class Md_parser extends Transformer
    $: [
      XXX_TEMP.$001_prelude
      XXX_TEMP.$002_tokenize_lines
      XXX_TEMP.$010_prepare_paragraphs
      XXX_TEMP.$050_hash_headings ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      parser      = Md_parser.as_pipeline()
      tokens      = []
      parser.send probe
      for token from parser.walk_and_stop()
        # debug '^345^', ( rpr token.value )
        tokens.push token
      # p           = new Hypedown_parser()
      # p.send probe
      # result      = p.run()
      result_html = ( t.value for t in tokens when not t.$stamped ).join ''
      H.tabulate "#{rpr probe} -> #{rpr result_html}", tokens
      H.tabulate "#{rpr probe} -> #{rpr result_html}", ( t for t in tokens when not t.$stamped )
      #.....................................................................................................
      resolve result_html
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@newline_handling = ( T, done ) ->
  { Pipeline
    Transformer     } = require '../../../apps/hypedown'
  { Hypedown_lexer      } = require '../../../apps/hypedown'
  XXX_TEMP                = require '../../../apps/hypedown/lib/_hypedown-parser-xxx-temp'
  probes_and_matchers = [
    [ '', '⏎', null ]
    [ '\n', '⏎⏎', null ]
    [ '\n\n', '⏎⏎⏎', null ]
    [ '\n\n\n', '⏎⏎⏎⏎', null ]
    [ '\n\n\n\n', '⏎⏎⏎⏎⏎', null ]
    [ '\n\n\n\n\nxxxxx', '⏎⏎⏎⏎⏎|【|xxxxx|】|⏎', null ]
    [ '\n# H1', '⏎|【|<h1>|H1|</h1>|】|⏎', null ]
    ]
  #.........................................................................................................
  class Md_parser extends Transformer
    $: [
      XXX_TEMP.$001_prelude
      XXX_TEMP.$002_tokenize_lines
      XXX_TEMP.$010_prepare_paragraphs
      XXX_TEMP.$050_hash_headings ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      parser      = Md_parser.as_pipeline()
      tokens      = []
      result      = []
      #.....................................................................................................
      handle_token = ( token ) ->
        tokens.push token
        return if token.$stamped
        switch token.mk
          when 'html:par:start' then  result.push '【'
          when 'html:par:stop'  then  result.push '】'
          when 'plain:nls'      then  result.push '⏎'.repeat token.data.count
          else                        result.push token.value
      #.....................................................................................................
      # for line from GUY.str.walk_lines probe
      parser.send probe
      for token from parser.walk_and_stop()
        tokens.push token
        handle_token token
      result = result.join '|'
      # H.tabulate "#{rpr probe} -> #{rpr result}", tokens
      # H.tabulate "#{rpr probe} -> #{rpr result}", ( t for t in tokens when not t.$stamped )
      #.....................................................................................................
      resolve result
  #.........................................................................................................
  done?()


############################################################################################################
if require.main is module then do =>
  # test @
  # test @parse_codespans_and_single_star
  # test @parse_codespans_with_whitespace
  # @parse_md_stars_markup()
  # test @parse_md_stars_markup
  # test @parse_headings
  # @add_parbreak_markers()
  # test @add_parbreak_markers
  test @newline_handling
  # @_add_parbreak_markers_OLD()
  # test @_add_parbreak_markers_OLD

