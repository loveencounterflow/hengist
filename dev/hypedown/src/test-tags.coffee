
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
  whisper }               = GUY.trm.get_loggers 'HYPEDOWN/TESTS/TAGS'
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


#-----------------------------------------------------------------------------------------------------------
new_parser = ( lexer ) ->
  { Pipeline
    transforms  } = require '../../../apps/moonriver'
  _HTMLISH        = ( require 'paragate/lib/htmlish.grammar' ).new_grammar { bare: true, }
  htmlish_sym     = Symbol 'htmlish'
  #.........................................................................................................
  $tokenize     = ( parser ) ->
    return tokenize = ( line, send ) ->
      @types.validate.text line
      send token for token from parser.lexer.walk line
      return null
  #.........................................................................................................
  $_hd_token_from_paragate_token = ->
    return _hd_token_from_paragate_token = ( d, send ) ->
      return send d unless d[htmlish_sym]?
      first = d.$collector.at  0
      last  = d.$collector.at -1
      # delete d.$collector; H.tabulate "htmlish", [ d, ]
      #.....................................................................................................
      #
      # * otag      opening tag, `<a>`
      # * ctag      closing tag, `</a>` or `</>`
      #
      # * ntag      opening tag of `<i/italic/`
      # * nctag     closing slash of `<i/italic/`
      #
      # * stag      self-closing tag, `<br/>`
      #
      tag_types =
        otag:       { open: true,  close: false, }
        ctag:       { open: false, close: true,  }
        ntag:       { open: true,  close: false, }
        nctag:      { open: false, close: true,  }
        stag:       { open: true,  close: true,  }
      #.....................................................................................................
      e     =
        mode:   'tag'
        tid:    d.type
        mk:     "tag:#{d.type}"
        jump:   null
        value:  d.$source
        ### TAINT must give first_lnr, last_lnr ###
        lnr:    first.lnr
        start:  first.start
        stop:   last.stop
        x:
          atrs:   d.atrs
          id:     d.id
        source: null
        $key:   '^tag'
      send e
    return null
  #.........................................................................................................
  $parse_htmlish_tag  = ->
    collector   = []
    within_tag  = false
    sp          = new Pipeline()
    sp.push transforms.$window { min: 0, max: +1, empty: null, }
    sp.push parse_htmlish_tag = ( [ d, nxt, ], send ) ->
      #.....................................................................................................
      if within_tag
        collector.push d
        # debug '^parse_htmlish_tag@1^', d
        if d.jump is 'plain' ### TAINT magic number ###
          within_tag  = false
          $source     = ( e.value for e from collector ).join ''
          $collector  = [ collector..., ]
          send stamp collector.shift() while collector.length > 0
          htmlish     = _HTMLISH.parse $source
          # H.tabulate '^78^', htmlish
          # debug '^78^', rpr $source
          # info '^78^', x for x in htmlish
          unless htmlish.length is 1
            ### TAINT use API to create token ###
            # throw new Error "^34345^ expected single token, got #{rpr htmlish}"
            return send { mode: 'tag', tid: '$error', }
          [ htmlish ]           = GUY.lft.thaw htmlish
          htmlish[htmlish_sym]  = true
          htmlish.$collector    = $collector
          htmlish.$source       = $source
          send htmlish
        return null
      #.....................................................................................................
      else
        return send d unless nxt?.mk.startsWith 'tag:'
        within_tag = true
        collector.push d
      #.....................................................................................................
      return null
    sp.push $_hd_token_from_paragate_token()
    return sp
  #.........................................................................................................
  p             = new Pipeline()
  p.lexer       = lexer
  p.push $tokenize p
  p.push $parse_htmlish_tag()
  # p.push show = ( d ) -> urge '^parser@1^', d
  # debug '^43^', p
  return p

#-----------------------------------------------------------------------------------------------------------
@tags_1 = ( T, done ) ->
  #.........................................................................................................
  probes_and_matchers = [
    [ 'foo <!-- comment --> bar', [ { mk: 'plain:other', value: 'foo ' }, { mk: 'plain:ltbang', value: '<!--' }, { mk: 'comment:text', value: ' comment ' }, { mk: 'comment:eoc', value: '-->' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:other', value: 'bar' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'foo <!-- comment \n --> bar', [ { mk: 'plain:other', value: 'foo ' }, { mk: 'plain:ltbang', value: '<!--' }, { mk: 'comment:text', value: ' comment' }, { mk: 'comment:nl', value: '\n' }, { mk: 'comment:text', value: ' ' }, { mk: 'comment:eoc', value: '-->' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:other', value: 'bar' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'foo <!-- comment \\\n --> bar', [ { mk: 'plain:other', value: 'foo ' }, { mk: 'plain:ltbang', value: '<!--' }, { mk: 'comment:text', value: ' comment ' }, { mk: 'comment:escchr', value: '\\', x: { chr: '\n' } }, { mk: 'comment:nl', value: '\n' }, { mk: 'comment:text', value: ' ' }, { mk: 'comment:eoc', value: '-->' }, { mk: 'plain:ws', value: ' ' }, { mk: 'plain:other', value: 'bar' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo=bar>xyz', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=bar' }, { mk: 'tag:gt', value: '>' }, { mk: 'plain:other', value: 'xyz' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo=bar/>xyz', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=bar' }, { mk: 'tag:slashgt', value: '/>' }, { mk: 'plain:other', value: 'xyz' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo=bar/xyz/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=bar' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:other', value: 'xyz' }, { mk: 'plain:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo="bar>xyz"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar>xyz' }, { mk: 'tag:dq:dq', value: '"' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo="bar/>xyz"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar/>xyz' }, { mk: 'tag:dq:dq', value: '"' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo="bar/xyz"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar/xyz' }, { mk: 'tag:dq:dq', value: '"' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ "abc<div#c1 foo='bar>xyz'/", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:sq', value: "'" }, { mk: 'tag:sq:text', value: 'bar>xyz' }, { mk: 'tag:sq:sq', value: "'" }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ "abc<div#c1 foo='bar/>xyz'/", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:sq', value: "'" }, { mk: 'tag:sq:text', value: 'bar/>xyz' }, { mk: 'tag:sq:sq', value: "'" }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ "abc<div#c1 foo='bar/xyz'/", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:sq', value: "'" }, { mk: 'tag:sq:text', value: 'bar/xyz' }, { mk: 'tag:sq:sq', value: "'" }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ "abc<div#c1 foo='bar/xyz'/>", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:sq', value: "'" }, { mk: 'tag:sq:text', value: 'bar/xyz' }, { mk: 'tag:sq:sq', value: "'" }, { mk: 'tag:slashgt', value: '/>' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<i/>xyz/>', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'i' }, { mk: 'tag:slashgt', value: '/>' }, { mk: 'plain:other', value: 'xyz' }, { mk: 'plain:slash', value: '/' }, { mk: 'plain:other', value: '>' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ 'abc<i/xyz/>', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'i' }, { mk: 'tag:slash', value: '/' }, { mk: 'plain:other', value: 'xyz' }, { mk: 'plain:slash', value: '/' }, { mk: 'plain:other', value: '>' }, { mk: 'plain:nl', value: '\n' } ], null ]
    [ """abc<div#c1 foo="bar>xyz'/""", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: "bar>xyz'/" }, { mk: 'tag:dq:nl', value: '\n' } ], null ]
    [ """abc<div#c1 foo="bar/>xyz'/""", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: "bar/>xyz'/" }, { mk: 'tag:dq:nl', value: '\n' } ], null ]
    [ """abc<div#c1 foo="bar/xyz'/""", [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: "bar/xyz'/" }, { mk: 'tag:dq:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo="bar>xyz\\"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar>xyz' }, { mk: 'tag:dq:escchr', value: '\\"', x: { chr: '"' } }, { mk: 'tag:dq:text', value: '/' }, { mk: 'tag:dq:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo="bar/>xyz\\"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar/>xyz' }, { mk: 'tag:dq:escchr', value: '\\"', x: { chr: '"' } }, { mk: 'tag:dq:text', value: '/' }, { mk: 'tag:dq:nl', value: '\n' } ], null ]
    [ 'abc<div#c1 foo="bar/xyz\\"/', [ { mk: 'plain:other', value: 'abc' }, { mk: 'plain:lt', value: '<' }, { mk: 'tag:text', value: 'div#c1 foo=' }, { mk: 'tag:dq', value: '"' }, { mk: 'tag:dq:text', value: 'bar/xyz' }, { mk: 'tag:dq:escchr', value: '\\"', x: { chr: '"' } }, { mk: 'tag:dq:text', value: '/' }, { mk: 'tag:dq:nl', value: '\n' } ], null ]
    ]
  #.........................................................................................................
  { Hypedown_lexer } = require '../../../apps/hypedown'
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      # lexer   = new_tag_lexer()
      lexer   = new Hypedown_lexer()
      result  = []
      for token from lexer.walk probe
        d = GUY.props.omit_nullish GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x'
        result.push d
      # H.tabulate ( rpr probe ), result
      resolve result
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@tags_2 = ( T, done ) ->
  #.........................................................................................................
  probes_and_matchers = [
    [ 'abc<div#c1 foo=bar/xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:slash'/',tag:ntag'<div#c1 foo=bar/',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
    [ 'abc<div#c1\nfoo=bar/xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:slash'/',tag:ntag'<div#c1\\nfoo=bar/',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
    [ 'abc<div#c1 foo=bar>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:gt'>',tag:otag'<div#c1 foo=bar>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
    [ 'abc<div#c1\nfoo=bar>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:gt'>',tag:otag'<div#c1\\nfoo=bar>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
    [ 'abc<div#c1 foo=bar/>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:slashgt'/>',tag:stag'<div#c1 foo=bar/>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
    [ 'abc<div#c1\nfoo=bar/>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:slashgt'/>',tag:stag'<div#c1\\nfoo=bar/>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
    ]
  #.........................................................................................................
  { Hypedown_lexer } = require '../../../apps/hypedown'
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new Hypedown_lexer()
      parser      = new_parser lexer
      result      = []
      result_rpr  = []
      for line from GUY.str.walk_lines probe
        parser.send line
        for token from parser.walk()
          # token = GUY.props.omit_nullish GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x'
          result.push token
          result_rpr.push "#{token.mk}#{rpr token.value}"
      # H.tabulate ( rpr probe ), result
      resolve result_rpr.join ','
      # resolve null
  #.........................................................................................................
  done?()

# #-----------------------------------------------------------------------------------------------------------
# @_tags_2_for_profiling = ( T, done ) ->
#   #.........................................................................................................
#   probes_and_matchers = [
#     [ 'abc<div#c1 foo=bar/xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:slash'/',tag:ntag'<div#c1 foo=bar/',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
#     [ 'abc<div#c1\nfoo=bar/xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:slash'/',tag:ntag'<div#c1\\nfoo=bar/',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
#     [ 'abc<div#c1 foo=bar>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:gt'>',tag:otag'<div#c1 foo=bar>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
#     [ 'abc<div#c1\nfoo=bar>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:gt'>',tag:otag'<div#c1\\nfoo=bar>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
#     [ 'abc<div#c1 foo=bar/>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1 foo=bar',tag:slashgt'/>',tag:stag'<div#c1 foo=bar/>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
#     [ 'abc<div#c1\nfoo=bar/>xyz/', "plain:other'abc',plain:lt'<',tag:text'div#c1',tag:nl'\\n',tag:text'foo=bar',tag:slashgt'/>',tag:stag'<div#c1\\nfoo=bar/>',plain:other'xyz',plain:slash'/',plain:nl'\\n'", null ]
#     ]
#   #.........................................................................................................
#   for [ probe, matcher, error, ] in probes_and_matchers
#     lexer       = new_tag_lexer()
#     parser      = new_parser lexer
#     for _ in [ 1 .. 100 ]
#     # for _ in [ 1 ]
#       result      = []
#       result_rpr  = []
#       for line from GUY.str.walk_lines probe
#         parser.send line
#         for token from parser.walk()
#           # token = GUY.props.omit_nullish GUY.props.pick_with_fallback token, null, 'mk', 'value', 'x'
#           result.push token
#           result_rpr.push "#{token.mk}#{rpr token.value}"
#       urge '^34-1^', Date.now(), result_rpr
#       # H.tabulate ( rpr probe ), result
#   #.........................................................................................................
#   done?()

#-----------------------------------------------------------------------------------------------------------
@htmlish_tag_types = ( T, done ) ->
  _HTMLISH        = ( require 'paragate/lib/htmlish.grammar' ).new_grammar { bare: true, }
  #.........................................................................................................
  probes_and_matchers = [
    [ '<a>', [ "otag'<a>'" ], null ]
    [ '<a b=c>', [ "otag'<a b=c>'" ], null ]
    [ '<a b=c/>', [ "stag'<a b=c/>'" ], null ]
    [ '<a b=c/', [ "ntag'<a b=c/'" ], null ]
    [ '</a>', [ "ctag'</a>'" ], null ]
    [ '<br>', [ "otag'<br>'" ], null ]
    [ '<br/>', [ "stag'<br/>'" ], null ]
    [ '<i/italic/', [ "ntag'<i/'", "undefined'italic'", "nctag'/'" ], null ]
    [ '<i>italic</>', [ "otag'<i>'", "undefined'italic'", "ctag'</>'", "undefined'>'" ], null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      result      = _HTMLISH.parse probe
      result_rpr  = ( "#{token.type}#{rpr token.text}" for token in result )
      # H.tabulate ( rpr probe ), result
      resolve result_rpr
      # resolve undefined
  #.........................................................................................................
  done?()

#-----------------------------------------------------------------------------------------------------------
@xncrs = ( T, done ) ->
  { Hypedown_lexer } = require '../../../apps/hypedown'
  probes_and_matchers = [
    [ '&amp', "plain:forbidden'&',plain:other'amp',plain:nl'\\n'", null ]
    [ '&amp what', "plain:forbidden'&',plain:other'amp what',plain:nl'\\n'", null ]
    [ '&amp\n', "plain:forbidden'&',plain:other'amp',plain:nl'\\n',plain:nl'\\n'", null ]
    [ '&amp;', "plain:amp'&',xncr:name'amp',xncr:sc';',plain:nl'\\n'", null ]
    [ '&amp\\;', "plain:forbidden'&',plain:other'amp',plain:escchr'\\\\;',plain:nl'\\n'", null ]
    [ '&amp;\n', "plain:amp'&',xncr:name'amp',xncr:sc';',plain:nl'\\n',plain:nl'\\n'", null ]
    [ '&xamp;', "plain:amp'&',xncr:name'xamp',xncr:sc';',plain:nl'\\n'", null ]
    [ '&123;', "plain:amp'&',xncr:name'123',xncr:sc';',plain:nl'\\n'", null ]
    [ '&x123;', "plain:amp'&',xncr:name'x123',xncr:sc';',plain:nl'\\n'", null ]
    [ '&#123;', "plain:amp'&',xncr:dec'#123',xncr:sc';',plain:nl'\\n'", null ]
    [ '&#x123;', "plain:amp'&',xncr:hex'#x123',xncr:sc';',plain:nl'\\n'", null ]
    [ '&jzr#123;', "plain:amp'&',xncr:csg'jzr',xncr:dec'#123',xncr:sc';',plain:nl'\\n'", null ]
    [ 'some <b/&jzr#x123;&jzr#x124;/ text', "plain:other'some ',plain:lt'<',tag:text'b',tag:slash'/',plain:amp'&',xncr:csg'jzr',xncr:hex'#x123',xncr:sc';',plain:amp'&',xncr:csg'jzr',xncr:hex'#x124',xncr:sc';',plain:slash'/',plain:ws' ',plain:other'text',plain:nl'\\n'", null ]
    ]
  #.........................................................................................................
  for [ probe, matcher, error, ] in probes_and_matchers
    await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
      lexer       = new Hypedown_lexer()
      result      = []
      for token from lexer.walk probe
        result.push token
      H.tabulate ( rpr probe ), result
      result_rpr = ( "#{token.mk}#{rpr token.value}" for token in result ).join ','
      # info '^94-1^', result_rpr
      resolve result_rpr
  #.........................................................................................................
  done?()



############################################################################################################
if require.main is module then do =>
  # test @
  # test @tags_1
  test @tags_2
  # @_tags_2_for_profiling()
  # test @htmlish_tag_types
  # test @xncrs
  # test @parse_codespans_and_single_star
  # test @parse_md_stars_markup

